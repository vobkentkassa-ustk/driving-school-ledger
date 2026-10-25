import { Link } from "@tanstack/react-router";
import { FlaskConical } from "lucide-react";
import { uz } from "@/i18n/uz";
import { cn } from "@/lib/utils";

/** Demo-only role switch: just navigates between workspaces. Grants nothing. */
export function DemoRoleSwitcher({ current, className }: { current: "admin" | "mentor"; className?: string }) {
  const target = current === "admin" ? "/mentor" : "/admin";
  const label = current === "admin" ? uz.shell.switchToMentor : uz.shell.switchToAdmin;
  const short = current === "admin" ? uz.roles.mentor : uz.roles.admin;
  return (
    <div className={cn("flex items-center gap-2 rounded-lg border border-dashed border-info/50 bg-info-soft px-2.5 py-1.5 text-info", className)}>
      <FlaskConical className="size-4 shrink-0" aria-hidden />
      <div className="min-w-0 leading-tight">
        <p className="text-[11px] font-bold uppercase tracking-wide" title={uz.shell.demoRoleNote}>
          {uz.shell.demoRoleLabel}
        </p>
        <Link to={target} aria-label={label} title={label} className="block truncate text-xs font-semibold underline-offset-2 hover:underline focus-visible:underline focus-visible:outline-none">
          → {short}
        </Link>
      </div>
    </div>
  );
}
