# Photo Contest — Voting System Implementation Plan

## Overview

This document covers all changes needed to implement the public voting page (`/picture-contest/voting`) for the Polaroid Awards contest. The Discord bot integration is out of scope and will be documented separately.

**Key constraints:**
- `unique_id` must never be exposed on the voting page
- Voting is public but protected against bots and spam via hCaptcha + fingerprinting
- Each visitor can vote on multiple photos but not twice on the same photo (toggle: vote/unvote)
- Vote counts are public in real time
- Voting opens now and closes May 6th, 2026
- Photo order uses a seeded interleave algorithm that balances popularity and discovery

---

## Part 1 — Database Changes (Manual — Supabase SQL Editor)

Run this SQL in the **picture-contest Supabase project** SQL editor:

```sql
-- 1. Create contest_votes table
CREATE TABLE contest_votes (
    id BIGSERIAL PRIMARY KEY,
    picture_id BIGINT REFERENCES contest_pictures(id) ON DELETE CASCADE,
    voter_fingerprint TEXT NOT NULL,
    voted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (picture_id, voter_fingerprint)
);

ALTER TABLE contest_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can vote" ON contest_votes
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can read votes" ON contest_votes
    FOR SELECT TO anon USING (true);

CREATE POLICY "Anyone can delete votes" ON contest_votes
    FOR DELETE TO anon USING (true);

CREATE INDEX idx_votes_picture_id ON contest_votes(picture_id);

-- 2. SECURITY DEFINER function for vote counts (bypasses RLS safely)
CREATE OR REPLACE FUNCTION get_vote_counts()
RETURNS TABLE (picture_id BIGINT, vote_count BIGINT)
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT picture_id, COUNT(*) as vote_count
    FROM contest_votes
    GROUP BY picture_id;
$$;
```

No VIEW is needed — the function replaces it.

---

## Part 2 — Environment Variables (Manual)

Add to `.env.local` **and** Vercel dashboard:

```env
VOTING_OPEN=true
VOTING_CLOSES_AT=2026-05-06T23:59:59Z
HCAPTCHA_SECRET_KEY=<your_secret_key>
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=<your_site_key>
```

Notes:
- `VOTING_OPEN` and `VOTING_CLOSES_AT` are server-only. No `NEXT_PUBLIC_` variants needed — the voting page is a server component that passes `isActive` as a prop.
- `PICTURE_CONTEST_LIVE` already exists and should be `true` for the voting page to be accessible.
- To close voting: set `VOTING_OPEN=false` and redeploy, or let the code auto-close based on `VOTING_CLOSES_AT`.

---

## Part 3 — hCaptcha Setup (Manual)

1. Go to [hcaptcha.com](https://hcaptcha.com) — sign up (free tier)
2. Add your site (`madeinbugs.com.br`)
3. Get **Site Key** (public) and **Secret Key** (server-side only)
4. Add both to `.env.local` and Vercel (see Part 2)

The npm package `@hcaptcha/react-hcaptcha` will be installed during implementation.

---

## Part 4 — File Structure

```
src/
├── app/
│   └── [locale]/
│       └── picture-contest/
│           ├── page.tsx                           # MODIFY — add link to /voting
│           └── voting/
│               └── page.tsx                       # NEW — public voting server page
├── components/
│   └── picture-contest/
│       ├── VotingPageClient.tsx                   # NEW — client wrapper (grid + state + captcha)
│       └── VotingCard.tsx                         # NEW — single photo card with vote star
├── app/
│   └── api/
│       └── contest/
│           ├── vote/
│           │   └── route.ts                       # NEW — POST vote
│           └── unvote/
│               └── route.ts                       # NEW — POST unvote
└── lib/
    └── contest/
        ├── fingerprint.ts                         # NEW — IP+UA hash
        └── voting-algorithm.ts                    # NEW — seeded interleave ordering
```

---

## Part 5 — Anti-Bot and Spam Protection

### 5.1 hCaptcha — first-vote-only verification

hCaptcha is verified **only on the first vote from a given fingerprint**. The server checks if the fingerprint already has any votes in the DB — if so, it skips captcha verification.

**Server-side logic (in `POST /api/contest/vote`):**
```ts
const { data: existingVotes } = await supabase
    .from('contest_votes')
    .select('id')
    .eq('voter_fingerprint', fingerprint)
    .limit(1);

const hasVotedBefore = (existingVotes?.length ?? 0) > 0;

if (!hasVotedBefore) {
    if (!hcaptcha_token) {
        return NextResponse.json({ error: 'Captcha required' }, { status: 400 });
    }
    const captchaRes = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${hcaptcha_token}`,
    });
    const captchaData = await captchaRes.json();
    if (!captchaData.success) {
        return NextResponse.json({ error: 'Captcha failed' }, { status: 403 });
    }
}
```

**Client-side:** After the first successful vote, store `hasVotedBefore = true` in `sessionStorage`. On subsequent votes, skip sending the captcha token. The server double-checks via DB anyway.

### 5.2 Voter fingerprinting

```ts
// lib/contest/fingerprint.ts
import { createHash } from 'crypto';

