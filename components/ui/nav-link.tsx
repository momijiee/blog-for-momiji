import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
}

/**
 * 导航链接
 * 使用 NavigationMenu 的样式保持与其他导航组件的一致性
 */
export function NavLink({ href, children, className }: NavLinkProps) {
  return (
    <Link href={href} passHref>
      <div className={cn(navigationMenuTriggerStyle(), className)}>
        {children}
      </div>
    </Link>
  )
}
