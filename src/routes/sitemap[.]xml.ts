import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { REGIONS, SCHOOLS } from "@/lib/data";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0", changefreq: "weekly" as const },
          { path: "/search", priority: "0.9", changefreq: "weekly" as const },
          { path: "/favourites", priority: "0.5", changefreq: "monthly" as const },
          { path: "/notifications", priority: "0.5", changefreq: "monthly" as const },
          { path: "/profile", priority: "0.4", changefreq: "monthly" as const },
          ...REGIONS.map((r) => ({ path: `/regions/${r.id}`, priority: "0.8", changefreq: "weekly" as const })),
          ...SCHOOLS.map((s) => ({ path: `/schools/${s.id}`, priority: "0.7", changefreq: "weekly" as const })),
        ];
        const urls = entries.map((e) => `  <url><loc>${BASE_URL}${e.path}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
