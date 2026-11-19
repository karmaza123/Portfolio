import { describe, expect, it } from "vitest";
import { normalizeDomain } from "./domain.js";

describe("normalizeDomain", () => {
  it.each([
    ["acmeplumbing.com", "acmeplumbing.com"],
    ["AcmePlumbing.COM", "acmeplumbing.com"],
    ["  acmeplumbing.com  ", "acmeplumbing.com"],
    ["http://acmeplumbing.com", "acmeplumbing.com"],
    ["https://acmeplumbing.com", "acmeplumbing.com"],
    ["https://www.AcmePlumbing.com/contact?x=1#top", "acmeplumbing.com"],
    ["www.acmeplumbing.com", "acmeplumbing.com"],
    ["acmeplumbing.com/", "acmeplumbing.com"],
    ["acmeplumbing.com:8080", "acmeplumbing.com"],
    ["acmeplumbing.com.", "acmeplumbing.com"],
    ["shop.acmeplumbing.co.uk", "shop.acmeplumbing.co.uk"],
    ["https://user:pw@acmeplumbing.com", "acmeplumbing.com"],
  ])("normalizes %j to %j", (input, expected) => {
    expect(normalizeDomain(input)).toBe(expected);
  });

  it("converts internationalised names to punycode", () => {
    expect(normalizeDomain("https://www.bücher.de")).toBe("xn--bcher-kva.de");
  });

  it.each(["", "   ", "localhost", "not a domain", "acme", "http://", "-bad-.com", "a..com", "x".repeat(400) + ".com"])(
    "rejects %j",
    (input) => {
      expect(normalizeDomain(input)).toBeNull();
    },
  );
});
