import Stripe from "stripe";
import { isResponse, requireSession } from "../_lib/auth.js";
import { env, envOr } from "../_lib/env.js";
import { fail, json } from "../_lib/http.js";
import { adminClient } from "../_lib/supabase.js";

/** Opens the Stripe-hosted billing portal for the logged-in client. */
export async function POST(request: Request): Promise<Response> {
  const session = await requireSession(request);
  if (isResponse(session)) return session;

  const { data } = await adminClient()
    .from("clients")
    .select("stripe_customer_id")
    .eq("id", session.clientId)
    .maybeSingle();

  const customer = data?.stripe_customer_id as string | null | undefined;
  if (!customer) return fail(404, "No billing account is linked to this plan yet.", "no_billing");

  const base = envOr("PORTAL_BASE_URL", new URL(request.url).origin);
  const stripe = new Stripe(env("STRIPE_SECRET_KEY"));
  const portal = await stripe.billingPortal.sessions.create({
    customer,
    return_url: `${base}/portal/dashboard`,
  });

  return json({ url: portal.url });
}
