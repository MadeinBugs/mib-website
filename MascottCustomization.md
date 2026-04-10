# Plan: Mascot Customization Feature — Architecture & Security

## TL;DR

Add a protected mascot customization tool to the MIB website where employees self-register with invite codes and customize their own version of Sisyphus (the studio mascot) for the yearly team poster. Requires migrating from static GitHub Pages to Vercel for server-side capabilities, and integrating Supabase (free tier) for auth + data persistence.

---

## Phase 1: Deployment Migration (GitHub Pages → Vercel)

1. **Remove static export constraint** — Remove `output: 'export'` from `next.config.js`. This enables API routes, middleware, and server-side rendering while existing pages remain statically generated automatically via Vercel's ISR/SSG.
2. **Remove `USE_BASE_PATH` logic** — Vercel serves at root domain, so the conditional base path in `next.config.js` and `src/lib/metadataPaths.ts` is unnecessary (keep as fallback or remove).
3. **Connect GitHub repo to Vercel** — Vercel auto-deploys on push to `master`. Supersedes the GitHub Actions workflow.
    - Rename `.github/workflows/deploy.yml` → `deploy.yml.bak` (keep as reference/rollback path, don't delete).
4. **Configure custom domain** — Point `www.madeinbugs.com.br` to Vercel (update DNS records). Vercel provides free SSL.
5. **Verify existing pages** — Ensure all current pages (about, contact, portfolio, projects, jobs) still work identically on Vercel with static generation.

*Depends on: nothing. This is the foundational step.*

---

## Phase 2: Supabase Setup (Auth + Database)

1. **Create Supabase project** — Free tier provides: auth, PostgreSQL database (500MB), unlimited API requests. More than enough for 15-50 users.
2. **Design database schema:**

   **`invite_codes` table:**
   - `id` (UUID, PK)
   - `code` (text, unique) — the invite code string
   - `max_uses` (int) — how many times the code can be used
   - `current_uses` (int, default 0)
   - `created_at` (timestamptz)
   - `expires_at` (timestamptz, nullable)

   **`profiles` table:**
   - `id` (UUID, PK, references auth.users)
   - `display_name` (text) — the employee's name
   - `invite_code_used` (UUID, references invite_codes)
   - `created_at` (timestamptz)

   **`mascot_customizations` table:**
   - `id` (UUID, PK)
   - `user_id` (UUID, references profiles, unique per year)
   - `year` (int) — e.g. 2025, 2026
   - `customization_data` (JSONB) — all mascot settings (colors, add-ons, etc.)
   - `updated_at` (timestamptz)
   - UNIQUE constraint on `(user_id, year)`

3. **Configure Row Level Security (RLS):**
   - `mascot_customizations`: Users can only read/write their own rows (`auth.uid() = user_id`)
   - `invite_codes`: Read-only for authenticated users (for validation), no direct writes
   - `profiles`: Users can read/update their own profile

4. **Store Supabase credentials** — `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Vercel environment variables. `SUPABASE_SERVICE_ROLE_KEY` (server-only, never exposed to client).

5. **Create `.env.local` for local development:**
    - `NEXT_PUBLIC_SUPABASE_URL=...`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
    - `SUPABASE_SERVICE_ROLE_KEY=...`
    - Mirror these in Vercel's environment variables dashboard.
    - Verify `.env.local` is in `.gitignore` (Next.js default, but confirm).

*Depends on: nothing. Can run in parallel with Phase 1.*

---

## Phase 3: Auth Implementation

1. **Install dependencies:**
    - `@supabase/supabase-js` — Supabase SDK
    - `@supabase/ssr` — Server-side auth helpers for Next.js (cookie-based sessions)

2. **Create Supabase client utilities:**
    - `src/lib/supabase/server.ts` — Server-side client (for API routes, server components, middleware). Uses `cookies()` from `next/headers`.
    - `src/lib/supabase/client.ts` — Browser client (for client components). Uses `NEXT_PUBLIC_*` env vars only.

3. **Add Next.js middleware** (`src/middleware.ts`):
    - Refresh Supabase auth session on every request to `/mascot/*` (required by `@supabase/ssr`)
    - Protect `/mascot` routes: redirect unauthenticated users to `/mascot/login`
    - Allow unauthenticated access to `/mascot/login` and `/mascot/register`
    - **Explicit matcher** — zero impact on existing pages:
      `export const config = { matcher: ['/mascot/:path*'] }`

4. **Create auth pages** (outside `[locale]` — internal tool, no i18n needed):
    - `src/app/mascot/login/page.tsx` — Email + password login form. Server action validates credentials via Supabase Auth, sets session cookie, redirects to `/mascot`.
    - `src/app/mascot/register/page.tsx` — Registration form: display name, email, password, invite code. Server action validates invite code, creates user via Supabase Auth, increments invite code usage, creates profile row, redirects to `/mascot`.
    - `src/app/mascot/logout/route.ts` — API route that clears session and redirects to login.

5. **Invite code validation** (server-side only):
    - Server action or API route that checks: code exists, not expired, `current_uses < max_uses`
    - On successful registration, atomically increment `current_uses`
    - Initial codes seeded via Supabase SQL editor or a one-time script

*Depends on: Phase 2 (Supabase setup). Phase 1 must also be done for middleware to work.*

---

## Phase 4: Mascot Customization Page Shell & Persistence

1. **Create protected route** — `src/app/mascot/page.tsx`:
    - Server component that loads user session + existing customization data from Supabase
    - Passes data to a client component for the interactive editor
    - Not linked from `NavigationMenu.tsx` or `ContentLayout.tsx` (direct link only)

2. **Create client editor component** — `src/components/mascot/MascotEditor.tsx`:
    - Receives initial customization data as props
    - Manages local state for real-time editing
    - Auto-saves to Supabase on changes (debounced, e.g. 2-second delay after last change)
    - Visual save indicator (saved/saving/error)

3. **Persistence strategy (Supabase client direct — no API routes):**
    - Use the Supabase browser client directly from `MascotEditor.tsx` for save/load. RLS ensures users can only access their own rows — no need for proxy API routes.
    - Primary: Supabase database (JSONB column stores all customization choices). **Supabase is the source of truth.**
    - Secondary: `localStorage` as offline fallback / instant load cache
    - **On load:** Fetch from Supabase. If fetch fails (offline/error), fall back to localStorage.
    - **On save:** Write to Supabase. On success, mirror to localStorage. On failure, write to localStorage only and show a warning.
    - **Never** let localStorage silently overwrite newer Supabase data.
    - Data is per-user, per-year (supports yearly reuse)

*Depends on: Phase 3 (auth must work first).*

---

## Phase 5: Styling & Layout for Mascot Section

1. **Create mascot section layout** — `src/app/mascot/layout.tsx`:
    - Minimal layout, distinct from the main site's `ContentLayout`
    - Include user display name + logout button in header
    - Keep the hand-drawn/crayon aesthetic consistent with the main site
    - No navigation to main site pages (or minimal "back to site" link)

2. **Style auth pages** (login, register):
    - Match the site's warm color palette and custom fonts
    - Simple, focused forms — no clutter

*Depends on: Phase 3. Can be refined in parallel with Phase 4.*

---

## Relevant Files

### To Modify

- `next.config.js` — Remove `output: 'export'`, remove base path logic ✅
- `package.json` — Add Supabase dependencies, remove `export` script ✅
- `.github/workflows/deploy.yml` — Renamed to `deploy.yml.bak` ✅
- `src/lib/metadataPaths.ts` — Simplified (removed `USE_BASE_PATH`) ✅
- `src/lib/imagePaths.ts` — Simplified (removed `USE_BASE_PATH`) ✅
- `.gitignore` — Verified `.env*.local` is listed ✅

### To Create

- `.env.local` — Supabase credentials for local development (not committed) ✅
- `src/middleware.ts` — Auth middleware for route protection (scoped to `/mascot/:path*`) ✅
- `src/lib/supabase/server.ts` — Server-side Supabase client ✅
- `src/lib/supabase/client.ts` — Browser-side Supabase client ✅
- `src/app/mascot/layout.tsx` — Mascot section layout ✅
- `src/app/mascot/page.tsx` — Main customization page (protected) ✅
- `src/app/mascot/login/page.tsx` — Login page ✅
- `src/app/mascot/register/page.tsx` — Registration page ✅
- `src/app/mascot/logout/route.ts` — Logout API route ✅
- `src/app/mascot/api/validate-invite/route.ts` — Server-side invite code validation ✅
- `src/app/mascot/api/consume-invite/route.ts` — Server-side invite code consumption + profile creation ✅
- `src/components/mascot/MascotEditor.tsx` — Editor client component (shell) ✅

---

## Verification

1. **Deployment**: Deploy to Vercel, verify all existing pages render identically to GitHub Pages version. Check custom domain + SSL.
2. **Static pages**: Confirm portfolio, about, contact, projects pages are statically generated (check Vercel build output).
3. **Auth flow**: Register with valid invite code → login → access `/mascot` → logout → redirected to login.
4. **Invalid access**: Visit `/mascot` without auth → redirected to login. Register with invalid/expired invite code → error.
5. **Persistence**: Customize mascot → close browser → reopen → customization is preserved. Test across different devices with same account.
6. **Security**: Verify Supabase RLS prevents User A from reading/writing User B's data. Verify `SUPABASE_SERVICE_ROLE_KEY` is not exposed in client bundles. Verify invite code validation is server-side only.
7. **Year isolation**: Verify 2025 customization doesn't interfere with future years.

---

## Decisions

- **Vercel over GitHub Pages**: Required for server-side auth, API routes, middleware. Free tier is sufficient.
- **Supabase over custom auth**: Battle-tested auth + database, generous free tier (50K MAU, 500MB DB), RLS for security. Avoids writing custom password hashing, session management.
- **Route outside `[locale]`**: Mascot tool at `/mascot` (not `/[locale]/mascot`) since it's an internal tool. Avoids adding translations for a tool pages. The UI language can default to English or use browser locale detection if needed later.
- **JSONB for customization data**: Flexible schema — easy to add new customization options without schema migrations. Supports yearly themes with different options.
- **Invite code system**: Self-service registration reduces admin burden. Codes can have expiry dates and usage limits for security.
- **Direct Supabase client (no API routes for save/load)**: RLS already restricts data access per user. Wrapping it in API routes is unnecessary indirection that adds files and surface area.
- **No email verification (for now)**: Since invite codes gate access, email verification adds friction without security benefit for employees. **Future toggle:** When opening to non-employees, enable email verification before consuming the invite code — prevents someone burning a code with a fake email. Can be toggled per invite code (e.g., a `requires_email_verification` flag on `invite_codes` table).

---

## Further Considerations

1. **Admin panel**: Currently no way for admins to create invite codes or view all customizations through the UI. Initial codes can be seeded via Supabase dashboard. A simple admin page could be added later if needed.
2. **Export/download**: The art director may need to export all team customizations for the poster. A simple admin-only API route or Supabase dashboard query could handle this. Worth discussing when planning the customization mechanics.
3. **Rate limiting**: Supabase has built-in rate limiting on auth endpoints. Additional rate limiting on API routes can be added via Vercel Edge middleware if needed, but likely unnecessary for 15-50 users.
4. **Supabase free-tier inactivity pause**: Free projects may pause after inactivity (cold start on next request). For this internal tool, that is usually acceptable; data is retained. Recommended approach is operational: reopen/warm the project before active usage windows (e.g., before poster week). Avoid relying on synthetic keep-alive pings as a core strategy; if always-on reliability is required, upgrade to a paid tier.
