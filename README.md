# eben-resume

The source for [ebenbosman.com](https://ebenbosman.com) — an interactive resume built with Next.js (App Router) and Tailwind CSS v4. One app serves the web resume, an ATS-safe PDF download, and a contact form. `src/data/resume.json` is the single source of truth for all resume content.

## Development

```sh
npm install
npm run dev          # http://localhost:3000
```

## Production build

```sh
npm run build        # standalone output; postbuild copies static assets into it
npm start            # runs node .next/standalone/server.js
```

## Surfaces

- `/` — the web resume
- `/api/pdf-resume` — generates the PDF with Puppeteer from `src/templates/template.hbs`
- `/resume-preview` — on-screen US Letter preview of the same template
- `/api/message` — contact form, sends email via MailerSend

## Environment variables

Used only by the contact form:

1. Copy the `.env` template to `.env.local` (git-ignored) and fill in the values:
   - `MAILERSEND_API_KEY` — MailerSend API key
   - `MAILBOX_TO_MONITOR` — recipient address for contact-form submissions

`.env.local` takes precedence, falling back to `.env`.

## Deployment

Deployed to Heroku (`git push heroku master`). The `Procfile` runs the standalone server; the Node version comes from `engines` in `package.json` (24.x, Heroku's Active LTS default). Chrome for the PDF route is supplied by the chrome-for-testing buildpack via `PUPPETEER_EXECUTABLE_PATH`.

## License

MIT
