# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal resume site for Eben Bosman (ebenbosman.com). A single Next.js (App Router) application — the interactive web resume, the PDF generator, and the contact form all live in one app. There is **no separate backend**. Deploys go to Heroku automatically on push to `master` on GitHub; Node is pinned to 26.x (`engines` + `.nvmrc`).

## Commands

```sh
npm run dev              # Dev server at http://localhost:3000
npm run build            # Production build (output: 'standalone', for Heroku)
npm start                # Run the standalone production server
npm run lint             # next lint (eslint, includes prettier rules)
npm run prettier         # Format all files in place
npm run prettier:check   # Check formatting without writing
```

There is no test suite.

## Environment

Copy `.env` to `.env.local` and fill in values (`.env.local` takes precedence, falls back to `.env`). Required keys, used only by the contact form (`/api/message`):

- `RESEND_API_KEY` — Resend API key
- `MAILBOX_TO_MONITOR` — recipient address for contact-form submissions

## Architecture

**`src/data/resume.json` is the single source of truth** for all resume content, typed by the `ResumeData` interface in `src/types/resume.ts`. Keep the JSON and the interface in sync when adding/removing fields. This one file feeds three independent rendering paths:

1. **Web UI** — `src/app/page.tsx` imports `resume.json`, casts it to `ResumeData`, and composes `TopNav`, the section components in `src/components/content/` (Hero — which holds the `#about` anchor and the first `about` paragraph — Profile, AtaruSection, Education, Experience, Skills) and `Footer`, all inside `ContactProvider`. HUD primitives (`HudButton`, `BackgroundFx`, `SectionHead`) live in `src/components/hud/`.

2. **PDF download** — `GET /api/pdf-resume` (`src/app/api/pdf-resume/route.ts`, POST kept for compatibility) renders the resume HTML and prints it to a PDF with Puppeteer. Linked from the nav, hero and footer. In production the PDF is generated once per process and cached (concurrent requests share one Chrome run); in development it is regenerated on every request.

3. **HTML preview** — `src/app/resume-preview/page.tsx` renders the **same** HTML, then extracts the `<style>` and `<body>`, scopes the global CSS to a `.resume-scope` wrapper, and overrides the page size to US Letter for on-screen viewing.

Both use `renderResumeHtml()` in `src/lib/resume-html.ts`, the single place that registers the `replace` Handlebars helper and compiles `src/templates/template.hbs` against `resume.json`. Change how the template is fed data there. The template is intentionally self-contained: no external requests; its Ubuntu/Electrolize fonts (`src/templates/fonts/`) are embedded as `@font-face` data URLs by `resume-html.ts`, so the PDF renders identically on Heroku. Edits to resume _layout/styling_ for the PDF go in `template.hbs`; edits to the _web_ layout go in the React components — they do not share markup.

The site's public origin is `SITE_URL` in `src/lib/site.ts`, derived from `basics.website` in `resume.json` (`www.ebenbosman.com`); metadata, robots, sitemap, JSON-LD and the PDF link all follow it.

The contact form posts to `POST /api/message`, which validates the payload server-side (email format, 50–5000 character message), drops submissions that fill the hidden `company` honeypot, rate-limits per IP in memory, and sends email via Resend (from `no-reply@ebenbosman.com`). The form and its state live in `src/components/contact/ContactProvider.tsx`; `ContactButton` / `useContact()` open it.

## SEO & routing

- `src/app/robots.ts` and `src/app/sitemap.ts` generate robots.txt/sitemap; `/resume-preview` and `/api/` are disallowed and `resume-preview` is set `index: false`.
- `src/components/JsonLd.tsx` injects structured data on the home page.
- Site metadata is centralized in `src/app/layout.tsx`; the favicon is the `src/app/favicon.ico` file convention.
- `next.config.mjs` (production only) redirects plain HTTP (Heroku's `X-Forwarded-Proto: http`) and the `eben-resume.herokuapp.com` host to `SITE_URL`, and sets security headers: HSTS, a CSP (`script-src` needs `'unsafe-inline'` for Next's inline bootstrap scripts; any new third-party script/font/API origin must be added to it), `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`. `X-Powered-By` is off.

## Conventions

