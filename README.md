# codecat: Wanjiru Mbuthia's portfolio

Personal developer portfolio for **codecat** (Wanjiru Mbuthia), served at
**https://codecat.tlasara.dev**. Its content comes from the shared Tlasara
Supabase project, whose schema and `public_*` views are maintained in the
[Mbuthia09/tlasara](https://github.com/Mbuthia09/tlasara) repository.

Stack: React 19 · Vite 6 · Tailwind CSS 4 · Framer Motion · react-icons ·
React Router · Supabase (content) · react-markdown (posts). Fonts (Bangers +
Inter) are self-hosted via Fontsource.

Other Tlasara developers start their portfolio from this repository. The
step-by-step guide lives with the database, in Mbuthia09/tlasara
(`docs/new-developer-portfolio.md`).

## Run it locally

Node 24 (see `.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run build`   | Production build into `dist/`                  |
| `npm run preview` | Serves the built `dist/` locally to check it   |
| `npm run lint`    | ESLint                                         |

Environment variables (all optional; copy `.env.example` to `.env`, which is
git-ignored, and never commit it):

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | The shared Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Its **publishable** key (never a secret or service-role key; the build refuses one) |
| `VITE_DEVELOPER_SLUG` | `codecat` (the default) |

Without the Supabase values the site shows the local content in `src/data/`.

## Editing content

Content lives in the shared Supabase database and is edited in the admin
dashboard. `src/data/` holds a copy that the site shows when Supabase is not
configured or can't be reached (free projects pause when idle), one file per
table. Keep it roughly in step with the database:

| File              | Table          | Notes                                                       |
| ----------------- | -------------- | ----------------------------------------------------------- |
| `developers.js`   | `developers`   | Name, bio, photo, links. Empty link = "coming soon" icon.  |
| `projects.js`     | `projects`     | Shown only if `developer_slugs` includes `"codecat"`.       |
| `skills.js`       | `skills`       | `icon` keys map to icons in `components/ui/SkillIcon.jsx`.  |
| `experience.js`   | `experience`   | Dates are `"YYYY-MM"`; `end_date: null` = present.          |
| `education.js`    | `education`    |                                                             |
| `certificates.js` | `certificates` |                                                             |
| `testimonials.js` | `testimonials` | Section appears once a row has `published: true`.          |
| `posts.js`        | `posts`        | Blog link/section appear once a post has `published: true`. |

**Add a project:** copy a row in `projects.js` and change `id`, `slug`,
`sort_order` and the text. `status` is one of `shipped`, `in_progress`,
`planned` or `archived`. Leave `screenshot_url`, `github_url` or `live_url` empty
and the card shows a placeholder panel or hides that button.

**Images:** put files in `public/images/` and reference them as
`/images/name.jpg`. The profile photo goes at `public/images/profile.jpg`
(a portrait around 640×800 works best). Until it exists, the hero shows a
"Photo coming soon…" panel.

**Blog posts:** `content` is Markdown. Raw HTML in it is never rendered and
`javascript:` links are removed. When you publish a post, also add its URL to
`public/sitemap.xml`.

### How the data layer works

Components never import `src/data/` or Supabase directly. They call async
getters in `src/lib/content.js` (`getDeveloper()`, `getProjects()`,
`getPosts()`, …) through the `useContent()` hook. Each getter reads the
matching `public_*` view in Supabase (only published, approved or listed rows,
without private columns), maps it to the shape the components use, and falls
back to `src/data/` if Supabase is unconfigured, fails or takes over 4
seconds. After one failure the rest of the visit uses local content straight
away. Nothing sensitive is logged; in development a single warning says the
fallback is in use.

### Page views

`src/lib/analytics.js` records one page view per page load, after the page
has rendered: host name, path (no query string), developer slug and the
referring site's host name. No cookies, IDs or IP addresses. It skips
development builds, bots and automated browsers, and visitors with Do Not
Track or Global Privacy Control on.

### "Work with me" links

The portfolio has no contact form of its own. `src/lib/contact.js` builds a
link to the company form:

```
https://tlasara.dev/contact?developer=codecat&message=<url-encoded message>
```

`buildWorkWithMeUrl(developer)` works for any developer record, so other
Tlasara portfolios can reuse it. The base URL is `CONTACT_FORM_URL` in
`src/config.js`.

## Deploying (Host Africa / DirectAdmin)

The build is fully static, so no Node server is needed on the host.

On the server, the subdomain's document root is `public_html/codecat/`, a
folder **inside** the tlasara.dev site's `public_html/`. Both sites deploy with
the same FTP account (`deploy@tlasara.dev`, whose FTP root is `public_html/`),
so this site must only ever be uploaded to `codecat/` on that account.

1. Enable SSL for the subdomain (Let's Encrypt in DirectAdmin). Then you can
   uncomment the HTTPS redirect in `public/.htaccess`.
2. Run `npm run build` and upload the **contents** of `dist/` (including the
   hidden `.htaccess`) to `codecat/` on the FTP account. Never upload it to the
   FTP root: that is tlasara.dev.

`public/.htaccess` (copied into `dist/`):

- 301-redirects any host other than `codecat.tlasara.dev` to it with the same
  path, so the copy at `tlasara.dev/codecat/…` is never served;
- serves `/blog/...` routes from `index.html`, returns the comic 404 page with
  a real 404 status for unknown URLs, and sets caching headers;
- blocks the FTP deploy's `.ftp-deploy-sync-state.json` file.

Because `codecat/` sits inside tlasara.dev's folder on the server, Apache also
applies tlasara.dev's `public_html/.htaccess` to it. Its rewrite rules don't
apply (this site's own `RewriteEngine On` replaces them), but its other
directives do. See the warning at the top of `public/.htaccess` in the
tlasara repository.

The site assumes it is served from the root of its domain (Vite `base: "/"`).
To host it under a sub-path instead, build with
`CODECAT_BASE=/sub/path/ npm run build`. Update the `RewriteRule` and
`ErrorDocument` paths in `.htaccess` to match.

### Automatic deploys (GitHub Actions)

`.github/workflows/deploy.yml` runs on every push to `main` (or when triggered
manually): it installs, lints, builds, checks the build output and uploads
`dist/` over FTPS to `./codecat/` on the server. That folder is hard-coded in
the workflow (not a secret) so a mistake can't point it at tlasara.dev.

Every run **waits for approval**: the job uses the `production` environment
(Settings → Environments), whose required reviewer is Mbuthia09 and which
only allows the `main` branch. Approve it from the run's page ("Review
deployments"). The whole job, including lint and build, starts only after
approval; a newer push cancels a run that is still waiting.

The job also only runs in `TlasaraDevs/codecat` itself. A portfolio created
from this repository must change that check together with `server-dir`.

Secrets of the `production` environment (not repository secrets):

| Secret | Value |
| --- | --- |
| `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD` | The shared `deploy@tlasara.dev` FTP account |
| `VITE_SUPABASE_URL` | The Supabase project URL, `https://<project-ref>.supabase.co` (no path) |
| `VITE_SUPABASE_ANON_KEY` | The **publishable** key |

`VITE_DEVELOPER_SLUG` is set in the workflow itself. If the Supabase secrets
are missing, the run warns and the site shows its local content. The build
fails if the key is a secret or service-role key, or if the URL has a path.

This deploy and the tlasara.dev deploy can't interfere with each other:

- The action only uploads and deletes inside its `server-dir`, and only
  deletes files it uploaded earlier (tracked in
  `codecat/.ftp-deploy-sync-state.json` on the server). This deploy is
  confined to `./codecat/`.
- The tlasara.dev deploy excludes `codecat/**` from uploads and deletes, and
  fails before uploading if its build contains a `codecat/` folder.
- Neither uses `dangerous-clean-slate`, which would empty the folder first.
