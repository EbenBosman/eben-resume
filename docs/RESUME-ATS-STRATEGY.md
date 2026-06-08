# Resume & ATS Strategy

> Research-backed playbook for keeping Eben's resume competitive against AI/ATS
> resume-scoring systems. Compiled from a multi-agent web research sweep
> (90+ sources, 2025–2026). **Re-review every ~6 months; re-run the full
> research annually.** See the refresh cadence in `CLAUDE.md`.

Target: **US (Boston / remote-US)**, Senior/Staff Full-Stack + Senior Frontend +
Eng Lead roles, with a deliberate **pivot toward AI-industry roles** (de-emphasize
.NET over time).

---

## 1. How AI/ATS resume scoring actually works

**The document you upload is what gets parsed and ranked — not your website.** That
is why the PDF (`template.hbs`) is the highest-leverage surface.

- **Parsing:** ATS use OCR + NLP to extract structured fields (contact, work
  history, skills, education) into JSON. Garbage in = garbage ranking.
- **Matching has shifted from pure keywords to semantics.** Modern systems
  (Eightfold, iCIMS, Greenhouse) use embeddings (BERT/Sentence-BERT) + cosine
  similarity, so synonyms partially count. **But** exact keywords and exact job
  titles still carry heavy weight, and legacy systems (Taleo, SAP) are still
  literal keyword matchers.
- **Approximate scoring weights** (rarely published; synthesized from sources):
  - Keyword / skill match to the job description: **~40–50%**
  - Formatting / parseability (can it even be read): **~25–35%**
  - Recency of experience + title alignment: **~10–20%**
- **Title matching is disproportionately powerful** — including the exact target
  job title has been reported to lift interview rate dramatically. Mirror the
  posting's title.
- **Ranking, not rejection, is the real gate.** Only ~8% of recruiters configure
  content-based auto-reject, but ~99% use keyword filters to _sort_. Recruiters
  read the top ~20 of 200. If you're not in the top quartile by score, you're
  effectively invisible — without ever being formally "rejected."

### Myths to ignore

- _"75% of resumes are never seen by a human"_ — fabricated (2012 sales pitch). Most
  applications are seen; the problem is **ranking order**, not a robot wall.
- _"Formatting doesn't matter if keywords are right"_ — false. ~23% of rejections
  trace to parsing/formatting failures.

### Where it's applied

Initial screen (rank/sort), recruiter Boolean/semantic search & sourcing, and
review-priority ordering. Video-interview AI (HireVue) is a separate, later stage.

### Major systems (US)

Workday (+ HiredScore; strict dates, weak on multi-column), Greenhouse (Sovren
parser; best bullet/skill extraction; sensitive to non-standard headings), Lever
(strongest PDF parser **but silently drops sidebars**), Taleo & SAP SuccessFactors
(legacy, strict, literal), iCIMS (strict validation, truncates skills), Ashby
(modern, AI-native), Eightfold/Beamery/SeekOut (embedding-based matching & sourcing).

---

## 2. Formatting rules (what makes a PDF parse cleanly)

These are the rules the rebuilt `template.hbs` follows. **Do not regress them.**

| Rule     | Do                                                                                     | Avoid                                                     |
| -------- | -------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| Layout   | **Single column**, top-to-bottom                                                       | Sidebars, multi-column, layout tables                     |
| Visuals  | Plain text                                                                             | Icons, logos, photos, skill "pills"/bars, charts          |
| Headings | Standard: "Professional Summary", "Skills", "Experience", "Education & Certifications" | "My Journey", "What I Bring"                              |
| Fonts    | Web-safe (Helvetica/Arial/Calibri), **body ≥ 10–11px**, headings 12–16px               | Decorative/custom fonts; <10px                            |
| Dates    | Consistent `Mon YYYY` or `YYYY`, on the role line                                      | Mixed formats, seasons, apostrophes (`'23`)               |
| Contact  | Plain text at **top of body**                                                          | Headers/footers (parsers skip them)                       |
| Skills   | Comma-separated text per group                                                         | Tables, columns, graphic bars                             |
| File     | Text-based PDF (or DOCX)                                                               | Image/scanned PDF (≈0% parse)                             |
| Length   | **2 pages OK** for ~19 yrs experience (51% of recruiters prefer 2)                     | 1 forced page that drops content                          |
| US norms | No photo / DOB / gender / marital status                                               | (ADEA/Title VII bias risk; some firms auto-reject photos) |

**Creativity is allowed** where it doesn't touch the text layer or reading order:
one accent color, strong hierarchy, a heading rule, whitespace, and a
distinctive-but-readable embedded font (we use a monospace "typewriter" accent on
the name + section titles — still plain, parseable text). Put _full_ creativity on
the **website**, which has no ATS constraints.

