export interface BasePost {
  id: string;
  slug: string;
  title: string;
  description?: string;
  content: string;
  createdAt: string;
  image?: string;
}

export interface PostWithHeadings extends BasePost {
  headings: Heading[];
}

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}
