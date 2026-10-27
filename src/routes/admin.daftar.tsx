import { createFileRoute, useRouter } from "@tanstack/react-router";
import { CashLedgerPage } from "@/components/ledger/CashLedgerPage";
import { cashLedgerQuery } from "@/components/ledger/query";
import { parseLedgerFilters } from "@/lib/ledger";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/daftar")({
  validateSearch: parseLedgerFilters,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(cashLedgerQuery(deps)),
  head: () => pageHead(uz.ledger.title, uz.ledger.description),
  component: CashLedgerPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading} className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>,
  errorComponent: LedgerError,
  notFoundComponent: () => <p>{uz.fallback.notFoundTitle}</p>,
});

function LedgerError() {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  return <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p className="text-sm text-muted-foreground">{uz.fallback.errorDescription}</p><Button onClick={async () => { await queryClient.resetQueries({ queryKey: ["cash-ledger"] }); await router.invalidate(); }}>{uz.fallback.retry}</Button></div>;
}
