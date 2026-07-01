# AI Resume — Platform Evolution Plan

**Goal:** Move off Supabase (DB) onto direct Postgres, replace Supabase Auth with Better Auth (email/password + email verification + Google OAuth), add persistence (save/dashboard), a job application tracker, and ultimately a fully agentic "tailor → outreach → track → follow-up" workflow.

**Status legend:** `[ ]` not started · `[~]` in progress · `[x]` done

---

## Guiding Principles

- Ship in vertical slices — every phase should leave the app in a fully working, deployable state.
- Don't break `/builder`, `/optimizer`, `/ats-checker` while migrating auth/DB underneath them.
- Keep AI prompt/response contracts (the JSON shapes already used in `app/*/actions.ts`) stable so the frontend components (`resume-preview.tsx`, `manual-resume-editor.tsx`) don't need parallel rewrites.
- Prefer additive schema changes; avoid destructive migrations once real user data exists.

---

## Phase 0 — Foundations: Postgres + Better Auth

**Objective:** Replace Supabase (DB + Auth) with direct Postgres + Better Auth, with zero regression in login/logout/session behavior.

### 0.1 Database
- [ ] Provision Postgres (Neon, Railway, RDS, or self-hosted — Neon recommended for serverless/edge friendliness with Next.js).
- [ ] Add `drizzle-orm` + `drizzle-kit` (or Prisma, but Drizzle keeps the TS-first, lightweight feel of this codebase).
- [ ] Create `lib/db/schema.ts` with initial tables:
  - `user` (id, name, email, emailVerified, image, createdAt, updatedAt) — shape required by Better Auth.
  - `session`, `account`, `verification` — standard Better Auth tables.
- [ ] Create `lib/db/index.ts` exporting a singleton Drizzle client (`postgres-js` or `pg` driver).
- [ ] Add `drizzle.config.ts`, `pnpm db:generate` / `pnpm db:migrate` scripts to `package.json`.
- [ ] New env vars: `DATABASE_URL`.

