# billd

Personal expense tracker — quick-add expenses, categories, budgets, spend projections. CAD, dark-first, pixel-art skin on a modern stack.

Built under the Twin Spruce Studio autonomous development pipeline: Notion holds designs and stories, this repo holds plans (`docs/plans/`), the living ERD (`docs/architecture/erd.md`), and code. One story = one PR.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS 4 · shadcn/ui · Prisma · Supabase Postgres · Auth.js v5 · Vitest + RTL + Playwright · Vercel

Design system: see the canonical Notion page and the `design-assets` branch (`design-system/` tokens, icons, component specs). Money is integer cents end to end.

## Commands

| Purpose | Command |
|---|---|
| Dev server | `npm run dev` |
| Lint | `npm run lint` |
| Unit / integration tests | `npm run test` |
| E2E | `npm run test:e2e` |
| Build | `npm run build` |

## Environment

Copy `.env.example` to `.env` and set `DATABASE_URL` (Supabase).
