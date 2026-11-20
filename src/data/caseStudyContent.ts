/** A real exported mockup image (from Figma) shown in the assets gallery. */
export type GalleryImage = {
  src: string;
  alt: string;
  /** Intrinsic pixel size — reserves layout space so lazy images don't collapse the masonry. */
  w: number;
  h: number;
  /** Short visible label under the image (flow gallery). */
  caption?: string;
  /** Which column this image sits in when the gallery uses a fixed 2-column layout (mirrors Figma). */
  col?: 1 | 2;
  /** In a "flow" gallery, "full" makes the image span the whole row (e.g. desktop screens). */
  span?: "full";
};

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
  /**
   * Optional real imagery. When present, the case study renders exported
   * design mockups instead of the CSS placeholder mockups. Projects without
   * these fields keep the original placeholder layout.
   */
  heroImage?: string;
  heroImageAlt?: string;
  /** When true the hero image renders as a cropped banner (for very tall screenshots). */
  heroCrop?: boolean;
  /**
   * Hide template sections that aren't part of a given project's source design.
   * (Keeps the page faithful to Figma instead of showing invented sections.)
   */
  hidePurpose?: boolean;
  hideWorkflow?: boolean;
  hideGuidelines?: boolean;
  /** Custom workflow step labels (overrides the default 6-step process). */
  workflowSteps?: readonly string[];
  /** Extra narrative blocks (e.g. "The Challenge", "Research") shown before the gallery. */
  narrative?: readonly { heading: string; body: string }[];
  /** Gallery layout: 2 = fixed two-column (mirrors Figma), otherwise a 3-column masonry. */
  galleryColumns?: 2;
  /** "flow" = items wrap in a row, with span:"full" images breaking to full width (phones + desktops). */
  galleryLayout?: "flow" | "grid";
  guidelinesImage?: string;
  guidelinesImageAlt?: string;
  gallery?: readonly GalleryImage[];
};

const P = (a: string, b: string, c: string) => [a, b, c] as const;

