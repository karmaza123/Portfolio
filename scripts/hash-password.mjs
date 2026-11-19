// Onboarding helper: makes a password for a new client and the bcrypt hash to store.
//
//   npm run portal:hash                  -> generates a strong password and its hash
//   npm run portal:hash -- "my phrase"   -> hashes a password you chose
//
// Send the client the password; put only the hash in clients.password_hash (never the password).
import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";

// No look-alikes (0/O, 1/l/I) so the password survives being read out of an email.
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
const generate = (length = 16) => Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

const provided = process.argv[2];
const password = provided ?? generate();

if (password.length < 10) {
  console.error("Use at least 10 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

console.log("");
if (!provided) console.log(`Password (send to the client): ${password}`);
console.log(`Hash (store in clients.password_hash):\n${hash}\n`);
console.log("Example insert:\n");
console.log(`insert into public.clients (company_name, domain_name, password_hash, plan_type, monthly_edit_limit)
values ('Acme Plumbing', 'acmeplumbing.com', '${hash}', 'subscription', 10);
`);
