import { z } from "zod";
import { parseAmountToCents } from "@/lib/money";

export const FREQUENCIES = ["weekly", "monthly", "yearly"] as const;
const MAX_CENTS = 99_999_999;

export const recurringSchema = z.object({
  name: z.string().trim().min(1, "Add a name").max(120, "Keep it under 120 characters"),
  categoryId: z.string().min(1, "Pick a category"),
  amount: z.string().transform((s, ctx) => {
    const cents = parseAmountToCents(s);
    if (cents === null || cents <= 0) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter an amount over $0.00" }); return z.NEVER; }
    if (cents > MAX_CENTS) { ctx.addIssue({ code: z.ZodIssueCode.custom, message: "That's over the limit" }); return z.NEVER; }
    return cents;
  }),
  frequency: z.enum(FREQUENCIES),
  anchorDay: z.coerce.number().int().min(0).max(1231),
  startDate: z.string().min(1, "Pick a date").refine((d) => !Number.isNaN(Date.parse(d)), "Invalid date"),
});

export type RecurringInput = z.infer<typeof recurringSchema>;
