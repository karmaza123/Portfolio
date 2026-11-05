import { clearedAdminCookie } from "../_lib/admin-session.js";
import { json, methodNotAllowed } from "../_lib/http.js";

export async function POST(): Promise<Response> {
  return json({ ok: true }, 200, { "Set-Cookie": clearedAdminCookie() });
}

export const GET = methodNotAllowed;
