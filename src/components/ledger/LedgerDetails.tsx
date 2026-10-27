import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime } from "@/lib/format";
import type { CashLedgerRow } from "@/types/domain";

export function LedgerDetails({ row, onClose }: { row: CashLedgerRow | null; onClose: () => void }) {
  const t = row?.transaction;
  return <Sheet open={Boolean(row)} onOpenChange={(open) => { if (!open) onClose(); }}><SheetContent className="w-full overflow-y-auto sm:max-w-md">
    <SheetTitle className="pr-6">{uz.ledger.details}</SheetTitle><SheetDescription className="mt-2">{uz.preview.mockBadge}</SheetDescription>
    {row && t && <div className="mt-6 space-y-6">
      <div className="border-y py-5"><p className="text-sm font-semibold">{uz.ledgerType[t.type]}</p><p className="mt-2 text-sm text-muted-foreground">{t.description}</p><div className="mt-4 flex flex-wrap gap-5"><div><p className="text-xs text-muted-foreground">{uz.dashboard.cashIn}</p><Money value={t.cashIn} tone={t.cashIn ? "positive" : "muted"} className="text-lg font-semibold" /></div><div><p className="text-xs text-muted-foreground">{uz.dashboard.cashOut}</p><Money value={t.cashOut} tone={t.cashOut ? "debt" : "muted"} className="text-lg font-semibold" /></div></div></div>
      <dl className="space-y-4 text-sm">{[
        [uz.ledger.recordId, t.id], [uz.fields.effectiveDate, formatDate(t.effectiveDate)], [uz.fields.createdAt, formatDateTime(t.createdAt)], [uz.ledger.createdBy, row.createdByName], [uz.fields.student, row.studentName ?? uz.ledger.noLink], [uz.fields.mentor, row.mentorName ?? uz.ledger.noLink],
      ].map(([label, value]) => <div key={label}><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}</dl>
      {t.relatedDebtId && <div className="text-sm"><p className="text-muted-foreground">{uz.ledger.linkedDebt}</p><p className="mt-1 font-mono">{t.relatedDebtId}</p><Button asChild variant="link" className="px-0"><Link to="/admin/qarzlar" search={{ debt: t.relatedDebtId }}>{uz.nav.debts}</Link></Button></div>}
    </div>}
  </SheetContent></Sheet>;
}