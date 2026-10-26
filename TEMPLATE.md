# Using codecat as a portfolio template

Every Tlasara developer portfolio is a copy of this app. The content comes from
the shared Supabase project, so a new site needs no content files of its own:
set `VITE_DEVELOPER_SLUG` to the developer's slug and it fills itself from the
database (profile, projects they're linked to, skills, experience, education,
certificates, approved testimonials and published posts).

Below, `<slug>` is the developer's slug, e.g. `nyota`.

## 1. Add the developer in the database

An admin does this in the dashboard (Developers → Invite). Until the dashboard
exists, in the Supabase SQL editor:

```sql
insert into public.developers (slug, name, handle, email, portfolio_url)
values ('<slug>', 'Full Name', '<handle>', 'them@example.com', 'https://<slug>.tlasara.dev');
```

- New developers start **active but unlisted**: they can sign in and fill in
  their content, but nothing is public yet. Their site shows an empty page
  until an admin sets `is_listed = true`.
- `portfolio_url` must be the real address: page views are accepted only from
  `tlasara.dev` and the hosts of listed developers' `portfolio_url`s.

## 2. Copy the app

In this repo, copy the folder without its build output and dependencies:

```bash
rsync -a --exclude node_modules --exclude dist codecat/ <slug>/
```

(In another repo, copy the same files to that repo's root or a subfolder.)
Then change `"name"` in `<slug>/package.json`.

## 3. Make it theirs

| What | Where |
| --- | --- |
| Default slug, site name, site URL | `src/config.js` (`DEVELOPER_SLUG` fallback, `SITE_NAME`, `SITE_URL`) |
| Page title, description, canonical, Open Graph and Twitter tags, `<noscript>` text | `index.html` |
| Favicons, link-preview image | `public/favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` |
| Host name in the redirects (3 places) | `public/.htaccess` |
| Domain | `public/robots.txt`, `public/sitemap.xml` |
| Logo | `src/components/layout/Logo.jsx`, `src/components/ui/CatMark.jsx` (the codecaT_ wordmark) |
| Look and feel | `src/index.css` (colours, fonts, comic panels) and the section components |
| Offline fallback content | `src/data/*.js` (see below) |

**Offline fallback.** When Supabase can't be reached (free projects pause when
idle), the site shows `src/data/`. Replace those files with the developer's
own content, or at least their `developers.js` row, and delete codecat's rows.
Otherwise the fallback shows an empty page.

## 4. Environment

Copy `.env.example` to `.env` (never commit it) for local development:

```bash
VITE_SUPABASE_URL=https://<project-ref>.supabase.co   # same for every site
VITE_SUPABASE_ANON_KEY=sb_publishable_…              # same for every site
VITE_DEVELOPER_SLUG=<slug>
```

Only the **publishable** (or legacy anon) key ever goes here. The build stops
if it is given a secret or service-role key.

## 5. Deploy (same repo, same FTP account)

1. **DirectAdmin:** create the subdomain `<slug>.tlasara.dev` with document
   root `public_html/<slug>/`, then enable its SSL certificate.
2. **Workflow:** copy `.github/workflows/deploy-codecat.yml` to
   `deploy-<slug>.yml` and replace every `codecat` with `<slug>`:
   the name, `paths`, `concurrency.group`, `working-directory`,
   `cache-dependency-path`, `local-dir`, `server-dir: ./<slug>/` and
   `VITE_DEVELOPER_SLUG`. Keep `server-dir` hard-coded.
3. **Protect it from the tlasara.dev deploy** in `.github/workflows/deploy.yml`:
   add `"<slug>/**"` to `paths-ignore`, add `<slug>` and `<slug>/**` to
   `exclude`, and copy the "Check build does not touch codecat/" step for
   `dist/<slug>`. Without this the main site's deploy could overwrite the
   portfolio.
4. The GitHub secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are
   shared; nothing new to add.

In **another repo**, the same rules apply: hard-coded `server-dir: ./<slug>/`,
and the tlasara.dev deploy must exclude `<slug>/`. That repo needs its own
copies of the `FTP_*` and `VITE_SUPABASE_*` secrets.

## 6. Check

- Without `.env`: `npm run dev` shows the local fallback content.
- With `.env`: it shows the database content for `<slug>`.
- After the first deploy, open the site, then check the dashboard's analytics
  (or `page_views` in Supabase) for a view from `<slug>.tlasara.dev`.
