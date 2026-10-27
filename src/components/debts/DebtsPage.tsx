import { Suspense } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { HandCoins, RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate, formatNumber } from "@/lib/format";
import { debtCategories, debtStatuses, parseDebtFilters } from "@/lib/debts";
import type { DebtFilters } from "@/types/domain";
import { debtListQuery } from "./query";
import { DebtDetails } from "./DebtDetails";

const routeApi = getRouteApi("/admin/qarzlar");

export function DebtsPage() {
  const filters = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const { data: rows } = useSuspenseQuery(debtListQuery(filters));
  const update = (patch: Partial<DebtFilters>) => { void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false }); };
  const filtered = Boolean(filters.q || filters.category !== "all" || filters.status !== "all");
  const reset = () => update({ q: "", category: "all", status: "all" });
  return <div className="space-y-6">
    <header><p className="mb-2 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{uz.debts.title}</h1></header>
    <section aria-label={uz.debts.categories} className="space-y-5 border-y py-5">
      <Tabs value={filters.category} onValueChange={(category) => update({ category: parseDebtFilters({ category }).category })}>
        <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">{["all", ...debtCategories].map((category) => <TabsTrigger key={category} value={category} className="min-h-9 flex-none border border-transparent px-3 data-[state=active]:border-primary data-[state=active]:bg-accent data-[state=active]:text-primary">{category === "all" ? uz.debts.allCategories : uz.debtCategory[category as typeof debtCategories[number]]}</TabsTrigger>)}</TabsList>
      </Tabs>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto]">
        <div className="space-y-2"><Label htmlFor="debt-search">{uz.ledger.search}</Label><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden /><Input id="debt-search" value={filters.q} maxLength={200} onChange={(e) => update({ q: e.target.value })} placeholder={uz.debts.searchPlaceholder} className="pl-9" /></div></div>
        <div className="space-y-2"><Label htmlFor="debt-status">{uz.fields.status}</Label><Select value={filters.status} onValueChange={(status) => update({ status: parseDebtFilters({ status }).status })}><SelectTrigger id="debt-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{uz.debts.allStatuses}</SelectItem>{debtStatuses.map((status) => <SelectItem key={status} value={status}>{uz.debtStatus[status]}</SelectItem>)}</SelectContent></Select></div>
        <Button variant="outline" size="icon" title={uz.ledger.reset} aria-label={uz.ledger.reset} onClick={reset} disabled={!filtered} className="self-end"><RotateCcw aria-hidden /></Button>
      </div>
    </section>
    <p className="text-sm text-muted-foreground">{uz.debts.results}: <span className="font-mono font-semibold text-foreground">{formatNumber(rows.length)}</span></p>
    {rows.length ? <>
      <div className="hidden lg:block"><Table><TableHeader><TableRow><TableHead>{uz.fields.debtor}</TableHead><TableHead>{uz.debts.category}</TableHead><TableHead>{uz.fields.status}</TableHead><TableHead className="text-right">{uz.fields.outstanding}</TableHead><TableHead><span className="sr-only">{uz.actions.details}</span></TableHead></TableRow></TableHeader><TableBody>{rows.map((d) => <TableRow key={d.id}><TableCell className="max-w-xs py-5"><p className="font-semibold">{d.debtorName}</p><p className="mt-1 text-xs text-muted-foreground">{d.reason}</p><p className="mt-1 text-xs text-muted-foreground">{d.id} · {formatDate(d.effectiveDate)}</p></TableCell><TableCell className="text-sm">{uz.debtCategory[d.category]}</TableCell><TableCell><StatusBadge kind="debt" status={d.status} /></TableCell><TableCell className="text-right"><Money value={d.outstandingAmount} tone={d.outstandingAmount ? "debt" : "muted"} className="text-sm font-semibold" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => update({ debt: d.id })}>{uz.actions.details}</Button></TableCell></TableRow>)}</TableBody></Table></div>
      <ul className="divide-y lg:hidden">{rows.map((d) => <li key={d.id} className="space-y-3 py-5"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{d.debtorName}</p><StatusBadge kind="debt" status={d.status} /></div><p className="text-xs text-muted-foreground">{uz.debtCategory[d.category]} · {formatDate(d.effectiveDate)}</p><p className="text-sm text-muted-foreground">{d.reason}</p><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="mb-1 text-xs text-danger">{uz.fields.outstanding}</p><Money value={d.outstandingAmount} tone={d.outstandingAmount ? "debt" : "muted"} className="text-sm font-semibold" /></div><Button variant="outline" size="sm" onClick={() => update({ debt: d.id })}>{uz.actions.details}</Button></div></li>)}</ul>
    </> : <div className="flex flex-col items-center gap-3 py-16 text-center"><HandCoins className="size-8 text-muted-foreground" aria-hidden /><h2 className="font-semibold">{uz.debts.empty}</h2><p className="text-sm text-muted-foreground">{uz.debts.emptyNote}</p>{filtered && <Button variant="outline" onClick={reset}><RotateCcw aria-hidden />{uz.ledger.reset}</Button>}</div>}
    <Sheet open={Boolean(filters.debt)} onOpenChange={(open) => { if (!open) update({ debt: "" }); }}><SheetContent className="w-full overflow-y-auto sm:max-w-lg"><SheetTitle className="pr-6">{uz.debts.details}</SheetTitle><SheetDescription className="mt-2">{uz.preview.mockBadge}</SheetDescription>{filters.debt && <Suspense fallback={<div role="status" aria-label={uz.dashboard.loading} className="mt-6 space-y-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>}><DebtDetails id={filters.debt} onSelect={(debt) => update({ debt })} /></Suspense>}</SheetContent></Sheet>
  </div>;
}