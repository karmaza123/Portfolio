/** Reads a required environment variable, failing loudly (and only when actually needed). */
export function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

/** Optional variable with a fallback. */
export function envOr(name: string, fallback: string): string {
  return process.env[name] || fallback;
}
