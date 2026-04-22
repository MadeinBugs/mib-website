### Studio Control Panel Bundling

- [ ] **Auto-bundle on eligible selection:** Select cloud-server + any self-hosted service (e.g., Twenty CRM via self-hosted hosting-choice). Studio Control Panel appears automatically in the cart with checkbox locked, "Included free" indicator visible, price struck through to R$ 0.

- [ ] **Checkbox locked when bundled:** Click the Studio Control Panel checkbox while bundled. Nothing happens — no toggle, no dispatch. Cursor shows "not-allowed".

- [ ] **Cascade removal unbundles panel:** Deselect the qualifying self-hosted service. Studio Control Panel is automatically removed. Total price drops only by the CRM's price (panel was at R$ 0).

- [ ] **Non-self-hosted doesn't trigger bundle:** Select cloud-server, then select HubSpot (non-self-hosted CRM). Studio Control Panel does NOT auto-add. Bundle conditions not met.

- [ ] **Hosting-choice switch breaks bundle:** With a self-hosted CRM + bundled Panel, change CRM's hosting-choice from self-hosted to HubSpot. Panel is auto-removed. Checkbox unlocks.

- [ ] **localStorage restore preserves bundle state:** With a bundled configuration, reload the page. State restores, reconciler fires, Control Panel correctly bundled (or correctly absent if conditions no longer met due to catalog changes).

- [ ] **Manual selection before bundle eligibility:** Select Studio Control Panel first (dependency auto-adds cloud-server, panel is at R$ 150). Then add a self-hosted service. Panel transitions: checkbox locks, price strikes through to R$ 0, "Included free" indicator appears.

- [ ] **Submission includes bundle marker:** After submitting a bundled quote, verify Supabase row's `selected_items` snapshot shows `studio-control-panel` with `basePrice: 0` (or the `bundledFree: true` flag set). Verify `total_price` reflects the discount.

- [ ] **Server rejects forged bundle claim:** Via cURL, submit a payload with `bundleAdded: ['studio-control-panel']` but no qualifying self-hosted services. Server returns 400 with `BUNDLE_INVALID`.