import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// VITE_* values are baked into the public bundle. Only the publishable (or
// legacy anon) key may go there; refuse to build with a secret or
// service-role key. The key itself is never printed.
const assertPublicSupabaseKey = (key) => {
  if (!key) return;
  if (key.startsWith("sb_secret_")) {
    throw new Error("VITE_SUPABASE_ANON_KEY is a secret key. Use the project's publishable key.");
  }
  const payload = key.split(".")[1];
  if (!payload) return;
  let role;
  try {
    role = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")).role;
  } catch {
    return;
  }
  if (role && role !== "anon") {
    throw new Error(`VITE_SUPABASE_ANON_KEY has role "${role}". Only the anon/publishable key may be used.`);
  }
};

// The project URL must be the bare origin (https://<ref>.supabase.co).
// supabase-js adds /rest/v1 itself, so a URL copied with that path makes
// every query fail and the site silently fall back to local content.
const assertSupabaseUrl = (value) => {
  if (!value) return;
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("VITE_SUPABASE_URL is not a valid URL.");
  }
  if (url.protocol !== "https:" || (url.pathname !== "/" && url.pathname !== "") || url.search || url.hash) {
    throw new Error(
      "VITE_SUPABASE_URL must be just the project URL, https://<project-ref>.supabase.co, with no path such as /rest/v1/."
    );
  }
};

// The site is served from the root of its own subdomain (codecat.tlasara.dev),
// so "/" is the correct base. Absolute asset paths are required for deep links
// such as /blog/my-post to load their assets. To host under a sub-path instead,
// build with CODECAT_BASE=/some/path/ — the router picks it up automatically.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  assertSupabaseUrl(env.VITE_SUPABASE_URL);
  assertPublicSupabaseKey(env.VITE_SUPABASE_ANON_KEY);

  return {
    base: process.env.CODECAT_BASE || "/",
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
