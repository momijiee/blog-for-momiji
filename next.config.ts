import type { NextConfig } from "next";
import createMDX from "@next/mdx"

const nextConfig: NextConfig = {
  pageExtensions: ["js", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  // 目前不加插件，保持最简单
})

export default withMDX(nextConfig)
