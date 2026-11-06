import { queryOptions } from "@tanstack/react-query";
import { listAdminRequests, listAdminUsers } from "@/mocks/services";
import type { RequestFilters, UserFilters } from "@/types/domain";

export const adminRequestsQuery = (filters: RequestFilters) => queryOptions({ queryKey: ["admin-requests", filters], queryFn: () => listAdminRequests(filters), staleTime: 60_000 });
export const adminUsersQuery = (filters: UserFilters) => queryOptions({ queryKey: ["admin-users", filters], queryFn: () => listAdminUsers(filters), staleTime: 60_000 });