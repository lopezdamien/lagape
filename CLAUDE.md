# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

L'AGAPE is a bistronomic restaurant website (Geneva, Switzerland) with two distinct parts:
1. **Static site** (root) — HTML/CSS/JS vitrine pages
2. **Dashboard** (`lagape-dashboard/`) — React admin back-office with an Express API

## Development Commands

### Static site
```bash
python3 -m http.server 8080   # Serve from repo root
```

### Dashboard (from `lagape-dashboard/`)
```bash
npm run dev      # Starts both Vite (port 5173) + Express API (port 3001) via concurrently
npm run server   # API only (node server/index.js)
npm run build    # Production build
```

## Architecture

### Static site (root)
Vanilla HTML/CSS/JS, no build step. CSS variables defined in each page's `<style>` block.
- Palette: `--bleu-nuit: #0d1b2a`, `--or: #c9a96e`, `--argent: #b8c4d0`
- Fonts: Cormorant Garamond (serif) + Montserrat (sans-serif) via Google Fonts

### Dashboard (`lagape-dashboard/`)

**Frontend** — React 18 + React Router v6, Vite. No UI library; custom components only.
- `src/contexts/AuthContext.jsx` — Auth state, token stored in `localStorage` as `lagape_token`
- `src/lib/api.js` — `apiFetch()` wrapper that injects Bearer token on every request
- `src/pages/` — One folder per section (Carte, Galerie, Blog), plus Dashboard/Accueil/Login
- `src/styles/theme.css` — CSS variables shared across the dashboard

**Backend** — Two runtime environments:

| Environment | Entry point | Data storage |
|---|---|---|
| Local dev | `server/index.js` (Express, port 3001) | JSON files in `data/*.json` |
| Vercel | `api/` (serverless functions) | Vercel KV (Redis via `@vercel/kv`) + Vercel Blob for images |

Server routes mirror the API structure: `/api/carte`, `/api/galerie`, `/api/blog`, `/api/siteconfig`.

**Auth** — Password-based. `POST /api/auth` with `{ password }` returns an HMAC-SHA256 signed token `{expires}.{sig}` valid 30 days. Server secret via `DASHBOARD_SECRET` env var (falls back to `lagape-secret-fallback` in dev).

**Data** — Local JSON files: `data/carte.json` (plats, formules, vins), `data/galerie.json`, `data/blog.json`, `data/siteconfig.json`. Writes use a `.tmp` + rename pattern for atomicity.

**Image uploads** — Local: `multer` → `uploads/` directory. Production: Vercel Blob (`@vercel/blob`).

### Vercel deployment
`api/` contains serverless equivalents of all `server/routes/`. `api/_redis.js` initializes the KV connection. `api/_auth.js` is a shared auth middleware. `api/seed.js` seeds KV from local JSON files.
