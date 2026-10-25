import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FlaskConical, LayoutDashboard, Palette, Smartphone } from "lucide-react";
import { uz } from "@/i18n/uz";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: uz.app.name },
      { name: "description", content: uz.entry.metaDescription },
      { property: "og:title", content: uz.app.name },
      { property: "og:description", content: uz.entry.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EntryPage,
});

const cardCls =
  "group flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-card transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const statusLinks = [
  { to: "/kutilmoqda", label: uz.status.pending.title },
  { to: "/bloklangan", label: uz.status.blocked.title },
  { to: "/ruxsat-yoq", label: uz.status.accessDenied.title },
  { to: "/seans-tugadi", label: uz.status.sessionExpired.title },
] as const;

function EntryPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-8 px-4 py-12">
      <header className="space-y-3">
        <p className="text-sm font-semibold text-primary">{uz.app.name}</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{uz.entry.title}</h1>
        <p className="flex items-start gap-2 text-muted-foreground">
          <FlaskConical className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
          {uz.entry.subtitle}
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link to="/admin" className={cardCls}>
          <LayoutDashboard className="size-8 text-primary" aria-hidden />
          <div>
            <h2 className="text-lg font-bold">{uz.roles.admin}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{uz.entry.adminDescription}</p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {uz.entry.open} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
        <Link to="/mentor" className={cardCls}>
          <Smartphone className="size-8 text-primary" aria-hidden />
          <div>
            <h2 className="text-lg font-bold">{uz.roles.mentor}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{uz.entry.mentorDescription}</p>
          </div>
          <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-primary">
            {uz.entry.open} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      </div>

      <section className="flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-muted-foreground">{uz.entry.statusPages}:</span>
        {statusLinks.map((l) => (
          <Link key={l.to} to={l.to} className="rounded-full border bg-card px-3 py-1 font-medium hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {l.label}
          </Link>
        ))}
        <Link to="/dizayn" className="ml-auto inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground">
          <Palette className="size-4" aria-hidden /> {uz.shell.design}
        </Link>
      </section>
    </main>
  );
}
