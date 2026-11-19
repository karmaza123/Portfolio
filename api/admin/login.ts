import bcrypt from "bcryptjs";
import { adminCookie, signAdminSession } from "../_lib/admin-session.js";
import { env } from "../_lib/env.js";
import { clientIp, fail, json, methodNotAllowed, readJson } from "../_lib/http.js";

// Sign-in needs only ADMIN_PASSWORD_HASH and ADMIN_SESSION_SECRET, no database, so it works before
// Supabase is set up. Brute force is slowed by bcrypt (cost 12), a pause on every miss, and a
// per-instance counter. The counter resets on cold starts, so the real protection is a long password.
const WINDOW_MS = 15 * 60_000;
const MAX_FAILURES = 10;
const FAILURE_DELAY_MS = 1000;
const failures = new Map<string, { count: number; first: number }>();

const isBlocked = (ip: string, now: number) => {
  const entry = failures.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) return false;
  return entry.count >= MAX_FAILURES;
};

const recordFailure = (ip: string, now: number) => {
  const entry = failures.get(ip);
  if (!entry || now - entry.first > WINDOW_MS) failures.set(ip, { count: 1, first: now });
  else entry.count += 1;
};

export async function POST(request: Request): Promise<Response> {
  const ip = clientIp(request);
  const now = Date.now();
  if (isBlocked(ip, now)) return fail(429, "Too many attempts. Try again in a few minutes.", "throttled");

  const body = await readJson(request);
  const password = typeof body?.password === "string" ? body.password : "";

  const ok = password.length > 0 && password.length <= 200 && (await bcrypt.compare(password, env("ADMIN_PASSWORD_HASH")));
  if (!ok) {
    recordFailure(ip, now);
    await new Promise((resolve) => setTimeout(resolve, FAILURE_DELAY_MS));
    return fail(401, "Wrong password.", "invalid_credentials");
  }

  failures.delete(ip);
  const token = await signAdminSession(env("ADMIN_SESSION_SECRET"));
  return json({ ok: true }, 200, { "Set-Cookie": adminCookie(token) });
}

export const GET = methodNotAllowed;
