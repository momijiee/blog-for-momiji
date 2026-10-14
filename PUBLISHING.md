# 文章发布与回退

正式文章只从 `content/posts/*.mdx` 读取。文章正文在仓库中随 Git 提交，Vercel 从 GitHub 的 `main` 构建；Go 服务只负责互动，不存文章正文。

## 新建或更新

1. 在 `content/posts/` 新建 `<slug>.mdx`，或编辑已有文件。slug 使用 1–100 个小写英文字母、数字、`_`、`-`，并保持文件名不变，避免旧链接失效。
2. 文件开头填写 YAML front matter。`title`、`description`、`createdAt`、`category`、`tags` 和正文必填；`image` 与 `slug` 可选。若填写 `slug`，必须与文件名相同。日期使用真实的 `YYYY-MM-DD`；标签是非空字符串列表。封面和正文中的本地图片使用 `/...` 路径，文件放在 `public/`。

   ```mdx
   ---
   title: 文章标题
   description: 用于列表与搜索结果的简短摘要
   createdAt: 2026-10-14
   category: 技术
   tags:
     - Next.js
   image: /images/example.webp
   ---

   # 文章标题

   正文内容。
   ```

3. 运行 `npm run validate:posts`，再运行 `npm run build`。构建会再次校验必填项、日期、slug、MDX 语法及静态图片；错误会阻断发布。
4. 用 `npm run dev` 在本地检查 `/blog/<slug>`、`/article` 的分类和标签筛选、目录及图片。
5. 将文章和图片提交到 Git 分支并推送 GitHub，检查 Vercel 预览部署的构建结果与页面。确认后合并到 `main`；正式部署完成后检查 `https://www.momiji.dev/blog/<slug>` 和 `/sitemap.xml`。

更新文章沿用同一流程。需要修改标题、正文或图片时编辑原文件，保留 slug；确需改 slug 时同时添加旧地址重定向到 `next.config.ts`。

## 回退

找到引入问题的提交，使用 `git revert <commit>` 生成回退提交，推送到 `main`，等待 Vercel 构建并检查原文章地址。对尚未合并的分支，直接修正分支并重新查看预览。Git 回退保留提交历史；互动数据位于 MySQL，不随文章 Git 回退改变。

如果构建报 front matter、日期、图片或 MDX 错误，先修复原文章再重新推送，不跳过校验。Go API 超时不影响文章正文读取，但浏览、点赞和评论会显示暂不可用。
