import { createFileRoute, useRouter, type SearchSchemaInput } from "@tanstack/react-router";
import { UsersPage } from "@/components/admin-review/ReviewPages";
import { adminUsersQuery } from "@/components/admin-review/query";
import { parseUserFilters } from "@/lib/admin-review";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/foydalanuvchilar")({
  validateSearch: (search: { q?: string; status?: string; role?: string } & SearchSchemaInput) => parseUserFilters(search),
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => context.queryClient.ensureQueryData(adminUsersQuery(deps)),
  head: () => pageHead(uz.users.title, uz.users.description),
  component: UsersPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading}><Skeleton className="h-8 w-56" /><Skeleton className="mt-6 h-60 w-full" /></div>,
  errorComponent: ({ reset }) => <div role="alert" className="space-y-3"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p>{uz.fallback.errorDescription}</p><Retry reset={reset} /></div>,
});

function Retry({ reset }: { reset: () => void }) { const router = useRouter(); return <Button onClick={() => void router.invalidate().then(reset)}>{uz.fallback.retry}</Button>; }
