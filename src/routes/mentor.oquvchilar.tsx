import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/shell/PlaceholderPage";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/mentor/oquvchilar")({
  head: () => pageHead(uz.nav.myStudents),
  component: () => <PlaceholderPage title={uz.nav.myStudents} />,
});
