---
name: verify
description: Build, run, and drive ebenbosman.com (this repo) to verify a change end-to-end at its surfaces
---

# Verifying changes in eben-resume

## Build & launch

```sh
npm install            # only if package.json changed (Puppeteer downloads Chrome, ~3 min)
npm run dev            # Turbopack, ready in ~3 s at http://localhost:3000
npm run build; npm start   # prod check: standalone server (what Heroku's Procfile runs)
```

No test suite exists. `npm run lint` (`eslint .`, includes prettier) — expect 3 pre-existing
"unused eslint-disable" warnings in `Sidebar.tsx`; only new errors matter.

## Surfaces to drive

One `resume.json` feeds three independent surfaces — a data change must be checked on all three:

1. **Web UI** — `http://localhost:3000`. Sections: `#about`, `#ataru` (Ataru/CESIUM hero),
   `#certificates`, `#experience`, `#skills`. Theme starts on system preference; the sidebar
   button `button[title="Toggle Dark Mode"]` cycles it (may need two clicks from "system").
2. **HTML preview** — `GET /resume-preview` (Handlebars template path, no Puppeteer).
3. **PDF** — `GET /api/pdf-resume` → expect `200 application/pdf`, ~100–120 KB, takes a few
   seconds (launches Puppeteer's local Chrome).

Favicon is the `src/app/favicon.ico` file convention → check `GET /favicon.ico`.

## Gotchas

- Stopping a backgrounded `npm run dev` kills the shell wrapper but can orphan the node child,
  which keeps holding port 3000 (next run silently binds 3001 then exits). Check
  `Get-NetTCPConnection -LocalPort 3000 -State Listen` and `taskkill /PID <pid> /F`.
- Local clone is often behind `origin/master` — `git fetch origin` before judging what exists.
- `git fetch heroku` hangs; don't fetch that remote.
- Contact form (`POST /api/message`) sends real email via MailerSend — don't drive it live.
