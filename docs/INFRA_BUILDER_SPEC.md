# Infra Builder — Technical Specification

**Document purpose:** Complete technical specification for the B2B infrastructure service quote builder. For the step-by-step implementation guide, see `docs/INFRA_BUILDER_IMPLEMENTATION.md`. Written for LLM consumption.

**Project:** Made in Bugs Infrastructure Services — interactive quote builder that allows prospective clients to select from a catalog of infrastructure/automation services, configure them, view live pricing, and submit a quote request.

**Host site:** `madeinbugs.com.br` (Next.js 15 App Router, deployed on Vercel).

---

## 1. Project Context

This feature is added to the existing `madeinbugs.com.br` website repository. It does not replace or modify existing features. It reuses:

- Existing Next.js App Router and `[locale]` i18n pattern
- Existing Supabase (main project) connection and `@supabase/ssr` setup
- Existing Brevo email engine (`src/emails/render.ts`, `src/emails/templates/base.ts`)
- Existing rate limiter (`src/lib/rate-limit.ts`)
- Existing Discord webhook pattern from newsletter flow
- Existing Umami analytics
- Existing Tailwind design system and crayon styling
- Existing Framer Motion animations

New dependencies to add:
- `zod` (^3.x) — runtime payload validation, shared client/server

---

## 2. Routing Structure

All routes are under `[locale]`. Locales: `en`, `pt-BR`.

```
/[locale]/services                          → Landing page (pitch + stack showcase)
/[locale]/services/infra-builder            → Interactive builder
/[locale]/services/quote-sent               → Post-submit confirmation (query: ?id=uuid)
/[locale]/services/quote/[uuid]             → Public read-only quote view (requires ?sig=hmac)

/[locale]/terms                             → Terms index page (list of versions)
/[locale]/terms/services                    → B2B infra services terms (new)
/[locale]/terms/social-media-tool           → Existing /terms content relocated
/[locale]/terms/newsletter                  → Newsletter-specific terms (split out)

/[locale]/privacy                           → Privacy index page
/[locale]/privacy/services                  → B2B data processing policy (new)
/[locale]/privacy/social-media-tool         → Existing /privacy content relocated
/[locale]/privacy/newsletter                → Newsletter privacy (split out)

/api/services/quote-request                 → POST: submit quote
/api/services/quote/[uuid]                  → GET: fetch quote for shareable URL page
/api/services/retry-twenty-sync             → POST: admin-only, re-fires n8n webhook

/admin/quotes                               → Admin quote management (not under [locale])
```

Redirects (in `next.config.js`):
- `/terms` → `/pt-BR/terms`
- `/privacy` → `/pt-BR/privacy`

---

## 3. Data Model

### 3.1 Core Types (`src/lib/services/types.ts`)

```typescript
export type Currency = 'BRL' | 'USD';
export type Locale = 'en' | 'pt-BR';

export interface BilingualString {
  en: string;
  'pt-BR': string;
}

export interface Price {
  BRL: number;
  USD: number;
}

export type ServiceCategory =
  | 'infrastructure'
  | 'cicd'
  | 'automation'
  | 'crm'
  | 'marketing'
  | 'analytics'
  | 'internal-tools'
  | 'social-media';

export type DeliverableType =
  | 'domain'
  | 'account-access'
  | 'api-key'
  | 'credentials'
  | 'decision'
  | 'payment-method'
  | 'other';

export interface ClientDeliverable {
  id: string;                           // stable, used for dedup across services
  type: DeliverableType;
  label: BilingualString;
  description?: BilingualString;
}

export interface ThirdPartyCost {
  id: string;                           // stable ID for dedup
  label: BilingualString;
  amount: Price;
  amountMax?: Price;                    // if defined, displays as range
  frequency: 'monthly' | 'yearly' | 'one-time';
  note?: BilingualString;               // e.g. "depends on usage"
  providerUrl?: string;
}

export interface MaintenancePlan {
  price: Price;                         // monthly maintenance cost
  scope?: BilingualString;              // optional; falls back to DEFAULT_MAINTENANCE_SCOPE
}

export interface ServiceConfigurationOption {
  id: string;
  label: BilingualString;
  description?: BilingualString;
  priceModifier: Price;                 // added to basePrice
  maintenanceModifier?: Price;          // added to maintenance.price if present
  thirdPartyCosts?: ThirdPartyCost[];
  additionalDeliverables?: ClientDeliverable[];
  additionalRequires?: string[];        // additional service IDs required if this option is selected
}

export interface ServiceConfiguration {
  id: string;
  label: BilingualString;
  description?: BilingualString;
  type: 'single-select' | 'multi-select';
  required: boolean;
  defaultOptionId?: string;             // must exist in options if type === 'single-select'
  options: ServiceConfigurationOption[];
}

export interface CustomField {
  id: string;
  label: BilingualString;
  helpText?: BilingualString;
  type: 'text' | 'textarea' | 'number';
  placeholder?: BilingualString;
  repeatable: boolean;
  pendingPricing: boolean;              // if true, shows "⏱ Quoted after review" badge
  minItems?: number;                    // only if repeatable
  maxItems?: number;                    // only if repeatable
  minLength?: number;
  maxLength?: number;
}

export interface ServiceItem {
  id: string;                           // kebab-case, stable
  category: ServiceCategory;
  name: BilingualString;
  shortDescription: BilingualString;    // 1-2 lines, shown in card
  longDescription: BilingualString;     // markdown, shown on expand
  
  basePrice: Price;
  maintenance: MaintenancePlan | null;  // null = no maintenance available
  
  configurations?: ServiceConfiguration[];
  customFields?: CustomField[];
  
  requires?: string[];                  // service IDs that must also be selected
  recommends?: string[];                // soft suggestion, shown as "You may also want"
  conflictsWith?: string[];             // mutually exclusive service IDs
  
  clientDeliverables: ClientDeliverable[];
  thirdPartyCosts?: ThirdPartyCost[];
  
  estimatedSetupDays?: number;          // transparency, shown in card
  
  active: boolean;                      // if false, not shown in builder
}

// Submission payload types (client → server)

export interface SelectedConfiguration {
  configurationId: string;
  selectedOptionIds: string[];          // always array; single-select has length 1
}

export interface SubmittedCustomFieldValue {
  customFieldId: string;
  values: string[];                     // always array; non-repeatable has length 1
}

export interface SelectedServiceItem {
  serviceId: string;
  configurations: SelectedConfiguration[];
  customFields: SubmittedCustomFieldValue[];
}

// Snapshot stored in Supabase JSONB — immutable record of what was quoted.
// The quote view page reads ONLY from this snapshot, never from the live catalog.
// This makes shareable URLs immutable documents even after catalog changes.
export interface SelectedItemSnapshot {
  serviceId: string;
  serviceName: BilingualString;         // snapshotted at submission time
  serviceCategory: ServiceCategory;     // snapshotted
  basePrice: Price;                     // snapshotted
  configurations: Array<{
    configurationId: string;
    configurationLabel: BilingualString;  // snapshotted
    selectedOptions: Array<{
      optionId: string;
      optionLabel: BilingualString;       // snapshotted
      priceModifier: Price;               // snapshotted
    }>;
  }>;
  customFields: Array<{
    customFieldId: string;
    customFieldLabel: BilingualString;    // snapshotted
    values: string[];
    pendingPricing: boolean;              // snapshotted
  }>;
  maintenancePrice: Price | null;       // effective monthly cost (base + option modifiers)
  maintenanceBreakdown?: {              // optional, for debugging/transparency
    base: Price;
    modifiers: Array<{ optionId: string; amount: Price }>;
  };
  deliverables: ClientDeliverable[];    // snapshotted, dedup'd
  thirdPartyCosts: ThirdPartyCost[];    // snapshotted, dedup'd
}

export interface QuoteSubmission {
  locale: Locale;
  currency: Currency;
  selectedItems: SelectedServiceItem[];
  maintenanceMonths: 0 | 3 | 6 | 12;
  clientInfo: {
    name: string;
    email: string;
    studioName?: string;
    studioWebsite?: string;
    message?: string;
  };
  consentAccepted: boolean;
  termsVersion: string;
  catalogVersion: string;               // must match CATALOG_VERSION; used for drift detection
  honeypot: string;                     // must be empty; field name: 'company_url_confirm'
  refParam?: string;                    // UTM attribution
  clientComputedTotal: number;          // server verifies this matches
}
```

