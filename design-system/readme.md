# billd — Design System

**billd** is a personal expense tracker for a single user: quick-add expenses,
categories, budgets, and spend projections, all in Canadian dollars. It is
**dark-first** and opinionated about money: it informs, it never scolds.

The aesthetic is a **classic modern dashboard wearing a pixel-art skin** — a
cross-stitch sampler rendered as software. The structure is contemporary and
calm (left sidebar nav, card grid, data table). The *surface* is embroidered:
chunky 2px panel borders with notched corners, a bitmap display font for page
titles and large money numerals, 16×16 pixel icons, pixelated progress bars,
and exactly **one ornamental pixel divider per view** as a brand moment. The
canvas is near-black, like the dark ground of a cross-stitch sampler, so the
pixel assets read as stitched motifs.

It is deliberately **not** pixel-everything. Forms, tables, and body text stay
modern and crisp (Inter, tabular numerals). The pixel skin is jewellery, not
the whole outfit.

---

## Sources

- **Brief**: provided product spec (palette, type, three layouts, sample data,
  guardrails) — the authoritative source for this system.
- **Visual references** (in `assets/inspiration/`): cross-stitch / pixel-art
  sampler artwork and a pixel-art game UI kit, supplied as mood for the
  embroidered-software feel. These set *vibe* only — billd's palette and type
  are its own (see below).
- No codebase or Figma file was attached; all components and screens here are
  authored from the brief.

---

## Palette — exactly 5 hues

No other colors exist. Tints are produced **only** by layering a hue at reduced
opacity over the Shadow Grey canvas — never by introducing a new color.

| Token | Hex | Role |
|---|---|---|
| Shadow Grey | `#272727` | App canvas + card grounds |
| Lavender Mist | `#efe9f4` | Body text + primary foreground |
| Electric Sapphire | `#5863f8` | Interactive: buttons, links, focus, active nav, primary chart series |
| Seaweed | `#00b295` | Positive money signals only — under-budget, income, savings |
| Amethyst | `#935fa7` | Calm attention — over-budget, secondary accents |

**No red anywhere.** Overspending is calm Amethyst, never alarm-red.

---

## Type

- **Pixel / bitmap display** — `Silkscreen` (with `Pixelify Sans` as a softer
  alt). Used **only** for page titles and large money numerals.
- **Modern sans** — `Inter`, with tabular lining numerals for all money and
  data. Used for everything else: body, labels, table cells, inputs.