export function generateFingerprint(ip: string, userAgent: string): string {
    return createHash('sha256')
        .update(`${ip}:${userAgent}`)
        .digest('hex');
}
```

Not bulletproof (VPNs, shared IPs) but sufficient for a casual contest. The `UNIQUE (picture_id, voter_fingerprint)` DB constraint is the hard enforcement.

### 5.3 Rate limiting

Skipped for now. The DB unique constraint prevents duplicate votes, and hCaptcha prevents automated spam. The existing `rate-limit-redis.ts` (Upstash) can be plugged in later if abuse is detected.

---

## Part 6 — Seeded Ordering Algorithm

### 6.1 Goal

Balance discovery (low-vote photos get visibility) and engagement (high-vote photos stay relevant). The seed changes every minute so the order is never stale.

### 6.2 Implementation

```ts
// lib/contest/voting-algorithm.ts

export interface VotingPhoto {
    id: number;
    pictureId: number;
    storagePath: string;
    voteCount: number;
    imageUrl: string | null;
}

/** Mulberry32 seeded PRNG — deterministic for a given seed. */
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
 * Orders photos: interleaves low-vote and high-vote photos (2 low : 1 high),
 * then applies a windowed shuffle (groups of 4) for local variety without
 * destroying the global interleave pattern.
 */
