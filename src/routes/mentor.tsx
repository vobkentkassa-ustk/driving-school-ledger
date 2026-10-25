import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MentorShell } from "@/components/shell/MentorShell";

/** Demo-only: no real role check here. Mentor data scoping must be enforced by the backend later. */
export const Route = createFileRoute("/mentor")({
  component: () => (
    <MentorShell>
      <Outlet />
    </MentorShell>
  ),
});
