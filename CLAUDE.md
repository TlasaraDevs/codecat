# CLAUDE.md

codecat (Wanjiru Mbuthia's portfolio) at https://codecat.tlasara.dev.
React 19 + Vite 6 + Tailwind 4 static site. Content comes from the shared
Tlasara Supabase project; see README.md for the full picture.

## Basics

- Node 24 (`.nvmrc`, `engines`). Use `npm ci` / `npm install`, never another
  package manager.
- `npm run lint` must pass before every commit; CI runs it before building.
- Never commit `.env` (git-ignored). Only public values go in `VITE_*`
  variables: they are baked into the bundle.

## Deploy rules (do not weaken)

The server is shared: one FTP account (`deploy@tlasara.dev`) whose root is
`public_html/`, which is tlasara.dev itself. This site lives in
`public_html/codecat/`.

- `.github/workflows/deploy.yml` uploads `./dist/` to `server-dir: ./codecat/`.
  Keep `server-dir` **hard-coded** (never a secret or variable). `./` would
  overwrite tlasara.dev.
- Never set `dangerous-clean-slate`: it empties the target folder first.
- Keep the "Check build output" step: a build without `dist/.htaccess` would
  drop the redirect that hides the `tlasara.dev/codecat/` copy.
- The FTP action is pinned to a commit SHA (`# v4.4.0`). Don't change the
  version or unpin it without the owner's approval.
- Keep the `deploy-codecat` concurrency group (one deploy at a time).
- The action tracks uploads in `codecat/.ftp-deploy-sync-state.json` on the
  server and only deletes files listed there. Don't rename the state file
  (`state-name`) or change `server-dir`, or the next deploy re-uploads
  everything and stops cleaning up old files.
- The tlasara.dev deploy (in the tlasara repo) excludes `codecat/` and fails
  if its build contains one. That safeguard lives there, not here.

## .htaccess (`public/.htaccess`, copied into `dist/`)

- 301-redirects every host except `codecat.tlasara.dev` to it (same path), and
  catches `tlasara.dev/codecat` without a trailing slash with `RedirectMatch`.
- Serves `/blog/...` from `index.html`; unknown URLs get the 404 page with a
  real 404 status.
- Blocks `.ftp-deploy-sync-state.json`.
- tlasara.dev's own `public_html/.htaccess` also applies to this folder. Its
  rewrites are replaced by ours (`RewriteEngine On`), but its other directives
  (Options, headers, …) still apply.

## Supabase: keys, URL and the public API

- `vite.config.js` refuses to build if `VITE_SUPABASE_ANON_KEY` is a secret
  (`sb_secret_…`) or service-role key, or if `VITE_SUPABASE_URL` is not a
  bare `https://` origin (a copied `/rest/v1/` path makes every query fail
  silently). Keep both checks. The service-role key never belongs in this repo.
- The site reads only the `public_*` views (`public_developers`,
  `public_projects`, `public_skills`, `public_experience`, `public_education`,
  `public_certificates`, `public_testimonials`, `public_posts`) and inserts
  into `page_views`. These are an **external contract owned by the tlasara
  repo** (`supabase/migrations/`, documented in `docs/public-api.md`). Never
  change the database from here, and never query a table directly.
- All Supabase access goes through `src/lib/content.js` (getters keep their
  names and return shapes) and `src/lib/supabase.js`. Any failure or timeout
  must fall back to `src/data/` and log nothing sensitive.
- Post content is Markdown, rendered with raw HTML off (`skipHtml`).
