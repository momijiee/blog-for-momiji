export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  /** Optional path to post image (e.g. "/images/blog-hero.png") */
  image?: string;
}