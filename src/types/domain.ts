/**
 * Domain types (frontend phase). Money values are integer soʻm.
 * effectiveDate = business date used by reports; createdAt = when the record was entered.
 * Intentionally absent: monthly billing / recurring charges / invoices, and any debt-forgiveness status.
 */

export type ISODate = string; // "YYYY-MM-DD"
export type ISODateTime = string; // full ISO timestamp

export type UserRole = "admin" | "mentor";
export type UserStatus = "pending_approval" | "active" | "blocked";

export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  telegramUsername?: string;
  createdAt: ISODateTime;
}

export interface Mentor {
  id: string;
  userId: string;
  fullName: string;
}

export type GroupStatus = "upcoming" | "active" | "finished";

export interface Group {
  id: string;
  name: string;
  mentorId: string;
  contractPrice: number;
  /** null = start date unknown (no under-30% warning then). */
  startDate: ISODate | null;
  capacity: number;
  status: GroupStatus;
}

export interface Student {
  id: string;
  fullName: string;
  phone?: string;
  groupId: string;
  mentorId: string;
  /** Contract price snapshot at enrolment / last transfer. */
  contractAmount: number;
}

/** DRAFT → PENDING → APPROVED | REJECTED (enforced server-side later). */
export type PaymentStatus = "draft" | "pending" | "approved" | "rejected";
export type PaymentMethod = "cash" | "card" | "transfer";

export interface PaymentRequest {
  id: string;
  studentId: string;
  mentorId: string;
  grossAmount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  effectiveDate: ISODate;
  createdAt: ISODateTime;
  reviewComment?: string;
}

export type DebtStatus = "open" | "partially_settled" | "settled";
export type DebtorType = "student" | "mentor" | "organization";
export type DebtCategory = "student_related" | "mentor_advance" | "organization_transit" | "other";

/**
 * personal_repayment  — the mentor repays with their own cash.
 * salary_deduction    — NOT a personal cash repayment and NOT new cash income. The related debt
 *                       owed to the organization is preserved; where the original debt is
 *                       student-related, the linked student account is credited.
 * organization_budget — settled from money already in the organization budget; not new cash income.
 */
export type SettlementMethod = "personal_repayment" | "salary_deduction" | "organization_budget";

export interface DebtViewModel {
  id: string;
  debtorType: DebtorType;
  debtorId?: string;
  debtorName: string;
  relatedStudentId?: string;
  relatedStudentName?: string;
  relatedGroupName?: string;
  relatedMentorId?: string;
  category: DebtCategory;
  reason: string;
  originalAmount: number;
  settledAmount: number;
  outstandingAmount: number;
  status: DebtStatus;
  effectiveDate: ISODate;
  createdAt: ISODateTime;
  createdBy: string;
  /** Set when this debt is the organization debt preserved by a salary-deduction settlement. */
  originSettlementId?: string;
}

/** Settlement record as the future server returns it. Effects are supplied by the server, never computed here. */
export interface DebtSettlement {
  id: string;
  debtId: string;
  amount: number;
  method: SettlementMethod;
  effectiveDate: ISODate;
  createdAt: ISODateTime;
  createdBy: string;
  effects: {
    studentAccountEntryId?: string;
    /** Only personal_repayment may produce a cash transaction. */
    cashTransactionId?: string;
    /** salary_deduction only: the organization debt that stays open. */
    preservedOrganizationDebtId?: string;
  };
}

export type LedgerEntryType =
  | "cash_in"
  | "cash_out"
  | "student_payment"
  | "debt_settlement"
  | "mentor_repayment"
  | "salary_deduction"
  | "adjustment"
  | "reversal";

export interface CashTransaction {
  id: string;
  type: LedgerEntryType;
  description: string;
  cashIn: number;
  cashOut: number;
  effectiveDate: ISODate;
  createdAt: ISODateTime;
  relatedDebtId?: string;
  relatedStudentId?: string;
  mentorId?: string;
  createdBy: string;
}

export type StudentAccountEntryType = "payment" | "debt_settlement_credit" | "adjustment" | "reversal";

export interface StudentAccountEntry {
  id: string;
  studentId: string;
  type: StudentAccountEntryType;
  amount: number;
  description: string;
  effectiveDate: ISODate;
  createdAt: ISODateTime;
  relatedDebtId?: string;
  relatedSettlementId?: string;
  createdBy: string;
}

export type ViewerScope = { role: "admin" } | { role: "mentor"; mentorId: string };

export interface DateRange {
  from?: ISODate;
  to?: ISODate;
}
