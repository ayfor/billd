import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, "Enter your name").max(60),
    email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
    password: z.string().min(8, "At least 8 characters").max(128),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const logInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LogInInput = z.infer<typeof logInSchema>;

export const DEFAULT_CATEGORIES = [
  { name: "Groceries", color: "seaweed" },
  { name: "Dining out", color: "amethyst" },
  { name: "Transit", color: "sapphire" },
  { name: "Hobbies", color: "amethyst" },
  { name: "Rent", color: "sapphire" },
] as const;
