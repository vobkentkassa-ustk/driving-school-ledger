import { describe, expect, it } from "vitest";
import { parseDebtFilters } from "@/lib/debts";
import { getDebtDetail, listDebtRows } from "./services";

const admin = { role: "admin" } as const;
describe("read-only debt list and detail", () => {
  it("combines category, status and debtor search", async () => {
    const rows = await listDebtRows(admin, parseDebtFilters({ category: "mentor_advance", status: "open", q: "Sardor" }));
    expect(rows.map((d) => d.id)).toEqual(["d5"]);
  });
  it("shows transit separately and clears filters to all five records", async () => {
    expect((await listDebtRows(admin, parseDebtFilters({ category: "organization_transit" }))).map((d) => d.id)).toEqual(["d3"]);
    expect((await listDebtRows(admin, parseDebtFilters({}))).map((d) => d.id)).toEqual(["d5", "d3", "d2", "d1", "d4"]);
  });
  it("returns literal partial settlement values and student credit, not cash income", async () => {
    const data = await getDebtDetail(admin, "d1");
    expect(data?.debt.originalAmount).toBe(1_200_000);
    expect(data?.debt.settledAmount).toBe(400_000);
    expect(data?.debt.outstandingAmount).toBe(800_000);
    expect(data?.history[0]?.studentCredit?.amount).toBe(400_000);
    expect(data?.history[0]?.settlement.method).toBe("organization_budget");
    expect(data?.history[0]?.settlement.effects.cashTransactionId).toBeUndefined();
  });
  it("salary deduction credits student and preserves a separate open organization debt", async () => {
    const data = await getDebtDetail(admin, "d4");
    const history = data?.history[0];
    expect(history?.settlement.method).toBe("salary_deduction");
    expect(history?.studentCredit?.studentId).toBe("s5");
    expect(history?.studentCredit?.amount).toBe(700_000);
    expect(history?.settlement.effects.cashTransactionId).toBeUndefined();
    expect(history?.preservedDebt?.id).toBe("d5");
    expect(history?.preservedDebt?.status).toBe("open");
    expect(history?.preservedDebt?.outstandingAmount).toBe(700_000);
    expect((await getDebtDetail(admin, "d5"))?.origin?.sourceDebt.id).toBe("d4");
  });
  it("denies detail for other mentor and organization debts in demonstration scope", async () => {
    const mentor = { role: "mentor", mentorId: "m1" } as const;
    expect(await getDebtDetail(mentor, "d4")).toBeNull();
    expect(await getDebtDetail(mentor, "d3")).toBeNull();
    expect((await getDebtDetail(mentor, "d2"))?.debt.id).toBe("d2");
  });
  it("returns null for missing detail and safely normalizes invalid URL values", async () => {
    expect(await getDebtDetail(admin, "missing")).toBeNull();
    expect(parseDebtFilters({ category: "forgiven", status: "deleted", debt: 7, q: null })).toEqual({ category: "all", status: "all", debt: "", q: "" });
  });
});