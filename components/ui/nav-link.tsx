"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
}

interface NavMenuProps {
  label: ReactNode
  children: ReactNode
  className?: string
}

/**
 * 普通导航链接
 * 使用 NavigationMenu 的样式保持一致性
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

/**
 * 导航菜单（带下拉）
 * 使用 NavigationMenu 组件实现
 */
export function NavMenu({ label, children, className }: NavMenuProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={className}>
            {label}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            {children}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
