import { jwtVerify, SignJWT } from "jose";

export const SESSION_COOKIE = "portal_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

/**
 * The session token doubles as the credential Supabase checks. It is signed with the project's
 * JWT secret and carries `role: authenticated` plus a `client_id` claim, which is what the row
 * level security policies match on. See supabase/migrations/0001_client_portal.sql.
 */
export async function signSession(clientId: string, secret: string): Promise<string> {
  return new SignJWT({ role: "authenticated", client_id: clientId })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(clientId)
    .setAudience("authenticated")
    .setIssuedAt()
    .setExpirationTime(`${SESSION_SECONDS}s`)
    .sign(encoder.encode(secret));
}

/** Returns the client id for a valid, unexpired token, or null for anything else. */
export async function verifySession(token: string, secret: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), {
      audience: "authenticated",
      algorithms: ["HS256"],
    });
    return typeof payload.client_id === "string" ? payload.client_id : null;
  } catch {
    return null;
  }
}

export function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

/**
 * HttpOnly keeps it away from page scripts, Secure keeps it off plain http, and SameSite=Lax (not
 * Strict) lets the cookie survive the redirect back from Stripe's billing portal.
 */
export function sessionCookie(token: string): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${SESSION_SECONDS}`;
}

export function clearedSessionCookie(): string {
  return `${SESSION_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0`;
}
