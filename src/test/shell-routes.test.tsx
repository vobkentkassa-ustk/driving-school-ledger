import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { adminNav, mentorNav } from "@/components/shell/nav";

// Every navigation item must resolve to a real page (no dead primary navigation).
describe("Shell navigation", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  const paths = [
    ...adminNav.map((i) => i.to),
    ...mentorNav.map((i) => i.to),
    "/kutilmoqda",
    "/bloklangan",
    "/ruxsat-yoq",
    "/seans-tugadi",
    "/dizayn",
  ];

  it.each(paths)("%s matches a page", (path) => {
    const leaf = router.matchRoutes(path).at(-1);
    expect(leaf?.routeId).not.toBe(rootRouteId);
    expect(leaf?.routeId).not.toContain("$");
  });
});
