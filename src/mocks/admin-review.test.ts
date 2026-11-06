import { describe, expect, it } from "vitest";
import { canReviewRequest, canPreviewUserStatus, parseRequestFilters, parseUserFilters } from "@/lib/admin-review";
import { getAdminDashboard, getStudentDirectory, listAdminRequests, listAdminUsers, listCashTransactions, listDebts, previewRequestReview, previewUserStatus } from "./services";

describe("admin demonstrations", () => {
  it("defaults to pending and returns only p2 with its unchanged 800000 amount", async () => {
    const rows = await listAdminRequests(parseRequestFilters({}));
    expect(rows.map((r) => r.request.id)).toEqual(["p2"]);
    expect(rows[0]?.request.grossAmount).toBe(800_000);
    expect(rows[0]?.mentorName).toBe("Dilshod Rahimov");
  });
  it("combines request status/search filters and handles empty results", async () => {
    expect((await listAdminRequests({ q: "Aziza", status: "rejected" })).map((r) => r.request.id)).toEqual(["p6"]);
    expect(await listAdminRequests({ q: "missing", status: "all" })).toEqual([]);
    expect((await listAdminRequests({ q: "", status: "all" })).map((r) => r.request.id)).toEqual(["p5", "p6", "p3", "p2", "p4", "p1"]);
  });
  it("offers only pending review previews and checks the demo rejection comment", async () => {
    expect(canReviewRequest("pending", "rejected", "  ")).toBe(false);
    expect(await previewRequestReview("p2", "rejected", "  ")).toBeNull();
    const rejected = await previewRequestReview("p2", "rejected", " Sabab ");
    expect(rejected?.decision).toBe("rejected"); expect(rejected?.comment).toBe("Sabab");
    expect((await previewRequestReview("p2", "approved", ""))?.decision).toBe("approved");
    expect(await previewRequestReview("p1", "approved", "")).toBeNull();
    expect(await previewRequestReview("missing", "approved", "")).toBeNull();
  });
  it("shows user role/status/search combinations including the blocked sample", async () => {
    expect((await listAdminUsers({ q: "", role: "mentor", status: "pending_approval" })).map((u) => u.id)).toEqual(["u4"]);
    expect((await listAdminUsers({ q: "@umid".slice(1), role: "mentor", status: "blocked" })).map((u) => u.id)).toEqual(["u5"]);
    expect(await listAdminUsers({ q: "missing", role: "all", status: "all" })).toEqual([]);
  });
  it("limits isolated user previews to approve/block/unblock examples", async () => {
    expect(canPreviewUserStatus("pending_approval", "blocked")).toBe(false);
    expect((await previewUserStatus("u4", "active"))?.proposedStatus).toBe("active");
    expect((await previewUserStatus("u2", "blocked"))?.proposedStatus).toBe("blocked");
    expect((await previewUserStatus("u5", "active"))?.proposedStatus).toBe("active");
    expect(await previewUserStatus("missing", "active")).toBeNull();
  });
  it("never changes users, requests, cash, debts, accounts or dashboard through previews", async () => {
    const snapshot = async () => Promise.all([listAdminUsers(parseUserFilters({})), listAdminRequests({ q: "", status: "all" }), listCashTransactions(), listDebts({ role: "admin" }), getStudentDirectory({ role: "admin" }), getAdminDashboard()]);
    const before = await snapshot();
    await previewRequestReview("p2", "approved", ""); await previewRequestReview("p2", "rejected", "Sabab"); await previewUserStatus("u4", "active"); await previewUserStatus("u2", "blocked"); await previewUserStatus("u5", "active");
    expect(await snapshot()).toEqual(before);
  });
  it("normalizes invalid URL filter values safely", () => {
    expect(parseRequestFilters({ status: "bad", q: 1 })).toEqual({ q: "", status: "pending" });
    expect(parseUserFilters({ role: "owner", status: "bad", q: [] })).toEqual({ q: "", role: "all", status: "all" });
  });
});