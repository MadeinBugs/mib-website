# Photo Contest — Voting System Implementation Plan

## Overview

This document covers all changes needed to implement the public voting page (`/picture-contest/voting`) for the Polaroid Awards contest. The Discord bot integration is out of scope and will be documented separately.

**Key constraints:**
- `unique_id` must never be exposed on the voting page
- Voting is public but protected against bots and spam
- Each visitor can vote on multiple photos but not twice on the same photo
- Vote counts are public in real time
- Voting opens now and closes May 6th
- Photo order uses a seeded algorithm that balances popularity and discovery

---

## Part 1 — Database Changes

### 1.1 Create `contest_votes` table

```sql
CREATE TABLE contest_votes (
    id BIGSERIAL PRIMARY KEY,
    picture_id BIGINT REFERENCES contest_pictures(id) ON DELETE CASCADE,
    voter_fingerprint TEXT NOT NULL,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (picture_id, voter_fingerprint)
);

ALTER TABLE contest_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert votes" ON contest_votes
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can read vote counts" ON contest_votes
    FOR SELECT TO anon USING (true);

CREATE INDEX idx_votes_picture_id ON contest_votes(picture_id);
```

### 1.2 Add vote count view for performance

```sql
CREATE VIEW contest_vote_counts AS
    SELECT picture_id, COUNT(*) as vote_count
    FROM contest_votes
    GROUP BY picture_id;
```

### 1.3 Add voting window control

```sql
ALTER TABLE contest_sessions ADD COLUMN IF NOT EXISTS voting_open BOOLEAN DEFAULT FALSE;
```

Actually, voting window is better controlled via environment variable — see Part 3.

### 1.4 Verify `contest_pictures` has no more `is_favorite_2` references

Run this to confirm the schema is clean:

```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'contest_pictures'
ORDER BY ordinal_position;
```

Expected: no `is_favorite_2` column.

---

## Part 2 — New Pages and Routes

### 2.1 File structure to create

```
src/
├── app/
│   └── [locale]/
│       └── picture-contest/
│           ├── page.tsx                          # existing — add link to /voting
│           └── voting/
│               └── page.tsx                      # NEW — public voting page
├── components/
│   └── picture-contest/
│       ├── VotingGallery.tsx                     # NEW — voting grid
│       ├── VotingCard.tsx                        # NEW — single photo card with vote button
│       └── VotingPageClient.tsx                  # NEW — client wrapper for interactivity
├── app/
│   └── api/
│       └── contest/
│           ├── vote/
│           │   └── route.ts                      # NEW — POST vote
│           └── unvote/
│               └── route.ts                      # NEW — DELETE vote (toggle)
└── lib/
    └── contest/
        └── voting-algorithm.ts                   # NEW — seeded ordering algorithm
```

---

## Part 3 — Environment Variables

Add to `.env.local` and Vercel dashboard:

```
VOTING_OPEN=true
VOTING_CLOSES_AT=2026-05-06T23:59:59Z
NEXT_PUBLIC_VOTING_OPEN=true
NEXT_PUBLIC_VOTING_CLOSES_AT=2026-05-06T23:59:59Z
HCAPTCHA_SECRET_KEY=your_secret_key         # server-side only
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key # public, safe to expose
```

To close voting on May 6th, set `VOTING_OPEN=false` and redeploy, or let the code check `VOTING_CLOSES_AT` automatically.

---

## Part 4 — Anti-Bot and Spam Protection

### 4.1 hCaptcha (recommended over honeypot for this use case)

A honeypot is a hidden field that bots fill in but humans don't — it's lightweight but only stops naive bots. For a public voting page, hCaptcha is more appropriate because:
- It's free
- It stops automated voting scripts
- It only challenges when behavior looks suspicious (mostly invisible to real users)
- It has a privacy-friendly mode

