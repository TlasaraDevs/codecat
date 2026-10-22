import { Link, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { getPostBySlug } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { useContent } from "@/hooks/useContent";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { NotFound } from "./NotFound";

// Renders plain-text post content: blank lines split paragraphs and lines
// starting with "## " become subheadings. Output is text, never raw HTML.
const PostBody = ({ content }) =>
  content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block, i) =>
      block.startsWith("## ") ? (
        <h2 key={i} className="mt-10 font-display text-3xl text-paper">
          {block.slice(3)}
        </h2>
      ) : (
        <p key={i} className="mt-5 whitespace-pre-line">
          {block}
        </p>
      )
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
