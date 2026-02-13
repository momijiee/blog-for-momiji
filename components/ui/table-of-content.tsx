"use client";

import { Heading } from "@/types/post";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
  const handleScroll = () => {
    const headingElements = headings
      .map((h) => document.getElementById(h.slug))
      .filter(Boolean) as HTMLElement[];

    let currentId = "";

    for (const el of headingElements) {
      const top = el.getBoundingClientRect().top;

      if (top <= 120) {
        currentId = el.id;
      }
    }

    if (currentId) {
      setActiveId(currentId);
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  return () => window.removeEventListener("scroll", handleScroll);
}, [headings]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
        文章大纲
      </h3>
      <nav className="space-y-2 text-sm">
        {headings.map((h) => (
          <a
            key={h.slug}
            href={`#${h.slug}`}
            className={`block transition-colors ${
              activeId === h.slug
                ? "text-muted-foreground font-bold"
                : "text-muted-foreground hover:text-muted-foreground hover:font-bold"
            } ${
              h.depth === 2 ? "pl-4" : "pl-8 text-[0.85rem]"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
