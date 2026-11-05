import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { passwordLookup } from "../_lib/password-lookup.js";

// The login handler talks to Supabase through two modules; replace them with an in-memory fake so
// the real handler logic (fingerprint lookup, decoy hash, throttling, cookie) is what gets exercised.
const state = vi.hoisted(() => ({
  clients: [] as { id: string; password_lookup: string; password_hash: string }[],
  throttled: false,
  attempts: [] as { key: string; success: boolean }[],
  lookups: [] as string[],
}));

vi.mock("../_lib/supabase.js", () => ({
  adminClient: () => ({
    from: () => ({
      select: () => ({
        eq: (_col: string, lookup: string) => ({
          maybeSingle: async () => {
            state.lookups.push(lookup);
            return { data: state.clients.find((c) => c.password_lookup === lookup) ?? null };
          },
        }),
      }),
    }),
  }),
}));

vi.mock("../_lib/throttle.js", () => ({
  isThrottled: async () => state.throttled,
  recordAttempt: async (_admin: unknown, key: string, _ip: string, success: boolean) => {
    state.attempts.push({ key, success });
  },
}));

const { POST } = await import("../portal/login.js");

const ID = "7b0f6c2e-5d6a-4f0e-9a41-1f6f0e6c9a11";
const PASSWORD = "kT7mQ2vXr9pLw4Hz";
const IP_KEY = "#ip:203.0.113.7";

const login = (body: unknown, contentType = "application/json") =>
  POST(
    new Request("https://example.com/api/portal/login", {
      method: "POST",
      headers: { "content-type": contentType, "x-forwarded-for": "203.0.113.7" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

beforeEach(async () => {
  process.env.SUPABASE_JWT_SECRET = "test-secret-at-least-32-characters-long!!";
  state.throttled = false;
  state.attempts = [];
  state.lookups = [];
  state.clients = [{ id: ID, password_lookup: passwordLookup(PASSWORD), password_hash: await bcrypt.hash(PASSWORD, 4) }];
});

describe("POST /api/portal/login (password only)", () => {
  it("finds the client by password and sets a secure session cookie", async () => {
    const res = await login({ password: PASSWORD });
    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("portal_session=");
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/Secure/);
    expect(cookie).toMatch(/SameSite=Lax/);
    expect(state.attempts).toEqual([{ key: IP_KEY, success: true }]);
  });

  it("rejects an unknown password with a generic message and no cookie", async () => {
    const res = await login({ password: "zzzzzzzzzzzzzzzz" });
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(await res.json()).toMatchObject({ code: "invalid_credentials" });
    expect(state.attempts).toEqual([{ key: IP_KEY, success: false }]);
  });

  it("still requires the bcrypt hash to match when a fingerprint collides", async () => {
    state.clients[0].password_hash = await bcrypt.hash("something-else-entirely", 4);
    expect((await login({ password: PASSWORD })).status).toBe(401);
  });

  it("rejects short passwords without querying the database", async () => {
    expect((await login({ password: "short" })).status).toBe(401);
    expect(state.lookups).toEqual([]);
  });

  it("returns 429 when throttled, before checking any password", async () => {
    state.throttled = true;
    const res = await login({ password: PASSWORD });
    expect(res.status).toBe(429);
    expect(state.lookups).toEqual([]);
  });

  it("requires a JSON body", async () => {
    expect((await login("password=x", "application/x-www-form-urlencoded")).status).toBe(400);
    expect((await login("{not json")).status).toBe(400);
  });

  it("rejects missing and oversized passwords", async () => {
    expect((await login({})).status).toBe(401);
    expect((await login({ password: "x".repeat(500) })).status).toBe(401);
  });
});
