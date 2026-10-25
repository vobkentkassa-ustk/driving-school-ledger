import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/components/shell/AdminShell";

/** Demo-only: no real role check here. Access control must be enforced by the backend later. */
export const Route = createFileRoute("/admin")({
  component: () => (
    <AdminShell>
      <Outlet />
    </AdminShell>
  ),
});
