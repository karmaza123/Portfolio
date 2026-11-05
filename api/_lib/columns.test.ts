import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CLIENT_COLUMNS } from "./columns.js";

const sql = readFileSync(new URL("../../supabase/migrations/0001_client_portal.sql", import.meta.url), "utf8");
const grant = /grant select \(([^)]+)\)\s+on public\.clients to authenticated/i.exec(sql);
const granted = grant?.[1]?.split(",").map((c) => c.trim()) ?? [];
const requested = CLIENT_COLUMNS.split(",").map((c) => c.trim());

describe("client column grants", () => {
  it("finds the grant in the migration", () => {
    expect(granted.length).toBeGreaterThan(0);
  });

  it("requests exactly the columns clients are granted", () => {
    expect([...requested].sort()).toEqual([...granted].sort());
  });

  it("never exposes secrets to clients", () => {
    for (const secret of ["password_hash", "stripe_customer_id", "stripe_subscription_id"]) {
      expect(granted).not.toContain(secret);
    }
  });
});
