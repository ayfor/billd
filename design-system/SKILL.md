---
name: billd-design
description: Use this skill to generate well-branded interfaces and assets for billd, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick orientation
- **billd** is a dark-first personal expense tracker (CAD). Aesthetic: a classic
  modern dashboard wearing a pixel-art / cross-stitch-sampler skin. Calm, never
  scolding.
- **Palette = exactly 5 hues**, no others. Tints are opacity-over-canvas only.
  Shadow Grey `#272727`, Lavender Mist `#efe9f4`, Electric Sapphire `#5863f8`,
  Seaweed `#00b295` (positive money only), Amethyst `#935fa7` (calm attention /
  over-budget — never red).
- **Type**: Silkscreen (bitmap) for page titles + large money numerals only;
  Inter for everything else, with tabular lining numerals for money.
- **Shape**: zero border-radius; 2px notched pixel panels; hard block shadows
  (no blur); pixelated progress bars; 16×16 pixel icons.

## Files
- `styles.css` — link this one file; it `@import`s all tokens + fonts + recipes.
- `tokens/` — colors, typography, spacing, base helpers, component recipes.
- `assets/` — `logo-mark.svg`, `pixel-divider.svg`, `icons/*.svg`.
- `core/` — React primitives (bundled to `window.BilldDesignSystem_9669dd`).
- `ui_kits/billd-app/` — full interactive app recreation.
- `readme.md` — the complete design guide (content + visual foundations,
  iconography, manifest).
- `guidelines/*.card.html` — foundation specimen cards.

## Using components
Components are exposed at `window.BilldDesignSystem_9669dd` via `_ds_bundle.js`.
Link `styles.css`, load the bundle, then
`const { Button, Money, Card } = window.BilldDesignSystem_9669dd;`.
`PixelIcon` renders inline SVG (no asset paths needed for known icons).
