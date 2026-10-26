import { describe, expect, it } from "vitest";
import { getAdminDashboard } from "./services";

describe("admin dashboard demonstration contract", () => {
  it("keeps salary deduction separate from cash income and preserves organization debt", async () => {
    const dashboard = await getAdminDashboard();
    expect(dashboard.summary.cashIn).toBe(3_300_000);
    expect(dashboard.summary.outstandingDebt).toBe(5_000_000);
    const salary = dashboard.recentOperations.find((op) => op.kind === "internal" && op.settlement.method === "salary_deduction");
    expect(salary?.kind).toBe("internal");
    if (salary?.kind !== "internal") throw new Error("Missing salary fixture");
    expect(salary.settlement.effects.cashTransactionId).toBeUndefined();
    expect(salary.settlement.effects.preservedOrganizationDebtId).toBe("d5");
    expect(salary.settlement.effects.studentAccountEntryId).toBe("ae3");
  });

  it("does not count organization-budget settlement as new cash", async () => {
    const dashboard = await getAdminDashboard();
    const budget = dashboard.recentOperations.find((op) => op.kind === "internal" && op.settlement.method === "organization_budget");
    expect(budget?.kind).toBe("internal");
    expect(dashboard.summary.cashOut).toBe(500_000);
    expect(dashboard.summary.cashBalance).toBe(4_300_000);
  });

  it("orders report operations by effective date, not creation time", async () => {
    const dashboard = await getAdminDashboard();
    expect(dashboard.recentOperations.map((op) => op.kind === "cash" ? op.transaction.id : op.settlement.id)).toEqual(["c4", "st1", "c2", "c3", "st2"]);
    expect(dashboard.period).toEqual({ from: "2026-10-01", to: "2026-10-26" });
  });
});