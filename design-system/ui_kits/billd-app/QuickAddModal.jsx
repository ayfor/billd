/* QuickAddModal — keyboard-first expense entry. Amount, description,
   category, date (smart default = today). Enter saves. */
const { Dialog, Input, Select, Button } = window.BilldDesignSystem_9669dd;

function QuickAddModal({ open, onClose, onSave }) {
  const [amount, setAmount] = React.useState('');
  const [desc, setDesc] = React.useState('');
  const [cat, setCat] = React.useState('Groceries');
  const [date, setDate] = React.useState('2026-06-11'); // smart default: today

  React.useEffect(() => {
    if (open) { setAmount(''); setDesc(''); setCat('Groceries'); setDate('2026-06-11'); }
  }, [open]);

  const save = () => { onSave && onSave({ amount, desc, cat, date }); onClose && onClose(); };
  const onKeyDown = (e) => { if (e.key === 'Enter' && amount) save(); };

  if (!open) return null;
  return (
    <Dialog
      title="Add expense"
      onClose={onClose}
      width={460}
      footer={
        <>
          <span style={{ marginRight: 'auto', alignSelf: 'center', fontSize: 12, color: 'var(--text-faint)' }}>
            Press <kbd style={{ border: '1px solid var(--border-strong)', padding: '1px 5px', fontSize: 11 }}>Enter</kbd> to save
          </span>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={save} disabled={!amount}>Save expense</Button>
        </>
      }
    >
      <div onKeyDown={onKeyDown} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Amount — big, pixel-numeral feel */}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
                         letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)', fontWeight: 600 }}>
            Amount
          </span>
          <span style={{ position: 'relative', display: 'block' }}>
            <span style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)',
                           fontFamily: 'var(--font-pixel)', fontSize: 20, color: 'var(--text-muted)', pointerEvents: 'none' }}>$</span>
            <input
              className="billd-field billd-field--lg tnum"
              style={{ paddingLeft: '2em', fontFamily: 'var(--font-pixel)', fontSize: 22, letterSpacing: 'var(--tracking-pixel)' }}
              inputMode="decimal" placeholder="0.00" autoFocus
              value={amount} onChange={(e) => setAmount(e.target.value)}
            />
          </span>
        </label>

        <Input label="Description" placeholder="What was it for?"
               value={desc} onChange={(e) => setDesc(e.target.value)} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
          <Select label="Category" value={cat} onChange={(e) => setCat(e.target.value)}
                  options={['Groceries', 'Dining out', 'Transit', 'Hobbies', 'Rent']} />
          <label style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: 'var(--text-2xs)', textTransform: 'uppercase',
                           letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)', fontWeight: 600 }}>
              Date
            </span>
            <input type="date" className="billd-field tnum" value={date}
                   onChange={(e) => setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
          </label>
        </div>
      </div>
    </Dialog>
  );
}

window.QuickAddModal = QuickAddModal;
