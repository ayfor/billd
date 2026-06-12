A pixelated, stepped budget bar made of discrete cells. Tone auto-derives from over/under budget — Seaweed under, calm Amethyst over (never red).

```jsx
<ProgressBar value={61240} max={70000} />            {/* under → Seaweed */}
<ProgressBar value={38910} max={30000} />            {/* over → Amethyst */}
<ProgressBar value={148} max={200} tone="interactive" />
```

Pass `value`/`max` in matching units (cents recommended). `segments` controls
cell count.
