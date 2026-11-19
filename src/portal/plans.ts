import type { BillingStatus, PlanType, PortalClient, RequestStatus } from "./types";

export const PLAN_INFO: Record<PlanType, { name: string; price: string; blurb: string }> = {
  subscription: { name: "Monthly retainer", price: "$30 / month", blurb: "Up to 10 edits every month." },
  pay_as_you_go: { name: "On-demand edit batch", price: "$50 per batch", blurb: "Up to 5 edits, pay as you go." },
  cms_handover: { name: "DIY CMS handover", price: "$500 one-time", blurb: "You manage the site yourself." },
};

export const BILLING_LABEL: Record<BillingStatus, string> = {
  active: "Active",
  past_due: "Payment overdue",
  canceled: "Canceled",
};

export const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: "Pending",
  in_progress: "In progress",
  completed: "Completed",
  declined: "Declined",
};

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export const formatDate = (iso: string | null): string => (iso ? dateFormat.format(new Date(iso)) : "—");

/** The "renewal" line on the plan card, which only makes sense for the retainer. */
export function renewalLine(client: Pick<PortalClient, "planType" | "billingStatus" | "currentPeriodEnd">): string {
  if (client.planType === "cms_handover") return "One-time purchase — nothing to renew";
  if (client.planType === "pay_as_you_go") return "No renewal — buy another batch when you need one";
  if (client.billingStatus === "canceled") return "Plan canceled";
  return client.currentPeriodEnd ? `Renews ${formatDate(client.currentPeriodEnd)}` : "Renewal date pending";
}
