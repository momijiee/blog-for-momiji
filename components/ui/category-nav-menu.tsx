import Link from "next/link"
import { getAllCategories } from "@/lib/posts"
import { NavMenu } from "@/components/ui/nav-link"

export async function CategoryNavMenu() {
  const categories = await Promise.resolve(getAllCategories())

  return (
    <NavMenu label="Article">
      <div className="w-[200px] p-2">
        <Link
          href="/article"
          className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          全部文章
        </Link>
        {categories.length > 0 && (
          <div className="border-t my-2 pt-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/article?category=${encodeURIComponent(category)}`}
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>
        )}
      </div>
    </NavMenu>
  )
}
