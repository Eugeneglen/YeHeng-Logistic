# YeHeng Logistics — Corporate Website

**Precision. Control. Personal.**

A premium single-page dark-themed corporate website for **YeHeng Logistic Pte Ltd**, a Singapore-based logistics company. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui.

---

## Quick Start

```bash
bun install          # Install dependencies
bun run db:push      # Push Prisma schema to SQLite
bun run dev          # Start dev server on port 3000 (logs to dev.log)
```

- **Dev server:** `http://localhost:3000` (single route only — `/`)
- **Lint:** `bun run lint`
- **No build step needed for development** — `bun run dev` handles everything

---

## Architecture

### Single-Page Design

The entire website is one route (`src/app/page.tsx`, ~1,434 lines). All sections are defined as inline components within this file:

| Section | Component | Purpose |
|---|---|---|
| Navigation | `Navbar` | Sticky header, mobile hamburger, scroll-aware bg blur, dropdown |
| Hero | `Hero` | Full-viewport with port background image, headline, dual CTA |
| About | `About` | Company philosophy, scroll-reveal animations |
| Hybrid Model | `HybridModel` | Human + Technology logistics model explainer |
| Services | `Services` | Service offerings grid (6 services, icons, descriptions) |
| Industries | `Industries` | Industry verticals (3 cards with hover effects) |
| Projects | `Projects` | Case studies (G.E.M. Concert, Grand Prix, Container Ops) |
| Project Detail | `ProjectDetail` | Sheet/drawer with full project info + infographic dialogs |
| Contact | `Contact` | Form (name, email, company, phone, message) → `/api/contact` |
| Footer | `Footer` | SLA/BizSafe logos, copyright |

### Rendering Flow

```
layout.tsx
  └─ <div class="relative overflow-x-hidden">    ← Content wrapper (NO z-index)
  │    └─ page.tsx (HomePage)
  │         └─ Navbar, Hero, About, ... Contact, Footer
  ├─ <BackgroundTexture />                        ← z-40 (route lines + glow blobs)
  ├─ <MouseRadar />                               ← z-42 (mouse-following radar effect)
  └─ <Toaster />                                  ← Toast notifications
```

### Z-Index Stack

| Layer | Z-Index | Component |
|---|---|---|
| Background texture | `z-40` | Route lines + ambient glow blobs |
| Mouse radar | `z-42` | Cursor-following radar spotlight |
| Navbar | `z-50` | Sticky navigation bar |
| Sheet (project detail) | `z-50` | Radix Sheet overlay |
| Dialog (infographic) | `z-50` | Radix Dialog overlay |

**Critical rule:** The content wrapper must NOT have a z-index, otherwise it creates a stacking context that traps the navbar and other z-indexed children.

---

## API Routes

### `POST /api/contact`

Contact form submission → sends styled HTML email via nodemailer SMTP.

**Request body:**
```json
{
  "name": "John Tan",
  "email": "john@company.com",
  "company": "Acme Pte Ltd",
  "phone": "+65 8498 1676",
  "message": "Need logistics support for..."
}
```

**Validation:** `name` (≥2 chars), `email` (regex), `message` (≥10 chars). `company` and `phone` optional.

**Environment variables required:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### `GET /api/`

Health check endpoint → `{ "message": "Hello, world!" }`

---

## Visual Effects System

### Background Texture (`src/components/background-texture.tsx`)
- 3 animated route lines drifting horizontally (amber gradient, different speeds)
- 3 ambient glow blobs floating with `filter: blur(120px)` and `mix-blend-mode: screen`
- All animations defined in `globals.css` (`@keyframes route-drift-*`, `@keyframes glow-drift-*`)

### Mouse Radar (`src/components/mouse-radar.tsx`)
- Follows cursor with `requestAnimationFrame` (no re-renders for position)
- Rotating conic-gradient sweep arm (3.5s rotation)
- 4 static concentric grid rings
- Cross-hair lines (horizontal + vertical)
- 4 staggered pulse rings (recycled via animation restart, no DOM creation)
- Center dot with box-shadow glow
- Auto-fades after 2.5s of mouse inactivity
- All colors use `rgba()` format (not oklch) for maximum browser compatibility

### Scroll Reveal
- `useReveal()` hook with `IntersectionObserver`
- Elements with `.reveal` class animate in (fade up + translateY)
- Staggered delays: `.reveal-delay-1` through `.reveal-delay-4`

---

## Styling

### Color System
Dark theme with amber/gold accents. All colors defined as CSS custom properties in `:root` using `oklch()` color space:

| Variable | Purpose | Value |
|---|---|---|
| `--background` | Page background | `oklch(0.07 0 0)` (near-black) |
| `--foreground` | Primary text | `oklch(0.985 0 0)` (near-white) |
| `--amber` | Accent (CSS var) | `#D97706` |
| `--amber-light` | Accent light | `#F59E0B` |
| `--amber-dark` | Accent dark | `#B45309` |

