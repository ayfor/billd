import { afterAll, beforeEach, describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/validation/auth";

// Exercises the signup persistence path directly (no Auth.js session side effect),
// mirroring the action's transaction. Requires DATABASE_URL (local billd_dev / CI service).

const EMAIL = "inttest@example.com";

async function createUserWithSeed(name: string, email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      name, email, passwordHash,
      categories: { create: DEFAULT_CATEGORIES.map((c, i) => ({ name: c.name, color: c.color, sortOrder: i })) },
    },
    include: { categories: true },
  });
}

describe("signup persistence", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: EMAIL } });
  });

  it("creates a user with a bcrypt hash and 5 seeded categories", async () => {
    const user = await createUserWithSeed("Josh", EMAIL, "supersecret");
    expect(user.categories).toHaveLength(5);
    expect(user.passwordHash).not.toBe("supersecret");
    expect(await bcrypt.compare("supersecret", user.passwordHash)).toBe(true);
    const colors = user.categories.map((c) => c.color);
    expect(colors).toContain("seaweed");
  });

  it("rejects a duplicate email at the DB unique constraint", async () => {
    await createUserWithSeed("Josh", EMAIL, "supersecret");
    await expect(createUserWithSeed("Other", EMAIL, "supersecret2")).rejects.toThrow();
    expect(await prisma.user.count({ where: { email: EMAIL } })).toBe(1);
  });
});
