import type { BillingStatus, PlanType } from "../../src/portal/types.js";

/** What each purchase sets on the client row. */
export type PlanDefaults = { planType: PlanType; editLimit: number };

export const PLAN_DEFAULTS = {
  retainer: { planType: "subscription", editLimit: 10 },
  batch: { planType: "pay_as_you_go", editLimit: 5 },
  handover: { planType: "cms_handover", editLimit: 0 },
} as const satisfies Record<string, PlanDefaults>;

export type PlanKey = keyof typeof PLAN_DEFAULTS;

/**
 * Maps a Stripe price id to a plan using three env vars, so prices can be created or replaced in
 * Stripe without touching code:
 *   STRIPE_PRICE_RETAINER  $30/mo, 10 edits a month
 *   STRIPE_PRICE_BATCH     $50 one-time, 5 edits
 *   STRIPE_PRICE_HANDOVER  $500 one-time, self-managed
 */
export function planForPrice(priceId: string | null | undefined, prices: Record<PlanKey, string | undefined>): PlanKey | null {
  if (!priceId) return null;
  for (const key of Object.keys(PLAN_DEFAULTS) as PlanKey[]) {
    if (prices[key] && prices[key] === priceId) return key;
  }
  return null;
}

/** Stripe subscription status -> the three states the portal shows. */
export function billingStatusFor(stripeStatus: string): BillingStatus {
  switch (stripeStatus) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
    case "incomplete":
    case "paused":
      return "past_due";
    default:
      return "canceled";
  }
}

export const fromUnix = (seconds: number | null | undefined): string | null =>
  typeof seconds === "number" ? new Date(seconds * 1000).toISOString() : null;
