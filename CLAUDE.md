# Battle Cats Progress Tracker — Project Context

## Project Overview
A Battle Cats game progress tracker built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Prisma 7, PostgreSQL (Neon serverless), and NextAuth. Deployed to Vercel at `battlecatsprogress.app`.

## Deployment Workflow
**This is critical — do NOT ask the user to run commands. Handle everything autonomously.**

1. Make code changes in this repo
2. Run `npx tsc --noEmit` to verify TypeScript compiles
3. `git add` the relevant files (quote paths with parentheses like `"src/app/(app)/..."`)
4. `git commit` with conventional commit style (`feat:`, `fix:`, `refactor:`, etc.)
5. `git push origin main` — Vercel auto-deploys from GitHub on push

The build script (`package.json`) runs: `prisma generate && prisma migrate deploy && next build`

**Network limitations:** This sandbox cannot make outbound internet requests. That means `prisma generate`, `prisma migrate`, `npm install`, `vercel` CLI, and GitHub API calls do NOT work here. But `git push` does work, and Vercel runs the full build remotely. So the workflow is: write code → push → Vercel builds.

**After every push, ALWAYS do this:**
1. Push the code
2. Immediately push a SECOND empty commit to handle Neon cold starts:
   `git commit --allow-empty -m "chore: retrigger deploy (Neon cold start)" && git push origin main`
   The Neon serverless database sleeps after inactivity. The first deploy wakes it, the second succeeds.
3. Tell the user: "Pushed (with automatic retry for Neon cold starts). Vercel is building — check your dashboard or site in ~90s."
4. This sandbox CANNOT reach battlecatsprogress.app or any Vercel/GitHub API to check build status. Do NOT try WebFetch, curl, or any HTTP client — they will all fail. Only `git push` works through the proxy.

## Git Remote
- GitHub: `GeckMan/Battle-Cats-Progress-Tracker`
- Auth: PAT embedded in remote URL (already configured)
- Branch: `main` (single branch)
- Vercel: Connected to GitHub, auto-deploys on push to `main`

## Tech Stack
- **Framework:** Next.js 16 App Router
- **Language:** TypeScript, React 19
- **Styling:** Tailwind CSS 4 (dark theme default, NERV theme optional)
- **ORM:** Prisma 7 with PostgreSQL (Neon serverless, pooled connection)
- **Auth:** NextAuth with credentials provider
- **Hosting:** Vercel (auto-deploy from GitHub)
- **Database:** Neon PostgreSQL (`ep-cool-hill-a425g0bc-pooler.us-east-1.aws.neon.tech`)

## Key Architecture
- App Router groups: `(app)` for authenticated routes, root for login/signup
- Sidebar navigation with `AppSidebar` component
- Right panel (`RightPanelWrapper`) for unit details
- Theme system: `[data-theme="nerv"]` CSS attribute selector, `ThemeProvider` context, localStorage + DB sync
- Unit data: seeded from scripts, with rarity levels (Normal → Legend Rare), form levels (F1/F2/TF/UF)
- Social features: friend system, progress comparison, unit comparison

## Theme System
- **Default:** Dark theme with warm amber accents
- **NERV:** Evangelion-inspired CRT terminal aesthetic (opt-in via Settings)
  - CSS overrides in `src/app/nerv-theme.css`
  - Theme context in `src/lib/theme-context.tsx`
  - API endpoint: `src/app/api/settings/theme/route.ts`
  - CRT effects (scanlines, vignette) via CSS pseudo-elements on body — NOT DOM nodes
  - Performance: no universal `*` selectors, no body-level animations

## File Structure (key paths)
```
prisma/schema.prisma          — Database schema
src/app/(app)/                — Authenticated app routes
src/app/(app)/layout.tsx      — App layout (ThemeProvider, sidebar, right panel)
src/app/(app)/units/          — Units page
src/app/(app)/dashboard/      — Dashboard
src/app/(app)/settings/       — Settings (includes theme toggle)
src/app/(app)/compare/        — User comparison
src/app/layout.tsx            — Root layout (fonts, global CSS)
src/app/nerv-theme.css        — NERV theme overrides
src/lib/theme-context.tsx     — Theme React context
src/lib/auth-options.ts       — NextAuth config
src/lib/prisma.ts             — Prisma client
src/components/               — Shared components
scripts/                      — Data seeding and medal scripts
```

## Commit Style
```
feat: add unit comparison view — see what friends have that you don't
fix: pass route context to NextAuth handler in POST wrapper
feat: add long-press to open unit info on mobile
```

## BCData Auto-Sync
Game data (units, legend stages) is synced from [fieryhenry/BCData](https://git.battlecatsmodding.org/fieryhenry/BCData.git).

- **Script:** `scripts/sync-bcdata.ts` — clones BCData, finds latest EN version, upserts units + legend stages
- **GitHub Action:** `.github/workflows/sync-bcdata.yml` — runs weekly (Monday 6AM UTC) or manually via workflow_dispatch
- **Data source:** `game_data/en/<version>/DataLocal/` and `resLocal/` folders
- **Unit names:** parsed from `resLocal/Unit_Explanation{N}_en.csv` (pipe-delimited, line per form)
- **Rarity:** guessed from unit ID ranges (Normal 0-8, Special 9-56, default Rare). Can be manually corrected.
- **Legend stages:** parsed from `resLocal/Map_Name.csv` (pipe-delimited subchapter names)
- **Required secrets:** `DATABASE_URL` and `DIRECT_DATABASE_URL` must be set in GitHub repo secrets

To run manually: `npx tsx ./scripts/sync-bcdata.ts` (needs DATABASE_URL env var)

## Common Gotchas
- Paths with parentheses need quoting in bash: `"src/app/(app)/layout.tsx"`
- Neon cold starts can cause Prisma timeouts — retry usually works
- Prisma generated client is checked into `src/generated/prisma/` — gets regenerated during Vercel build
- `filelist.txt` is a large auto-generated file, don't bother staging it
