import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, ArrowRight, CalendarDays, CircleDollarSign, Clock3, HandCoins, Repeat2, UsersRound, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";
import type { AdminDashboard } from "@/types/domain";
import { adminDashboardQuery } from "./query";

const metricTones = {
  positive: "bg-success-soft text-success",
  debt: "bg-danger-soft text-danger",
  default: "bg-primary/10 text-primary",
} as const;

function CashMetric({ label, value, tone, icon: Icon, note }: {
  label: string; value: number; tone: keyof typeof metricTones; icon: LucideIcon; note: string;
}) {
  return (
    <article className="min-w-0 rounded-lg border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">{label}</h2>
        <span className={`flex size-9 items-center justify-center rounded-md ${metricTones[tone]}`}><Icon className="size-4" aria-hidden /></span>
      </div>
      <Money value={value} tone={tone} className="mt-4 block text-xl font-semibold xl:text-2xl" />
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </article>
  );
}

function OperationRow({ operation }: { operation: AdminDashboard["recentOperations"][number] }) {
  const internal = operation.kind === "internal";
  const record = operation.kind === "cash" ? operation.transaction : operation.settlement;
  const cash = operation.kind === "cash" ? operation.transaction : undefined;
  const outgoing = Boolean(cash && cash.cashOut > 0);
  const Icon = internal ? Repeat2 : outgoing ? ArrowUpRight : ArrowDownLeft;
  const tone = internal ? "bg-info-soft text-info" : outgoing ? "bg-danger-soft text-danger" : "bg-success-soft text-success";
  return (
    <li className="grid grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-3 border-b py-4 last:border-0 sm:grid-cols-[2.25rem_minmax(0,1fr)_auto]">
      <span className={`flex size-9 items-center justify-center rounded-md ${tone}`}><Icon className="size-4" aria-hidden /></span>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{operation.kind === "cash" ? operation.transaction.description : operation.description}</p>
        <p className={`mt-1 text-xs ${internal ? "text-info" : "text-muted-foreground"}`}>
          {operation.kind === "internal" ? uz.settlementMethod[operation.settlement.method] : uz.ledgerType[operation.transaction.type]}
        </p>
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div><dt className="inline">{uz.fields.effectiveDate}: </dt><dd className="inline">{formatDate(record.effectiveDate)}</dd></div>
          <div><dt className="inline">{uz.fields.createdAt}: </dt><dd className="inline">{formatDateTime(record.createdAt)}</dd></div>
        </dl>
      </div>
      <div className="col-start-2 sm:col-start-3 sm:text-right">
        {operation.kind === "internal" ? (
          <><Money value={operation.settlement.amount} className="text-sm font-semibold text-info" /><p className="mt-1 text-xs text-info">{uz.dashboard.internalMovement} · {uz.dashboard.noCash}</p></>
        ) : (
          <><Money value={outgoing ? operation.transaction.cashOut : operation.transaction.cashIn} tone={outgoing ? "debt" : "positive"} className="text-sm font-semibold" /><p className="mt-1 text-xs text-muted-foreground">{outgoing ? uz.dashboard.cashOut : uz.dashboard.cashIn}</p></>
        )}
      </div>
    </li>
  );
}

