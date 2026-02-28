"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { BasePost, PostWithHeadings } from "@/types/post";
import Image from "next/image";
import { TagBadge } from "@/components/ui/tag-badge";
import { useRouter } from "next/navigation";

interface AnimatedPostCardProps{
    children: BasePost | PostWithHeadings
}

const cardVariants = {
    hover: { y: -6 },
    tap: { scale: 0.98 }
}


export function AnimatedPostCard({ children }:AnimatedPostCardProps) {
    const router = useRouter();

    const handleTagClick = (e: React.MouseEvent, tag: string) => {
      e.preventDefault();
      e.stopPropagation();
      router.push(`/article?tag=${encodeURIComponent(tag)}`);
    };

    return(
        <Link href={`/blog/${children.slug}`}>
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
                  
                  {/* 标签显示 */}
                  {children.tags && children.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3" onClick={(e) => e.stopPropagation()}>
                      {children.tags.map((tag) => (
                        <TagBadge
                          key={tag}
                          tag={tag}
                          onClick={(e) => handleTagClick(e, tag)}
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
        </Link>
    )
}