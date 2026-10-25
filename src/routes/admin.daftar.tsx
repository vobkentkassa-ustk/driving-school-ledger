import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/admin/daftar")({
  head: () => pageHead(uz.nav.ledger),
  component: () => <PlaceholderPage title={uz.nav.ledger} />,
});
