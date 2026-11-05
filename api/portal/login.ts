import bcrypt from "bcryptjs";
import { env } from "../_lib/env.js";
import { clientIp, fail, json, methodNotAllowed, readJson } from "../_lib/http.js";
import { MIN_CLIENT_PASSWORD, passwordLookup } from "../_lib/password-lookup.js";
import { sessionCookie, signSession } from "../_lib/session.js";
import { adminClient } from "../_lib/supabase.js";
import { isThrottled, recordAttempt } from "../_lib/throttle.js";

// A real bcrypt hash of a throwaway string. Unknown passwords are compared against it so a failed
// login takes as long whether or not the fingerprint matched a client.
const DECOY_HASH = "$2b$12$/vDNqsKSV3gAK/iGZIUvN.bpHS6gkV3.O8CwG3jZSCIqlYDZV2.aS";

const INVALID = () => fail(401, "That password didn't work.", "invalid_credentials");

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return fail(400, "Expected a JSON body.", "validation");

  const password = typeof body.password === "string" ? body.password : "";
  if (password.length < MIN_CLIENT_PASSWORD || password.length > 200) return INVALID();

  const ip = clientIp(request);
  const admin = adminClient();

  // No domain to count against any more, so throttle per network address.
  const throttleKey = `#ip:${ip}`;
  if (await isThrottled(admin, throttleKey, ip)) {
    return fail(429, "Too many attempts. Try again in a few minutes.", "throttled");
  }

  const { data: client } = await admin
    .from("clients")
    .select("id, password_hash")
    .eq("password_lookup", passwordLookup(password))
    .maybeSingle();

  const matches = await bcrypt.compare(password, client?.password_hash ?? DECOY_HASH);
  const ok = Boolean(client) && matches;

  await recordAttempt(admin, throttleKey, ip, ok);
  if (!ok || !client) return INVALID();

  const token = await signSession(client.id as string, env("SUPABASE_JWT_SECRET"));
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token) });
}

export const GET = methodNotAllowed;
