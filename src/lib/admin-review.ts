import type { PaymentStatus, RequestFilters, RequestReviewDecision, UserFilters, UserStatus } from "@/types/domain";

export const requestStatuses = ["draft", "pending", "approved", "rejected"] as const;
export const userStatuses = ["pending_approval", "active", "blocked"] as const;
export const userRoles = ["admin", "mentor"] as const;

export function parseRequestFilters(raw: Record<string, unknown>): RequestFilters {
  return { q: typeof raw['q'] === "string" ? raw['q'].slice(0, 200) : "", status: raw['status'] === "all" ? "all" : requestStatuses.find((s) => s === raw['status']) ?? "pending" };
}
export function parseUserFilters(raw: Record<string, unknown>): UserFilters {
  return { q: typeof raw['q'] === "string" ? raw['q'].slice(0, 200) : "", status: userStatuses.find((s) => s === raw['status']) ?? "all", role: userRoles.find((r) => r === raw['role']) ?? "all" };
}
/** Demo input constraints, not production permission checks. */
export function canReviewRequest(status: PaymentStatus, decision: RequestReviewDecision, comment: string) {
  return status === "pending" && (decision === "approved" || (decision === "rejected" && comment.trim().length > 0));
}
export function canPreviewUserStatus(current: UserStatus, proposed: UserStatus) {
  return (current === "pending_approval" && proposed === "active")
    || (current === "active" && proposed === "blocked")
    || (current === "blocked" && proposed === "active");
}