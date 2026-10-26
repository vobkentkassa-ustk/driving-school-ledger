import { queryOptions } from "@tanstack/react-query";
import { listCashLedger } from "@/mocks/services";
import type { CashLedgerFilters } from "@/types/domain";

export const cashLedgerQuery = (filters: CashLedgerFilters) => queryOptions({
  queryKey: ["cash-ledger", filters],
  queryFn: () => listCashLedger(filters),
  staleTime: 60_000,
});