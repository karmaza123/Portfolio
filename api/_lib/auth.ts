import { env } from "./env.js";
import { fail } from "./http.js";
import { readCookie, SESSION_COOKIE, verifySession } from "./session.js";

export type Session = { clientId: string; token: string };

/** Resolves the logged-in client, or a ready-made 401 response to return as-is. */
export async function requireSession(request: Request): Promise<Session | Response> {
  const token = readCookie(request.headers.get("cookie"), SESSION_COOKIE);
  if (!token) return fail(401, "Not signed in", "unauthenticated");

  const clientId = await verifySession(token, env("SUPABASE_JWT_SECRET"));
  if (!clientId) return fail(401, "Session expired", "unauthenticated");

  return { clientId, token };
}

export const isResponse = (value: Session | Response): value is Response => value instanceof Response;
