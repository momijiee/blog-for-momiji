"use client"

import { Badge } from "@/components/ui/badge"

interface TagBadgeProps {
  tag: string
  href?: string
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  onClick?: (e: React.MouseEvent) => void
}

export function TagBadge({ tag, href, variant = "secondary", onClick }: TagBadgeProps) {
  return (
    <Badge
      variant={variant}
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onClick={onClick}
      data-href={href}
    >
      #{tag}
    </Badge>
  )
}
