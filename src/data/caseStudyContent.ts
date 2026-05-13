/** One scroll template; copy is unique per portfolio tile. */
export type CaseStudyContent = {
  brandLine: string;
  envelopeWord: string;
  envelopeMeta: string;
  heroTitle: string;
  intro: string;
  purposeHeading: string;
  purposePoints: readonly [string, string, string];
  guidelinesHeading: string;
  lockupLine: string;
  horizontalName: string;
  horizontalRole: string;
  horizontalOrg: string;
  letterheadWord: string;
  editorialTag: string;
  editorialTitle: string;
  editorialSub: string;
  posterKicker: string;
  posterTitle: string;
  ticketTitle: string;
  ticketDate: string;
  assetLede: string;
  accentGold?: string;
  accentTeal?: string;
};

const P = (a: string, b: string, c: string) => [a, b, c] as const;

export const CASE_STUDIES: Record<string, CaseStudyContent> = {
  "artemis-museum-ui-design": {
    brandLine: "Artemis museum — UI Design",
    envelopeWord: "Artemis",
    envelopeMeta: "Museum digital · Tbilisi",
    heroTitle: "The story behind the Artemis museum interface",
    intro:
      "A focused UI pass for the Artemis museum digital ecosystem: exhibition discovery, ticketing flows, and editorial storytelling—built to feel as refined as the physical galleries while staying fast and legible on every device.",
    purposeHeading: "Product purpose & vision",
    purposePoints: P(
      "Guide visitors from curiosity to ticket purchase without visual noise.",
      "Unify typography, spacing, and components across web and on-site kiosks.",
      "Vision: timeless art, modern interaction patterns, and accessible contrast.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Artemis Art Museum",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Artemis museum, UI Design",
    letterheadWord: "Artemis",
    editorialTag: "Editorial",
    editorialTitle: "End of the era",
    editorialSub: "Museum feature spread",
    posterKicker: "Exhibition",
    posterTitle: "Reflections of the soul",
    ticketTitle: "Member preview",
    ticketDate: "Sat · 18:00",
    assetLede:
      "UI surfaces, editorial modules, and marketing collateral aligned to the same grid—classical tone with a minimal digital system.",
    accentGold: "#e58a2a",
    accentTeal: "#2d6d6f",
  },

  "artemis-museum-brand-identity": {
    brandLine: "Artemis museum — Brand identity",
    envelopeWord: "Artemis",
    envelopeMeta: "Brand studio · Tbilisi",
    heroTitle: "The story behind the Artemis museum identity",
    intro:
      "Full brand identity guidelines for Artemis museum: mark construction, print and digital lockups, stationery, and exhibition graphics—balancing classical sculpture references with a clean contemporary grid.",
    purposeHeading: "Brand purpose & vision",
    purposePoints: P(
      "Celebrate human history and artistic expression across cultures.",
      "Deliver a cohesive visual language in print, environmental, and digital.",
      "Vision: craft-forward, welcoming, and confident without ornament overload.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Artemis Art Museum",
    horizontalName: "Jonathan Doe",
    horizontalRole: "Art Director",
    horizontalOrg: "Artemis museum, Brand identity",
    letterheadWord: "Artemis",
    editorialTag: "Editorial",
    editorialTitle: "End of the era",
    editorialSub: "Two-page museum feature",
    posterKicker: "Art exhibition",
    posterTitle: "Reflections of the soul",
    ticketTitle: "Evening viewing",
    ticketDate: "Sat · 19:30",
    assetLede:
      "Identity design spanning editorial, stationery, posters, and event collateral—classical aesthetic with modern minimalism.",
    accentGold: "#e58a2a",
    accentTeal: "#2d6d6f",
  },

  "rkali-brand-design": {
    brandLine: "Rkali — Brand design",
    envelopeWord: "Rkali",
    envelopeMeta: "Brand guidelines",
    heroTitle: "The story behind the Rkali brand",
    intro:
      "Rkali needed a confident mark and packaging-forward palette rooted in deep green tones. This case study covers exploration, final symbol, typography pairing, and rules for digital and physical applications.",
    purposeHeading: "Brand purpose & vision",
    purposePoints: P(
      "Signal quality and longevity in a crowded consumer landscape.",
      "Keep the mark legible from favicon scale to large signage.",
      "Vision: calm premium, nature-adjacent, and unmistakably Rkali.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Rkali",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Rkali brand design",
    letterheadWord: "Rkali",
    editorialTag: "Brand book",
    editorialTitle: "Roots & rhythm",
    editorialSub: "Identity chapter opener",
    posterKicker: "Launch",
    posterTitle: "Rkali — new chapter",
    ticketTitle: "Launch event",
    ticketDate: "Thu · 20:00",
    assetLede:
      "Brand applications across print, social templates, and retail-ready layouts—one system, many touchpoints.",
    accentGold: "#c8a24a",
    accentTeal: "#1f4d3a",
  },

  "sportsbook-quick-bet-concept": {
    brandLine: "Sportsbook — Quick bet",
    envelopeWord: "Betsolutions",
    envelopeMeta: "Product concept",
    heroTitle: "The story behind the quick bet experience",
    intro:
      "A concept for a faster in-play betting path: fewer taps, clearer odds states, and resilient layouts for live data. Designed for high-stress moments where milliseconds of comprehension matter as much as aesthetics.",
    purposeHeading: "Product focus",
    purposePoints: P(
      "Reduce friction from event discovery to confirmed stake.",
      "Make risk, reward, and account status obvious at every step.",
      "Vision: dark-first UI, high-signal color, and motion only when helpful.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Sportsbook — Quick bet concept",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Sportsbook, Quick bet concept",
    letterheadWord: "Sportsbook",
    editorialTag: "Product",
    editorialTitle: "In-play clarity",
    editorialSub: "UX narrative deck",
    posterKicker: "Concept",
    posterTitle: "Quick bet — flow study",
    ticketTitle: "VIP lounge pass",
    ticketDate: "Match day",
    assetLede:
      "Screens, states, and marketing tiles aligned to one component language—built for dense data and night-mode usage.",
    accentGold: "#7cb342",
    accentTeal: "#00a896",
  },

  "sportsbook-ticket-history": {
    brandLine: "Sportsbook — Ticket history",
    envelopeWord: "Betsolutions",
    envelopeMeta: "Product & brand",
    heroTitle: "The story behind ticket history & receipts",
    intro:
      "Ticket history pairs transactional clarity with brand warmth: readable timelines, exportable summaries, and print-friendly receipts. The work spans UI patterns, microcopy, and companion print assets.",
    purposeHeading: "Experience principles",
    purposePoints: P(
      "Help users audit bets without spreadsheet anxiety.",
      "Keep trust cues—time, stake, outcome—always visible.",
      "Vision: calm light surfaces for daytime review sessions.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Sportsbook — Ticket history",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Sportsbook, Ticket history",
    letterheadWord: "Sportsbook",
    editorialTag: "Guidelines",
    editorialTitle: "Receipts & exports",
    editorialSub: "Pattern library notes",
    posterKicker: "Release",
    posterTitle: "History you can trust",
    ticketTitle: "Season ticket",
    ticketDate: "Archive access",
    assetLede:
      "Cross-channel assets tying the product UI to printable summaries and partner comms.",
    accentGold: "#5c6bc0",
    accentTeal: "#00838f",
  },

  "arcohouse-warehouse-management-system": {
    brandLine: "ArcoHouse — WMS",
    envelopeWord: "ArcoHouse",
    envelopeMeta: "SaaS · Operations",
    heroTitle: "The story behind ArcoHouse warehouse OS",
    intro:
      "ArcoHouse is a warehouse management system for teams juggling inventory, inbound/outbound, and exceptions. The case study covers information hierarchy, dense tables, role-based dashboards, and a scalable design system.",
    purposeHeading: "Platform principles",
    purposePoints: P(
      "Make operational truth visible before exceptions pile up.",
      "Design for keyboard-heavy workflows and long shifts.",
      "Vision: serious SaaS that still feels approachable for new operators.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "ArcoHouse — Warehouse Management System",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "ArcoHouse, WMS",
    letterheadWord: "ArcoHouse",
    editorialTag: "SaaS",
    editorialTitle: "Floor to dashboard",
    editorialSub: "Workflow map",
    posterKicker: "Platform",
    posterTitle: "Control the floor",
    ticketTitle: "Onboarding session",
    ticketDate: "Week 1",
    assetLede:
      "Product UI, empty states, and sales collateral sharing one purple-forward visual system.",
    accentGold: "#b388ff",
    accentTeal: "#5c6bc0",
  },

  "igaming-ui-design": {
    brandLine: "iGaming — UI design",
    envelopeWord: "iGaming",
    envelopeMeta: "Regulated markets",
    heroTitle: "The story behind this iGaming UI system",
    intro:
      "A modular UI kit for iGaming surfaces: lobby, game details, promotions, and account. Built for localization, brand skins, and strict readability across jurisdictions while staying visually competitive.",
    purposeHeading: "Design principles",
    purposePoints: P(
      "Balance excitement with compliance-friendly layouts.",
      "Support white-label theming without breaking components.",
      "Vision: fast scanning, clear CTAs, and resilient dark mode.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Igaming UI design",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Igaming UI design",
    letterheadWord: "iGaming",
    editorialTag: "UI kit",
    editorialTitle: "Split-screen study",
    editorialSub: "Lobby exploration",
    posterKicker: "Campaign",
    posterTitle: "Play smart",
    ticketTitle: "Tournament entry",
    ticketDate: "Sun · 21:00",
    assetLede:
      "Marketing tiles, in-app modules, and email headers aligned to the same token set and grid.",
    accentGold: "#42a5f5",
    accentTeal: "#1565c0",
  },

  "hotel-management-system": {
    brandLine: "Hotel management — Desk Manager",
    envelopeWord: "Desk Manager",
    envelopeMeta: "Hospitality SaaS",
    heroTitle: "The story behind the hotel management suite",
    intro:
      "Desk Manager brings front-desk, housekeeping, and billing into one calm interface. The project focused on reducing training time, surfacing occupancy clearly, and designing printable guest-facing artifacts.",
    purposeHeading: "Product focus",
    purposePoints: P(
      "Unify staff workflows without hiding critical alerts.",
      "Design for tablets at the desk and desktops in the back office.",
      "Vision: hospitality warmth with operational rigor.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Hotel Management System",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Hotel Management System",
    letterheadWord: "Desk Manager",
    editorialTag: "Hospitality",
    editorialTitle: "The front desk reset",
    editorialSub: "Journey maps",
    posterKicker: "Suite",
    posterTitle: "Guests first",
    ticketTitle: "Staff training",
    ticketDate: "Mon · 09:00",
    assetLede:
      "Blue-forward product chrome with invoices, door cards, and signage templates in one system.",
    accentGold: "#64b5f6",
    accentTeal: "#0277bd",
  },

  "bank-ui-concept": {
    brandLine: "Bank UI — Concept",
    envelopeWord: "Bank UI",
    envelopeMeta: "Fintech concept",
    heroTitle: "The story behind the banking UI concept",
    intro:
      "A mobile-first banking concept exploring cards, payments, and savings goals with optimistic UI and clear security affordances. The case study captures flows, components, and a restrained marketing layer.",
    purposeHeading: "Experience principles",
    purposePoints: P(
      "Make money movement feel understandable, not theatrical.",
      "Prioritize accessibility and large-type readability.",
      "Vision: light, airy surfaces with crisp iconography.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Bank UI concept",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Bank UI concept",
    letterheadWord: "Bank",
    editorialTag: "Concept",
    editorialTitle: "Everyday money",
    editorialSub: "Mobile flows",
    posterKicker: "Fintech",
    posterTitle: "Confidence in every tap",
    ticketTitle: "Beta invite",
    ticketDate: "Q2",
    assetLede:
      "Product screens plus lightweight print and OOH-style tiles using the same typographic scale.",
    accentGold: "#78909c",
    accentTeal: "#455a64",
  },

  "valo-trust-banking-application": {
    brandLine: "Valo Trust — Banking app",
    envelopeWord: "Valo Trust",
    envelopeMeta: "Banking application",
    heroTitle: "The story behind Valo Trust",
    intro:
      "Valo Trust is a dark-mode banking application focused on trust, clarity, and investment overviews. Work included navigation architecture, data visualization tone, and a cohesive set of cards for accounts and portfolios.",
    purposeHeading: "Product principles",
    purposePoints: P(
      "Surface balances and risk without alarming visual noise.",
      "Support deep sessions with legible charts and tables.",
      "Vision: premium private banking feel on consumer hardware.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "Valo Trust, Banking Application",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "Valo Trust",
    letterheadWord: "Valo",
    editorialTag: "Product",
    editorialTitle: "Trust at a glance",
    editorialSub: "Portfolio views",
    posterKicker: "Wealth",
    posterTitle: "Grow with clarity",
    ticketTitle: "Advisor session",
    ticketDate: "By appointment",
    assetLede:
      "Dark UI patterns, investor PDFs, and event passes sharing one green-accented system.",
    accentGold: "#81c784",
    accentTeal: "#2e7d32",
  },
};

export function getCaseStudy(slug: string | undefined): CaseStudyContent | undefined {
  if (!slug) return undefined;
  return CASE_STUDIES[slug];
}