**Setup:**
1. Register at [hcaptcha.com](https://hcaptcha.com) — free tier is sufficient
2. Get site key (public) and secret key (server-side only)
3. Install: `npm install @hcaptcha/react-hcaptcha`

### 4.2 Voter fingerprinting

The `voter_fingerprint` in `contest_votes` is a hash of:
- IP address (from request headers)
- User agent string

```ts
// lib/contest/fingerprint.ts
import { createHash } from 'crypto';

export function generateFingerprint(ip: string, userAgent: string): string {
    return createHash('sha256')
        .update(`${ip}:${userAgent}`)
        .digest('hex');
}
```

This is not perfect (VPNs, shared IPs) but is sufficient for a casual contest. The `UNIQUE (picture_id, voter_fingerprint)` constraint in the database is the hard enforcement — even if someone bypasses the frontend, the database rejects duplicate votes.

### 4.3 Rate limiting on the vote API route

```ts
// Simple in-memory rate limit — sufficient for Vercel serverless
const VOTE_RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const VOTE_RATE_LIMIT_MAX = 20; // max 20 votes per minute per IP
```

Use `@upstash/ratelimit` with Upstash Redis free tier for persistence across serverless instances if needed.

---

## Part 5 — Seeded Ordering Algorithm

### 5.1 Logic

The goal is to balance discovery (low-vote photos get visibility) and engagement (high-vote photos stay relevant). The seed changes on every page load so the order is never the same twice.

```ts
// lib/contest/voting-algorithm.ts

interface VotingPhoto {
    id: number;
    pictureId: number;
    storagePath: string;
    voteCount: number;
}

/**
 * Seeded pseudo-random number generator (mulberry32).
 * Deterministic for a given seed, different across page loads.
 */
function seededRandom(seed: number) {
    return function () {
        seed |= 0;
        seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * Orders photos so that low-vote and high-vote photos alternate,
 * with randomness injected via seed.
 */
export function orderPhotosForVoting(photos: VotingPhoto[], seed: number): VotingPhoto[] {
    const rand = seededRandom(seed);

    // Sort by vote count ascending, with random tiebreaking
    const sorted = [...photos].sort((a, b) => {
        const voteDiff = a.voteCount - b.voteCount;
        if (voteDiff !== 0) return voteDiff;
        return rand() - 0.5;
    });

    // Interleave: take from bottom (low votes) and top (high votes) alternately
    const result: VotingPhoto[] = [];
    let low = 0;
    let high = sorted.length - 1;
    let turn = 0;

    while (low <= high) {
        if (turn % 3 === 2) {
            // Every 3rd slot: high-vote photo
            result.push(sorted[high--]);
        } else {
            // Other slots: low-vote photo
            result.push(sorted[low++]);
        }
        turn++;
    }

    // Apply a final light shuffle within groups of 4 using the seed
    // so adjacent photos aren't always the same pair
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}
```

### 5.2 Generating the seed from datetime

```ts
// In the voting page component
const seed = Math.floor(Date.now() / 1000); // changes every second
// Or for less churn:
const seed = Math.floor(Date.now() / 60_000); // changes every minute
```

Pass `seed` as a prop from the server component to the client component.

---

## Part 6 — API Routes

### 6.1 `POST /api/contest/vote`

```ts
// app/api/contest/vote/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createPictureContestServiceClient } from '@/lib/supabase/picture-contest-service';
import { generateFingerprint } from '@/lib/contest/fingerprint';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
    // Check voting window
    const votingOpen = process.env.VOTING_OPEN === 'true';
    const closesAt = process.env.VOTING_CLOSES_AT;
    if (!votingOpen || (closesAt && new Date() > new Date(closesAt))) {
        return NextResponse.json({ error: 'Voting is closed' }, { status: 403 });
    }

    const { picture_id, hcaptcha_token } = await request.json();

    if (!picture_id || !hcaptcha_token) {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Verify hCaptcha
    const captchaRes = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${hcaptcha_token}`,
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
        return NextResponse.json({ error: 'Captcha failed' }, { status: 403 });
    }

    // Generate fingerprint
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';
    const userAgent = headersList.get('user-agent') ?? 'unknown';
    const fingerprint = generateFingerprint(ip, userAgent);

    // Insert vote
    const supabase = createPictureContestServiceClient();
    const { error } = await supabase
        .from('contest_votes')
        .insert({ picture_id, voter_fingerprint: fingerprint });

    if (error) {
        if (error.code === '23505') {
            // Unique violation — already voted
            return NextResponse.json({ error: 'Already voted' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
```

### 6.2 `DELETE /api/contest/vote` (unvote / toggle)

```ts
// app/api/contest/unvote/route.ts
export async function DELETE(request: NextRequest) {
    const votingOpen = process.env.VOTING_OPEN === 'true';
    if (!votingOpen) {
        return NextResponse.json({ error: 'Voting is closed' }, { status: 403 });
    }

    const { picture_id } = await request.json();
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') ?? 'unknown';
    const userAgent = headersList.get('user-agent') ?? 'unknown';
    const fingerprint = generateFingerprint(ip, userAgent);

    const supabase = createPictureContestServiceClient();
    await supabase
        .from('contest_votes')
        .delete()
        .eq('picture_id', picture_id)
        .eq('voter_fingerprint', fingerprint);

    return NextResponse.json({ success: true });
}
```

---

## Part 7 — Voting Page

### 7.1 `app/[locale]/picture-contest/voting/page.tsx`

```ts
import { createPictureContestServiceClient } from '@/lib/supabase/picture-contest-service';
import { orderPhotosForVoting } from '@/lib/contest/voting-algorithm';
import VotingPageClient from '@/components/picture-contest/VotingPageClient';

export default async function VotingPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale: rawLocale } = await params;
    const locale = rawLocale === 'en' ? 'en' : 'pt-BR';

    const votingOpen = process.env.VOTING_OPEN === 'true';
    const closesAt = process.env.VOTING_CLOSES_AT ?? null;
    const isExpired = closesAt ? new Date() > new Date(closesAt) : false;
    const isActive = votingOpen && !isExpired;

    const supabase = createPictureContestServiceClient();

    // Fetch only photos that were chosen as favorites
    // IMPORTANT: do NOT select unique_id — never expose it on this page
    const { data: favorites } = await supabase
        .from('contest_favorites')
        .select('picture_id');

    const favoriteIds = (favorites ?? []).map((f) => f.picture_id);

    const { data: photos } = await supabase
        .from('contest_pictures')
        .select('id, storage_path')
        .in('id', favoriteIds.length > 0 ? favoriteIds : [-1]);

    // Fetch vote counts
    const { data: voteCounts } = await supabase
        .from('contest_vote_counts')
        .select('picture_id, vote_count')
        .in('picture_id', favoriteIds.length > 0 ? favoriteIds : [-1]);

    const voteMap = new Map(
        (voteCounts ?? []).map((v) => [v.picture_id, Number(v.vote_count)])
    );

    const photosWithCounts = (photos ?? []).map((p) => ({
        id: p.id,
        pictureId: p.id,
        storagePath: p.storage_path,
        voteCount: voteMap.get(p.id) ?? 0,
    }));

    // Generate public URLs (bucket is public)
    const photosWithUrls = photosWithCounts.map((p) => {
        const { data } = supabase.storage
            .from('contest-pictures')
            .getPublicUrl(p.storagePath);
        return { ...p, imageUrl: data?.publicUrl ?? null };
    });

    const seed = Math.floor(Date.now() / 60_000);
    const orderedPhotos = orderPhotosForVoting(photosWithUrls, seed);

    return (
        <VotingPageClient
            photos={orderedPhotos}
            locale={locale}
            isActive={isActive}
            closesAt={closesAt}
            seed={seed}
        />
    );
}
```

---

### 7.2 Key rules for `VotingPageClient` and `VotingCard``

- **Never render `unique_id`** anywhere in the voting page
- **Never render `taken_at`, `filename`, or `machine_id`** — only the image
- Vote button is a star ⭐ — filled if already voted, outline if not
-is_favorite_2` está removida ✅. Clicking the star on an already-voted photo removes the vote ( O schema está limpo.

Agora deixa eu continuar o documento de onde parou:

---

### 7.2 Key rules for `VotingPageClienttoggle)
- Vote count is shown publicly below each photo
- hCaptcha is shown **once per session** on the first vote, not on every vote — store a `captchaVer` and `VotingCard`

- **Never render `unique_id`** anywhere in the voting page
- **Never render `taken_at`, `filename`, or `machine_id`** — only the image
- Vote button is a star ⭐ — filled if already voted, outline if not
- Voting toggle: click once to vote, click again to unvote
- hCaptcha is shown **ified` flag in `sessionStorage` after first successful verification

### 7.3 Voting closed state

When `isActive = false`, the pageonce per session** on first vote, then the token is stored in still shows all photos and vote counts but the star `sessionStorage` and reused for subsequent votes in the same session
- Vote count is shown buttons are disabled and a banner explains voting is closed:

> * publicly on each card
- When voting is closed, stars are visible but not clickable,"A votação encerrou em 06/05 with a message indicating voting has ended

---

##/2026. Obrigado por participar! / Voting closed on 06/05/2026. Thank you for participating!"*

--- Part 8 — hCaptcha Integration Notes

hCaptcha needs to be shown once before the first vote. The recommended

## Part 8 — Update Existing Pages

### 8.1 `picture-contest/page.tsx` — add flow:

1. User clicks a star for the first time
2. hCaptcha widget appears in link to voting

Add a visible button/link to `/picture-contest/voting` on a small modal
3. User completes the challenge
4. Token is stored in `sessionStorage` the entry page. This is the page the Q
5. Vote is submitted with the token
6. All subsequent votes in the same session skip theR code points to, so it's the natural place for people to discover voting.

```tsx
<Link href captcha and reuse the token

```ts
// In VotingPageClient
const [captchaToken, setCaptcha={`/${locale}/picture-contest/voting`}>
    {locale === 'en' ? 'Vote onToken] = useState<string | null>(
    typeof window !== 'undefined' 
        ? sessionStorage.getItem('hcaptcha_token') 
        : null
);

async photos →' : 'Votar nas fotos →'}
</Link>
```

### 8.2 `PlayerGallery. function handleVote(pictureId: number) {
    let token = captchaToken;
    
    if (!token) {
        // Showtsx` — remove `is_favorite_2` references

```tsx
// Remove from captcha modal, await completion
        token = await showCaptchaModal();
        session PictureData interface:
// is_favorite_2: boolean;  ← deleteStorage.setItem('hcaptcha_token', token);
        setCaptchaToken(token);
    }
    
    await fetch('/api/contest/vote', {
        method: 'POST',
        headers: { 'Content this line

// Change:
const canChoose = !isFavorite && fav-Type': 'application/json' },
        body: JSON.stringify({ picture_id: pictureId, hcaptcha_token: token }),
    });
}
```

---

## Part 9 — Entry PageCount < 2;
// To:
const canChoose = !isFavorite && favCount < 1;

// Change Update

The existing `/picture-contest` entry page needs a link to the voting page:

```tsx favoritedCountText to reflect 1 remaining
// In CodeEntryForm.tsx or page.tsx, add below slot instead of 2
```

### 8.3 `page.tsx` of `[uniqueId] the code input form:
<div className="mt-8 text-center border-t border` — remove `is_favorite_2` from select

```ts
// Change:
.select('id-neutral-200 pt-6">
    <p className="text-neutral-500 font-body text-sm mb-2, unique_id, filename, storage_path, picture_index, taken_at, metadata, is_favorite_1, is_favorite_2')
// To:
.select('id, unique_id, filename, storage_path, picture_index,">
        {locale === 'en' ? 'Want to vote on your favorite photos?' : 'Quer vo taken_at, metadata, is_favorite_1')
```

### 8.4 `choose-favorite` API route — remove slottar nas suas fotos favoritas?'}
    </p>
    <Link
        href={`/${locale}/picture-contest/voting`}
        className="inline-flex items-center gap-2 text 2 logic

The API route that handles choosing a favorite currently assigns `favorite-amber-600 hover:text-amber-700 font-body font-semibold transition-colors"
    >
        ⭐ {locale === _slot 1` or `2`. Since only slot'en' ? 'Go to voting' : 'Ir para a votação'}
    </Link>
</div>
```

---

## Part 10 — Middleware Update 1 exists now, simplify to always use slot 1 and return an

Add `/voting` to the public picture-contest routes so it passes error if the session already has a favorite:

```ts
// Remove any logic bran the `PICTURE_CONTEST_LIVE` gate correctly:

```ts
// In middleware.ts,ching on favorite_slot === 2
// Always insert with favorite_slot = 1
// The UNIQUE ( the existing regex already covers this:
const isPunique_id) constraint on contest_favorites will reject duplicates
```

### 8.5 `middlewareictureContestRoute = /^\/(en|pt-BR)\/picture-contest/.test(pathname);

// voting is NOT.ts` — add voting route to matcher

```ts
export const config = {
    matcher: [
        '/ admin, so it goes through the LIVE gate check
// Nomascot/:path*',
        '/(en|pt-BR)/picture-contest',
        '/(en|pt- changes needed to middleware if PICTURE_CONTEST_LIVE=true
```

If `PICTURE_CONTEST_LIVE` is currentlyBR)/picture-contest/:path*',
    ],
};
```

The voting route is already covered by `/( `false`, set it to `true` before the voting page goes live, or add `/en|pt-BR)/picture-contest/:path*` — no changes needed to the matcher. But add `PICTUREvoting` as an exception in the gate check.

---

## Part 11 — Checklist

###_CONTEST_LIVE` gate awareness: `/voting` should be accessible Supabase
- [ ] Run SQL from Part 1 to even when `PICTURE_CONTEST_LIVE=false` only if voting is explicitly create `contest_votes` table and `contest_vote_counts` view
- [ ] Verify RLS policies allow anon insert and open. Add this check to the middleware:

```ts
const isVotingRoute = / select on `contest_votes`

### Environment Variables
- [ ] Add `VOTING_OPEN=true` to `.env.local` and^\/(en|pt-BR)\/picture-contest\/voting/.test(pathname);
const votingOpen = process.env.NEXT_PUBLIC_VOTING_OPEN Vercel
- [ ] Add `VOTING_CLOSES_AT=2026-05-06T23:59:59Z` to `.env.local` === 'true';

if (isPictureContestRoute && !isPictureContestAdmin && !isVotingRoute) {
    // and Vercel
- [ ] Add `HCAPTCHA_SECRET_KEY` to `.env.local` and Vercel (server-side only)
- [ ] Add `NEXT_PUBLIC_HCAPTCHA existing PICTURE_CONTEST_LIVE gate
}

