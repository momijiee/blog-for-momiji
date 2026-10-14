import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';

const root = process.cwd();
const postsDir = path.resolve(process.argv[2] ?? path.join(root, 'content/posts'));
const publicDir = path.join(root, 'public');
const errors = [];
const slugs = new Set();

function fail(file, message) {
  errors.push(`${path.basename(file)}: ${message}`);
}

function nonempty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function checkImage(file, reference) {
  if (!nonempty(reference)) {
    fail(file, 'image path must be a nonempty string');
    return;
  }
  if (/^(https?:|data:|\/\/)/i.test(reference)) return;
  if (!reference.startsWith('/')) {
    fail(file, `local image must start with /: ${reference}`);
    return;
  }
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(reference, 'https://momiji.dev').pathname);
  } catch {
    fail(file, `invalid image URL: ${reference}`);
    return;
  }
  const target = path.resolve(publicDir, `.${pathname}`);
  if (!target.startsWith(publicDir + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) {
    fail(file, `local image does not exist in public/: ${reference}`);
  }
}

if (!fs.existsSync(postsDir)) {
  console.error(`Post directory does not exist: ${postsDir}`);
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter((name) => name.endsWith('.mdx')).sort();
if (files.length === 0) errors.push('No MDX posts found');

for (const name of files) {
  const file = path.join(postsDir, name);
  const filenameSlug = name.slice(0, -4);
  const source = fs.readFileSync(file, 'utf8');
  let parsed;
  try {
    parsed = matter(source);
  } catch (error) {
    fail(file, `invalid front matter: ${error.message}`);
    continue;
  }
  const { data, content } = parsed;
  const slug = data.slug ?? filenameSlug;
  if (typeof slug !== 'string' || !/^[a-z0-9][a-z0-9_-]{0,99}$/.test(slug)) {
    fail(file, 'slug must use 1–100 lowercase ASCII letters, digits, _ or -');
  } else {
    if (slug !== filenameSlug) fail(file, `slug must match filename (${filenameSlug})`);
    if (slugs.has(slug)) fail(file, `duplicate slug: ${slug}`);
    slugs.add(slug);
  }
  for (const field of ['title', 'description', 'category']) {
    if (!nonempty(data[field])) fail(file, `${field} is required`);
  }
  if (!Array.isArray(data.tags) || data.tags.length === 0 || !data.tags.every(nonempty)) {
    fail(file, 'tags must be a nonempty list of nonempty strings');
  }
  const frontMatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  const dateText = frontMatter.match(/^createdAt:\s*["']?(\d{4}-\d{2}-\d{2})["']?\s*$/m)?.[1];
  const date = dateText ? new Date(`${dateText}T00:00:00Z`) : null;
  if (!date || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== dateText) {
    fail(file, 'createdAt must be a real YYYY-MM-DD date');
  }
  if (data.image !== undefined) checkImage(file, data.image);
  if (!content.trim()) fail(file, 'article body is empty');

  try {
    const tree = unified().use(remarkParse).use(remarkMdx).parse(content);
    visit(tree, (node) => {
      if (node.type === 'image') checkImage(file, node.url);
      if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
          (node.name === 'Image' || node.name === 'img')) {
        const src = node.attributes?.find((attribute) => attribute.name === 'src');
        if (src && typeof src.value === 'string') checkImage(file, src.value);
      }
    });
  } catch (error) {
    fail(file, `invalid MDX: ${error.message}`);
  }
}

if (errors.length > 0) {
  console.error(`Post validation failed (${errors.length}):\n${errors.map((error) => `- ${error}`).join('\n')}`);
  process.exit(1);
}
console.log(`Validated ${files.length} MDX posts.`);
