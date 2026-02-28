"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface FilterSidebarProps {
  categories: string[]
  tags: string[]
}

export function FilterSidebar({ categories, tags }: FilterSidebarProps) {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")
  const currentTags = searchParams.getAll("tags")

  const getFilterUrl = (type: "category" | "tag", value: string, isToggle: boolean = false) => {
    const params = new URLSearchParams(searchParams)
    if (type === "category") {
      params.set("category", value)
      params.delete("tags")
    } else {
      // 处理多标签切换
      const tags = params.getAll("tags")
      if (isToggle) {
        // 切换模式：如果已选中则移除，否则添加
        if (tags.includes(value)) {
          params.delete("tags")
          tags.forEach(tag => {
            if (tag !== value) {
              params.append("tags", tag)
            }
          })
        } else {
          params.append("tags", value)
        }
      } else {
        // 替换模式：只选择单个标签
        params.delete("tags")
        params.append("tags", value)
      }
      params.delete("category")
    }
    return `/article?${params.toString()}`
  }

  const isTagSelected = (tag: string) => currentTags.includes(tag)

  const clearFiltersUrl = "/article"

  return (
    <aside className="w-full lg:w-64 lg:sticky lg:top-20 lg:h-fit">
      <div className="space-y-6 p-4 bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-800">
        {/* 分类筛选 */}
        <div>
          <h3 className="font-semibold text-sm mb-3">分类</h3>
          <div className="space-y-2">
            <Link
              href="/article"
              className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                !currentCategory && currentTags.length === 0
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              全部
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={getFilterUrl("category", category)}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  currentCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* 标签筛选 */}
        <div>
          <h3 className="font-semibold text-sm mb-3">标签</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={getFilterUrl("tag", tag, true)}
                className={`transition-all ${
                  isTagSelected(tag)
                    ? ""
                    : "hover:opacity-80"
                }`}
              >
                <Badge variant={isTagSelected(tag) ? "default" : "secondary"}>
                  #{tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* 清除筛选 */}
        {(currentCategory || currentTags.length > 0) && (
          <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
            <Link
              href={clearFiltersUrl}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              清除筛选
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
