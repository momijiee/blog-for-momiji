import { BasePost, PostWithHeadings } from "@/types/post";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import GithubSlugger from 'github-slugger';
import { toString } from "mdast-util-to-string";

const postsDir = path.join(process.cwd(), "content", "posts");

export function extractHeadings(content: string) {
  const slugger = new GithubSlugger();
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .parse(content);

  const headings: { depth: number; text: string; slug: string }[] = [];

  visit(tree, "heading", (node: any) => {
    const text = toString(node);
    const slug = slugger.slug(text);

    headings.push({
      depth: node.depth,
      text,
      slug,
    });
  });

  return headings;
}

function formatCreatedAt(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

export function getAllPosts(): BasePost[] {
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
        description: data.description as string | undefined,
        content: content.trim(),
        createdAt: formatCreatedAt(data.createdAt),
        image: data.image as string | undefined,
      } satisfies BasePost;
    })
    .sort((a, b) =>
      String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
    );
}

export function getPostBySlug(slug: string): PostWithHeadings | undefined {
  const filePath = path.join(postsDir, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return undefined;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const contentTrim = content.trim()
  const headings = extractHeadings(contentTrim);
  

  return {
    id: slug,
    slug,
    title: (data.title as string) ?? slug,
    description: data.description as string | undefined,
    content: contentTrim,
    createdAt: formatCreatedAt(data.createdAt),
    image: data.image as string | undefined,
    headings: headings,
  };
}
