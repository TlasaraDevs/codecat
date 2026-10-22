import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import { getPosts } from "@/lib/content";
import { useContent } from "@/hooks/useContent";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";

const LATEST_COUNT = 3;

// Only renders once there is at least one published post.
export const Blog = () => {
  const { data: posts = [] } = useContent(getPosts);
  if (posts.length === 0) return null;

  return (
    <section id="blog" aria-labelledby="blog-title" className="bg-coal py-20 md:py-28">
      <div className="container-page">
        <SectionHeading id="blog-title" chapter="Bonus issue · Writing" title="From the blog" />
        <ul className="grid gap-8 md:grid-cols-3">
          {posts.slice(0, LATEST_COUNT).map((post, i) => (
            <Reveal as="li" key={post.id} delay={i * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
        {posts.length > LATEST_COUNT && (
          <Link to="/blog" className="btn btn-ghost mt-10">
            All posts <LuArrowRight aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
};
