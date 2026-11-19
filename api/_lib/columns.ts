/**
 * The `clients` columns a signed-in client may read. Must match the `grant select (...)` list in
 * supabase/migrations/0001_client_portal.sql exactly: clients hold column-level grants (the
 * password hash and Stripe ids are withheld), so asking for any other column — including `*` —
 * makes Postgres refuse the whole query.
 */
export const CLIENT_COLUMNS =
  "id, company_name, domain_name, plan_type, billing_status, current_period_end, monthly_edit_limit, edits_used_this_month, created_at";
