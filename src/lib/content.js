// Data-access layer. Components only ever import from here, never from
// src/data/ or Supabase directly.
//
// Every getter reads Supabase first (the public_* views, scoped to
// DEVELOPER_SLUG) and maps the rows to the shapes the components use. If
// Supabase isn't configured, fails or is too slow, it returns the same shape
// from the local files in src/data/, so the site always renders.
//
// Every getter is async (like a real API) and returns plain objects.

import { DEVELOPER_SLUG, ORGANIZATION } from "@/config";
import { query } from "@/lib/supabase";
import { developers } from "@/data/developers";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { certificates } from "@/data/certificates";
import { testimonials } from "@/data/testimonials";
import { posts } from "@/data/posts";

// Several components ask for the same data (e.g. the navbar and the blog
// section both need posts). Cache each query so it only runs once.
const cache = new Map();
const cached = (key, query) => {
  if (!cache.has(key)) {
    const promise = Promise.resolve().then(query);
    promise.catch(() => cache.delete(key));
    cache.set(key, promise);
  }
  return cache.get(key);
};

// Supabase first, local files if that fails. Says why only in development,
// and never logs the error itself (it can include request details).
let warned = false;
const remoteOrLocal = async (remote, local) => {
  try {
    return await remote();
  } catch {
    if (import.meta.env.DEV && !warned) {
      warned = true;
      console.warn("Supabase unavailable; showing the local content in src/data/.");
    }
    return local();
  }
};

const bySortOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

// The components expect "" (not null) for missing optional text.
const text = (value) => value ?? "";

// "2026-10-22T09:30:00+00:00" → "2026-10-22" (what formatDate expects).
const toDay = (value) => (value ? String(value).slice(0, 10) : null);

// Paths under public/ need the deploy base prefixed; full URLs pass through.
export const resolveAsset = (path) => {
  if (!path) return null;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
};

export const getDeveloper = (slug = DEVELOPER_SLUG) =>
  cached(`developer:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const row = await query((db) =>
          db
            .from("public_developers")
            .select(
              "slug, name, handle, title, roles, tagline, bio, interests, location, photo_url, public_email, github_url, linkedin_url, cv_url"
            )
            .eq("slug", slug)
            .maybeSingle()
        );
        if (!row) return null;
        const { public_email, github_url, linkedin_url, ...rest } = row;
        return {
          ...rest,
          title: text(rest.title),
          tagline: text(rest.tagline),
          location: text(rest.location),
          email: text(public_email),
          links: { github: text(github_url), linkedin: text(linkedin_url) },
          organization: ORGANIZATION,
          photo_url: resolveAsset(rest.photo_url),
        };
      },
      () => {
        const developer = developers.find((d) => d.slug === slug);
        if (!developer) return null;
        return {
          ...developer,
          organization: ORGANIZATION,
          photo_url: resolveAsset(developer.photo_url),
        };
      }
    )
  );

export const getProjects = (slug = DEVELOPER_SLUG) =>
  cached(`projects:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const rows = await query((db) =>
          db
            .from("public_projects")
            .select(
              "id, slug, title, summary, description, tech, screenshot_urls, github_url, live_url, status, featured, sort_order, contributors"
            )
            // A JSON string: an array here would be sent as a Postgres array.
            .contains("contributors", JSON.stringify([{ slug }]))
            .order("sort_order")
        );
        return rows.map(({ screenshot_urls, contributors, ...p }) => ({
          ...p,
          summary: text(p.summary),
          description: text(p.description),
          screenshot_url: resolveAsset(screenshot_urls?.[0]),
          github_url: text(p.github_url),
          live_url: text(p.live_url),
          developer_slugs: contributors.map((c) => c.slug),
        }));
      },
      () =>
        projects
          .filter((p) => p.developer_slugs?.includes(slug))
          .sort(bySortOrder)
          .map((p) => ({ ...p, screenshot_url: resolveAsset(p.screenshot_url) }))
    )
  );

