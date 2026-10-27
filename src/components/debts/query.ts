import { queryOptions } from "@tanstack/react-query";
import { getDebtDetail, listDebtRows } from "@/mocks/services";
import type { DebtFilters } from "@/types/domain";

export const debtListQuery = (filters: DebtFilters) => queryOptions({
  queryKey: ["debts", "list", filters],
  queryFn: () => listDebtRows({ role: "admin" }, filters),
  staleTime: 60_000,
});

export const debtDetailQuery = (id: string) => queryOptions({
  queryKey: ["debts", "detail", id],
  queryFn: () => getDebtDetail({ role: "admin" }, id),
  staleTime: 60_000,
});