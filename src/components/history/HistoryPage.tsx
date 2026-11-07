import { Suspense } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { History, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { parseOperationFilters } from "@/lib/history";
import type { OperationFilters, OperationHistoryRow } from "@/types/domain";
import { operationHistoryQuery } from "./query";
import { OperationAmount } from "./OperationAmount";
import { OperationDetails } from "./OperationDetails";

const routeApi = getRouteApi("/admin/tarix");
const kindLabel = (kind: OperationHistoryRow["kind"]) => kind === "cash" ? uz.dashboard.cashMovement : uz.dashboard.internalMovement;

export function HistoryPage() {
  const filters = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const { data: rows } = useSuspenseQuery(operationHistoryQuery(filters));
  const update = (patch: Partial<OperationFilters>) => { void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false }); };
  const reset = () => { void navigate({ search: parseOperationFilters({}), replace: true, resetScroll: false }); };
  const filtered = Boolean(filters.q || filters.from || filters.to || filters.kind !== "all");
  const invalidRange = Boolean(filters.from && filters.to && filters.from > filters.to);
  return <div className="space-y-6">
    <header><p className="mb-2 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{uz.history.title}</h1></header>
    <section aria-label={uz.ledger.search} className="border-y py-5"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,2fr)_1fr_1fr_1fr_auto]">
      <div className="min-w-0 space-y-2"><Label htmlFor="history-q">{uz.ledger.search}</Label><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden /><Input id="history-q" className="pl-9" placeholder={uz.history.search} value={filters.q} maxLength={200} onChange={(e) => update({ q: e.target.value })} /></div></div>
      <div className="min-w-0 space-y-2"><Label htmlFor="history-from">{uz.ledger.from}</Label><Input id="history-from" type="date" value={filters.from} onChange={(e) => update({ from: e.target.value })} aria-invalid={invalidRange} /></div>
      <div className="min-w-0 space-y-2"><Label htmlFor="history-to">{uz.ledger.to}</Label><Input id="history-to" type="date" value={filters.to} onChange={(e) => update({ to: e.target.value })} aria-invalid={invalidRange} /></div>
      <div className="min-w-0 space-y-2"><Label htmlFor="history-kind">{uz.history.kind}</Label><Select value={filters.kind} onValueChange={(kind) => update({ kind: parseOperationFilters({ kind }).kind })}><SelectTrigger id="history-kind" className="w-full"><SelectValue placeholder={uz.history.all} /></SelectTrigger><SelectContent><SelectItem value="all">{uz.history.all}</SelectItem><SelectItem value="cash">{uz.dashboard.cashMovement}</SelectItem><SelectItem value="internal">{uz.dashboard.internalMovement}</SelectItem></SelectContent></Select></div>
      <Button variant="outline" size="icon" title={uz.ledger.reset} aria-label={uz.ledger.reset} disabled={!filtered} className="self-end" onClick={reset}><RotateCcw aria-hidden /></Button>
    </div>{invalidRange && <p role="alert" className="mt-3 text-sm text-danger">{uz.ledger.invalidRange}</p>}</section>
    <p className="text-sm text-muted-foreground">{uz.ledger.results}: <span className="font-mono font-semibold text-foreground">{formatNumber(rows.length)}</span></p>
    {rows.length ? <>
      <div className="hidden lg:block"><Table><TableHeader><TableRow><TableHead>{uz.fields.effectiveDate}</TableHead><TableHead>{uz.dashboard.operation}</TableHead><TableHead>{uz.fields.amount}</TableHead><TableHead>{uz.fields.createdAt}</TableHead><TableHead><span className="sr-only">{uz.actions.details}</span></TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.id}>
        <TableCell className="whitespace-nowrap">{formatDate(row.effectiveDate)}</TableCell><TableCell className="max-w-xs py-4"><p className="font-semibold">{row.description}</p><p className="mt-1 text-xs text-muted-foreground">{row.studentName ?? row.mentorName ?? row.createdByName}</p><p className={row.kind === "internal" ? "mt-1 text-xs text-info" : "mt-1 text-xs text-muted-foreground"}>{kindLabel(row.kind)}</p></TableCell><TableCell><OperationAmount row={row} /></TableCell><TableCell className="text-xs"><p className="whitespace-nowrap">{formatDateTime(row.createdAt)}</p><p className="mt-1 text-muted-foreground">{row.createdByName}</p></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => update({ operation: row.id })}>{uz.actions.details}</Button></TableCell>
      </TableRow>)}</TableBody></Table></div>
      <ul className="divide-y lg:hidden">{rows.map((row) => <li key={row.id} className="space-y-3 py-5"><div className="flex flex-wrap justify-between gap-2"><span className="text-xs text-muted-foreground">{formatDate(row.effectiveDate)}</span><span className={row.kind === "internal" ? "text-xs font-semibold text-info" : "text-xs font-semibold"}>{kindLabel(row.kind)}</span></div><p className="text-sm font-semibold">{row.description}</p><p className="text-xs text-muted-foreground">{row.studentName ?? row.mentorName ?? row.createdByName}</p><div className="flex flex-wrap items-end justify-between gap-3"><OperationAmount row={row} /><Button variant="outline" size="sm" onClick={() => update({ operation: row.id })}>{uz.actions.details}</Button></div><p className="text-xs text-muted-foreground">{uz.fields.createdAt}: {formatDateTime(row.createdAt)}</p></li>)}</ul>
    </> : <div className="flex flex-col items-center gap-3 py-16 text-center"><History className="size-8 text-muted-foreground" aria-hidden /><h2 className="font-semibold">{uz.history.empty}</h2>{filtered && <Button variant="outline" onClick={reset}><RotateCcw aria-hidden />{uz.ledger.reset}</Button>}</div>}
    <Sheet open={Boolean(filters.operation)} onOpenChange={(open) => { if (!open) update({ operation: "" }); }}><SheetContent className="w-full overflow-y-auto sm:max-w-md"><SheetTitle className="pr-6">{uz.history.details}</SheetTitle><SheetDescription className="mt-2">{uz.preview.mockBadge}</SheetDescription>{filters.operation && <Suspense fallback={<p role="status" className="py-6">{uz.dashboard.loading}</p>}><OperationDetails id={filters.operation} /></Suspense>}</SheetContent></Sheet>
  </div>;
}