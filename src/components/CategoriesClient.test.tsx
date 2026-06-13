import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(dashboard)/categories/actions", () => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(() => vi.fn()),
  deleteCategory: vi.fn(async () => ({ ok: false, blocked: true, reason: "Used by 3 expenses — reassign or remove those first" })),
}));

import { CategoriesClient } from "./CategoriesClient";

const categories = [
  { id: "c1", name: "Groceries", color: "seaweed", expenseCount: 3, monthCents: 8000 },
];

describe("CategoriesClient", () => {
  it("shows the usage line on a card", () => {
    render(<CategoriesClient categories={categories} />);
    expect(screen.getByText(/3 expenses · \$80\.00 this month/)).toBeInTheDocument();
  });

  it("Delete shows an inline confirm (no browser dialog)", () => {
    render(<CategoriesClient categories={categories} />);
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.getByText("Delete?")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("surfaces the block reason when a used category can't be deleted", async () => {
    render(<CategoriesClient categories={categories} />);
    fireEvent.click(screen.getByText("Delete"));
    fireEvent.click(screen.getByText("Yes"));
    expect(await screen.findByText(/Used by 3 expenses/)).toBeInTheDocument();
  });
});
