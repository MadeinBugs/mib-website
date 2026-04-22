### Studio Control Panel Bundling

- [x] **Auto-bundle on eligible selection:** Select cloud-server + any self-hosted service (e.g., Twenty CRM via self-hosted hosting-choice). Studio Control Panel appears automatically in the cart with checkbox locked, "Included free" indicator visible, price struck through to R$ 0.
A: Correct, studio control panel appeared automatically in the cart with checkbox locked, "Included free" indicator visible, price struck through to R$ 0.

- [x] **Checkbox locked when bundled:** Click the Studio Control Panel checkbox while bundled. Nothing happens — no toggle, no dispatch. Cursor shows "not-allowed".
A: Correct.

- [x] **Cascade removal unbundles panel:** Deselect the qualifying self-hosted service. Studio Control Panel is automatically removed. Total price drops only by the CRM's price (panel was at R$ 0).
A: Correct.

- [x] **Non-self-hosted doesn't trigger bundle:** Select cloud-server, then select HubSpot (non-self-hosted CRM). Studio Control Panel does NOT auto-add. Bundle conditions not met.
A: Correct.

- [x] **Hosting-choice switch breaks bundle:** With a self-hosted CRM + bundled Panel, change CRM's hosting-choice from self-hosted to HubSpot. Panel is auto-removed. Checkbox unlocks.
A: Correct.

- [x] **localStorage restore preserves bundle state:** With a bundled configuration, reload the page. State restores, reconciler fires, Control Panel correctly bundled (or correctly absent if conditions no longer met due to catalog changes).
A: Correct.

- [x] **Manual selection before bundle eligibility:** Select Studio Control Panel first (dependency auto-adds cloud-server, panel is at R$ 150). Then add a self-hosted service. Panel transitions: checkbox locks, price strikes through to R$ 0, "Included free" indicator appears.

- [ ] **Submission includes bundle marker:** After submitting a bundled quote, verify Supabase row's `selected_items` snapshot shows `studio-control-panel` with `basePrice: 0` (or the `bundledFree: true` flag set). Verify `total_price` reflects the discount.

- [ ] **Server rejects forged bundle claim:** Via cURL, submit a payload with `bundleAdded: ['studio-control-panel']` but no qualifying self-hosted services. Server returns 400 with `BUNDLE_INVALID`.

- [ ] **Orphaned dependency after bundle break:** Have cloud-server + Twenty CRM (self-hosted) + Panel (bundled). Change Twenty's hosting-choice to HubSpot. Verify: Panel is auto-removed (bundle broken), Twenty remains with HubSpot config. Known v1 behavior: cloud-server remains selected even though it's no longer required by any selection. User must manually deselect if undesired.

### Client Deliverables Panel

- [x] **Empty state:** Deselect all services. Panel disappears (no empty "Client Deliverables" section lingering).

- [x] **Service grouping:** Select 3 services. Panel shows 3 separate expandable sections, one per service, labeled with the service name.

- [x] **Default state is expanded:** First load with services selected → all sections are open. Deliverables visible without clicking.

- [x] **Collapse/expand:** Click a service section header. It collapses. Click again, expands. Chevron rotates.

- [x] **Required badge:** Services with required deliverables show orange "X required" badge in the header.

- [x] **Optional badge:** Services with optional deliverables show green "X optional" badge in the header.

- [ ] **Both badges when applicable:** Cloud Server shows both "2 required" and "1 optional" badges when selected (payment + domain are required; branding is optional).

- [x] **Color coding inside items:** Required deliverables have "(required)" in orange text after the label. Optional have "(optional)" in green.

- [x] **Descriptions render:** Deliverables with descriptions show the description text in smaller gray text below the label.

- [x] **Option-level deliverables appear:** Select URL Shortener with self-hosted option → deliverables include cloud-server and domain access. Switch to Bitly option → those deliverables disappear.

- [x] **Header copy is correct:** Header reads "Client Deliverables" / "Entregáveis do Cliente". Subheader reads "Things you'll need to provide us to complete these services" / "Coisas que você precisará nos fornecer para completar estes serviços".

- [ ] **Mobile modal:** Open the mobile summary modal. Client Deliverables panel appears below the price summary. Same expand/collapse behavior works.


# Phase 5 Test Checklist

Save as `docs/INFRA_BUILDER_PHASE5_TEST_CHECKLIST.md` or append to existing checklist.

## Prerequisites

Before testing, verify:

- [ ] Dev server running: `npm run dev`
- [ ] `.env.local` has all required vars:
  - [ ] `SERVICES_FEATURE_LIVE=true`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `QUOTE_URL_SECRET` (64-char hex)
  - [ ] `DISCORD_QUOTE_WEBHOOK_URL`
  - [ ] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  - [ ] `BREVO_API_KEY`
