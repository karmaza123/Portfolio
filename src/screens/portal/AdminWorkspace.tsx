import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import { adminApi, ApiError } from "../../portal/api";
import { adminStats } from "../../portal/adminStats";
import { BILLING_LABEL, formatDate, PLAN_INFO, STATUS_LABEL } from "../../portal/plans";
import type { AdminClient, AdminOverview, AdminRequest, RequestStatus } from "../../portal/types";
import { usePortalHead } from "./PortalShell";
import "./admin.css";

type View = "overview" | "projects" | "requests" | "billing";
type Filter = "open" | "all" | RequestStatus;

const VIEWS: { key: View; label: string; icon: ReactNode }[] = [
  { key: "overview", label: "Overview", icon: <IconGrid /> },
  { key: "projects", label: "Projects", icon: <IconStack /> },
  { key: "requests", label: "Requests", icon: <IconInbox /> },
  { key: "billing", label: "Billing", icon: <IconCard /> },
];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "declined", label: "Declined" },
  { key: "all", label: "All" },
];

const STATUSES = Object.keys(STATUS_LABEL) as RequestStatus[];
const isOpen = (r: AdminRequest) => r.status === "pending" || r.status === "in_progress";
const matchesFilter = (f: Filter, r: AdminRequest) => f === "all" || (f === "open" ? isOpen(r) : r.status === f);

// Public screenshot of the client's live site (WordPress mShots: free, no key). Falls back to a monogram.
const shotUrl = (domain: string) => `https://s.wordpress.com/mshots/v1/${encodeURIComponent(`https://${domain}`)}?w=640&h=480`;

type Props = { data: AdminOverview; onChanged: () => Promise<void>; onSignOut: () => void };