### 3.2 Catalog Structure

```
src/lib/services/
  types.ts
  defaults.ts                           // DEFAULT_MAINTENANCE_SCOPE, TERMS_VERSION
  catalog-version.generated.ts          // CATALOG_VERSION (auto-derived at build time by validate-catalog.ts)
  deliverables.ts                       // shared ClientDeliverable definitions
  third-party-costs.ts                  // shared ThirdPartyCost definitions
  catalog.ts                            // aggregates all categories into SERVICE_CATALOG
  categories/
    infrastructure.ts
    cicd.ts
    automation.ts
    crm.ts
    marketing.ts
    analytics.ts
    internal-tools.ts
    social-media.ts
  pricing.ts                            // price recomputation logic
  dependencies.ts                       // dependency resolver + cycle detection
  validation.ts                         // Zod schemas + server-side validation
  quote-url.ts                          // HMAC signing for shareable quote URLs
```

### 3.3 Supabase Schema

Run as SQL migration on the main Supabase project:

```sql
create table quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'accepted', 'rejected', 'expired')),
  
  locale text not null check (locale in ('en', 'pt-BR')),
  currency text not null check (currency in ('BRL', 'USD')),
  client_name text not null,
  client_email text not null,
  studio_name text,
  studio_website text,
  message text,
  
  selected_items jsonb not null,        -- Array of SelectedItemSnapshot (denormalized, immutable)
  
  setup_price numeric not null,
  total_price numeric not null,
  has_pending_items boolean not null default false,
  pending_item_count int not null default 0,
  
  maintenance_months int not null default 0
    check (maintenance_months in (0, 3, 6, 12)),
  maintenance_monthly_price numeric not null default 0,
  maintenance_total numeric not null default 0,
  
  ref_param text,
  ip_hash text,
  user_agent text,
  
  consent_accepted boolean not null,
  consent_accepted_at timestamptz not null,
  terms_version text not null,
  catalog_version text not null,
  
  twenty_opportunity_id text,
  response_notes text,
  response_sent_at timestamptz,
  
  url_signature text not null
);

create index idx_quote_requests_status on quote_requests(status);
create index idx_quote_requests_expires_at on quote_requests(expires_at);
create index idx_quote_requests_email on quote_requests(client_email);
create index idx_quote_requests_created_at on quote_requests(created_at desc);

alter table quote_requests enable row level security;
-- No RLS policies: all access goes through API routes using service role key
```

---

## 4. Component Structure

```
src/app/[locale]/services/
  page.tsx                              Landing page (server component)
  ServicesLandingClient.tsx             Client wrapper for animations
  infra-builder/
    page.tsx                            Builder shell (server component)
    InfraBuilderClient.tsx              Root client component holding all state
  quote-sent/
    page.tsx                            Confirmation page (server, reads ?id= and ?sig=)
  quote/
    [uuid]/
      page.tsx                          Read-only quote view (server)
      QuoteViewClient.tsx               Client wrapper if interactive elements needed

src/components/services/
  landing/
    HeroSection.tsx                     Title, subtitle, primary CTA to builder
    StackShowcase.tsx                   "Powered by this same stack" gallery
    ProcessSteps.tsx                    How it works: submit → review → deliver
    CallToAction.tsx                    Final CTA block

  builder/
    CategorySection.tsx                 Collapsible category block
    ServiceCard.tsx                     Service entry with checkbox + expand
    ServiceConfigurator.tsx             Dropdowns for ServiceConfiguration items
    CustomFieldInput.tsx                Text/textarea; handles repeatable fields
    DependencyIndicator.tsx             "Requires X" / "Auto-added because Y"
    PendingPricingBadge.tsx             "⏱ Quoted after review"
    ConflictWarning.tsx                 Shown when conflictsWith is triggered
    RecommendationToast.tsx             Soft suggestion when recommends array present

  summary/
    SummaryPanel.tsx                    Right-side sticky container (desktop)
                                         or bottom sheet (mobile)
    ItemizedList.tsx                    Selected items with per-item price
    PendingItemsList.tsx                Pending-pricing items (separate section)
    MaintenanceSelector.tsx             Duration dropdown (0/3/6/12) + scope display
    ThirdPartyCostsList.tsx             Dedup'd third-party costs with frequency
    PriceTotals.tsx                     Setup subtotal + maintenance total + grand total
    PendingPricingNotice.tsx            Warning banner when has_pending_items

  deliverables/
    ClientDeliverablesPanel.tsx         Dedup'd list of required deliverables
    DeliverableItem.tsx                 Single deliverable row with type icon
    DeliverableTypeIcon.tsx             Icon per DeliverableType

  form/
    QuoteSubmitForm.tsx                 Contact info + message + consent + submit
    ConsentCheckbox.tsx                 Terms + privacy acceptance with inline links
    HoneypotField.tsx                   Hidden field for bot detection
    SubmitButton.tsx                    Disabled until valid state

  shared/
    CurrencyToggle.tsx                  BRL/USD switch (optional; defaults to locale)
    AbandonmentTracker.tsx              Umami beforeunload hook
    PriceDisplay.tsx                    Formatted currency output
    BilingualText.tsx                   Reads BilingualString using active locale

  quote-view/
    QuoteSnapshot.tsx                   Read-only view of submitted quote
    QuoteStatusBadge.tsx                New / Contacted / Quoted / Expired / Accepted / Rejected
    QuoteExpirationNotice.tsx           "Valid until [date]" banner
```

All components follow the existing `madeinbugs.com.br` conventions:
- Server components by default; `Client.tsx` suffix or `'use client'` directive only when needed.
- Tailwind classes inline; reuse `.btn-crayon`, `.card-crayon`, `.content-card` where applicable.
- Framer Motion imported from `'framer-motion'`, not `motion/react`.
- i18n via `getTranslations(locale)` (server) or bilingual objects accessed by locale key (client).

---

## 5. State Management (InfraBuilderClient)

The builder is a single-page client component. State shape:

```typescript
interface BuilderState {
  locale: Locale;
  currency: Currency;
  selectedItems: Record<string, SelectedServiceItem>;  // keyed by serviceId (plain object for JSON serialization)
  maintenanceMonths: 0 | 3 | 6 | 12;
  clientInfo: {
    name: string;
    email: string;
    studioName: string;
    studioWebsite: string;
    message: string;
  };
  consentAccepted: boolean;
  expandedCategories: ServiceCategory[];                // plain array (not Set) for JSON serialization
  expandedServices: string[];                            // plain array (not Set) for JSON serialization
  submissionState: 'idle' | 'submitting' | 'success' | 'error';
  submissionError: string | null;
  submittedQuoteId: string | null;
}
```

Use `useReducer` rather than multiple `useState` hooks because state transitions are interdependent (adding a service may auto-add dependencies, deselecting may cascade).

### 5.1 Reducer Actions