- [ ] Catalog version check: `cat src/lib/services/catalog-version.generated.ts` (note the hash for later)
- [ ] Umami dashboard open in another tab at your self-hosted instance
- [ ] Supabase dashboard open → `quote_requests` table
- [ ] Discord channel open where `DISCORD_QUOTE_WEBHOOK_URL` points
- [ ] Email inbox open for the test address (`andressmartin.aka@gmail.com` or similar)
- [ ] Browser DevTools open with Network + Console tabs visible and "Preserve log" enabled

---

## 1. Happy Path Submission

- [x] Open `http://localhost:3000/pt-BR/services/infra-builder` in incognito
- [x] Select: **Cloud Server** + **Twenty CRM** (keep self-hosted hosting-choice)
- [x] Verify: **Studio Control Panel** appears automatically, checkbox locked, "Included free" badge visible
- [x] Open the Summary Panel
- [x] Verify: "Studio Control Panel (incluso grátis)" with strikethrough price
- [x] Verify: total price does NOT include the panel's R$ 150
- [x] Click **"Solicitar Orçamento"** button
- [x] Fill form:
  - Name: `Test User Phase 5`
  - Email: `andressmartin.aka@gmail.com`
  - Studio name: `Test Studio`
  - Check consent
- [x] Click **"Enviar Solicitação"**

Expected behavior:
- [x] Button shows "Enviando..." state briefly
- [x] Network tab: `POST /api/services/quote-request` returns 200 with body `{ id, shareableUrl }`
- [ ] Response has `Set-Cookie` header for `mib_quote_session`
- [x] Browser redirects to `/pt-BR/services/quote-sent?id=<uuid>`
- [ ] Quote-sent page displays the shareable URL prominently (stays visible, no flicker)
- [ ] DevTools → Application → Cookies → `mib_quote_session` is **present** (expires naturally after 10 min)
- [ ] `/services/quote-sent` page and `/services/quote/[uuid]` page have `export const dynamic = 'force-dynamic'` at top
- [x] No runtime errors in terminal when quote-sent page renders after a valid submission
- [ ] Refreshing quote-sent page within 10 min still shows the shareable URL
- [ ] After 10+ min, refreshing shows graceful fallback (cookie expired naturally)
- [x] DevTools → Application → Local Storage → `mib-infra-builder-state` is **cleared** after successful submission

---

## 2. Supabase Row Verification

Open Supabase SQL editor and run:

```sql
SELECT
  id,
  created_at,
  status,
  client_name,
  client_email,
  studio_name,
  currency,
  setup_price,
  total_price,
  maintenance_months,
  has_pending_items,
  catalog_version,
  terms_version,
  jsonb_array_length(selected_items) AS item_count,
  url_signature IS NOT NULL AS has_signature,
  LENGTH(url_signature) = 64 AS valid_sig_length
FROM quote_requests
ORDER BY created_at DESC
LIMIT 3;
```

- [ ] Row exists for your test submission
- [ ] `status = 'new'`
- [ ] `client_name = 'Test User Phase 5'`
- [ ] `client_email` matches what you submitted
- [ ] `currency = 'BRL'`
- [ ] `setup_price` equals cloud-server + CRM base prices (panel is bundled, so R$ 0 for panel)
- [ ] `total_price` equals `setup_price` (no maintenance selected)
- [ ] `catalog_version` matches `src/lib/services/catalog-version.generated.ts`
- [ ] `terms_version = '2026-04-01'` (or current `TERMS_VERSION`)
- [ ] `item_count = 3` (cloud-server + CRM + panel)
- [ ] `valid_sig_length = true`

Then verify the snapshot structure:

```sql
SELECT jsonb_pretty(selected_items)
FROM quote_requests
ORDER BY created_at DESC
LIMIT 1;
```

- [ ] `studio-control-panel` entry has `basePrice: { BRL: 0, USD: 0 }`
- [ ] `studio-control-panel` entry has `bundledFree: true`
- [ ] `studio-control-panel` entry has `maintenancePrice: { BRL: 0, USD: 0 }`
- [ ] Other items (`cloud-server`, `twenty-crm`) have their real `basePrice`, no `bundledFree` field

---

## 3. Discord Notification

In your Discord channel for `DISCORD_QUOTE_WEBHOOK_URL`:

- [ ] Rich embed appears within 5 seconds of submission
- [ ] Title: "New quote request: Test Studio" (uses studio_name if provided)
- [ ] Embed URL links to the shareable quote
- [ ] Fields present and correct:
  - [ ] Client: name + email
  - [ ] Studio: Test Studio
  - [ ] Website: — (not provided)
  - [ ] Currency: BRL
  - [ ] Setup total: formatted R$ amount
  - [ ] Maintenance: "None"
  - [ ] Grand total: formatted R$ amount
  - [ ] Pending items: "None"
  - [ ] Services: bullet list with service names
  - [ ] Locale: pt-BR
