import { useState } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Search, RotateCcw, Eye, ShieldCheck, ShieldBan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Money } from "@/components/shared/Money";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { uz } from "@/i18n/uz";
import { formatDate, formatDateTime, formatNumber } from "@/lib/format";
import { parseRequestFilters, parseUserFilters, requestStatuses, userRoles, userStatuses } from "@/lib/admin-review";
import type { AdminRequestRow, User } from "@/types/domain";
import { adminRequestsQuery, adminUsersQuery } from "./query";
import { RequestReviewDialog, UserStatusDialog } from "./ReviewDialogs";

const requestApi = getRouteApi("/admin/sorovlar");
const userApi = getRouteApi("/admin/foydalanuvchilar");
function PageHeader({ title }: { title: string }) {
  return <header><p className="mb-2 text-xs font-semibold text-info">{uz.preview.mockBadge}</p><h1 className="text-2xl font-extrabold sm:text-3xl">{title}</h1></header>;
}

export function RequestsPage() {
  const filters = requestApi.useSearch();
  const navigate = requestApi.useNavigate();
  const { data: rows } = useSuspenseQuery(adminRequestsQuery(filters));
  const [selected, setSelected] = useState<AdminRequestRow | null>(null);
  return <div className="space-y-6"><PageHeader title={uz.requests.title} />
    <section className="flex flex-wrap items-end gap-4 border-y py-5">
      <div className="min-w-0 flex-1 basis-64 space-y-2"><Label htmlFor="request-search">{uz.ledger.search}</Label><div className="relative"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" aria-hidden /><Input id="request-search" className="pl-9" placeholder={uz.requests.search} value={filters.q} onChange={(e) => void navigate({ search: { ...filters, q: e.target.value }, replace: true })} /></div></div>
      <div className="w-full space-y-2 sm:w-48"><Label htmlFor="request-status">{uz.fields.status}</Label><Select value={filters.status} onValueChange={(status) => void navigate({ search: parseRequestFilters({ ...filters, status }), replace: true })}><SelectTrigger id="request-status"><SelectValue>{filters.status === "all" ? uz.requests.all : uz.paymentStatus[filters.status]}</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">{uz.requests.all}</SelectItem>{requestStatuses.map((s) => <SelectItem key={s} value={s}>{uz.paymentStatus[s]}</SelectItem>)}</SelectContent></Select></div>
      <Button variant="outline" onClick={() => void navigate({ search: parseRequestFilters({}), replace: true })}><RotateCcw aria-hidden />{uz.ledger.reset}</Button>
    </section><p className="text-sm text-muted-foreground">{uz.requests.count}: {formatNumber(rows.length)}</p>
    {rows.length ? <ul className="divide-y border-y">{rows.map((row) => <li key={row.request.id} className="grid items-center gap-4 py-5 md:grid-cols-[minmax(0,1fr)_11rem_10rem_auto]">
      <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold">{row.studentName}</h2><span className="font-mono text-xs text-muted-foreground">{row.request.id}</span></div><p className="mt-1 text-sm text-muted-foreground">{row.mentorName} · {row.groupName}</p><p className="mt-2 text-xs text-muted-foreground">{uz.fields.effectiveDate}: {formatDate(row.request.effectiveDate)}</p></div>
      <div><Money value={row.request.grossAmount} className="font-semibold" /><p className="mt-1 text-xs text-muted-foreground">{uz.paymentMethod[row.request.method]}</p></div><div><StatusBadge kind="payment" status={row.request.status} /></div><Button variant="outline" size="sm" className="justify-self-start" onClick={() => setSelected(row)}><Eye aria-hidden />{uz.requests.review}</Button>
    </li>)}</ul> : <p className="py-12 text-center text-muted-foreground">{uz.requests.empty}</p>}
    {selected && <RequestReviewDialog key={selected.request.id} row={selected} onClose={() => setSelected(null)} />}
  </div>;
}

export function UsersPage() {
  const filters = userApi.useSearch();
  const navigate = userApi.useNavigate();
  const { data: rows } = useSuspenseQuery(adminUsersQuery(filters));
  const [selected, setSelected] = useState<User | null>(null);
  return <div className="space-y-6"><PageHeader title={uz.users.title} />
    <section className="flex flex-wrap items-end gap-4 border-y py-5">
      <div className="min-w-0 flex-1 basis-56 space-y-2"><Label htmlFor="user-search">{uz.ledger.search}</Label><Input id="user-search" placeholder={uz.users.search} value={filters.q} onChange={(e) => void navigate({ search: { ...filters, q: e.target.value }, replace: true })} /></div>
      <div className="w-full space-y-2 sm:w-40"><Label htmlFor="user-role">{uz.users.role}</Label><Select value={filters.role} onValueChange={(role) => void navigate({ search: parseUserFilters({ ...filters, role }), replace: true })}><SelectTrigger id="user-role"><SelectValue>{filters.role === "all" ? uz.users.allRoles : uz.roles[filters.role]}</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">{uz.users.allRoles}</SelectItem>{userRoles.map((r) => <SelectItem key={r} value={r}>{uz.roles[r]}</SelectItem>)}</SelectContent></Select></div>
      <div className="w-full space-y-2 sm:w-52"><Label htmlFor="user-status">{uz.fields.status}</Label><Select value={filters.status} onValueChange={(status) => void navigate({ search: parseUserFilters({ ...filters, status }), replace: true })}><SelectTrigger id="user-status"><SelectValue>{filters.status === "all" ? uz.users.allStatuses : uz.userStatus[filters.status]}</SelectValue></SelectTrigger><SelectContent><SelectItem value="all">{uz.users.allStatuses}</SelectItem>{userStatuses.map((s) => <SelectItem key={s} value={s}>{uz.userStatus[s]}</SelectItem>)}</SelectContent></Select></div>
      <Button variant="outline" onClick={() => void navigate({ search: parseUserFilters({}), replace: true })}><RotateCcw aria-hidden />{uz.ledger.reset}</Button>
    </section><p className="text-sm text-muted-foreground">{uz.users.count}: {formatNumber(rows.length)}</p>
    {rows.length ? <ul className="divide-y border-y">{rows.map((user) => <li key={user.id} className="grid items-center gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_12rem_11rem_auto]">
      <div className="min-w-0"><h2 className="font-bold">{user.fullName}</h2><p className="mt-1 text-sm text-muted-foreground">{uz.roles[user.role]}</p><p className="mt-2 text-xs text-muted-foreground">{uz.fields.createdAt}: {formatDateTime(user.createdAt)}</p></div>
      <p className="break-words text-sm"><span className="text-muted-foreground">{uz.users.telegram}: </span>{user.telegramUsername ? `@${user.telegramUsername}` : uz.students.noPhone}</p><div><StatusBadge kind="user" status={user.status} /></div>
      <Button variant="outline" size="sm" className="justify-self-start" onClick={() => setSelected(user)}>{user.status === "active" ? <ShieldBan aria-hidden /> : <ShieldCheck aria-hidden />}{user.status === "active" ? uz.users.block : user.status === "blocked" ? uz.users.unblock : uz.users.approve}</Button>
    </li>)}</ul> : <p className="py-12 text-center text-muted-foreground">{uz.users.empty}</p>}
    {selected && <UserStatusDialog key={selected.id} user={selected} onClose={() => setSelected(null)} />}
  </div>;
}