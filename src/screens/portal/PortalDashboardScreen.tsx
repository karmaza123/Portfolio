import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, portalApi } from "../../portal/api";
import type { PortalMe } from "../../portal/types";
import { ActivityLog } from "./ActivityLog";
import { PlanCard } from "./PlanCard";
import { PortalShell } from "./PortalShell";
import { QuotaCard } from "./QuotaCard";
import { RequestForm } from "./RequestForm";

type LoadState = { kind: "loading" } | { kind: "error"; message: string } | { kind: "ready"; data: PortalMe };

/** /portal/dashboard — protected: an expired or missing session sends the client back to sign in. */
export function PortalDashboardScreen() {
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const load = useCallback(async () => {
    try {
      const data = await portalApi.me();
      setState({ kind: "ready", data });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        navigate("/portal/login", { replace: true });
        return;
      }
      setState({ kind: "error", message: err instanceof ApiError ? err.message : "Couldn't load your dashboard." });
    }
  }, [navigate]);

  useEffect(() => {
    void load();
  }, [load]);

  async function signOut() {
    await portalApi.logout().catch(() => undefined);
    navigate("/portal/login", { replace: true });
  }

  if (state.kind === "loading") {
    return (
      <PortalShell title="Dashboard">
        <p className="pt-status" role="status">
          Loading your dashboard…
        </p>
      </PortalShell>
    );
  }

  if (state.kind === "error") {
    return (
      <PortalShell title="Dashboard">
        <div className="pt-status" role="alert">
          <p>{state.message}</p>
          <button type="button" className="pt-btn pt-btn--ghost" onClick={() => void load()}>
            Try again
          </button>
        </div>
      </PortalShell>
    );
  }

  const { client, requests } = state.data;

  return (
    <PortalShell title="Dashboard" account={{ label: client.domainName, onSignOut: () => void signOut() }}>
      <header className="pt-intro">
        <p className="pt-eyebrow">Client portal</p>
        <h1 className="pt-title">{client.companyName}</h1>
      </header>

      <div className="pt-grid">
        <PlanCard client={client} />
        <QuotaCard client={client} />
        <RequestForm client={client} onSubmitted={load} />
        <ActivityLog requests={requests} />
      </div>
    </PortalShell>
  );
}
