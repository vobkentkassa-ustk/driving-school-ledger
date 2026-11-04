import type { GroupStatus } from "@/types/domain";

export const groupStatuses = ["upcoming", "active", "finished"] as const satisfies readonly GroupStatus[];
export interface GroupFilters { status: "all" | GroupStatus }

export function parseGroupFilters(search: Record<string, unknown>): GroupFilters {
  const s = search["status"];
  return { status: typeof s === "string" && (groupStatuses as readonly string[]).includes(s) ? (s as GroupStatus) : "all" };
}

/** Form input check only; nothing is saved. */
export function groupFormErrors(input: { name: string; capacity: string; mentorId: string }) {
  const cap = Number(input.capacity);
  return {
    name: !input.name.trim(),
    mentorId: !input.mentorId,
    capacity: !Number.isInteger(cap) || cap < 1 || cap > 100,
  };
}
