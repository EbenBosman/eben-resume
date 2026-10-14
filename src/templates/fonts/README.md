# PDF resume fonts

Embedded into the PDF template as base64 `@font-face` rules by `src/lib/resume-html.ts`, so the
PDF renders identically everywhere (Heroku's Chrome has no Helvetica/Arial and would otherwise fall
back to DejaVu) and the template stays self-contained (no network requests).

| File                                 | Family      | Source                          | License                   |
| ------------------------------------ | ----------- | ------------------------------- | ------------------------- |
| `ubuntu-latin-400-normal.woff2`      | Ubuntu      | `@fontsource/ubuntu@5.3.0`      | Ubuntu Font Licence 1.0   |
| `ubuntu-latin-700-normal.woff2`      | Ubuntu      | `@fontsource/ubuntu@5.3.0`      | Ubuntu Font Licence 1.0   |
| `electrolize-latin-400-normal.woff2` | Electrolize | `@fontsource/electrolize@5.3.0` | SIL Open Font License 1.1 |

These are the Cesium 455 brand faces used by ataru.io. Licences:
<https://ubuntu.com/legal/font-licence> and <https://openfontlicense.org>.
