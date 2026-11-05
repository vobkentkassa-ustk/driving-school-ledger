import { isCalendarDate, validDemoCashAmount } from "@/lib/ledger";

/** Draft form input checks only; nothing is saved or sent. */
export function draftFormErrors(input: { studentId: string; amount: string; date: string }) {
  return { studentId: !input.studentId, amount: !validDemoCashAmount(input.amount), date: !isCalendarDate(input.date) };
}
