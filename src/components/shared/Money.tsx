import { cn } from "@/lib/utils";
import { formatMoney } from "@/lib/format";

type Tone = "default" | "debt" | "positive" | "muted";

const tones: Record<Tone, string> = {
  default: "text-foreground",
  debt: "text-danger",
  positive: "text-success",
  muted: "text-muted-foreground",
};

export function Money({ value, tone = "default", className }: { value: number; tone?: Tone; className?: string }) {
  return <span className={cn("font-mono tabular-nums whitespace-nowrap", tones[tone], className)}>{formatMoney(value)}</span>;
}
