import { describe, expect, it } from "vitest";
import { formLockReason, quotaSummary } from "./quota";

const sub = (editsUsed: number, monthlyEditLimit = 10) => ({
  planType: "subscription" as const,
  billingStatus: "active" as const,
  monthlyEditLimit,
  editsUsed,
});

describe("quotaSummary", () => {
  it("describes the retainer monthly", () => {
    expect(quotaSummary(sub(4))).toMatchObject({
      tracked: true,
      used: 4,
      limit: 10,
      remaining: 6,
      percent: 40,
      tone: "ok",
      exhausted: false,
      label: "4 / 10 edits used this month",
    });
  });

  it("warns from 70% and marks 100% as full and exhausted", () => {
    expect(quotaSummary(sub(7))).toMatchObject({ tone: "warn", exhausted: false });
    expect(quotaSummary(sub(10))).toMatchObject({ tone: "full", exhausted: true, remaining: 0, percent: 100 });
  });

  it("never reports negative remaining or more than 100%", () => {
    expect(quotaSummary(sub(14))).toMatchObject({ remaining: 0, percent: 100 });
  });

  it("words a batch as a pool, not a month", () => {
    const q = quotaSummary({ planType: "pay_as_you_go", monthlyEditLimit: 5, editsUsed: 2 });
    expect(q).toMatchObject({ tracked: true, label: "2 / 5 edits used in this batch" });
  });

  it("does not track the DIY plan", () => {
    expect(quotaSummary({ planType: "cms_handover", monthlyEditLimit: 0, editsUsed: 0 })).toEqual({ tracked: false });
  });

  it("treats a zero limit as already full", () => {
    expect(quotaSummary(sub(0, 0))).toMatchObject({ exhausted: true, percent: 100 });
  });
});

describe("formLockReason", () => {
  it("is open while edits remain", () => {
    expect(formLockReason(sub(9))).toBeNull();
  });

  it("locks for an exhausted retainer, naming the reset", () => {
    expect(formLockReason(sub(10))).toMatch(/reset when your plan renews/);
  });

  it("locks for an exhausted batch, pointing to a new one", () => {
    const reason = formLockReason({ planType: "pay_as_you_go", billingStatus: "active", monthlyEditLimit: 5, editsUsed: 5 });
    expect(reason).toMatch(/Buy another batch/);
  });

  it("locks the DIY plan and canceled billing", () => {
    expect(formLockReason({ planType: "cms_handover", billingStatus: "active", monthlyEditLimit: 0, editsUsed: 0 })).toMatch(/self-managed/);
    expect(formLockReason({ ...sub(0), billingStatus: "canceled" })).toMatch(/Billing is inactive/);
  });
});
