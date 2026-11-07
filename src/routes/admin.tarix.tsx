import { createFileRoute, useRouter, type SearchSchemaInput } from "@tanstack/react-router";
import { HistoryPage } from "@/components/history/HistoryPage";
import { operationDetailQuery, operationHistoryQuery } from "@/components/history/query";
import { parseOperationFilters } from "@/lib/history";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/tarix")({
  validateSearch: (search: { q?: string; from?: string; to?: string; kind?: string; operation?: string } & SearchSchemaInput) => parseOperationFilters(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => { await Promise.all([
    context.queryClient.ensureQueryData(operationHistoryQuery(deps)),
    deps.operation ? context.queryClient.ensureQueryData(operationDetailQuery(deps.operation)) : Promise.resolve(),
  ]); },
  head: () => pageHead(uz.history.title, uz.history.description),
  component: HistoryPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading} className="space-y-6"><Skeleton className="h-10 w-64" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>,
  errorComponent: HistoryError,
});

function HistoryError() {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  return <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p className="text-sm text-muted-foreground">{uz.fallback.errorDescription}</p><Button onClick={async () => { await Promise.all([queryClient.resetQueries({ queryKey: ["operation-history"] }), queryClient.resetQueries({ queryKey: ["operation-history-detail"] })]); await router.invalidate(); }}>{uz.fallback.retry}</Button></div>;
}