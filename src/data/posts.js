// Table: posts — the blog link and section only appear when at least one row
// for this developer has published: true.
//
// `content` is Markdown (blank lines separate paragraphs, "## " makes a
// subheading). Raw HTML in it is never rendered, so user-written content is
// safe here.
export const posts = [
  {
    id: 1,
    developer_slug: "codecat",
    slug: "hello-world",
    title: "Hello, world (from a cat)",
    excerpt: "Why I built a comic-book portfolio, and what's coming next.",
    content:
      "This is an example draft. Set published to true to make the blog appear.\n\n## What's next\n\nMore projects, more writing.",
    cover_url: "",
    tags: ["meta"],
    published: false,
    published_at: null,
  },
];
