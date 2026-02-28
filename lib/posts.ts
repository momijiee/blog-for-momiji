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

// 缓存机制
const postCache = new Map<string, PostWithHeadings>();
let allPostsCache: BasePost[] | null = null;

/**
 * 提取文章中的标题并生成slug
 */
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

/**
 * 格式化创建日期
 */
function formatCreatedAt(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "string") return value;
  return "";
}

/**
 * 读取并解析文章数据
 */
function getPostData(filePath: string): { data: matter.GrayMatterFile<string>['data'], content: string } | null {
  if (!fs.existsSync(filePath)) return null;
  
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  
  return {
    data,
    content: content.trim()
  };
}

/**
 * 获取所有博客文章用于列表展示
 * 使用缓存提高性能
 */
export function getAllPosts(): BasePost[] {
  // 如果缓存中有数据，直接返回
  if (allPostsCache) {
    return allPostsCache;
  }

  if (!fs.existsSync(postsDir)) return [];

  const files = fs.readdirSync(postsDir);
  const mdxFiles = files.filter((f) => path.extname(f) === ".mdx");

  const posts = mdxFiles
    .map((file) => {
      const slug = path.basename(file, ".mdx");
      const filePath = path.join(postsDir, file);
      
      const postData = getPostData(filePath);
      if (!postData) return null;
      
      const { data, content } = postData;

      const post: BasePost = {
        id: slug,
        slug,
        title: (data.title as string) ?? slug,
        description: data.description as string | undefined,
        content: content,
        createdAt: formatCreatedAt(data.createdAt),
        image: data.image as string | undefined,
      };
      
      return post;
    })
    .filter((post): post is BasePost => post !== null);
    
  const sortedPosts = posts.sort((a, b) =>
    String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
  );
  
  // 存入缓存
  //allPostsCache = sortedPosts;
  
  return sortedPosts;
}

/**
 * 根据slug获取单篇博客文章（包含标题信息）
 * 使用缓存提高性能
 */
export function getPostBySlug(slug: string): PostWithHeadings | undefined {
  // 如果缓存中有数据，直接返回
  if (postCache.has(slug)) {
    return postCache.get(slug);
  }
  
  const filePath = path.join(postsDir, `${slug}.mdx`);
  
  const postData = getPostData(filePath);
  if (!postData) return undefined;
  
  const { data, content } = postData;
  const headings = extractHeadings(content);
  
  const post: PostWithHeadings = {
    id: slug,
    slug,
    title: (data.title as string) ?? slug,
    description: data.description as string | undefined,
    content: content,
    createdAt: formatCreatedAt(data.createdAt),
    image: data.image as string | undefined,
    headings: headings,
  };
  
  // 存入缓存
  //postCache.set(slug, post);
  
  return post;
}

/**
 * 清除缓存
 * 在开发环境或内容更新时调用
 */
export function clearPostCache(): void {
  postCache.clear();
  allPostsCache = null;
}
