import { useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { BookOpen, Plus, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import { formatDate, formatNumber } from "@/lib/format";
import { cashLedgerTypes, parseLedgerFilters } from "@/lib/ledger";
import type { CashLedgerFilters, CashLedgerRow } from "@/types/domain";
import { cashLedgerQuery } from "./query";
import { LedgerDetails } from "./LedgerDetails";
import { CashEntryForm } from "./CashEntryForm";

const routeApi = getRouteApi("/admin/daftar");

export function CashLedgerPage() {
  const filters = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const { data: rows } = useSuspenseQuery(cashLedgerQuery(filters));
  const [selected, setSelected] = useState<CashLedgerRow | null>(null);
  const [entryOpen, setEntryOpen] = useState(false);
  const [notice, setNotice] = useState(false);
  const invalidRange = Boolean(filters.from && filters.to && filters.from > filters.to);
  const update = (patch: Partial<CashLedgerFilters>) => { void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false }); };
  const reset = () => { void navigate({ search: parseLedgerFilters({}), replace: true, resetScroll: false }); };
  const filtered = Boolean(filters.q || filters.from || filters.to || filters.type !== "all");
  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{uz.ledger.title}</h1></div><Button onClick={() => { setNotice(false); setEntryOpen(true); }}><Plus aria-hidden />{uz.ledger.newEntry}</Button></header>
    {notice && <p role="status" className="border-l-2 border-info bg-info-soft px-4 py-3 text-sm text-info">{uz.ledger.noChanges}</p>}
    <section aria-label={uz.ledger.search} className="border-y py-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(12rem,2fr)_1fr_1fr_1fr_auto]">
        <div className="space-y-2"><Label htmlFor="ledger-search">{uz.ledger.search}</Label><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden /><Input id="ledger-search" className="pl-9" placeholder={uz.ledger.searchPlaceholder} value={filters.q} maxLength={200} onChange={(e) => update({ q: e.target.value })} /></div></div>
        <div className="space-y-2"><Label htmlFor="ledger-from">{uz.ledger.from}</Label><Input id="ledger-from" type="date" value={filters.from} onChange={(e) => update({ from: e.target.value })} aria-invalid={invalidRange} /></div>
        <div className="space-y-2"><Label htmlFor="ledger-to">{uz.ledger.to}</Label><Input id="ledger-to" type="date" value={filters.to} onChange={(e) => update({ to: e.target.value })} aria-invalid={invalidRange} /></div>
        <div className="space-y-2"><Label htmlFor="ledger-type">{uz.ledger.type}</Label><Select value={filters.type} onValueChange={(type) => update({ type: parseLedgerFilters({ type }).type })}><SelectTrigger id="ledger-type"><SelectValue /></SelectTrigger><SelectContent>{cashLedgerTypes.map((type) => <SelectItem key={type} value={type}>{type === "all" ? uz.ledger.all : uz.ledgerType[type]}</SelectItem>)}</SelectContent></Select></div>
        <Button variant="outline" size="icon" title={uz.ledger.reset} aria-label={uz.ledger.reset} disabled={!filtered} className="self-end" onClick={reset}><RotateCcw aria-hidden /></Button>
      </div>{invalidRange && <p role="alert" className="mt-3 text-sm text-danger">{uz.ledger.invalidRange}</p>}
    </section>
    <div className="flex items-center justify-between text-sm"><p className="text-muted-foreground">{uz.ledger.results}: <span className="font-mono font-semibold text-foreground">{formatNumber(rows.length)}</span></p></div>
    {rows.length ? <>
      <div className="hidden md:block"><Table><TableHeader><TableRow><TableHead>{uz.fields.effectiveDate}</TableHead><TableHead>{uz.dashboard.operation}</TableHead><TableHead className="text-right">{uz.dashboard.cashIn}</TableHead><TableHead className="text-right">{uz.dashboard.cashOut}</TableHead><TableHead><span className="sr-only">{uz.actions.details}</span></TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.transaction.id}><TableCell className="whitespace-nowrap">{formatDate(row.transaction.effectiveDate)}</TableCell><TableCell className="max-w-xs py-4"><p className="font-semibold">{row.transaction.description}</p><p className="mt-1 text-xs text-muted-foreground">{uz.ledgerType[row.transaction.type]}</p></TableCell><TableCell className="text-right"><Money value={row.transaction.cashIn} tone={row.transaction.cashIn ? "positive" : "muted"} /></TableCell><TableCell className="text-right"><Money value={row.transaction.cashOut} tone={row.transaction.cashOut ? "debt" : "muted"} /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => setSelected(row)}>{uz.actions.details}</Button></TableCell></TableRow>)}</TableBody></Table></div>
      <ul className="divide-y md:hidden">{rows.map((row) => <li key={row.transaction.id} className="space-y-3 py-5"><div className="flex items-center justify-between gap-2"><p className="text-xs text-muted-foreground">{formatDate(row.transaction.effectiveDate)}</p><span className="text-xs font-semibold">{uz.ledgerType[row.transaction.type]}</span></div><p className="text-sm font-semibold">{row.transaction.description}</p><div className="flex flex-wrap items-end justify-between gap-3"><div><p className={row.transaction.cashOut ? "text-xs text-danger" : "text-xs text-success"}>{row.transaction.cashOut ? uz.dashboard.cashOut : uz.dashboard.cashIn}</p><Money value={row.transaction.cashOut || row.transaction.cashIn} tone={row.transaction.cashOut ? "debt" : "positive"} className="text-sm font-semibold" /></div><Button variant="outline" size="sm" onClick={() => setSelected(row)}>{uz.actions.details}</Button></div></li>)}</ul>
    </> : <div className="flex flex-col items-center gap-3 py-16 text-center"><BookOpen className="size-8 text-muted-foreground" aria-hidden /><h2 className="font-semibold">{uz.ledger.empty}</h2><p className="text-sm text-muted-foreground">{uz.ledger.emptyNote}</p>{filtered && <Button variant="outline" onClick={reset}><RotateCcw aria-hidden />{uz.ledger.reset}</Button>}</div>}
    <LedgerDetails row={selected} onClose={() => setSelected(null)} />
    {entryOpen && <CashEntryForm open={entryOpen} onClose={() => setEntryOpen(false)} onFinish={() => { setEntryOpen(false); setNotice(true); }} />}
  </div>;
}