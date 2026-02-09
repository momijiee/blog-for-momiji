import { Post } from "@/types/post";
import fs from "fs";
import matter from "gray-matter";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";

const postsDir = path.join(process.cwd(), "content", "posts");

function formatCreatedAt(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

export type CompiledPost = Post & {
  mdxSource: MDXRemoteSerializeResult;
};

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir);
  const mdxFiles = files.filter((f) => path.extname(f) === ".mdx");

  return mdxFiles
    .map((file) => {
      const slug = path.basename(file, ".mdx");
      const filePath = path.join(postsDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        id: slug,
        slug,
        title: (data.title as string) ?? slug,
        content: content.trim(),
        createdAt: formatCreatedAt(data.createdAt),
        image: data.image as string | undefined,
      } satisfies Post;
    })
    .sort((a, b) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
    );
}

export function getPostBySlug(slug: string): Post | undefined {
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    id: slug,
    slug,
    title: (data.title as string) ?? slug,
    description: data.description as string | undefined,
    content: content.trim(),
    createdAt: formatCreatedAt(data.createdAt),
    image: data.image as string | undefined,
  };
}

export async function getCompiledPostBySlug(
  slug: string
): Promise<CompiledPost | undefined> {
  const post = getPostBySlug(slug);
  if (!post) return undefined;

  const mdxSource = await serialize(post.content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
      format: "mdx",
    },
  });

  return { ...post, mdxSource };
}
