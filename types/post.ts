export type Post = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  createdAt: string;
  /** Optional path to post image (e.g. "/images/blog-hero.png") */
  image?: string;
}