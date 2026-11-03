import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { RotateCcw, Search, Users, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Money } from "@/components/shared/Money";
import { uz } from "@/i18n/uz";
import { formatDate, formatNumber } from "@/lib/format";
import type { StudentFilters } from "@/types/domain";
import { studentDirectoryQuery } from "./query";
import { StudentProfile } from "./StudentProfile";

const api = getRouteApi("/admin/oquvchilar");
export function StudentsPage() {
  const filters = api.useSearch();
  const navigate = api.useNavigate();
  const { data } = useSuspenseQuery(studentDirectoryQuery);
  const q = filters.q.trim().toLocaleLowerCase("uz");
  const rows = data.profiles.filter((p) => (filters.group === "all" || p.group.id === filters.group) && (!q || [p.student.fullName, p.student.phone, p.group.name, p.mentorName].join(" ").toLocaleLowerCase("uz").includes(q)));
  const selected = data.profiles.find((p) => p.student.id === filters.student);
  const update = (patch: Partial<StudentFilters>) => { void navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true, resetScroll: false }); };
  const filtered = Boolean(filters.q || filters.group !== "all");
  const reset = () => update({ q: "", group: "all" });
  return <div className="space-y-6">
    <header><p className="mb-2 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{uz.students.title}</h1><p className="mt-2 text-xs text-muted-foreground">{uz.students.asOf}: {formatDate(data.asOfDate)}</p></header>
    <section className="grid gap-4 border-y py-5 sm:grid-cols-[minmax(0,1fr)_14rem_auto]">
      <div className="space-y-2"><Label htmlFor="student-search">{uz.ledger.search}</Label><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden /><Input id="student-search" value={filters.q} onChange={(e) => update({ q: e.target.value })} placeholder={uz.students.searchPlaceholder} className="pl-9" /></div></div>
      <div className="space-y-2"><Label htmlFor="student-group">{uz.fields.group}</Label><Select value={filters.group} onValueChange={(group) => update({ group })}><SelectTrigger id="student-group"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{uz.students.allGroups}</SelectItem>{data.groups.map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}</SelectContent></Select></div>
      <Button variant="outline" size="icon" title={uz.ledger.reset} aria-label={uz.ledger.reset} disabled={!filtered} className="self-end" onClick={reset}><RotateCcw aria-hidden /></Button>
    </section>
    <p className="text-sm text-muted-foreground">{uz.students.count}: <span className="font-mono font-semibold text-foreground">{formatNumber(rows.length)}</span></p>
    {rows.length ? <>
      <div className="hidden xl:block"><Table><TableHeader><TableRow><TableHead>{uz.fields.student}</TableHead><TableHead>{uz.fields.group}</TableHead><TableHead className="text-right">{uz.students.paid}</TableHead><TableHead className="text-right">{uz.students.remaining}</TableHead><TableHead><span className="sr-only">{uz.actions.details}</span></TableHead></TableRow></TableHeader><TableBody>{rows.map((p) => <TableRow key={p.student.id}><TableCell className="py-5"><p className="font-semibold">{p.student.fullName}</p>{p.under30Warning && <p className="mt-2 flex max-w-52 items-start gap-1 text-xs text-warning"><TriangleAlert className="size-3 shrink-0" aria-hidden />{uz.warnings.under30}</p>}</TableCell><TableCell><p className="text-sm">{p.group.name}</p><p className="mt-1 text-xs text-muted-foreground">{p.mentorName}</p></TableCell><TableCell className="text-right"><Money value={p.summary.paidAmount} className="text-sm" /></TableCell><TableCell className="text-right"><Money value={p.summary.remainingAmount} tone="debt" className="text-sm font-semibold" /></TableCell><TableCell><Button variant="ghost" size="sm" onClick={() => update({ student: p.student.id })}>{uz.actions.details}</Button></TableCell></TableRow>)}</TableBody></Table></div>
      <ul className="divide-y xl:hidden">{rows.map((p) => <li key={p.student.id} className="space-y-3 py-5"><p className="font-semibold">{p.student.fullName}</p><p className="text-xs text-muted-foreground">{p.group.name} · {p.mentorName}</p>{p.under30Warning && <p className="flex gap-2 text-xs text-warning"><TriangleAlert className="size-4 shrink-0" aria-hidden />{uz.warnings.under30}</p>}<div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs text-danger">{uz.students.remaining}</p><Money value={p.summary.remainingAmount} tone="debt" className="text-sm font-semibold" /></div><Button variant="outline" size="sm" onClick={() => update({ student: p.student.id })}>{uz.actions.details}</Button></div></li>)}</ul>
    </> : <div className="flex flex-col items-center gap-3 py-16 text-center"><Users className="size-8 text-muted-foreground" aria-hidden /><h2 className="font-semibold">{uz.students.empty}</h2>{filtered && <Button variant="outline" onClick={reset}>{uz.ledger.reset}</Button>}</div>}
    <Sheet open={Boolean(filters.student)} onOpenChange={(open) => { if (!open) update({ student: "" }); }}><SheetContent className="w-full overflow-y-auto sm:max-w-lg"><SheetTitle>{uz.students.profile}</SheetTitle><SheetDescription className="mt-2">{uz.preview.mockBadge}</SheetDescription>{selected ? <StudentProfile key={selected.student.id} profile={selected} /> : <p className="mt-6 text-sm text-muted-foreground">{uz.students.notFound}</p>}</SheetContent></Sheet>
  </div>;
}