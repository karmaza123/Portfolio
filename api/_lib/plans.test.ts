import { describe, expect, it } from "vitest";
import { billingStatusFor, fromUnix, PLAN_DEFAULTS, planForPrice } from "./plans.js";

const prices = { retainer: "price_r", batch: "price_b", handover: "price_h" };

describe("planForPrice", () => {
  it("maps each configured price to its plan", () => {
    expect(planForPrice("price_r", prices)).toBe("retainer");
    expect(planForPrice("price_b", prices)).toBe("batch");
    expect(planForPrice("price_h", prices)).toBe("handover");
  });

  it("returns null for unknown or missing prices", () => {
    expect(planForPrice("price_other", prices)).toBeNull();
    expect(planForPrice(undefined, prices)).toBeNull();
    expect(planForPrice(null, prices)).toBeNull();
  });

  it("never matches an unset env var against an undefined price", () => {
    expect(planForPrice("price_r", { retainer: undefined, batch: undefined, handover: undefined })).toBeNull();
  });
});

describe("plan defaults", () => {
  it("matches the three offers", () => {
    expect(PLAN_DEFAULTS.retainer).toEqual({ planType: "subscription", editLimit: 10 });
    expect(PLAN_DEFAULTS.batch).toEqual({ planType: "pay_as_you_go", editLimit: 5 });
    expect(PLAN_DEFAULTS.handover).toEqual({ planType: "cms_handover", editLimit: 0 });
  });
});

describe("billingStatusFor", () => {
  it.each([
    ["active", "active"],
    ["trialing", "active"],
    ["past_due", "past_due"],
    ["unpaid", "past_due"],
    ["canceled", "canceled"],
    ["incomplete_expired", "canceled"],
  ])("%s -> %s", (stripe, expected) => {
    expect(billingStatusFor(stripe)).toBe(expected);
  });
});

describe("fromUnix", () => {
  it("converts seconds to an ISO string", () => {
    expect(fromUnix(1_700_000_000)).toBe("2023-11-14T22:13:20.000Z");
    expect(fromUnix(undefined)).toBeNull();
  });
});
