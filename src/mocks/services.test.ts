import { describe, expect, it } from "vitest";
import {
  getStudentAccount,
  listCashTransactions,
  listDebts,
  listMentorTransactions,
  listStudents,
} from "./services";
import { cashTransactions, settlements } from "./data";

const m1 = { role: "mentor", mentorId: "m1" } as const;

describe("mentor scoping", () => {
  it("returns only the mentor's own students", async () => {
    const list = await listStudents(m1);
    expect(list.map((s) => s.id).sort()).toEqual(["s1", "s2", "s4"]);
  });
  it("never returns organization/transit or other mentors' debts", async () => {
    const list = await listDebts(m1);
    expect(list.map((d) => d.id)).toEqual(["d2"]);
  });
  it("denies another mentor's student account", async () => {
    expect(await getStudentAccount(m1, "s3")).toBeNull();
  });
  it("returns only the mentor's own transactions", async () => {
    const list = await listMentorTransactions("m1");
    expect(list.every((t) => t.mentorId === "m1")).toBe(true);
  });
});

describe("effective-date filtering", () => {
  it("excludes a backdated entry from today's report", async () => {
    const today = await listCashTransactions({ from: "2026-10-21", to: "2026-10-21" });
    expect(today.map((t) => t.id)).toEqual(["c4"]);
  });
  it("includes it on its effective date", async () => {
    const list = await listCashTransactions({ from: "2026-10-12", to: "2026-10-12" });
    expect(list.map((t) => t.id)).toEqual(["c2"]);
  });
});

describe("salary deduction mock example", () => {
  it("credits the student, preserves the organization debt, and creates no cash entry", async () => {
    const st = settlements.find((s) => s.method === "salary_deduction")!;
    expect(st.effects.cashTransactionId).toBeUndefined();
    expect(st.effects.studentAccountEntryId).toBe("ae3");
    const preserved = (await listDebts({ role: "admin" })).find((d) => d.id === st.effects.preservedOrganizationDebtId)!;
    expect(preserved.status).toBe("open");
    expect(preserved.outstandingAmount).toBe(700_000);
    expect(cashTransactions.some((t) => t.type === "salary_deduction")).toBe(false);
  });
});
