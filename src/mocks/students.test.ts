import { describe, expect, it } from "vitest";
import { showUnder30Warning, parseStudentFilters } from "@/lib/students";
import { getStudentDirectory, getStudentAccount, listCashTransactions } from "./services";

describe("student accounts", () => {
  it("shows under-30 only for a known group start on or before snapshot date", () => {
    expect(showUnder30Warning(null, "2026-11-03", true)).toBe(false);
    expect(showUnder30Warning("2026-11-15", "2026-11-03", true)).toBe(false);
    expect(showUnder30Warning("2026-11-03", "2026-11-03", true)).toBe(true);
    expect(showUnder30Warning("2026-09-01", "2026-11-03", false)).toBe(false);
  });
  it("returns concrete literal balances excluding pending, draft and rejected requests", async () => {
    const data = await getStudentDirectory({ role: "admin" });
    expect(data.profiles.map((p) => [p.student.id, p.summary.paidAmount, p.summary.remainingAmount])).toEqual([
      ["s1", 1_500_000, 3_000_000], ["s2", 400_000, 4_100_000], ["s3", 1_000_000, 3_800_000], ["s4", 0, 6_200_000], ["s5", 700_000, 3_500_000],
    ]);
    expect(data.profiles.filter((p) => p.under30Warning).map((p) => p.student.id)).toEqual(["s2", "s5"]);
  });
  it("salary credit appears once and links the preserved organization debt without cash", async () => {
    const data = await getStudentDirectory({ role: "admin" });
    const nilufar = data.profiles.find((p) => p.student.id === "s5");
    expect(nilufar?.entries).toHaveLength(1);
    expect(nilufar?.entries[0]?.entry.amount).toBe(700_000);
    expect(nilufar?.entries[0]?.settlementMethod).toBe("salary_deduction");
    expect(nilufar?.entries[0]?.preservedDebtId).toBe("d5");
    expect((await listCashTransactions()).some((t) => t.relatedDebtId === "d4")).toBe(false);
  });
  it("reflects the backdated cash payment with separate effective and creation dates", async () => {
    const account = await getStudentAccount({ role: "admin" }, "s3");
    expect(account?.entries[0]?.amount).toBe(1_000_000);
    expect(account?.entries[0]?.effectiveDate).toBe("2026-10-12");
    expect(account?.entries[0]?.createdAt).toBe("2026-10-21T06:00:00Z");
  });
  it("demonstration mentor directory contains only their students and groups", async () => {
    const data = await getStudentDirectory({ role: "mentor", mentorId: "m1" });
    expect(data.profiles.map((p) => p.student.id)).toEqual(["s1", "s2", "s4"]);
    expect(data.groups.map((g) => g.id)).toEqual(["g1", "g3"]);
    expect(parseStudentFilters({ q: 4, student: null })).toEqual({ q: "", group: "all", student: "" });
  });
});