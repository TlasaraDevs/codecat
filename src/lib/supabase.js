// The site's only connection to Supabase. It uses the project URL and the
// public (publishable / anon) key, which are safe in the browser: Row Level
// Security and the public_* views decide what they can read, and the only
// write they allow is a page view. Never put any other key in a VITE_*
// variable (vite.config.js refuses to build with a secret key).

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// How long a request may take before the site gives up and uses its local
// content. Free projects pause when idle; a paused project must not hold up
// the page.
const TIMEOUT_MS = 4000;

// Once a content query fails, use local content for the rest of the visit
// rather than waiting on every query in turn.
let unavailable = !(SUPABASE_URL && SUPABASE_KEY);

// supabase-js is loaded on first use, so it never delays the first paint and
// isn't downloaded at all when the site isn't configured for Supabase.
let clientPromise;
const getClient = () => {
  clientPromise ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_KEY, {
      // Public pages never sign in.
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      // supabase-js retries failed reads with back-off; with a paused or
      // unreachable project that only delays the local fallback.
      db: { retry: false },
    })
  );
  return clientPromise;
};

// Runs a query built from the client, e.g.
//   run((db) => db.from("public_skills").select("name").eq("developer_slug", slug))
// with a timeout. Resolves to the rows; rejects on any error or timeout.
const run = async (build) => {
  const client = await getClient();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const { data, error } = await build(client).abortSignal(controller.signal);
    if (error) throw error;
    return data;
  } finally {
    clearTimeout(timer);
  }
};

// For content: rejects immediately once Supabase has been unavailable.
export const query = async (build) => {
  if (unavailable) throw new Error("Supabase unavailable");
  try {
    return await run(build);
  } catch (error) {
    unavailable = true;
    throw error;
  }
};

// For page views: best effort, never affects content loading.
export const insertPageView = async (row) => {
  if (unavailable) return;
  await run((db) => db.from("page_views").insert(row));
};
