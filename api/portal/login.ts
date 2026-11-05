import bcrypt from "bcryptjs";
import { normalizeDomain } from "../_lib/domain.js";
import { env } from "../_lib/env.js";
import { clientIp, fail, json, methodNotAllowed, readJson } from "../_lib/http.js";
import { sessionCookie, signSession } from "../_lib/session.js";
import { adminClient } from "../_lib/supabase.js";
import { isThrottled, recordAttempt } from "../_lib/throttle.js";

// A real bcrypt hash of a throwaway string. Unknown domains are compared against it so a failed
// login takes as long whether or not the domain exists, and the reply never says which half was wrong.
const DECOY_HASH = "$2b$12$/vDNqsKSV3gAK/iGZIUvN.bpHS6gkV3.O8CwG3jZSCIqlYDZV2.aS";

const INVALID = () => fail(401, "Invalid domain or password.", "invalid_credentials");

export async function POST(request: Request): Promise<Response> {
  const body = await readJson(request);
  if (!body) return fail(400, "Expected a JSON body.", "validation");

  const rawDomain = typeof body.domain === "string" ? body.domain : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!rawDomain || !password || password.length > 200) return INVALID();

  const domain = normalizeDomain(rawDomain);
  const ip = clientIp(request);
  const admin = adminClient();

  // Throttle on the normalised domain (or the raw text when it never parsed) so
  // "Acme.com", "www.acme.com" and "https://acme.com" all count against the same budget.
  const throttleKey = domain ?? rawDomain.trim().toLowerCase().slice(0, 253);
  if (await isThrottled(admin, throttleKey, ip)) {
    return fail(429, "Too many attempts. Try again in a few minutes.", "throttled");
  }

  const { data: client } = domain
    ? await admin.from("clients").select("id, password_hash").eq("domain_name", domain).maybeSingle()
    : { data: null };

  const matches = await bcrypt.compare(password, client?.password_hash ?? DECOY_HASH);
  const ok = Boolean(client) && matches;

  await recordAttempt(admin, throttleKey, ip, ok);
  if (!ok || !client) return INVALID();

  const token = await signSession(client.id as string, env("SUPABASE_JWT_SECRET"));
  return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token) });
}

export const GET = methodNotAllowed;
