import { createFileRoute, useRouter, type SearchSchemaInput } from "@tanstack/react-router";
import { DebtsPage } from "@/components/debts/DebtsPage";
import { debtListQuery, debtDetailQuery } from "@/components/debts/query";
import { parseDebtFilters } from "@/lib/debts";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/qarzlar")({
  validateSearch: (search: { q?: string; category?: string; status?: string; debt?: string } & SearchSchemaInput) => parseDebtFilters(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(debtListQuery(deps)),
      deps.debt ? context.queryClient.ensureQueryData(debtDetailQuery(deps.debt)) : Promise.resolve(),
    ]);
  },
  head: () => pageHead(uz.debts.title, uz.debts.description),
  component: DebtsPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading} className="space-y-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>,
  errorComponent: DebtsError,
});

function DebtsError() {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  return <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p className="text-sm text-muted-foreground">{uz.fallback.errorDescription}</p><Button onClick={async () => { await queryClient.resetQueries({ queryKey: ["debts"] }); await router.invalidate(); }}>{uz.fallback.retry}</Button></div>;
}
