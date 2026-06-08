# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal resume site for Eben Bosman (ebenbosman.com). A single Next.js (App Router) application — the interactive web resume, the PDF generator, and the contact form all live in one app. There is **no separate backend**; ignore the README's references to `npm run server` and a port-5000 backend (those scripts/config no longer exist).

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

- `MAILERSEND_API_KEY` — MailerSend API key
- `MAILBOX_TO_MONITOR` — recipient address for contact-form submissions

## Architecture

**`src/data/resume.json` is the single source of truth** for all resume content, typed by the `ResumeData` interface in `src/types/resume.ts`. Keep the JSON and the interface in sync when adding/removing fields. This one file feeds three independent rendering paths:

1. **Web UI** — `src/app/page.tsx` imports `resume.json`, casts it to `ResumeData`, and passes typed props to `Sidebar` and `Content`. `Content` composes the section components in `src/components/content/` (About, AtaruSection, Experience, Education, Skills). Shared primitives live in `src/components/ui/`.

2. **PDF download** — `POST /api/pdf-resume` (`src/app/api/pdf-resume/route.ts`) compiles the Handlebars template `src/templates/template.hbs` against `resume.json` and renders it to a PDF with `html-pdf-node` (Puppeteer under the hood). Triggered from `Sidebar.tsx`.

3. **HTML preview** — `src/app/resume-preview/page.tsx` compiles the **same** `template.hbs`, then extracts the `<style>` and `<body>`, scopes the global CSS to a `.resume-scope` wrapper, and overrides the page size to US Letter for on-screen viewing.

**Critical: the PDF route and the preview page duplicate the template-setup logic** — both register the `replace` Handlebars helper and inject `ataruLogoBase64` (the `src/images/fav-sm.png` logo read as a base64 data URI). When changing how the template is fed data, update **both** files. Edits to resume _layout/styling_ for the PDF go in `template.hbs`; edits to the _web_ layout go in the React components — they do not share markup.

The contact form posts to `POST /api/message`, which sends email via MailerSend (from `no-reply@ataru.it`). Also triggered from `Sidebar.tsx`.

## SEO & routing

- `src/app/robots.ts` and `src/app/sitemap.ts` generate robots.txt/sitemap; `/resume-preview` and `/api/` are disallowed and `resume-preview` is set `index: false`.
- `src/components/JsonLd.tsx` injects structured data on the home page.
- Site metadata is centralized in `src/app/layout.tsx`.

## Conventions

- Styling is Tailwind CSS v4 (`@tailwindcss/postcss`); global styles in `src/app/globals.css`. Theme switching via `next-themes` (`src/app/providers.tsx`).
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
