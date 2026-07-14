import type { MetadataRoute } from "next";

// Everything except /about, /login, and /signup requires a logged-in
// session (each page checks this itself, not a shared middleware — see
// the (app) layout, which does NOT redirect unauthenticated visitors on
// its own). An anonymous crawler hitting a gated route just gets bounced
// to /login anyway, so this isn't a security boundary — robots.txt is
// advisory and only respected by well-behaved crawlers — but explicitly
// disallowing it keeps crawl budget on the pages actually worth indexing
// instead of dozens of URLs that all resolve to the same login prompt.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/login", "/signup"],
      disallow: [
        "/api/",
        "/dashboard",
        "/units",
        "/medals",
        "/legend",
        "/story",
        "/milestones",
        "/settings",
        "/social",
      ],
    },
    sitemap: "https://battlecatsprogress.app/sitemap.xml",
  };
}
