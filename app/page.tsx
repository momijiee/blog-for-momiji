import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { AnimatedPostCard } from "@/components/ui/animated-post-card";
import { AnimatedAboutCard } from "@/components/ui/animated-about-card";

const FEATURED_SLUGS = [
  'after-the-halo-fades-1',
  'after-the-halo-fades-2',
  'after-the-halo-fades-3'
];

export default function Home() {
  // 尝试获取推荐文章，若不存在则回退到最新文章
  const featuredPosts = FEATURED_SLUGS
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => post !== undefined);

  const fallbackPosts = featuredPosts.length === 0
    ? getAllPosts().slice(0, 2)
    : featuredPosts;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">About Me</h1>
      <AnimatedAboutCard />
      <br/>
      <br/>
      <h1 className="mb-8 text-2xl font-semibold">推荐阅读</h1>
      {fallbackPosts.length > 0 ? (
        <div className="flex flex-col gap-4">
          {fallbackPosts.map((post) => (
            <AnimatedPostCard key={post.slug}>{post}</AnimatedPostCard>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">暂无文章，敬请期待。</p>
      )}
    </div>
  );
}
