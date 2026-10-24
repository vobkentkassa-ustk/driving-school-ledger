import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { uz } from "@/i18n/uz";
import { cn } from "@/lib/utils";

const tones = {
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
} as const;

export function StatusScreen({
  icon: Icon,
  title,
  description,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone: keyof typeof tones;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-card">
        <div className={cn("mx-auto flex size-14 items-center justify-center rounded-full", tones[tone])}>
          <Icon className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {uz.status.back}
        </Link>
      </div>
    </main>
  );
}
