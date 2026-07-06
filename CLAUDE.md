# CLAUDE.md

Guidance for AI assistants working in this repository.

## Project Overview

**Ocass Super App** is a planned multi-service platform for Touba, Senegal, covering
e-commerce (Boutique), grocery (Supermarché), pharmacy, restaurant delivery, general
package delivery, and mobile airtime/bill payments (Senelec/Woyofal, Sen'eau, Canal+).
It's part of a family of three companion apps:

- **Ocass** (Client) — customers browse/order and pay bills
- **Ocass Marchand** (Vendeur) — merchants manage their stores and orders
- **Ocass Express** (Livreur) — delivery riders accept and fulfill runs

This repo is a **Google AI Studio** project (see `metadata.json`): a React + Express
app with a Gemini-powered chat assistant ("Sokhna") and a landing page presenting the
platform's modules and the three companion apps.

## Repo Structure

```
.
├── server.ts                    # Express server: dev Vite host + prod static server + /api/sokhna
├── index.html                   # HTML entry point, mounts src/main.tsx
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Top-level layout: assembles the sections below
│   ├── index.css                # Tailwind entry (`@import "tailwindcss"`)
│   ├── lib/constants.ts         # Business data (contact info, app links, modules)
│   ├── components/
│   │   ├── Header.tsx           # Sticky top bar with contact links
│   │   ├── Hero.tsx             # Landing hero + primary CTAs
│   │   ├── Modules.tsx          # Grid of the 6 service modules
│   │   ├── AppLinks.tsx         # Client / Marchand / Livreur download cards
│   │   ├── Footer.tsx           # Address, contact, site link
│   │   └── SokhnaChat.tsx       # Floating chat widget calling POST /api/sokhna
│   └── assets/images/favicon.svg
├── public/videos/hero.mp4       # Hero background video, served as-is (not processed by Vite)
├── public/images/promo-banner.jpg  # Hero carousel promo slide (real Ocass marketing banner)
├── public/icons/                # PWA manifest icons (icon-192.png, icon-512.png, apple-touch-icon.png)
├── .github/workflows/ci.yml     # CI: npm ci, npm run lint, npm run build on push/PR
├── vite.config.ts               # Vite config: React + Tailwind plugins, GEMINI_API_KEY injection
├── tsconfig.json                # TS config: bundler resolution, react-jsx, noEmit (type-check only)
├── package.json                 # Scripts and dependencies (see below)
├── metadata.json                # AI Studio app metadata (name, description, capabilities)
├── .env.example                 # Documents GEMINI_API_KEY / APP_URL (AI Studio-injected)
├── README.md                    # Minimal AI Studio boilerplate instructions
└── .gitignore
```

There is no test suite and no linter beyond TypeScript's own type-checker. CI
(`.github/workflows/ci.yml`) runs `npm run lint` and `npm run build` on every push
to `main` and every pull request — it does not run tests, since none exist.

## Tech Stack

- **React 19** + **Vite 6** (`@vitejs/plugin-react`)
- **Express 4** — also acts as the Vite dev middleware host
- **TypeScript 5.8** (`noEmit`, type-checking only — no `tsc` build step)
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **@google/genai 1.29** — Gemini API client (server-side only)
- **motion**, **lucide-react** — animation (`motion/react`, used in `Hero.tsx` and
  `SokhnaChat.tsx`) and icons
- **vite-plugin-pwa** — generates the web app manifest and service worker (see
  PWA section below)
- **tsx** (dev) / **esbuild** (prod bundling of `server.ts`)

## Dev Workflow

```bash
npm install
# set GEMINI_API_KEY in .env.local (gitignored; see .env.example)
npm run dev      # tsx server.ts — Express + Vite middleware mode (SPA)
npm run build    # vite build (client) + esbuild bundles server.ts -> dist/server.cjs
npm start        # node dist/server.cjs — serves dist/ statically in production
npm run preview  # vite preview
npm run lint     # tsc --noEmit (type-check only, no eslint configured)
npm run clean    # rm -rf dist
```

In production (`NODE_ENV=production`), `server.ts` serves static files from `dist/`
with an SPA fallback (`app.get("*", ...)` → `dist/index.html`). In development it
mounts Vite in middleware mode instead of a separate Vite dev server — there is one
server process for both API and frontend in both modes.

## Server Architecture (`server.ts`)

Single-file Express server with one responsibility split in two:

1. **Frontend hosting** — Vite middleware in dev, static `dist/` + SPA fallback in prod.
2. **`POST /api/sokhna`** — the only API route. Body: `{ message: string, history?: {role, text}[] }`.
   Returns `{ text: string }` or `{ error: string }`.

Key patterns to follow if adding more Gemini-backed routes:
- The `GoogleGenAI` client is **lazily initialized** (`getGeminiClient()`) and throws
  if `GEMINI_API_KEY` is unset — don't initialize it at module load time.
- On missing API key, the handler **degrades gracefully**: it catches the error and
  returns a canned, still-useful French response with contact info instead of a hard
  500. Prefer this pattern over failing outright for user-facing AI features.
- `history` turns are mapped `role: "user" | "model"` (Gemini's convention, not
  `"assistant"`).

### The "Sokhna" Assistant

`/api/sokhna` powers a chatbot named **Sokhna**, defined entirely by a hardcoded
system prompt in `server.ts` (`SOKHNA_SYSTEM_INSTRUCTION`). It answers in French,
Wolof, or English, and is the closest thing this repo has to a product spec. It
encodes real business facts:

- Office: Touba 28 sur la route nationale, Touba, Sénégal (14.858876, -15.876403)
- Phone: 759091919 (+221 759091919) · Email: infos@ocass.net · Site: https://ocass.net
- Play Store links for the Client, Marchand, and Express apps (see `server.ts` for URLs)
- Core modules: Boutique, Supermarché, Pharmacie, Restaurant, Livraison, AirTime/Bill Pay

The same facts are duplicated on the frontend in `src/lib/constants.ts` (`CONTACT`,
`APP_LINKS`, `MODULES`) since server-only code in `server.ts` can't be imported
client-side. **If any of this changes, update both places.**

Currently uses model id `"gemini-3.5-flash"` — check this against available models if
it starts erroring, since model naming/availability changes over time.

## Frontend Architecture

`App.tsx` composes `Header`, `Hero`, `Modules`, `AppLinks`, `Footer`, and a floating
`SokhnaChat` widget, in that order — a single-page marketing/landing layout, not a
router. `SokhnaChat` maintains its own `history` state and POSTs to `/api/sokhna` on
each message, mapping turns to Gemini's `role: "user" | "model"` convention to match
what `server.ts` expects. Styling is Tailwind utility classes directly in JSX; there
is no separate design-token or theme file.

`Hero.tsx` is a background carousel (`SLIDES` array, auto-advances every
`SLIDE_DURATION_MS`, crossfaded via `motion`'s `AnimatePresence`) alternating between
the looping muted video (`/videos/hero.mp4`) and a static promo banner image
(`/images/promo-banner.jpg`, the real Ocass marketing creative) — both sit behind
the same translucent gradient overlay used for text contrast. The video degrades
silently to its slide's plain background if a browser can't decode it (e.g. an
H.264/AAC-less Chromium build), so no fallback/poster handling is needed.

The brand mark (favicon, PWA icons, and the header wordmark) is modeled on the real
Ocass logo found in that promo banner: a dark green (`#083b0d`) circle containing an
orange (`#eb8c2e`) shopping-cart glyph, standing in for the letter "O" in "cass" —
see `src/assets/images/favicon.svg` and `Header.tsx`.

### Progressive Web App

The `VitePWA` plugin (configured in `vite.config.ts`) makes this landing page
installable ("Add to Home Screen") on mobile/desktop, with an emerald-branded
standalone window, an app icon, and offline caching via an auto-generated service
worker. **This is not the native Ocass Client/Marchand/Express app** referenced in
`AppLinks.tsx` — those are separate Play Store apps with no code in this repo; the
PWA only wraps this marketing site. Manifest icons live in `public/icons/` (not
`src/assets/`) so their paths stay stable and un-hashed in the production build —
follow that pattern for any future manifest/static assets referenced by exact path.
`index.html` carries the iOS-specific meta tags (`apple-mobile-web-app-capable`,
`apple-touch-icon`) since Safari doesn't read the web manifest for those.

## AI Studio–Specific Conventions

- `vite.config.ts` reads `DISABLE_HMR` to toggle HMR off — **do not remove this**, per
  the inline comment; AI Studio sets it to prevent flicker during agent-driven edits.
- `.env.example`'s `GEMINI_API_KEY` and `APP_URL` are normally **auto-injected by AI
  Studio at runtime** from user secrets / the Cloud Run service URL — they aren't
  meant to be hand-configured outside that environment (README's `.env.local`
  instructions are the local-dev exception).
- `metadata.json` declares `majorCapabilities: ["MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API"]`.

## Other Conventions

- Path alias `@/*` → repo root (configured in both `tsconfig.json` and `vite.config.ts`).
- No test framework is set up — don't assume test commands exist or invent test files
  unless asked to add a test setup.
- No ESLint config — `npm run lint` is TypeScript type-checking only; that's also all
  CI runs (plus `npm run build`) since there are no tests to run.
