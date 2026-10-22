/**
 * Shared display formatters. Display only — never use these for money math.
 * Money: integer soʻm, e.g. 12 450 000 soʻm. Dates: DD.MM.YYYY, times HH:mm (Asia/Tashkent).
 */

import { uz } from "@/i18n/uz";

export const CURRENCY_SUFFIX = uz.currency.suffix;
const TZ = "Asia/Tashkent";

export function formatNumber(value: number): string {
  const sign = value < 0 ? "-" : "";
  const digits = Math.round(Math.abs(value)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatMoney(value: number): string {
  return `${formatNumber(value)} ${CURRENCY_SUFFIX}`;
}

/** Accepts "YYYY-MM-DD" (calendar date, no timezone shift) or a full ISO timestamp. */
export function formatDate(value: string): string {
  const plain = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (plain) return `${plain[3]}.${plain[2]}.${plain[1]}`;
  const p = tashkentParts(value);
  return `${p.day}.${p.month}.${p.year}`;
}

export function formatDateTime(value: string): string {
  const p = tashkentParts(value);
  return `${p.day}.${p.month}.${p.year} ${p.hour}:${p.minute}`;
}

function tashkentParts(iso: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(iso));
  const get = (t: string) => parts.find((x) => x.type === t)?.value ?? "";
  return { day: get("day"), month: get("month"), year: get("year"), hour: get("hour"), minute: get("minute") };
}
