"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Post } from "@/types/post";
import Image from "next/image";

interface AnimatedPostCardProps{
    children: Post
}

const cardVariants = {
    hover: {
        y: -6,
        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"
    },
    tap: { scale: 0.98 }
}

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

export function AnimatedPostCard({ children }:AnimatedPostCardProps) {
    return(
        <Link href={`/blog/${children.slug}`}>
            <motion.div
                  className="overflow-hidden rounded-xl inline-block"
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 300, damping: 30}}
            >
            <Card className="overflow-hidden cursor-pointer transition-colors">
                
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
                    {getPreviewText(children.content)}
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