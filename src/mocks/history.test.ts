import { describe, expect, it } from "vitest";
import { parseOperationFilters } from "@/lib/history";
import { getOperationHistoryDetail, listOperationHistory, previewRequestReview } from "./services";

describe("operation history demonstration", () => {
  it("filters by effective date, not creation time", async () => {
    const rows = await listOperationHistory(parseOperationFilters({ from: "2026-10-12", to: "2026-10-12" }));
    expect(rows.map((r) => r.id)).toEqual(["cash:c2"]);
    expect(rows[0]?.createdAt).toBe("2026-10-21T06:00:00Z");
    expect((await listOperationHistory(parseOperationFilters({ from: "2026-10-21", to: "2026-10-21" }))).map((r) => r.id)).toEqual(["cash:c4"]);
  });
  it("lists each cash/settlement once without double-counting account credits or requests", async () => {
    const rows = await listOperationHistory(parseOperationFilters({}));
    expect(rows.map((r) => r.id)).toEqual(["cash:c4", "internal:st1", "cash:c2", "cash:c3", "internal:st2", "cash:c1"]);
    expect((await listOperationHistory(parseOperationFilters({ kind: "cash" }))).length).toBe(4);
    expect((await listOperationHistory(parseOperationFilters({ kind: "internal", q: "nilufar", from: "2026-10-01" }))).map((r) => r.id)).toEqual(["internal:st1"]);
  });
  it("links salary deduction to one student credit and the preserved open organization debt, not cash", async () => {
    const detail = await getOperationHistoryDetail("internal:st1");
    expect(detail?.row.source.kind).toBe("internal");
    expect(detail?.debt?.id).toBe("d4");
    expect(detail?.studentCredit).toMatchObject({ id: "ae3", studentId: "s5", amount: 700_000 });
    expect(detail?.preservedDebt).toMatchObject({ id: "d5", status: "open", outstandingAmount: 700_000 });
    if (detail?.row.source.kind === "internal") expect(detail.row.source.settlement.effects.cashTransactionId).toBeUndefined();
    expect(detail?.events.map((e) => e.event.id)).toEqual(["a-st1"]);
  });
  it("keeps organization budget internal with its existing 400000 credit", async () => {
    const detail = await getOperationHistoryDetail("internal:st2");
    expect(detail?.row.source.kind).toBe("internal");
    expect(detail?.studentCredit).toMatchObject({ id: "ae2", amount: 400_000 });
    expect(detail?.preservedDebt).toBeNull();
  });
  it("returns isolated literal audit events and never logs an unsaved preview", async () => {
    const before = await getOperationHistoryDetail("cash:c2");
    expect(before?.events[0]?.event).toMatchObject({ id: "a-c2", effectiveDate: "2026-10-12", createdAt: "2026-10-21T06:00:00Z", createdBy: "u1" });
    const copy = await getOperationHistoryDetail("cash:c2");
    if (copy?.events[0]) copy.events[0].event.createdBy = "changed";
    await previewRequestReview("p2", "approved", "");
    expect(await getOperationHistoryDetail("cash:c2")).toEqual(before);
    expect((await listOperationHistory(parseOperationFilters({}))).length).toBe(6);
    expect(await getOperationHistoryDetail("missing")).toBeNull();
  });
  it("normalizes invalid URL filters and inverted dates return no rows", async () => {
    expect(parseOperationFilters({ kind: "salary_deduction", from: "2026-02-30", to: [], q: 42, operation: {} })).toEqual({ q: "", kind: "all", from: "", to: "", operation: "" });
    expect(await listOperationHistory(parseOperationFilters({ from: "2026-11-01", to: "2026-10-01" }))).toEqual([]);
    expect(await listOperationHistory(parseOperationFilters({ q: "missing" }))).toEqual([]);
  });
});