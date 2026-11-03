import type { StudentFilters } from "@/types/domain";

export function parseStudentFilters(search: Record<string, unknown>): StudentFilters {
  return {
    q: typeof search['q'] === "string" ? search['q'].slice(0, 200) : "",
    group: typeof search['group'] === "string" ? search['group'].slice(0, 100) : "all",
    student: typeof search['student'] === "string" ? search['student'].slice(0, 100) : "",
  };
}

/** Display eligibility only. Threshold flag comes from the adapter, not client-side money arithmetic. */
export function showUnder30Warning(startDate: string | null, asOfDate: string, paidBelow30Percent: boolean): boolean {
  return startDate !== null && startDate <= asOfDate && paidBelow30Percent;
}