import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"


const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://momiji.dev"

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts()
  
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
      },
      ...posts.map(post => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.createdAt,
        //lastModified: post.updatedAt ?? post.createdAt,
      })),
    ]
  }