import type { DebtCategory, DebtFilters, DebtStatus } from "@/types/domain";

export const debtCategories: readonly DebtCategory[] = ["student_related", "mentor_advance", "organization_transit", "other"];
export const debtStatuses: readonly DebtStatus[] = ["open", "partially_settled", "settled"];

export function parseDebtFilters(search: Record<string, unknown>): DebtFilters {
  return {
    q: typeof search['q'] === "string" ? search['q'].slice(0, 200) : "",
    category: debtCategories.find((value) => value === search['category']) ?? "all",
    status: debtStatuses.find((value) => value === search['status']) ?? "all",
    debt: typeof search['debt'] === "string" ? search['debt'].slice(0, 100) : "",
  };
}