```typescript
type BuilderAction =
  | { type: 'TOGGLE_SERVICE'; serviceId: string }
  | { type: 'SET_CONFIGURATION'; serviceId: string; configurationId: string; optionIds: string[] }
  | { type: 'ADD_CUSTOM_FIELD_VALUE'; serviceId: string; customFieldId: string; value: string }
  | { type: 'UPDATE_CUSTOM_FIELD_VALUE'; serviceId: string; customFieldId: string; index: number; value: string }
  | { type: 'REMOVE_CUSTOM_FIELD_VALUE'; serviceId: string; customFieldId: string; index: number }
  | { type: 'SET_MAINTENANCE_MONTHS'; months: 0 | 3 | 6 | 12 }
  | { type: 'SET_CURRENCY'; currency: Currency }
  | { type: 'UPDATE_CLIENT_INFO'; field: keyof BuilderState['clientInfo']; value: string }
  | { type: 'SET_CONSENT'; accepted: boolean }
  | { type: 'TOGGLE_CATEGORY'; category: ServiceCategory }
  | { type: 'TOGGLE_SERVICE_EXPANDED'; serviceId: string }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; quoteId: string }
  | { type: 'SUBMIT_ERROR'; error: string };
```

### 5.2 Dependency Resolution on Toggle

When `TOGGLE_SERVICE` fires:

**Selecting:**
1. Add service to `selectedItems` with default configurations (use `defaultOptionId` for each single-select; empty array for multi-select with no required).
2. Recursively add any services listed in `requires` (respect existing selections; do not re-add).
3. Track which services were auto-added and why (for UI feedback).
4. Check `conflictsWith`: if any conflicting service is selected, show warning and block selection (do not auto-resolve; user decides).

**Deselecting:**
1. Find all currently-selected services that depend on this one (`requires.includes(serviceId)`).
2. If any exist, cascade-deselect them too.
3. Show an undo toast listing what was removed.

**Configuration-driven dependencies (`SET_CONFIGURATION`):**

When `SET_CONFIGURATION` fires, the reducer must:
1. Update the service's selected option IDs.
2. Re-resolve dependencies considering the new option's `additionalRequires`.
3. Auto-add any newly-required services (with UI feedback via `DependencyIndicator`).
4. Recalculate totals, deliverables, and third-party costs.
5. When switching an option that previously added a dependency (e.g., "Ampere tier" → "Free tier" removes a Cloudflare requirement), do NOT cascade-remove the dependency. Keep it selected; the user can manually deselect. This prevents accidental data loss.

### 5.3 Derived State (via `useMemo`)

Computed on every state change:

- `flatSelectedServices`: Array of full `ServiceItem` objects with merged configuration data.
- `setupSubtotal`: Sum of `basePrice[currency]` + all selected `priceModifier[currency]` across configurations.
- `maintenanceMonthlyPrice`: Sum of `maintenance.price[currency]` + `maintenanceModifier[currency]` for services with maintenance, only if `maintenanceMonths > 0`.
- `maintenanceTotal`: `maintenanceMonthlyPrice * maintenanceMonths`.
- `grandTotal`: `setupSubtotal + maintenanceTotal`.
- `hasPendingItems`: `true` if any selected service has at least one custom field with `pendingPricing: true` and non-empty values.
- `pendingItemCount`: Count of such custom field values across all selected services.
- `dedupedDeliverables`: `Record<string, ClientDeliverable>` keyed by `deliverable.id` containing all deliverables from all selected services and their selected configuration options.
- `dedupedThirdPartyCosts`: Same pattern (`Record<string, ThirdPartyCost>`) for third-party costs.
- `isValid`: All required fields filled, at least one service selected, consent accepted, email format valid.

### 5.4 Persistence

Persist `BuilderState` (excluding submission state) to `localStorage` under key `mib-infra-builder-state`. Restore on mount. Clear on successful submission.

This prevents losing a 10-minute configuration if the user accidentally navigates away.

**Stale state recovery:** On mount, validate the restored state against the live catalog. If any `selectedItems` reference a service ID, configuration ID, or option ID that no longer exists in the catalog (service deleted, option removed), silently drop the invalid entries and show a toast: "Some items were no longer available and have been removed from your quote." This prevents crashes from catalog changes between sessions.

---

## 6. Pricing Logic (`src/lib/services/pricing.ts`)

Pure functions, no side effects. Must be usable from both client and server.

```typescript
export function computeSetupPrice(
  catalog: ServiceItem[],
  selectedItems: SelectedServiceItem[],
  currency: Currency
): number

export function computeMaintenanceMonthly(
  catalog: ServiceItem[],
  selectedItems: SelectedServiceItem[],
  currency: Currency
): number

export function computeGrandTotal(
  catalog: ServiceItem[],
  selectedItems: SelectedServiceItem[],
  currency: Currency,
  maintenanceMonths: 0 | 3 | 6 | 12
): { setup: number; maintenanceMonthly: number; maintenanceTotal: number; grandTotal: number }

export function countPendingItems(
  catalog: ServiceItem[],
  selectedItems: SelectedServiceItem[]
): { hasPending: boolean; count: number }

export function collectDeliverables(
  catalog: ServiceItem[],
  selectedItems: SelectedServiceItem[]
): ClientDeliverable[]  // deduped by id

export function collectThirdPartyCosts(
  catalog: ServiceItem[],
  selectedItems: SelectedServiceItem[],
  currency: Currency
): ThirdPartyCost[]  // deduped by id
```

Rules:
- Prices are numbers representing whole currency units (e.g., 800 = R$800.00). Format at display time.
- If a service ID in `selectedItems` does not exist in the catalog, skip it and log a warning. Do not throw.
- If a configuration option is not in the service's configurations, skip that modifier. Do not throw.
- `pendingPricing` custom field values do not contribute to the total.

---

## 7. Dependency Resolver (`src/lib/services/dependencies.ts`)

```typescript
export function resolveDependencies(
  catalog: ServiceItem[],
  serviceId: string,
  selectedOptionIds: Record<string, string[]>  // keyed by configurationId
): string[]  // full set of service IDs that must be selected, including serviceId itself

export function findDependents(
  catalog: ServiceItem[],
  serviceId: string,
  currentlySelected: Set<string>
): string[]  // currently-selected services that depend on serviceId

export function hasConflicts(
  catalog: ServiceItem[],
  serviceIds: Set<string>
): { serviceId: string; conflictsWith: string[] }[]

export function detectCycles(catalog: ServiceItem[]): string[][]
// Returns list of cycles found; empty array if none.
// Used by validate-catalog.ts build script.
```

Resolver must handle transitive dependencies (A requires B requires C).

---

## 8. Server-Side Validation (`src/lib/services/validation.ts`)

Uses Zod. Exports both the schema and a high-level validator function.

```typescript
import { z } from 'zod';

export const SelectedConfigurationSchema = z.object({
  configurationId: z.string().min(1).max(100),
  selectedOptionIds: z.array(z.string().min(1).max(100)).max(20),
});

export const SubmittedCustomFieldValueSchema = z.object({
  customFieldId: z.string().min(1).max(100),
  values: z.array(z.string().max(5000)).max(20),
});

export const SelectedServiceItemSchema = z.object({
  serviceId: z.string().min(1).max(100),
  configurations: z.array(SelectedConfigurationSchema).max(20),
  customFields: z.array(SubmittedCustomFieldValueSchema).max(20),
});

export const QuoteSubmissionSchema = z.object({
  locale: z.enum(['en', 'pt-BR']),
  currency: z.enum(['BRL', 'USD']),
  selectedItems: z.array(SelectedServiceItemSchema).min(1).max(50),
  maintenanceMonths: z.union([z.literal(0), z.literal(3), z.literal(6), z.literal(12)]),
  clientInfo: z.object({
    name: z.string().min(1).max(200),
    email: z.string().email().max(320),
    studioName: z.string().max(200).optional(),
    studioWebsite: z.string().max(500).optional(),
    message: z.string().max(5000).optional(),
  }),
  consentAccepted: z.literal(true),
  termsVersion: z.string().min(1).max(50),
  catalogVersion: z.string().min(1).max(50),
  honeypot: z.literal(''),              // must be empty string
  refParam: z.string().max(100).optional(),
  clientComputedTotal: z.number().nonnegative(),
});

export type ValidatedSubmission = z.infer<typeof QuoteSubmissionSchema>;
```