### 0.2 Auth (Better Auth)
- [ ] `pnpm add better-auth`
- [ ] `lib/auth/auth.ts` — Better Auth server instance:
  - Email/password provider with `requireEmailVerification: true`.
  - Google OAuth provider (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`).
  - Email delivery via **Resend** (`RESEND_API_KEY`) for verification + password reset emails — implement `sendVerificationEmail` / `sendResetPassword` callbacks.
  - Drizzle adapter pointed at `lib/db`.
- [ ] `lib/auth/client.ts` — Better Auth React client (`createAuthClient`) for use in `app/login/page.tsx` and any client components needing session state.
- [ ] `app/api/auth/[...all]/route.ts` — Better Auth's catch-all Next.js route handler.
- [ ] Replace `proxy.ts` / `utils/supabase/proxy.ts` middleware logic with Better Auth's session-cookie check (`getSessionCookie` in middleware for fast redirect, full `auth.api.getSession` in server components/actions where needed).
- [ ] Rewrite `app/login/page.tsx` + `app/login/actions.ts`:
  - Email/password sign in & sign up forms (reuse existing `react-hook-form` + `zod` patterns already in the repo).
  - "Continue with Google" button.
  - "Resend verification email" affordance if `emailVerified` is false.
- [ ] Remove `app/auth/callback/route.ts` (Supabase-specific) once Better Auth's OAuth callback route replaces it.
- [ ] Delete `utils/supabase/*` once nothing references it; remove `@supabase/ssr` and `@supabase/supabase-js` from `package.json`.
- [ ] Update `components/navbar.tsx` to read session from Better Auth client instead of Supabase client.

### 0.3 Cleanup / validation
- [ ] Manual test matrix: sign up → verify email → login → logout → Google OAuth login → session persists across refresh → protected route redirect works.
- [ ] Update `README.md` env var section and Tech Stack section (swap Supabase → Postgres + Better Auth + Resend).

**Exit criteria:** Users can register with email (with real verification email via Resend), log in with Google, and sessions are Postgres-backed — with no remaining Supabase dependency.

---

## Phase 1 — Persistence: Save & Dashboard

**Objective:** Resumes generated in `/builder` or `/optimizer` can be saved, listed, reopened, and edited — not just kept in `localStorage`.

### 1.1 Schema additions (`lib/db/schema.ts`)
```
resumes
  id            uuid pk
  userId        fk -> user.id
  title         text                 -- user-editable label, default "Untitled Resume"
  templateType  text                 -- modern | classic | minimalist | executive | compact
  data          jsonb                -- the resume JSON shape already produced by actions.ts
  sourceType    text                 -- "builder" | "optimizer" | "manual"
  createdAt     timestamptz
  updatedAt     timestamptz
```

### 1.2 Server actions (`app/dashboard/actions.ts`)
- [ ] `saveResume(data, templateType, sourceType, title?)` — insert.
- [ ] `updateResume(id, data, templateType, title?)` — update, scoped to `userId`.
- [ ] `listResumes()` — list current user's resumes, newest first.
- [ ] `getResume(id)` / `deleteResume(id)` / `duplicateResume(id)`.

### 1.3 UI
- [ ] `app/dashboard/page.tsx` — grid/list of saved resumes (title, template thumbnail preview via `ResumePreview` at small scale, last updated, quick actions: Open in Builder, Open in Optimizer, Duplicate, Delete).
- [ ] Add a persistent "Save" button in `app/builder/page.tsx` and `app/optimizer/page.tsx` result views (next to existing template picker), replacing the current `localStorage`-only "pendingBuilderResume"/"pendingOptimizerResume" pattern with a real save-to-DB call, guarded behind auth (prompt login if unauthenticated).
- [ ] Add "My Resumes" link to `components/navbar.tsx`.

**Exit criteria:** A logged-in user can generate a resume, click Save, see it in `/dashboard`, and reopen/edit it later.

---

## Phase 2 — Job Application Tracker

**Objective:** Users can attach a job description to a tailored resume and track application status over time.

### 2.1 Schema additions
```
jobs
  id                uuid pk
  userId            fk -> user.id
  resumeId          fk -> resumes.id (nullable — job can exist before a resume is tailored)
  company           text
  role               text
  jobDescription    text
  status            text   -- saved | applied | interviewing | offer | rejected
  atsScore          int    -- last known score from ats-checker, nullable
  appliedAt         timestamptz nullable
  createdAt         timestamptz
  updatedAt         timestamptz
```

### 2.2 Server actions (`app/jobs/actions.ts`)
- [ ] `createJob({ company, role, jobDescription, resumeId? })`
- [ ] `updateJobStatus(id, status)`
- [ ] `linkResumeToJob(jobId, resumeId)`
- [ ] `listJobs()` / `getJob(id)` / `deleteJob(id)`

### 2.3 UI
- [ ] `app/jobs/page.tsx` — table/kanban (columns = status) of tracked jobs with company, role, ATS score badge, linked resume link.
- [ ] `app/jobs/[id]/page.tsx` — job detail: JD text, linked resume preview, status changer, history of resume versions used for this job.
- [ ] In `app/optimizer/page.tsx`, after a successful optimization, add a "Save this job application" CTA that creates a `jobs` row (using the JD already pasted in the form) linked to the newly saved resume — bridges Phase 1 + Phase 2.
- [ ] In `app/ats-checker/page.tsx`, after analysis, offer "Track this job" similarly, storing `atsScore`.

**Exit criteria:** A user can go JD → tailor resume → save → track status changes through to offer/rejected, all visible in one dashboard.

---

## Phase 3 — Agentic Layer, Step 1: Outreach Generation

**Objective:** After tailoring a resume to a job, the system proactively offers to draft recruiter outreach + a cover letter, tied to that `jobs` record.

### 3.1 Schema additions (extend `jobs` or new table)
```
job_documents
  id            uuid pk
  jobId         fk -> jobs.id
  type          text   -- "cover_letter" | "outreach_email"
  content       text
  createdAt     timestamptz
```

### 3.2 AI action (`app/jobs/agent-actions.ts`)
- [ ] `generateCoverLetter(jobId)` — reuse resume `data` (from linked `resumes.data`) + `jobDescription`, same OpenAI client pattern as `app/optimizer/actions.ts` (JSON-mode where useful).
- [ ] `generateOutreachEmail(jobId, { recipientRole?: "recruiter" | "hiring_manager" })` — short, personalized email referencing 1-2 resume highlights relevant to the JD.
- [ ] Store results in `job_documents`; allow regenerate.

### 3.3 UI
- [ ] On job detail page (`app/jobs/[id]/page.tsx`): "Generate Cover Letter" / "Generate Outreach Email" buttons, editable textareas for the result, copy-to-clipboard, PDF export for the cover letter (reuse existing print/PDF approach from resume preview).
- [ ] Prompt flow right after optimizer success: "Want a cover letter and outreach email for this role too?" → deep-links into the job detail page with generation pre-triggered.

**Exit criteria:** From a single JD input, a user gets a tailored resume + cover letter + outreach email, all stored against one `jobs` record.

---

## Phase 4 — Agentic Layer, Step 2: Follow-up & Response Handling

**Objective:** Track what happens after the application is sent, and have the system prompt useful next actions.

### 4.1 Schema additions
```
job_events
  id            uuid pk
  jobId         fk -> jobs.id
  type          text   -- "applied" | "recruiter_reply" | "interview_scheduled" | "followup_sent" | "offer" | "rejected"
  note          text nullable
  eventDate     timestamptz
  createdAt     timestamptz
```

### 4.2 Server actions
- [ ] `logJobEvent(jobId, type, note?, eventDate?)`
- [ ] `getJobTimeline(jobId)` — ordered events for display.
- [ ] `suggestNextAction(jobId)` — rule-based first pass (e.g. "applied > 7 days ago, no reply logged" → suggest follow-up email draft), can be upgraded to an AI call later.

### 4.3 AI action
- [ ] `generateFollowUpEmail(jobId)` — similar pattern to outreach email, conditioned on days-since-applied and any recruiter reply text the user pastes in.
- [ ] Structured intake form when user logs "Got a reply/interview": role-specific follow-up questions (interview round, format, date) stored as a `job_events` note.

### 4.4 UI
- [ ] Timeline component on job detail page rendering `job_events`.
- [ ] "Log an update" quick-action button set (Applied / Got a reply / Interview scheduled / Offer / Rejected) that opens the appropriate small form.
- [ ] Dashboard-level nudge banner: "3 applications haven't had a follow-up in 7+ days — review them" (computed from `suggestNextAction` across all jobs).

**Exit criteria:** Users can log the full lifecycle of an application and get proactive, rule-based nudges for next steps.

---

## Phase 5 — Full Agent Orchestration

**Objective:** Unify Phases 3-4 into a single conversational per-job agent rather than isolated buttons/forms.

- [ ] Define an explicit state machine per job: `drafted → tailored → outreach_sent → awaiting_response → interviewing → offer/rejected`, each transition aware of which documents/events exist.
- [ ] Introduce a lightweight agent runner (could be a lean loop using the existing `utils/ai/openai.ts` client with function-calling/tool-style prompts) that, given a job's full context (resume + JD + documents + events), can decide the next best action and either take it automatically (e.g. draft a follow-up) or ask the user a clarifying question.
- [ ] Chat-style UI on the job detail page ("Ask your job agent") backed by that runner, with the structured actions from Phases 3-4 exposed as callable "tools" the agent can invoke (generate cover letter, log event, update status, generate follow-up).
- [ ] Guardrails: agent never sends real emails/messages on the user's behalf without explicit confirmation; all generated content lands in an editable draft state first.

**Exit criteria:** A user can say "I applied to this job two weeks ago and haven't heard back" inside a job's agent chat and get a drafted follow-up email plus an updated timeline entry, without manually finding the right button.

---

## Cross-cutting Tasks

- [ ] **Env vars to add:** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`. Keep `OPENAI_API_KEY` (used for the OpenAI client in `utils/ai/openai.ts`, model `gpt-5.4-mini`).
- [ ] **Type safety:** the codebase currently uses `any` broadly for resume data (`resume-preview.tsx`, `manual-resume-editor.tsx`, all `app/*/actions.ts`). Once schema stabilizes in Phase 1, introduce a shared `types/resume.ts` interface and thread it through instead of `any` — do this opportunistically, not as a blocking task.
- [ ] **Testing:** add at least smoke-level tests around auth flows (Phase 0) and the save/list/delete resume actions (Phase 1) before building the agentic layers on top.
- [ ] **Deployment:** confirm hosting target supports Postgres connections (edge runtime vs Node runtime considerations for Drizzle + `pg`/`postgres-js`), and update deployment docs accordingly.

## Suggested Order of Execution

1. Phase 0 (blocking — everything else needs real users + DB)
2. Phase 1 (persistence is required before a "job" can reference a "resume")
3. Phase 2 (tracker; highest standalone user value after persistence)
4. Phase 3 (first agentic capability, still just AI content generation, low risk)
5. Phase 4 (event tracking + nudges, still deterministic/rule-based)
6. Phase 5 (true agent orchestration, highest complexity — do last once the underlying data model has proven itself)
