import { describe, expect, it } from "vitest";
import { adminStats } from "./adminStats";
import type { AdminClient, AdminRequest } from "./types";

const NOW = Date.parse("2026-11-05T12:00:00Z");

const client = (over: Partial<AdminClient>): AdminClient => ({
  id: "c",
  companyName: "Co",
  domainName: "co.com",
  planType: "subscription",
  billingStatus: "active",
  currentPeriodEnd: null,
  monthlyEditLimit: 10,
  editsUsed: 0,
  hasBilling: true,
  createdAt: "2026-01-01T00:00:00Z",
  ...over,
});

const req = (over: Partial<AdminRequest>): AdminRequest => ({
  id: "r",
  clientId: "c",
  title: "t",
  description: "d",
  pageUrl: null,
  attachmentUrl: null,
  attachmentName: null,
  status: "pending",
  createdAt: "2026-11-01T00:00:00Z",
  completedAt: null,
  ...over,
});

describe("adminStats", () => {
  it("is all zeros with no data", () => {
    const s = adminStats({ clients: [], requests: [] }, NOW);
    expect(s.projects).toBe(0);
    expect(s.requests.total).toBe(0);
    expect(s.monthlyRecurringUsd).toBe(0);
  });

  it("counts projects by plan, edits and recurring revenue", () => {
    const s = adminStats(
      {
        clients: [
          client({ editsUsed: 4 }),
          client({ billingStatus: "past_due", editsUsed: 10 }),
          client({ planType: "pay_as_you_go", monthlyEditLimit: 5, editsUsed: 2 }),
          client({ planType: "cms_handover", monthlyEditLimit: 0 }),
        ],
        requests: [],
      },
      NOW,
    );
    expect(s.projects).toBe(4);
    expect(s.byPlan).toEqual({ subscription: 2, pay_as_you_go: 1, cms_handover: 1 });
    expect(s.edits).toEqual({ used: 16, limit: 25 });
    expect(s.needsAttention).toBe(1);
    expect(s.monthlyRecurringUsd).toBe(30);
  });

  it("counts requests by status and recent completions", () => {
    const s = adminStats(
      {
        clients: [],
        requests: [
          req({ status: "pending" }),
          req({ status: "in_progress" }),
          req({ status: "completed", completedAt: "2026-11-01T00:00:00Z" }),
          req({ status: "completed", completedAt: "2026-08-01T00:00:00Z" }),
          req({ status: "declined" }),
        ],
      },
      NOW,
    );
    expect(s.requests).toMatchObject({ total: 5, open: 2, pending: 1, in_progress: 1, completed: 2, declined: 1 });
    expect(s.completedLast30Days).toBe(1);
  });
});
