# Client Portal — setup

A private area for landing-page clients: sign in with their domain and a password, see their plan,
track edits, send change requests, and read the history. Pages live under `/portal/*`; the server
side is Vercel functions in `api/`.

```
src/screens/portal/     React pages + components (login, dashboard, plan, quota, form, log)
src/portal/             API client, quota math, shared types
api/portal/             login · logout · me · requests · upload-url · billing
api/webhooks/stripe.ts  Stripe → Supabase sync
api/_lib/               domain normalising, session JWT, throttling, plan mapping
supabase/migrations/    schema, row level security, quota function
scripts/hash-password.mjs   onboarding helper
```

## How sign-in works

1. The client enters `https://www.AcmePlumbing.com/` or `acmeplumbing.com` — both become `acmeplumbing.com`.
2. `/api/portal/login` looks the client up with the service role and checks the password with bcrypt.
   Wrong domain and wrong password return the **same** message and take the same time.
3. On success it sets an `HttpOnly`, `Secure`, `SameSite=Lax` cookie holding a JWT signed with the
   Supabase JWT secret (`role: authenticated`, `client_id: <uuid>`).
4. Every later call forwards that JWT to Supabase, so **Postgres row level security** — not the API
   code — decides what the client can read. The password hash and Stripe ids are not selectable at all.

Failed logins are throttled in Postgres: 8 per domain or 20 per IP in 15 minutes, then HTTP 429.

## One-time setup

### 1. Supabase

1. Create a project. In the SQL editor, run `supabase/migrations/0001_client_portal.sql`.
2. Project settings → API: copy the URL, anon key, service role key, and the **JWT secret**.
   - The portal signs its own session tokens with the JWT secret. If your project only shows
     asymmetric signing keys, enable the legacy JWT secret (Project settings → JWT keys → Legacy).
     This is the one setup step I could not test; see "Not yet verified" below.

### 2. Stripe

1. Create three prices: **$30 monthly** (retainer), **$50 one-time** (edit batch), **$500 one-time** (handover).
2. Create a webhook endpoint at `https://YOUR-DOMAIN/api/webhooks/stripe` with these events:
   `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`,
   `customer.subscription.updated`, `customer.subscription.deleted`.
3. Turn on the **Customer portal** (Settings → Billing → Customer portal) so "Manage billing" works.
4. When you send a client a payment link or Checkout Session, set `client_reference_id` to their
   `clients.id`. That is how the first purchase finds the right row. Renewals and payment failures
   then match on the Stripe customer id, and subscription changes on the subscription id — so sell
   the retainer through Checkout (or fill `stripe_subscription_id` by hand), or cancellations won't sync.

### 3. Vercel

Add every variable from `.env.example` (Project → Settings → Environment Variables), then redeploy.
`vercel.json` already keeps `/api/*` out of the single-page-app rewrite and marks `/portal/*` as
`noindex, no-store`.

## Adding a client

```bash
npm run portal:hash
```

It prints a password to send, plus the `password_hash` and `password_lookup` to store. Insert the row it
suggests, with the client's real domain and plan. Clients sign in with **the password only**, so every client
must have their own generated password (the lookup column is unique). Run
`supabase/migrations/0002_password_only_login.sql` once before adding clients; anyone added before it needs
a new password via the `update` the script prints.

| Plan | `plan_type` | `monthly_edit_limit` |
| --- | --- | --- |
| $30/mo retainer | `subscription` | `10` |
| $50 edit batch | `pay_as_you_go` | `5` |
| $500 CMS handover | `cms_handover` | `0` |

Linking Stripe: either put their `stripe_customer_id` on the row, or let the first checkout do it
(see Stripe step 4).

## Handling requests

Open **`/portal/admin`** and sign in with your admin password (set `ADMIN_PASSWORD_HASH` and
`ADMIN_SESSION_SECRET` in Vercel first; see `.env.example`). It shows the headline numbers (projects by
plan, open requests, completions in the last 30 days, edits used, monthly recurring revenue, billing
issues), every request with a status picker, and every project with its quota.

You can also edit `change_requests` directly in Supabase → Table editor. Either way, when `status` moves to
`in_progress`, `completed` or `declined`:

- `completed_at` is stamped for you.
- A **declined** request gives the edit back; un-declining takes it again.

## Rules the system enforces

- **Quota is atomic.** `submit_change_request()` locks the client's row, so two simultaneous
  requests can't both take the last edit.
- **Retainer** resets to 0 on the `invoice.paid` renewal event. A **batch** is a fixed pool that
  stays used until a new batch purchase resets it. The **DIY handover** can't submit requests.
- A **canceled** plan can't submit; **past due** still can (it shows "Payment overdue").
- Attachments: PNG/JPG/WebP/GIF/PDF up to 10 MB, stored privately under the client's own folder.

## Local development

Two ways to run it, depending on what you want to check:

**1. Look around, no accounts needed** — `npm run dev`

A dev-only fake API (`dev/portal-mock-api.ts`) answers `/api/portal/*`, so the whole portal works
locally. Sign in at <http://localhost:5173/portal/login> with **acmeplumbing.com** / **demo-password**
(the login page reminds you in dev). Try the other dashboard states by visiting, then reloading the dashboard:

| URL | Shows |
| --- | --- |
| `/__mock/scenario?s=warn` | 8 / 10 edits used (amber bar) |
| `/__mock/scenario?s=full` | 10 / 10 — request form locked |
| `/__mock/scenario?s=batch` | $50 on-demand batch |
| `/__mock/scenario?s=diy` | $500 DIY handover — no quota |
| `/__mock/scenario?s=pastdue` | payment-overdue badge |
| `/__mock/scenario?s=empty` | no requests yet |
| `/__mock/scenario?s=reset` | back to the default |

The mock is a Vite dev-server plugin: it never ships in a production build, and under `vercel dev`
the real functions answer first.

**2. The real thing** — `vercel dev`

Runs the actual functions against your Supabase and Stripe test keys (`.env.local`, copied from
`.env.example`). Needs the Vercel CLI (`npm i -g vercel`) and a one-time `vercel login`/`vercel link`.

Checks: `npm test` (unit tests) and `npm run build` (typechecks the site and the API).

## Not yet verified

Everything above is covered by unit tests or a type check except the parts that need real accounts:
Supabase JWT acceptance by PostgREST, signed-upload to Storage, the Stripe webhook round trip, and
a Vercel deploy. Run through "Adding a client" once with test keys before sending anyone a login.
