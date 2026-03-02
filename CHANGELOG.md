# Changelog

## [v1.0.0] - 2026-03-02
### Added
- Implement comment system with database backend
- Implement comment system UI with server/client component architecture
- Implement antomatic retry mechanism for failed API requests

### Changed
- **Comment Section**: Refactored comment data fetching to the blog page level. This improves component reusability by making `CommentSection` a presentational component.
- **Table of Contents (TOC)**: Integrated a "Jump to Comments" link. The TOC now receives the total comment count from the page to display alongside the link.

### Fixed
- **Scroll Behavior**: Resolved an issue where `JumpToComment` and `BackToTop` buttons would not show up together. They now appear simultaneously when the user scrolls down.

---
## [v0.8.2] - 2026-03-02
### Changed
- Optimize database query frequency with timestamp-based cache control
- Refactor cache logic into shared utility module

---
## [v0.8.1] - 2026-03-01
### Added
- Implement client-side caching for view counts and like status

---
## [v0.8.0] - 2026-03-01
### Added
- Implement view counter and like functionality with Supabase integration

### Changed
- Update blog post page to display view counts and allow user interactions

---
## [v0.7.1] - 2026-02-28
### Added
- **Multi-Tag Filtering**: Readers can now filter articles by multiple tags simultaneously.

### Changed
- **Navigation Simplification**: Removed category dropdown from main navigation bar.

---
## [v0.7.0] - 2026-02-28
### Added
- **Article Taxonomy System**: Implemented comprehensive tag and category support for better content organization.
- **Navigation Enhancement**: Added category dropdown menus to the main navigation bar.

---
## [v0.6.1] - 2026-02-28
### Added
- Support for all heading levels (h1-h6) in table of contents with hierarchical indentation
- Multiple visible headings highlighting: all headings currently visible in viewport are now highlighted simultaneously

### Changed
- Redesigned TOC highlighting from bold text to background color rectangles
- Improved highlight animation: directional expansion/collapse effect
- Enhanced visual feedback with theme-aware colors and smooth transitions

### Fixed
- Fixed bug where last section couldn't be highlighted if too short to scroll to top
- Fixed height stability issue: TOC component now maintains consistent vertical height during scrolling
- Removed layout-affecting margins in favor of absolute positioning for background highlights

---
## [v0.6.0] - 2026-02-13
### Added
- Implement table of contents generation for blog posts with dynamic heading highlighting
- Add "Back to Top" button for improved navigation on long articles

### Changed
- Optimize scroll-to-heading navigation logic with smooth scrolling behavior
- Enhance visual feedback for active table of contents items
- Improve click-jumping accuracy and user interaction experience

---
## [v0.5.3] - 2026-02-13
### Security
- **Upgraded `next-mdx-remote` to v6.0.0** to fix a high-severity vulnerability

---
## [v0.5.2] - 2026-02-13
### Fixed
- **Vercel Deployment**: Resolved production build failures caused by missing dependencies

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
