import { describe, expect, it } from "vitest";
import { listCashLedger } from "./services";
import { parseLedgerFilters, validDemoCashAmount } from "@/lib/ledger";

describe("cash ledger", () => {
  it("filters by effective date rather than entry time", async () => {
    const enteredDay = await listCashLedger(parseLedgerFilters({ from: "2026-10-21", to: "2026-10-21" }));
    expect(enteredDay.map((row) => row.transaction.id)).toEqual(["c4"]);
    const effectiveDay = await listCashLedger(parseLedgerFilters({ from: "2026-10-12", to: "2026-10-12" }));
    expect(effectiveDay.map((row) => row.transaction.id)).toEqual(["c2"]);
  });
  it("keeps non-cash settlements out of the cash ledger", async () => {
    const rows = await listCashLedger(parseLedgerFilters({}));
    expect(rows.map((r) => r.transaction.id)).toEqual(["c4", "c2", "c3", "c1"]);
    expect(rows.some((r) => r.transaction.type === "salary_deduction" || r.transaction.type === "debt_settlement")).toBe(false);
  });
  it("combines search, date and type and reset restores all rows", async () => {
    const rows = await listCashLedger(parseLedgerFilters({ q: "madina", type: "student_payment", from: "2026-10-01" }));
    expect(rows.map((r) => r.transaction.id)).toEqual(["c2"]);
    expect((await listCashLedger(parseLedgerFilters({ q: "madina", type: "cash_out" }))).length).toBe(0);
    expect((await listCashLedger(parseLedgerFilters({}))).length).toBe(4);
  });
  it("rejects invalid filter dates and non-cash types", () => {
    expect(parseLedgerFilters({ from: "2026-02-30", type: "salary_deduction" })).toEqual({ from: "", to: "", q: "", type: "all" });
  });
  it("accepts only positive safe integer amounts for the unsaved example", () => {
    expect(validDemoCashAmount("150000")).toBe(true);
    for (const value of ["", "0", "-1", "1.5", "NaN", "9007199254740992"]) expect(validDemoCashAmount(value)).toBe(false);
  });
});