import { isCalendarDate } from "@/lib/ledger";
import type { OperationFilters } from "@/types/domain";

export function parseOperationFilters(search: Record<string, unknown>): OperationFilters {
  return {
    q: typeof search['q'] === "string" ? search['q'].slice(0, 200) : "",
    from: typeof search['from'] === "string" && isCalendarDate(search['from']) ? search['from'] : "",
    to: typeof search['to'] === "string" && isCalendarDate(search['to']) ? search['to'] : "",
    kind: search['kind'] === "cash" || search['kind'] === "internal" ? search['kind'] : "all",
    operation: typeof search['operation'] === "string" ? search['operation'].slice(0, 100) : "",
  };
}