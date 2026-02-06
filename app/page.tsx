import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/posts";
import Image from "next/image";
import Link from "next/link";

function getPreviewText(content: string) {
  return content
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/\[[^\]]*\]\([^)]+\)/g, (m) => m.replace(/\[|\]|\([^)]+\)/g, "")) // links -> text
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline code
    .replace(/[*_~>-]+/g, "") // common markdown tokens
    .replace(/\n+/g, " ")
    .trim();
}

export default function Home() {
  const posts = getAllPosts();
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Articles</h1>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/blog/${post.slug}`}>
              <Card className="overflow-hidden transition-colors hover:bg-muted/50">
                {post.image && (
                  <div className="relative aspect-[2/1] w-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {getPreviewText(post.content)}
                  </p>
                  <p className="mt-2 text-right text-xs text-muted-foreground">
                    {post.createdAt}
                  </p>
                </CardContent>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