export function orderPhotosForVoting(photos: VotingPhoto[], seed: number): VotingPhoto[] {
    const rand = seededRandom(seed);

    // Sort by vote count ascending, random tiebreaking
    const sorted = [...photos].sort((a, b) => {
        const voteDiff = a.voteCount - b.voteCount;
        if (voteDiff !== 0) return voteDiff;
        return rand() - 0.5;
    });

    // Interleave: 2 low-vote slots, then 1 high-vote slot
    const result: VotingPhoto[] = [];
    let low = 0;
    let high = sorted.length - 1;
    let turn = 0;

    while (low <= high) {
        if (turn % 3 === 2) {
            result.push(sorted[high--]);
        } else {
            result.push(sorted[low++]);
        }
        turn++;
    }

    // Windowed shuffle — groups of 4 for local variety
    const WINDOW = 4;
    for (let i = 0; i < result.length; i += WINDOW) {
        const windowEnd = Math.min(i + WINDOW, result.length);
        for (let j = windowEnd - 1; j > i; j--) {
            const k = i + Math.floor(rand() * (j - i + 1));
            [result[j], result[k]] = [result[k], result[j]];
        }
    }

    return result;
}
```

### 6.3 Seed generation (in voting/page.tsx server component)

```ts
const seed = Math.floor(Date.now() / 60_000); // changes every minute
```

---

## Part 7 — API Routes

### 7.1 `POST /api/contest/vote`

```ts
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
    if (!picture_id) {
        return NextResponse.json({ error: 'Missing picture_id' }, { status: 400 });
    }

    // Generate fingerprint
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';
    const userAgent = headersList.get('user-agent') ?? 'unknown';
    const fingerprint = generateFingerprint(ip, userAgent);

    const supabase = createPictureContestServiceClient();

    // Check if this fingerprint has voted before — skip captcha if so
    const { data: existingVotes } = await supabase
        .from('contest_votes')
        .select('id')
        .eq('voter_fingerprint', fingerprint)
        .limit(1);

    const hasVotedBefore = (existingVotes?.length ?? 0) > 0;

    if (!hasVotedBefore) {
        if (!hcaptcha_token) {
            return NextResponse.json({ error: 'Captcha required for first vote' }, { status: 400 });
        }
        const captchaRes = await fetch('https://hcaptcha.com/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${process.env.HCAPTCHA_SECRET_KEY}&response=${hcaptcha_token}`,
        });
        const captchaData = await captchaRes.json();
        if (!captchaData.success) {
            return NextResponse.json({ error: 'Captcha failed' }, { status: 403 });
        }
    }

    // Insert vote
    const { error } = await supabase
        .from('contest_votes')
        .insert({ picture_id, voter_fingerprint: fingerprint });

    if (error) {
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Already voted' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
```

### 7.2 `POST /api/contest/unvote`

Uses `POST` (not `DELETE`) to avoid proxy/CDN issues with request bodies on DELETE.

```ts
import { NextRequest, NextResponse } from 'next/server';
import { createPictureContestServiceClient } from '@/lib/supabase/picture-contest-service';
import { generateFingerprint } from '@/lib/contest/fingerprint';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
    const votingOpen = process.env.VOTING_OPEN === 'true';
    const closesAt = process.env.VOTING_CLOSES_AT;
    if (!votingOpen || (closesAt && new Date() > new Date(closesAt))) {
        return NextResponse.json({ error: 'Voting is closed' }, { status: 403 });
    }

    const { picture_id } = await request.json();
    if (!picture_id) {
        return NextResponse.json({ error: 'Missing picture_id' }, { status: 400 });
    }

    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown';
    const userAgent = headersList.get('user-agent') ?? 'unknown';
    const fingerprint = generateFingerprint(ip, userAgent);

    const supabase = createPictureContestServiceClient();
    const { error } = await supabase
        .from('contest_votes')
        .delete()
        .eq('picture_id', picture_id)
        .eq('voter_fingerprint', fingerprint);

    if (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
```

---

## Part 8 — Voting Page (Server Component)

```ts
// app/[locale]/picture-contest/voting/page.tsx
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

    const favoriteIds = (favorites ?? []).map((f: { picture_id: number }) => f.picture_id);

    if (favoriteIds.length === 0) {
        return (
            <VotingPageClient
                photos={[]}
                locale={locale}
                isActive={isActive}
                closesAt={closesAt}
                seed={0}
            />
        );
    }

    const { data: photos } = await supabase
        .from('contest_pictures')
        .select('id, storage_path')
        .in('id', favoriteIds);

    // Fetch vote counts via SECURITY DEFINER function
    const { data: voteCounts } = await supabase.rpc('get_vote_counts');

    const voteMap = new Map(
        (voteCounts ?? []).map((v: { picture_id: number; vote_count: number }) =>
            [v.picture_id, Number(v.vote_count)]
        )
    );

    const photosWithCounts = (photos ?? []).map((p: { id: number; storage_path: string }) => ({
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

## Part 9 — Client Components

### 9.1 `VotingPageClient` — Key Rules

- **Never render `unique_id`, `taken_at`, `filename`, or `machine_id`** — only the image and vote count
- Vote button is a star — filled if already voted, outline if not
- Clicking a voted star unvotes (toggle behavior)
- Vote count is shown publicly on each card
- hCaptcha widget appears **only on first vote** (shown in a small modal overlay)
- After first successful vote, set `sessionStorage.setItem('hasVotedBefore', 'true')` and skip captcha for subsequent votes
- Empty state: "No photos to vote on yet" message when `photos.length === 0`

### 9.2 Voting closed state

When `isActive === false`, the page still shows all photos and vote counts but stars are disabled. A banner displays:

- PT: "A votação encerrou em 06/05/2026. Obrigado por participar!"
- EN: "Voting closed on 05/06/2026. Thank you for participating!"

### 9.3 `VotingCard` — Single Photo

- Uses the same **PolaroidCard** component as the player gallery (polaroid frame, random rotation, hover effects)
- **No text labels** — no unique code, no date, no booth name. The polaroid label is empty or omitted.
- Star button overlaid on the card (same position as the favorite star in the gallery)
- Vote count always visible on the card (bandwagon bias is intentional)
- **No confirmation modal** for vote or unvote — single click toggle
- Subtle animation on vote/unvote (pulse, scale, or color transition)

---

## Part 10 — Middleware Update

The existing middleware matcher already covers `/picture-contest/:path*`, so `/voting` is automatically included. One change needed:

**The `/voting` route should be accessible even when `PICTURE_CONTEST_LIVE=false`**, controlled by its own `VOTING_OPEN` gate instead. Add this exception to the middleware:

```ts
const isVotingRoute = /^\/(en|pt-BR)\/picture-contest\/voting/.test(pathname);

if (isPictureContestRoute && !isPictureContestAdmin && !isVotingRoute) {
    // existing PICTURE_CONTEST_LIVE gate — voting is excluded
}

if (isVotingRoute) {
    const votingOpen = process.env.VOTING_OPEN === 'true';
    const closesAt = process.env.VOTING_CLOSES_AT;
    const isExpired = closesAt ? new Date() > new Date(closesAt) : false;
    if (!votingOpen || isExpired) {
        const url = request.nextUrl.clone();
        url.pathname = `/${locale}/picture-contest`;
        return NextResponse.redirect(url);
    }
}
```

---

## Part 11 — Update Entry Page

Add a link to `/voting` on the picture-contest entry page, below the code input form:

```tsx
<div className="mt-8 text-center border-t border-neutral-200 pt-6">
    <p className="text-neutral-500 font-body text-sm mb-2">
        {locale === 'en'
            ? 'Want to vote on your favorite photos?'
            : 'Quer votar nas suas fotos favoritas?'}
    </p>
    <Link
        href={`/${locale}/picture-contest/voting`}
        className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-body font-semibold transition-colors"
    >
        ⭐ {locale === 'en' ? 'Go to voting' : 'Ir para a votação'}
    </Link>
</div>
```

---

## Part 12 — i18n Strings

Add to `pictureContestI18n.ts`:

```ts
// Voting page strings (both locales)
votingTitle: '...',
votingSubtitle: (count: number) => '...',
voteButton: '...',
unvoteButton: '...',
votesCount: (n: number) => '...',
votingClosed: '...',
noPicturesVoting: '...',
captchaTitle: '...',
captchaSubtitle: '...',
```

---

## Checklist

### Manual Steps (You)
- [ ] Run SQL from Part 1 in Supabase SQL editor (picture-contest project)
- [ ] Register at hcaptcha.com and get site key + secret key
- [ ] Add env vars from Part 2 to `.env.local`
- [ ] Add same env vars to Vercel dashboard
- [ ] Set `PICTURE_CONTEST_LIVE=true` if not already

### Code (Copilot)
- [ ] Install `@hcaptcha/react-hcaptcha`
- [ ] Create `src/lib/contest/fingerprint.ts`
- [ ] Create `src/lib/contest/voting-algorithm.ts`
- [ ] Create `src/app/api/contest/vote/route.ts`
- [ ] Create `src/app/api/contest/unvote/route.ts`
- [ ] Create `src/app/[locale]/picture-contest/voting/page.tsx`
- [ ] Create `src/components/picture-contest/VotingPageClient.tsx`
- [ ] Create `src/components/picture-contest/VotingCard.tsx`
- [ ] Update middleware for voting route exception
- [ ] Update entry page with link to voting
- [ ] Add i18n strings to `pictureContestI18n.ts`

### Testing
- [ ] Vote on a photo — verify row appears in `contest_votes`
- [ ] Vote on same photo again — verify 409 returned
- [ ] Unvote — verify row is deleted
- [ ] Set `VOTING_OPEN=false` — verify stars are not clickable
- [ ] Verify `unique_id` never appears in voting page HTML source
- [ ] Verify page order changes on reload
- [ ] Test hCaptcha: first vote shows captcha, subsequent votes skip it
- [ ] Test empty state when no favorites exist yet
