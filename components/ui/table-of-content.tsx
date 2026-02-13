import slugify from "slugify";
import { Heading } from "@/types/post";


interface TableOfContentsProps {
    headings: Heading[];
  }

export function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <nav className="space-y-2 text-sm">
    {headings.map((h) => (
      <a
        key={h.text}
        href={`#${h.slug}`}
        className={`block hover:text-foreground ${
          h.depth === 2 ? "ml-0" : "ml-4"
        }`}
      >
        {h.text}
      </a>
    ))}
    </nav>  
  );
}

