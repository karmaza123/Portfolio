import { isResponse, requireSession } from "../_lib/auth.js";
import { fail, json, optionalText, readJson, text } from "../_lib/http.js";
import { clientFor } from "../_lib/supabase.js";

// submit_change_request() raises these; map each to an HTTP status and a message the UI can show.
const RPC_ERRORS: Record<string, { status: number; message: string }> = {
  quota_exceeded: { status: 409, message: "You've used all your edits for this period." },
  no_edits_on_plan: { status: 403, message: "Your plan is self-managed, so there's nothing to submit." },
  billing_inactive: { status: 402, message: "Billing is inactive. Open billing to restore your plan." },
  invalid_attachment: { status: 400, message: "That attachment can't be used." },
  not_authenticated: { status: 401, message: "Your session expired. Sign in again." },
};

export async function POST(request: Request): Promise<Response> {
  const session = await requireSession(request);
  if (isResponse(session)) return session;

  const body = await readJson(request);
  if (!body) return fail(400, "Expected a JSON body.", "validation");

  const title = text(body.title, 120);
  const description = text(body.description, 5000);
  const pageUrl = optionalText(body.pageUrl, 500);
  const attachmentPath = optionalText(body.attachmentPath, 400);

  if (!title) return fail(400, "Add a short title (up to 120 characters).", "validation");
  if (!description) return fail(400, "Describe the change (up to 5,000 characters).", "validation");
  if (pageUrl === undefined) return fail(400, "That page URL is too long.", "validation");
  if (attachmentPath === undefined) return fail(400, "Invalid attachment.", "validation");

  const { data, error } = await clientFor(session.token).rpc("submit_change_request", {
    p_title: title,
    p_description: description,
    p_page_url: pageUrl,
    p_attachment_url: attachmentPath,
  });

  if (error) {
    const mapped = RPC_ERRORS[error.message];
    if (mapped) {
      return fail(mapped.status, mapped.message, error.message === "not_authenticated" ? "unauthenticated" : error.message);
    }
    console.error("portal requests: submit failed", error);
    return fail(500, "Could not submit your request. Try again.");
  }

  return json({ request: data }, 201);
}