### 8.1 Business Rule Validation

After Zod passes, run `validateSubmissionAgainstCatalog` which checks:

1. Every `serviceId` exists in the catalog and is `active: true`.
2. Every `configurationId` exists on its parent service.
3. Every `selectedOptionIds` value exists in the configuration's options array.
4. Single-select configurations have exactly 1 option; multi-select has 0 or more.
5. All `configurations` marked `required: true` on a selected service have a value.
6. Every `customFieldId` exists on its parent service.
7. Custom field values respect `minLength`, `maxLength`, `minItems`, `maxItems`.
8. Custom field values for non-repeatable fields have exactly 1 value.
9. All services in `requires` arrays are also in `selectedItems`.
10. No two services in `selectedItems` have `conflictsWith` overlap.
11. `clientComputedTotal` check against server-computed total (tiered):
    - Within 0.01: accept silently (floating-point rounding).
    - Within 10%: accept but log a warning to Discord ("Price drift detected on quote [uuid]: client=X, server=Y").
    - Beyond 10%: reject with error code `PRICE_DRIFT_TOO_LARGE` and user-facing message: "Our pricing has been updated since you started. Please review your package and try again." The client then re-fetches the current catalog state.
12. `termsVersion` matches current `TERMS_VERSION` constant.
13. `catalogVersion` matches current `CATALOG_VERSION` constant. If mismatched AND the tiered price check (rule 11) also shows drift, return `CATALOG_VERSION_MISMATCH` and force a client re-fetch. If versions match, silent-accept even with small drift.

Return type:

```typescript
type ValidationResult =
  | { ok: true; data: ValidatedSubmission; computedTotals: ComputedTotals }
  | { ok: false; error: string; code: ValidationErrorCode };
```

`ValidationErrorCode` enum for client-safe error messages. Never leak catalog internals in error responses. Map to generic messages client-side.

---

## 9. HMAC Signing for Shareable Quote URLs (`src/lib/services/quote-url.ts`)

Shareable URLs have the form:

```
/[locale]/services/quote/[uuid]?sig=[hmac]
```

Signing logic (reuses pattern from `src/lib/unsubscribe.ts`):

```typescript
import crypto from 'crypto';

const SECRET = process.env.QUOTE_URL_SECRET!;

export function signQuoteId(uuid: string): string {
  return crypto
    .createHmac('sha256', SECRET)
    .update(uuid)
    .digest('hex');  // full 64-char hex digest, no truncation (matches unsubscribe.ts pattern)
}

export function verifyQuoteSignature(uuid: string, sig: string): boolean {
  const expected = signQuoteId(uuid);
  if (sig.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export function buildQuoteUrl(locale: Locale, uuid: string, baseUrl: string): string {
  const sig = signQuoteId(uuid);
  return `${baseUrl}/${locale}/services/quote/${uuid}?sig=${sig}`;
}
```

Store the signature in the `url_signature` column at insert time. When the quote view route loads, validate `sig` from the query string against the stored signature with `timingSafeEqual`. If mismatch, return 404.

---

## 10. API Routes

### 10.1 POST `/api/services/quote-request`

Flow:

