import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime } from "@/lib/format";
import { listDebts, listGroups, listSettlements } from "@/mocks/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dizayn asoslari — Avtomaktab Kassa" },
      { name: "description", content: "Avtomaktab Kassa dizayn tizimi: ranglar, holatlar va formatlash namunalari." },
      { property: "og:title", content: "Dizayn asoslari — Avtomaktab Kassa" },
      { property: "og:description", content: "Avtomaktab Kassa dizayn tizimi: ranglar, holatlar va formatlash namunalari." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FoundationPreview,
});

const ADMIN = { role: "admin" } as const;

const swatches = [
  { key: "primary", cls: "bg-primary" },
  { key: "success", cls: "bg-success" },
  { key: "warning", cls: "bg-warning" },
  { key: "danger", cls: "bg-danger" },
  { key: "info", cls: "bg-info" },
  { key: "muted", cls: "bg-muted-foreground" },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-card">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {children}
    </section>
  );
}

function FoundationPreview() {
  const groups = useQuery({ queryKey: ["groups", "admin"], queryFn: () => listGroups(ADMIN) });
  const debts = useQuery({ queryKey: ["debts", "admin"], queryFn: () => listDebts(ADMIN) });
  const salary = useQuery({ queryKey: ["settlements", "d4"], queryFn: () => listSettlements("d4") });
  const st = salary.data?.[0];
  const preserved = debts.data?.find((d) => d.id === st?.effects.preservedOrganizationDebtId);

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">{uz.app.name}</p>
          <h1 className="text-3xl font-extrabold tracking-tight">{uz.preview.title}</h1>
          <p className="mt-1 text-muted-foreground">{uz.preview.subtitle}</p>
        </div>
        <span className="rounded-full bg-info-soft px-3 py-1 text-xs font-semibold text-info">{uz.preview.mockBadge}</span>
      </header>

      <Section title={uz.preview.colors}>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {swatches.map((s) => (
            <div key={s.key} className="space-y-2">
              <div className={`h-14 rounded-xl ${s.cls}`} />
              <p className="text-xs font-medium">{uz.preview.tokens[s.key]}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title={uz.preview.statuses}>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(["draft", "pending", "approved", "rejected"] as const).map((s) => <StatusBadge key={s} kind="payment" status={s} />)}
          </div>
          <div className="flex flex-wrap gap-2">
            {(["open", "partially_settled", "settled"] as const).map((s) => <StatusBadge key={s} kind="debt" status={s} />)}
            {(["upcoming", "active", "finished"] as const).map((s) => <StatusBadge key={s} kind="group" status={s} />)}
            {(["pending_approval", "active", "blocked"] as const).map((s) => <StatusBadge key={s} kind="user" status={s} />)}
          </div>
        </div>
      </Section>

      <Section title={uz.preview.formatting}>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div><dt className="text-xs text-muted-foreground">{uz.fields.amount}</dt><dd className="text-2xl font-bold"><Money value={12_450_000} /></dd></div>
          <div><dt className="text-xs text-muted-foreground">{uz.fields.effectiveDate}</dt><dd className="font-mono text-lg">{formatDate("2026-10-12")}</dd></div>
          <div><dt className="text-xs text-muted-foreground">{uz.fields.createdAt}</dt><dd className="font-mono text-lg">{formatDateTime("2026-10-21T06:00:00Z")}</dd></div>
        </dl>
      </Section>

      <Section title={uz.preview.groupsSample}>
        <div className="grid gap-3 sm:grid-cols-2">
          {groups.data?.map((g) => (
            <div key={g.id} className="rounded-xl border bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-bold">{g.name}</p>
                <StatusBadge kind="group" status={g.status} />
              </div>
              <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                <span>{uz.fields.contractPrice}: <Money value={g.contractPrice} /></span>
                <span>{uz.fields.startDate}: {g.startDate ? formatDate(g.startDate) : uz.fields.startUnknown}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title={uz.preview.debtsSample}>
        <div className="divide-y">
          {debts.data?.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="font-semibold">{d.debtorName}</p>
                <p className="text-sm text-muted-foreground">
                  {uz.debtCategory[d.category]} · {d.reason}
                  {d.relatedGroupName ? ` · ${d.relatedGroupName}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge kind="debt" status={d.status} />
                <Money value={d.outstandingAmount} tone={d.outstandingAmount > 0 ? "debt" : "muted"} className="font-bold" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {st && preserved && (
        <Section title={uz.preview.salaryTitle}>
          <p className="text-sm text-muted-foreground">{uz.preview.salaryNote}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="rounded-xl bg-success-soft p-4 text-sm">
              <p className="font-semibold text-success">{uz.accountEntryType.debt_settlement_credit}</p>
              <p>{preserved.relatedStudentName}: <Money value={st.amount} tone="positive" /></p>
            </li>
            <li className="rounded-xl bg-danger-soft p-4 text-sm">
              <p className="font-semibold text-danger">{uz.settlementMethod.salary_deduction}</p>
              <p>{preserved.debtorName}: <Money value={preserved.outstandingAmount} tone="debt" /></p>
            </li>
            <li className="rounded-xl bg-muted p-4 text-sm">
              <p className="font-semibold text-muted-foreground">{uz.preview.noCashEntry}</p>
              <p className="text-muted-foreground">{formatDate(st.effectiveDate)}</p>
            </li>
          </ul>
        </Section>
      )}
    </main>
  );
}
