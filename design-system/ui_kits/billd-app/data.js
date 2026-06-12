/* billd sample data — June 2026. Amounts in integer cents. */
window.BILLD_DATA = {
  month: 'June 2026',
  spentCents: 184257,        // $1,842.57
  expectedCents: 240000,     // $2,400.00
  categories: [
    { name: 'Groceries',  spent: 61240, budget: 70000 },   // under
    { name: 'Dining out', spent: 38910, budget: 30000 },   // over
    { name: 'Transit',    spent: 14800, budget: 20000 },
    { name: 'Hobbies',    spent: 23195, budget: 25000 },
    { name: 'Rent',       spent: 0,     budget: 95000, upcoming: true },
  ],
  recent: [
    { date: 'Jun 9', day: 9, desc: 'Farm Boy run',    cat: 'Groceries',  cents: 8432 },
    { date: 'Jun 8', day: 8, desc: 'SkipTheDishes',   cat: 'Dining out', cents: 4218 },
    { date: 'Jun 1', day: 1, desc: 'OC Transpo pass', cat: 'Transit',    cents: 9800 },
  ],
  // cumulative spend by day-of-month (cents), for the spending-over-time chart
  cumulative: [
    { day: 1,  cents: 9800 },
    { day: 2,  cents: 13120 },
    { day: 4,  cents: 41130 },
    { day: 5,  cents: 52890 },
    { day: 6,  cents: 88940 },
    { day: 8,  cents: 131120 },
    { day: 9,  cents: 158025 },
    { day: 11, cents: 184257 },
  ],
  daysInMonth: 30,
  today: 11,
};
