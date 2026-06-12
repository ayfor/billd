A crisp 16×16 pixel icon from the billd icon set; tints to any palette color via CSS mask, so use it anywhere you'd use an icon.

```jsx
<PixelIcon name="nav_dashboard" size={16} />
<PixelIcon name="cat_dining" size={24} color="var(--attention)" />
<PixelIcon src="../assets/icons/plus.svg" size={16} />
```

Names: nav_dashboard, nav_expenses, nav_budgets, nav_projections, plus, search,
calendar, close, check, chevron_down, arrow_up, arrow_down, command, settings,
cat_groceries, cat_dining, cat_transit, cat_hobbies, cat_rent.

Pass `base` to point at the icons folder relative to the consuming page (e.g.
`base="../assets/icons/"`), or pass an explicit `src`.
