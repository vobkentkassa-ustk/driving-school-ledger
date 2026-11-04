import { createFileRoute, type SearchSchemaInput } from "@tanstack/react-router";
import { GroupsPage } from "@/components/groups/GroupsPage";
import { groupOverviewQuery } from "@/components/groups/query";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";
import { parseGroupFilters } from "@/lib/groups";

export const Route = createFileRoute("/admin/guruhlar")({
  validateSearch: (search: { status?: string } & SearchSchemaInput) => parseGroupFilters(search),
  loader: ({ context }) => context.queryClient.ensureQueryData(groupOverviewQuery),
  head: () => pageHead(uz.groups.title, uz.groups.description),
  component: GroupsPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading} className="space-y-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-64 w-full" /></div>,
  errorComponent: () => <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p>{uz.fallback.errorDescription}</p></div>,
});
