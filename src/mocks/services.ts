/**
 * Typed async mock services (read-only). Screens call these, never the raw arrays.
 * Swap for a real API adapter later with the same signatures. No financial writes here.
 */
import type {
  AdminDashboard,
  CashTransaction,
  CashLedgerFilters,
  CashLedgerRow,
  DateRange,
  DebtDetail,
  DebtFilters,
  DebtSettlement,
  DebtViewModel,
  Group,
  PaymentRequest,
  Student,
  StudentAccountEntry,
  ViewerScope,
} from "@/types/domain";
import * as db from "./data";
import { uz } from "@/i18n/uz";

const delay = <T,>(value: T, ms = 120): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

const inRange = (date: string, range?: DateRange) =>
  (!range?.from || date >= range.from) && (!range?.to || date <= range.to);

/** Admin demonstration snapshot only. Financial totals are literal adapter-supplied fixtures. */
export function getAdminDashboard(): Promise<AdminDashboard> {
  const { period, summary } = db.dashboardSnapshot;
  const recentOperations: AdminDashboard["recentOperations"] = [
    ...db.cashTransactions.filter((t) => inRange(t.effectiveDate, period)).map((transaction) => ({ kind: "cash" as const, transaction })),
    ...db.settlements.filter((s) => inRange(s.effectiveDate, period)).map((settlement) => ({
      kind: "internal" as const,
      settlement,
      description: db.debts.find((d) => d.id === settlement.debtId)?.reason ?? "",
    })),
  ];
  recentOperations.sort((a, b) => {
    const dateA = a.kind === "cash" ? a.transaction.effectiveDate : a.settlement.effectiveDate;
    const dateB = b.kind === "cash" ? b.transaction.effectiveDate : b.settlement.effectiveDate;
    return dateB.localeCompare(dateA);
  });
  return delay({
    period, summary, recentOperations: recentOperations.slice(0, 6),
    groups: db.groups.map((group) => ({
      group,
      mentorName: db.mentors.find((m) => m.id === group.mentorId)?.fullName ?? "",
      studentCount: db.students.filter((s) => s.groupId === group.id).length,
    })),
  });
}

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

/** Demonstration scoping only; production access control belongs to the backend. */
export async function listDebtRows(scope: ViewerScope, filters: DebtFilters): Promise<DebtViewModel[]> {
  const rows = await listDebts(scope);
  const q = filters.q.trim().toLocaleLowerCase("uz");
  return rows.filter((d) => (filters.category === "all" || d.category === filters.category)
    && (filters.status === "all" || d.status === filters.status)
    && (!q || [d.id, d.debtorName, d.relatedStudentName, d.relatedGroupName, d.reason].join(" ").toLocaleLowerCase("uz").includes(q)))
    .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate) || b.createdAt.localeCompare(a.createdAt));
}

export async function getDebtDetail(scope: ViewerScope, debtId: string): Promise<DebtDetail | null> {
  const accessible = await listDebts(scope);
  const debt = accessible.find((d) => d.id === debtId);
  if (!debt) return null;
  const creatorName = (id: string) => db.users.find((u) => u.id === id)?.fullName ?? id;
  const originSettlement = db.settlements.find((s) => s.id === debt.originSettlementId);
  const sourceDebt = accessible.find((d) => d.id === originSettlement?.debtId);
  return delay({
    debt,
    createdByName: creatorName(debt.createdBy),
    mentorName: db.mentors.find((m) => m.id === debt.relatedMentorId)?.fullName ?? null,
    history: db.settlements.filter((s) => s.debtId === debt.id)
      .sort((a, b) => b.effectiveDate.localeCompare(a.effectiveDate) || b.createdAt.localeCompare(a.createdAt))
      .map((settlement) => ({
        settlement, createdByName: creatorName(settlement.createdBy),
        studentCredit: db.studentAccountEntries.find((e) => e.id === settlement.effects.studentAccountEntryId) ?? null,
        preservedDebt: accessible.find((d) => d.id === settlement.effects.preservedOrganizationDebtId) ?? null,
      })),
    origin: originSettlement && sourceDebt ? { settlement: originSettlement, sourceDebt } : null,
  });
}

/** Admin only. Filters by effectiveDate (reports), never createdAt. */
export function listCashTransactions(range?: DateRange): Promise<CashTransaction[]> {
  return delay(db.cashTransactions.filter((t) => inRange(t.effectiveDate, range)));
}

/** Cash-only ledger. Non-cash settlements never become cash transactions. */
export function listCashLedger(filters: CashLedgerFilters): Promise<CashLedgerRow[]> {
  const query = filters.q.trim().toLocaleLowerCase("uz");
  const rows: CashLedgerRow[] = db.cashTransactions.map((transaction) => ({
    transaction,
    studentName: db.students.find((s) => s.id === transaction.relatedStudentId)?.fullName ?? null,
    mentorName: db.mentors.find((m) => m.id === transaction.mentorId)?.fullName ?? null,
    createdByName: db.users.find((u) => u.id === transaction.createdBy)?.fullName ?? transaction.createdBy,
  }));
  return delay(rows.filter((row) => {
    const { transaction: t } = row;
    return inRange(t.effectiveDate, filters)
      && (filters.type === "all" || t.type === filters.type)
      && (!query || [t.id, t.description, row.studentName, row.mentorName, uz.ledgerType[t.type]].join(" ").toLocaleLowerCase("uz").includes(query));
  }).sort((a, b) => b.transaction.effectiveDate.localeCompare(a.transaction.effectiveDate) || b.transaction.createdAt.localeCompare(a.transaction.createdAt)));
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
