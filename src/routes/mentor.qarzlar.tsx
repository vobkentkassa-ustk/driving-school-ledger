import { createFileRoute } from "@tanstack/react-router";
import { MentorDebtsPage } from "@/components/mentor/MentorPages";
import { mentorDebtsQuery } from "@/components/mentor/query";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/mentor/qarzlar")({
  loader: ({ context }) => context.queryClient.ensureQueryData(mentorDebtsQuery),
  head: () => pageHead(uz.nav.myDebts, uz.mentor.debtsDescription),
  component: MentorDebtsPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading} className="space-y-4"><Skeleton className="h-8 w-40" /><Skeleton className="h-40 w-full" /></div>,
  errorComponent: () => <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p>{uz.fallback.errorDescription}</p></div>,
});
