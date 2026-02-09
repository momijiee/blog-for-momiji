import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MdxContent from "@/components/mdx-content";
import { getAllPosts, getPostBySlug, getCompiledPostBySlug} from "@/lib/posts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedNavLink } from "@/components/ui/animated-nav-link";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `https://momiji.dev/blog/${post.slug}`,
      images: post.image
        ? [{ url: post.image }]
        : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getCompiledPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <AnimatedNavLink
        href="/"
        className="mb-6 inline-block text-sm text-muted-foreground hover:underline"
      >
        ← Back to articles
      </AnimatedNavLink>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{post.createdAt}</p>
        </CardHeader>
        <CardContent>
          {post.image && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <MdxContent source={post.mdxSource} />
        </CardContent>
      </Card>
    </div>
  );
}
