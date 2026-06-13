import { z } from "zod";

export const CATEGORY_COLORS = ["sapphire", "seaweed", "amethyst", "lavender"] as const;
export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const categorySchema = z.object({
  name: z.string().trim().min(1, "Add a name").max(30, "Keep it under 30 characters"),
  color: z.enum(CATEGORY_COLORS),
});

export type CategoryInput = z.infer<typeof categorySchema>;
