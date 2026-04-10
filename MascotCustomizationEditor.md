# Mascot Customization Editor — Implementation Spec

## Overview

A browser-based image editor where users customize the Sisyphus mascot by tinting PNG region layers, applying patterns, and drawing freely on layered canvases. The editor has a **Windows XP Paint** aesthetic. Built with **React** + **Konva.js** (`react-konva`).

---

## Artist Deliverables

| Asset | Format | Size | Count | Notes |
|-------|--------|------|-------|-------|
| Body region | PNG with alpha | 1024×1024 | 1 | Body only in white, everything else transparent |
| Back/shell region | PNG with alpha | 1024×1024 | 1 | Back only in white, everything else transparent |
| Eyes region | PNG with alpha | 1024×1024 | 1 | Eyes only in white, everything else transparent |
| Outlines & details | PNG with alpha | 1024×1024 | 1 | Black lines, shading, texture — transparent background |
| Full silhouette | PNG with alpha | 1024×1024 | 1 | Solid white filled shape of entire mascot — transparent background |
| Pattern: Squiggly | SVG | 256×256 | 1 | Seamlessly tileable |
| Pattern: Stripes | SVG | 256×256 | 1 | Seamlessly tileable |
| Pattern: Dots | SVG | 256×256 | 1 | Seamlessly tileable |
| Pattern: Stars | SVG | 256×256 | 1 | Seamlessly tileable |
| Stamp shapes | SVG | 128×128 | ~5+ | Star, heart, circle, lightning bolt, etc. |

## Layer Architecture

```
Layer 6:  Drawable layer 3
Layer 5:  Drawable layer 2
Layer 4:  Drawable layer 1 (default active)
Layer 3:  Outlines & details PNG (locked, untinted, always on top)
Layer 2:  Pattern layer (auto-generated, not drawable)
Layer 1:  Eyes PNG × eye color tint
Layer 0:  Back PNG × back color tint, Body PNG × body color tint
```

### Layer 0 — Colored Regions (locked)

- Body and Back PNGs rendered at 1024×1024
- Each tinted with the user's chosen color via Konva color multiply
- Opacity per region controlled by UI slider
- Not interactive beyond color/opacity changes

### Layer 1 - Patterns (auto-generated, locked)

Not user-drawable
Renders pattern tiles masked to Body and/or Back regions using their PNGs as alpha clip masks
Regenerated only when pattern settings change
Cached as rasterized image between changes for performance

### Layer 2 — Eyes (locked)

- Eyes PNG rendered at 1024×1024
- Tinted with the user's chosen eye color
- Separate from Layer 0 so eyes always render on top of body/back

### Layer 3 — Outlines (locked)

- sisyphus-outline.png rendered on top of everything
- Preserves lines, shading, and texture above the patterns, but allows users to paint over it
- Not tinted, not interactive

### Layers 4, 5, 6 — Drawable

- Raster drawing layers (Konva `Layer` with freehand line drawing)
- Layer 4 is the default active layer
- Each layer has:
  - **Visibility toggle** (eye icon) — shows/hides the layer
  - **Mask mode toggle** — cycles through three states:
    - **Unmasked** (default) — drawing visible everywhere
    - **Mask In** — drawing only visible inside the logo silhouette
    - **Mask Out** — drawing only visible outside the logo silhouette

---

## Color Regions

### Body

| Setting | Control | Default |
|---------|---------|---------|
| Color | Color picker + hex input | `#8B6914` (placeholder) |
| Opacity | Slider 0–100% | 100% |
| Pattern | Dropdown: None / Squiggly / Stripes / Dots / Stars | None |
| Pattern Color | Color picker + hex input (visible only if pattern enabled) | `#000000` |
| Pattern Opacity | Slider 0–100% (visible only if pattern enabled) | 100% |
| Pattern Rotation | Slider or dial 0–360° (visible only if pattern enabled) | 0° |

### Back

Same controls as Body, independent values.

### Eyes

