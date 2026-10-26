// Site-wide settings that are not content (content comes from Supabase, with
// src/data/ as the offline fallback; see src/lib/content.js).

// Which developer this portfolio belongs to. Every query is scoped to it.
// Set VITE_DEVELOPER_SLUG at build time (see TEMPLATE.md); the fallback keeps
// local development working without a .env file.
export const DEVELOPER_SLUG = import.meta.env.VITE_DEVELOPER_SLUG || "codecat";

// Short name shown in page titles ("Post title · codecat") and the logo link.
export const SITE_NAME = "codecat";

export const SITE_URL = "https://codecat.tlasara.dev";

// Every Tlasara portfolio belongs to the company, so this lives here rather
// than in the database.
export const ORGANIZATION = {
  name: "Tlasara",
  url: "https://tlasara.dev",
  description: "a women-focused tech brand",
};

// The company contact form that "Work with me" links to. The portfolio has no
// form of its own; see src/lib/contact.js for how the prefilled link is built.
export const CONTACT_FORM_URL = "https://tlasara.dev/contact";
