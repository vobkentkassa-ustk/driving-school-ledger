import { uz } from "@/i18n/uz";

/** Per-page head metadata with the app name appended. */
export function pageHead(title: string, description: string = uz.app.tagline) {
  const full = `${title} — ${uz.app.name}`;
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { property: "og:title", content: full },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  };
}
