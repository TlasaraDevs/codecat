import { Link } from "react-router-dom";
import { formatDate } from "@/lib/format";

export const PostCard = ({ post }) => (
  <article className="comic-panel group relative flex h-full flex-col p-6 shadow-comic-sm transition-shadow hover:shadow-comic">
    {post.published_at && (
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-bright">
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
      </p>
    )}
    <h3 className="mt-2 font-display text-3xl text-paper">
      {/* The stretched link makes the whole card clickable. */}
      <Link to={`/blog/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-red-bright">
        {post.title}
      </Link>
    </h3>
    {post.excerpt && <p className="mt-3 text-paper/80">{post.excerpt}</p>}
    {post.tags?.length > 0 && (
      <ul className="mt-auto flex flex-wrap gap-2 pt-5" aria-label="Tags">
        {post.tags.map((tag) => (
          <li key={tag} className="text-xs font-semibold uppercase tracking-wide text-muted">
            #{tag}
          </li>
        ))}
      </ul>
    )}
  </article>
);
