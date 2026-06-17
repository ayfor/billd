# billd

Personal expense tracker — quick-add expenses, categories, budgets, spend projections. CAD, dark-first, pixel-art skin on a modern stack.

Built under the Twin Spruce Studio autonomous development pipeline: Notion holds designs and stories, this repo holds plans (`docs/plans/`), the living ERD (`docs/architecture/erd.md`), and code. One story = one PR.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma · Supabase Postgres · Auth.js v5 · Vitest + RTL + Playwright · Vercel

Design system: see the canonical Notion page and the `design-assets` branch (`design-system/` tokens, icons, component specs). Money is integer cents end to end.

## Getting started

A clean clone needs three things that aren't in the repo: the right Node version, a `.env` (it's gitignored), and a database with the schema migrated. Work through these in order.

### Prerequisites

- **Node 22+** — the toolchain (Next 16 / Turbopack, Vitest 4) requires it. The version is pinned in `.nvmrc` and enforced by `package.json` `engines`.
  ```bash
  nvm use        # reads .nvmrc → Node 22 (or install Node 22 another way)
  node -v        # should print v22.x or newer
  ```
- **A PostgreSQL database** — either a cloud Supabase project or a local Postgres instance (see step 3).

### Setup

1. **Install dependencies** (the `postinstall` hook runs `prisma generate`):
   ```bash
   npm install
   ```

2. **Create your environment file** and fill in both variables:
   ```bash
   cp .env.example .env
   ```
   - `DATABASE_URL` — your Postgres connection string (set in step 3).
   - `AUTH_SECRET` — required by Auth.js v5. Generate one with:
     ```bash
     npx auth secret          # writes AUTH_SECRET into .env
     # or: openssl rand -base64 33
     ```

3. **Provision the database** — pick one:

   **Option A — Supabase (matches production):** create a project, then copy the Postgres connection string (Settings → Database → Connection string → URI) into `DATABASE_URL`.

   **Option B — Local Postgres:** create a database and point `DATABASE_URL` at it:
   ```bash
   createdb billd_dev
   # .env → DATABASE_URL="postgresql://<user>:<password>@localhost:5432/billd_dev"
   ```

4. **Apply the migrations** (creates the tables — a fresh database is empty):
   ```bash
   npx prisma migrate deploy
   ```

5. **(Optional) Seed sample data:**
   ```bash
   npm run seed
   ```

6. **Start the dev server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and sign up at `/signup` — your first account is created with a hashed password and five default categories.

### Troubleshooting

| Symptom | Cause & fix |
|---|---|
| `SyntaxError: ... 'node:util' does not provide an export named 'styleText'` | Node is too old — switch to Node 22+ (`nvm use`). |
| Auth.js `MissingSecret` error | `AUTH_SECRET` not set in `.env` — see step 2. |
| `relation "User" does not exist` | Migrations not applied — run `npx prisma migrate deploy` (step 4). |
| Prisma adapter / connection errors on first page load | `DATABASE_URL` is unset or the database is unreachable — recheck steps 2–3. |

## Commands

| Purpose | Command |
|---|---|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Unit / integration tests | `npm run test` |
| E2E | `npm run test:e2e` |
| Build | `npm run build` |

## Testing

`npm run test` runs the unit, component, and integration suites; `npm run test:report` regenerates `docs/test-report.md`. Integration tests (`*.int.test.ts`) connect to the database in `DATABASE_URL`, so the same `.env` + applied migrations from [Getting started](#getting-started) must be in place (`vitest.config.ts` loads `.env` automatically). CI provisions a Postgres service for these.
