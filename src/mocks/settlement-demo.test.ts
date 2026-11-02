import { describe, expect, it } from "vitest";
import { createSubmissionGate, settlementAmountError } from "@/lib/settlement-demo";
import { confirmSettlementDemo, listSettlementDemoScenarios, previewSettlementDemo, listDebts, listCashTransactions } from "./services";

describe("isolated settlement demonstration", () => {
  it("rejects empty, zero, negative, fractional and over-balance input", async () => {
    const scenario = (await listSettlementDemoScenarios())[0];
    if (!scenario) throw new Error("Missing scenario");
    expect(settlementAmountError("", scenario)).toBe("required");
    for (const value of ["0", "-1", "1.5"]) expect(settlementAmountError(value, scenario)).toBe("positive");
    expect(settlementAmountError("500001", scenario)).toBe("exceeds");
    expect(settlementAmountError("200000", scenario)).toBeNull();
    expect(settlementAmountError("500000", scenario)).toBeNull();
    expect(settlementAmountError("100000", scenario)).toBe("unsupported");
  });
  it("full and partial personal repayment use separate cash snapshots", async () => {
    expect((await previewSettlementDemo("personal_repayment", "200000"))?.debt.outstandingAmount).toBe(300_000);
    const full = await previewSettlementDemo("personal_repayment", "500000");
    expect(full?.debt.outstandingAmount).toBe(0);
    expect(full?.cashTransaction?.cashIn).toBe(500_000);
    expect(full?.preservedDebt).toBeNull();
  });
  it("salary deduction credits linked student and preserves organization debt without cash", async () => {
    const partial = await previewSettlementDemo("salary_deduction", "300000");
    expect(partial?.studentCredit?.studentId).toBe("s5");
    expect(partial?.studentCredit?.amount).toBe(300_000);
    expect(partial?.preservedDebt?.outstandingAmount).toBe(300_000);
    expect(partial?.preservedDebt?.status).toBe("open");
    expect(partial?.debt.outstandingAmount).toBe(400_000);
    expect(partial?.cashTransaction).toBeNull();
    expect(partial?.settlement.effects.cashTransactionId).toBeUndefined();
    expect((await previewSettlementDemo("salary_deduction", "700000"))?.preservedDebt?.outstandingAmount).toBe(700_000);
  });
  it("organization budget credits student without new cash income", async () => {
    const result = await previewSettlementDemo("organization_budget", "400000");
    expect(result?.studentCredit?.amount).toBe(400_000);
    expect(result?.debt.outstandingAmount).toBe(400_000);
    expect(result?.cashTransaction).toBeNull();
  });
  it("success, failure and stale outcomes never change underlying debts or cash", async () => {
    const before = await listDebts({ role: "admin" });
    const cash = await listCashTransactions();
    const result = await previewSettlementDemo("salary_deduction", "700000");
    if (!result) throw new Error("Missing snapshot");
    expect((await confirmSettlementDemo(result, "success")).result?.studentCredit?.amount).toBe(700_000);
    expect((await confirmSettlementDemo(result, "failure")).result).toBeNull();
    expect((await confirmSettlementDemo(result, "stale")).result).toBeNull();
    expect(await listDebts({ role: "admin" })).toEqual(before);
    expect(await listCashTransactions()).toEqual(cash);
  });
  it("blocks duplicate submission until the first finishes", () => {
    const gate = createSubmissionGate();
    expect(gate.enter()).toBe(true);
    expect(gate.enter()).toBe(false);
    gate.leave();
    expect(gate.enter()).toBe(true);
  });
});