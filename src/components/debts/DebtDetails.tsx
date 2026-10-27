import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime } from "@/lib/format";
import { debtDetailQuery } from "./query";

export function DebtDetails({ id, onSelect }: { id: string; onSelect: (id: string) => void }) {
  const { data } = useSuspenseQuery(debtDetailQuery(id));
  if (!data) return <p className="py-6 text-muted-foreground">{uz.debts.notFound}</p>;
  const { debt: d } = data;
  return <div className="mt-6 space-y-6">
    <section className="space-y-3 border-y py-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">{d.debtorName}</h3><StatusBadge kind="debt" status={d.status} /></div>
      <p className="text-sm text-muted-foreground">{d.reason}</p>
      <div><p className="mb-1 text-xs font-semibold text-danger">{uz.fields.outstanding}</p><Money value={d.outstandingAmount} tone={d.outstandingAmount ? "debt" : "muted"} className="text-xl font-bold" /></div>
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div><dt className="text-muted-foreground">{uz.debts.original}</dt><dd className="mt-1"><Money value={d.originalAmount} /></dd></div>
        <div><dt className="text-muted-foreground">{uz.debts.settled}</dt><dd className="mt-1"><Money value={d.settledAmount} /></dd></div>
      </dl>
    </section>
    <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">{[
      [uz.debts.recordId, d.id], [uz.debts.debtorType, uz.debtorType[d.debtorType]],
      [uz.debts.category, uz.debtCategory[d.category]], [uz.ledger.createdBy, data.createdByName],
      [uz.fields.effectiveDate, formatDate(d.effectiveDate)], [uz.fields.createdAt, formatDateTime(d.createdAt)],
      [uz.fields.student, d.relatedStudentName ?? uz.ledger.noLink], [uz.fields.group, d.relatedGroupName ?? uz.ledger.noLink],
      [uz.fields.mentor, data.mentorName ?? uz.ledger.noLink],
    ].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl>
    {data.origin && <section className="border-l-2 border-info bg-info-soft px-4 py-4 text-sm">
      <h3 className="font-semibold text-info">{uz.debts.origin}</h3><p className="mt-2">{uz.settlementMethod[data.origin.settlement.method]}</p>
      <p className="mt-2">{uz.preview.salaryNote}</p>
      <Button variant="link" className="mt-2 h-auto whitespace-normal px-0 text-left" onClick={() => onSelect(data.origin?.sourceDebt.id ?? "")}>{uz.debts.sourceDebt}: {data.origin.sourceDebt.id}</Button>
    </section>}
    <section><h3 className="mb-4 font-bold">{uz.debts.history}</h3>
      {data.history.length ? <ol className="divide-y">{data.history.map(({ settlement: s, createdByName, studentCredit, preservedDebt }) => <li key={s.id} className="space-y-3 py-4 first:pt-0">
        <div className="flex flex-wrap justify-between gap-2"><span className={s.method === "personal_repayment" ? "text-sm font-semibold text-success" : "text-sm font-semibold text-info"}>{uz.settlementMethod[s.method]}</span><Money value={s.amount} className={s.method === "personal_repayment" ? "text-success" : "text-info"} /></div>
        <p className={s.method === "personal_repayment" ? "text-xs text-success" : "text-xs text-info"}>{s.method === "personal_repayment" ? uz.dashboard.cashIn : uz.dashboard.internalMovement}</p>
        <dl className="space-y-2 text-xs">{[[uz.fields.effectiveDate, formatDate(s.effectiveDate)], [uz.fields.createdAt, formatDateTime(s.createdAt)], [uz.ledger.createdBy, createdByName]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">{label}</dt><dd>{value}</dd></div>)}</dl>
        {studentCredit && <div className="border-l-2 border-info pl-3"><p className="text-xs text-info">{uz.debts.studentCredit}</p><p className="mt-1 text-sm">{d.relatedStudentName}</p><Money value={studentCredit.amount} className="text-sm text-info" /><p className="mt-1 text-xs text-muted-foreground">{studentCredit.description}</p></div>}
        {s.method === "salary_deduction" && <p className="text-sm text-muted-foreground">{uz.preview.salaryNote}</p>}
        {preservedDebt && <div><p className="text-xs text-danger">{uz.debts.preservedDebt}</p><Button variant="link" className="h-auto whitespace-normal px-0 text-left" onClick={() => onSelect(preservedDebt.id)}>{preservedDebt.id} · {preservedDebt.debtorName}</Button><div><Money value={preservedDebt.outstandingAmount} tone="debt" className="text-sm" /></div></div>}
      </li>)}</ol> : <p className="text-sm text-muted-foreground">{uz.debts.noHistory}</p>}
    </section>
  </div>;
}