**Keyword density:** aim ~1–2% natural density, 60–80% coverage of a given JD's
keywords, 15–25 relevant terms. Over ~5% density or obvious stuffing gets penalized.
Keywords score highest **inside a bullet with context/outcomes**, not in a bare list.

---

## 3. Keyword banks (pull from these when tailoring per application)

> **Highest-ROI habit:** tailor the Skills section + 3–5 bullets to each job
> description (~15–20 min). Mirror the JD's exact tool names ("Salesforce" not "CRM").
> Only claim what you can defend in an interview.

**Languages:** TypeScript, JavaScript (ES6+), Python, SQL, C#
**Frontend:** React (Hooks, Server Components), Next.js (App Router, SSR/ISR),
Svelte, Tailwind CSS, Redux/Zustand, React Query, HTML5/CSS3, Web Vitals, accessibility
**Backend/APIs:** Node.js, Express/Nest.js, REST APIs, GraphQL, Microservices,
WebSockets, OAuth/JWT, Auth0, Stripe
**Databases:** PostgreSQL, MySQL, MS SQL Server, MongoDB, Redis, Cosmos DB; Prisma/ORM
**Cloud/DevOps:** AWS (EC2/Lambda/S3/RDS/Amplify), Azure, GCP, Docker, Kubernetes,
CI/CD, GitHub Actions, Jenkins, Terraform/IaC
**Architecture/practices:** System Design, Scalable Architecture, SOLID, Design
Patterns, Caching, Agile/Scrum, Code Review, TDD, Test (Jest, Playwright/Cypress)
**Leadership/staff:** Technical Leadership, Mentoring, Architecture Ownership,
Cross-functional Collaboration, Stakeholder Management, Delivery Ownership

### AI-pivot keywords (claim only what's true; expand after the AI course)

- **Safe now for Eben:** AI-Assisted Development (Claude Code, Cursor, Antigravity),
  Prompt Engineering, Anthropic/Claude API integration, Local LLMs (Ollama, LM Studio),
  Python.
- **Add once shipped/defensible:** RAG, Vector Databases (Pinecone/Weaviate/Chroma),
  Embeddings, Semantic Search, LangChain/LlamaIndex, AI Agents, MCP, fine-tuning.
- **Do NOT claim** without a data-science/ML background: "Machine Learning Engineer",
  "Deep Learning expert", "model training", "AI research".

**How to position the pivot honestly:** "Full-stack engineer building with LLM APIs /
expanding into AI-powered development" — not "AI Engineer." Anthropic/OpenAI value
production-shipping, systems thinking, and _public artifacts_ (a blog post, an
open-source contribution, a real shipped AI feature) over coursework. Ataru being
"built almost entirely through AI-assisted, prompt-driven development" is a credible
signal — lead with concrete projects.

### Bullet writing

- Pattern: **[Strong verb] + [what] + [how/tech] + [measurable outcome]**.
- Verbs: Architected, Engineered, Designed, Built, Led, Migrated, Optimized, Scaled,
  Spearheaded, Mentored. **Kill:** "Responsible for", "Helped with", "Worked on".
- Add numbers wherever real (latency %, users, $ saved, team size, uptime). Quantified
  bullets ~double interview rate. (Eben's bullets are currently qualitative — adding
  real metrics is the single biggest next upgrade.)
- **Buzzwords to drop:** rockstar, ninja, guru, synergy, "team player",
  "results-driven", "passionate" (show, don't claim).

---

## 4. Sources (selected)

- Eightfold AI engineering blog — talent-matching tech: https://eightfold.ai/engineering-blog/ai-powered-talent-matching-the-tech-behind-smarter-and-fairer-hiring/
- Harvard Business School, _Hidden Workers: Untapped Talent_: https://www.hbs.edu/managing-the-future-of-work/research/Pages/hidden-workers-untapped-talent.aspx
- ResumeAdapter, ATS statistics 2026 (75% myth debunked): https://www.resumeadapter.com/ats-statistics
- Jobscan — tables/columns & ATS, dates, templates, picture-on-resume: https://www.jobscan.co/blog/resume-tables-columns-ats/
- Resume Optimizer Pro — how parsers actually work / ranking signals / length: https://resumeoptimizerpro.com/blog/how-resume-parsers-actually-work
- EEOC — pre-employment inquiries (age/marital): https://www.eeoc.gov/pre-employment-inquiries-and-marital-status-or-number-children
- Stack Overflow 2025 Developer Survey (tech adoption): https://survey.stackoverflow.co/2025/technology
- Breaking into AI 2026 — what Anthropic/OpenAI/Meta hire for: https://dataexec.io/p/breaking-into-ai-in-2026-what-anthropic-openai-and-meta-actually-hire-for
- The Interview Guys — action verbs / buzzwords / ATS myth: https://blog.theinterviewguys.com/resume-action-verbs/

_(Full ~90-source set captured in the research run; the above are the load-bearing ones.)_