| Setting | Control | Default |
|---------|---------|---------|
| Color | Color picker + hex input | `#FFFFFF` (placeholder) |
| Opacity | Slider 0–100% | 100% |

---

## Pattern System

### How It Works

1. A seamlessly tileable pattern SVG (256×256) is repeated to fill the entire 1024×1024 canvas
2. The tiled pattern is rotated by the user's chosen angle around the canvas center
3. The result is **clipped/masked** to the corresponding region using its PNG as an alpha clip mask
4. Pattern color is applied by changing the SVG fill attribute before tiling
5. Pattern opacity is applied on the pattern layer group

### Performance

- Pattern layer is **cached as a rasterized bitmap** after each settings change
- Not re-rendered on every frame — only when user modifies pattern type, color, opacity, or rotation
- Rotation preview updates on mouse-up (not live drag) to avoid expensive re-renders

---

## Drawing Tools

All tools have **hover text tooltips** showing the tool name.

### Brush

- Variable size (slider, e.g., 1–50px)
- Color picker + hex input
- Opacity slider
- Draws freehand lines on the active drawable layer
- Implementation: Konva `Line` with `lineCap: 'round'`, `lineJoin: 'round'`, points accumulated on `mousemove`/`touchmove`

### Eraser

- Variable size (slider)
- Erases pixels on the active drawable layer
- Implementation: same as brush but with `globalCompositeOperation: 'destination-out'`

### Color Picker

- Accessible from the bottom color palette bar (XP Paint style row of swatches) and from a full picker dialog
- Hex input field for exact values
- Shared between brush and region coloring (context-dependent)

### Stamp Shapes

- User selects a shape from a palette
- Adjusts **size** (slider) and **rotation** (slider or dial 0–360°) before placing
- Clicks on canvas to stamp — shape is rasterized onto the active drawable layer at the chosen size, rotation, and current brush color
- Once stamped, it's baked into the layer (not movable/editable)

#### Shape Assets (artist deliverables)

| Shape | Filename | Format | Base Size |
|-------|----------|--------|-----------|
| Star | `shape-star.svg` | SVG | 128×128 |
| Heart | `shape-heart.svg` | SVG | 128×128 |
| Circle | `shape-circle.svg` | SVG | 128×128 |
| Lightning bolt | `shape-lightning.svg` | SVG | 128×128 |
| (add more as desired) | | SVG | 128×128 |

SVG format so they scale cleanly to any stamp size and can be tinted to the current brush color.

### Undo / Redo

- Per-layer history stack
- Each brush stroke, stamp, or eraser stroke is one history entry
- Keyboard shortcuts: `Ctrl+Z` (undo), `Ctrl+Y` or `Ctrl+Shift+Z` (redo)
- Toolbar buttons as well

### The "A" Button

- Icon: uppercase **A** with a text cursor, identical to MS Paint's text tool
- Tooltip: "Text"
- On click: brief fake text cursor blink animation (~500ms), then stamps a large **A** character onto the active drawable layer at the click position
- Uses current brush color and size scaling
- That's it. It's a joke.

---

## Randomize Button

A **🎲 Randomize** button in the toolbar that randomizes all color and pattern settings in one click.

### Behavior

```
On click:
  1. Body color     → random from APPROVED_COLORS
  2. Body opacity   → 100% (keep full)
  3. Body pattern   → 50% chance enabled
     → If enabled: random pattern type, random APPROVED_COLORS, random rotation 0–360°, opacity 80–100%
  4. Back color     → random from APPROVED_COLORS
  5. Back opacity   → 100%
  6. Back pattern   → 50% chance enabled
     → If enabled: random pattern type, random APPROVED_COLORS, random rotation 0–360°, opacity 80–100%
  7. Eye color      → random from APPROVED_COLORS
  8. Eye opacity    → 100%
  9. Apply all at once
```

### Approved Color Palette

