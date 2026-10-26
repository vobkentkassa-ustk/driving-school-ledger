import { createFileRoute, useRouter } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/components/dashboard/AdminDashboardPage";
import { adminDashboardQuery } from "@/components/dashboard/query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/")({
  head: () => pageHead(uz.nav.dashboard, uz.dashboard.description),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminDashboardQuery),
  pendingComponent: DashboardPending,
  errorComponent: DashboardError,
  notFoundComponent: () => <p>{uz.fallback.notFoundTitle}</p>,
  component: AdminDashboardPage,
});

function DashboardPending() {
  return <div aria-label={uz.dashboard.loading} role="status" className="space-y-6"><Skeleton className="h-10 w-64" /><div className="grid gap-4 md:grid-cols-3">{[0, 1, 2].map((id) => <Skeleton key={id} className="h-40" />)}</div><Skeleton className="h-80 w-full" /></div>;
}

function DashboardError() {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  return <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p className="text-sm text-muted-foreground">{uz.fallback.errorDescription}</p><Button onClick={async () => { await queryClient.resetQueries({ queryKey: adminDashboardQuery.queryKey }); await router.invalidate(); }}>{uz.fallback.retry}</Button></div>;
}
