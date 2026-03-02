"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function JumpToComments({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false);
  const [atComments, setAtComments] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const commentSection = document.getElementById("comment-section");

      // Show after scrolling 300px
      const shouldShow = scrollY > window.innerHeight * 0.8;

      // Hide once the comment section is in view
      if (commentSection) {
        const rect = commentSection.getBoundingClientRect();
        setAtComments(rect.top <= window.innerHeight * 0.5);
      }

      setVisible(shouldShow);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToComments = () => {
    const commentSection = document.getElementById("comment-section");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isVisible = visible && !atComments;

  return (
    <motion.div
      className={cn(
        "fixed bottom-24 right-8 z-50",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none",
        "transition-all duration-300",
        className
      )}
      initial={false}
    >
      <motion.button
        onClick={scrollToComments}
        aria-label="跳转至评论区"
        className="relative flex items-center justify-center w-12 h-12 rounded-full
                   backdrop-blur-md bg-background/60 border border-border shadow-lg"
        whileHover="hover"
        whileTap="tap"
        initial="rest"
        animate="rest"
      >
        <motion.span
          className="relative z-10 inline-flex"
          variants={{
            rest: { scale: 1 },
            hover: { scale: 1.15 },
            tap: { scale: 0.9 },
          }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          <MessageCircle size={18} />
        </motion.span>

        <motion.div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-current rounded-full"
          variants={{
            rest: { width: 0 },
            hover: { width: "50%" },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        />
      </motion.button>
    </motion.div>
  );
}
