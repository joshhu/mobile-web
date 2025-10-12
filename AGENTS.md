# Repository Guidelines

## Project Structure & Module Organization
- `app/` hosts all Next.js App Router routes; pages fetch data through `@/lib/db` and should remain async server components when they hit Neon.
- `components/` collects reusable UI built with Tailwind CSS 4; co-locate brand-specific pieces under subfolders and export from an `index.ts` when shared.
- `lib/` contains database clients (`db.ts`) and SQL definitions (`schema.sql`); keep data access logic here rather than inside route files.
- `public/` stores static assets; optimize new images before committing.
- `scripts/` houses operational tools (`scraper*.ts`, `verify-data.ts`, `migrate-auth.ts`); run them with `npm run <script>` and document any new script usage inline.

## Build, Test, and Development Commands
- `npm run dev` launches the Turbopack dev server at `http://localhost:3000`.
- `npm run build` performs a production Next.js build; run before pushing major changes.
- `npm start` serves the built bundle; useful for smoke tests.
- `npm run lint` applies the Next.js + TypeScript ESLint rules; fix or explicitly justify violations.
- `npm run scraper` / `npm run scraper:full` refresh handset data; capture output when modifying data pipelines.
- `npm run verify` validates database completeness; include the summary in PR descriptions.
- `npm run migrate:auth` applies the Neon auth migration; use only after confirming `.env.local` credentials.

## Coding Style & Naming Conventions
- TypeScript is required; keep files in `.tsx` for components and `.ts` for utilities.
- Maintain two-space indentation, single quotes, and descriptive PascalCase component names; route segments under `app/` stay kebab-case.
- Use the `@/` alias for absolute imports; group external imports before internal ones.
- Prefer React Server Components for data fetching screens and client components only when interactivity is needed.
- Keep UI strings in Traditional Chinese to match existing copy unless product direction changes.

## Testing Guidelines
- There is no dedicated Jest/Vitest suite yet; rely on focused manual QA plus `npm run verify`.
- When data changes, run `npm run verify` and attach key metrics from the console output to the PR.
- For UI changes, capture before/after screenshots and describe manual scenarios exercised (e.g., pagination, brand filters).
- New automated checks should live under `scripts/` or a future `tests/` folder; document setup steps in the PR.

## Commit & Pull Request Guidelines
- Follow the existing log style: short imperative summaries written in Traditional Chinese with a verb-first focus.
- Commit frequently but avoid noise; each commit should represent a coherent change set.
- PRs must include: summary, linked issue or Notion task, test evidence (`npm run verify`, manual checks), and screenshots for UI shifts.
- Mention required environment or schema updates explicitly, and coordinate Neon migrations before merging.

## Configuration & Environment
- Copy `.env.local.example` to `.env.local` and keep secrets out of version control.
- Update `schema.sql` when database structures evolve and run migrations against Neon before shipping dependent code.
- Never commit production connection strings; rotate credentials immediately if exposed.
