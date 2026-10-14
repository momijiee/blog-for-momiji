import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface TagBadgeProps {
  tag: string
  href?: string
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
}

export function TagBadge({ tag, href, variant = "secondary" }: TagBadgeProps) {
  if (href) {
    return (
      <Badge asChild variant={variant}>
        <Link href={href}>#{tag}</Link>
      </Badge>
    )
  }

  return (
    <Badge variant={variant}>#{tag}</Badge>
  )
}
