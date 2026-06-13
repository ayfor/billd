"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { categorySchema } from "@/lib/validation/category";
import { categoryReferenceCount } from "@/lib/queries/categoryUsage";

export type CategoryFormState = {
  ok?: boolean;
  errors?: Record<string, string>;
  values?: { name?: string; color?: string };
};

function parse(formData: FormData) {
  return categorySchema.safeParse({
    name: String(formData.get("name") ?? ""),
    color: String(formData.get("color") ?? ""),
  });
}

function errs(parsed: ReturnType<typeof parse>, formData: FormData): CategoryFormState {
  const errors: Record<string, string> = {};
  if (!parsed.success) for (const i of parsed.error.issues) errors[String(i.path[0])] = i.message;
  return { errors, values: { name: String(formData.get("name") ?? ""), color: String(formData.get("color") ?? "") } };
}

// Case-insensitive per-user name check, optionally excluding one id (on edit).
async function nameTaken(userId: string, name: string, exceptId?: string) {
  const hit = await prisma.category.findFirst({
    where: {
      userId,
      name: { equals: name, mode: "insensitive" },
      ...(exceptId ? { NOT: { id: exceptId } } : {}),
    },
    select: { id: true },
  });
  return !!hit;
}

export async function createCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) return errs(parsed, formData);
  if (await nameTaken(user.id, parsed.data.name)) {
    return { errors: { name: "You already have that category" }, values: { name: parsed.data.name, color: parsed.data.color } };
  }
  const max = await prisma.category.aggregate({ where: { userId: user.id }, _max: { sortOrder: true } });
  await prisma.category.create({
    data: { userId: user.id, name: parsed.data.name, color: parsed.data.color, sortOrder: (max._max.sortOrder ?? -1) + 1 },
  });
  revalidatePath("/categories");
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateCategory(id: string, _prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const user = await requireUser();
  const parsed = parse(formData);
  if (!parsed.success) return errs(parsed, formData);
  if (await nameTaken(user.id, parsed.data.name, id)) {
    return { errors: { name: "You already have that category" }, values: { name: parsed.data.name, color: parsed.data.color } };
  }
  const res = await prisma.category.updateMany({
    where: { id, userId: user.id },
    data: { name: parsed.data.name, color: parsed.data.color },
  });
  if (res.count === 0) return { errors: { form: "That category couldn't be found." } };
  revalidatePath("/categories");
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<{ ok: boolean; blocked?: boolean; reason?: string }> {
  const user = await requireUser();
  const refs = await categoryReferenceCount(user.id, id);
  if (refs > 0) {
    return { ok: false, blocked: true, reason: `Used by ${refs} ${refs === 1 ? "expense" : "expenses"} — reassign or remove those first` };
  }
  try {
    await prisma.category.deleteMany({ where: { id, userId: user.id } });
  } catch {
    // Backstop: DB onDelete:Restrict refused (a reference appeared between check and delete).
    return { ok: false, blocked: true, reason: "This category is still in use" };
  }
  revalidatePath("/categories");
  revalidatePath("/expenses");
  revalidatePath("/dashboard");
  return { ok: true };
}