- Next.js 16 docs for the installed version ship in `node_modules/next/dist/docs/`; check them before using unfamiliar or recently changed APIs (training data may predate them). `agentRules: false` in `next.config.mjs` stops `next dev` from writing a generic `AGENTS.md`.
- Styling is Tailwind CSS v4 (`@tailwindcss/postcss`) with the **Cesium 455 design system** ported from ataru-cesium (`src/theme/tokens.css` + its public HUD layer): tokens, type primitives (`t-eyebrow`, `t-h1`…), `hud-btn`, `nav-link` and FX classes are in `src/app/globals.css`; fonts (Ubuntu, Ubuntu Mono, Electrolize, Azeret Mono) via `next/font` in `src/lib/fonts.ts`. Small accent text uses `--accent-text` (dark `#6685ff`), never the dark `--accent` `#3d6bff` (fails AA). Theme switching via `next-themes` (`src/app/providers.tsx`); the PDF is always light.
- **Motion** (MOTION block at the end of `globals.css`, components in `src/components/hud/Motion.tsx`, head boot script in `src/lib/motion.ts`): smooth scroll, nav scroll-progress line, View Transition theme reveal (`TopNav`), modal/drawer fade-scale, hero load-in (`.hero-in` lines wipe in place left→right, the lead paragraph decodes via `DecodeParagraph` with word widths locked so it never re-wraps, `.glitch-in` photo, `--d` = step), staggered `[data-reveal]` lists (`--i`; `RevealObserver` adds `.is-revealed`), `Decode` (once, on entering view) on section eyebrows, the hero eyebrow, `// MODULES`, skill group titles and Profile fact labels — not on numbers. Below the large-screen query, experience cards recede on exit and the hero eases away (view-timeline exit ranges; the hero uses `overflow: clip`, since `overflow: hidden` would make it its own scroll container and freeze `view()`). On screens ≥1024px wide and ≥760px tall the hero pins (`.hero-pin`, dims via `.hero-dim`) under the `.over-hero` sheet, and the experience cards stack via `CardDeck` (`src/components/hud/CardDeck.tsx`): scroll-driven transforms, not CSS sticky (sticky can't land the last card and pushes taller cards up early); covered cards are clipped to the card on top using exact fractional heights plus a 2px bleed. The nav wordmark types in on load (`.type-char`, CSS only) behind a static `›` with a blinking `_`. Rules: everything off for `prefers-reduced-motion`; items only start hidden when the head script set `html.motion-ready` (no-JS shows everything; a 4s failsafe undoes it); scroll-driven effects behind `@supports (animation-timeline: …)`. The hero loses focus as it scrolls out (blur up to 18px, CSS scroll-driven) and the photo glitches via `ScrollGlitchImage` (JS: more often and harder the further you scroll down, never while scrolling back up). On load the photo's corner ticks snap in first, then the image glitches in inside its clipped frame. Phones show no photo (tablet and up only). The modal's close X spins on hover. The contact modal glitches in and draws its corner ticks (`.modal-dialog.is-open`, `.modal-tick`). Cursors follow Cesium's cursor contract (base layer of `globals.css`): pointer on actionable, not-allowed when disabled, progress when `aria-busy`. Safety nets (from the full code review): a 0.7s CSS failsafe shows the lead paragraph as plain text if hydration is slow (LCP), `HeroFocusGuard` scrolls back to the pinned hero when one of its controls is keyboard-focused, `CardDeck` compensates the scroll position once after it changes the page height (fragments/scroll restore), the deck frame uses `overflow: clip`, and `@media print` shows every revealed item and flattens the deck. Contact is reachable from the desktop nav and footer. Keep one effect per area — don't add parallax or decode on numbers on top.
- Prettier: single quotes, semicolons, trailing commas, `printWidth` 100, `tabWidth` 2. Run `npm run prettier` before committing.
- Import sorting is enforced (`eslint-plugin-simple-import-sort`).
- TypeScript `strict` is **off** — be deliberate about null/undefined handling.

## Working agreements (rules for Claude)

These are durable rules for this repo — extend this list as new ones emerge.

- **Never `git commit` or `git push` without Eben's explicit consent — every time.** This is his top rule. Make file edits freely; stop and ask before writing history or pushing.

## Resume content & ATS

The resume exists to pass **AI/ATS resume scoring** (the systems that parse and _rank_ an uploaded resume before a human reads it). The target is **US (Boston/remote) Senior/Staff Full-Stack, Senior Frontend, and Eng Lead roles**, with a deliberate **pivot toward AI-industry roles** (de-emphasizing .NET). Full playbook + keyword banks: **`docs/RESUME-ATS-STRATEGY.md`**.

- **`resume.json` is the source of truth** for both the site and the PDF. Content edits flow to both.
- **The PDF (`template.hbs`) is intentionally a single-column, ATS-safe document. Do NOT reintroduce** multi-column/sidebar layouts, layout tables, images/icons/logos as content, skill "pills", sub-10px fonts, or contact info in headers/footers — these break parsers (e.g. Lever silently drops sidebars). Tasteful flair (one accent color, the monospace heading accent, whitespace) is fine because it doesn't touch the text layer. The PDF is **US Letter** and may run to **2 pages**.
- **The website may keep its rich design** — it has no ATS constraints (it's for humans who click the link).
- **US resume hygiene:** no photo, date of birth, gender, or marital status in the resume _document_ (bias/ADEA risk). A photo on the _website_ is fine.
- **Only claim AI skills Eben can defend in an interview.** Current honest set: AI-assisted development, prompt engineering, some Anthropic/Claude API integration, local LLMs (Ollama/LM Studio), Python. Expand after his AI course — don't overclaim ML expertise.

### Refresh cadence

- **Per application (highest ROI):** tailor the Skills section + 3–5 bullets to mirror the specific job description's keywords and title.
- **Every ~6 months (or sooner if the search stalls):** light review of ATS trends + refresh wording.
- **Annually:** re-run the deep research and update `docs/RESUME-ATS-STRATEGY.md`.