export const CASE_STUDIES: Record<string, CaseStudyContent> = {
  "artemis-museum-ui-design": {
    brandLine: "Artemis museum — UI Design",
    envelopeWord: "Artemis",
    envelopeMeta: "Museum digital · Tbilisi",
    heroTitle: "UI Design for Artemis Art Museum",
    intro:
      "Designing the UI for Artemis Art Museum is about crafting a digital space that mirrors the museum’s elegance, storytelling, and immersive experience.\n\nI translate the museum’s physical atmosphere into a minimalist yet classical interface, using neutral tones, elegant serif fonts, and spacious layouts to create a refined and immersive journey.\n\nNavigation is effortless, like wandering through a well-curated exhibition, with clear access to Exhibitions, Events, Collections, and Ticketing, ensuring visitors feel guided but never rushed. The homepage acts as a cinematic invitation, featuring graceful motion effects and striking visuals that immediately draw users into the world of art and history.",
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
    // The UI Figma page is only a title, intro, and a two-column grid of screens —
    // no workflow, purpose, or logo-guidelines sections. Hide those, mirror the layout.
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    galleryColumns: 2,
    gallery: [
      // Left column (Figma x=30)
      {
        src: "/case-studies/artemis-ui/home.png",
        caption: "Homepage",
        alt: "Artemis museum homepage — cinematic classical hero and sections",
        w: 1661,
        h: 4096,
        col: 1,
      },
      {
        src: "/case-studies/artemis-ui/user-login.png",
        caption: "Sign in",
        alt: "User login screen",
        w: 1920,
        h: 963,
        col: 1,
      },
      {
        src: "/case-studies/artemis-ui/museum-history.png",
        caption: "Museum history",
        alt: "Museum history / about page",
        w: 1920,
        h: 2788,
        col: 1,
      },
      {
        src: "/case-studies/artemis-ui/search.png",
        caption: "Search results",
        alt: "Search results screen",
        w: 1920,
        h: 2023,
        col: 1,
      },
      // Right column (Figma x=975)
      {
        src: "/case-studies/artemis-ui/events-calendar.png",
        caption: "Events calendar",
        alt: "Events calendar screen",
        w: 1920,
        h: 1427,
        col: 2,
      },
      {
        src: "/case-studies/artemis-ui/museum-shop-details.png",
        caption: "Shop, product details",
        alt: "Museum shop product details screen",
        w: 1920,
        h: 2066,
        col: 2,
      },
      {
        src: "/case-studies/artemis-ui/museum-shop-details-2.png",
        caption: "Checkout",
        alt: "Museum shop checkout / cart screen",
        w: 1920,
        h: 1189,
        col: 2,
      },
      {
        src: "/case-studies/artemis-ui/events-details.png",
        caption: "Event details",
        alt: "Event details screen",
        w: 1920,
        h: 2412,
        col: 2,
      },
      {
        src: "/case-studies/artemis-ui/events.png",
        caption: "Events",
        alt: "Events listing screen",
        w: 1920,
        h: 1331,
        col: 2,
      },
      {
        src: "/case-studies/artemis-ui/exhibition-dark.png",
        alt: "Exhibition page, dark theme",
        w: 1920,
        h: 1670,
        col: 2,
      },
    ],
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
    heroImage: "/case-studies/artemis-brand/hero-brochure.png",
    heroImageAlt:
      "Open Artemis museum brochure spread with classical sculpture photography",
    guidelinesImage: "/case-studies/artemis-brand/guidelines.png",
    guidelinesImageAlt:
      "Artemis logo construction guidelines — minimum size, clear space, and logo mark",
    gallery: [
      {
        src: "/case-studies/artemis-brand/exhibition-room.png",
        alt: "“End of the Era” exhibition room with framed artworks",
        w: 1796,
        h: 1241,
      },
      {
        src: "/case-studies/artemis-brand/poster.png",
        alt: "“Art Exhibition — Reflections of the Soul” poster",
        w: 1755,
        h: 2481,
      },
      {
        src: "/case-studies/artemis-brand/letterhead.png",
        alt: "Artemis museum letterhead stationery",
        w: 1241,
        h: 1755,
      },
      {
        src: "/case-studies/artemis-brand/card-1.png",
        alt: "Artemis business card, front and back",
        w: 532,
        h: 296,
      },
      {
        src: "/case-studies/artemis-brand/stationery-1.png",
        alt: "Artemis branded stationery detail",
        w: 297,
        h: 532,
      },
      {
        src: "/case-studies/artemis-brand/collage.png",
        alt: "Collage of Artemis brand booklet and print mockups",
        w: 1920,
        h: 1547,
      },
      {
        src: "/case-studies/artemis-brand/envelope-1.png",
        alt: "Artemis branded envelope",
        w: 972,
        h: 530,
      },
      {
        src: "/case-studies/artemis-brand/stationery-2.png",
        alt: "Artemis branded stationery detail",
        w: 296,
        h: 532,
      },
      {
        src: "/case-studies/artemis-brand/card-2.png",
        alt: "Artemis business card variant",
        w: 532,
        h: 296,
      },
      {
        src: "/case-studies/artemis-brand/booklet.png",
        alt: "Artemis brand booklet spread",
        w: 619,
        h: 248,
      },
      {
        src: "/case-studies/artemis-brand/envelope-2.png",
        alt: "Artemis branded envelope, open flap",
        w: 972,
        h: 417,
      },
    ],
  },

  "rkali-brand-design": {
    brandLine: "Rkali — Brand design",
    envelopeWord: "Rkali",
    envelopeMeta: "Brand guidelines",
    heroTitle: "Jewelry Store Identity",
    intro:
      "A brand identity and custom bilingual (Georgian + English) logotype for Rkali—a modern silver-jewelry startup based in Georgia—applied across a deep-green palette, stationery, and packaging.",
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
      "The full identity system—logo construction, custom typeface, challenge & goal, and packaging mockups.",
    accentGold: "#c8a24a",
    accentTeal: "#1f4d3a",
    // Rkali is rendered by a bespoke component (RkaliCaseStudy) that reconstructs
    // the Figma layout; the fields above are kept only so the route resolves.
  },

  "sportsbook-quick-bet-concept": {
    brandLine: "Sportsbook — Quick bet",
    envelopeWord: "Betsolutions",
    envelopeMeta: "Product concept",
    heroTitle: "Mobile sportsbook",
    intro:
      "Redesigning a UK-focused mobile sportsbook with an intuitive UI for matches page, ticket creation, match history, highlights, and live betting. The goal is a clean, user-friendly experience with quick filters, real-time odds updates, and seamless bet placement to enhance engagement and usability.",
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
      "Matches, live games, bet slip, match list, and live betting—one dark, data-dense mobile system.",
    accentGold: "#7cb342",
    accentTeal: "#00a896",
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    galleryLayout: "flow",
    gallery: [
      {
        src: "/case-studies/sportsbook-concept/matches.png",
        alt: "Matches page with football fixtures and odds",
        w: 375,
        h: 1213,
      },
      {
        src: "/case-studies/sportsbook-concept/games.png",
        alt: "Basketball games list",
        w: 375,
        h: 812,
      },
      {
        src: "/case-studies/sportsbook-concept/bet-slip.png",
        alt: "Bet slip with multibet selections",
        w: 375,
        h: 812,
      },
      {
        src: "/case-studies/sportsbook-concept/match-list.png",
        alt: "Match list with live scores",
        w: 375,
        h: 1091,
      },
      {
        src: "/case-studies/sportsbook-concept/live-betting.png",
        alt: "Live betting and highlights menu",
        w: 375,
        h: 812,
      },
    ],
  },

  "sportsbook-ticket-history": {
    brandLine: "Sportsbook — Ticket history",
    envelopeWord: "Betsolutions",
    envelopeMeta: "Product & brand",
    heroTitle: "Sportsbook history redesign",
    intro:
      "I led the UI redesign for the sportsbook ticket history, focusing on improving usability, clarity, and navigation. My role involved analyzing user pain points, refining the visual hierarchy, and enhancing filtering options to create a more intuitive and seamless experience. By introducing clear status indicators, a structured layout, and better accessibility, I ensured users could easily track and manage their bets across different statuses.",
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
      "The redesigned ticket history across desktop and mobile—clearer filters, status indicators, and effortless bet tracking.",
    accentGold: "#5c6bc0",
    accentTeal: "#00838f",
    hidePurpose: true,
    hideGuidelines: true,
    narrative: [
      {
        heading: "The Challenge",
        body: "The goal for this project was to create a simple and clear interactive design. Filter visuals were too similar, making it difficult to identify the primary focus, so I introduced distinct visual cues to differentiate selected filters. The “Cashout” checkbox resembled radio buttons, potentially confusing users, so I adjusted the design for clearer distinction. To improve filter selection visibility, I incorporated stronger highlights and visual indicators, making it easier to recognize the active option at a glance. Additionally, I addressed accessibility concerns by implementing screen reader compatibility and keyboard navigation, ensuring a more inclusive and user-friendly experience.",
      },
      {
        heading: "Research",
        body: "During the research phase of the sportsbook ticket history redesign, I analyzed user behavior, pain points, and industry standards to identify areas for improvement. Through user interviews and competitor analysis, I discovered that bettors struggled with tracking active and settled bets, filtering ticket history, and quickly finding relevant details. Many users found the previous layout cluttered, with unclear status indicators and inconsistent formatting. Additionally, mobile responsiveness and accessibility were key concerns. These insights guided my approach, ensuring the redesign would offer a cleaner layout, improved filtering, and a more intuitive way to manage betting history—ultimately enhancing the overall user experience.",
      },
    ],
    workflowSteps: [
      "Research & analysis",
      "Ideate & UX",
      "Visual Concept",
      "Evaluate",
      "Wireframing",
    ],
    galleryLayout: "flow",
    gallery: [
      {
        src: "/case-studies/sportsbook-history/desktop-history.png",
        alt: "Desktop ticket history with status-coded rows",
        w: 1400,
        h: 765,
        span: "full",
      },
      {
        src: "/case-studies/sportsbook-history/phone-filters.png",
        alt: "Mobile ticket history with filters",
        w: 786,
        h: 1832,
      },
      {
        src: "/case-studies/sportsbook-history/phone-detail.png",
        alt: "Mobile ticket detail view",
        w: 786,
        h: 1832,
      },
      {
        src: "/case-studies/sportsbook-history/phone-tall.png",
        alt: "Mobile ticket history, expanded",
        w: 438,
        h: 997,
      },
      {
        src: "/case-studies/sportsbook-history/desktop-final.png",
        alt: "Final desktop ticket history layout",
        w: 1400,
        h: 808,
        span: "full",
      },
      {
        src: "/case-studies/sportsbook-history/desktop-macbook.png",
        alt: "Ticket history shown on a MacBook",
        w: 1400,
        h: 765,
        span: "full",
      },
      {
        src: "/case-studies/sportsbook-history/phone-1.png",
        alt: "Mobile ticket history — status filters",
        w: 786,
        h: 1832,
      },
      {
        src: "/case-studies/sportsbook-history/phone-2.png",
        alt: "Mobile ticket history — settled bets",
        w: 786,
        h: 1832,
      },
    ],
  },

  "arcohouse-warehouse-management-system": {
    brandLine: "ArcoHouse — WMS",
    envelopeWord: "ArcoHouse",
    envelopeMeta: "SaaS · Operations",
    heroTitle: "Warehouse management system",
    intro:
      "For the Warehouse Management System, I designed a streamlined and intuitive UI using Kendo UI, ensuring efficiency in inventory tracking, order fulfillment, and logistics coordination. The system provides real-time stock updates, automated alerts, and a seamless order processing workflow to optimize warehouse operations.",
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
      "Core warehouse screens—registration, inventory lists, receiving, and product management—built on a Kendo UI foundation.",
    accentGold: "#b388ff",
    accentTeal: "#5c6bc0",
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    galleryColumns: 2,
    gallery: [
      {
        src: "/case-studies/arco/warehouses.png",
        alt: "Warehouses screen with registration modal",
        w: 1200,
        h: 581,
        col: 1,
      },
      {
        src: "/case-studies/arco/inventory-list.png",
        alt: "Inventory list view",
        w: 1200,
        h: 581,
        col: 1,
      },
      {
        src: "/case-studies/arco/inventory-products.png",
        alt: "Inventory product list with stock amounts",
        w: 1200,
        h: 581,
        col: 2,
      },
      {
        src: "/case-studies/arco/receive.png",
        alt: "Receive goods screen with product list",
        w: 1200,
        h: 581,
        col: 2,
      },
    ],
  },

  "igaming-ui-design": {
    brandLine: "iGaming — UI design",
    envelopeWord: "iGaming",
    envelopeMeta: "Regulated markets",
    heroTitle: "iGaming web design",
    intro:
      "A web design for the TechSolutions iGaming platform—spanning the marketing landing page, game categories such as Board Games, a player-facing platform dashboard, and a contact experience. The interface pairs a clean corporate identity with lively, high-contrast game presentation.",
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
      "Landing page, game categories, platform dashboard, and contact—one cohesive iGaming web system.",
    accentGold: "#42a5f5",
    accentTeal: "#1565c0",
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    galleryColumns: 2,
    gallery: [
      {
        src: "/case-studies/igaming/landing.png",
        alt: "Landing page — “we create awesome things”",
        w: 1200,
        h: 586,
        col: 1,
      },
      {
        src: "/case-studies/igaming/contact.png",
        alt: "Contact Us page",
        w: 1200,
        h: 586,
        col: 1,
      },
      {
        src: "/case-studies/igaming/board-games.png",
        alt: "Board Games category page",
        w: 1200,
        h: 586,
        col: 2,
      },
      {
        src: "/case-studies/igaming/platform.png",
        alt: "Platform dashboard with player statistics",
        w: 1200,
        h: 586,
        col: 2,
      },
    ],
  },

  "hotel-management-system": {
    brandLine: "Hotel management — Desk Manager",
    envelopeWord: "Desk Manager",
    envelopeMeta: "Hospitality SaaS",
    heroTitle: "Hotel management system",
    intro:
      "Designing the UI for a Hotel Management System, I combined a month-long research phase with 20 hotels and staff to ensure the interface truly meets industry needs. This deep dive into real-world operations helped shape a seamless, intuitive experience for both hotel staff and guests. The system efficiently manages room reservations, check-ins and check-outs, billing, housekeeping, and guest services while maintaining a polished, professional look. For the staff dashboard, I designed an interface that provides real-time updates on room availability, bookings, and special requests. Interactive calendars and automated notifications streamline operations, enhancing workflow efficiency. The guest portal offers a frictionless booking experience, allowing users to check room availability, customize their stay, and manage payments effortlessly.",
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
      "Drawing from research insights, I ensured the UI balances aesthetic appeal with functionality, using a clean, modern design that conveys hospitality and trust. Accessibility and responsiveness were priorities. By blending research-driven insights with thoughtful design, I aimed to enhance user experience, reduce operational bottlenecks, and create a system that simplifies hotel management while elevating guest satisfaction.",
    accentGold: "#64b5f6",
    accentTeal: "#0277bd",
    // Figma page: title, intro, a two-column grid of dashboard screens, and a
    // second reflection paragraph (used here as the gallery lead-in). No template sections.
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    galleryColumns: 2,
    gallery: [
      // Left column (Figma x=30)
      {
        src: "/case-studies/hotel-hms/booking-calendar.png",
        alt: "Booking calendar with new-booking modal",
        w: 1761,
        h: 995,
        col: 1,
      },
      {
        src: "/case-studies/hotel-hms/reservations-desk.png",
        alt: "Reservations desk — monthly availability calendar",
        w: 1761,
        h: 995,
        col: 1,
      },
      // Right column (Figma x=971)
      {
        src: "/case-studies/hotel-hms/dashboard-stats.png",
        alt: "Staff dashboard — room statistics, tasks, and activity log",
        w: 1761,
        h: 995,
        col: 2,
      },
      {
        src: "/case-studies/hotel-hms/booking-info.png",
        alt: "Booking info and guests management screen",
        w: 1761,
        h: 995,
        col: 2,
      },
      {
        src: "/case-studies/hotel-hms/transactions.png",
        alt: "Accounting — transactions and billing screen",
        w: 1761,
        h: 995,
        col: 2,
      },
    ],
  },

  "bank-ui-concept": {
    brandLine: "Bank UI — Concept",
    envelopeWord: "Bank UI",
    envelopeMeta: "Fintech concept",
    heroTitle: "Bank application concept",
    intro:
      "I designed a banking application with a clean UI, simple design, and easy-to-navigate interface, ensuring users can manage their finances effortlessly. The app provides real-time account insights, seamless transfers, and secure bill payments, all within a visually streamlined experience. With a responsive layout that works smoothly across devices, intuitive navigation, and secure authentication, the design balances simplicity with functionality, making banking stress-free and efficient.",
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
      "The full set of app screens—passcode onboarding, accounts, transfers, cards, QR payments, and monthly insights.",
    accentGold: "#78909c",
    accentTeal: "#455a64",
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    galleryLayout: "flow",
    gallery: [
      {
        src: "/case-studies/bank/showcase.png",
        alt: "Bank application concept — full set of mobile app screens",
        w: 1600,
        h: 1486,
        span: "full",
      },
    ],
  },

  "valo-trust-banking-application": {
    brandLine: "Valo Trust — Banking app",
    envelopeWord: "Valo Trust",
    envelopeMeta: "Banking application",
    heroTitle: "UI Design for Bank",
    intro:
      "A modern, user-friendly UI for Valo Trust Bank, transforming wireframes into a polished digital experience. With two mobile and one desktop wireframe, along with three finalized UI designs, I created an intuitive, secure, and visually refined interface. The design balances professionalism and accessibility, ensuring seamless navigation for users managing their finances. My focus was on clarity, trust, and efficiency—making banking effortless while reinforcing Valo Trust’s reliability in the digital space.",
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
      "From two mobile and one desktop wireframe to three finalized UI designs—an intuitive, secure, and visually refined banking interface.",
    accentGold: "#81c784",
    accentTeal: "#2e7d32",
    // The Valo Trust Figma page is a title, intro, a row of phone screens, and two
    // full-width desktop screens — no workflow, purpose, or guidelines sections.
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    galleryLayout: "flow",
    gallery: [
      {
        src: "/case-studies/valo-trust/phone-wire-1.png",
        alt: "Mobile wireframe — accounts overview",
        w: 420,
        h: 911,
      },
      {
        src: "/case-studies/valo-trust/phone-ui-1.png",
        alt: "Mobile UI — dashboard with accounts and weekly stats",
        w: 1179,
        h: 2556,
      },
      {
        src: "/case-studies/valo-trust/phone-wire-2.png",
        alt: "Mobile wireframe — transactions",
        w: 420,
        h: 911,
      },
      {
        src: "/case-studies/valo-trust/phone-ui-2.png",
        alt: "Mobile UI — accounts and spending breakdown",
        w: 786,
        h: 1704,
      },
      {
        src: "/case-studies/valo-trust/phone-ui-3.png",
        alt: "Mobile UI — weekly stats and transfers",
        w: 786,
        h: 1704,
      },
      {
        src: "/case-studies/valo-trust/desktop-wire.png",
        alt: "Desktop wireframe — banking dashboard",
        w: 1920,
        h: 911,
        span: "full",
      },
      {
        src: "/case-studies/valo-trust/desktop-ui.png",
        alt: "Desktop UI — Valo Trust banking dashboard, dark theme",
        w: 1920,
        h: 911,
        span: "full",
      },
    ],
  },
  "powerpay-application": {
    brandLine: "PowerPay — Application",
    envelopeWord: "PowerPay",
    envelopeMeta: "Mobile energy app",
    heroTitle: "PowerPay Mobile Application",
    intro:
      "PowerPay is an energy platform that lets households and businesses follow their electricity use, pay invoices and switch supplier from their phone. I designed the mobile application end to end: onboarding and sign-in, the usage dashboard with day, week, month and year views for domestic, commercial and prosumer customers, invoices and statements, and the full set of profile, security, notification and payment settings.",
    purposeHeading: "Product purpose & vision",
    purposePoints: P(
      "Make energy bills, usage and payments easy to read at a glance.",
      "One consistent system across every user role and device.",
      "Vision: a clear, trustworthy energy platform for homes and businesses.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "PowerPay",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "PowerPay",
    letterheadWord: "PowerPay",
    editorialTag: "Product",
    editorialTitle: "Energy in your pocket",
    editorialSub: "PowerPay",
    posterKicker: "Energy",
    posterTitle: "Power, made simple",
    ticketTitle: "Monthly invoice",
    ticketDate: "Due on the 15th",
    assetLede:
      "Onboarding, usage dashboards, invoices and settings — the full PowerPay mobile app.",
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    narrative: [
      { heading: "The problem", body: "Energy bills are hard to read. People see one number at the end of the month and don't know where it came from, when they used the most, or how to pay it without calling support." },
      { heading: "Who it's for", body: "Three kinds of customers use the app: households, businesses and prosumers — people with solar panels who both use and send power back to the grid. Each needs the same basics, but reads their usage differently." },
      { heading: "What I designed", body: "The full mobile app: onboarding and sign-in, a usage dashboard, invoices with a full breakdown and statement of account, and settings for profile, security, notifications and payment methods." },
      { heading: "Key decisions", body: "Usage switches between day, week, month and year with one control, so the same screen answers both 'why was today high?' and 'how does this year compare?'. Prosumers get their own charts that show power used and power sent back side by side, instead of a household chart with extra lines." },
      { heading: "Invoices people can trust", body: "Each invoice opens into a full itemised view — tariff, consumption, fees and taxes — so the total is never a mystery. The statement of account puts every bill and payment on one timeline." },
      { heading: "Result", body: "One app that covers the full customer journey on a phone: sign up, see your usage, understand your bill, pay it and manage your account, with no paperwork or support call." },
    ],
    accentGold: "#00a76f",
    accentTeal: "#007867",
    galleryLayout: "grid",
    gallery: [
      { src: "/case-studies/powerpay-app/screens/intro-1.png", alt: "Intro — your energy in one app", w: 375, h: 813 },
      { src: "/case-studies/powerpay-app/screens/intro-2.png", alt: "Intro — usage at a glance", w: 375, h: 813 },
      { src: "/case-studies/powerpay-app/screens/intro-3.png", alt: "Intro — bills and payments", w: 375, h: 813 },
      { src: "/case-studies/powerpay-app/screens/sign-in.png", alt: "Sign in", w: 375, h: 813 },
      { src: "/case-studies/powerpay-app/screens/usage-day.png", alt: "Usage — day", w: 393, h: 1022 },
      { src: "/case-studies/powerpay-app/screens/usage-week.png", alt: "Usage — week", w: 403, h: 883 },
      { src: "/case-studies/powerpay-app/screens/usage-month.png", alt: "Usage — month", w: 403, h: 896 },
      { src: "/case-studies/powerpay-app/screens/usage-year.png", alt: "Usage — year", w: 363, h: 839 },
      { src: "/case-studies/powerpay-app/screens/prosumer-day.png", alt: "Prosumer — day, used and sent back", w: 403, h: 974 },
      { src: "/case-studies/powerpay-app/screens/prosumer-year.png", alt: "Prosumer — year", w: 403, h: 973 },
      { src: "/case-studies/powerpay-app/screens/invoice-list.png", alt: "Invoice list", w: 393, h: 1128 },
      { src: "/case-studies/powerpay-app/screens/invoice-full.png", alt: "Full invoice, itemised", w: 393, h: 3628 },
      { src: "/case-studies/powerpay-app/screens/statement.png", alt: "Statement of account", w: 393, h: 1948 },
      { src: "/case-studies/powerpay-app/screens/settings.png", alt: "Settings", w: 393, h: 879 },
      { src: "/case-studies/powerpay-app/screens/profile.png", alt: "Profile", w: 393, h: 879 },
      { src: "/case-studies/powerpay-app/screens/security.png", alt: "Security", w: 393, h: 879 },
      { src: "/case-studies/powerpay-app/screens/notifications.png", alt: "Notifications", w: 393, h: 879 },
      { src: "/case-studies/powerpay-app/screens/payment-methods.png", alt: "Payment methods", w: 393, h: 988 },
    ],
  },
  "powerpay-ui-design": {
    brandLine: "PowerPay — UI Design",
    envelopeWord: "PowerPay",
    envelopeMeta: "Dashboard UI",
    heroTitle: "PowerPay Dashboard UI Design",
    intro:
      "PowerPay serves several kinds of users — consumers, suppliers, producers and investors — each with its own web dashboard. I designed the UI for all of them on one shared component system: clear usage charts, wallets, invoices, meter readings and investment tools, so every role gets the data it needs while the product still looks and feels like one platform.",
    purposeHeading: "Product purpose & vision",
    purposePoints: P(
      "Make energy bills, usage and payments easy to read at a glance.",
      "One consistent system across every user role and device.",
      "Vision: a clear, trustworthy energy platform for homes and businesses.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "PowerPay",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "PowerPay",
    letterheadWord: "PowerPay",
    editorialTag: "Product",
    editorialTitle: "One system, every role",
    editorialSub: "PowerPay",
    posterKicker: "Energy",
    posterTitle: "Power, made simple",
    ticketTitle: "Monthly invoice",
    ticketDate: "Due on the 15th",
    assetLede:
      "Role-based dashboards for consumers, suppliers, producers and investors on one design system.",
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    narrative: [
      { heading: "The problem", body: "PowerPay serves very different users — consumers, suppliers, producers and investors. Building a separate product for each would mean four interfaces to learn and maintain, and a brand that feels different everywhere." },
      { heading: "The approach", body: "One shared design system with role-based dashboards. Every role gets the same navigation, cards, tables and charts, but each dashboard puts that role's most important data first." },
      { heading: "Navigation", body: "A compact sidebar keeps the eight main areas — Dashboard, CRM, Billing, Switch Supplier, MDMS, Supplier Settings, Account Settings and Report an Issue — always one click away while leaving the most room for data." },
      { heading: "Data first", body: "Consumers see usage and bills. Suppliers see customers and switch requests. Producers see generation. Investors see their portfolio with an investment calculator to test scenarios before committing." },
      { heading: "Visual language", body: "A calm, light interface with one green accent taken from the PowerPay logo. Colour is kept for status and key numbers, so charts and alerts stand out instead of competing with decoration." },
      { heading: "Result", body: "A consistent platform where a new role is a new dashboard, not a new product — the same components, the same patterns, and one look across every screen." },
    ],
    accentGold: "#00a76f",
    accentTeal: "#007867",
    galleryLayout: "grid",
    gallery: [
      { src: "/case-studies/powerpay-ui/consumer-dashboard.png", alt: "Consumer dashboard", w: 1440, h: 2031, span: "full" },
      { src: "/case-studies/powerpay-ui/supplier-dashboard.png", alt: "Supplier dashboard", w: 1440, h: 1748, span: "full" },
      { src: "/case-studies/powerpay-ui/producer-dashboard.png", alt: "Producer dashboard", w: 1440, h: 1355, span: "full" },
      { src: "/case-studies/powerpay-ui/investor-portfolio.png", alt: "Investor portfolio with investment calculator", w: 1440, h: 1378, span: "full" },
      { src: "/case-studies/powerpay-ui/analytics.png", alt: "Analytics overview", w: 1440, h: 1255, span: "full" },
      { src: "/case-studies/powerpay-ui/wallet.png", alt: "Personal wallet", w: 1440, h: 1381, span: "full" },
      { src: "/case-studies/powerpay-ui/meter-reading.png", alt: "Meter reading", w: 1440, h: 1320, span: "full" },
      { src: "/case-studies/powerpay-ui/invoice-details.png", alt: "Domestic invoice details", w: 1440, h: 2091, span: "full" },
    ],
  },
  "powerpay-ux-design": {
    brandLine: "PowerPay — UX Design",
    envelopeWord: "PowerPay",
    envelopeMeta: "User flows",
    heroTitle: "PowerPay UX Design",
    intro:
      "Signing up for an energy service and switching supplier are usually slow and confusing. For PowerPay I mapped and designed these journeys step by step: a welcome tour of the main features, sign-in and a guided sign-up with email check, verification and plan choice, and a supplier switch flow that lists what you need up front, collects personal and meter details, and ends with a clear confirmation.",
    purposeHeading: "Product purpose & vision",
    purposePoints: P(
      "Make energy bills, usage and payments easy to read at a glance.",
      "One consistent system across every user role and device.",
      "Vision: a clear, trustworthy energy platform for homes and businesses.",
    ),
    guidelinesHeading: "Logo design & guidelines",
    lockupLine: "PowerPay",
    horizontalName: "Dimitri Karmazanashvili",
    horizontalRole: "Product Designer",
    horizontalOrg: "PowerPay",
    letterheadWord: "PowerPay",
    editorialTag: "Product",
    editorialTitle: "Fewer steps, less doubt",
    editorialSub: "PowerPay",
    posterKicker: "Energy",
    posterTitle: "Power, made simple",
    ticketTitle: "Monthly invoice",
    ticketDate: "Due on the 15th",
    assetLede:
      "Welcome tour, sign-up and supplier switch — each journey broken into short, clear steps.",
    hidePurpose: true,
    hideWorkflow: true,
    hideGuidelines: true,
    narrative: [
      { heading: "The problem", body: "Signing up for an energy service and switching supplier are usually slow, paper-heavy and confusing. People drop out halfway because they don't know what's needed or how many steps are left." },
      { heading: "Goal", body: "Make both journeys feel short and predictable: show what's needed before starting, ask for one thing at a time, and always show where you are." },
      { heading: "Welcome tour", body: "New users get a short tour of the main features — invoices, wallet, the power chart and supplier switching — so they know what the product does before being asked for anything." },
      { heading: "Sign-up", body: "Sign-up is split into small steps — email, verification code, personal details, organisation and plan — with a stepper beside the form that shows done, current and upcoming steps, so progress is always visible." },
      { heading: "Switching supplier", body: "The switch flow lists everything you'll need up front (ID, meter number, address), then collects personal details, meter details and a signature, and ends with a clear confirmation. Separate paths handle individuals and businesses." },
      { heading: "Result", body: "Two of the most stressful tasks in energy turned into guided flows: fewer surprises, no guessing about what comes next, and a clear finish line." },
    ],
    accentGold: "#00a76f",
    accentTeal: "#007867",
    galleryLayout: "grid",
    gallery: [
      { src: "/case-studies/powerpay-ux/welcome.png", alt: "Welcome tour", w: 1440, h: 1003, span: "full" },
      { src: "/case-studies/powerpay-ux/sign-in.png", alt: "Sign in", w: 1440, h: 1024, span: "full" },
      { src: "/case-studies/powerpay-ux/sign-up-email.png", alt: "Sign up — email step with progress stepper", w: 1440, h: 1024, span: "full" },
      { src: "/case-studies/powerpay-ux/sign-up-verify.png", alt: "Sign up — verification code", w: 1440, h: 1024, span: "full" },
      { src: "/case-studies/powerpay-ux/sign-up-plan.png", alt: "Sign up — choose a plan", w: 1440, h: 1024, span: "full" },
      { src: "/case-studies/powerpay-ux/switch-start.png", alt: "Supplier switch — start", w: 1440, h: 1024, span: "full" },
      { src: "/case-studies/powerpay-ux/switch-prerequisites.png", alt: "Supplier switch — what you need", w: 1440, h: 987, span: "full" },
      { src: "/case-studies/powerpay-ux/switch-details.png", alt: "Supplier switch — personal details", w: 1440, h: 1233, span: "full" },
      { src: "/case-studies/powerpay-ux/switch-done.png", alt: "Supplier switch — done", w: 1440, h: 1024, span: "full" },
      { src: "/case-studies/powerpay-ux/flow-map.png", alt: "Discovery — full product flow map", w: 2800, h: 1633 },
      { src: "/case-studies/powerpay-ux/consumer-flows.png", alt: "Discovery — the three ways a consumer arrives", w: 3600, h: 949 },
    ],
  },
};

export function getCaseStudy(slug: string | undefined): CaseStudyContent | undefined {
  if (!slug) return undefined;
  return CASE_STUDIES[slug];
}
