import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { adminApi, ApiError } from "../../portal/api";
import { adminStats } from "../../portal/adminStats";
import { BILLING_LABEL, formatDate, PLAN_INFO, STATUS_LABEL } from "../../portal/plans";
import type { AdminOverview, AdminRequest, RequestStatus } from "../../portal/types";
import { PortalShell } from "./PortalShell";

type LoadState =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "error"; message: string }
  | { kind: "ready"; data: AdminOverview };

type Filter = "open" | "all" | RequestStatus;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "open", label: "Open" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In progress" },
  { key: "completed", label: "Completed" },
  { key: "declined", label: "Declined" },
  { key: "all", label: "All" },
];

const STATUSES = Object.keys(STATUS_LABEL) as RequestStatus[];

const matches = (filter: Filter, r: AdminRequest) =>
  filter === "all" || (filter === "open" ? r.status === "pending" || r.status === "in_progress" : r.status === filter);

/** /portal/admin — the owner's view: every project, every request, and the headline numbers. */
export function PortalAdminScreen() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const load = useCallback(async () => {
    try {
      setState({ kind: "ready", data: await adminApi.overview() });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return setState({ kind: "signed-out" });
      setState({ kind: "error", message: err instanceof ApiError ? err.message : "Couldn't load the overview." });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function signOut() {
    await adminApi.logout().catch(() => undefined);
    setState({ kind: "signed-out" });
  }

  if (state.kind === "loading") {
    return (
      <PortalShell title="Admin">
        <p className="pt-status" role="status">
          Loading…
        </p>
      </PortalShell>
    );
  }

  if (state.kind === "signed-out") return <AdminLogin onSignedIn={load} />;

  if (state.kind === "error") {
    return (
      <PortalShell title="Admin">
        <div className="pt-status" role="alert">
          <p>{state.message}</p>
          <button type="button" className="pt-btn pt-btn--ghost" onClick={() => void load()}>
            Try again
          </button>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell title="Admin" account={{ label: "Owner", onSignOut: () => void signOut() }}>
      <AdminDashboard data={state.data} onChanged={load} />
    </PortalShell>
  );
}

function AdminLogin({ onSignedIn }: { onSignedIn: () => Promise<void> }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await adminApi.login(password);
      await onSignedIn();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
      setPassword("");
      setBusy(false);
    }
  }

  return (
    <PortalShell title="Admin sign in">
      <section className="pt-login" aria-labelledby="pt-admin-login-title">
        <p className="pt-eyebrow">Owner</p>
        <h1 id="pt-admin-login-title" className="pt-title">
          Studio overview
        </h1>
        <form className="pt-form" onSubmit={onSubmit} noValidate>
          <label className="pt-field">
            <span>Admin password</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              autoFocus
            />
          </label>
          <div role="alert" aria-live="polite" className="pt-error-slot">
            {error ? <p className="pt-error">{error}</p> : null}
          </div>
          <button type="submit" className="pt-btn pt-btn--primary" disabled={busy || !password}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        {import.meta.env.DEV ? (
          <p className="pt-hint pt-hint--dev">
            Local mock API — password <code>admin-password</code>
          </p>
        ) : null}
      </section>
    </PortalShell>
  );
}

function AdminDashboard({ data, onChanged }: { data: AdminOverview; onChanged: () => Promise<void> }) {
  const stats = useMemo(() => adminStats(data), [data]);
  const [filter, setFilter] = useState<Filter>("open");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientsById = useMemo(() => new Map(data.clients.map((c) => [c.id, c])), [data.clients]);
  const visible = data.requests.filter((r) => matches(filter, r));
  const countFor = (key: Filter) => data.requests.filter((r) => matches(key, r)).length;

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

  return (
    <>
      <header className="pt-intro">
        <p className="pt-eyebrow">Owner</p>
        <h1 className="pt-title">Studio overview</h1>
      </header>

      <section className="pt-stats" aria-label="Headline numbers">
        <Stat label="Projects" value={stats.projects} note={`${stats.byPlan.subscription} retainer · ${stats.byPlan.pay_as_you_go} batch · ${stats.byPlan.cms_handover} DIY`} />
        <Stat label="Open requests" value={stats.requests.open} note={`${stats.requests.pending} pending · ${stats.requests.in_progress} in progress`} tone={stats.requests.pending > 0 ? "warn" : undefined} />
        <Stat label="Done in 30 days" value={stats.completedLast30Days} note={`${stats.requests.completed} completed all time`} />
        <Stat label="Edits used" value={`${stats.edits.used}/${stats.edits.limit}`} note="Across plans with a quota" />
        <Stat label="Monthly recurring" value={`$${stats.monthlyRecurringUsd}`} note="Active retainers" />
        <Stat label="Billing issues" value={stats.needsAttention} note="Overdue or canceled" tone={stats.needsAttention > 0 ? "danger" : undefined} />
      </section>

      <section className="pt-card pt-admin-section" aria-labelledby="pt-admin-requests">
        <div className="pt-card-head">
          <h2 id="pt-admin-requests" className="pt-card-title">
            Requests
          </h2>
          <span className="pt-meta pt-meta--flush">{stats.requests.total} total</span>
        </div>

        <div className="pt-tabs" role="tablist" aria-label="Filter requests">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={filter === f.key}
              className="pt-tab"
              onClick={() => setFilter(f.key)}
            >
              {f.label} <span className="pt-tab-count">{countFor(f.key)}</span>
            </button>
          ))}
        </div>

        <div role="alert" aria-live="polite" className="pt-error-slot">
          {error ? <p className="pt-error">{error}</p> : null}
        </div>

        {visible.length === 0 ? (
          <p className="pt-muted">Nothing here.</p>
        ) : (
          <ul className="pt-admin-list">
            {visible.map((r) => {
              const c = clientsById.get(r.clientId);
              return (
                <li key={r.id} className="pt-admin-row">
                  <div className="pt-admin-main">
                    <p className="pt-admin-client">{c ? `${c.companyName} · ${c.domainName}` : "Unknown client"}</p>
                    <p className="pt-admin-title">{r.title}</p>
                    <p className="pt-muted pt-admin-desc">{r.description}</p>
                    <p className="pt-meta">
                      {formatDate(r.createdAt)}
                      {r.pageUrl ? (
                        <>
                          {" · "}
                          <a href={r.pageUrl} target="_blank" rel="noreferrer">
                            {r.pageUrl}
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
                  <label className="pt-admin-status">
                    <span className="pt-visually-hidden">Status for {r.title}</span>
                    <select
                      value={r.status}
                      disabled={savingId === r.id}
                      onChange={(e) => void changeStatus(r.id, e.target.value as RequestStatus)}
                      className={`pt-select pt-select--${r.status}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="pt-card pt-admin-section" aria-labelledby="pt-admin-projects">
        <div className="pt-card-head">
          <h2 id="pt-admin-projects" className="pt-card-title">
            Projects
          </h2>
          <span className="pt-meta pt-meta--flush">{stats.projects} sites</span>
        </div>

        {data.clients.length === 0 ? (
          <p className="pt-muted">No clients yet. Add one with `npm run portal:hash` and the setup guide.</p>
        ) : (
          <ul className="pt-admin-list">
            {data.clients.map((c) => {
              const open = data.requests.filter((r) => r.clientId === c.id && (r.status === "pending" || r.status === "in_progress")).length;
              return (
                <li key={c.id} className="pt-admin-row">
                  <div className="pt-admin-main">
                    <p className="pt-admin-title">{c.companyName}</p>
                    <p className="pt-meta pt-meta--flush">
                      <a href={`https://${c.domainName}`} target="_blank" rel="noreferrer">
                        {c.domainName}
                      </a>
                      {" · "}
                      {PLAN_INFO[c.planType].name}
                      {c.planType !== "cms_handover" ? ` · ${c.editsUsed}/${c.monthlyEditLimit} edits` : ""}
                      {` · ${open} open`}
                    </p>
                  </div>
                  <span className={`pt-badge pt-badge--billing-${c.billingStatus}`}>{BILLING_LABEL[c.billingStatus]}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({ label, value, note, tone }: { label: string; value: number | string; note: string; tone?: "warn" | "danger" }) {
  return (
    <div className={`pt-stat${tone ? ` pt-stat--${tone}` : ""}`}>
      <p className="pt-card-title">{label}</p>
      <p className="pt-stat-value">{value}</p>
      <p className="pt-meta pt-meta--flush">{note}</p>
    </div>
  );
}
