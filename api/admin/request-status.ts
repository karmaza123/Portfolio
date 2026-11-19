import type { RequestStatus } from "../../src/portal/types.js";
import { requireAdmin } from "../_lib/admin-session.js";
import { fail, json, methodNotAllowed, readJson } from "../_lib/http.js";
import { adminClient } from "../_lib/supabase.js";

const STATUSES: RequestStatus[] = ["pending", "in_progress", "completed", "declined"];

/**
 * Moves a request to a new status. Database triggers stamp completed_at and give the edit back to
 * the client when a request is declined (and take it again if it's reopened).
 */
export async function POST(request: Request): Promise<Response> {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const body = await readJson(request);
  const id = typeof body?.id === "string" ? body.id : "";
  const status = body?.status as RequestStatus;
  if (!id || !STATUSES.includes(status)) return fail(400, "Pick a request and a valid status.", "validation");

  const { data, error } = await adminClient()
    .from("change_requests")
    .update({ status })
    .eq("id", id)
    .select("id, status, completed_at")
    .maybeSingle();

  if (error) {
    console.error("admin request-status: update failed", error);
    return fail(500, "Couldn't update the request. Try again.");
  }
  if (!data) return fail(404, "That request no longer exists.");
  return json({ request: data });
}

export const GET = methodNotAllowed;
