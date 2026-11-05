import { queryOptions } from "@tanstack/react-query";
import { getStudentDirectory, listDebtRows, listMentorRequests } from "@/mocks/services";
import { DEMO_MENTOR } from "@/components/shell/nav";

const scope = { role: "mentor", mentorId: DEMO_MENTOR.id } as const;
export const mentorRequestsQuery = queryOptions({ queryKey: ["mentor", scope.mentorId, "requests"], queryFn: () => listMentorRequests(scope.mentorId), staleTime: 60_000 });
export const mentorStudentsQuery = queryOptions({ queryKey: ["mentor", scope.mentorId, "students"], queryFn: () => getStudentDirectory(scope), staleTime: 60_000 });
export const mentorDebtsQuery = queryOptions({ queryKey: ["mentor", scope.mentorId, "debts"], queryFn: () => listDebtRows(scope, { category: "all", status: "all", q: "", debt: "" } }), staleTime: 60_000 });
