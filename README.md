# codecat: Wanjiru Mbuthia's portfolio

Personal developer portfolio for **codecat** (Wanjiru Mbuthia), served at
**https://codecat.tlasara.dev**. It lives inside the Tlasara repository but is a
completely separate app with its own `package.json`, so it never touches the
company site at the repo root.

Stack: React 19 · Vite 6 · Tailwind CSS 4 · Framer Motion · react-icons ·
React Router. Fonts (Bangers + Inter) are self-hosted via Fontsource.

## Run it locally

```bash
cd codecat
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

| Command           | What it does                                   |
| ----------------- | ---------------------------------------------- |
| `npm run build`   | Production build into `codecat/dist/`          |
| `npm run preview` | Serves the built `dist/` locally to check it   |
| `npm run lint`    | ESLint                                         |

No environment variables are needed today. `.env.example` lists the ones
Phase 2 (Supabase) will add; copy it to `.env`, which is git-ignored. Never commit `.env`.

## Editing content

All content lives in `src/data/`, one file per future database table:

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

**Blog posts:** `content` is plain text. Blank lines separate paragraphs and a
line starting with `## ` becomes a subheading. When you publish a post, also
add its URL to `public/sitemap.xml`.

### How the data layer works (and Phase 2)

Components never import `src/data/` directly. They call async getters in
`src/lib/content.js` (`getDeveloper()`, `getProjects()`, `getPosts()`, …)
through the `useContent()` hook. To move to Supabase, rewrite only the bodies
of those getters to query the matching tables and return the same shapes.
Nothing else changes.

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

1. In DirectAdmin, create the subdomain `codecat.tlasara.dev` and note its
   document root (typically `domains/tlasara.dev/public_html/codecat/` or
   `domains/codecat.tlasara.dev/public_html/`, depending on the panel setup).
2. Enable SSL for the subdomain (Let's Encrypt in DirectAdmin). Then you can
   uncomment the HTTPS redirect in `public/.htaccess`.
3. Run `npm run build` and upload the **contents** of `codecat/dist/` (including
   the hidden `.htaccess`) to that document root.

`public/.htaccess` (copied into `dist/`) serves `/blog/...` routes from
`index.html`, returns the comic 404 page with a real 404 status for unknown
URLs, and sets caching headers.

The site assumes it is served from the root of its domain (Vite `base: "/"`).
To host it under a sub-path instead, build with
`CODECAT_BASE=/sub/path/ npm run build`. Update the `RewriteRule` and
`ErrorDocument` paths in `.htaccess` to match.

### Automatic deploys (GitHub Actions)

`deploy/deploy-codecat.yml` is a **proposed** workflow. It is not active until
you copy it into `.github/workflows/`. It runs only when files under
`codecat/**` change on `main` (or when triggered manually), builds only
`codecat/`, and uploads `codecat/dist/` over FTPS. Add these repository
secrets (Settings → Secrets and variables → Actions):

| Secret                   | Value                                                                        |
| ------------------------ | ---------------------------------------------------------------------------- |
| `CODECAT_FTP_SERVER`     | FTP host, e.g. `ftp.tlasara.dev`                                              |
| `CODECAT_FTP_USERNAME`   | An FTP account for the subdomain (ideally one locked to its document root)   |
| `CODECAT_FTP_PASSWORD`   | That account's password                                                      |
| `CODECAT_FTP_SERVER_DIR` | Path to the document root as that account sees it, ending in `/` (e.g. `./`) |
