import { queryOptions } from "@tanstack/react-query";
import { getGroupOverview } from "@/mocks/services";

export const groupOverviewQuery = queryOptions({
  queryKey: ["group-overview", "admin"],
  queryFn: () => getGroupOverview({ role: "admin" }),
  staleTime: 60_000,
});
