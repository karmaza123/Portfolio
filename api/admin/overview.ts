import type { AdminClient, AdminOverview, AdminRequest } from "../../src/portal/types.js";
import { requireAdmin } from "../_lib/admin-session.js";
import { CLIENT_COLUMNS } from "../_lib/columns.js";
import { fail, json } from "../_lib/http.js";
import { adminClient } from "../_lib/supabase.js";

const BUCKET = "request-attachments";
const attachmentName = (path: string) => path.split("/").pop()?.replace(/^[0-9a-f-]{36}-/, "") ?? path;

/** Everything the owner dashboard shows, in one call. Service role: the owner sees every client. */
export async function GET(request: Request): Promise<Response> {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const db = adminClient();
  const [clientsRes, requestsRes] = await Promise.all([
    db.from("clients").select(`${CLIENT_COLUMNS}, stripe_customer_id`).order("company_name"),
    db.from("change_requests").select("*").order("created_at", { ascending: false }).limit(500),
  ]);

  if (clientsRes.error || requestsRes.error) {
    console.error("admin overview: query failed", clientsRes.error ?? requestsRes.error);
    return fail(500, "Couldn't load the overview. Try again in a moment.");
  }

  const rows = requestsRes.data ?? [];
  const paths = rows.map((r) => r.attachment_url as string | null).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await db.storage.from(BUCKET).createSignedUrls(paths, 60 * 60);
    for (const item of data ?? []) if (item.path && item.signedUrl) signed.set(item.path, item.signedUrl);
  }

  const clients: AdminClient[] = (clientsRes.data ?? []).map((c) => ({
    id: c.id,
    companyName: c.company_name,
    domainName: c.domain_name,
    planType: c.plan_type,
    billingStatus: c.billing_status,
    currentPeriodEnd: c.current_period_end,
    monthlyEditLimit: c.monthly_edit_limit,
    editsUsed: c.edits_used_this_month,
    hasBilling: Boolean(c.stripe_customer_id),
    createdAt: c.created_at,
  }));

  const requests: AdminRequest[] = rows.map((r) => ({
    id: r.id,
    clientId: r.client_id,
    title: r.title,
    description: r.description,
    pageUrl: r.page_url,
    attachmentUrl: r.attachment_url ? (signed.get(r.attachment_url) ?? null) : null,
    attachmentName: r.attachment_url ? attachmentName(r.attachment_url) : null,
    status: r.status,
    createdAt: r.created_at,
    completedAt: r.completed_at,
  }));

  const payload: AdminOverview = { clients, requests };
  return json(payload);
}
