import type { CashLedgerFilters, CashLedgerFilterType } from "@/types/domain";

export const cashLedgerTypes: readonly CashLedgerFilterType[] = ["all", "cash_in", "cash_out", "student_payment", "mentor_repayment", "adjustment", "reversal"];

export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function parseLedgerFilters(search: Record<string, unknown>): CashLedgerFilters {
  const type = cashLedgerTypes.find((type) => type === search['type']) ?? "all";
  return {
    q: typeof search['q'] === "string" ? search['q'].slice(0, 200) : "",
    from: typeof search['from'] === "string" && isCalendarDate(search['from']) ? search['from'] : "",
    to: typeof search['to'] === "string" && isCalendarDate(search['to']) ? search['to'] : "",
    type,
  };
}

/** UI input checks only; no financial calculation or posting. */
export function validDemoCashAmount(value: string): boolean {
  return /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0;
}