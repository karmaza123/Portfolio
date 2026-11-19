import { quotaSummary } from "../../portal/quota";
import type { PortalClient } from "../../portal/types";

/** 2 of 4: edits used against the plan's allowance. */
export function QuotaCard({ client }: { client: PortalClient }) {
  const quota = quotaSummary(client);

  return (
    <section className="pt-card" aria-labelledby="pt-quota-title">
      <div className="pt-card-head">
        <h2 id="pt-quota-title" className="pt-card-title">
          Edits
        </h2>
      </div>

      {quota.tracked ? (
        <>
          <p className="pt-quota-figure">
            <span className="pt-quota-used">{quota.used}</span>
            <span className="pt-quota-of"> / {quota.limit}</span>
          </p>
          <div
            className={`pt-bar pt-bar--${quota.tone}`}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={quota.limit}
            aria-valuenow={Math.min(quota.used, quota.limit)}
            aria-label={quota.label}
          >
            <span style={{ width: `${quota.percent}%` }} />
          </div>
          <p className="pt-muted">{quota.label}</p>
          <p className="pt-meta">
            {quota.exhausted
              ? "No edits left."
              : `${quota.remaining} ${quota.remaining === 1 ? "edit" : "edits"} remaining.`}
          </p>
        </>
      ) : (
        <>
          <p className="pt-quota-figure">
            <span className="pt-quota-used">∞</span>
          </p>
          <p className="pt-muted">Your site is yours to edit. There's no quota on this plan.</p>
        </>
      )}
    </section>
  );
}
