import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/")({
  head: () => pageHead(uz.nav.dashboard),
  component: () => <PlaceholderPage title={uz.nav.dashboard} />,
});
