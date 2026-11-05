import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

/**
 * Local-only stand-in for the /api/portal/* functions, so `npm run dev` works without Supabase,
 * Stripe or the Vercel CLI. It is a Vite dev-server plugin (`apply: "serve"`), so it is never part
 * of a production build, and under `vercel dev` Vercel answers /api before Vite sees it.
 *
 *   domain:   acmeplumbing.com
 *   password: demo-password
 *
 * Switch what the dashboard shows by visiting /__mock/scenario?s=full|warn|diy|batch|pastdue|empty|reset
 */

export const DEMO_DOMAIN = "acmeplumbing.com";
export const DEMO_PASSWORD = "demo-password";

type Req = {
  id: string;
  title: string;
  description: string;
  pageUrl: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  status: "pending" | "in_progress" | "completed" | "declined";
  createdAt: string;
  completedAt: string | null;
};

const seed = () => ({
  client: {
    companyName: "Acme Plumbing",
    domainName: DEMO_DOMAIN,
    planType: "subscription",
    billingStatus: "active",
    currentPeriodEnd: new Date(Date.now() + 29 * 86_400_000).toISOString(),
    monthlyEditLimit: 10,
    editsUsed: 4,
    hasBilling: true,
  },
  requests: [
    { id: "3", title: "Swap hero photo for the new van", description: "Replace the hero image with the attached photo of the new branded van. Keep the same crop.", pageUrl: "https://acmeplumbing.com/", attachmentUrl: "#", attachmentName: "van-photo.jpg", status: "in_progress", createdAt: "2026-11-03T09:00:00Z", completedAt: null },
    { id: "2", title: "Update opening hours", description: "We're now open Saturdays 9–1. Update the footer and the contact page.", pageUrl: "https://acmeplumbing.com/contact", attachmentUrl: null, attachmentName: null, status: "completed", createdAt: "2026-10-28T09:00:00Z", completedAt: "2026-10-29T14:00:00Z" },
    { id: "1", title: "Add a financing banner", description: "Add a banner announcing 0% financing on boiler installs across the top of every page.", pageUrl: null, attachmentUrl: null, attachmentName: null, status: "declined", createdAt: "2026-10-12T09:00:00Z", completedAt: "2026-10-13T10:00:00Z" },
    { id: "0", title: "Fix typo in services", description: "'Plummbing' on the services page.", pageUrl: "https://acmeplumbing.com/services", attachmentUrl: null, attachmentName: null, status: "pending", createdAt: "2026-10-01T09:00:00Z", completedAt: null },
  ] as Req[],
});

type State = ReturnType<typeof seed>;

function scenario(name: string): State {
  const s = seed();
  const c = s.client;
  if (name === "full") c.editsUsed = 10;
  if (name === "warn") c.editsUsed = 8;
  if (name === "diy") Object.assign(c, { planType: "cms_handover", monthlyEditLimit: 0, editsUsed: 0, currentPeriodEnd: null });
  if (name === "batch") Object.assign(c, { planType: "pay_as_you_go", monthlyEditLimit: 5, editsUsed: 2, currentPeriodEnd: null });
  if (name === "pastdue") c.billingStatus = "past_due";
  if (name === "empty") {
    s.requests = [];
    c.editsUsed = 0;
  }
  return s;
}

const send = (res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}) => {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers });
  res.end(JSON.stringify(body));
};

const readJson = (req: IncomingMessage) =>
  new Promise<Record<string, unknown>>((resolve) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        resolve({});
      }
    });
  });

const normalize = (input: string) =>
  input.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "");

export function portalMockApi(): Plugin {
  let state = seed();

  return {
    name: "portal-mock-api",
    apply: "serve",
    configureServer(server) {
      server.httpServer?.once("listening", () => {
        server.config.logger.info(
          `\n  Client portal (mock API): sign in at /portal/login with ${DEMO_DOMAIN} / ${DEMO_PASSWORD}\n`,
        );
      });

      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const path = url.pathname;
        if (!path.startsWith("/api/portal/") && !path.startsWith("/__mock/")) return next();

        if (path === "/__mock/scenario") {
          const name = url.searchParams.get("s") ?? "reset";
          state = scenario(name);
          return send(res, 200, { ok: true, scenario: name });
        }
        if (path === "/__mock/put") {
          res.writeHead(200);
          return res.end("{}");
        }

        if (path === "/api/portal/login" && req.method === "POST") {
          const body = await readJson(req);
          const ok = normalize(String(body.domain ?? "")) === DEMO_DOMAIN && body.password === DEMO_PASSWORD;
          if (!ok) return send(res, 401, { error: "Invalid domain or password.", code: "invalid_credentials" });
          return send(res, 200, { ok: true }, { "Set-Cookie": "portal_mock=1; Path=/; HttpOnly; SameSite=Lax" });
        }
        if (path === "/api/portal/logout") {
          return send(res, 200, { ok: true }, { "Set-Cookie": "portal_mock=; Path=/; Max-Age=0" });
        }

        if (!(req.headers.cookie ?? "").includes("portal_mock=1")) {
          return send(res, 401, { error: "Not signed in", code: "unauthenticated" });
        }

        if (path === "/api/portal/me") return send(res, 200, state);

        if (path === "/api/portal/billing") {
          return send(res, 200, { url: "/portal/dashboard?billing=opened" });
        }

        if (path === "/api/portal/upload-url") {
          const body = await readJson(req);
          return send(res, 200, {
            path: `demo/${String(body.filename ?? "file")}`,
            signedUrl: `http://${req.headers.host}/__mock/put`,
          });
        }

        if (path === "/api/portal/requests" && req.method === "POST") {
          const body = await readJson(req);
          const c = state.client;
          if (c.planType === "cms_handover") return send(res, 403, { error: "Your plan is self-managed, so there's nothing to submit.", code: "no_edits_on_plan" });
          if (c.billingStatus === "canceled") return send(res, 402, { error: "Billing is inactive. Open billing to restore your plan.", code: "billing_inactive" });
          if (c.editsUsed >= c.monthlyEditLimit) return send(res, 409, { error: "You've used all your edits for this period.", code: "quota_exceeded" });
          c.editsUsed += 1;
          const attachment = typeof body.attachmentPath === "string" ? body.attachmentPath : null;
          state.requests.unshift({
            id: String(Date.now()),
            title: String(body.title ?? ""),
            description: String(body.description ?? ""),
            pageUrl: typeof body.pageUrl === "string" && body.pageUrl ? body.pageUrl : null,
            attachmentUrl: attachment ? "#" : null,
            attachmentName: attachment ? attachment.split("/").pop() ?? null : null,
            status: "pending",
            createdAt: new Date().toISOString(),
            completedAt: null,
          });
          return send(res, 201, { request: {} });
        }

        return send(res, 404, { error: "Not found" });
      });
    },
  };
}
