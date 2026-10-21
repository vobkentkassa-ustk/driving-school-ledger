import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { uz } from "@/i18n/uz";
import type { DebtStatus, GroupStatus, PaymentStatus, UserStatus } from "@/types/domain";

const badge = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap before:size-1.5 before:rounded-full before:bg-current",
  {
    variants: {
      tone: {
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        danger: "bg-danger-soft text-danger",
        info: "bg-info-soft text-info",
        muted: "bg-muted text-muted-foreground",
      },
    },
  },
);

type Tone = "success" | "warning" | "danger" | "info" | "muted";

type Props =
  | { kind: "payment"; status: PaymentStatus }
  | { kind: "debt"; status: DebtStatus }
  | { kind: "group"; status: GroupStatus }
  | { kind: "user"; status: UserStatus };

const map = {
  payment: { draft: "muted", pending: "warning", approved: "success", rejected: "danger" },
  debt: { open: "danger", partially_settled: "warning", settled: "success" },
  group: { upcoming: "info", active: "success", finished: "muted" },
  user: { pending_approval: "warning", active: "success", blocked: "danger" },
} as const satisfies Record<Props["kind"], Record<string, Tone>>;

const labels = {
  payment: uz.paymentStatus,
  debt: uz.debtStatus,
  group: uz.groupStatus,
  user: uz.userStatus,
};

export function StatusBadge(props: Props & { className?: string }) {
  const tone = (map[props.kind] as Record<string, Tone>)[props.status];
  const label = (labels[props.kind] as Record<string, string>)[props.status];
  return <span className={cn(badge({ tone }), props.className)}>{label}</span>;
}