if (isVotingRoute && !votingOpen) {
    const url = request_SITE_KEY` to `.env.local` and Vercel
- [ ] Register at hcaptcha.com and get both keys.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
}
```

---

## Part 9 — hCaptcha Setup

1. Code
- [ ] Create `lib/contest/fingerprint.ts`
- [ ] Create `lib/contest/voting-algorithm.ts`
- [ ] Create `app/. Go to [hcaptcha.com](https://hcaptcha.com) → Sign up free
2. Add yourapi/contest/vote/route.ts`
- [ ] Create `app/api/contest/unvote/route.ts`
- [ ] Create `app/[locale]/picture-contest/voting/page.tsx`
- [ ] Create `components site (`madeinbugs.com.br`) →/picture-contest/VotingPageClient.tsx`
- [ ] Create `components/picture-contest/VotingCard.tsx`
- [ ] Update `CodeEntryForm.tsx` or entry get **Site Key** (public) and **Secret Key** (private)
3. Install: `page.tsx` to add link to voting
- [ ] Remove all remaining `is `npm install @hcaptcha/react-hcaptcha`
4. Add to `.env.local`:
```
HCAPTCHA_SECRET_KEY=your_secret_key_favorite_2` references from site code
- [ ] Install `@hcaptcha/react-hcaptcha`:
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_site_key
```
5. Add the same variables `npm install @hcaptcha/react-hcaptcha`

### Testing
- [ ] Vote on a photo — verify row appears in `contest_votes`
- [ ] Vote to Vercel dashboard under Environment Variables

---

## Part 10 — Supabase RLS for on same photo again — verify 409 is returned
- [ ] Unvote — verify row is deleted
- [ ] Disable `contest_votes`

Run in SQL editor after creating `VOTING_OPEN` — verify stars are not clickable
- [ ] Verify `unique_id` never the table from Part 1:

```sql
-- Allow anyone to vote (insert appears in voting page HTML source
- [ ] Verify page order changes on reload)
CREATE POLICY "Anyone can vote" ON contest_votes
    FOR INSERT TO anon
    WITH CHECK (true);

-- Allow anyone to remove their own
- [ ] Test hCaptcha flow — first vote shows captcha, subsequent votes skip it vote
-- (fingerprint is verified server-side, not in RLS)
CREATE POLICY "Anyone can delete votes" ON contest_votes
    FOR DELETE TO anon
    USING (true);

-- Allow anyone to read vote counts
CREATE POLICY "Anyone can read votes" ON contest_votes
    FOR SELECT TO anon
    USING (true);
```

---

## Summary of Deliverables

| What | File | Status |
|---|---|---|
| `contest_votes` table + RLS | Supabase SQL editor | Pending |
| `contest_vote_counts` view | Supabase SQL editor | Pending |
| Fingerprint utility | `lib/contest/fingerprint.ts` | Pending |
| Voting algorithm | `lib/contest/voting-algorithm.ts` | Pending |
| Vote API route | `api/contest/vote/route.ts` | Pending |
| Unvote API route | `api/contest/unvote/route.ts` | Pending |
| Voting page server component | `picture-contest/voting/page.tsx` | Pending |
| Voting page client component | `VotingPageClient.tsx` | Pending |
| Voting card component | `VotingCard.tsx` | Pending |
| Remove `is_favorite_2` from site | `PlayerGallery.tsx`, `[uniqueId]/page.tsx`, `choose-favorite` API | Pending |
| Add voting link to entry page | `picture-contest/page.tsx` | Pending |
| hCaptcha install + config | `.env.local`, Vercel dashboard | Pending |
| Environment variables | `.env.local`, Vercel dashboard | Pending |