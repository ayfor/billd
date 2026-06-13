import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const CATEGORIES = [
  { name: "Groceries", color: "seaweed" },
  { name: "Dining out", color: "amethyst" },
  { name: "Transit", color: "sapphire" },
  { name: "Hobbies", color: "amethyst" },
  { name: "Rent", color: "sapphire" },
];

// ~23 sample expenses (June 2026), amounts in integer cents.
const SAMPLE: [string, string, number, string][] = [
  ["Farm Boy run", "Groceries", 8432, "2026-06-09"],
  ["SkipTheDishes", "Dining out", 4218, "2026-06-08"],
  ["Lee Valley clamps", "Hobbies", 6185, "2026-06-07"],
  ["Metro groceries", "Groceries", 11240, "2026-06-06"],
  ["Coffee with Miranda", "Dining out", 1175, "2026-06-04"],
  ["Bouldering day pass", "Hobbies", 2400, "2026-06-02"],
  ["OC Transpo pass", "Transit", 9800, "2026-06-01"],
  ["Loblaws", "Groceries", 7642, "2026-06-11"],
  ["Shawarma Palace", "Dining out", 2310, "2026-06-10"],
  ["Paint set", "Hobbies", 4499, "2026-06-05"],
  ["Uber home", "Transit", 1850, "2026-06-03"],
  ["Costco", "Groceries", 18790, "2026-05-30"],
  ["Pho place", "Dining out", 3120, "2026-05-29"],
  ["Climbing gym month", "Hobbies", 7500, "2026-05-28"],
  ["Gas", "Transit", 6240, "2026-05-27"],
  ["Farmers market", "Groceries", 4380, "2026-05-26"],
  ["Burrito Boyz", "Dining out", 1995, "2026-05-25"],
  ["Sketchbook", "Hobbies", 2299, "2026-05-24"],
  ["Bus tickets", "Transit", 1200, "2026-05-23"],
  ["Whole Foods", "Groceries", 9120, "2026-05-22"],
  ["Sushi night", "Dining out", 5640, "2026-05-21"],
  ["Yarn", "Hobbies", 3150, "2026-05-20"],
  ["Parking", "Transit", 800, "2026-05-19"],
];

async function main() {
  const email = "demo@billd.dev";
  await prisma.user.deleteMany({ where: { email } });
  const user = await prisma.user.create({
    data: {
      email,
      name: "Demo",
      passwordHash: await bcrypt.hash("supersecret", 10),
      categories: { create: CATEGORIES.map((c, i) => ({ ...c, sortOrder: i })) },
    },
    include: { categories: true },
  });
  const byName = Object.fromEntries(user.categories.map((c) => [c.name, c.id]));
  await prisma.expense.createMany({
    data: SAMPLE.map(([description, cat, amountCents, date]) => ({
      userId: user.id,
      categoryId: byName[cat],
      description,
      amountCents,
      date: new Date(date),
    })),
  });
  console.log(`Seeded ${SAMPLE.length} expenses for ${email} (password: supersecret)`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
