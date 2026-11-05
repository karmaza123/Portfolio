-- Password-only client sign-in.
--
-- Clients no longer type their domain, so the password has to identify them. password_lookup holds a
-- SHA-256 fingerprint of the password (see api/_lib/password-lookup.ts); the API finds the row by it
-- and then still checks password_hash with bcrypt.
--
-- Not granted to clients: the column-level grants in 0001 list only the columns clients may read.
--
-- Existing clients have no fingerprint yet and can't sign in until you give them a new password:
-- run `npm run portal:hash` and use the UPDATE it prints.

alter table public.clients add column if not exists password_lookup text;

create unique index if not exists clients_password_lookup_idx on public.clients (password_lookup);
