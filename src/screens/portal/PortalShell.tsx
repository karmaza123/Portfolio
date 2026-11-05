import { useEffect, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "../../components/BrandMark";
import "./portal.css";

type PortalShellProps = {
  title: string;
  children: ReactNode;
  /** Shown top right with a sign-out button once signed in. */
  account?: { label: string; onSignOut: () => void };
};

/** Shared frame for the portal pages: minimal header, noindex, no site navigation. */
export function PortalShell({ title, children, account }: PortalShellProps) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} — Client Portal`;

    // The portal is private: keep it out of search results (vercel.json also sends X-Robots-Tag).
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);

    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, [title]);

  return (
    <div className="pt">
      <header className="pt-head">
        <Link to="/" className="pt-brand" aria-label="Back to portfolio">
          <BrandMark className="pt-brand-mark" />
          <span className="pt-brand-text">Client portal</span>
        </Link>
        {account ? (
          <div className="pt-account">
            <span className="pt-account-label">{account.label}</span>
            <button type="button" className="pt-link" onClick={account.onSignOut}>
              Sign out
            </button>
          </div>
        ) : null}
      </header>
      <main id="main-content" tabIndex={-1} className="pt-main">
        {children}
      </main>
    </div>
  );
}
