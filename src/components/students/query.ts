import { queryOptions } from "@tanstack/react-query";
import { getStudentDirectory } from "@/mocks/services";

export const studentDirectoryQuery = queryOptions({
  queryKey: ["student-directory", "admin"],
  queryFn: () => getStudentDirectory({ role: "admin" }),
  staleTime: 60_000,
});