import { queryOptions } from "@tanstack/react-query";
import { getAdminDashboard } from "@/mocks/services";

export const adminDashboardQuery = queryOptions({
  queryKey: ["admin-dashboard"],
  queryFn: getAdminDashboard,
  staleTime: 60_000,
});