import { getPosts } from "@/lib/content";
import { useContent } from "@/hooks/useContent";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PostCard } from "@/components/ui/PostCard";
import { NotFound } from "./NotFound";

export const BlogIndex = () => {
  const { data: posts, loading } = useContent(getPosts);
  useDocumentTitle("Blog");

  if (loading) return null;
  if (!posts?.length) return <NotFound />;

  return (
    <section aria-labelledby="blog-index-title" className="container-page py-16 md:py-24">
      <SectionHeading id="blog-index-title" chapter="The collected issues" title="Blog" />
      <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.id}>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
};
