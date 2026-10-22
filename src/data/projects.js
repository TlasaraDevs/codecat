// Table: projects — shared across all Tlasara developers. A project appears in
// a portfolio when that developer's slug is in `developer_slugs`.
//
// status: "shipped" | "in_progress" | "planned" | "archived"
// Optional fields (screenshot_url, github_url, live_url) may be "" or null —
// the card shows a placeholder panel / hides the button.
//
// To add a project, copy a row, give it a new id/slug and a sort_order.
export const projects = [
  {
    id: 1,
    slug: "zarason",
    title: "Zarason",
    summary:
      "An e-commerce storefront for a client's business selling sweets, perfumes, skincare and jewellery.",
    description:
      "Freelance web design and build for a growing retail business. The site brings four very different product lines under one clean, easy-to-browse brand.",
    tech: [],
    screenshot_url: "",
    github_url: "",
    live_url: "",
    status: "in_progress",
    featured: true,
    sort_order: 1,
    developer_slugs: ["codecat"],
  },
  {
    id: 2,
    slug: "codecat-portfolio",
    title: "codecat portfolio",
    summary: "This site: a comic-flavoured, black-and-red developer portfolio.",
    description:
      "Built with a content layer shaped like database tables so it can move to a Supabase backend without touching the components.",
    tech: ["React", "Vite", "Tailwind CSS", "Framer Motion"],
    screenshot_url: "/images/portfolio.png",
    github_url: "",
    live_url: "https://codecat.tlasara.dev",
    status: "shipped",
    featured: true,
    sort_order: 2,
    developer_slugs: ["codecat"],
  },
];
