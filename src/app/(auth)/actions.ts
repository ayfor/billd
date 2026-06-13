"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { DEFAULT_CATEGORIES, logInSchema, signUpSchema } from "@/lib/validation/auth";

export type AuthState = {
  errors?: Record<string, string>;
  values?: { name?: string; email?: string };
};

const GENERIC = "Email or password didn't match.";

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
    return {
      errors,
      values: { name: String(formData.get("name") ?? ""), email: String(formData.get("email") ?? "") },
    };
  }
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { errors: { email: "That email already has an account" }, values: { name, email } };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      categories: {
        create: DEFAULT_CATEGORIES.map((c, i) => ({ name: c.name, color: c.color, sortOrder: i })),
      },
    },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: "/dashboard" });
  } catch (e) {
    if (isRedirectError(e)) throw e; // success path
    redirect("/login"); // created but auto-login failed — let them log in
  }
  return {}; // unreachable
}

export async function logIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = logInSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { errors: { form: GENERIC }, values: { email: String(formData.get("email") ?? "") } };
  }
  const callbackUrl = String(formData.get("callbackUrl") ?? "/dashboard");
  try {
    await signIn("credentials", { ...parsed.data, redirectTo: callbackUrl });
  } catch (e) {
    if (isRedirectError(e)) throw e; // success path
    if (e instanceof AuthError) {
      return { errors: { form: GENERIC }, values: { email: parsed.data.email } };
    }
    throw e;
  }
  return {}; // unreachable
}
