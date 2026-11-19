import { describe, expect, it } from "vitest";
import { signAdminSession, verifyAdminSession } from "./admin-session.js";
import { signSession } from "./session.js";

const SECRET = "admin-secret-that-is-long-enough-for-hs256";

describe("admin session", () => {
  it("accepts its own token", async () => {
    expect(await verifyAdminSession(await signAdminSession(SECRET), SECRET)).toBe(true);
  });

  it("rejects a token signed with another secret", async () => {
    expect(await verifyAdminSession(await signAdminSession("some-other-secret-value-1234567890"), SECRET)).toBe(false);
  });

  it("rejects a client session even when the secrets match", async () => {
    expect(await verifyAdminSession(await signSession("client-1", SECRET), SECRET)).toBe(false);
  });

  it("rejects garbage", async () => {
    expect(await verifyAdminSession("not-a-jwt", SECRET)).toBe(false);
  });
});
