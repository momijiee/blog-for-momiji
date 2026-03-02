"use client";

import { Heading } from "@/types/post";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

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

  // Check if the previous or next heading is also active
  const isAdjacentActive = (index: number) => {
    const prevActive = index > 0 && activeIds.has(headings[index - 1].slug);
    const nextActive = index < headings.length - 1 && activeIds.has(headings[index + 1].slug);
    return { prevActive, nextActive };
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-muted-foreground">
        文章大纲
      </h3>
      <nav className="text-sm space-y-1">
        {headings.map((h, index) => {
          const isActive = activeIds.has(h.slug);
          const { prevActive, nextActive } = isAdjacentActive(index);
          
          return (
            <div
              key={h.slug}
              className="relative"
            >
              {/* Background highlight layer with animation */}
              <div
                className={`absolute -mx-2 transition-all duration-300 ease-out ${
                  isActive
                    ? "bg-slate-200 dark:bg-slate-800"
                    : "bg-transparent"
                } ${
                  // Rounded corners logic
                  isActive && prevActive && nextActive ? "" : // No rounding when sandwiched
                  isActive && prevActive ? "rounded-b-md" : // Bottom rounding only
                  isActive && nextActive ? "rounded-t-md" : // Top rounding only
                  isActive ? "rounded-md" : "" // Full rounding when standalone
                }`}
                style={{
                  top: prevActive && isActive ? "-0.25rem" : 0,
                  bottom: nextActive && isActive ? "-0.25rem" : 0,
                  left: 0,
                  right: 0,
                  transformOrigin: prevActive ? "top" : nextActive ? "bottom" : "center",
                  transform: isActive ? "scaleY(1)" : "scaleY(0)",
                  opacity: isActive ? 1 : 0,
                }}
              />
              
              {/* Content layer */}
              <a
                href={`#${h.slug}`}
                className={`relative block py-1.5 px-2 transition-colors duration-200 ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                } ${getIndentClass(h.depth)} ${getFontSizeClass(h.depth)}`}
              >
                {h.text}
              </a>
            </div>
          );
        })}
      </nav>

      {/* Divider + Jump to Comments link */}
      <div className="mt-4 pt-4 border-t border-border">
        <a
          href="#comment-section"
          className="flex items-center gap-2 py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <MessageCircle size={14} />
          <span>评论区</span>
        </a>
      </div>
    </div>
  );
}
