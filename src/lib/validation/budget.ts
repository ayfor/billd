import { z } from "zod";
import { parseAmountToCents } from "@/lib/money";

export const TIMESPANS = ["monthly", "yearly"] as const;
export type Timespan = (typeof TIMESPANS)[number];
const MAX_CENTS = 999_999_999; // $9,999,999.99

export const budgetSchema = z.object({
  categoryId: z.string().min(1, "Pick a category"),
  timespan: z.enum(TIMESPANS),
  amount: z.string().transform((s, ctx) => {
    const cents = parseAmountToCents(s);
    if (cents === null || cents <= 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter an amount over $0.00" });
      return z.NEVER;
    }
    if (cents > MAX_CENTS) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "That's over the limit" });
      return z.NEVER;
    }
    return cents;
  }),
});

export type BudgetInput = z.infer<typeof budgetSchema>;
