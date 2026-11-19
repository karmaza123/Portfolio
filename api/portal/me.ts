import type { PortalClient, PortalMe, PortalRequest } from "../../src/portal/types.js";
import { isResponse, requireSession } from "../_lib/auth.js";
import { CLIENT_COLUMNS } from "../_lib/columns.js";
import { fail, json } from "../_lib/http.js";
import { adminClient, clientFor } from "../_lib/supabase.js";

const BUCKET = "request-attachments";
const SIGNED_URL_SECONDS = 60 * 60;

/** "<client_id>/<uuid>-<name>" -> "<name>" */
const attachmentName = (path: string) => path.split("/").pop()?.replace(/^[0-9a-f-]{36}-/, "") ?? path;

export async function GET(request: Request): Promise<Response> {
  const session = await requireSession(request);
  if (isResponse(session)) return session;

  // Everything below runs as the client: row level security decides what comes back.
  const db = clientFor(session.token);

  const [clientRes, requestsRes] = await Promise.all([
    // Name the columns: clients only hold column-level SELECT grants (password_hash and the
    // Stripe ids are withheld), so `select("*")` is refused by Postgres for every client.
    db.from("clients").select(CLIENT_COLUMNS).maybeSingle(),
    db.from("change_requests").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  // A query error is a server problem, not a sign-out: reporting it as 401 would bounce the client
  // to the login page in a loop and hide the real cause.
  if (clientRes.error || requestsRes.error) {
    console.error("portal me: query failed", clientRes.error ?? requestsRes.error);
    return fail(500, "Couldn't load your dashboard. Try again in a moment.");
  }
  // No row visible under row level security: the client was deleted or the token is stale.
  if (!clientRes.data) return fail(401, "Session expired", "unauthenticated");

  const c = clientRes.data;
  const rows = requestsRes.data ?? [];

  // Short-lived signed links for attachments (the bucket is private).
  const admin = adminClient();
  const paths = rows.map((r) => r.attachment_url as string | null).filter((p): p is string => Boolean(p));
  const signed = new Map<string, string>();
  if (paths.length > 0) {
    const { data } = await admin.storage.from(BUCKET).createSignedUrls(paths, SIGNED_URL_SECONDS);
    for (const item of data ?? []) if (item.path && item.signedUrl) signed.set(item.path, item.signedUrl);
  }

  // The Stripe customer id is deliberately not selectable by clients, so ask the service role
  // only whether one exists.
  const { data: billing } = await admin
    .from("clients")
    .select("stripe_customer_id")
    .eq("id", session.clientId)
    .maybeSingle();

  const client: PortalClient = {
    companyName: c.company_name,
    domainName: c.domain_name,
    planType: c.plan_type,
    billingStatus: c.billing_status,
    currentPeriodEnd: c.current_period_end,
    monthlyEditLimit: c.monthly_edit_limit,
    editsUsed: c.edits_used_this_month,
    hasBilling: Boolean(billing?.stripe_customer_id),
  };

  const requests: PortalRequest[] = rows.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    pageUrl: r.page_url,
    attachmentUrl: r.attachment_url ? (signed.get(r.attachment_url) ?? null) : null,
    attachmentName: r.attachment_url ? attachmentName(r.attachment_url) : null,
    status: r.status,
    createdAt: r.created_at,
    completedAt: r.completed_at,
  }));

  const payload: PortalMe = { client, requests };
  return json(payload);
}