> ⚠️ **Font note:** fonts are loaded from Google Fonts via `@import` in
> `tokens/fonts.css` rather than shipped as local binaries. Silkscreen and
> Pixelify Sans are the intended display faces (the brief asked for "Silkscreen
> / Pixelify Sans energy"); Inter is the explicit body requirement. **If you
> want offline/self-hosted binaries, send the `.woff2` files and I'll swap the
> `@import` for local `@font-face` rules.**

---

## CONTENT FUNDAMENTALS

How billd writes.

- **Voice: a calm, competent friend who is good with money.** Never a bank,
  never a nag. It states facts and lets the user draw conclusions.
- **Person: second person ("you"), implied.** Mostly the UI just labels things
  ("You've spent", "Left to spend"). Avoid "I" — the app is not a character.
- **Casing: sentence case everywhere** except (a) page titles and money, which
  are set in the pixel face, and (b) tiny eyebrow labels, which are UPPERCASE
  with wide tracking (e.g. `LEFT TO SPEND`, `THIS MONTH`).
- **Money is always exact and two-decimal:** `$1,842.57`, never `$1.8k` or
  `~$1,800`. Right-aligned, tabular. Currency is CAD; show the `$` glyph, and
  use `CAD` only where ambiguity is possible.
- **Over-budget copy is descriptive, not judgmental.** Say
  *"$89.10 over"* — never *"You overspent!"* or *"⚠ Budget exceeded"*. The
  color (Amethyst) carries the signal; the words stay neutral.
- **Positive states are quietly affirming, not celebratory.** *"$87.60 left"*,
  *"Under budget"*. No confetti, no "Great job!".
- **Microcopy is short and concrete.** Button: *"Add expense"*. Empty state:
  *"No expenses yet this month."* Hints reference keys: *"Press ⌘K to add"*.
- **Numbers do the talking; avoid decorative stats.** Don't invent metrics or
  badges to fill space. Every figure shown is one the user put there.
- **No emoji.** Iconography is the pixel icon set, never emoji.

**Example strings (verbatim style):**
- Page title: `Dashboard` · `Expenses` (pixel face)
- Hero: `$1,842.57` with eyebrow `SPENT IN JUNE` and sub `of $2,400.00 expected`
- Category row: `Dining out · $389.10 / $300.00 · $89.10 over`
- Quick-add: `Add expense` / placeholder `What was it for?`
- Cmd-K hint: `Quick-add  ⌘K`

---

## VISUAL FOUNDATIONS

- **Background:** flat near-black Shadow Grey `#272727`. No gradients, no
  photographic imagery, no texture overlays on the live UI. The "sampler
  ground" is conceptual — the darkness plus stitched motifs do the work.
- **Surfaces / cards:** the same Shadow Grey family, lifted only ~3% (`#2d2d2d`)
  so cards barely separate from the canvas. Separation is carried by the **2px
  notched border**, not by a lighter fill. Wells and table stripes go *darker*
  (`#1f1f1f`).
- **Corners:** **zero border-radius.** The pixel-panel signature is a 6px
  *notch* clipped off each corner (`.px-panel`), echoing a cross-stitch frame.
  Never round anything.
- **Borders:** 2px is standard (`--border-px`); 3px for emphasis. Border color
  is Lavender Mist at low opacity (`--border-strong` 22%). Table rules and soft
  dividers drop to 12% / 1px.
- **Shadows:** **hard block shadows only** — a solid 2–4px offset with **no
  blur, no spread** (`--shadow-block`). Because notched panels are clipped,
  shadows are applied via a `drop-shadow()` filter wrapper (`.px-raise`).
  Never use soft/blurred Material shadows.
- **Pixel assets:** hard edges, `image-rendering: pixelated`, no
  anti-aliasing, no gradients, no blur. Icons are 16×16 on a unit grid.
- **Progress bars:** pixelated — a chunky track with a stepped fill drawn in
  discrete cells, not a smooth rounded bar. Height ~14px.
- **Charts:** flat palette fills. Sapphire is the primary series; the
  projection line is Amethyst. Gridlines are Lavender Mist at very low opacity
  (`--border-faint`). No gradient fills, no drop shadows on data.
- **Decorative motif:** exactly **one** ornamental pixel divider band per view
  (`assets/pixel-divider.svg` or the `<PixelDivider>` component) — a brand
  moment, used sparingly.
- **Animation:** minimal and snappy. Transitions are short (120–160ms), linear
  or `steps()`-stepped to feel digital, never bouncy. Modals appear with a quick
  fade + 1-step scale. Respect `prefers-reduced-motion`. No infinite loops.
- **Hover:** interactive fills lift one step (Sapphire → `--interactive-hover`);
  rows lift to `--surface-raised`; ghost controls gain a faint Lavender tint.
- **Press:** fills deepen (`--interactive-press`) and the element nudges
  `translate(1px,1px)` while its block shadow shrinks to `0` — a tactile
  "pressed into the board" feel.
- **Focus:** 2px hard Sapphire outline, 2px offset, never blurred.
- **Transparency/blur:** transparency yes (all tints are alpha-over-canvas);
  **blur, no** — backdrops over modals are flat black at ~60%, not frosted.
- **Layout:** fixed 240px left sidebar; content in a centered column capped at
  ~1080px; card grid + data table. 4px spacing grid (8px working unit).

---

## ICONOGRAPHY

- **System:** a bespoke **16×16 pixel icon set**, authored as crisp unit-rect
  SVGs in `assets/icons/`. Each icon is monochrome and inherits `currentColor`,
  so it tints to any of the 5 palette hues. Render with
  `image-rendering: pixelated` and integer scaling (16 → 32, 48…) to stay sharp.
- **Coverage:** navigation (`nav_dashboard`, `nav_expenses`, `nav_budgets`,
  `nav_projections`), actions (`plus`, `search`, `close`, `check`,
  `chevron_down`, `arrow_up`, `arrow_down`, `command`, `calendar`, `settings`),
  and category glyphs (`cat_groceries`, `cat_dining`, `cat_transit`,
  `cat_hobbies`, `cat_rent`).
- **Logo:** `assets/logo-mark.svg` — a Sapphire pixel "chip" with a Lavender `$`.
  Pair with the wordmark **billd** set in the pixel display face.
- **No emoji, ever.** No Unicode dingbats as icons (the only Unicode glyph used
  ornamentally is `⌘` in the Cmd-K hint, set in the sans face).
- **No icon font / no CDN set.** Everything is local SVG; do not pull in
  Lucide/Heroicons/etc. — they'd break the pixel grid.
- **Do not hand-draw new icons as smooth vectors.** Extend the set on the same
  16×16 grid so new glyphs match.

---

## Index / Manifest

Root files:
- `styles.css` — global entry (consumers link this); `@import`s only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
  `base.css` (reset + `.px-panel`, `.px-raise`, `.tnum` helpers).
- `assets/` — `logo-mark.svg`, `pixel-divider.svg`, `icons/*.svg`,
  `inspiration/*` (mood references).
- `readme.md` — this guide.
- `SKILL.md` — Agent-Skill front-matter wrapper.

Components (`window.BilldDesignSystem_9669dd.*`):
- `core/` — Button, IconButton, Input, Select, Money, Badge, CategoryPill,
  PixelIcon, ProgressBar, NavItem, Card, PixelDivider, Dialog, Table.

UI kit (`ui_kits/billd-app/`):
- Dashboard, Expenses table, Quick-add modal — composed into an interactive
  `index.html`.

Templates (`templates/`):
- `billd-app-shell/` — dark-first app frame (sidebar + topbar + content slot)
  consumers can copy as a starting point; loads the system via `ds-base.js`.

> **Namespace:** components are exposed at `window.BilldDesignSystem_9669dd`.
> Run `check_design_system` if you need to confirm it.
