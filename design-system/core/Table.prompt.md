billd's data table — uppercase header rules, hover rows, right-aligned tabular money columns. Pass a column config with per-column `render` for pills and money.

```jsx
<Table
  columns={[
    { key: 'date', label: 'Date', width: 96 },
    { key: 'desc', label: 'Description' },
    { key: 'cat', label: 'Category', render: (v) => <CategoryPill category={v} /> },
    { key: 'cents', label: 'Amount', align: 'right',
      render: (v) => <Money cents={v} /> },
  ]}
  rows={expenses}
  onRowClick={(r) => openExpense(r)}
/>
```
