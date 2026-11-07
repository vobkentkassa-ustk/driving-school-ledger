import { queryOptions } from "@tanstack/react-query";
import { getOperationHistoryDetail, listOperationHistory } from "@/mocks/services";
import type { OperationFilters } from "@/types/domain";

export const operationHistoryQuery = ({ operation: _operation, ...filters }: OperationFilters) => queryOptions({
  queryKey: ["operation-history", filters],
  queryFn: () => listOperationHistory({ ...filters, operation: "" }),
  staleTime: 60_000,
});
export const operationDetailQuery = (id: string) => queryOptions({
  queryKey: ["operation-history-detail", id], queryFn: () => getOperationHistoryDetail(id), staleTime: 60_000,
});