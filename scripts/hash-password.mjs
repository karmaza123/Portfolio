// Onboarding helper: makes a password and the values to store.
//
//   npm run portal:hash                  -> generates a strong client password, its hash and lookup
//   npm run portal:hash -- "my phrase"   -> hashes a password you chose (e.g. the admin password)
//
// Send the client the password; store only the hash and lookup (never the password).
import { createHash, randomInt } from "node:crypto";
import bcrypt from "bcryptjs";

// No look-alikes (0/O, 1/l/I) so the password survives being read out of an email.
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
const generate = (length = 16) => Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

const provided = process.argv[2];
const password = provided ?? generate();

if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
// Clients sign in with the password alone; this fingerprint is how the API finds their row.
const lookup = createHash("sha256").update(password, "utf8").digest("hex");

console.log("");
if (!provided) console.log(`Password (send to the client): ${password}\n`);
console.log(`Hash (ADMIN_PASSWORD_HASH, or clients.password_hash):\n${hash}\n`);
console.log(`Lookup (clients.password_lookup):\n${lookup}\n`);
console.log("New client:\n");
console.log(`insert into public.clients (company_name, domain_name, password_hash, password_lookup, plan_type, monthly_edit_limit)
values ('Acme Plumbing', 'acmeplumbing.com', '${hash}', '${lookup}', 'subscription', 10);
`);
console.log("New password for an existing client:\n");
console.log(`update public.clients set password_hash = '${hash}', password_lookup = '${lookup}'
where domain_name = 'acmeplumbing.com';
`);
