import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CONTACT_EMAIL } from "../../constants/contact";
import { ApiError, portalApi } from "../../portal/api";
import { PortalShell } from "./PortalShell";

/** /portal/login — the password from the onboarding email is all a client needs. */
export function PortalLoginScreen() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Already signed in? Skip the form.
  useEffect(() => {
    let cancelled = false;
    portalApi
      .me()
      .then(() => {
        if (!cancelled) navigate("/portal/dashboard", { replace: true });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await portalApi.login(password);
      navigate("/portal/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Try again.");
      setPassword("");
      setBusy(false);
    }
  }

  return (
    <PortalShell title="Sign in">
      <section className="pt-login" aria-labelledby="pt-login-title">
        <p className="pt-eyebrow">Client portal</p>
        <h1 id="pt-login-title" className="pt-title">
          Sign in to manage your site
        </h1>
        <p className="pt-lede">
          Enter the password from your onboarding email.
        </p>

        <form className="pt-form" onSubmit={onSubmit} noValidate>
          <label className="pt-field">
            <span>Password</span>
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
            Local mock API — password <code>demo-password</code>
          </p>
        ) : null}

        <p className="pt-hint">
          Lost your password? <a href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Client portal password")}`}>Email me</a> and I&apos;ll
          send a new one. <Link to="/">Back to the portfolio</Link>
        </p>
      </section>
    </PortalShell>
  );
}
