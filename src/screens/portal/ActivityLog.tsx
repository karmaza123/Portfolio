import { formatDate, STATUS_LABEL } from "../../portal/plans";
import type { PortalRequest } from "../../portal/types";

/** 4 of 4: every request so far, newest first, with its current status. */
export function ActivityLog({ requests }: { requests: PortalRequest[] }) {
  return (
    <section className="pt-card pt-card--log" aria-labelledby="pt-log-title">
      <div className="pt-card-head">
        <h2 id="pt-log-title" className="pt-card-title">
          Activity
        </h2>
        <span className="pt-meta">
          {requests.length} {requests.length === 1 ? "request" : "requests"}
        </span>
      </div>

      {requests.length === 0 ? (
        <p className="pt-empty">Nothing yet. Your requests and their progress will show up here.</p>
      ) : (
        <ol className="pt-log">
          {requests.map((r) => (
            <li key={r.id} className="pt-log-item">
              <span className={`pt-dot pt-dot--${r.status}`} aria-hidden />
              <div className="pt-log-body">
                <div className="pt-log-top">
                  <h3 className="pt-log-title">{r.title}</h3>
                  <span className={`pt-badge pt-badge--${r.status}`}>{STATUS_LABEL[r.status]}</span>
                </div>
                <p className="pt-log-desc">{r.description}</p>
                <p className="pt-meta">
                  Sent {formatDate(r.createdAt)}
                  {r.completedAt ? ` · ${r.status === "declined" ? "Declined" : "Done"} ${formatDate(r.completedAt)}` : ""}
                  {r.pageUrl ? ` · ${r.pageUrl}` : ""}
                </p>
                {r.attachmentUrl && r.attachmentName ? (
                  <a className="pt-attachment" href={r.attachmentUrl} target="_blank" rel="noreferrer noopener">
                    {r.attachmentName}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
