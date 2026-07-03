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

This repo is a **Google AI Studio** project (see `metadata.json`), scaffolded as a
React + Express app with a Gemini-powered chat assistant. It is in a very early state.

## ⚠️ Known Gap: `src/` Directory Does Not Exist

`index.html` references `/src/main.tsx` and a favicon at
`/src/assets/images/favicon_1780598088621.png`, but **there is no `src/` directory
anywhere in this repository**. There is no React entry point, no `App` component,
no pages, no components — only the server and build tooling described below.

This means `npm run dev` will start the server, but the app will not actually render
(the browser will 404/fail on `/src/main.tsx`). Don't assume the frontend exists —
check before referencing "the UI" or "existing components." If asked to build the
app's UI, treat it as greenfield work, not a bug fix.

## Repo Structure

```
.
├── server.ts           # Express server: dev Vite host + prod static server + /api/sokhna
├── index.html          # HTML entry point (references missing src/main.tsx)
├── vite.config.ts       # Vite config: React + Tailwind plugins, GEMINI_API_KEY injection
├── tsconfig.json        # TS config: bundler resolution, react-jsx, noEmit (type-check only)
├── package.json         # Scripts and dependencies (see below)
├── metadata.json        # AI Studio app metadata (name, description, capabilities)
├── .env.example         # Documents GEMINI_API_KEY / APP_URL (AI Studio-injected)
├── README.md            # Minimal AI Studio boilerplate instructions
└── .gitignore
```

There is no `src/`, no test suite, no CI configuration, and no linter beyond
TypeScript's own type-checker.

## Tech Stack

- **React 19** + **Vite 6** (`@vitejs/plugin-react`)
- **Express 4** — also acts as the Vite dev middleware host
- **TypeScript 5.8** (`noEmit`, type-checking only — no `tsc` build step)
- **Tailwind CSS 4** via `@tailwindcss/vite`
- **@google/genai 1.29** — Gemini API client (server-side only)
- **motion**, **lucide-react** — animation and icons (installed, not yet used anywhere)
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
encodes real business facts — keep these in sync with `server.ts` if they change:

- Office: Touba 28 sur la route nationale, Touba, Sénégal (14.858876, -15.876403)
- Phone: 759091919 (+221 759091919) · Email: infos@ocass.net · Site: https://ocass.net
- Play Store links for the Client, Marchand, and Express apps (see `server.ts` for URLs)
- Core modules: Boutique, Supermarché, Pharmacie, Restaurant, Livraison, AirTime/Bill Pay

Currently uses model id `"gemini-3.5-flash"` — check this against available models if
it starts erroring, since model naming/availability changes over time.

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
- No test framework or CI is set up — don't assume test commands exist or invent test
  files unless asked to add a test setup.
- No ESLint config — `npm run lint` is TypeScript type-checking only.
