/**
 * Typed async mock services (read-only). Screens call these, never the raw arrays.
 * Swap for a real API adapter later with the same signatures. No financial writes here.
 */
import type {
  CashTransaction,
  DateRange,
  DebtSettlement,
  DebtViewModel,
  Group,
  PaymentRequest,
  Student,
  StudentAccountEntry,
  ViewerScope,
} from "@/types/domain";
import * as db from "./data";

const delay = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

const inRange = (date: string, range?: DateRange) =>
  (!range?.from || date >= range.from) && (!range?.to || date <= range.to);

export function listGroups(scope: ViewerScope): Promise<Group[]> {
  return delay(scope.role === "admin" ? db.groups : db.groups.filter((g) => g.mentorId === scope.mentorId));
}

export function listStudents(scope: ViewerScope): Promise<Student[]> {
  return delay(scope.role === "admin" ? db.students : db.students.filter((s) => s.mentorId === scope.mentorId));
}

export function listPaymentRequests(scope: ViewerScope): Promise<PaymentRequest[]> {
  return delay(scope.role === "admin" ? db.paymentRequests : db.paymentRequests.filter((p) => p.mentorId === scope.mentorId));
}

/** Mentors see only debts where they are the debtor. Never organization/transit or other mentors' debts. */
export function listDebts(scope: ViewerScope): Promise<DebtViewModel[]> {
  if (scope.role === "admin") return delay(db.debts);
  return delay(
    db.debts.filter(
      (d) => d.debtorType === "mentor" && d.debtorId === scope.mentorId && d.category !== "organization_transit",
    ),
  );
}

export function listSettlements(debtId: string): Promise<DebtSettlement[]> {
  return delay(db.settlements.filter((s) => s.debtId === debtId));
}

/** Admin only. Filters by effectiveDate (reports), never createdAt. */
export function listCashTransactions(range?: DateRange): Promise<CashTransaction[]> {
  return delay(db.cashTransactions.filter((t) => inRange(t.effectiveDate, range)));
}

export function listMentorTransactions(mentorId: string, range?: DateRange): Promise<CashTransaction[]> {
  return delay(db.cashTransactions.filter((t) => t.mentorId === mentorId && inRange(t.effectiveDate, range)));
}

export async function getStudentAccount(
  scope: ViewerScope,
  studentId: string,
): Promise<{ student: Student; entries: StudentAccountEntry[] } | null> {
  const student = db.students.find((s) => s.id === studentId);
  if (!student) return null;
  if (scope.role === "mentor" && student.mentorId !== scope.mentorId) return null;
  return delay({ student, entries: db.studentAccountEntries.filter((e) => e.studentId === studentId) });
}
