A centered modal in a notched pixel panel. Flat black backdrop (never frosted), quick stepped entrance, Esc / backdrop-click to close.

```jsx
<Dialog
  title="Add expense"
  onClose={() => setOpen(false)}
  footer={<><Button variant="ghost" onClick={close}>Cancel</Button>
           <Button variant="primary">Save</Button></>}
>
  …form fields…
</Dialog>
```
