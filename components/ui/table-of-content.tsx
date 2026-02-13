import { Heading } from "@/types/post";


interface TableOfContentsProps {
    headings: Heading[];
  }

export function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
        文章大纲
      </h3>
      <nav className="space-y-2 text-sm">
      {headings.map((h) => (
        <a
          key={h.text}
          href={`#${h.slug}`}
          className={`block hover:text-foreground ${
            h.depth === 2 ? "ml-0 font-medium" : "ml-4"
          }`}
        >
          {h.text}
        </a>
      ))}
      </nav>  
    </div>
  );
}

