import type { AdminOverview, PlanType, RequestStatus } from "./types";

const RETAINER_MONTHLY_USD = 30;

export type AdminStats = {
  projects: number;
  byPlan: Record<PlanType, number>;
  requests: Record<RequestStatus, number> & { total: number; open: number };
  completedLast30Days: number;
  /** Edits used against the allowance, across clients that have a quota. */
  edits: { used: number; limit: number };
  needsAttention: number;
  monthlyRecurringUsd: number;
};

/** Headline numbers for the owner dashboard. `now` is injectable for tests. */
export function adminStats({ clients, requests }: AdminOverview, now = Date.now()): AdminStats {
  const byPlan: Record<PlanType, number> = { subscription: 0, pay_as_you_go: 0, cms_handover: 0 };
  let used = 0;
  let limit = 0;
  let needsAttention = 0;
  let activeRetainers = 0;

  for (const c of clients) {
    byPlan[c.planType] += 1;
    if (c.planType !== "cms_handover") {
      used += c.editsUsed;
      limit += c.monthlyEditLimit;
    }
    if (c.billingStatus !== "active") needsAttention += 1;
    if (c.planType === "subscription" && c.billingStatus === "active") activeRetainers += 1;
  }

  const counts: Record<RequestStatus, number> = { pending: 0, in_progress: 0, completed: 0, declined: 0 };
  const since = now - 30 * 86_400_000;
  let completedLast30Days = 0;
  for (const r of requests) {
    counts[r.status] += 1;
    if (r.status === "completed" && r.completedAt && Date.parse(r.completedAt) >= since) completedLast30Days += 1;
  }

  return {
    projects: clients.length,
    byPlan,
    requests: { ...counts, total: requests.length, open: counts.pending + counts.in_progress },
    completedLast30Days,
    edits: { used, limit },
    needsAttention,
    monthlyRecurringUsd: activeRetainers * RETAINER_MONTHLY_USD,
  };
}
