const HOSTNAME = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/**
 * Turns whatever a client typed into the canonical form stored in `clients.domain_name`:
 * lower case, no scheme, no "www.", no path / query / port / trailing dot.
 *
 *   "https://www.AcmePlumbing.com/contact" -> "acmeplumbing.com"
 *
 * Returns null when the input is not a plausible hostname, so callers can treat it exactly like
 * a wrong password (no hint about which half was wrong).
 */
export function normalizeDomain(input: string): string | null {
  let value = input.trim().toLowerCase();
  if (!value || value.length > 300) return null;

  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, "");

  let hostname: string;
  try {
    // URL handles userinfo, port, path, query, fragment and punycode for us.
    hostname = new URL(`http://${value}`).hostname;
  } catch {
    return null;
  }

  hostname = hostname.replace(/^www\./, "").replace(/\.$/, "");
  return HOSTNAME.test(hostname) ? hostname : null;
}