1. **Rate limit:** 3 requests per IP per 60 seconds. Use `checkRateLimitRedis` from `src/lib/rate-limit-redis.ts`. On limit, return 429. On Upstash unreachable: fail open (allow the request, log the error to Discord). Throttle Discord error logs to 1 per minute via an in-memory counter to prevent log spam during extended Upstash outages.
2. **Parse body** as JSON. If malformed, return 400.
3. **Feature flag:** Check `SERVICES_FEATURE_LIVE`. If `'false'` (default), return 503 with maintenance message. Existing quotes remain accessible via the GET route regardless of this flag.
4. **Zod validation:** `QuoteSubmissionSchema.safeParse(body)`. On failure, return 400 with generic message.
5. **Honeypot check:** Already enforced by Zod (`z.literal('')` on `company_url_confirm`), but double-check.
6. **Catalog validation:** Run `validateSubmissionAgainstCatalog`. On failure, return 400.
6a. **Catalog version check:** Enforce Section 8.1 Rule 13. If `submission.catalogVersion !== CATALOG_VERSION` and server-computed total differs from `clientComputedTotal` by more than 0.01, return 400 with `CATALOG_VERSION_MISMATCH`. This is the trigger for a client re-fetch of the live catalog.
7. **Compute server-side totals** using `pricing.ts` functions.
8. **Generate UUID** via `crypto.randomUUID()`.
9. **Compute HMAC signature** via `signQuoteId(uuid)`.
10. **Compute `expires_at`** as `now + 30 days`.
11. **Hash IP** using SHA-256 (consistent with existing patterns). Store in `ip_hash`.
12. **Build `selected_items` snapshot** by mapping `SelectedServiceItem[]` to `SelectedItemSnapshot[]` with full denormalized catalog data. Also populate `catalog_version` from the `CATALOG_VERSION` constant.
13. **Insert into Supabase** via `createServiceClient()` from `src/lib/supabase/service.ts`. Columns: all fields from submission plus computed values, `setup_price`, `catalog_version`, snapshot.
14. **Send Discord webhook** to `DISCORD_QUOTE_WEBHOOK_URL` with rich embed (see 10.3).
15. **Send confirmation email** via Brevo using `quote-received.{locale}.md` template. Include shareable URL.
16. **Fire Umami event** on response headers (client fires the main `quote_submitted` event; server does not duplicate).
17. **Set HTTP-only cookie** `mib_quote_session=<uuid>:<sig>` with 10 minute TTL, `SameSite=Lax`, `Secure`, `Path=/`. (Setting allowed in API routes per Next.js 15 rules; server components are read-only.) The cookie has a 10-minute TTL and is not manually cleared after the quote-sent page renders. It is overwritten on the next successful submission from the same browser, and expires naturally otherwise. Explicit clearing was evaluated and rejected: it requires either a Server Action (causes page re-render flicker in Next.js 15) or a dedicated API route (adds infrastructure for no meaningful benefit given the cookie's short TTL and limited scope).
18. **Return 200** with `{ id: uuid, shareableUrl: string }`. The `sig` is NOT included in the response body — the submitter accesses the quote-sent page via the cookie set in step 17. The shareable URL in the confirmation email includes `?sig=<sig>` for external sharing.

On any step 14–16 error (Discord, Brevo, Umami) after successful Supabase insert (step 13): log error, still return success to the client. The Supabase row exists and n8n will pick it up; recoverable partial failure.

If Supabase insert (step 13) itself fails: return 500 with generic message.

**Brevo failure hedging:** If the confirmation email (step 15) fails silently, the `quote-sent` page prominently displays the shareable URL and the text: "We’ve also emailed this link to [email]. If you don’t see it within 5 minutes, save this URL now." This hedges Brevo failure without requiring retry infrastructure.

### 10.2 GET `/api/services/quote/[uuid]`

Query params: `sig`.

1. Extract `uuid` from path, `sig` from query.
2. If `sig` missing, return 404.
3. Fetch row from `quote_requests` where `id = uuid`.
4. If not found, return 404.
5. Verify `sig` matches `url_signature` via timing-safe comparison. On mismatch, return 404.
6. If `status === 'new'` and `expires_at < now`, update status to `'expired'` and include updated status in response.
7. Return public-safe subset of the row:
   - `id`, `created_at`, `expires_at`, `status`
   - `locale`, `currency`
   - `client_name`, `studio_name`, `studio_website` (omit `client_email`)
   - `selected_items` (full `SelectedItemSnapshot[]` — rendered directly, never re-resolved from live catalog)
   - `setup_price`, `total_price`, `has_pending_items`, `pending_item_count`
   - `maintenance_months`, `maintenance_monthly_price`, `maintenance_total`
   - `catalog_version`
   - `response_notes`, `response_sent_at` (if status !== 'new')
   - Omit: `ip_hash`, `user_agent`, `ref_param`, `url_signature`, `twenty_opportunity_id`, consent fields

### 10.3 Discord Webhook Payload

Rich embed structure:

```typescript
{
  username: 'Infra Builder',
  embeds: [{
    title: `New quote request: ${studioName || clientName}`,
    url: shareableUrl,
    color: 0x00c69c,  // teal (matches email accent)
    fields: [
      { name: 'Client', value: `${clientName}\n${clientEmail}`, inline: true },
      { name: 'Studio', value: studioName || '—', inline: true },
      { name: 'Website', value: studioWebsite || '—', inline: true },
      { name: 'Currency', value: currency, inline: true },
      { name: 'Setup total', value: formatPrice(setupTotal, currency), inline: true },
      { name: 'Maintenance', value: maintenanceMonths > 0
        ? `${maintenanceMonths}mo × ${formatPrice(maintenanceMonthly, currency)}`
        : 'None', inline: true },
      { name: 'Grand total', value: formatPrice(grandTotal, currency), inline: false },
      { name: 'Pending items', value: hasPendingItems ? `⏱ ${pendingCount} items need review` : 'None', inline: false },
      { name: 'Services', value: serviceList, inline: false },  // bullet list of service names
      { name: 'Message', value: message ? message.slice(0, 500) : '—', inline: false },
      { name: 'Source', value: refParam || 'direct', inline: true },
      { name: 'Locale', value: locale, inline: true },
    ],
    footer: { text: `Quote ID: ${uuid}` },
    timestamp: new Date().toISOString(),
  }]
}
```

---

## 11. Email Templates

Two new templates under `src/emails/content/`:

### 11.1 `quote-received.en.md` / `quote-received.pt-BR.md`

Frontmatter:

```yaml
---
subject: "Your quote request — Made in Bugs"
previewText: "We've received your quote and will respond within 2-3 business days."
---
```

Body includes:
- Greeting with client name
- Confirmation of quote receipt
- Shareable quote URL (prominent CTA button)
- Response SLA: "We typically respond within 2-3 business days"
- Expiration notice: "This quote is valid until [expiration date]"
- If `hasPendingItems`: "Some items in your quote require review. We'll include pricing for these in our response."
- Contact line: `hello@madeinbugs.com.br`

Template variables passed from API route:
- `clientName`, `studioName`, `shareableUrl`, `expirationDate` (formatted), `hasPendingItems`, `pendingItemCount`, `locale`.

### 11.2 `quote-response.en.md` / `quote-response.pt-BR.md`

Manually triggered (not automated in v1). Sent when you respond with final pricing.

Structure:
- Greeting
- Response body (you fill in)
- Updated quote URL
- Accept/discuss CTAs

For v1, this is a template you manually render via Brevo dashboard or a future admin page. Do not wire into API in this phase.

---

## 12. n8n Workflow Specification

Triggered by Supabase webhook on `quote_requests` insert. Configure in n8n editor.

### 12.1 Workflow Nodes

```
1. Webhook Trigger (Supabase → n8n)
   Receives: full quote_requests row as JSON payload.

2. Transform Data (Code node)
   Parse selected_items JSONB, build Twenty-compatible payloads
   for Company, Person, Opportunity, and Task.

3. HTTP Request: Upsert Company in Twenty
   POST /rest/companies with match logic
   Match by: domain (extracted from studio_website) OR name
   Body: { name, domain, notes, tags: ['infra-builder', refParam] }
   Output: companyId

4. HTTP Request: Upsert Person in Twenty
   POST /rest/people with match logic
   Match by: email
   Body: { name, email, companyId }
   Output: personId

5. HTTP Request: Create Opportunity in Twenty
   POST /rest/opportunities
   Body: {
     name: `${studioName || clientName} — Infra Setup Quote`,
     stage: 'New Quote',
     amount: total_price,
     currency,
     closeDate: expires_at,
     companyId,
     pointOfContactId: personId,
     notes: [
       `Shareable URL: ${shareableUrl}`,
       `Services: ${serviceListMarkdown}`,
       `Maintenance: ${maintenanceSummary}`,
       `Pending items: ${pendingItemCount}`,
       `Client message: ${message}`,
     ].join('\n\n')
   }
   Output: opportunityId

6. HTTP Request: Create Task in Twenty
   POST /rest/tasks
   Body: {
     title: `Review quote from ${studioName || clientName}`,
     dueAt: now + 2 business days,
     assigneeId: <your Twenty user ID, stored as n8n env var>,
     opportunityId,
     notes: 'Respond within 2-3 business days per SLA.'
   }

7. HTTP Request: Update Supabase Row
   PATCH quote_requests via Supabase REST API
   Body: { twenty_opportunity_id: opportunityId }

8. HTTP Request: Post to Secondary Discord Webhook
   URL: DISCORD_QUOTE_SYNC_WEBHOOK_URL
   Body: {
     content: `✅ Twenty synced for quote ${uuid}`,
     embeds: [{
       title: `Opportunity created: ${opportunityName}`,
       url: `${twentyBaseUrl}/opportunities/${opportunityId}`,
       fields: [
         { name: 'Company', value: companyName },
         { name: 'Amount', value: formattedAmount },
         { name: 'Task due', value: taskDueDate },
       ]
     }]
   }

9. Error Branch
   If any node fails, post to DISCORD_QUOTE_SYNC_WEBHOOK_URL:
   "⚠ Twenty sync failed for quote [uuid]: [error]"
   Do not retry automatically; failures are rare enough to handle manually.
```

### 12.2 Supabase Webhook Configuration

In Supabase Dashboard → Database → Webhooks:
- Name: `infra-builder-quote-created`
- Table: `quote_requests`
- Events: `INSERT`
- HTTP method: `POST`
- URL: Your n8n webhook URL (`https://n8n.madeinbugs.com.br/webhook/infra-builder-quote`)
- Headers: `Authorization: Bearer <shared secret>` for n8n to verify origin.

### 12.3 Twenty API Considerations

Twenty's API is GraphQL-first but exposes a REST layer. If REST is incomplete for your Twenty version, use the GraphQL endpoint with hand-written queries. Store `TWENTY_API_KEY` and `TWENTY_BASE_URL` as n8n credentials.

Matching logic (upsert):
- Twenty does not have native upsert. Implement as: query first → if found, PATCH; if not, POST. Use n8n's `IF` node to branch.

---

## 13. Landing Page Content (`/[locale]/services`)

Sections in order:

1. **Hero:** Headline ("Set up your studio's infrastructure, without the setup"), subheadline, primary CTA button to `/[locale]/services/infra-builder`, secondary CTA "Not sure what you need? Book a call" → redirects to `agenda.madeinbugs.com.br` (Cal.com). Fire `cta_talk_to_us_clicked` Umami event on secondary CTA click.

2. **Problem statement:** 3-4 bullet points on pain of setting up CI/CD, CRM, mailing lists, analytics individually.

3. **What we offer:** Visual grid of 8 service categories with icons. Each links to the builder with that category expanded.

4. **How it works:** 4 steps.
   - Build your package
   - Submit quote
   - We respond in 2-3 days
   - We set it up end-to-end

5. **Stack showcase:** "See it in action" section with screenshots of:
   - Homepage dashboard (`dash.madeinbugs.com.br`)
   - Umami analytics dashboard
   - n8n workflow editor
   - Twenty CRM with populated data
   - Kuma uptime monitor
   Caption: "This is our own infrastructure. We eat our own cooking."

6. **Social proof / context:** Brief note about Made in Bugs studio, Gamescom Latam presence, etc.

7. **Final CTA:** "Ready to stop maintaining infrastructure? [Build your package]" + smaller secondary CTA: "Or [talk to us first]" linking to Cal.com.

All text in `messages/en.json` and `messages/pt-BR.json` under `services.landing.*` key.

---

## 14. Builder Page Layout (`/[locale]/services/infra-builder`)

Desktop (≥ 1024px): two-column layout.
- Left (~65% width): Scrollable catalog with category sections.
- Right (~35% width): Sticky `SummaryPanel` with totals, deliverables, maintenance selector, and submit form.

Tablet (640–1023px): Single column. Summary accessed via **floating pill button** anchored bottom-right showing "Review quote (3 items)". Tapping opens a full-screen modal overlay (reuses extracted `Modal` component from `src/components/shared/Modal.tsx`).

Mobile (< 640px): Same pattern as tablet — floating pill + full-screen modal. No bottom sheet on any viewport (avoids conflicts with OS gesture zones).

On the builder page, show a small dismissible banner at the top: "Not sure what you need? [Talk to us first]" linking to Cal.com. Auto-hides once `Object.keys(selectedItems).length > 0`.

### 14.1 Category Section Behavior

Each category starts collapsed except `infrastructure` (first category, expanded by default).

When user selects a service whose `requires` pulls in a service from another category, auto-expand that category and scroll to the newly-added service briefly (highlight animation via Framer Motion).

### 14.2 Service Card Behavior

Collapsed state shows: checkbox, name, short description, base price, estimated setup days.

Expanded state adds: long description (markdown), configurations, custom fields, client deliverables preview, third-party costs preview.

Clicking the checkbox toggles selection (does not expand). Clicking the name or an "expand" icon toggles expansion without affecting selection.

### 14.3 Configuration UI

- Single-select: native `<select>` or custom dropdown matching Tailwind design. Preselect `defaultOptionId` if defined.
- Multi-select: checkboxes grouped under a heading.
- Changing configuration updates totals immediately.

### 14.4 Custom Field UI

Non-repeatable: single text input or textarea with `placeholder` and `helpText` below.

Repeatable: stack of inputs with a "+ Add another" button. Each entry has a remove (✕) button. Enforce `maxItems`. Show `minItems` counter if > 0.

Fields with `pendingPricing: true` display a `PendingPricingBadge` next to the label.

### 14.5 Submit Form

Form placement: on desktop, inside the sticky summary panel (right column). On tablet/mobile, inside the full-screen summary modal (accessed via floating pill button).

Fields:
- Name (required)
- Email (required, regex validated)
- Studio name (optional)
- Studio website (optional, URL validated if provided)
- Message (optional, textarea)
- Honeypot field (hidden, `name="company_url_confirm"`, `aria-hidden`, `tabindex="-1"`)
- Consent checkbox: "I've read and accept the [Terms of Service] and [Privacy Policy]" with inline links opening in new tabs
- Submit button: disabled until all required fields valid, at least 1 service selected, consent checked

On submit: call `POST /api/services/quote-request`, show loading state, handle 429/400/500. On success: the API sets an HTTP-only cookie `mib_quote_session` and returns the quote ID; redirect to `/[locale]/services/quote-sent?id=<uuid>` (no `sig` in browser URL — the cookie is validated server-side on the quote-sent page, then cleared after render). The shareable URL with `?sig=` is only in the confirmation email.

---

## 15. Quote View Page (`/[locale]/services/quote/[uuid]`)

Server component. Reads `uuid` from path, `sig` from query string.

Implementation: server component calls `createServiceClient()` directly, fetches the row, and validates `sig` via `verifyQuoteSignature()` inline. The `/api/services/quote/[uuid]` endpoint exists for potential future cross-origin consumers but is not used by the quote view page.

All service details are rendered **from the `SelectedItemSnapshot[]` stored in `selected_items` JSONB**, never from the live catalog. This makes shareable URLs immutable documents even after catalog changes.

Renders:
- Header: "Quote for [Studio Name]" + `QuoteStatusBadge` (includes new `quoted` status)
- Expiration notice if `status === 'new'`
- Submission date
- `catalog_version` shown as subtle footnote ("Catalog version: 2026-04-01")
- Itemized list of services from snapshot (read-only version of `ItemizedList`)
- Pending items section if applicable
- Maintenance section if `maintenance_months > 0`
- Third-party costs
- Client deliverables list
- Setup price + Total
- If `response_sent_at` is not null: "Our response" section rendering `response_notes` as Markdown via the existing `MarkdownContent` component (from `react-markdown` with `remark-gfm` and `rehype-sanitize` plugins). Add `rehype-sanitize` to dependencies. Allows links, bold, italic, lists, code blocks, headings. HTML tags stripped. Although admin-authored (trusted input), sanitization is defense-in-depth.
- Footer: "Questions? Email hello@madeinbugs.com.br" and "Quote ID: [uuid]"

If quote is expired: show prominent banner "This quote has expired" with CTA to build a new quote.

If `sig` invalid or quote not found: 404 page (Next.js `notFound()`).

---

## 16. Terms & Privacy Restructure

### 16.1 Migration Plan

1. Create new files:
   - `src/app/[locale]/terms/page.tsx` — index
   - `src/app/[locale]/terms/services/page.tsx`
   - `src/app/[locale]/terms/social-media-tool/page.tsx` — move existing content
   - `src/app/[locale]/terms/newsletter/page.tsx`
   - Same structure for `privacy/`.

2. Copy existing content from `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` into the `social-media-tool` versions.

3. Update redirects in `next.config.js`:
   ```javascript
   redirects: async () => [
     { source: '/terms', destination: '/pt-BR/terms', permanent: true },
     { source: '/privacy', destination: '/pt-BR/privacy', permanent: true },
   ]
   ```

4. Delete `src/app/terms/page.tsx` and `src/app/privacy/page.tsx` (root-level versions).

### 16.2 Index Page Content

Simple list of all terms/privacy versions with links and a 1-line description of each:
- "Services (B2B infrastructure)" — applies to clients using the quote builder
- "Social Media Management Tool" — internal tool usage
- "Newsletter / Mailing List" — subscribers to the Asumi newsletter

### 16.3 Services Terms Content (Template)

Use a general B2B services template. Key clauses:
- Service definition
- Quote validity (30 days)
- Scope of work (defined by accepted quote)
- Client deliverables responsibility
- Third-party costs are paid directly by client
- Payment terms (to be negotiated per quote)
- Maintenance scope (references `DEFAULT_MAINTENANCE_SCOPE`)
- Warranty disclaimers
- Limitation of liability
- Termination
- Governing law (Brazil)
- Contact: `hello@madeinbugs.com.br`

Store the current terms version and default maintenance scope as constants:
```typescript
// src/lib/services/defaults.ts
import type { BilingualString } from './types';

export const TERMS_VERSION = '2026-04-01';

export const DEFAULT_MAINTENANCE_SCOPE: BilingualString = {
  en: 'Includes monitoring, security updates, minor bug fixes, and up to 2 hours of configuration changes per month. Does not include new feature development.',
  'pt-BR': 'Inclui monitoramento, atualizações de segurança, correções pontuais e até 2 horas de ajustes de configuração por mês. Não inclui desenvolvimento de novas funcionalidades.',
};
```

Bump `TERMS_VERSION` whenever terms content changes. Store on each `quote_requests` row for audit trail.

---

## 17. Environment Variables (New)

Add to Vercel environment settings:

```
QUOTE_URL_SECRET                   HMAC signing secret for shareable quote URLs
                                   (generate: openssl rand -hex 32)

DISCORD_QUOTE_WEBHOOK_URL          Primary Discord webhook, fired by API route
DISCORD_QUOTE_SYNC_WEBHOOK_URL     Secondary webhook, fired by n8n after Twenty sync

N8N_QUOTE_WEBHOOK_SECRET           Shared secret sent as Authorization header
                                   from Supabase webhook to n8n (validate in n8n)

UPSTASH_REDIS_REST_URL             Upstash Redis REST endpoint for rate limiting
UPSTASH_REDIS_REST_TOKEN           Upstash Redis REST auth token

SERVICES_FEATURE_LIVE              'true' | 'false' (default: 'false')
                                   Kill switch for the entire services feature.
                                   When 'false': landing page and builder show
                                   "Coming soon" placeholder; POST returns 503;
                                   existing shareable quote URLs still work.
```

Existing variables reused (no changes required):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
BREVO_API_KEY
NEXT_PUBLIC_SITE_URL
```

Variables configured in n8n (not Vercel):
```
TWENTY_API_KEY                     API key for Twenty CRM
TWENTY_BASE_URL                    https://crm.madeinbugs.com.br
TWENTY_ASSIGNEE_USER_ID            Your user ID in Twenty for task assignment
SUPABASE_SERVICE_ROLE_KEY          For n8n to PATCH quote_requests rows
DISCORD_QUOTE_SYNC_WEBHOOK_URL     Same value as Vercel, used by error branch
```

---

## 18. Build-Time Catalog Validation

### 18.1 Script (`scripts/validate-catalog.ts`)

Runs during `npm run build`. Update `package.json`:

```json
"scripts": {
  "build": "tsx scripts/validate-catalog.ts && next build",
  "validate:catalog": "tsx scripts/validate-catalog.ts",
  "postinstall": "npm run validate:catalog || true"
}
```

The `postinstall` script ensures `catalog-version.generated.ts` is regenerated after `npm install`. The `|| true` allows install to succeed on fresh clones before dependencies like `tsx` are ready — the build step will regenerate it correctly.

Add `tsx` as a dev dependency.

Add `src/lib/services/catalog-version.generated.ts` to `.gitignore`. Commit a placeholder at that path with `export const CATALOG_VERSION = 'unbuilt';` and the comment `// This file is auto-generated by scripts/validate-catalog.ts. Do not edit manually.` so fresh clones compile before running the build.

Script imports `SERVICE_CATALOG` from `src/lib/services/catalog.ts` and runs these checks:

1. **Unique IDs:** All `ServiceItem.id` values are unique. All `ClientDeliverable.id` values are unique per service (they can repeat across services, that's the point of dedup). All `ThirdPartyCost.id` values are unique per service. All `ServiceConfiguration.id` unique per service. All configuration `option.id` unique per configuration.

2. **Reference integrity:**
   - Every ID in `requires`, `recommends`, `conflictsWith` exists in the catalog.
   - Every `defaultOptionId` exists in its configuration's options.
   - No service lists itself in `requires`, `recommends`, or `conflictsWith`.

3. **Dependency cycles:** Run `detectCycles()`. Fail if any cycle exists.

4. **Conflict symmetry:** If A conflictsWith B, then B conflictsWith A. Auto-fix is tempting but fail loudly instead.

5. **Price sanity:**
   - All `basePrice`, `priceModifier`, `maintenance.price` values are non-negative numbers.
   - Both `BRL` and `USD` are defined for every Price object.

6. **Bilingual completeness:** Every `BilingualString` has both `en` and `'pt-BR'` as non-empty strings.

7. **Active config validity:** Every required configuration has `defaultOptionId` defined OR `type: 'multi-select'`.

8. **Custom field sanity:** If `repeatable: false`, ignore `minItems`/`maxItems`. If `repeatable: true` and both defined, ensure `minItems <= maxItems`.

Exit with code 1 and a clear error message on any failure. Log all errors before exiting (don't fail-fast).

---

## 19. Analytics Events

Fire via Umami (already injected in `layout.tsx`). Use `window.umami?.track(eventName, eventData)`.

Events to fire:

```
page_view_services_landing          On landing page mount
page_view_infra_builder             On builder mount
service_added                       { serviceId, category, price }
service_removed                     { serviceId, category }
configuration_changed               { serviceId, configurationId, optionIds }
custom_field_added                  { serviceId, customFieldId }
maintenance_selected                { months, monthlyPrice }
currency_changed                    { from, to }
consent_accepted                    {}
quote_submission_started            { itemCount, total }
quote_submitted                     { itemCount, total, currency, hasPending }
quote_submission_error              { errorCode }
quote_abandoned                     { itemCount, estimatedTotal, currency, timeOnPageSec }
page_view_quote_sent                { quoteId }
page_view_shareable_quote           { quoteId, status }
cta_talk_to_us_clicked              { source: 'landing_hero' | 'landing_footer' | 'builder_banner' }
admin_quote_viewed                  Fired when admin opens quote detail
response_email_sent                 Fired from admin view after sending response
retry_twenty_sync_clicked           Fired from admin view
```

### 19.1 `quote_abandoned` Event Logic

Use `visibilitychange` event transitioning to `hidden` as the primary trigger (more reliable than `beforeunload` on mobile). Fall back to `beforeunload` for desktop browsers that don't fire visibility change reliably on navigation.

```typescript
// Only fire if:
// 1. User spent > 30 seconds on page
// 2. selectedItems has ≥ 1 entry
// 3. Submission never completed
// 4. Use sendBeacon for reliability during unload

const timeOnPageMs = Date.now() - mountTimestamp;
if (timeOnPageMs > 30_000 &&
    Object.keys(selectedItems).length > 0 &&
    !submitted) {
  // Umami's track function doesn't use sendBeacon natively in all versions;
  // fall back to a fire-and-forget fetch with keepalive flag if needed
  window.umami?.track('quote_abandoned', {
    itemCount: Object.keys(selectedItems).length,
    estimatedTotal: grandTotal,
    currency,
    timeOnPageSec: Math.round(timeOnPageMs / 1000),
  });
}
```

> **Note on coverage:** `visibilitychange` + `beforeunload` covers ~90% of tab closures. Chrome/Safari may kill tabs without firing either event (aggressive backgrounding on iOS). This is acceptable for a conversion funnel metric — no need to chase the remaining 10%.

---

## 20. Testing Strategy

The existing repo has no test framework. Do not add one in this phase. Instead, rely on:

1. **Build-time catalog validation** (Section 18) for data integrity.
2. **Zod runtime validation** on all API route inputs.
3. **Manual test checklist** (Section 21) executed before deploying.

If testing infrastructure is added later, priority order would be: (1) pricing pure functions, (2) dependency resolver, (3) API route handlers, (4) E2E with Playwright.

---

## 21. Manual Test Checklist

Run before each deploy. Store as `docs/INFRA_BUILDER_TEST_CHECKLIST.md`.

### Landing Page
- [ ] Both locales render correctly
- [ ] All CTAs navigate to builder
- [ ] Stack screenshots load without 404

### Builder — Catalog
- [ ] All categories render
- [ ] Active services appear; inactive services do not
- [ ] Collapsing/expanding categories works
- [ ] Expanding a service shows long description rendered from markdown

### Builder — Selection & Dependencies
- [ ] Selecting a service with `requires` auto-adds dependencies
- [ ] Notification/indicator shown for auto-added services
- [ ] Deselecting a service that others depend on cascades deselection with undo
- [ ] Selecting a service that conflicts with a selected one shows warning and blocks
- [ ] Circular state never occurs (enforced by build-time check, verified here)

### Builder — Configurations
- [ ] Single-select respects `defaultOptionId`
- [ ] Multi-select allows 0+ choices
- [ ] Required configs with no default force user to choose
- [ ] Configuration changes update totals immediately
- [ ] Configuration changes update deliverables and third-party costs

### Builder — Custom Fields
- [ ] Non-repeatable fields accept one value
- [ ] Repeatable fields respect `maxItems`
- [ ] `pendingPricing` fields show badge
- [ ] Adding `pendingPricing` value updates `hasPendingItems` flag in summary

### Builder — Summary Panel
- [ ] Setup subtotal matches sum of selected services + configurations
- [ ] Maintenance only shows for services with maintenance
- [ ] Maintenance total recalculates with duration change
- [ ] Pending items section appears when applicable with clear messaging
- [ ] Third-party costs deduplicated across services
- [ ] Deliverables deduplicated across services
- [ ] Currency toggle (if present) updates all prices

### Builder — Persistence
- [ ] Refreshing the page preserves state
- [ ] Submitting successfully clears localStorage

### Builder — Submission
- [ ] Empty form shows validation errors
- [ ] Invalid email rejected
- [ ] Honeypot triggered → silent success (no quote created, Discord not pinged)
- [ ] Rate limit after 3 requests → 429
- [ ] Modified client-computed total beyond 10% drift → 400 with `PRICE_DRIFT_TOO_LARGE`
- [ ] Valid submission creates Supabase row
- [ ] Discord primary webhook fires with correct embed
- [ ] Brevo confirmation email received in both locales
- [ ] Redirect to `/services/quote-sent?id=<uuid>` works (no `sig` in URL)
- [ ] `mib_quote_session` HTTP-only cookie set on submission response
- [ ] Cookie cleared after quote-sent page renders

### Quote-Sent Page
- [ ] Reads `id` from query and validates via `mib_quote_session` cookie
- [ ] Missing or invalid cookie shows graceful fallback ("Your quote has been submitted. Check your email for the shareable link.")
- [ ] Shareable URL (with `?sig=`) displayed and copyable
- [ ] Cookie is cleared after page renders
- [ ] Refreshing the page after cookie cleared shows the graceful fallback message

### Shareable Quote View
- [ ] Valid UUID + sig renders full quote
- [ ] Invalid sig returns 404
- [ ] Non-existent UUID returns 404
- [ ] Expired quote shows expiration banner
- [ ] Quote with `response_sent_at` shows response section
- [ ] Read-only: no edit controls present

### n8n + Twenty Integration
- [ ] Supabase webhook fires on insert
- [ ] n8n receives payload and authenticates via shared secret
- [ ] Company upserts (repeat submission from same studio does not duplicate)
- [ ] Person upserts
- [ ] Opportunity created with correct amount, currency, close date
- [ ] Task created and assigned
- [ ] Supabase `twenty_opportunity_id` populated
- [ ] Secondary Discord webhook fires with Twenty link
- [ ] n8n error branch fires secondary Discord with failure message on forced error

### Terms & Privacy
- [ ] `/pt-BR/terms` shows index with 3 entries
- [ ] Each subsection loads
- [ ] `/terms` redirects to `/pt-BR/terms`
- [ ] Links in builder consent checkbox open correct pages in new tab

### i18n
- [ ] Switching locale on landing preserves path
- [ ] Switching locale in builder preserves selected state (re-render only)
- [ ] Emails delivered in matching locale

### Phase 0 — Foundation
- [ ] `checkRateLimitRedis` returns expected shape against real Upstash
- [ ] `checkRateLimitRedis` fails open with Upstash URL misconfigured
- [ ] `createServiceClient` can bypass RLS (verify by reading a row that should be RLS-protected)
- [ ] `Modal` component closes on Escape, backdrop click, and X button; does NOT close on content click

### Admin View (Phase 5.5)
- [ ] `/admin/quotes` redirects to mascot login if unauthenticated
- [ ] Non-admin users get denied even with valid session
- [ ] Admin users see quote list sortable by date/status/total
- [ ] Filter by status works
- [ ] Quote detail view shows full snapshot
- [ ] Status dropdown includes "(no change)" option and updates Supabase row on Save
- [ ] "Send response email" triggers Brevo and updates `response_sent_at`
- [ ] "Retry Twenty sync" re-fires n8n webhook
- [ ] Quotes with null `twenty_opportunity_id` > 60 sec old are flagged yellow
- [ ] List view displays `updated_at` as relative timestamp ("updated 2 hours ago"); column is auto-managed by DB trigger on UPDATE

### CTA & Cal.com Integration
- [ ] Secondary CTA on landing hero links to Cal.com
- [ ] Final CTA also includes "talk to us first" link
- [ ] Builder banner shows when `selectedItems` is empty
- [ ] Banner auto-hides once first service is selected
- [ ] Banner dismissible manually (persists dismissal in localStorage)
- [ ] `cta_talk_to_us_clicked` event fires with correct `source` property

### Price Drift Tolerance (Section 8.1 Rule 11)
- [ ] `clientComputedTotal` within 0.01 of server: accepted silently
- [ ] `clientComputedTotal` within 10% of server: accepted with Discord warning
- [ ] `clientComputedTotal` beyond 10% of server: rejected with `PRICE_DRIFT_TOO_LARGE`
- [ ] Catalog version mismatch with price drift: rejected with `CATALOG_VERSION_MISMATCH`

### Feature Kill Switch
- [ ] `SERVICES_FEATURE_LIVE=false` renders "Coming soon" on landing
- [ ] `SERVICES_FEATURE_LIVE=false` hides Services nav link
- [ ] `SERVICES_FEATURE_LIVE=false` returns 503 on POST
- [ ] `SERVICES_FEATURE_LIVE=false` still serves existing shareable quotes
- [ ] Flipping flag back to `true` restores all functionality without restart

### Immutable Snapshot Behavior
- [ ] Quote view renders from `selected_items` snapshot, not live catalog
- [ ] Changing a catalog price does NOT change displayed prices on old quotes
- [ ] Deactivating a service (`active: false`) does NOT hide it from old quotes
- [ ] `catalog_version` shown in quote view footer

### Builder — Accessibility
- [ ] All interactive elements reachable via Tab key
- [ ] Checkbox toggles work via Space key
- [ ] Modal traps focus and returns focus to trigger on close
- [ ] Service expand/collapse has visible focus ring
- [ ] Form validation errors announced via `aria-live="polite"`
- [ ] All icons have either `aria-label` or `aria-hidden="true"`
- [ ] Color contrast meets WCAG AA on summary panel and service cards

### localStorage Persistence
- [ ] Restoring state where catalog has changed silently drops invalid entries
- [ ] Toast shown when items were removed due to catalog changes

