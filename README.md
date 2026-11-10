# Neil Hong — Portfolio

Personal portfolio for a Web3 and full-stack developer: a kinetic home page,
a scroll-driven 3D project wheel, and themed project detail pages.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static export of every route)
- React 19, TypeScript
- Tailwind CSS 4 plus hand-written styles in `src/app/globals.css`
- GSAP for page and title animations, Framer Motion on detail pages
- React Three Fiber / three.js for the project wheel

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (all pages are prerendered) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run optimize:images -- [--delete] <file\|dir>...` | Convert PNG/JPEG to resized WebP (see below) |

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin, e.g. `https://example.com`. Used for canonical URLs, Open Graph tags, `robots.txt` and `sitemap.xml`. On Vercel it falls back to the production deployment URL. |

## Editing content

- **Projects:** `src/data/projects.ts` — title, description, links, cover
  `image`, gallery `images`, and a `detailTheme` (background, foreground,
  gallery layout) per project. The `slug` becomes `/project/<slug>`.
- **Home page:** `src/data/home.ts` — nav items, awards, experience, about rows.
- **Images:** put them in `public/projects/` and convert them first:

  ```bash
  npm run optimize:images -- --delete public/projects/my-new-shot.png
  ```

  This writes a WebP next to the original (max 2560px wide, quality 82) and,
  with `--delete`, removes the source. Reference the `.webp` path in the data.

## Project structure

```
src/
  app/
    layout.tsx               Root layout, metadata, fonts
    page.tsx                 Home
    projects/page.tsx        3D project wheel
    project/[slug]/          Project detail pages (statically generated)
    sitemap.ts, robots.ts
  components/
    PortfolioHome.tsx        Home sections and GSAP animations
    ProjectGrid.tsx          Wheel page: scroll handling, titles, controls
    ProjectWheel3D.tsx       WebGL wheel (client-only)
    WebGLBoundary.tsx        Static fallback when WebGL is unavailable
  data/                      Site content
  lib/                       Small helpers (site URL, motion, progress store)
scripts/optimize-images.mjs  Image conversion
```

## Accessibility notes

- Animations respect `prefers-reduced-motion`.
- `/projects` includes a keyboard-reachable list of every project, and falls
  back to a flat cover image when WebGL is unavailable.
