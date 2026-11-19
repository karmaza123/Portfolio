import { json, methodNotAllowed } from "../_lib/http.js";
import { clearedSessionCookie } from "../_lib/session.js";

export async function POST(): Promise<Response> {
  return json({ ok: true }, 200, { "Set-Cookie": clearedSessionCookie() });
}

export const GET = methodNotAllowed;
