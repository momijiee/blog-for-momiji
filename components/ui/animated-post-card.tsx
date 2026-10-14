"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BasePost, PostWithHeadings } from "@/types/post";
import Image from "next/image";
import { TagBadge } from "@/components/ui/tag-badge";

interface AnimatedPostCardProps{
    children: BasePost | PostWithHeadings
}

const cardVariants = {
    hover: { y: -6 },
    tap: { scale: 0.98 }
}


export function AnimatedPostCard({ children }:AnimatedPostCardProps) {
    return(
            <motion.div
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  transition={{ type: "spring", stiffness: 300, damping: 30}}
            >
              <Card className="
                overflow-hidden rounded-xl inline-block w-full
                transition-shadow shadow-md
                hover:shadow-xl
                dark:ring-1 ring-white/10
                dark:hover:ring-white/30
              ">
                <Link href={`/blog/${children.slug}`} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
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
                  <CardTitle className="text-xl">{children.title}</CardTitle>
                  {children.category && (
                    <p className="text-xs text-muted-foreground mt-1">
                      分类: {children.category}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground mb-3">
                    {children.description}
                  </p>
                </CardContent>
                </Link>
                <CardContent>
                  {/* 标签显示 */}
                  {children.tags && children.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {children.tags.map((tag) => (
                        <TagBadge
                          key={tag}
                          tag={tag}
                          href={`/article?tags=${encodeURIComponent(tag)}`}
                        />
                      ))}
                    </div>
                  )}
                  
                  <p className="text-right text-xs text-muted-foreground">
                    {children.createdAt}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
    )
}
