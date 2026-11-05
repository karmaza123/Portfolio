import { beforeEach, describe, expect, it, vi } from "vitest";

// Fake Stripe and Supabase so the real webhook handler runs end to end in memory.
const state = vi.hoisted(() => ({
  event: null as unknown,
  badSignature: false,
  priceId: "price_r",
  periodEnd: 1_767_225_600, // 2026-01-01T00:00:00Z
  seen: new Set<string>(),
  updates: [] as { match: Record<string, string>; values: Record<string, unknown> }[],
  recorded: [] as string[],
}));

vi.mock("stripe", () => ({
  default: class {
    webhooks = {
      constructEventAsync: async () => {
        if (state.badSignature) throw new Error("bad signature");
        return state.event;
      },
    };
    checkout = { sessions: { listLineItems: async () => ({ data: [{ price: { id: state.priceId } }] }) } };
    subscriptions = {
      retrieve: async (id: string) => ({ id, items: { data: [{ current_period_end: state.periodEnd }] } }),
    };
  },
}));

vi.mock("../_lib/supabase.js", () => ({
  adminClient: () => ({
    from: (table: string) =>
      table === "stripe_events"
        ? {
            select: () => ({
              eq: (_c: string, id: string) => ({ maybeSingle: async () => ({ data: state.seen.has(id) ? { id } : null }) }),
            }),
            insert: async (row: { id: string }) => {
              state.seen.add(row.id);
              state.recorded.push(row.id);
              return { error: null };
            },
          }
        : {
            update: (values: Record<string, unknown>) => ({
              match: async (match: Record<string, string>) => {
                state.updates.push({ match, values });
                return { error: null, count: 1 };
              },
            }),
          },
  }),
}));

const { POST } = await import("../webhooks/stripe.js");

const deliver = (event: unknown, signature: string | null = "t=1,v1=x") => {
  state.event = event;
  return POST(
    new Request("https://example.com/api/webhooks/stripe", {
      method: "POST",
      headers: signature ? { "stripe-signature": signature } : {},
      body: JSON.stringify(event),
    }),
  );
};

beforeEach(() => {
  Object.assign(process.env, {
    STRIPE_SECRET_KEY: "sk_test_x",
    STRIPE_WEBHOOK_SECRET: "whsec_x",
    STRIPE_PRICE_RETAINER: "price_r",
    STRIPE_PRICE_BATCH: "price_b",
    STRIPE_PRICE_HANDOVER: "price_h",
  });
  state.badSignature = false;
  state.priceId = "price_r";
  state.seen = new Set();
  state.updates = [];
  state.recorded = [];
});

const CLIENT = "7b0f6c2e-5d6a-4f0e-9a41-1f6f0e6c9a11";
const checkout = (id = "evt_1") => ({
  id,
  type: "checkout.session.completed",
  data: { object: { id: "cs_1", client_reference_id: CLIENT, customer: "cus_1", subscription: "sub_1" } },
});

describe("POST /api/webhooks/stripe", () => {
  it("rejects a missing or invalid signature without touching the database", async () => {
    expect((await deliver(checkout(), null)).status).toBe(400);
    state.badSignature = true;
    expect((await deliver(checkout())).status).toBe(400);
    expect(state.updates).toEqual([]);
  });

  it("activates the retainer with 10 edits and its renewal date", async () => {
    const res = await deliver(checkout());
    expect(res.status).toBe(200);
    expect(state.updates).toEqual([
      {
        match: { id: CLIENT },
        values: {
          plan_type: "subscription",
          monthly_edit_limit: 10,
          edits_used_this_month: 0,
          billing_status: "active",
          stripe_customer_id: "cus_1",
          stripe_subscription_id: "sub_1",
          current_period_end: "2026-01-01T00:00:00.000Z",
        },
      },
    ]);
    expect(state.recorded).toEqual(["evt_1"]);
  });

  it("gives a batch purchase 5 edits and no subscription", async () => {
    state.priceId = "price_b";
    await deliver({ ...checkout(), data: { object: { id: "cs_2", client_reference_id: CLIENT, customer: "cus_1", subscription: null } } });
    expect(state.updates[0]?.values).toMatchObject({
      plan_type: "pay_as_you_go",
      monthly_edit_limit: 5,
      edits_used_this_month: 0,
      stripe_subscription_id: null,
      current_period_end: null,
    });
  });

  it("ignores a checkout whose price isn't one of the three plans", async () => {
    state.priceId = "price_unknown";
    expect((await deliver(checkout())).status).toBe(200);
    expect(state.updates).toEqual([]);
  });

  it("applies each event once", async () => {
    await deliver(checkout("evt_dup"));
    const again = await deliver(checkout("evt_dup"));
    expect(await again.json()).toMatchObject({ duplicate: true });
    expect(state.updates).toHaveLength(1);
  });

  it("resets edits on a renewal, only for clients still on the retainer", async () => {
    await deliver({
      id: "evt_renew",
      type: "invoice.paid",
      data: { object: { customer: "cus_1", billing_reason: "subscription_cycle", lines: { data: [{ period: { end: state.periodEnd } }] } } },
    });
    expect(state.updates).toEqual([
      {
        match: { stripe_customer_id: "cus_1", plan_type: "subscription" },
        values: { edits_used_this_month: 0, billing_status: "active", current_period_end: "2026-01-01T00:00:00.000Z" },
      },
    ]);
  });

  it("does not reset edits on the first invoice (checkout already did)", async () => {
    await deliver({
      id: "evt_first",
      type: "invoice.paid",
      data: { object: { customer: "cus_1", billing_reason: "subscription_create", lines: { data: [] } } },
    });
    expect(state.updates).toEqual([]);
  });

  it("matches subscription changes by subscription id, not customer", async () => {
    await deliver({
      id: "evt_cancel",
      type: "customer.subscription.deleted",
      data: { object: { id: "sub_old", customer: "cus_1", status: "canceled", items: { data: [] } } },
    });
    expect(state.updates).toEqual([
      { match: { stripe_subscription_id: "sub_old" }, values: { billing_status: "canceled", current_period_end: null } },
    ]);
  });

  it("marks a failed payment as past due", async () => {
    await deliver({ id: "evt_fail", type: "invoice.payment_failed", data: { object: { customer: "cus_1" } } });
    expect(state.updates[0]).toEqual({ match: { stripe_customer_id: "cus_1" }, values: { billing_status: "past_due" } });
  });
});
