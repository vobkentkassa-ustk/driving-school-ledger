import { createFileRoute } from "@tanstack/react-router";
import { MentorDraftsPage } from "@/components/mentor/MentorPages";
import { mentorRequestsQuery, mentorStudentsQuery } from "@/components/mentor/query";
import { Skeleton } from "@/components/ui/skeleton";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/mentor/")({
  loader: ({ context }) => Promise.all([mentorRequestsQuery, mentorStudentsQuery].map((q) => context.queryClient.ensureQueryData(q as never))),
  head: () => pageHead(uz.mentor.draftsTitle, uz.mentor.draftsDescription),
  component: MentorDraftsPage,
  pendingComponent: () => <div role="status" aria-label={uz.dashboard.loading} className="space-y-4"><Skeleton className="h-8 w-40" /><Skeleton className="h-40 w-full" /></div>,
  errorComponent: () => <div role="alert" className="space-y-3 py-8"><h1 className="text-xl font-bold">{uz.fallback.errorTitle}</h1><p>{uz.fallback.errorDescription}</p></div>,
});
