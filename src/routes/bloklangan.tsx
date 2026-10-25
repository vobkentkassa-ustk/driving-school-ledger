import { createFileRoute } from "@tanstack/react-router";
import { Ban } from "lucide-react";
import { StatusScreen } from "@/components/shell/StatusScreen";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/bloklangan")({
  head: () => pageHead(uz.status.blocked.title, uz.status.blocked.description),
  component: () => <StatusScreen icon={Ban} tone="danger" title={uz.status.blocked.title} description={uz.status.blocked.description} />,
});
