import { prisma } from "@/lib/prisma";
import { nextOccurrence, type RecurrenceLike } from "@/lib/recurrence";

export const CATCH_UP_CAP = 12;

// Pure: scheduled dates in (from, to] for a template, oldest first, capped.
export function dueOccurrences(t: RecurrenceLike, from: Date, to: Date, cap = CATCH_UP_CAP): Date[] {
  const out: Date[] = [];
  let cursor = from;
  while (out.length < cap + 1) {
    const next = nextOccurrence(t, cursor);
    if (next > to) break;
    out.push(next);
    cursor = next;
  }
  return out;
}

export type GenerateResult = { generated: number; capped: boolean };

// Catch-up-on-access: post due expenses for all active templates, idempotently.
export async function generateDue(userId: string, now: Date): Promise<GenerateResult> {
  const templates = await prisma.recurringTemplate.findMany({ where: { userId, active: true } });
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  let generated = 0;
  let capped = false;

  for (const t of templates) {
    const last = await prisma.postingLedger.findFirst({
      where: { templateId: t.id },
      orderBy: { scheduledDate: "desc" },
      select: { scheduledDate: true },
    });
    // Start strictly after the last posted date, else from the day before startDate.
    const from = last ? last.scheduledDate : new Date(t.startDate.getTime() - 86400000);
    const all = dueOccurrences({ frequency: t.frequency, anchorDay: t.anchorDay, startDate: t.startDate }, from, today);
    if (all.length > CATCH_UP_CAP) capped = true;
    const toPost = all.slice(-CATCH_UP_CAP); // keep most recent 12

    for (const date of toPost) {
      try {
        await prisma.$transaction(async (tx) => {
          const expense = await tx.expense.create({
            data: { userId, categoryId: t.categoryId, amountCents: t.amountCents, description: t.name, date, generatedFromId: t.id },
          });
          await tx.postingLedger.create({ data: { templateId: t.id, scheduledDate: date, expenseId: expense.id } });
        });
        generated++;
      } catch {
        // unique (templateId, scheduledDate) violation → already posted (concurrent/re-run); skip.
      }
    }
  }
  return { generated, capped };
}

// Sum of scheduled-but-unposted occurrences for the rest of the current month.
export async function scheduledRemainingThisMonth(userId: string, now: Date): Promise<number> {
  const monthEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const templates = await prisma.recurringTemplate.findMany({ where: { userId, active: true } });
  let cents = 0;
  for (const t of templates) {
    const occ = dueOccurrences({ frequency: t.frequency, anchorDay: t.anchorDay, startDate: t.startDate }, today, monthEnd);
    cents += occ.length * t.amountCents;
  }
  return cents;
}
