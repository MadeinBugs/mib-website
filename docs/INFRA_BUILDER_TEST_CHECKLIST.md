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