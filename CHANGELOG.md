# Changelog

---
## [v0.5.1] - 2026-02-13
### Changed
- Enhanced visual presentation of table of contents
- Improved styling for better readability and user experience

### Fixed
- **Build Failure**: Resolved TypeScript compilation error caused by wrong type import

---
## [v0.5.0] - 2026-02-13
### Added
- **Table of Contents**: Implemented automatic TOC generation for blog posts
  - Integrated `rehype-slug` to add ID attributes to all heading elements
  - Integrated `github-slugger` for consistent heading ID generation
  - Created new TOC component to render nested navigation structure
  - Injected TOC component into MDX content layout

### Changed
- Migrated MDX rendering from `next-mdx-remote` client-side components to `next-mdx-remote/rsc` server-side components
- Refactored `lib/posts.ts`: removed `serialize` function to align with server-side rendering approach

### Fixed
- Resolved unordered list display issue by adding custom `li` styling in `mdx-content.tsx`
  - Added `list-disc` and `ml-6` Tailwind classes to properly render bullet points

---
## [v0.4.0] - 2026-02-10
## Added
- Blog listing page: Refactored article preview cards to display the curated `post.description` from frontmatter instead of the raw, stripped markdown content. This provides concise, purpose-written summaries and improves page readability and performance.

---
## [v0.3.0] - 2026-02-09
### Added
- Added a click animation to the theme toggle button.
- Implemented dynamic metadata generation for blog posts using the `generateMetadata` function.
- Added a `description` field to the blog post template and frontmatter for SEO purposes.

---
## [v0.2.2] - 2026-02-07
### Fixed
- Enhanced card component visuals to be fully compatible with both light and dark themes.

---
## [v0.2.1] - 2026-02-07
### Fixed
- Fixed theme toggle button failure on first click by correctly resolving the initial `"system"` theme preference. Implemented proper client-side mounting logic to prevent hydration mismatch.

---
## [v0.2.0] - 2026-02-06
### Added
- Dark mode support for the entire blog
- Improved hover and transition animations on blog previews


### Fixed
- Optimized navigation bar links and layout for better UX

---
## [v0.1.0] - 2026-02-06
### Added
- Initial personal blog setup with Next.js App Router
- Tailwind CSS + shadcn/ui styling
- MDX content rendering
- Dynamic routing for blog posts

