import { randomUUID } from "node:crypto";
import type { UploadTicket } from "../../src/portal/types.js";
import { isResponse, requireSession } from "../_lib/auth.js";
import { fail, json, readJson } from "../_lib/http.js";
import { adminClient } from "../_lib/supabase.js";

const BUCKET = "request-attachments";
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "application/pdf"]);

/** Keeps the file name readable but safe to use as a storage key. */
const safeName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(-80) || "file";

/**
 * Hands the browser a one-shot signed URL so the file goes straight to Supabase Storage instead of
 * through this function (which has a small body limit). The path always starts with the client's id,
 * and submit_change_request() refuses attachments outside that folder.
 */
export async function POST(request: Request): Promise<Response> {
  const session = await requireSession(request);
  if (isResponse(session)) return session;

  const body = await readJson(request);
  const name = typeof body?.filename === "string" ? body.filename : "";
  const type = typeof body?.contentType === "string" ? body.contentType : "";
  const size = typeof body?.size === "number" ? body.size : 0;

  if (!name || !ALLOWED.has(type)) return fail(400, "Attach a PNG, JPG, WebP, GIF or PDF.", "validation");
  if (size <= 0 || size > MAX_BYTES) return fail(400, "Files can be up to 10 MB.", "validation");

  const path = `${session.clientId}/${randomUUID()}-${safeName(name)}`;
  const { data, error } = await adminClient().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) return fail(500, "Could not prepare the upload.");

  const ticket: UploadTicket = { path, signedUrl: data.signedUrl };
  return json(ticket);
}