export const getSkills = (slug = DEVELOPER_SLUG) =>
  cached(`skills:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const rows = await query((db) =>
          db
            .from("public_skills")
            .select("id, developer_slug, name, category, icon, sort_order")
            .eq("developer_slug", slug)
            .order("sort_order")
        );
        return rows.map((s) => ({ ...s, category: text(s.category), icon: text(s.icon) }));
      },
      () => skills.filter((s) => s.developer_slug === slug).sort(bySortOrder)
    )
  );

export const getExperience = (slug = DEVELOPER_SLUG) =>
  cached(`experience:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const rows = await query((db) =>
          db
            .from("public_experience")
            .select(
              "id, developer_slug, organization, location, role, department, start_date, end_date, highlights, sort_order"
            )
            .eq("developer_slug", slug)
            .order("sort_order")
        );
        return rows.map((e) => ({ ...e, location: text(e.location), department: text(e.department) }));
      },
      () => experience.filter((e) => e.developer_slug === slug).sort(bySortOrder)
    )
  );

export const getEducation = (slug = DEVELOPER_SLUG) =>
  cached(`education:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const rows = await query((db) =>
          db
            .from("public_education")
            .select(
              "id, developer_slug, institution, location, qualification, status, start_date, end_date, sort_order"
            )
            .eq("developer_slug", slug)
            .order("sort_order")
        );
        return rows.map((e) => ({ ...e, location: text(e.location) }));
      },
      () => education.filter((e) => e.developer_slug === slug).sort(bySortOrder)
    )
  );

export const getCertificates = (slug = DEVELOPER_SLUG) =>
  cached(`certificates:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const rows = await query((db) =>
          db
            .from("public_certificates")
            .select(
              "id, developer_slug, title, issuer, description, skills, issued_date, credential_url, sort_order"
            )
            .eq("developer_slug", slug)
            .order("sort_order")
        );
        return rows.map((c) => ({
          ...c,
          issuer: text(c.issuer),
          description: text(c.description),
          credential_url: text(c.credential_url),
        }));
      },
      () => certificates.filter((c) => c.developer_slug === slug).sort(bySortOrder)
    )
  );

// Approved testimonials only (the view never returns others).
export const getTestimonials = (slug = DEVELOPER_SLUG) =>
  cached(`testimonials:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const rows = await query((db) =>
          db
            .from("public_testimonials")
            .select("id, developer_slug, author_name, author_role, author_company, quote, avatar_url, sort_order")
            .eq("developer_slug", slug)
            .order("sort_order")
        );
        return rows.map((t) => ({
          ...t,
          author_role: text(t.author_role),
          author_company: text(t.author_company),
          avatar_url: resolveAsset(t.avatar_url),
          published: true,
        }));
      },
      () =>
        testimonials
          .filter((t) => t.developer_slug === slug && t.published)
          .sort(bySortOrder)
          .map((t) => ({ ...t, avatar_url: resolveAsset(t.avatar_url) }))
    )
  );

// Published posts only, newest first.
export const getPosts = (slug = DEVELOPER_SLUG) =>
  cached(`posts:${slug}`, () =>
    remoteOrLocal(
      async () => {
        const rows = await query((db) =>
          db
            .from("public_posts")
            .select("id, developer_slug, slug, title, excerpt, content, cover_url, tags, published_at")
            .eq("developer_slug", slug)
            .order("published_at", { ascending: false })
        );
        return rows.map((p) => ({
          ...p,
          excerpt: text(p.excerpt),
          cover_url: resolveAsset(p.cover_url),
          published: true,
          published_at: toDay(p.published_at),
        }));
      },
      () =>
        posts
          .filter((p) => p.developer_slug === slug && p.published)
          .sort((a, b) =>
            String(b.published_at ?? "").localeCompare(String(a.published_at ?? ""))
          )
          .map((p) => ({ ...p, cover_url: resolveAsset(p.cover_url) }))
    )
  );

export const getPostBySlug = (postSlug, slug = DEVELOPER_SLUG) =>
  getPosts(slug).then((list) => list.find((p) => p.slug === postSlug) ?? null);
