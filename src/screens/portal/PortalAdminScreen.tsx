import { useCallback, useEffect, useState, type FormEvent } from "react";
import { adminApi, ApiError } from "../../portal/api";
import type { AdminOverview } from "../../portal/types";
import { AdminWorkspace } from "./AdminWorkspace";
import { PortalShell } from "./PortalShell";

type LoadState =
  | { kind: "loading" }
  | { kind: "signed-out" }
  | { kind: "error"; message: string; signedIn: boolean }
  | { kind: "ready"; data: AdminOverview };

/** /portal/admin — the owner's view: every project, every request, and the headline numbers. */
export function PortalAdminScreen() {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  const load = useCallback(async () => {
    try {
      setState({ kind: "ready", data: await adminApi.overview() });
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) return setState({ kind: "signed-out" });
      setState({
        kind: "error",
        message: err instanceof ApiError ? err.message : "Couldn't load the overview.",
        signedIn: err instanceof ApiError && err.code === "not_configured",
      });
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
      <PortalShell title="Admin" account={state.signedIn ? { label: "Owner", onSignOut: () => void signOut() } : undefined}>
        <div className="pt-status" role="alert">
          <p>{state.message}</p>
          <button type="button" className="pt-btn pt-btn--ghost" onClick={() => void load()}>
            Try again
          </button>
        </div>
      </PortalShell>
    );
  }

  return <AdminWorkspace data={state.data} onChanged={load} onSignOut={() => void signOut()} />;
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
