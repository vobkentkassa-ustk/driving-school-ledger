import {
  BookOpen,
  FileClock,
  FilePen,
  GraduationCap,
  HandCoins,
  LayoutDashboard,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { uz } from "@/i18n/uz";

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const adminNav = [
  { to: "/admin", label: uz.nav.dashboard, icon: LayoutDashboard, exact: true },
  { to: "/admin/daftar", label: uz.nav.ledger, icon: BookOpen },
  { to: "/admin/sorovlar", label: uz.nav.requests, icon: FileClock },
  { to: "/admin/qarzlar", label: uz.nav.debts, icon: HandCoins },
  { to: "/admin/oquvchilar", label: uz.nav.students, icon: GraduationCap },
  { to: "/admin/guruhlar", label: uz.nav.groups, icon: UsersRound },
  { to: "/admin/foydalanuvchilar", label: uz.nav.users, icon: Users },
] as const satisfies readonly NavItem[];

export const mentorNav = [
  { to: "/mentor", label: uz.nav.drafts, icon: FilePen, exact: true },
  { to: "/mentor/oquvchilar", label: uz.nav.myStudents, icon: GraduationCap },
  { to: "/mentor/qarzlar", label: uz.nav.myDebts, icon: Wallet },
] as const satisfies readonly NavItem[];

/** Demo-only mentor identity. Not real security; real scoping must be enforced by the backend. */
export const DEMO_MENTOR = { id: "m1", name: uz.samples.names.dilshod } as const;
