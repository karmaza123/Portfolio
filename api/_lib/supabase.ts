import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.js";

const options = { auth: { persistSession: false, autoRefreshToken: false } } as const;

/**
 * Bypasses row level security. Used only where there is no logged-in client to act as: looking a
 * client up at login, login throttling, signed attachment URLs, and the Stripe webhook.
 */
export function adminClient(): SupabaseClient {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), options);
}

/** Acts as one client: Postgres applies their row level security to every query. */
export function clientFor(token: string): SupabaseClient {
  return createClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), {
    ...options,
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}
