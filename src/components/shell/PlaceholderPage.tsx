import { Construction } from "lucide-react";
import { uz } from "@/i18n/uz";

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-card px-6 py-16 text-center shadow-card">
        <Construction className="size-8 text-muted-foreground" aria-hidden />
        <p className="font-semibold">{uz.shell.placeholder}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{uz.shell.placeholderNote}</p>
      </div>
    </div>
  );
}
