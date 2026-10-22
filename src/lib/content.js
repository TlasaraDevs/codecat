// Data-access layer. Components only ever import from here, never from
// src/data/ directly. In Phase 2 these functions will query Supabase instead
// of the local files — keep the names, arguments and return shapes the same
// and nothing else needs to change.
//
// Every getter is async (like a real API) and returns plain objects.

import { DEVELOPER_SLUG } from "@/config";
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

const bySortOrder = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0);

// Paths under public/ need the deploy base prefixed; full URLs pass through.
export const resolveAsset = (path) => {
  if (!path) return null;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
};

export const getDeveloper = (slug = DEVELOPER_SLUG) =>
  cached(`developer:${slug}`, () => {
    const developer = developers.find((d) => d.slug === slug);
    if (!developer) return null;
    return { ...developer, photo_url: resolveAsset(developer.photo_url) };
  });

export const getProjects = (slug = DEVELOPER_SLUG) =>
  cached(`projects:${slug}`, () =>
    projects
      .filter((p) => p.developer_slugs?.includes(slug))
      .sort(bySortOrder)
      .map((p) => ({ ...p, screenshot_url: resolveAsset(p.screenshot_url) }))
  );

export const getSkills = (slug = DEVELOPER_SLUG) =>
  cached(`skills:${slug}`, () =>
    skills.filter((s) => s.developer_slug === slug).sort(bySortOrder)
  );

export const getExperience = (slug = DEVELOPER_SLUG) =>
  cached(`experience:${slug}`, () =>
    experience.filter((e) => e.developer_slug === slug).sort(bySortOrder)
  );

export const getEducation = (slug = DEVELOPER_SLUG) =>
  cached(`education:${slug}`, () =>
    education.filter((e) => e.developer_slug === slug).sort(bySortOrder)
  );

export const getCertificates = (slug = DEVELOPER_SLUG) =>
  cached(`certificates:${slug}`, () =>
    certificates.filter((c) => c.developer_slug === slug).sort(bySortOrder)
  );

export const getTestimonials = (slug = DEVELOPER_SLUG) =>
  cached(`testimonials:${slug}`, () =>
    testimonials
      .filter((t) => t.developer_slug === slug && t.published)
      .sort(bySortOrder)
      .map((t) => ({ ...t, avatar_url: resolveAsset(t.avatar_url) }))
  );

// Published posts only, newest first.
export const getPosts = (slug = DEVELOPER_SLUG) =>
  cached(`posts:${slug}`, () =>
    posts
      .filter((p) => p.developer_slug === slug && p.published)
      .sort((a, b) =>
        String(b.published_at ?? "").localeCompare(String(a.published_at ?? ""))
      )
      .map((p) => ({ ...p, cover_url: resolveAsset(p.cover_url) }))
  );

export const getPostBySlug = (postSlug, slug = DEVELOPER_SLUG) =>
  getPosts(slug).then((list) => list.find((p) => p.slug === postSlug) ?? null);
