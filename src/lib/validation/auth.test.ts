import { describe, expect, it } from "vitest";
import { signUpSchema, logInSchema, DEFAULT_CATEGORIES } from "./auth";

describe("signUpSchema", () => {
  const base = { name: "Josh", email: "J@Example.com", password: "supersecret", confirm: "supersecret" };
  it("accepts valid input and lowercases email", () => {
    const r = signUpSchema.safeParse(base);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe("j@example.com");
  });
  it("rejects bad email", () => {
    expect(signUpSchema.safeParse({ ...base, email: "nope" }).success).toBe(false);
  });
  it("rejects password under 8 chars", () => {
    expect(signUpSchema.safeParse({ ...base, password: "short", confirm: "short" }).success).toBe(false);
  });
  it("rejects mismatched confirm", () => {
    const r = signUpSchema.safeParse({ ...base, confirm: "different" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.error.issues[0].path).toContain("confirm");
  });
});

describe("logInSchema", () => {
  it("requires a password", () => {
    expect(logInSchema.safeParse({ email: "j@example.com", password: "" }).success).toBe(false);
  });
});

describe("default categories", () => {
  it("are the 5 seeded categories with palette tokens", () => {
    expect(DEFAULT_CATEGORIES).toHaveLength(5);
    const colors = new Set(DEFAULT_CATEGORIES.map((c) => c.color));
    for (const c of colors) expect(["sapphire", "seaweed", "amethyst", "lavender"]).toContain(c);
    expect(DEFAULT_CATEGORIES.map((c) => c.name)).toEqual(["Groceries", "Dining out", "Transit", "Hobbies", "Rent"]);
  });
});
