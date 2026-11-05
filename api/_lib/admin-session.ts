import { jwtVerify, SignJWT } from "jose";
import { env } from "./env.js";
import { fail } from "./http.js";
import { readCookie } from "./session.js";

export const ADMIN_COOKIE = "portal_admin";
const ADMIN_SECONDS = 60 * 60 * 12;
const AUDIENCE = "portal-admin";
const encoder = new TextEncoder();

/**
 * The owner's session. It is signed with its own secret (ADMIN_SESSION_SECRET), never the Supabase
 * JWT secret, so an admin cookie can't be replayed against PostgREST and a client token can't pass
 * as an admin one. Admin routes then use the service role directly.
 */
export async function signAdminSession(secret: string): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SECONDS}s`)
    .sign(encoder.encode(secret));
}

export async function verifyAdminSession(token: string, secret: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret), { audience: AUDIENCE, algorithms: ["HS256"] });
    return payload.admin === true;
  } catch {
    return false;
  }
}

/** null when the caller is the signed-in owner, otherwise a 401 to return as-is. */
export async function requireAdmin(request: Request): Promise<Response | null> {
  const token = readCookie(request.headers.get("cookie"), ADMIN_COOKIE);
  if (!token || !(await verifyAdminSession(token, env("ADMIN_SESSION_SECRET")))) {
    return fail(401, "Not signed in", "unauthenticated");
  }
  return null;
}

export const adminCookie = (token: string) =>
  `${ADMIN_COOKIE}=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${ADMIN_SECONDS}`;

export const clearedAdminCookie = () => `${ADMIN_COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
