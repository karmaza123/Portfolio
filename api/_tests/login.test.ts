import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, it, vi } from "vitest";

// The login handler talks to Supabase through two modules; replace them with an in-memory fake so
// the real handler logic (normalising, decoy hash, throttling, cookie) is what gets exercised.
const state = vi.hoisted(() => ({
  clients: [] as { id: string; domain_name: string; password_hash: string }[],
  throttled: false,
  attempts: [] as { domain: string; success: boolean }[],
  lookups: [] as string[],
}));

vi.mock("../_lib/supabase.js", () => ({
  adminClient: () => ({
    from: () => ({
      select: () => ({
        eq: (_col: string, domain: string) => ({
          maybeSingle: async () => {
            state.lookups.push(domain);
            return { data: state.clients.find((c) => c.domain_name === domain) ?? null };
          },
        }),
      }),
    }),
  }),
}));

vi.mock("../_lib/throttle.js", () => ({
  isThrottled: async () => state.throttled,
  recordAttempt: async (_admin: unknown, domain: string, _ip: string, success: boolean) => {
    state.attempts.push({ domain, success });
  },
}));

const { POST } = await import("../portal/login.js");

const ID = "7b0f6c2e-5d6a-4f0e-9a41-1f6f0e6c9a11";
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
  state.clients = [
    { id: ID, domain_name: "acmeplumbing.com", password_hash: await bcrypt.hash("correct horse", 4) },
  ];
});

describe("POST /api/portal/login", () => {
  it("signs in with the right password and sets a secure session cookie", async () => {
    const res = await login({ domain: "acmeplumbing.com", password: "correct horse" });
    expect(res.status).toBe(200);
    const cookie = res.headers.get("set-cookie") ?? "";
    expect(cookie).toContain("portal_session=");
    expect(cookie).toMatch(/HttpOnly/);
    expect(cookie).toMatch(/Secure/);
    expect(cookie).toMatch(/SameSite=Lax/);
    expect(state.attempts).toEqual([{ domain: "acmeplumbing.com", success: true }]);
  });

  it.each(["https://www.AcmePlumbing.com/", "WWW.ACMEPLUMBING.COM", "http://acmeplumbing.com/about"])(
    "matches the domain case-insensitively and ignores scheme/www/path: %s",
    async (domain) => {
      const res = await login({ domain, password: "correct horse" });
      expect(res.status).toBe(200);
      expect(state.lookups).toEqual(["acmeplumbing.com"]);
    },
  );

  it("rejects a wrong password with a generic message and no cookie", async () => {
    const res = await login({ domain: "acmeplumbing.com", password: "wrong" });
    expect(res.status).toBe(401);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(await res.json()).toMatchObject({ code: "invalid_credentials", error: "Invalid domain or password." });
    expect(state.attempts).toEqual([{ domain: "acmeplumbing.com", success: false }]);
  });

  it("answers an unknown domain exactly like a wrong password", async () => {
    const wrong = await login({ domain: "acmeplumbing.com", password: "wrong" });
    const unknown = await login({ domain: "nobody.example", password: "wrong" });
    expect(unknown.status).toBe(wrong.status);
    expect(await unknown.json()).toEqual(await wrong.json());
  });

  it("rejects input that is not a domain without querying the database", async () => {
    const res = await login({ domain: "not a domain", password: "whatever" });
    expect(res.status).toBe(401);
    expect(state.lookups).toEqual([]);
  });

  it("returns 429 when throttled, before checking any password", async () => {
    state.throttled = true;
    const res = await login({ domain: "acmeplumbing.com", password: "correct horse" });
    expect(res.status).toBe(429);
    expect(res.headers.get("set-cookie")).toBeNull();
    expect(state.lookups).toEqual([]);
  });

  it("requires a JSON body", async () => {
    expect((await login("domain=acmeplumbing.com&password=x", "application/x-www-form-urlencoded")).status).toBe(400);
    expect((await login("{not json")).status).toBe(400);
  });

  it("rejects missing fields and oversized passwords", async () => {
    expect((await login({ domain: "acmeplumbing.com" })).status).toBe(401);
    expect((await login({ password: "x" })).status).toBe(401);
    expect((await login({ domain: "acmeplumbing.com", password: "x".repeat(500) })).status).toBe(401);
  });
});
