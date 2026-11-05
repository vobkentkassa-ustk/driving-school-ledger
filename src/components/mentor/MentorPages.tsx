import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime } from "@/lib/format";
import { mentorDebtsQuery, mentorRequestsQuery, mentorStudentsQuery } from "./query";
import { DraftPreview } from "./DraftPreview";

function Header({ title, action }: { title: string; action?: React.ReactNode }) {
  return <header className="space-y-2">
    <div className="flex items-end justify-between gap-3"><div><p className="mb-1 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-xl font-extrabold">{title}</h1></div>{action}</div>
    <p className="text-xs text-muted-foreground">{uz.mentor.scopeNote}</p>
  </header>;
}

export function MentorDraftsPage() {
  const { data } = useSuspenseQuery(mentorRequestsQuery);
  const { data: dir } = useSuspenseQuery(mentorStudentsQuery);
  const [form, setForm] = useState({ open: false, key: 0 });
  return <div className="space-y-5">
    <Header title={uz.mentor.draftsTitle} action={<Button size="sm" onClick={() => setForm((f) => ({ open: true, key: f.key + 1 }))}><Plus aria-hidden />{uz.mentor.newDraft}</Button>} />
    {data.length ? <ul className="space-y-3">{data.map(({ request: r, studentName }) => <li key={r.id} className="space-y-2 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2"><p className="font-semibold">{studentName}</p><StatusBadge kind="payment" status={r.status} /></div>
      <div className="flex items-center justify-between gap-2 text-sm"><Money value={r.grossAmount} className="font-semibold" /><span className="text-muted-foreground">{uz.paymentMethod[r.method]}</span></div>
      <p className="text-xs text-muted-foreground">{uz.fields.effectiveDate}: {formatDate(r.effectiveDate)} · {uz.fields.createdAt}: {formatDateTime(r.createdAt)}</p>
      {r.reviewComment && <p className="rounded-md bg-danger-soft p-2 text-xs text-danger"><span className="font-semibold">{uz.mentor.reviewComment}: </span>{r.reviewComment}</p>}
    </li>)}</ul> : <p className="py-10 text-center text-muted-foreground">{uz.mentor.emptyRequests}</p>}
    <DraftPreview key={form.key} open={form.open} onOpenChange={(open) => setForm((f) => ({ ...f, open }))} students={dir.profiles.map((p) => p.student)} />
  </div>;
}

export function MentorStudentsPage() {
  const { data } = useSuspenseQuery(mentorStudentsQuery);
  return <div className="space-y-5">
    <Header title={uz.nav.myStudents} />
    {data.profiles.length ? <ul className="space-y-3">{data.profiles.map(({ student, group, summary, under30Warning }) => <li key={student.id} className="space-y-2 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{student.fullName}</p><p className="text-xs text-muted-foreground">{group.name} · {group.startDate ? formatDate(group.startDate) : uz.fields.startUnknown}</p></div></div>
      <dl className="grid grid-cols-3 gap-2 text-xs">
        <div><dt className="text-muted-foreground">{uz.fields.contractPrice}</dt><dd><Money value={group.contractPrice} /></dd></div>
        <div><dt className="text-muted-foreground">{uz.mentor.paid}</dt><dd><Money value={summary.paidAmount} tone="income" /></dd></div>
        <div><dt className="text-muted-foreground">{uz.mentor.remaining}</dt><dd><Money value={summary.remainingAmount} tone="debt" /></dd></div>
      </dl>
      {under30Warning && <p className="rounded-md bg-warning-soft px-2 py-1 text-xs font-semibold text-warning">{uz.warnings.under30}</p>}
    </li>)}</ul> : <p className="py-10 text-center text-muted-foreground">{uz.mentor.emptyStudents}</p>}
  </div>;
}

export function MentorDebtsPage() {
  const { data } = useSuspenseQuery(mentorDebtsQuery);
  return <div className="space-y-5">
    <Header title={uz.nav.myDebts} />
    {data.length ? <ul className="space-y-3">{data.map((d) => <li key={d.id} className="space-y-2 rounded-lg border bg-card p-4">
      <div className="flex items-start justify-between gap-2"><div><p className="font-semibold">{uz.debtCategory[d.category]}</p><p className="text-xs text-muted-foreground">{d.reason}</p></div><StatusBadge kind="debt" status={d.status} /></div>
      <dl className="grid grid-cols-3 gap-2 text-xs">
        <div><dt className="text-muted-foreground">{uz.debts.original}</dt><dd><Money value={d.originalAmount} tone="muted" /></dd></div>
        <div><dt className="text-muted-foreground">{uz.debts.settled}</dt><dd><Money value={d.settledAmount} /></dd></div>
        <div><dt className="text-muted-foreground">{uz.fields.outstanding}</dt><dd><Money value={d.outstandingAmount} tone="debt" className="font-semibold" /></dd></div>
      </dl>
      <p className="text-xs text-muted-foreground">{uz.fields.effectiveDate}: {formatDate(d.effectiveDate)}{d.relatedStudentName ? ` · ${d.relatedStudentName}` : ""}</p>
    </li>)}</ul> : <p className="py-10 text-center text-muted-foreground">{uz.mentor.emptyDebts}</p>}
  </div>;
}
