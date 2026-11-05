import bcrypt from "bcryptjs";
import { adminCookie, signAdminSession } from "../_lib/admin-session.js";
import { env } from "../_lib/env.js";
import { clientIp, fail, json, methodNotAllowed, readJson } from "../_lib/http.js";
import { adminClient } from "../_lib/supabase.js";
import { isThrottled, recordAttempt } from "../_lib/throttle.js";

// Shares the client login throttle table under a key no real domain can have.
const THROTTLE_KEY = "#admin";

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!password || password.length > 200) return fail(401, "Wrong password.", "invalid_credentials");

  const ip = clientIp(request);
  const db = adminClient();
  if (await isThrottled(db, THROTTLE_KEY, ip)) {
    return fail(429, "Too many attempts. Try again in a few minutes.", "throttled");
  }

  const ok = await bcrypt.compare(password, env("ADMIN_PASSWORD_HASH"));
  await recordAttempt(db, THROTTLE_KEY, ip, ok);
  if (!ok) return fail(401, "Wrong password.", "invalid_credentials");

  const token = await signAdminSession(env("ADMIN_SESSION_SECRET"));
  return json({ ok: true }, 200, { "Set-Cookie": adminCookie(token) });
}

export const GET = methodNotAllowed;
