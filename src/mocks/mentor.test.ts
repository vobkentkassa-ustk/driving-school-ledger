import { describe, expect, it } from "vitest";
import { getStudentDirectory, listDebtRows, listMentorRequests } from "./services";
import { draftFormErrors } from "@/lib/mentor";

describe("mentor workspace", () => {
  it("shows only m1's own requests, newest first", async () => {
    const rows = await listMentorRequests("m1");
    expect(rows.map((r) => r.request.id)).toEqual(["p5", "p6", "p2", "p1"]);
    expect(rows.every((r) => r.request.mentorId === "m1")).toBe(true);
  });
  it("shows only m1's students and own debts, never transit", async () => {
    const dir = await getStudentDirectory({ role: "mentor", mentorId: "m1" });
    expect(dir.profiles.map((p) => p.student.id).sort()).toEqual(["s1", "s2", "s4"]);
    const debts = await listDebtRows({ role: "mentor", mentorId: "m1" }, { q: "", category: "all", status: "all", debt: "" });
    expect(debts.every((d) => d.debtorType === "mentor" && d.debtorId === "m1")).toBe(true);
    expect(debts.some((d) => d.category === "organization_transit")).toBe(false);
  });
  it("draft form checks", () => {
    expect(draftFormErrors({ studentId: "", amount: "-5", date: "2026-02-30" })).toEqual({ studentId: true, amount: true, date: true });
    expect(draftFormErrors({ studentId: "s1", amount: "500000", date: "2026-11-02" })).toEqual({ studentId: false, amount: false, date: false });
  });
});
