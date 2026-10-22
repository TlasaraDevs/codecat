import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// The site is served from the root of its own subdomain (codecat.tlasara.dev),
// so "/" is the correct base. Absolute asset paths are required for deep links
// such as /blog/my-post to load their assets. To host under a sub-path instead,
// build with CODECAT_BASE=/some/path/ — the router picks it up automatically.
export default defineConfig({
  base: process.env.CODECAT_BASE || "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
