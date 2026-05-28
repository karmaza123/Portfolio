/** Filter bar categories — project cards may use different display tags. */
export const PROJECT_FILTER_CATEGORIES = [
  "Branding",
  "B2B / SaaS",
  "Mobile",
  "Product",
  "UI/UX",
] as const;

export type ProjectFilterCategory = (typeof PROJECT_FILTER_CATEGORIES)[number];
