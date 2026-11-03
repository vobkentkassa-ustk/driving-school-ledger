import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime } from "@/lib/format";
import type { StudentProfile as Profile } from "@/types/domain";
import { StudentPaymentPreview } from "./StudentPaymentPreview";

export function StudentProfile({ profile }: { profile: Profile }) {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const { student, group, summary } = profile;
  return <div className="mt-6 space-y-6">
    <section className="space-y-4 border-y py-5"><h3 className="text-lg font-bold">{student.fullName}</h3><p className="text-sm text-muted-foreground">{group.name} · {profile.mentorName}</p><StatusBadge kind="group" status={group.status} />
      <dl className="space-y-3">{[[uz.fields.contractPrice, student.contractAmount], [uz.students.paid, summary.paidAmount], [uz.students.remaining, summary.remainingAmount]].map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1"><Money value={Number(value)} tone={label === uz.students.remaining ? "debt" : "default"} className="font-semibold" /></dd></div>)}</dl>
    </section>
    {profile.under30Warning && <p className="flex gap-2 border-l-2 border-warning bg-warning-soft p-3 text-sm text-warning"><TriangleAlert className="size-4 shrink-0" aria-hidden />{uz.warnings.under30}</p>}
    <dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">{uz.students.phone}</dt><dd className="mt-1">{student.phone ?? uz.students.noPhone}</dd></div><div><dt className="text-muted-foreground">{uz.fields.startDate}</dt><dd className="mt-1">{group.startDate ? formatDate(group.startDate) : uz.fields.startUnknown}</dd></div></dl>
    {paymentOpen ? <StudentPaymentPreview studentName={student.fullName} onClose={() => setPaymentOpen(false)} /> : <Button onClick={() => setPaymentOpen(true)}><Plus aria-hidden />{uz.students.payment}</Button>}
    <section><h3 className="mb-4 font-bold">{uz.students.history}</h3>{profile.entries.length ? <ol className="divide-y">{profile.entries.map(({ entry: e, createdByName, settlementMethod, preservedDebtId }) => <li key={e.id} className="space-y-3 py-4">
      <div className="flex flex-wrap justify-between gap-2"><p className={e.type === "debt_settlement_credit" ? "text-sm font-semibold text-info" : "text-sm font-semibold text-success"}>{uz.accountEntryType[e.type]}</p><Money value={e.amount} className={e.type === "debt_settlement_credit" ? "text-sm text-info" : "text-sm text-success"} /></div>
      <p className="text-sm text-muted-foreground">{e.description}</p>
      {settlementMethod && <p className="text-xs text-info">{uz.settlementMethod[settlementMethod]} · {uz.dashboard.internalMovement}</p>}
      <dl className="space-y-2 text-xs">{[[uz.fields.effectiveDate, formatDate(e.effectiveDate)], [uz.fields.createdAt, formatDateTime(e.createdAt)], [uz.ledger.createdBy, createdByName]].map(([label, value]) => <div key={label} className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">{label}</dt><dd>{value}</dd></div>)}</dl>
      {e.relatedDebtId && <Button asChild variant="link" className="h-auto px-0"><Link to="/admin/qarzlar" search={{ debt: e.relatedDebtId }}>{uz.ledger.linkedDebt}: {e.relatedDebtId}</Link></Button>}
      {preservedDebtId && <div><p className="text-xs text-danger">{uz.debts.preservedDebt}</p><Button asChild variant="link" className="h-auto px-0"><Link to="/admin/qarzlar" search={{ debt: preservedDebtId }}>{preservedDebtId}</Link></Button></div>}
    </li>)}</ol> : <p className="text-sm text-muted-foreground">{uz.students.emptyHistory}</p>}</section>
  </div>;
}