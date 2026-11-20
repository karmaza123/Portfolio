/**
 * Vercel Routing Middleware (framework-agnostic, runs before the filesystem
 * and vercel.json rewrites).
 *
 * solar.karmaza.design serves the Sunfield-1 solar park dashboard, a
 * self-contained static page at public/solar/index.html. A plain vercel.json
 * rewrite can't do this for the subdomain root, because "/" already matches
 * the portfolio's own index.html and real files win over rewrites.
 * Every other host continues to the portfolio unchanged.
 */
export const config = {
  // Skip the API functions and built assets; everything else is host-checked.
  matcher: ["/((?!api/|assets/|solar/).*)"],
};

const SOLAR_HOSTS = new Set(["solar.karmaza.design", "www.solar.karmaza.design"]);

export default function middleware(request: Request): Response {
  const url = new URL(request.url);
  if (SOLAR_HOSTS.has(url.hostname)) {
    // Same effect as `rewrite()` from @vercel/functions, without the dependency.
    return new Response(null, {
      headers: { "x-middleware-rewrite": new URL("/solar/index.html", url).toString() },
    });
  }
  // Same effect as `next()`: continue to the portfolio as normal.
  return new Response(null, { headers: { "x-middleware-next": "1" } });
}
