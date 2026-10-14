import { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/posts"


const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.momiji.dev"

export default function sitemap(): MetadataRoute.Sitemap {
    const posts = getAllPosts()
  
    return [
      {
        url: BASE_URL,
        lastModified: new Date(),
      },
      { url: `${BASE_URL}/article` },
      { url: `${BASE_URL}/activity` },
      { url: `${BASE_URL}/about` },
      ...posts.map(post => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: post.createdAt,
        //lastModified: post.updatedAt ?? post.createdAt,
      })),
    ]
  }
