import { createFileRoute } from "@tanstack/react-router";
import { Hourglass } from "lucide-react";
import { StatusScreen } from "@/components/shell/StatusScreen";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/kutilmoqda")({
  head: () => pageHead(uz.status.pending.title, uz.status.pending.description),
  component: () => <StatusScreen icon={Hourglass} tone="warning" title={uz.status.pending.title} description={uz.status.pending.description} />,
});