- [ ] Quote ID footer matches Supabase row ID
- [ ] Timestamp is correct

---

## 4. Brevo Email

Check `andressmartin.aka@gmail.com` inbox:

- [ ] Email arrives within 60 seconds
- [ ] From: Made in Bugs `<hello@madeinbugs.com.br>` (or configured sender)
- [ ] Subject includes "Your quote request" or "Seu pedido de orçamento" (pt-BR since submission locale)
- [ ] Greeting uses submitted name ("Olá Test User Phase 5" or similar)
- [ ] Shareable URL is present and clickable
- [ ] Clicking the URL opens the quote view page correctly
- [ ] Expiration date is 30 days from submission date
- [ ] **If the template uses `{{#studioName}}` / `{{#hasPendingItems}}` conditionals:** verify the blocks render (not as literal `{{#...}}` text). If they render as literal text, the `render.ts` doesn't support Mustache blocks — flag for a follow-up fix.
- [ ] No broken images or missing layout
- [ ] Footer links to privacy policy + terms resolve correctly
- [ ] Email not in spam folder (or if in spam, mark "Not spam" for future deliverability)

---

## 5. Shareable Quote URL

Copy the `shareableUrl` from either the Discord webhook or the email, then:

- [x] Open in **incognito/private browsing** (proves no session dependency)
- [x] Quote view page loads successfully
- [x] Header shows: "Quote for Test Studio" (pt-BR equivalent)
- [x] Status badge: "Novo" / "New" in blue
- [x] Expiration notice: "Valid for 30 more days"
- [x] Selected Services section lists all 3 items
- [x] Studio Control Panel shows:
  - [x] Teal "incluído grátis" badge with gift icon
  - [x] Price: R$ 0,00
- [x] Other items show their full prices
- [x] Summary shows setup total, no maintenance, grand total matches Supabase `total_price`
- [x] Footer: "Quote ID: <uuid>" matches
- [x] Footer: "Catalog version: <hash>" matches `catalog-version.generated.ts`

Now tamper with the signature:

- [x] Edit one character in the `?sig=` parameter of the URL
- [x] Reload
- [x] Page shows 404 (Next.js `notFound`)

And try a non-existent UUID:

- [x] Replace UUID with `00000000-0000-0000-0000-000000000000` (keep any sig)
- [x] Reload → 404

Fast rejection verification (timing side-channel):

- [ ] Open DevTools → Network tab
- [ ] Request the tampered URL
- [ ] Response time is <30ms (fast — sig rejected before DB hit)

---

## 6. Umami Events

Open Umami dashboard. If you have filtering by date, set to "Today". Submit a fresh test quote and watch events appear.

### Builder page events

- [ ] `page_view_infra_builder` fires on first load (if configured)
- [ ] `service_added` fires when a service is selected
- [ ] `service_removed` fires when a service is deselected
- [ ] `configuration_changed` fires when hosting-choice changes
- [ ] `maintenance_selected` fires when maintenance dropdown changes

### Submission events

- [ ] `quote_submission_started` fires on form submit click
  - Event data: `{ itemCount: 3, currency: 'BRL' }`
- [ ] `quote_submitted` fires on successful response
  - Event data: `{ itemCount: 3, total: <number>, currency: 'BRL' }`

### Quote-sent page events

- [ ] `page_view_quote_sent` fires when quote-sent page mounts
  - Event data: `{ quoteId: '<uuid>' }`

### Quote view page events

- [ ] `page_view_shareable_quote` fires when quote view renders
  - Event data: `{ quoteId: '<uuid>', status: 'new' }`

### CTA events

- [ ] `cta_talk_to_us_clicked` fires when clicking the banner's "Book a call" button
  - Event data: `{ source: 'builder_banner' }`
- [ ] Cal.com booking URL opens in new tab

---

## 7. Abandonment Tracking

This requires patience (30+ second wait). Run last.

- [ ] Open builder in fresh incognito
- [ ] Select one service (any)
- [ ] **Do not submit the form**
- [ ] Wait 35 seconds on the page
- [ ] Close the tab (or navigate to another URL)
- [ ] In Umami, verify `quote_abandoned` event fires within 60 seconds
  - Event data: `{ itemCount: 1, estimatedTotal: <number>, currency: 'BRL', timeOnPageSec: <~35> }`

Edge cases:

- [ ] Abandonment event does **not** fire if you wait <30 seconds and close
- [ ] Abandonment event does **not** fire if you have zero selected services
- [ ] Abandonment event does **not** fire after a successful submission (you'll need to set the state on success to prevent it)
- [ ] Abandonment event does **not** fire more than once in a single session (the `firedRef` guard)

Mobile test (optional but recommended):

- [ ] Open builder on mobile device or DevTools mobile emulation
- [ ] Select a service, wait 35s
- [ ] Switch to another app (iOS Safari triggers `visibilitychange: hidden`)
- [ ] Event f