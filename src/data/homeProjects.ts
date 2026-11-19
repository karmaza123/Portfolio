import type { ProjectFilterCategory } from "../constants/projectFilters";

/** Home list — matches case study slugs */
export type HomeProject = {
  num: string;
  title: string;
  slug: string;
  /** Shown on the project row */
  tags: string[];
  /** Used by the category filter only */
  categories: ProjectFilterCategory[];
  year: string;
  award?: string;
  /** Cover for the grid layout; falls back to the case study's first image. */
  thumb?: string;
};

export const HOME_PROJECTS: HomeProject[] = [
  {
    num: "001",
    title: "Mintly, Design System & Redesign",
    slug: "mintly-design-system",
    thumb: "/case-studies/mintly/showcase/laptop.webp",
    tags: ["Design System", "Product"],
    categories: ["Product", "UI/UX"],
    year: "2026",
  },
  {
    num: "002",
    title: "PowerPay, Mobile Application",
    slug: "powerpay-application",
    thumb: "/case-studies/powerpay-app/screens/usage-day.png",
    tags: ["Mobile", "Energy"],
    categories: ["Mobile"],
    year: "2025",
  },
  {
    num: "003",
    title: "PowerPay, UI Design",
    slug: "powerpay-ui-design",
    thumb: "/case-studies/powerpay-ui/consumer-dashboard.png",
    tags: ["UI Design", "Dashboard"],
    categories: ["UI/UX", "B2B / SaaS"],
    year: "2025",
  },
  {
    num: "004",
    title: "PowerPay, UX Design",
    slug: "powerpay-ux-design",
    thumb: "/case-studies/powerpay-ux/flow-map.png",
    tags: ["UX Design", "User flows"],
    categories: ["UI/UX"],
    year: "2025",
  },
  {
    num: "005",
    title: "Artemis museum, UI Design",
    slug: "artemis-museum-ui-design",
    tags: ["UI/UX Design", "Museum"],
    categories: ["UI/UX"],
    year: "2024",
  },
  {
    num: "006",
    title: "Artemis museum, Brand Identity Guidelines",
    slug: "artemis-museum-brand-identity",
    tags: ["Brand", "Guidelines"],
    categories: ["Branding"],
    year: "2024",
  },
  {
    num: "007",
    title: "Rkali Brand Design",
    slug: "rkali-brand-design",
    thumb: "/case-studies/rkali/pkg-box-a.png",
    tags: ["Brand", "Packaging"],
    categories: ["Branding"],
    year: "2023",
  },
  {
    num: "008",
    title: "Sportsbook, Quick bet concept",
    slug: "sportsbook-quick-bet-concept",
    tags: ["Product", "Gaming"],
    categories: ["Product"],
    year: "2023",
  },
  {
    num: "009",
    title: "Sportsbook, Ticket History",
    slug: "sportsbook-ticket-history",
    tags: ["UI/UX", "Fintech"],
    categories: ["UI/UX"],
    year: "2023",
  },
  {
    num: "010",
    title: "ArcoHouse, Warehouse Management System",
    slug: "arcohouse-warehouse-management-system",
    tags: ["SaaS", "B2B"],
    categories: ["B2B / SaaS"],
    year: "2022",
  },
  {
    num: "011",
    title: "Igaming UI design",
    slug: "igaming-ui-design",
    tags: ["UI Kit", "Gaming"],
    categories: ["UI/UX"],
    year: "2022",
  },
  {
    num: "012",
    title: "Hotel Management System",
    slug: "hotel-management-system",
    tags: ["SaaS", "Hospitality"],
    categories: ["B2B / SaaS"],
    year: "2022",
  },
  {
    num: "013",
    title: "Bank UI concept",
    slug: "bank-ui-concept",
    tags: ["Mobile", "Fintech"],
    categories: ["Mobile"],
    year: "2021",
  },
  {
    num: "014",
    title: "Valo Trust, Banking Application",
    slug: "valo-trust-banking-application",
    tags: ["Product", "Banking"],
    categories: ["Product"],
    year: "2021",
  },
];
