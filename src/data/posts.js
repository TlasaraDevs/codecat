// Table: posts — the blog link and section only appear when at least one row
// for this developer has published: true.
//
// `content` is plain text: blank lines separate paragraphs, and a line
// starting with "## " becomes a subheading. It is rendered as text (never as
// HTML), so it is safe to store user-written content here.
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
