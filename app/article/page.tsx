import { getAllPosts } from "@/lib/posts";
import { AnimatedPostCard } from "@/components/ui/animated-post-card";


export default function Article() {
    const posts = getAllPosts();
    return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-2xl font-semibold">Articles</h1>
      <ul className="flex flex-col gap-4">
        {posts.map((post) => (
          <li key={post.id}>
            <AnimatedPostCard children={post}/>
          </li>
        ))}
      </ul>
    </div>
  );
}