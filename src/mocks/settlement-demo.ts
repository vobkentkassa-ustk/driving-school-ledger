import { uz } from "@/i18n/uz";
import type { DebtViewModel, SettlementDemoResult, SettlementDemoScenario, SettlementMethod } from "@/types/domain";

// Literal isolated snapshots: no mutation of the ledger fixtures and no accounting arithmetic.
const base = { effectiveDate: "2026-10-15", createdAt: "2026-10-15T10:00:00Z", createdBy: "u1" };
const mentorDebt: DebtViewModel = {
  ...base, id: "demo-mentor", debtorType: "mentor", debtorId: "m1", debtorName: uz.samples.names.dilshod,
  category: "mentor_advance", reason: uz.samples.descriptions.fuelAdvance,
  originalAmount: 500_000, settledAmount: 0, outstandingAmount: 500_000, status: "open",
};
const studentDebt: DebtViewModel = {
  ...base, id: "demo-student", debtorType: "student", debtorId: "s2", debtorName: uz.samples.names.otabek,
  relatedStudentId: "s2", relatedStudentName: uz.samples.names.otabek,
  category: "student_related", reason: uz.samples.descriptions.examDelayed,
  originalAmount: 1_200_000, settledAmount: 400_000, outstandingAmount: 800_000, status: "partially_settled",
};
const salaryDebt: DebtViewModel = {
  ...base, id: "demo-salary", debtorType: "mentor", debtorId: "m2", debtorName: uz.samples.names.sardor,
  relatedStudentId: "s5", relatedStudentName: uz.samples.names.nilufar,
  category: "student_related", reason: uz.samples.descriptions.heldPayment,
  originalAmount: 700_000, settledAmount: 0, outstandingAmount: 700_000, status: "open",
};
const scenarios: SettlementDemoScenario[] = [
  { method: "personal_repayment", debt: mentorDebt, fullAmount: 500_000, partialAmount: 200_000, effectiveDate: base.effectiveDate },
  { method: "salary_deduction", debt: salaryDebt, fullAmount: 700_000, partialAmount: 300_000, effectiveDate: base.effectiveDate },
  { method: "organization_budget", debt: studentDebt, fullAmount: 800_000, partialAmount: 400_000, effectiveDate: base.effectiveDate },
];

function snapshot(method: SettlementMethod, partial: boolean): SettlementDemoResult {
  const scenario = scenarios.find((s) => s.method === method);
  if (!scenario) throw new Error("Unknown demonstration scenario");
  const values = {
    personal_repayment: partial ? { amount: 200_000, settled: 200_000, remaining: 300_000 } : { amount: 500_000, settled: 500_000, remaining: 0 },
    salary_deduction: partial ? { amount: 300_000, settled: 300_000, remaining: 400_000 } : { amount: 700_000, settled: 700_000, remaining: 0 },
    organization_budget: partial ? { amount: 400_000, settled: 800_000, remaining: 400_000 } : { amount: 800_000, settled: 1_200_000, remaining: 0 },
  }[method];
  const studentCredit = scenario.debt.relatedStudentId ? {
    ...base, id: "demo-credit", studentId: scenario.debt.relatedStudentId, type: "debt_settlement_credit" as const,
    amount: values.amount, description: uz.samples.descriptions.settlement, relatedDebtId: scenario.debt.id, relatedSettlementId: "demo-settlement",
  } : null;
  const preservedDebt: DebtViewModel | null = method === "salary_deduction" ? {
    ...salaryDebt, id: "demo-preserved", category: "mentor_advance", reason: uz.samples.descriptions.salaryDebt,
    originalAmount: values.amount, settledAmount: 0, outstandingAmount: values.amount, status: "open", originSettlementId: "demo-settlement",
  } : null;
  const cashTransaction = method === "personal_repayment" ? {
    ...base, id: "demo-cash", type: "mentor_repayment" as const, description: uz.settlementMethod.personal_repayment,
    cashIn: values.amount, cashOut: 0, relatedDebtId: scenario.debt.id, mentorId: "m1",
  } : null;
  return {
    debt: { ...scenario.debt, settledAmount: values.settled, outstandingAmount: values.remaining, status: partial ? "partially_settled" : "settled" },
    settlement: { ...base, id: "demo-settlement", debtId: scenario.debt.id, amount: values.amount, method,
      effects: { studentAccountEntryId: studentCredit?.id, preservedOrganizationDebtId: preservedDebt?.id, cashTransactionId: cashTransaction?.id } },
    studentCredit, preservedDebt, cashTransaction,
  };
}

export async function listSettlementDemoScenarios(): Promise<SettlementDemoScenario[]> {
  return structuredClone(scenarios);
}

export async function previewSettlementDemo(method: SettlementMethod, amount: string): Promise<SettlementDemoResult | null> {
  const scenario = scenarios.find((s) => s.method === method);
  if (!scenario || (Number(amount) !== scenario.fullAmount && Number(amount) !== scenario.partialAmount)) return null;
  return structuredClone(snapshot(method, Number(amount) === scenario.partialAmount));
}

export async function confirmSettlementDemo(result: SettlementDemoResult, outcome: "success" | "failure" | "stale"): Promise<{ outcome: typeof outcome; result: SettlementDemoResult | null }> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return { outcome, result: outcome === "success" ? structuredClone(result) : null };
}