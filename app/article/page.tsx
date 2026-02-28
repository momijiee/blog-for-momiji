import { getAllPosts, getPostsByCategory, getPostsByTags, getAllCategories, getAllTags } from "@/lib/posts";
import { AnimatedPostCard } from "@/components/ui/animated-post-card";
import { FilterSidebar } from "@/components/ui/filter-sidebar";

type Props = {
  searchParams: Promise<{ category?: string; tags?: string | string[] }>;
};

export default async function Article({ searchParams }: Props) {
  const { category, tags: tagsParam } = await searchParams;
  
  let posts = getAllPosts();
  
  // 根据分类或标签筛选
  if (category) {
    posts = getPostsByCategory(category);
  } else if (tagsParam) {
    // 处理多标签：tagsParam 可能是字符串或字符串数组
    const selectedTags = Array.isArray(tagsParam) ? tagsParam : [tagsParam];
    posts = getPostsByTags(selectedTags);
  }

  // 获取所有分类和标签
  const categories = getAllCategories();
  const tags = getAllTags();

  // 获取筛选条件的显示文本
  const tagsArray = Array.isArray(tagsParam) ? tagsParam : tagsParam ? [tagsParam] : [];
  const filterText = category
    ? `分类: ${category}`
    : tagsArray.length > 0
      ? `标签: ${tagsArray.join(", ")}`
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* 侧边栏 */}
        <div className="lg:col-span-1">
          <FilterSidebar categories={categories} tags={tags} />
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold mb-2">Articles</h1>
            {filterText && (
              <p className="text-sm text-muted-foreground">{filterText}</p>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              共 {posts.length} 篇文章
            </p>
          </div>

          {posts.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {posts.map((post) => (
                <li key={post.id}>
                  <AnimatedPostCard children={post} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无文章</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}