import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import type { OperationHistoryRow } from "@/types/domain";

export function OperationAmount({ row }: { row: OperationHistoryRow }) {
  const source = row.source;
  if (source.kind === "internal") return <div className="space-y-1"><p className="text-xs font-semibold text-info">{uz.dashboard.internalMovement}</p><Money value={source.settlement.amount} className="text-sm text-info" /></div>;
  const t = source.transaction;
  return <div className="flex flex-wrap gap-4">
    {t.cashIn > 0 && <div><p className="text-xs font-semibold text-success">{uz.dashboard.cashIn}</p><Money value={t.cashIn} tone="positive" className="text-sm" /></div>}
    {t.cashOut > 0 && <div><p className="text-xs font-semibold text-danger">{uz.dashboard.cashOut}</p><Money value={t.cashOut} tone="debt" className="text-sm" /></div>}
  </div>;
}