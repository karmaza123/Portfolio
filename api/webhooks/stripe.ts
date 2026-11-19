import type { SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { env } from "../_lib/env.js";
import { fail, json } from "../_lib/http.js";
import { billingStatusFor, fromUnix, PLAN_DEFAULTS, planForPrice } from "../_lib/plans.js";
import { adminClient } from "../_lib/supabase.js";

const id = (value: string | { id: string } | null | undefined): string | null =>
  typeof value === "string" ? value : (value?.id ?? null);

/**
 * Stripe -> Supabase sync. Point a webhook endpoint at /api/webhooks/stripe with these events:
 *   checkout.session.completed, invoice.paid, invoice.payment_failed,
 *   customer.subscription.updated, customer.subscription.deleted
 *
 * Link a purchase to a client by creating the Checkout Session / Payment Link with
 * `client_reference_id=<clients.id>`. Later events find the client by Stripe customer id.
 */
export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return fail(400, "Missing signature");

  // The signature covers the exact bytes Stripe sent, so read the body as raw text.
  const raw = await request.text();
  const stripe = new Stripe(env("STRIPE_SECRET_KEY"));

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, signature, env("STRIPE_WEBHOOK_SECRET"));
  } catch {
    return fail(400, "Invalid signature");
  }

  const admin = adminClient();

  // Stripe retries and occasionally double-delivers; apply each event once.
  const { data: seen } = await admin.from("stripe_events").select("id").eq("id", event.id).maybeSingle();
  if (seen) return json({ received: true, duplicate: true });

  try {
    await handle(event, stripe, admin);
  } catch (error) {
    console.error(`stripe webhook ${event.type} (${event.id}) failed`, error);
    return fail(500, "Handler failed"); // non-2xx makes Stripe retry
  }

  await admin.from("stripe_events").insert({ id: event.id, type: event.type });
  return json({ received: true });
}

async function handle(event: Stripe.Event, stripe: Stripe, admin: SupabaseClient): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
      return onCheckoutCompleted(event.data.object, stripe, admin);

    case "invoice.paid": {
      const invoice = event.data.object;
      const customer = id(invoice.customer);
      if (!customer) return;
      // Only a renewal starts a new month; the first invoice is handled by checkout above.
      if (invoice.billing_reason !== "subscription_cycle") return;
      // Only clients still on the retainer: someone who switched to a batch keeps their batch count.
      await update(admin, { stripe_customer_id: customer, plan_type: "subscription" }, {
        edits_used_this_month: 0,
        billing_status: "active",
        current_period_end: fromUnix(invoice.lines.data[0]?.period?.end),
      });
      return;
    }

    case "invoice.payment_failed": {
      const customer = id(event.data.object.customer);
      if (customer) await update(admin, { stripe_customer_id: customer }, { billing_status: "past_due" });
      return;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      // Match the subscription itself, not the customer: a client who moved from the retainer to a
      // batch must not have their new plan marked canceled when the old subscription ends.
      await update(admin, { stripe_subscription_id: sub.id }, {
        billing_status: event.type === "customer.subscription.deleted" ? "canceled" : billingStatusFor(sub.status),
        current_period_end: fromUnix(sub.items.data[0]?.current_period_end),
      });
      return;
    }

    default:
      return; // events we did not subscribe to are acknowledged and ignored
  }
}

async function onCheckoutCompleted(session: Stripe.Checkout.Session, stripe: Stripe, admin: SupabaseClient) {
  const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
  const plan = planForPrice(items.data[0]?.price?.id, {
    retainer: process.env.STRIPE_PRICE_RETAINER,
    batch: process.env.STRIPE_PRICE_BATCH,
    handover: process.env.STRIPE_PRICE_HANDOVER,
  });
  if (!plan) {
    console.warn(`checkout ${session.id}: price does not match STRIPE_PRICE_RETAINER / _BATCH / _HANDOVER`);
    return;
  }

  const customer = id(session.customer);
  const match: Record<string, string> | null = session.client_reference_id
    ? { id: session.client_reference_id }
    : customer
      ? { stripe_customer_id: customer }
      : null;
  if (!match) {
    console.warn(`checkout ${session.id}: no client_reference_id or customer to link to`);
    return;
  }

  // For the retainer, read the renewal date now; otherwise the plan card would show
  // "Renewal date pending" until the first renewal a month later.
  const subscriptionId = plan === "retainer" ? id(session.subscription) : null;
  const subscription = subscriptionId ? await stripe.subscriptions.retrieve(subscriptionId) : null;

  const { planType, editLimit } = PLAN_DEFAULTS[plan];
  await update(admin, match, {
    plan_type: planType,
    monthly_edit_limit: editLimit,
    edits_used_this_month: 0,
    billing_status: "active",
    stripe_customer_id: customer,
    stripe_subscription_id: subscriptionId,
    current_period_end: fromUnix(subscription?.items.data[0]?.current_period_end),
  });
}

async function update(admin: SupabaseClient, match: Record<string, string>, values: Record<string, unknown>) {
  const { error, count } = await admin.from("clients").update(values, { count: "exact" }).match(match);
  if (error) throw error;
  if (count === 0) console.warn("stripe webhook: no client matched", match);
}
