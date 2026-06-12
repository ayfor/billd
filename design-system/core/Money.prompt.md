Formats a CAD amount with two decimals, tabular lining numerals, right-aligned — the only correct way to render money in billd. Pass integer `cents`.

```jsx
<Money cents={184257} />                         {/* $1,842.57 */}
<Money cents={61240} tone="positive" />          {/* under budget, Seaweed */}
<Money cents={8910} tone="attention" showSign /> {/* +$89.10 over, Amethyst */}
<Money cents={184257} pixel size="var(--pixel-2xl)" /> {/* hero numeral */}
```

Tones: `default` (Lavender), `positive` (Seaweed — income/under-budget),
`attention` (Amethyst — over-budget), `muted`. Use `pixel` only for big hero
numerals; tables and inline money stay in the sans face.
