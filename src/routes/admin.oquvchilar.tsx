import { createFileRoute, useRouter, type SearchSchemaInput } from "@tanstack/react-router";
import { StudentsPage } from "@/components/students/StudentsPage";
import { studentDirectoryQuery } from "@/components/students/query";
import { parseStudentFilters } from "@/lib/students";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/oquvchilar")({
  validateSearch: (search: { q?: string; group?: string; student?: string } & SearchSchemaInput) => parseStudentFilters(search),
  loader: ({ context }) => context.queryClient.ensureQueryData(studentDirectoryQuery),
  head: () => pageHead(uz.students.title, uz.students.description),
  component: StudentsPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading} className="space-y-6"><Skeleton className="h-10 w-48" /><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div>,
  errorComponent: StudentsError,
});

function StudentsError() {
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();
  return <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p>{uz.fallback.errorDescription}</p><Button onClick={async () => { await queryClient.resetQueries({ queryKey: studentDirectoryQuery.queryKey }); await router.invalidate(); }}>{uz.fallback.retry}</Button></div>;
}