export function AdminDashboardPage() {
  const { data } = useSuspenseQuery(adminDashboardQuery);
  const { summary, period } = data;
  const periodLabel = `${formatDate(period.from)} — ${formatDate(period.to)}`;
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{uz.nav.dashboard}</h1></div>
        <div className="flex items-center gap-2.5 text-sm"><CalendarDays className="size-4 text-muted-foreground" aria-hidden /><div><p className="text-xs text-muted-foreground">{uz.dashboard.period}</p><p className="mt-0.5 font-medium tabular-nums">{periodLabel}</p></div></div>
      </header>

      <section aria-label={uz.dashboard.cashMovement} className="grid gap-4 md:grid-cols-3">
        <CashMetric label={uz.dashboard.cashIn} value={summary.cashIn} tone="positive" icon={ArrowDownLeft} note={periodLabel} />
        <CashMetric label={uz.dashboard.cashOut} value={summary.cashOut} tone="debt" icon={ArrowUpRight} note={periodLabel} />
        <CashMetric label={uz.dashboard.balance} value={summary.cashBalance} tone={summary.cashBalance < 0 ? "debt" : "positive"} icon={Wallet} note={`${uz.dashboard.openingBalance}: ${formatNumber(summary.openingBalance)} ${uz.currency.suffix}`} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2" aria-label={uz.dashboard.pendingNote}>
        <Link to="/admin/qarzlar" className="group flex min-w-0 items-center gap-4 rounded-lg border bg-card p-5 transition-colors hover:border-danger focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-danger-soft text-danger"><HandCoins className="size-5" aria-hidden /></span>
          <div className="min-w-0"><h2 className="text-sm font-semibold text-danger">{uz.fields.outstanding}</h2><Money value={summary.outstandingDebt} tone="debt" className="mt-1 block text-lg font-semibold" /><p className="mt-1 text-xs text-muted-foreground">{uz.dashboard.debtNote}</p></div>
          <ArrowRight className="ml-auto hidden size-4 shrink-0 text-muted-foreground md:block" aria-hidden />
        </Link>
        <Link to="/admin/sorovlar" className="group flex items-center gap-4 rounded-lg border bg-card p-5 transition-colors hover:border-warning focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-warning-soft text-warning"><Clock3 className="size-5" aria-hidden /></span>
          <div><h2 className="text-sm font-semibold">{uz.nav.requests}</h2><p className="mt-1 font-mono text-2xl font-semibold text-warning">{formatNumber(summary.pendingCount)}</p><p className="mt-1 text-xs text-muted-foreground">{uz.dashboard.pendingNote}</p></div>
          <ArrowRight className="ml-auto size-4 shrink-0 text-muted-foreground" aria-hidden />
        </Link>
      </section>

      <section aria-labelledby="recent-title">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3"><h2 id="recent-title" className="text-lg font-bold">{uz.dashboard.recent}</h2><Button asChild variant="ghost" size="sm"><Link to="/admin/daftar">{uz.dashboard.allOperations}<ArrowRight aria-hidden /></Link></Button></div>
        {data.recentOperations.length ? <ul>{data.recentOperations.map((operation) => <OperationRow key={operation.kind === "cash" ? operation.transaction.id : operation.settlement.id} operation={operation} />)}</ul> : <p className="py-8 text-center text-sm text-muted-foreground">{uz.dashboard.emptyOperations}</p>}
      </section>

      <section aria-labelledby="groups-title">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><h2 id="groups-title" className="text-lg font-bold">{uz.nav.groups}</h2><Button asChild variant="ghost" size="sm"><Link to="/admin/guruhlar">{uz.dashboard.allGroups}<ArrowRight aria-hidden /></Link></Button></div>
        {data.groups.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{data.groups.map(({ group, mentorName, studentCount }) => (
          <article key={group.id} className="min-w-0 rounded-lg border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2"><UsersRound className="size-5 text-primary" aria-hidden /><StatusBadge kind="group" status={group.status} /></div>
            <h3 className="text-sm font-bold">{group.name}</h3><p className="mt-1 text-xs text-muted-foreground">{mentorName}</p>
            <dl className="mt-4 space-y-2 text-xs"><div className="flex justify-between gap-2"><dt className="text-muted-foreground">{uz.dashboard.studentCount}</dt><dd className="font-mono font-semibold">{formatNumber(studentCount)} / {formatNumber(group.capacity)}</dd></div><div className="flex flex-wrap justify-between gap-1"><dt className="text-muted-foreground">{uz.fields.startDate}</dt><dd>{group.startDate ? formatDate(group.startDate) : uz.fields.startUnknown}</dd></div></dl>
          </article>
        ))}</div> : <p className="py-8 text-center text-sm text-muted-foreground">{uz.dashboard.emptyGroups}</p>}
      </section>
    </div>
  );
}