```ts
const APPROVED_COLORS = [
  // Warm
  '#E63946', '#F4A261', '#E9C46A', '#F2CC8F',
  // Cool
  '#264653', '#2A9D8F', '#457B9D', '#90BE6D',
  // Neutral
  '#6D6875', '#B5838D', '#FFCDB2', '#DDB892',
  // Bold
  '#7209B7', '#3A0CA3', '#4361EE', '#4CC9F0',
  // Earth
  '#606C38', '#283618', '#DDA15E', '#BC6C25',
]
```

Curated by the art director. Users can still manually pick any hex code — the approved list is only for randomization quality.

### Does NOT randomize

- Drawing layers (would destroy user's work)
- Layer visibility or mask modes

---

## UI Layout — Windows XP Paint Aesthetic

```
┌──────────────────────────────────────────────────────────┐
│ ■ Sisifo.bmp - Paint                          [—][□][×]│  ← Title bar (decorative)
├──────────────────────────────────────────────────────────┤
│ File  Edit  View  Help                                   │  ← Menu bar (mostly decorative/minimal)
├────────┬─────────────────────────────────────────────────┤
│ Tools  │                                                 │
│┌──────┐│                                                 │
││ ✏️   ││                                                 │
││ 🧽   ││                                                 │
││ 🪣   ││              Canvas (1024×1024)                 │
││ ⬟    ││                                                 │
││ A    ││                                                 │
││ 🎲   ││                                                 │
│└──────┘│                                                 │
│ Size   │                                                 │
│ [━━●━] │                                                 │
│        │                                                 │
│ Layers │                                                 │
│┌──────┐│                                                 │
││👁 L2 ││                                                 │
││👁 L3 ││                                                 │
││👁 L4 ││                                                 │
│└──────┘│                                                 │
│ Mask:  │                                                 │
│ [None] │                                                 │
├────────┴─────────────────────────────────────────────────┤
│ ■■■■■■■■■■■■■■■■■■■■  │ Region: [Body ▼] Color: [███]   │  ← Bottom bar
│ (color swatches)       │ Pattern: [None ▼] ...           │
├──────────────────────────────────────────────────────────┤
│ Position: 432, 291  │ Layer: 2  │ Tool: Brush            │  ← Status bar
└──────────────────────────────────────────────────────────┘
```

### Styling Details

- **Toolbar background:** `#D4D0C8` (classic XP gray)
- **Borders:** CSS `inset`/`outset` 2px for the classic 3D beveled look
- **Title bar:** Blue gradient (`#0A246A` → `#3A6EA5`), white bold text
- **Tool icons:** 16×16 pixel-art style
- **Font:** Tahoma or system sans-serif at small size for UI labels
- **Color palette bar:** Row of small raised square swatches at the bottom, exactly like XP Paint
- **Buttons:** Classic raised 3D look, depressed on active/click
- **Canvas border:** Sunken 3D border around the drawing area
- **Scrollbar styling** (if needed): XP-style chunky scrollbars via CSS

### Menu Bar

Mostly decorative but can include functional items:

- **File:** Save, Export (1x/2x/4x), maybe "New" (reset all)
- **Edit:** Undo, Redo, Clear Layer, Clear All
- **View:** Toggle grid overlay (optional nice-to-have)
- **Help:** Brief instructions or tooltip

---

## Export

### For the User

- **File → Export** opens a dialog with resolution choice:
  - 1x (1024×1024)
  - 2x (2048×2048)
  - 4x (4096×4096)
- Downloads a **flattened PNG** (all layers composited)
- Implementation: `stage.toDataURL({ pixelRatio: N })` from Konva

### For the Art Director

- **File → Export Layers** (or a separate admin-accessible export):
  - Layer 0 rendered as PNG (body + back tinted, no patterns)
  - Layer 1 rendered as PNG (eyes tinted)
  - Layer 2 rendered as PNG (patterns only)
  - Layer 3 (outlines) — original asset, no export needed
  - Layers 4, 5, 6 rendered as separate PNGs (user drawings)
  - A **JSON manifest** with all settings:

```json
{
  "user": "display_name",
  "year": 2025,
  "regions": {
    "body": { "color": "#E63946", "opacity": 1.0, "pattern": "stripes", "patternColor": "#000", "patternOpacity": 0.8, "patternRotation": 45 },
    "back": { "color": "#264653", "opacity": 1.0, "pattern": null },
    "eyes": { "color": "#F4A261", "opacity": 1.0 }
  },
  "layers": [
    { "id": 4, "visible": true, "maskMode": "unmasked", "dataUrl": "layer4.png" },
    { "id": 5, "visible": true, "maskMode": "mask-in", "dataUrl": "layer5.png" },
    { "id": 6, "visible": false, "maskMode": "unmasked", "dataUrl": "layer6.png" }
  ]
}
```

This gives the art director maximum flexibility to recompose in Photoshop/Illustrator.

---

## Persistence (Supabase)

### Auto-Save

- **Debounced save** — 2 seconds after the last change, save to Supabase
- Visual indicator in the status bar: `Saved ✓` / `Saving...` / `Error — click to retry`
- Saves to `mascot_customizations` table, `customization_data` JSONB column

### What Gets Saved

```json
{
  "regions": {
    "body": { "color": "#E63946", "opacity": 1.0, "pattern": "stripes", "patternColor": "#000", "patternOpacity": 0.8, "patternRotation": 45 },
    "back": { "color": "#264653", "opacity": 1.0, "pattern": null, "patternColor": null, "patternOpacity": null, "patternRotation": null },
    "eyes": { "color": "#F4A261", "opacity": 1.0 }
  },
  "layers": [
    { "id": 4, "visible": true, "maskMode": "unmasked", "strokes": [ /* serialized Konva line/shape data */ ] },
    { "id": 5, "visible": true, "maskMode": "mask-in", "strokes": [] },
    { "id": 6, "visible": false, "maskMode": "unmasked", "strokes": [] }
  ],
  "commentary": "I wanted a tropical vibe with bold colors and star patterns!"
}
```

Each stroke is stored as a serialized Konva node (tool type, points array, color, size, opacity). This allows **exact reconstruction** of the canvas on reload, including undo history.

The `commentary` field is an optional string (max 500 characters) where users describe their mascot vision. It helps the art director understand creative intent when composing the final poster.

### Load

- On page load, fetch from Supabase
- If Supabase fetch fails, fall back to `localStorage` cache
- Reconstruct all layers by replaying the serialized strokes/shapes onto Konva layers

### localStorage Mirror

- On every successful Supabase save, also write to `localStorage`
- On load, show `localStorage` data immediately for instant feedback, then replace with Supabase data when it arrives (if newer)
- Supabase `updated_at` is the source of truth for conflict resolution

### Preview Upload

- After each successful Supabase save, a **15-second debounced** preview upload runs in the background
- Captures the current canvas as a 1x (1024×1024) PNG via `stage.toDataURL({ pixelRatio: 1 })`
- Converts base64 → Blob and uploads to Supabase Storage: `mascot-previews/{userId}/{year}.png` with `upsert: true`
- Uses a **separate timer ref** (`previewUploadTimerRef`) from the 2-second save debounce — avoids hammering Storage on every small change
- Errors are **silent** — preview upload failures do not affect `saveStatus` or the user experience
- The Konva `Stage` ref is exposed from `MascotCanvas` to `MascotEditor` via an `onStageReady` callback prop
- The `mascot-previews` bucket is **private** — signed URLs are generated server-side per page load (never publicly accessible)

---

## Commentary

A text area below the editor window where users can describe their mascot or add notes for the art director.

### UI

- Positioned directly below the XP Paint editor window, same max-width as the editor (`960px`)
- XP-style sunken 3D border (`borderStyle: 'inset'`), matching the editor aesthetic
- Textarea with:
  - **Placeholder (pt-BR):** "Descreva seu mascote ou adicione comentários..."
  - **Placeholder (en):** "Describe your mascot or add any comments..."
  - **Label (pt-BR):** "Seus comentários"
  - **Label (en):** "Your comments"
  - **Max length:** 500 characters
  - **Character counter:** `n/500` displayed inline below the textarea
  - Font: Tahoma, small size, consistent with the XP aesthetic

### Persistence

- Saved as `commentary` field inside the existing `customization_data` JSONB column — **no new table or column needed**
- Auto-saved with the same 2-second debounce as all other editor changes
- Loaded from `initialData.commentary` on page load
- Included in the localStorage mirror

### i18n Keys

```ts
// pt-BR
commentaryLabel: 'Seus comentários',
commentaryPlaceholder: 'Descreva seu mascote ou adicione comentários...',
commentaryCharCount: (n: number, max: number) => `${n}/${max}`,

// en
commentaryLabel: 'Your comments',
commentaryPlaceholder: 'Describe your mascot or add any comments...',
commentaryCharCount: (n: number, max: number) => `${n}/${max}`,
```

---

## Role System

A simple text-based role on the `profiles` table to gate access to the gallery.

### Schema

```sql
ALTER TABLE profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'user';
```

Two values: `'user'` (default for all employees) and `'artist'` (the art director). Set manually via the Supabase dashboard — no UI for role management needed.

### RLS Policies

```sql
-- Artist can read all customizations (for the gallery)
CREATE POLICY "Artist can read all customizations"
ON mascot_customizations FOR SELECT
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'artist'
  )
);

-- Artist can read all profiles (to show display names in gallery)
CREATE POLICY "Artist can read all profiles"
ON profiles FOR SELECT
USING (
  auth.uid() = id
  OR EXISTS (
    SELECT 1 FROM profiles p2
    WHERE p2.id = auth.uid()
    AND p2.role = 'artist'
  )
);
```

### Storage Policies (mascot-previews bucket)

```sql
-- Users can upload/update their own preview
ALLOW INSERT, UPDATE
WHERE (storage.foldername(name))[1] = auth.uid()::text

-- Artist can download all previews
ALLOW SELECT
WHERE EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = auth.uid()
  AND profiles.role = 'artist'
)
```

---

## Gallery (`/mascot/gallery`)

A read-only dashboard for the art director to view all team members' mascot customizations without depending on users exporting.

### Access

- Route: `/mascot/gallery`
- **Server component** — checks `profile.role === 'artist'` on load
- Non-artist users are redirected to `/mascot`
- Navigation: an "Artist Gallery" link appears in the mascot layout header **only** when `role === 'artist'`

### Data Loading (Server-Side)

```typescript
// Fetch all customizations for the current year, joined with profiles
const { data } = await supabase
  .from('mascot_customizations')
  .select('user_id, year, updated_at, customization_data, profiles(display_name)')
  .eq('year', CURRENT_YEAR)
  .order('updated_at', { ascending: false });

// Generate signed URLs for each preview PNG
for (const item of data) {
  const { data: url } = await supabase.storage
    .from('mascot-previews')
    .createSignedUrl(`${item.user_id}/${CURRENT_YEAR}.png`, 3600); // 1hr expiry
  item.previewUrl = url?.signedUrl ?? null;
}
```

### UI (Client Component)

- Grid layout of cards, one per team member
- Each card shows:
  - **Display name** (from joined `profiles`)
  - **Preview image** (1024×1024 PNG from Supabase Storage, displayed as thumbnail)
  - **Last updated** date (formatted)
  - **Commentary** text (from `customization_data.commentary`, if present)
  - **"Download PNG"** button — links to the signed Storage URL
  - **"Download JSON"** button — serializes `customization_data` as a `.json` file and triggers browser download
- XP-style aesthetic (same `#D4D0C8` gray, sunken borders) to stay consistent with the editor
- Cards with no preview image show a placeholder state

### No Live Updates

- The gallery is a snapshot on page load — the artist refreshes manually to see new changes
- Signed URLs expire after 1 hour; refreshing the page generates new ones

---

## Artist Deliverables Checklist

| Asset | Format | Size | Count | Notes |
|-------|--------|------|-------|-------|
| Body region | PNG with alpha | 1024×1024 | 1 | Body only in white, everything else transparent |
| Back/shell region | PNG with alpha | 1024×1024 | 1 | Back only in white, everything else transparent |
| Eyes region | PNG with alpha | 1024×1024 | 1 | Eyes only in white, everything else transparent |
| Outlines & details | PNG with alpha | 1024×1024 | 1 | Black lines, shading, texture — transparent background |
| Full silhouette | PNG with alpha | 1024×1024 | 1 | Solid white filled shape of entire mascot — transparent background |
| Pattern: Squiggly | SVG | 256×256 | 1 | Seamlessly tileable |
| Pattern: Stripes | SVG | 256×256 | 1 | Seamlessly tileable |
| Pattern: Dots | SVG | 256×256 | 1 | Seamlessly tileable |
| Pattern: Stars | SVG | 256×256 | 1 | Seamlessly tileable |
| Stamp shapes | SVG | 128×128 | ~5+ | Star, heart, circle, lightning bolt, etc. |

# Phase A: Core Canvas & Coloring

Goal: User can see Sisyphus and recolor it. Foundation for everything else.

Set up Konva.js + react-konva
Render Layer 0 (Body + Back PNGs with color tinting via Konva multiply)
Render Layer 1 (Eyes PNG with color tinting)
Render Layer 3 (Outlines PNG, untinted, always on top)
Implement three color region controls (Body, Back, Eyes) with color picker, hex input, and opacity slider
Build the XP Paint UI shell (title bar, toolbar, canvas area, bottom bar, status bar)
Add tooltips on all tool buttons
Implement Supabase save/load for region color data
localStorage mirror

Deliverable: A styled editor where you can recolor the mascot and your choices persist.

# Phase B: Drawing Tools & Layers

Goal: User can draw on the mascot.

Implement drawable layers (4, 5, 6) with layer switching
Brush tool (variable size, color, opacity)
Eraser tool
Undo/redo system (per-layer history)
Layer visibility toggles
Layer mask modes using silhouette PNG (unmasked / mask-in / mask-out)
Stamp shapes (size + rotation selection before placing)
The "A" button (joke text tool)
Update Supabase save/load to include stroke data
Keyboard shortcuts (Ctrl+Z, Ctrl+Y)

Deliverable: Fully functional drawing on layers with masking and persistence.

# Phase C: Patterns, Randomize & Export

Goal: Polish, patterns, and output.

Pattern system (Layer 2: 4 patterns, masked to Body/Back PNGs, color, opacity, rotation)
Pattern layer caching for performance
Randomize button with approved color palette
Export: flattened PNG at 1x/2x/4x
Export: separated layers (0-6) + JSON manifest for art director
Menu bar functionality (File → Save/Export, Edit → Undo/Redo/Clear)
Status bar (cursor position, active layer, current tool)
Final polish and edge case testing

Deliverable: Complete editor, ready for the team.

# Phase D: Commentary, Preview Upload & Gallery

Goal: Art director can view all team mascots without depending on users exporting.

Commentary textarea below editor (500 char limit, i18n, saved in existing JSONB)
Add `role` column to `profiles` table (`'user'` default, `'artist'` for art director)
Update RLS policies for artist read access on all customizations and profiles
Create `mascot-previews` private Storage bucket with appropriate RLS
Auto-upload 1x preview PNG to Storage on 15-second debounce after each save
Expose Konva Stage ref from MascotCanvas to MascotEditor via `onStageReady` callback
Build `/mascot/gallery` server page with artist role gate
Build gallery client component (grid of cards: name, preview, date, commentary, downloads)
Add conditional "Artist Gallery" link in mascot layout header

Deliverable: Art director can browse all team mascots, read commentary, and download PNGs/JSON — no user action required.

Each phase produces something functional and testable on its own. Phase A alone is already useful — you could ship it and get feedback before investing in later phases.
