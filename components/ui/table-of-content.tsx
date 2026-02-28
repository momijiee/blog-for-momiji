"use client";

import { Heading } from "@/types/post";
import { useEffect, useState } from "react";

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeIds, setActiveIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings
        .map((h) => document.getElementById(h.slug))
        .filter(Boolean) as HTMLElement[];

      const visibleIds = new Set<string>();

      // Check which headings are currently visible in the viewport
      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Consider a heading visible if it's within the viewport
        // Adding some margin (120px from top, full height from bottom)
        if (rect.top >= 0 && rect.top <= windowHeight) {
          visibleIds.add(el.id);
        }
      }

      // If no headings are visible in viewport, highlight the last one that passed the top
      if (visibleIds.size === 0) {
        let lastPassedId = "";
        for (const el of headingElements) {
          const top = el.getBoundingClientRect().top;
          if (top <= 120) {
            lastPassedId = el.id;
          }
        }
        if (lastPassedId) {
          visibleIds.add(lastPassedId);
        }
      }

      setActiveIds(visibleIds);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  // Calculate indentation based on heading depth
  const getIndentClass = (depth: number) => {
    // depth 1: no indent (pl-0)
    // depth 2: pl-4
    // depth 3: pl-8
    // depth 4: pl-12
    // depth 5: pl-16
    // depth 6: pl-20
    const indentMap: Record<number, string> = {
      1: "pl-0",
      2: "pl-4",
      3: "pl-8",
      4: "pl-12",
      5: "pl-16",
      6: "pl-20",
    };
    return indentMap[depth] || "pl-0";
  };

  // Calculate font size based on heading depth
  const getFontSizeClass = (depth: number) => {
    if (depth === 1) return "text-base";
    if (depth === 2) return "text-sm";
    return "text-[0.85rem]";
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
        文章大纲
      </h3>
      <nav className="space-y-1 text-sm">
        {headings.map((h) => (
          <a
            key={h.slug}
            href={`#${h.slug}`}
            className={`block py-1.5 px-2 -mx-2 rounded-md transition-all ${
              activeIds.has(h.slug)
                ? "bg-slate-100 dark:bg-slate-700 text-foreground"
                : "text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground"
            } ${getIndentClass(h.depth)} ${getFontSizeClass(h.depth)}`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
