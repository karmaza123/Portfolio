import type { PortalClient } from "./types";

export type QuotaSummary =
  | { tracked: false }
  | {
      tracked: true;
      used: number;
      limit: number;
      remaining: number;
      /** 0–100, for the progress bar. */
      percent: number;
      tone: "ok" | "warn" | "full";
      exhausted: boolean;
      label: string;
    };

/**
 * What the quota bar shows. The DIY plan has no edits to count. The retainer resets monthly; an
 * on-demand batch is a fixed pool that stays used until another batch is bought.
 */
export function quotaSummary(client: Pick<PortalClient, "planType" | "monthlyEditLimit" | "editsUsed">): QuotaSummary {
  if (client.planType === "cms_handover") return { tracked: false };

  const limit = Math.max(0, client.monthlyEditLimit);
  const used = Math.max(0, client.editsUsed);
  const remaining = Math.max(0, limit - used);
  const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 100;
  const period = client.planType === "subscription" ? "this month" : "in this batch";

  return {
    tracked: true,
    used,
    limit,
    remaining,
    percent,
    tone: percent >= 100 ? "full" : percent >= 70 ? "warn" : "ok",
    exhausted: remaining === 0,
    label: `${used} / ${limit} edits used ${period}`,
  };
}

/** Why the request form is locked, or null when it is open. */
export function formLockReason(
  client: Pick<PortalClient, "planType" | "billingStatus" | "monthlyEditLimit" | "editsUsed">,
): string | null {
  if (client.planType === "cms_handover") return "Your plan is self-managed, so there are no edits to request.";
  if (client.billingStatus === "canceled") return "Billing is inactive. Open billing to restore your plan.";
  const q = quotaSummary(client);
  if (q.tracked && q.exhausted) {
    return client.planType === "subscription"
      ? "You've used all your edits this month. They reset when your plan renews."
      : "This batch is used up. Buy another batch to keep requesting edits.";
  }
  return null;
}