### Key CSS Classes
| Class | Purpose |
|---|---|
| `.gradient-text` | Amber gradient text effect (135deg, 3 stops) |
| `.card-glow` | Card hover: amber box-shadow + translateY(-4px) |
| `.line-accent` | Underline accent with gradient fade |
| `.bg-projects-warm` | Warm background for projects section (`#2d1a08`) |
| `.bg-route-line-*` | Animated horizontal route lines |
| `.bg-glow-blob-*` | Floating ambient glow blobs |
| `.animate-fade-in-up` | Hero text entrance animation |
| `.animate-subtle-pulse` | Gentle opacity pulse for accent elements |

### Overflow Prevention
`overflow-x: hidden` is set on `html`, `body`, AND the content wrapper to prevent horizontal scrollbar from oversized child elements (glow blobs, route lines).

---

## Project Data

Three case studies defined as a typed array in `page.tsx`:

```typescript
interface Project {
  id: string;          // "gem-concert-tour" | "singapore-grand-prix" | "sumec-container-operations"
  title: string;
  category: string;
  description: string;
  image: string;       // Public asset path
  tags: string[];
  client: string;
  year: string;
  duration: string;
  overview: string;
  challenges: string[];
  approach: string[];
  results: string[];
}
```

Each project has an associated infographic image shown in a `Dialog` popup via the `InfographicButton` component.

---

## Infographic System

The `InfographicButton` component renders a styled button that opens a full-size `Dialog` with the infographic image. Key details:

- Dialog uses `showCloseButton={false}` to hide the default Radix close button
- Custom close button (`<X>` icon) is positioned inside the image at `absolute top-3 right-3`
- Dialog is maximized: `max-w-[95vw] max-h-[95vh]`
- Infographic buttons are placed in the project detail Sheet, directly below the Duration meta bar

**Infographic assets** (in `public/`):
- `infographic-gem-concert.jpg`
- `infographic-grandprix.jpg`
- `infographic-container.jpg`

---

## Public Assets

| File | Purpose |
|---|---|
| `logo.png` | Company logo (used in navbar and footer) |
| `logo.svg` | SVG logo (used as favicon) |
| `sla-logo.png` | Singapore Logistics Association certification |
| `bizsafe-logo.png` | BizSafe STAR certification |
| `hero-port.png` | Singapore port night image (hero background) |
| `project-*.png` | Project card thumbnails (3 files) |
| `infographic-*.jpg` | Project infographic full images (3 files) |
| `robots.txt` | Search engine crawl permissions |

---

## Database

SQLite via Prisma ORM. Database file: `db/custom.db`.

**Note:** The current schema (User, Post models) is scaffolded boilerplate and not used by the website. Only the contact form uses persistence via the `/api/contact` API (which sends email, not DB writes).

```bash
bun run db:push      # Push schema changes
bun run db:generate  # Regenerate Prisma client
```

---

## Deployment

- **Output mode:** `standalone` (for containerized deployment)
- **Reverse proxy:** Caddy on port 81, forwarding to localhost:3000
- **Port routing:** Uses `?XTransformPort=` query parameter for multi-service routing through Caddy
- **API requests:** Must use relative paths only (e.g., `/api/contact`)

---

## Key Files Reference

| File | Lines | Purpose |
|---|---|---|
| `src/app/page.tsx` | ~1,434 | Entire website (all sections, components, data) |
| `src/app/layout.tsx` | ~65 | Root layout, fonts, metadata, layer ordering |
| `src/app/globals.css` | ~323 | All custom CSS, animations, color variables |
| `src/components/mouse-radar.tsx` | ~191 | Mouse-following radar effect |
| `src/components/background-texture.tsx` | ~19 | Route lines + glow blobs |
| `src/app/api/contact/route.ts` | ~131 | Contact form email sender |
| `prisma/schema.prisma` | ~25 | Database schema |

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16.1 (App Router) |
| Language | TypeScript 5 (strict, noImplicitAny: false) |
| UI Library | shadcn/ui (New York style) + Radix Primitives |
| Styling | Tailwind CSS v4 + tailwindcss-animate |
| Icons | lucide-react |
| Database | Prisma ORM + SQLite |
| Email | nodemailer (SMTP) |
| Forms | React controlled components (no react-hook-form in use) |
| Runtime | Bun |

---

## Common Pitfalls

1. **Adding z-index to content wrapper** — breaks navbar and overlay layering. The `<div className="relative overflow-x-hidden">` in layout.tsx must NOT have a z-index.

2. **Using absolute URLs in fetch** — must use relative paths (`/api/...`). For mini-services, use `/?XTransformPort=XXXX`.

3. **oklch colors in headless browsers** — some headless/automated browsers don't render oklch gradients correctly. Use `rgba()` for effects that need screenshot verification.

4. **Horizontal overflow on mobile** — always set `overflow-x: hidden` on html, body, AND the content wrapper. A single layer is insufficient.

5. **Large glow elements** — the ambient glow blobs (900px) and route lines (70-80vw) can cause horizontal scroll if not properly contained.

6. **Dialog close buttons** — shadcn DialogContent has a built-in close button. Use `showCloseButton={false}` when you need a custom-positioned close button (e.g., inside an image overlay).