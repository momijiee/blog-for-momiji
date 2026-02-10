"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Post } from "@/types/post";
import Image from "next/image";

interface AnimatedPostCardProps{
    children: Post
}

/*
function getPreviewText(content: string) {
  return content
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/\[[^\]]*\]\([^)]+\)/g, (m) => m.replace(/\[|\]|\([^)]+\)/g, "")) // links -> text
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline code
    .replace(/[*_~>-]+/g, "") // common markdown tokens
    .replace(/\n+/g, " ")
    .trim();
}
*/

const cardVariants = {
    hover: { y: -6 },
    tap: { scale: 0.98 }
}


export function AnimatedPostCard({ children }:AnimatedPostCardProps) {
    return(
        <Link href={`/blog/${children.slug}`}>
            <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 300, damping: 30}}
            >
              <Card className="
                overflow-hidden rounded-xl inline-block
                transition-shadow shadow-md       
                hover:shadow-xl 
                dark:ring-1 ring-white/10
                dark:hover:ring-white/30
              ">
                {children.image && (
                  <div className="relative aspect-[2/1] w-full">
                    <Image
                      src={children.image}
                      alt={children.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{children.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground inline-block">
                    {children.description}
                  </p>
                  <p className="mt-2 text-right text-xs text-muted-foreground inline-block">
                    {children.createdAt}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
        </Link>
    )
}