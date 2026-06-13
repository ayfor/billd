import { z } from "zod";
import { parseAmountToCents } from "@/lib/money";

const MAX_CENTS = 99_999_999; // $999,999.99

export const expenseSchema = z.object({
  amount: z
    .string()
    .transform((s, ctx) => {
      const cents = parseAmountToCents(s);
      if (cents === null || cents <= 0) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter an amount over $0.00" });
        return z.NEVER;
      }
      if (cents > MAX_CENTS) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "That's over the $999,999.99 limit" });
        return z.NEVER;
      }
      return cents;
    }),
  description: z.string().trim().min(1, "Add a description").max(120, "Keep it under 120 characters"),
  categoryId: z.string().min(1, "Pick a category"),
  date: z
    .string()
    .min(1, "Pick a date")
    .refine((d) => !Number.isNaN(Date.parse(d)), "Invalid date")
    .refine((d) => {
      const max = new Date();
      max.setFullYear(max.getFullYear() + 1);
      return new Date(d) <= max;
    }, "Date can't be more than a year out"),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
