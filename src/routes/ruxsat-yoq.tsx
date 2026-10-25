import { createFileRoute } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { StatusScreen } from "@/components/shell/StatusScreen";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/ruxsat-yoq")({
  head: () => pageHead(uz.status.accessDenied.title, uz.status.accessDenied.description),
  component: () => <StatusScreen icon={ShieldX} tone="danger" title={uz.status.accessDenied.title} description={uz.status.accessDenied.description} />,
});
