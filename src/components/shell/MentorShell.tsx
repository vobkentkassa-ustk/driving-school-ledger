import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { uz } from "@/i18n/uz";
import { DEMO_MENTOR, mentorNav } from "./nav";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";

export function MentorShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-lg flex-col border-x bg-background">
        <header className="sticky top-0 z-30 border-b bg-background/90 px-4 py-3 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 leading-tight">
              <p className="text-xs text-muted-foreground">{uz.shell.mentorWorkspace}</p>
              <p className="truncate text-sm font-extrabold">{DEMO_MENTOR.name}</p>
            </div>
            <DemoRoleSwitcher current="mentor" className="max-w-[55%]" />
          </div>
        </header>
        <main className="flex-1 px-4 py-5 pb-28">{children}</main>
        <nav
          aria-label={uz.shell.mainNav}
          className="fixed inset-x-0 bottom-0 z-30 mx-auto grid max-w-lg grid-cols-3 border-t bg-card pb-[env(safe-area-inset-bottom)]"
        >
          {mentorNav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
              activeProps={{ className: "text-primary", "aria-current": "page" }}
              activeOptions={{ exact: "exact" in item && item.exact }}
            >
              <item.icon className="size-5" aria-hidden />
              <span className="text-center leading-tight">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
