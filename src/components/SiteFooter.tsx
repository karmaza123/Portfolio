import { Link } from "react-router-dom";

/** Global footer: used on the home, work and resume pages. */
export function SiteFooter() {
  return (
    <footer className="mp-footer">
      <p className="mp-footer-left">© {new Date().getFullYear()} Dimitri Karmazanashvili</p>
      <Link to="/portal/login" className="mp-footer-portal">
        Client Portal
      </Link>
      <p className="mp-footer-right">Tbilisi — Working globally</p>
    </footer>
  );
}
