/** Home list — matches case study slugs */
export type HomeProject = {
  num: string;
  title: string;
  slug: string;
  tags: string[];
  year: string;
  award?: string;
};

export const HOME_PROJECTS: HomeProject[] = [
  {
    num: "001",
    title: "Artemis museum, UI Design",
    slug: "artemis-museum-ui-design",
    tags: ["UI/UX Design", "Museum"],
    year: "2024",
  },
  {
    num: "002",
    title: "Artemis museum, Brand Identity Guidelines",
    slug: "artemis-museum-brand-identity",
    tags: ["Brand", "Guidelines"],
    year: "2024",
    award: "Identity",
  },
  {
    num: "003",
    title: "Rkali Brand Design",
    slug: "rkali-brand-design",
    tags: ["Brand", "Packaging"],
    year: "2023",
  },
  {
    num: "004",
    title: "Sportsbook, Quick bet concept",
    slug: "sportsbook-quick-bet-concept",
    tags: ["Product", "Gaming"],
    year: "2023",
  },
  {
    num: "005",
    title: "Sportsbook, Ticket History",
    slug: "sportsbook-ticket-history",
    tags: ["UI/UX", "Fintech"],
    year: "2023",
  },
  {
    num: "006",
    title: "ArcoHouse, Warehouse Management System",
    slug: "arcohouse-warehouse-management-system",
    tags: ["SaaS", "B2B"],
    year: "2022",
  },
  {
    num: "007",
    title: "Igaming UI design",
    slug: "igaming-ui-design",
    tags: ["UI Kit", "Gaming"],
    year: "2022",
  },
  {
    num: "008",
    title: "Hotel Management System",
    slug: "hotel-management-system",
    tags: ["SaaS", "Hospitality"],
    year: "2022",
  },
  {
    num: "009",
    title: "Bank UI concept",
    slug: "bank-ui-concept",
    tags: ["Mobile", "Fintech"],
    year: "2021",
  },
  {
    num: "010",
    title: "Valo Trust, Banking Application",
    slug: "valo-trust-banking-application",
    tags: ["Product", "Banking"],
    year: "2021",
  },
];
