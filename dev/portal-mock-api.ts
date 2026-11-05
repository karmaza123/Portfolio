import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";

/**
 * Local-only stand-in for the /api/portal/* functions, so `npm run dev` works without Supabase,
 * Stripe or the Vercel CLI. It is a Vite dev-server plugin (`apply: "serve"`), so it is never part
 * of a production build, and under `vercel dev` Vercel answers /api before Vite sees it.
 *
 *   domain:   acmeplumbing.com
 *   password: demo-password
 *   admin:    /portal/admin with admin-password
 *
 * Switch what the dashboard shows by visiting /__mock/scenario?s=full|warn|diy|batch|pastdue|empty|reset
 */

export const DEMO_DOMAIN = "acmeplumbing.com";
export const DEMO_PASSWORD = "demo-password";
export const ADMIN_PASSWORD = "admin-password";

const day = 86_400_000;
const ago = (days: number) => new Date(Date.now() - days * day).toISOString();

// Other clients, so the owner dashboard has something to count. Acme comes from the live state.
const otherClients = () => [
  { id: "bloom", companyName: "Bloom Florist", domainName: "bloomflorist.ge", planType: "pay_as_you_go", billingStatus: "active", currentPeriodEnd: null, monthlyEditLimit: 5, editsUsed: 3, hasBilling: true, createdAt: ago(120) },
  { id: "kartuli", companyName: "Kartuli Table", domainName: "kartulitable.com", planType: "subscription", billingStatus: "past_due", currentPeriodEnd: ago(-3), monthlyEditLimit: 10, editsUsed: 9, hasBilling: true, createdAt: ago(200) },
  { id: "nord", companyName: "Nord Studio", domainName: "nordstudio.io", planType: "cms_handover", billingStatus: "active", currentPeriodEnd: null, monthlyEditLimit: 0, editsUsed: 0, hasBilling: false, createdAt: ago(60) },
  { id: "vake", companyName: "Vake Dental", domainName: "vakedental.ge", planType: "subscription", billingStatus: "active", currentPeriodEnd: ago(-18), monthlyEditLimit: 10, editsUsed: 2, hasBilling: true, createdAt: ago(40) },
];

const otherRequests = () => [
  { id: "b1", clientId: "bloom", title: "Add Valentine's bouquets page", description: "New page with the six bouquets from the attached PDF, prices included.", pageUrl: null, attachmentUrl: "#", attachmentName: "bouquets.pdf", status: "pending", createdAt: ago(1), completedAt: null },
  { id: "k1", clientId: "kartuli", title: "Update winter menu", description: "Swap the menu PDF and the three dish photos on the home page.", pageUrl: "https://kartulitable.com/menu", attachmentUrl: null, attachmentName: null, status: "in_progress", createdAt: ago(4), completedAt: null },
  { id: "k2", clientId: "kartuli", title: "Booking button colour", description: "Make the Book a table button match the logo red.", pageUrl: null, attachmentUrl: null, attachmentName: null, status: "completed", createdAt: ago(12), completedAt: ago(11) },
  { id: "v1", clientId: "vake", title: "Add Dr. Beridze to the team", description: "Photo and bio attached.", pageUrl: "https://vakedental.ge/team", attachmentUrl: null, attachmentName: null, status: "pending", createdAt: ago(0), completedAt: null },
  { id: "b0", clientId: "bloom", title: "Fix delivery area map", description: "Map should include Saburtalo.", pageUrl: null, attachmentUrl: null, attachmentName: null, status: "completed", createdAt: ago(45), completedAt: ago(44) },
];

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
  let others = { clients: otherClients(), requests: otherRequests() };

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
        if (!path.startsWith("/api/portal/") && !path.startsWith("/api/admin/") && !path.startsWith("/__mock/")) return next();

        if (path.startsWith("/api/admin/")) {
          if (path === "/api/admin/login" && req.method === "POST") {
            const body = await readJson(req);
            if (body.password !== ADMIN_PASSWORD) return send(res, 401, { error: "Wrong password.", code: "invalid_credentials" });
            return send(res, 200, { ok: true }, { "Set-Cookie": "portal_mock_admin=1; Path=/; HttpOnly; SameSite=Strict" });
          }
          if (path === "/api/admin/logout") {
            return send(res, 200, { ok: true }, { "Set-Cookie": "portal_mock_admin=; Path=/; Max-Age=0" });
          }
          if (!(req.headers.cookie ?? "").includes("portal_mock_admin=1")) {
            return send(res, 401, { error: "Not signed in", code: "unauthenticated" });
          }
          if (path === "/api/admin/overview") {
            const acme = { id: "acme", ...state.client, createdAt: ago(300) };
            return send(res, 200, {
              clients: [acme, ...others.clients].sort((a, b) => a.companyName.localeCompare(b.companyName)),
              requests: [...state.requests.map((r) => ({ ...r, clientId: "acme" })), ...others.requests].sort((a, b) =>
                b.createdAt.localeCompare(a.createdAt),
              ),
            });
          }
          if (path === "/api/admin/request-status" && req.method === "POST") {
            const body = await readJson(req);
            const status = String(body.status) as Req["status"];
            const target = [...state.requests, ...others.requests].find((r) => r.id === body.id);
            if (!target) return send(res, 404, { error: "That request no longer exists." });
            if (state.requests.includes(target as Req)) {
              if (status === "declined" && target.status !== "declined") state.client.editsUsed = Math.max(0, state.client.editsUsed - 1);
              if (target.status === "declined" && status !== "declined") state.client.editsUsed += 1;
            }
            target.status = status;
            target.completedAt = status === "completed" || status === "declined" ? (target.completedAt ?? new Date().toISOString()) : null;
            return send(res, 200, { request: { id: target.id, status } });
          }
          return send(res, 404, { error: "Not found" });
        }

        if (path === "/__mock/scenario") {
          const name = url.searchParams.get("s") ?? "reset";
          state = scenario(name);
          others = { clients: otherClients(), requests: otherRequests() };
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
