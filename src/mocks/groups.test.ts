import { describe, expect, it } from "vitest";
import { getGroupOverview } from "./services";
import { groupFormErrors, parseGroupFilters } from "@/lib/groups";

describe("groups", () => {
  it("unknown start date stays null for g3", async () => {
    const o = await getGroupOverview({ role: "admin" });
    expect(o.items.find((i) => i.group.id === "g3")?.group.startDate).toBeNull();
    expect(o.items.find((i) => i.group.id === "g1")?.studentCount).toBe(2);
  });
  it("transfer preview values are literal fixtures", async () => {
    const t = (await getGroupOverview({ role: "admin" })).transferDemos.find((d) => d.studentId === "s2");
    expect(t).toMatchObject({ oldContract: 4_500_000, newContract: 6_200_000, paidCarried: 400_000, newRemaining: 5_800_000 });
  });
  it("mentor sees only own groups and transfers between them", async () => {
    const o = await getGroupOverview({ role: "mentor", mentorId: "m1" });
    expect(o.items.map((i) => i.group.id)).toEqual(["g1", "g3"]);
    expect(o.transferDemos.map((d) => d.studentId)).toEqual(["s2"]);
  });
  it("filters and form checks", () => {
    expect(parseGroupFilters({ status: "bad" }).status).toBe("all");
    expect(parseGroupFilters({ status: "active" }).status).toBe("active");
    expect(groupFormErrors({ name: "", capacity: "0", mentorId: "" })).toEqual({ name: true, capacity: true, mentorId: true });
    expect(groupFormErrors({ name: "A", capacity: "25", mentorId: "m1" })).toEqual({ name: false, capacity: false, mentorId: false });
  });
});
