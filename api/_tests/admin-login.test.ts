import bcrypt from "bcryptjs";
import { beforeAll, describe, expect, it } from "vitest";
import { POST } from "../admin/login.js";

const PASSWORD = "correct-horse-battery";

const login = (password: string, ip = "1.1.1.1") =>
  POST(
    new Request("https://site.test/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ password }),
    }),
  );

describe("admin login (no database)", () => {
  beforeAll(async () => {
    process.env.ADMIN_PASSWORD_HASH = await bcrypt.hash(PASSWORD, 4);
    process.env.ADMIN_SESSION_SECRET = "admin-secret-that-is-long-enough-for-hs256";
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  });

  it("signs in with only the two admin variables set", async () => {
    const res = await login(PASSWORD);
    expect(res.status).toBe(200);
    expect(res.headers.get("set-cookie")).toMatch(/^portal_admin=.+HttpOnly/);
  });

  it("rejects a wrong password", async () => {
    const res = await login("nope", "2.2.2.2");
    expect(res.status).toBe(401);
  });

  it("blocks an address after repeated misses", async () => {
    for (let i = 0; i < 10; i++) await login("nope", "3.3.3.3");
    expect((await login(PASSWORD, "3.3.3.3")).status).toBe(429);
  }, 30_000);
});
