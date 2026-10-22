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

The subdomain's document root is `public_html/codecat/`, a folder **inside**
the tlasara.dev site, and both sites deploy with the same FTP account
(`deploy@tlasara.dev`, whose FTP root is `public_html/`).

1. Enable SSL for the subdomain (Let's Encrypt in DirectAdmin). Then you can
   uncomment the HTTPS redirect in `public/.htaccess`.
2. Run `npm run build` and upload the **contents** of `codecat/dist/` (including
   the hidden `.htaccess`) to `codecat/` on the FTP account. Never upload it to
   the FTP root: that is tlasara.dev.

`public/.htaccess` (copied into `dist/`):

- 301-redirects any host other than `codecat.tlasara.dev` to it with the same
  path, so the copy at `tlasara.dev/codecat/…` is never served;
- serves `/blog/...` routes from `index.html`, returns the comic 404 page with
  a real 404 status for unknown URLs, and sets caching headers;
- blocks the FTP deploy's `.ftp-deploy-sync-state.json` file.

Because `codecat/` sits inside the main site, Apache also applies the main
site's `public_html/.htaccess` to it. Its rewrite rules don't apply (this
folder's own `RewriteEngine On` replaces them), but its other directives do.
See the warning at the top of the repo-root `public/.htaccess`.

The site assumes it is served from the root of its domain (Vite `base: "/"`).
To host it under a sub-path instead, build with
`CODECAT_BASE=/sub/path/ npm run build`. Update the `RewriteRule` and
`ErrorDocument` paths in `.htaccess` to match.

### Automatic deploys (GitHub Actions)

`.github/workflows/deploy-codecat.yml` (at the repo root) runs only when files under
`codecat/**` change on `main` (or when triggered manually), builds only
`codecat/`, and uploads `codecat/dist/` over FTPS to `./codecat/` on the
server. That folder is hard-coded in the workflow (not a secret) so a
mistake can't point it at the main site.

It reuses the tlasara.dev deploy's existing secrets (`FTP_SERVER`,
`FTP_USERNAME`, `FTP_PASSWORD`), so there is nothing new to add.

The two deploys can't interfere with each other:

- The action only uploads and deletes inside its `server-dir`, and only
  deletes files it uploaded earlier (tracked in a state file in that folder).
  The codecat deploy is confined to `./codecat/`.
- The tlasara.dev deploy excludes `codecat/**` from uploads and deletes, and
  fails before uploading if its build contains a `codecat/` folder.
- Neither uses `dangerous-clean-slate`, which would empty the folder first.
