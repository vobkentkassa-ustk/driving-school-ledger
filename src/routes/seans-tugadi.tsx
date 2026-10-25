import { createFileRoute } from "@tanstack/react-router";
import { TimerOff } from "lucide-react";
import { StatusScreen } from "@/components/shell/StatusScreen";
import { uz } from "@/i18n/uz";
import { pageHead } from "@/lib/head";

export const Route = createFileRoute("/seans-tugadi")({
  head: () => pageHead(uz.status.sessionExpired.title, uz.status.sessionExpired.description),
  component: () => <StatusScreen icon={TimerOff} tone="info" title={uz.status.sessionExpired.title} description={uz.status.sessionExpired.description} />,
});
