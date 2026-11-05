import { useState } from "react";
import { ApiError, portalApi } from "../../portal/api";
import { BILLING_LABEL, PLAN_INFO, renewalLine } from "../../portal/plans";
import type { PortalClient } from "../../portal/types";

/** 1 of 4: current plan, billing status, renewal, and the way into the Stripe billing portal. */
export function PlanCard({ client }: { client: PortalClient }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const plan = PLAN_INFO[client.planType];

  async function openBilling() {
    setBusy(true);
    setError(null);
    try {
      const { url } = await portalApi.openBilling();
      window.location.assign(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Couldn't open billing. Try again.");
      setBusy(false);
    }
  }

  return (
    <section className="pt-card" aria-labelledby="pt-plan-title">
      <div className="pt-card-head">
        <h2 id="pt-plan-title" className="pt-card-title">
          Your plan
        </h2>
        <span className={`pt-badge pt-badge--billing-${client.billingStatus}`}>{BILLING_LABEL[client.billingStatus]}</span>
      </div>

      <p className="pt-plan-name">{plan.name}</p>
      <p className="pt-plan-price">{plan.price}</p>
      <p className="pt-muted">{plan.blurb}</p>
      <p className="pt-meta">{renewalLine(client)}</p>

      <div className="pt-card-foot">
        <button
          type="button"
          className="pt-btn pt-btn--ghost"
          onClick={openBilling}
          disabled={busy || !client.hasBilling}
          title={client.hasBilling ? undefined : "No billing account is linked to this plan yet"}
        >
          {busy ? "Opening…" : "Manage billing"}
        </button>
        {error ? (
          <p className="pt-error" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
