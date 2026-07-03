# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Ocass Super App is a multi-service platform (e-commerce, restaurant, supermarket, taxi, delivery, bill pay) for Touba, Sénégal. The app is built and hosted via Google AI Studio (see `metadata.json`'s `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`), which deploys this repo directly — there is no separate CI/deploy pipeline to configure.

**Current repo state:** only the Express/Vite server scaffold (`server.ts`) and project config exist. `index.html` and `tsconfig.json` reference a `src/` directory (`src/main.tsx`, `src/assets/...`) that is **not present** in this checkout. Before assuming frontend code exists, check with `find . -name src -maxdepth 1` — do not invent or assume the shape of components/pages that aren't there. When building out the frontend, `index.html`'s script entry point (`/src/main.tsx`) defines where the React app must be bootstrapped from.

## Commands

- `npm install` — install dependencies
- `npm run dev` — start the dev server (`tsx server.ts`; Express + Vite middleware mode, on port 3000)
- `npm run lint` — typecheck only, no emit (`tsc --noEmit`); there is no separate test suite or test runner configured
- `npm run build` — builds the Vite frontend, then bundles `server.ts` into `dist/server.cjs` via esbuild (CJS, node platform, external packages)
- `npm run start` — run the production build (`node dist/server.cjs`)
- `npm run preview` — Vite preview of the built frontend only (no backend API)
- `npm run clean` — remove `dist/`

There are no lint (ESLint) or formatting scripts beyond the TypeScript check, and no test framework is configured.

## Environment

- `GEMINI_API_KEY` — required for the Gemini API calls in `server.ts`; AI Studio injects this at runtime from user secrets. Locally, set it in `.env` (or `.env.local`, both gitignored) — see `.env.example`.
- `APP_URL` — the deployed Cloud Run URL, injected automatically by AI Studio; used for self-referential links/OAuth callbacks.
- `DISABLE_HMR` — when set to `"true"`, disables Vite HMR (used by AI Studio to prevent flicker during agent edits to files); do not remove this check from `vite.config.ts`.

## Architecture

**Single Express process serves both the API and the frontend** (`server.ts`):
- In development, Express mounts the Vite dev server as middleware (`middlewareMode: true`, `appType: "spa"`), so `npm run dev` is the only process needed — there's no separate frontend/backend dev server split.
- In production (`NODE_ENV=production`), Express serves the static `dist/` build and falls back to `dist/index.html` for all non-API routes (SPA routing).
- `@google/genai`'s `GoogleGenAI` client is created lazily (`getGeminiClient()`) so the server can boot without a Gemini key; the key is only required when the chat endpoint is actually hit.

**Chat endpoint `POST /api/sokhna`**: powers "Sokhna," the Gemini-backed virtual assistant persona for the app. Its entire behavior (tone, Ocass business facts — addresses, phone, download links, role descriptions, module list) is defined in the `SOKHNA_SYSTEM_INSTRUCTION` string in `server.ts`. When Ocass business facts change (contact info, download links, modules, pricing model, etc.), update that system instruction — it's the single source of truth for what the assistant says, and there's no separate CMS/config for it. The endpoint:
  - Accepts `{ message, history }`, converts `history` into Gemini `contents` (`role: "user"|"model"`, `parts: [{text}]`), appends the current message, and calls `client.models.generateContent`.
  - Has an explicit fallback path: if the Gemini call fails because `GEMINI_API_KEY` is missing, it still returns a hardcoded informational reply (not a 500) with Ocass contact info — preserve this graceful-degradation behavior if you touch this handler.

**Path alias**: `@/*` resolves to the repo root (configured identically in both `vite.config.ts` and `tsconfig.json` — keep them in sync if changed).

**Styling**: Tailwind CSS v4 via `@tailwindcss/vite` plugin (no separate `tailwind.config.js`/PostCSS config needed for v4's Vite integration).

**Language/locale**: The product and its assistant persona are French/Wolof-first (Touba, Sénégal audience); UI copy and the Sokhna system instruction mix French, Wolof, and English intentionally — don't default to English-only copy when adding user-facing text.
