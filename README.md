# Momiji's Blog

A personal, content-driven blog built with **Next.js App Router**, focused on long-form writing, reflective essays, and technical notes.

This project treats both **code and content as first-class citizens**, emphasizing clarity, maintainability, and long-term evolution rather than short-term metrics.

---

## ✨ Features

* 📝 **MDX-based content system**
  Blog posts live in the repository and are versioned with Git.

* 🌗 **Light / Dark theme support**
  System-aware theme switching with smooth animations.

* 🎴 **Animated post preview cards**
  Subtle hover/tap interactions powered by Framer Motion.

* 🔍 **SEO-friendly**
  Static generation, metadata support, and sitemap integration.

* 🧠 **Content-first design**
  Post previews use explicit descriptions instead of auto-truncated content.

---

## 🧱 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Animation:** Framer Motion
* **Icons:** lucide-react
* **Content:** MDX
* **Theme:** next-themes

---

## 📂 Project Structure

```text
.
├── app/                # Next.js app router
│   ├── blog/[slug]/    # Blog post pages
│   ├── about/          # About Me page
│   └── layout.tsx      # Global layout
├── components/         # UI components
├── content/posts/      # Blog posts (MDX)
├── lib/                # Content utilities
├── types/              # Shared TypeScript types
└── public/             # Static assets
```

---

## 🚀 Getting Started

```bash
# install dependencies
npm install

# run development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Writing Posts

Blog posts are stored in `content/posts` as `.mdx` files.

Each post includes front matter such as:

```yaml
title: My First Post
description: A short summary shown in preview cards
createdAt: 2026-02-01
```

Content changes are tracked with Git, making the writing process transparent and reversible.

---

## 🧭 Versioning Philosophy

* **Code changes** follow semantic versioning when appropriate.
* **Content changes** are committed independently and treated as part of the project history.
* Git is used as a **time axis** for both technical evolution and thought development.

---

## 📌 Roadmap

* [ ] Improve content navigation
* [ ] Add RSS feed
* [ ] Enhance metadata and OG images
* [ ] Explore headless CMS integration (optional)

---

## 🪴 About

This blog is part of a long-term personal project exploring technology, productivity, and the reconstruction of self beyond meritocracy.

Not optimized for virality. Optimized for clarity, depth, and continuity.

---

## Interaction service

The MDX files in `content/posts` remain the article source. The Next.js
`/api/comments`, `/api/stats`, and `/api/action` routes proxy interaction
requests to Momiji Server over HTTPS. Set `INTERACTION_PROXY_SECRET` as a
server-only Vercel Secret matching the Go service, and optionally set
`MOMIJI_API_URL` (defaults to `https://api.momiji.dev`). See `.env.example`.
Go interaction data starts empty; old Supabase counts are not migrated.
When the Go API is unavailable, article content still renders and interaction
components show an unavailable state.

## 📄 License

MIT
