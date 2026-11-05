import { createHash } from "node:crypto";

/**
 * Clients sign in with a password alone, so the password itself has to find the client. This is a
 * SHA-256 fingerprint stored in clients.password_lookup (unique, indexed); the bcrypt hash is still
 * checked before anyone gets in. It is only safe because client passwords are long and random
 * (`npm run portal:hash` makes 16 characters), so the fingerprint can't be guessed back.
 * scripts/hash-password.mjs computes the same value.
 */
export const passwordLookup = (password: string): string => createHash("sha256").update(password, "utf8").digest("hex");

export const MIN_CLIENT_PASSWORD = 12;
