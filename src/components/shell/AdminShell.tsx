import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { uz } from "@/i18n/uz";
import { adminNav } from "./nav";
import { DemoRoleSwitcher } from "./DemoRoleSwitcher";

const linkCls =
  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const activeCls = "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label={uz.shell.mainNav} className="flex flex-col gap-1">
      {adminNav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className={linkCls}
          activeProps={{ className: activeCls, "aria-current": "page" }}
          activeOptions={{ exact: "exact" in item && item.exact }}
        >
          <item.icon className="size-4 shrink-0" aria-hidden />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary font-mono text-sm font-bold text-primary-foreground">AK</span>
      <span className="leading-tight">
        <span className="block text-sm font-extrabold">{uz.app.name}</span>
        <span className="block text-xs text-muted-foreground">{uz.shell.adminWorkspace}</span>
      </span>
    </Link>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col gap-6 border-r bg-card p-4 lg:flex">
        <Brand />
        <NavList />
        <DemoRoleSwitcher current="admin" className="mt-auto" />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/90 px-4 backdrop-blur sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-10 items-center justify-center rounded-md border bg-card lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={uz.shell.openMenu}
            >
              <Menu className="size-5" aria-hidden />
            </SheetTrigger>
            <SheetContent side="left" className="flex w-72 flex-col gap-6 p-4">
              <SheetTitle className="sr-only">{uz.shell.mainNav}</SheetTitle>
              <Brand />
              <NavList onNavigate={() => setOpen(false)} />
              <DemoRoleSwitcher current="admin" className="mt-auto" />
            </SheetContent>
          </Sheet>
          <div className="lg:hidden">
            <p className="text-sm font-extrabold">{uz.app.name}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm font-medium text-muted-foreground sm:inline">{uz.shell.demoAdminName}</span>
            <span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-bold" aria-hidden>
              AD
            </span>
          </div>
        </header>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