/** The signed-in owner dashboard: sidebar, search, and four views over every client and request. */
export function AdminWorkspace({ data, onChanged, onSignOut }: Props) {
  usePortalHead("Admin");
  const [view, setView] = useState<View>("overview");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stats = useMemo(() => adminStats(data), [data]);
  const clientsById = useMemo(() => new Map(data.clients.map((c) => [c.id, c])), [data.clients]);
  const openByClient = useMemo(() => {
    const m = new Map<string, number>();
    for (const r of data.requests) if (isOpen(r)) m.set(r.clientId, (m.get(r.clientId) ?? 0) + 1);
    return m;
  }, [data.requests]);

  const q = query.trim().toLowerCase();
  const clients = q
    ? data.clients.filter((c) => `${c.companyName} ${c.domainName}`.toLowerCase().includes(q))
    : data.clients;
  const requests = q
    ? data.requests.filter((r) => {
        const c = clientsById.get(r.clientId);
        return `${r.title} ${r.description} ${c?.companyName ?? ""} ${c?.domainName ?? ""}`.toLowerCase().includes(q);
      })
    : data.requests;

  const selected = selectedId ? (clientsById.get(selectedId) ?? null) : null;

  function go(next: View) {
    setView(next);
    setSelectedId(null);
  }

  async function changeStatus(id: string, status: RequestStatus) {
    setSavingId(id);
    setError(null);
    try {
      await adminApi.setStatus(id, status);
      await onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't update the request.");
    } finally {
      setSavingId(null);
    }
  }

  const statusPicker = (r: AdminRequest) => (
    <label className="aw-status">
      <span className="pt-visually-hidden">Status for {r.title}</span>
      <select
        value={r.status}
        disabled={savingId === r.id}
        onChange={(e) => void changeStatus(r.id, e.target.value as RequestStatus)}
        className={`aw-select aw-select--${r.status}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABEL[s]}
          </option>
        ))}
      </select>
    </label>
  );

  const badgeFor: Partial<Record<View, number>> = {
    projects: data.clients.length,
    requests: stats.requests.open,
    billing: stats.needsAttention,
  };

  return (
    <div className="pt aw">
      <aside className="aw-side" aria-label="Admin navigation">
        <Link to="/" className="aw-brand" aria-label="Back to portfolio">
          <BrandMark className="aw-brand-mark" />
          <span>Studio</span>
        </Link>

        <p className="aw-side-label">Menu</p>
        <nav className="aw-nav">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              type="button"
              className="aw-nav-item"
              aria-current={view === v.key && !selected ? "page" : undefined}
              onClick={() => go(v.key)}
            >
              <span className="aw-nav-icon" aria-hidden>
                {v.icon}
              </span>
              <span className="aw-nav-text">{v.label}</span>
              {badgeFor[v.key] ? (
                <span className={`aw-count${v.key === "billing" ? " aw-count--danger" : ""}`}>{badgeFor[v.key]}</span>
              ) : null}
            </button>
          ))}
        </nav>

        {data.clients.length > 0 ? (
          <>
            <p className="aw-side-label aw-side-label--sites">Sites</p>
            <ul className="aw-sites">
              {data.clients.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="aw-site"
                    aria-current={selectedId === c.id ? "page" : undefined}
                    onClick={() => {
                      setView("projects");
                      setSelectedId(c.id);
                    }}
                  >
                    <span className={`aw-dot aw-dot--${c.billingStatus}`} aria-hidden />
                    {c.companyName}
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <div className="aw-side-foot">
          <button type="button" className="aw-nav-item" onClick={onSignOut}>
            <span className="aw-nav-icon" aria-hidden>
              <IconExit />
            </span>
            <span className="aw-nav-text">Sign out</span>
          </button>
        </div>
      </aside>

      <div className="aw-body">
        <header className="aw-top">
          <label className="aw-search">
            <IconSearch />
            <span className="pt-visually-hidden">Search clients and requests</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search clients and requests…"
            />
          </label>
          <button type="button" className="aw-bell" onClick={() => go("requests")} aria-label={`${stats.requests.pending} pending requests`}>
            <IconBell />
            {stats.requests.pending > 0 ? <span className="aw-bell-dot">{stats.requests.pending}</span> : null}
          </button>
        </header>

        <main id="main-content" tabIndex={-1} className="aw-main">
          <div role="alert" aria-live="polite" className="pt-error-slot">
            {error ? <p className="pt-error">{error}</p> : null}
          </div>

          {selected ? (
            <ClientDetail
              client={selected}
              requests={data.requests.filter((r) => r.clientId === selected.id)}
              onBack={() => setSelectedId(null)}
              statusPicker={statusPicker}
            />
          ) : view === "overview" ? (
            <>
              <PageHead title="Overview" sub="Everything across your client sites." />
              <section className="aw-stats" aria-label="Headline numbers">
                <Stat label="Projects" value={stats.projects} note={`${stats.byPlan.subscription} retainer · ${stats.byPlan.pay_as_you_go} batch · ${stats.byPlan.cms_handover} DIY`} />
                <Stat label="Open requests" value={stats.requests.open} note={`${stats.requests.pending} pending · ${stats.requests.in_progress} in progress`} tone={stats.requests.pending ? "warn" : undefined} />
                <Stat label="Done in 30 days" value={stats.completedLast30Days} note={`${stats.requests.completed} completed all time`} />
                <Stat label="Edits used" value={`${stats.edits.used}/${stats.edits.limit}`} note="Across plans with a quota" />
                <Stat label="Monthly recurring" value={`$${stats.monthlyRecurringUsd}`} note="Active retainers" />
                <Stat label="Billing issues" value={stats.needsAttention} note="Overdue or canceled" tone={stats.needsAttention ? "danger" : undefined} />
              </section>

              <SectionHead title="Recent projects" action={{ label: "View all", onClick: () => go("projects") }} />
              <ProjectGrid clients={clients.slice(0, 4)} openByClient={openByClient} onOpen={setSelectedId} />

              <SectionHead title="Waiting on you" action={{ label: "All requests", onClick: () => go("requests") }} />
              <RequestList requests={requests.filter(isOpen).slice(0, 5)} clientsById={clientsById} statusPicker={statusPicker} empty="Nothing waiting. Nice." />
            </>
          ) : view === "projects" ? (
            <>
              <PageHead title="Projects" sub={`${clients.length} ${clients.length === 1 ? "site" : "sites"}`} />
              <ProjectGrid clients={clients} openByClient={openByClient} onOpen={setSelectedId} />
            </>
          ) : view === "requests" ? (
            <RequestsView requests={requests} clientsById={clientsById} statusPicker={statusPicker} />
          ) : (
            <BillingView clients={clients} mrr={stats.monthlyRecurringUsd} onOpen={setSelectedId} />
          )}
        </main>
      </div>
    </div>
  );
}

function PageHead({ title, sub }: { title: string; sub: string }) {
  return (
    <header className="aw-page-head">
      <h1 className="aw-title">{title}</h1>
      <p className="aw-sub">{sub}</p>
    </header>
  );
}

function SectionHead({ title, action }: { title: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="aw-section-head">
      <h2 className="aw-section-title">{title}</h2>
      {action ? (
        <button type="button" className="aw-text-btn" onClick={action.onClick}>
          {action.label} →
        </button>
      ) : null}
    </div>
  );
}

function Stat({ label, value, note, tone }: { label: string; value: number | string; note: string; tone?: "warn" | "danger" }) {
  return (
    <div className={`aw-stat${tone ? ` aw-stat--${tone}` : ""}`}>
      <p className="aw-stat-label">{label}</p>
      <p className="aw-stat-value">{value}</p>
      <p className="aw-stat-note">{note}</p>
    </div>
  );
}

function Shot({ client }: { client: AdminClient }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="aw-shot">
      {failed ? (
        <span className="aw-shot-fallback" aria-hidden>
          {client.companyName.slice(0, 1)}
        </span>
      ) : (
        <img src={shotUrl(client.domainName)} alt="" loading="lazy" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

function ProjectGrid({
  clients,
  openByClient,
  onOpen,
}: {
  clients: AdminClient[];
  openByClient: Map<string, number>;
  onOpen: (id: string) => void;
}) {
  if (clients.length === 0) return <p className="aw-empty">No projects match.</p>;
  return (
    <ul className="aw-grid">
      {clients.map((c) => {
        const open = openByClient.get(c.id) ?? 0;
        return (
          <li key={c.id}>
            <button type="button" className="aw-card" onClick={() => onOpen(c.id)}>
              <Shot client={c} />
              {open > 0 ? <span className="aw-card-flag">{open} open</span> : null}
              <span className="aw-card-body">
                <span className="aw-card-name">{c.companyName}</span>
                <span className="aw-card-url">{c.domainName}</span>
                <span className="aw-card-meta">
                  <span className="aw-chip">{PLAN_INFO[c.planType].name}</span>
                  {c.billingStatus !== "active" ? (
                    <span className={`aw-chip aw-chip--${c.billingStatus}`}>{BILLING_LABEL[c.billingStatus]}</span>
                  ) : null}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function RequestList({
  requests,
  clientsById,
  statusPicker,
  empty,
}: {
  requests: AdminRequest[];
  clientsById: Map<string, AdminClient>;
  statusPicker: (r: AdminRequest) => ReactNode;
  empty: string;
}) {
  if (requests.length === 0) return <p className="aw-empty">{empty}</p>;
  return (
    <ul className="aw-list">
      {requests.map((r) => {
        const c = clientsById.get(r.clientId);
        return (
          <li key={r.id} className="aw-row">
            <div className="aw-row-main">
              {c ? <p className="aw-row-client">{c.companyName}</p> : null}
              <p className="aw-row-title">{r.title}</p>
              <p className="aw-row-desc">{r.description}</p>
              <p className="aw-row-meta">
                {formatDate(r.createdAt)}
                {r.pageUrl ? (
                  <>
                    {" · "}
                    <a href={r.pageUrl} target="_blank" rel="noreferrer">
                      {r.pageUrl.replace(/^https?:\/\//, "")}
                    </a>
                  </>
                ) : null}
                {r.attachmentUrl ? (
                  <>
                    {" · "}
                    <a href={r.attachmentUrl} target="_blank" rel="noreferrer">
                      {r.attachmentName ?? "Attachment"}
                    </a>
                  </>
                ) : null}
              </p>
            </div>
            {statusPicker(r)}
          </li>
        );
      })}
    </ul>
  );
}

function RequestsView({
  requests,
  clientsById,
  statusPicker,
}: {
  requests: AdminRequest[];
  clientsById: Map<string, AdminClient>;
  statusPicker: (r: AdminRequest) => ReactNode;
}) {
  const [filter, setFilter] = useState<Filter>("open");
  return (
    <>
      <PageHead title="Requests" sub={`${requests.length} total`} />
      <div className="aw-tabs" role="tablist" aria-label="Filter requests">
        {FILTERS.map((f) => (
          <button key={f.key} type="button" role="tab" aria-selected={filter === f.key} className="aw-tab" onClick={() => setFilter(f.key)}>
            {f.label} <span className="aw-tab-count">{requests.filter((r) => matchesFilter(f.key, r)).length}</span>
          </button>
        ))}
      </div>
      <RequestList requests={requests.filter((r) => matchesFilter(filter, r))} clientsById={clientsById} statusPicker={statusPicker} empty="Nothing here." />
    </>
  );
}

function BillingView({ clients, mrr, onOpen }: { clients: AdminClient[]; mrr: number; onOpen: (id: string) => void }) {
  const sorted = [...clients].sort((a, b) => Number(a.billingStatus === "active") - Number(b.billingStatus === "active"));
  return (
    <>
      <PageHead title="Billing" sub={`$${mrr} a month from active retainers`} />
      {sorted.length === 0 ? (
        <p className="aw-empty">No clients yet.</p>
      ) : (
        <ul className="aw-list">
          {sorted.map((c) => (
            <li key={c.id} className="aw-row">
              <button type="button" className="aw-row-main aw-row-link" onClick={() => onOpen(c.id)}>
                <p className="aw-row-title">{c.companyName}</p>
                <p className="aw-row-meta">
                  {PLAN_INFO[c.planType].name} · {PLAN_INFO[c.planType].price}
                  {c.planType === "subscription" ? ` · renews ${formatDate(c.currentPeriodEnd)}` : ""}
                  {c.hasBilling ? "" : " · no Stripe customer"}
                </p>
              </button>
              <span className={`pt-badge pt-badge--billing-${c.billingStatus}`}>{BILLING_LABEL[c.billingStatus]}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ClientDetail({
  client,
  requests,
  onBack,
  statusPicker,
}: {
  client: AdminClient;
  requests: AdminRequest[];
  onBack: () => void;
  statusPicker: (r: AdminRequest) => ReactNode;
}) {
  const quota = client.planType !== "cms_handover";
  const pct = quota && client.monthlyEditLimit > 0 ? Math.min(100, (client.editsUsed / client.monthlyEditLimit) * 100) : 0;
  return (
    <>
      <button type="button" className="aw-text-btn aw-back" onClick={onBack}>
        ← Back
      </button>
      <div className="aw-detail">
        <div className="aw-detail-shot">
          <Shot client={client} />
        </div>
        <div className="aw-detail-info">
          <h1 className="aw-title">{client.companyName}</h1>
          <a className="aw-sub aw-detail-url" href={`https://${client.domainName}`} target="_blank" rel="noreferrer">
            {client.domainName} ↗
          </a>
          <dl className="aw-facts">
            <div>
              <dt>Plan</dt>
              <dd>{PLAN_INFO[client.planType].name}</dd>
            </div>
            <div>
              <dt>Billing</dt>
              <dd>
                <span className={`pt-badge pt-badge--billing-${client.billingStatus}`}>{BILLING_LABEL[client.billingStatus]}</span>
              </dd>
            </div>
            <div>
              <dt>Client since</dt>
              <dd>{formatDate(client.createdAt)}</dd>
            </div>
            {client.planType === "subscription" ? (
              <div>
                <dt>Renews</dt>
                <dd>{formatDate(client.currentPeriodEnd)}</dd>
              </div>
            ) : null}
          </dl>
          {quota ? (
            <div className="aw-quota">
              <p className="aw-stat-label">
                Edits {client.editsUsed} / {client.monthlyEditLimit}
              </p>
              <div className="aw-bar" role="progressbar" aria-valuemin={0} aria-valuemax={client.monthlyEditLimit} aria-valuenow={Math.min(client.editsUsed, client.monthlyEditLimit)}>
                <span style={{ width: `${pct}%` }} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <SectionHead title={`Requests (${requests.length})`} />
      <RequestList requests={requests} clientsById={new Map()} statusPicker={statusPicker} empty="No requests from this client yet." />
    </>
  );
}

const svg = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

function IconGrid() {
  return (
    <svg {...svg}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconStack() {
  return (
    <svg {...svg}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="m3 13 9 5 9-5" />
    </svg>
  );
}
function IconInbox() {
  return (
    <svg {...svg}>
      <path d="M4 13h4l1.5 3h5L16 13h4" />
      <path d="M5.5 5h13L21 13v6H3v-6l2.5-8Z" />
    </svg>
  );
}
function IconCard() {
  return (
    <svg {...svg}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}
function IconExit() {
  return (
    <svg {...svg}>
      <path d="M15 4h4v16h-4" />
      <path d="M10 8l-4 4 4 4M6 12h10" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg {...svg} aria-hidden>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg {...svg} aria-hidden>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}
