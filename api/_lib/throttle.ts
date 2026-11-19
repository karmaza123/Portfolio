import type { SupabaseClient } from "@supabase/supabase-js";

const WINDOW_MINUTES = 15;
const MAX_FAILURES_PER_DOMAIN = 8;
const MAX_FAILURES_PER_IP = 20;

const since = () => new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

/**
 * Brute-force guard backed by Postgres (serverless functions share no memory, so an in-process
 * counter would reset on every cold start). Counts failed logins in the last 15 minutes by
 * domain and by IP; either limit blocks further attempts until the window rolls over.
 */
export async function isThrottled(admin: SupabaseClient, domain: string, ip: string): Promise<boolean> {
  const [byDomain, byIp] = await Promise.all([
    admin
      .from("portal_login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("domain", domain)
      .eq("success", false)
      .gte("created_at", since()),
    admin
      .from("portal_login_attempts")
      .select("id", { count: "exact", head: true })
      .eq("ip", ip)
      .eq("success", false)
      .gte("created_at", since()),
  ]);
  return (byDomain.count ?? 0) >= MAX_FAILURES_PER_DOMAIN || (byIp.count ?? 0) >= MAX_FAILURES_PER_IP;
}

export async function recordAttempt(admin: SupabaseClient, domain: string, ip: string, success: boolean) {
  await admin.from("portal_login_attempts").insert({ domain, ip, success });
}
