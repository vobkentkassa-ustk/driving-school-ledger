/** Mock data for visual verification only. Not persisted, not authoritative. Use via ./services. */
import type {
  CashTransaction,
  DebtSettlement,
  DebtViewModel,
  Group,
  Mentor,
  PaymentRequest,
  Student,
  StudentAccountEntry,
  User,
} from "@/types/domain";

export const users: User[] = [
  { id: "u1", fullName: "Jasur Karimov", role: "admin", status: "active", telegramUsername: "jasur_k", createdAt: "2026-01-10T06:00:00Z" },
  { id: "u2", fullName: "Dilshod Rahimov", role: "mentor", status: "active", telegramUsername: "dilshod_r", createdAt: "2026-01-12T06:00:00Z" },
  { id: "u3", fullName: "Sardor Tursunov", role: "mentor", status: "active", createdAt: "2026-02-01T06:00:00Z" },
  { id: "u4", fullName: "Bekzod Aliyev", role: "mentor", status: "pending_approval", createdAt: "2026-10-20T10:00:00Z" },
];

export const mentors: Mentor[] = [
  { id: "m1", userId: "u2", fullName: "Dilshod Rahimov" },
  { id: "m2", userId: "u3", fullName: "Sardor Tursunov" },
];

export const groups: Group[] = [
  { id: "g1", name: "B-toifa 12-guruh", mentorId: "m1", contractPrice: 4_500_000, startDate: "2026-09-01", capacity: 25, status: "active" },
  { id: "g2", name: "B-toifa 13-guruh", mentorId: "m2", contractPrice: 4_800_000, startDate: "2026-11-15", capacity: 25, status: "upcoming" },
  { id: "g3", name: "BC-toifa 4-guruh", mentorId: "m1", contractPrice: 6_200_000, startDate: null, capacity: 20, status: "upcoming" },
  { id: "g4", name: "B-toifa 9-guruh", mentorId: "m2", contractPrice: 4_200_000, startDate: "2026-04-10", capacity: 25, status: "finished" },
];

export const students: Student[] = [
  { id: "s1", fullName: "Aziza Yusupova", groupId: "g1", mentorId: "m1", contractAmount: 4_500_000, phone: "+998 90 123 45 67" },
  { id: "s2", fullName: "Otabek Nazarov", groupId: "g1", mentorId: "m1", contractAmount: 4_500_000 },
  { id: "s3", fullName: "Madina Ergasheva", groupId: "g2", mentorId: "m2", contractAmount: 4_800_000 },
  { id: "s4", fullName: "Shohruh Qodirov", groupId: "g3", mentorId: "m1", contractAmount: 6_200_000 },
  { id: "s5", fullName: "Nilufar Xolmatova", groupId: "g4", mentorId: "m2", contractAmount: 4_200_000 },
];

export const paymentRequests: PaymentRequest[] = [
  { id: "p1", studentId: "s1", mentorId: "m1", grossAmount: 1_500_000, method: "cash", status: "approved", effectiveDate: "2026-09-03", createdAt: "2026-09-03T08:00:00Z" },
  { id: "p2", studentId: "s2", mentorId: "m1", grossAmount: 800_000, method: "card", status: "pending", effectiveDate: "2026-10-20", createdAt: "2026-10-20T09:30:00Z" },
  { id: "p3", studentId: "s3", mentorId: "m2", grossAmount: 2_000_000, method: "transfer", status: "draft", effectiveDate: "2026-10-21", createdAt: "2026-10-21T07:15:00Z" },
  { id: "p4", studentId: "s5", mentorId: "m2", grossAmount: 600_000, method: "cash", status: "rejected", effectiveDate: "2026-10-18", createdAt: "2026-10-18T11:00:00Z", reviewComment: "Summa kvitansiyaga mos emas" },
];

