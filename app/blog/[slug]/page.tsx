import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MdxContent from "@/components/mdx-content";
import { getAllPosts, getPostBySlug} from "@/lib/posts";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimatedNavLink } from "@/components/ui/animated-nav-link";
import { TableOfContents } from "@/components/ui/table-of-content"

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
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <AnimatedNavLink
            href="/"
            className="mb-6 inline-block text-sm text-muted-foreground hover:underline"
          >
          ← Back to articles
          </AnimatedNavLink>
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{post.createdAt}</p>
            </CardHeader>
            <CardContent>
              {post.image && (
                <div className="prose relative mb-6 aspect-video w-full overflow-hidden rounded-lg dark:prose-invert">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              <MdxContent source={post.content} />
            </CardContent>
          </Card>
        </div>
        <aside className="
          hidden 
          lg:block lg:col-span-1 
          sticky top-20 h-fit
          p-4 bg-white dark:bg-black rounded-xl shadow-sm border border-gray-100 dark:border-gray-800
        ">
          <TableOfContents headings={post.headings} />
        </aside>
      </div>
    </div>
  );
}
