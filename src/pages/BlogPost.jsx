import { Link, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import Markdown from "react-markdown";
import { getPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { useContent } from "@/hooks/useContent";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { NotFound } from "./NotFound";

// Post content is Markdown. Raw HTML in it is dropped (skipHtml) and unsafe
// link targets such as javascript: are removed (react-markdown's default
// urlTransform), so it is safe to render user-written posts.
const external = (href = "") => /^https?:\/\//.test(href);

const MARKDOWN_COMPONENTS = {
  // The post title is the page's only h1.
  h1: ({ children }) => <h2 className="mt-10 font-display text-3xl text-paper">{children}</h2>,
  h2: ({ children }) => <h2 className="mt-10 font-display text-3xl text-paper">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 text-xl font-bold text-paper">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-6 font-bold text-paper">{children}</h4>,
  p: ({ children }) => <p className="mt-5">{children}</p>,
  ul: ({ children }) => <ul className="mt-5 list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mt-5 list-decimal space-y-2 pl-6">{children}</ol>,
  blockquote: ({ children }) => (
    <blockquote className="mt-5 border-l-4 border-red pl-4 italic text-paper/80">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-semibold text-red-bright underline underline-offset-4"
      {...(external(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  ),
  code: ({ children }) => <code className="border border-edge bg-ink px-1.5 py-0.5 text-[0.9em]">{children}</code>,
  pre: ({ children }) => (
    <pre className="comic-panel mt-5 overflow-x-auto p-4 text-sm [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0">
      {children}
    </pre>
  ),
  img: ({ src, alt }) => <img src={src} alt={alt ?? ""} loading="lazy" className="comic-panel mt-5 w-full" />,
  hr: () => <hr className="my-10 border-edge" />,
};

const PostBody = ({ content }) => (
  <Markdown skipHtml components={MARKDOWN_COMPONENTS}>
    {content}
  </Markdown>
);

export const BlogPost = () => {
  const { slug } = useParams();
  const { data: post, loading } = useContent(getPostBySlug, slug);
  useDocumentTitle(post?.title);

  if (loading) return null;
  if (!post) return <NotFound />;

  return (
    <article className="container-page max-w-3xl py-16 md:py-24">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-red-bright hover:underline">
        <LuArrowLeft aria-hidden="true" /> All posts
      </Link>
      <header className="mt-6">
        {post.published_at && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-bright">
            <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          </p>
        )}
        <h1 className="mt-2 font-display text-5xl leading-tight text-paper md:text-6xl">{post.title}</h1>
        {post.excerpt && <p className="comic-caption mt-6 inline-block px-4 py-2 font-medium">{post.excerpt}</p>}
      </header>
      {post.cover_url && (
        <img
          src={post.cover_url}
          alt=""
          loading="lazy"
          className="comic-panel mt-10 aspect-video w-full object-cover"
        />
      )}
      <div className="mt-8 text-lg leading-relaxed text-paper/90">
        <PostBody content={post.content ?? ""} />
      </div>
    </article>
  );
};