export const debts: DebtViewModel[] = [
  {
    id: "d1", debtorType: "student", debtorId: "s2", debtorName: "Otabek Nazarov",
    relatedStudentId: "s2", relatedStudentName: "Otabek Nazarov", relatedGroupName: "B-toifa 12-guruh", relatedMentorId: "m1",
    category: "student_related", reason: "Imtihon to'lovi kechiktirildi",
    originalAmount: 1_200_000, settledAmount: 400_000, outstandingAmount: 800_000, status: "partially_settled",
    effectiveDate: "2026-09-20", createdAt: "2026-09-20T10:00:00Z", createdBy: "u1",
  },
  {
    id: "d2", debtorType: "mentor", debtorId: "m1", debtorName: "Dilshod Rahimov", relatedMentorId: "m1",
    category: "mentor_advance", reason: "Yoqilg'i uchun avans",
    originalAmount: 500_000, settledAmount: 0, outstandingAmount: 500_000, status: "open",
    effectiveDate: "2026-10-05", createdAt: "2026-10-05T12:00:00Z", createdBy: "u1",
  },
  {
    id: "d3", debtorType: "organization", debtorName: "Avtomaktab", category: "organization_transit",
    reason: "YHXBga imtihon to'lovi tranziti",
    originalAmount: 3_000_000, settledAmount: 0, outstandingAmount: 3_000_000, status: "open",
    effectiveDate: "2026-10-10", createdAt: "2026-10-10T09:00:00Z", createdBy: "u1",
  },
  // Student-related debt (mentor m2 held the student's money) settled via salary deduction:
  {
    id: "d4", debtorType: "mentor", debtorId: "m2", debtorName: "Sardor Tursunov",
    relatedStudentId: "s5", relatedStudentName: "Nilufar Xolmatova", relatedGroupName: "B-toifa 9-guruh", relatedMentorId: "m2",
    category: "student_related", reason: "O'quvchi to'lovi mentorda qolgan",
    originalAmount: 700_000, settledAmount: 700_000, outstandingAmount: 0, status: "settled",
    effectiveDate: "2026-08-01", createdAt: "2026-08-01T09:00:00Z", createdBy: "u1",
  },
  // ...the debt the mentor owes the organization is preserved (stays open):
  {
    id: "d5", debtorType: "mentor", debtorId: "m2", debtorName: "Sardor Tursunov", relatedMentorId: "m2",
    relatedStudentId: "s5", relatedStudentName: "Nilufar Xolmatova",
    category: "mentor_advance", reason: "Ish haqidan ushlab qolinadigan qarz",
    originalAmount: 700_000, settledAmount: 0, outstandingAmount: 700_000, status: "open",
    effectiveDate: "2026-10-15", createdAt: "2026-10-15T10:00:00Z", createdBy: "u1", originSettlementId: "st1",
  },
];

export const settlements: DebtSettlement[] = [
  {
    id: "st1", debtId: "d4", amount: 700_000, method: "salary_deduction",
    effectiveDate: "2026-10-15", createdAt: "2026-10-15T10:00:00Z", createdBy: "u1",
    effects: { studentAccountEntryId: "ae3", preservedOrganizationDebtId: "d5" }, // no cashTransactionId
  },
  {
    id: "st2", debtId: "d1", amount: 400_000, method: "organization_budget",
    effectiveDate: "2026-10-01", createdAt: "2026-10-01T08:00:00Z", createdBy: "u1",
    effects: { studentAccountEntryId: "ae2" }, // not new cash income
  },
];

export const studentAccountEntries: StudentAccountEntry[] = [
  { id: "ae1", studentId: "s1", type: "payment", amount: 1_500_000, description: "Naqd to'lov", effectiveDate: "2026-09-03", createdAt: "2026-09-03T08:00:00Z", createdBy: "u1" },
  { id: "ae2", studentId: "s2", type: "debt_settlement_credit", amount: 400_000, description: "Qarz yopildi (qisman)", effectiveDate: "2026-10-01", createdAt: "2026-10-01T08:00:00Z", relatedDebtId: "d1", relatedSettlementId: "st2", createdBy: "u1" },
  { id: "ae3", studentId: "s5", type: "debt_settlement_credit", amount: 700_000, description: "Qarz yopildi", effectiveDate: "2026-10-15", createdAt: "2026-10-15T10:00:00Z", relatedDebtId: "d4", relatedSettlementId: "st1", createdBy: "u1" },
];

export const cashTransactions: CashTransaction[] = [
  { id: "c1", type: "student_payment", description: "Aziza Yusupova to'lovi", cashIn: 1_500_000, cashOut: 0, effectiveDate: "2026-09-03", createdAt: "2026-09-03T08:05:00Z", relatedStudentId: "s1", mentorId: "m1", createdBy: "u1" },
  // Backdated: entered on 21.10 but effective 12.10 — must not appear in today's report.
  { id: "c2", type: "student_payment", description: "Madina Ergasheva to'lovi (kechikib kiritildi)", cashIn: 1_000_000, cashOut: 0, effectiveDate: "2026-10-12", createdAt: "2026-10-21T06:00:00Z", relatedStudentId: "s3", mentorId: "m2", createdBy: "u1" },
  { id: "c3", type: "cash_out", description: "Yoqilg'i uchun avans", cashIn: 0, cashOut: 500_000, effectiveDate: "2026-10-05", createdAt: "2026-10-05T12:00:00Z", relatedDebtId: "d2", mentorId: "m1", createdBy: "u1" },
  { id: "c4", type: "cash_in", description: "Kunlik kirim", cashIn: 2_300_000, cashOut: 0, effectiveDate: "2026-10-21", createdAt: "2026-10-21T13:00:00Z", createdBy: "u1" },
];
