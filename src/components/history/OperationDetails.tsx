import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime } from "@/lib/format";
import { operationDetailQuery } from "./query";
import { OperationAmount } from "./OperationAmount";

export function OperationDetails({ id }: { id: string }) {
  const { data } = useSuspenseQuery(operationDetailQuery(id));
  if (!data) return <p className="py-6 text-muted-foreground">{uz.history.notFound}</p>;
  const { row, debt, studentCredit, preservedDebt, events } = data;
  const source = row.source;
  const studentId = studentCredit?.studentId ?? (source.kind === "cash" ? source.transaction.relatedStudentId : debt?.relatedStudentId);
  return <div className="mt-6 space-y-6">
    <section className="space-y-3 border-y py-5"><p className="font-semibold">{row.description}</p><p className="text-sm text-muted-foreground">{source.kind === "cash" ? uz.ledgerType[source.transaction.type] : uz.settlementMethod[source.settlement.method]}</p><OperationAmount row={row} />
      {source.kind === "internal" && <p className="text-sm text-info">{source.settlement.method === "salary_deduction" ? uz.preview.salaryNote : uz.settlementDemo.budgetNote}</p>}
    </section>
    <dl className="space-y-4 text-sm">{[
      [uz.history.operationId, row.id], [uz.fields.effectiveDate, formatDate(row.effectiveDate)], [uz.fields.createdAt, formatDateTime(row.createdAt)],
      [uz.ledger.createdBy, row.createdByName], [uz.fields.student, row.studentName ?? uz.ledger.noLink], [uz.fields.mentor, row.mentorName ?? uz.ledger.noLink],
    ].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl>
    {(debt || studentId || preservedDebt) && <section className="space-y-4 border-y py-5"><h3 className="font-bold">{uz.history.linked}</h3>
      {debt && <Button asChild variant="link" className="h-auto whitespace-normal px-0 text-left"><Link to="/admin/qarzlar" search={{ debt: debt.id }}>{uz.debts.sourceDebt}: {debt.id}</Link></Button>}
      {studentId && <div><Button asChild variant="link" className="h-auto whitespace-normal px-0 text-left"><Link to="/admin/oquvchilar" search={{ student: studentId }}>{uz.students.profile}: {row.studentName ?? studentId}</Link></Button>
        {studentCredit && <div className="mt-2 space-y-1 border-l-2 border-info pl-3"><p className="text-xs text-info">{uz.debts.studentCredit}</p><Money value={studentCredit.amount} className="text-sm text-info" /><p className="text-xs text-muted-foreground">{uz.history.creditId}: {studentCredit.id}</p></div>}
      </div>}
      {preservedDebt && <div><p className="text-xs text-danger">{uz.debts.preservedDebt}</p><Button asChild variant="link" className="h-auto whitespace-normal px-0 text-left"><Link to="/admin/qarzlar" search={{ debt: preservedDebt.id }}>{preservedDebt.id} · {preservedDebt.debtorName}</Link></Button><p><Money value={preservedDebt.outstandingAmount} tone="debt" className="text-sm" /></p></div>}
    </section>}
    <section><h3 className="font-bold">{uz.history.audit}</h3><p className="mt-2 text-xs text-muted-foreground">{uz.history.note}</p>
      {events.length ? <ol className="mt-4 divide-y">{events.map(({ event, createdByName }) => <li key={event.id} className="space-y-3 py-4"><p className="text-sm font-semibold">{uz.history.actions[event.action]}</p><dl className="space-y-2 text-xs">{[
        [uz.history.eventId, event.id], [uz.fields.effectiveDate, formatDate(event.effectiveDate)], [uz.fields.createdAt, formatDateTime(event.createdAt)], [uz.ledger.createdBy, createdByName],
      ].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words">{value}</dd></div>)}</dl></li>)}</ol> : <p className="mt-4 text-sm text-muted-foreground">{uz.history.noEvents}</p>}
    </section>
  </div>;
}