/** The JSON contract between the portal pages and the `/api/portal/*` functions. */

export type PlanType = "subscription" | "pay_as_you_go" | "cms_handover";
export type BillingStatus = "active" | "past_due" | "canceled";
export type RequestStatus = "pending" | "in_progress" | "completed" | "declined";

export type PortalClient = {
  companyName: string;
  domainName: string;
  planType: PlanType;
  billingStatus: BillingStatus;
  /** ISO timestamp; null for one-off plans. */
  currentPeriodEnd: string | null;
  monthlyEditLimit: number;
  editsUsed: number;
  /** True when a Stripe customer is linked, so "Manage billing" can open the billing portal. */
  hasBilling: boolean;
};

export type PortalRequest = {
  id: string;
  title: string;
  description: string;
  pageUrl: string | null;
  /** Short-lived signed link; null when nothing was attached. */
  attachmentUrl: string | null;
  attachmentName: string | null;
  status: RequestStatus;
  createdAt: string;
  completedAt: string | null;
};

export type PortalMe = { client: PortalClient; requests: PortalRequest[] };

export type NewRequestInput = {
  title: string;
  description: string;
  pageUrl: string;
  attachmentPath: string | null;
};

export type UploadTicket = { path: string; signedUrl: string };

/** Error codes the API returns in `{ error, code }` for cases the UI reacts to. */
export type ApiErrorCode =
  | "unauthenticated"
  | "invalid_credentials"
  | "throttled"
  | "quota_exceeded"
  | "no_edits_on_plan"
  | "billing_inactive"
  | "validation"
  | "no_billing"
  | "not_configured";

/** Owner dashboard (`/portal/admin`): every client and every request. */
export type AdminClient = PortalClient & { id: string; createdAt: string };
export type AdminRequest = PortalRequest & { clientId: string };
export type AdminOverview = { clients: AdminClient[]; requests: AdminRequest[] };
