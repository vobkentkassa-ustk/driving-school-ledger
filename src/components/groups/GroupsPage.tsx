import { useState } from "react";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate, formatNumber } from "@/lib/format";
import { groupStatuses } from "@/lib/groups";
import type { Group } from "@/types/domain";
import { groupOverviewQuery } from "./query";
import { GroupForm } from "./GroupForm";
import { TransferDemo } from "./TransferDemo";

const api = getRouteApi("/admin/guruhlar");
export function GroupsPage() {
  const filters = api.useSearch();
  const navigate = api.useNavigate();
  const { data } = useSuspenseQuery(groupOverviewQuery);
  const [form, setForm] = useState<{ open: boolean; group: Group | null; key: number }>({ open: false, group: null, key: 0 });
  const rows = data.items.filter((i) => filters.status === "all" || i.group.status === filters.status);
  const openForm = (group: Group | null) => setForm((f) => ({ open: true, group, key: f.key + 1 }));
  return <div className="space-y-6">
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="mb-2 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{uz.groups.title}</h1></div>
      <div className="flex flex-wrap gap-2"><TransferDemo demos={data.transferDemos} /><Button onClick={() => openForm(null)}><Plus aria-hidden />{uz.groups.create}</Button></div>
    </header>
    <section className="flex flex-wrap items-end gap-4 border-y py-5">
      <div className="w-full space-y-2 sm:w-56"><Label htmlFor="group-status">{uz.fields.status}</Label><Select value={filters.status} onValueChange={(status) => void navigate({ search: { status: status as typeof filters.status }, replace: true })}><SelectTrigger id="group-status"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">{uz.groups.allStatuses}</SelectItem>{groupStatuses.map((s) => <SelectItem key={s} value={s}>{uz.groupStatus[s]}</SelectItem>)}</SelectContent></Select></div>
      <p className="text-sm text-muted-foreground">{uz.groups.count}: <span className="font-mono font-semibold text-foreground">{formatNumber(rows.length)}</span></p>
    </section>
    {rows.length ? <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{rows.map(({ group, mentorName, studentCount, students }) => <li key={group.id} className="flex flex-col gap-3 rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between gap-2"><h2 className="font-bold">{group.name}</h2><StatusBadge kind="group" status={group.status} /></div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">{uz.fields.mentor}</dt><dd>{mentorName}</dd>
        <dt className="text-muted-foreground">{uz.fields.startDate}</dt><dd>{group.startDate ? formatDate(group.startDate) : <span className="font-semibold text-warning">{uz.fields.startUnknown}</span>}</dd>
        <dt className="text-muted-foreground">{uz.fields.contractPrice}</dt><dd><Money value={group.contractPrice} /></dd>
        <dt className="text-muted-foreground">{uz.groups.capacity}</dt><dd className="font-mono">{formatNumber(studentCount)} / {formatNumber(group.capacity)}</dd>
      </dl>
      <div className="text-sm"><p className="mb-1 font-semibold">{uz.groups.students}</p>{students.length ? <ul className="flex flex-wrap gap-1.5">{students.map((s) => <li key={s.id}><Link to="/admin/oquvchilar" search={{ student: s.id }} className="rounded-full bg-muted px-2.5 py-0.5 text-xs hover:text-primary hover:underline">{s.fullName}</Link></li>)}</ul> : <p className="text-muted-foreground">{uz.groups.noStudents}</p>}</div>
      <Button variant="ghost" size="sm" className="mt-auto self-start" onClick={() => openForm(group)}><Pencil aria-hidden />{uz.groups.edit}</Button>
    </li>)}</ul> : <p className="py-12 text-center text-muted-foreground">{uz.groups.empty}</p>}
    <GroupForm key={form.key} open={form.open} onOpenChange={(open) => setForm((f) => ({ ...f, open }))} group={form.group} mentors={data.mentors} />
  </div>;
}
