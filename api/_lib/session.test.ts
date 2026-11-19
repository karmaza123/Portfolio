import { SignJWT } from "jose";
import { describe, expect, it } from "vitest";
import { clearedSessionCookie, readCookie, sessionCookie, signSession, verifySession } from "./session.js";

const SECRET = "test-secret-at-least-32-characters-long!!";
const CLIENT = "7b0f6c2e-5d6a-4f0e-9a41-1f6f0e6c9a11";

describe("session token", () => {
  it("round-trips the client id", async () => {
    const token = await signSession(CLIENT, SECRET);
    expect(await verifySession(token, SECRET)).toBe(CLIENT);
  });

  it("is a Supabase-compatible JWT: authenticated role and client_id claim", async () => {
    const token = await signSession(CLIENT, SECRET);
    const claims = JSON.parse(Buffer.from(token.split(".")[1]!, "base64url").toString());
    expect(claims).toMatchObject({ role: "authenticated", aud: "authenticated", sub: CLIENT, client_id: CLIENT });
    expect(claims.exp).toBeGreaterThan(claims.iat);
  });

  it("rejects a token signed with another secret", async () => {
    const token = await signSession(CLIENT, "a-completely-different-secret-value-here");
    expect(await verifySession(token, SECRET)).toBeNull();
  });

  it("rejects an expired token", async () => {
    const expired = await new SignJWT({ role: "authenticated", client_id: CLIENT })
      .setProtectedHeader({ alg: "HS256" })
      .setAudience("authenticated")
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(new TextEncoder().encode(SECRET));
    expect(await verifySession(expired, SECRET)).toBeNull();
  });

  it("rejects a token without a client_id, and garbage", async () => {
    const noClaim = await new SignJWT({ role: "authenticated" })
      .setProtectedHeader({ alg: "HS256" })
      .setAudience("authenticated")
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(SECRET));
    expect(await verifySession(noClaim, SECRET)).toBeNull();
    expect(await verifySession("not.a.jwt", SECRET)).toBeNull();
    expect(await verifySession("", SECRET)).toBeNull();
  });

  it("rejects an unsigned (alg=none) token", async () => {
    const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const forged = `${b64({ alg: "none", typ: "JWT" })}.${b64({ role: "authenticated", aud: "authenticated", client_id: CLIENT })}.`;
    expect(await verifySession(forged, SECRET)).toBeNull();
  });
});

describe("cookies", () => {
  it("reads a named cookie among others", () => {
    expect(readCookie("a=1; portal_session=tok%20en; b=2", "portal_session")).toBe("tok en");
    expect(readCookie("a=1", "portal_session")).toBeNull();
    expect(readCookie(null, "portal_session")).toBeNull();
  });

  it("sets the session cookie HttpOnly, Secure and SameSite=Lax", () => {
    const cookie = sessionCookie("abc");
    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Path=/");
  });

  it("clears the cookie by expiring it", () => {
    expect(clearedSessionCookie()).toContain("Max-Age=0");
  });
});
