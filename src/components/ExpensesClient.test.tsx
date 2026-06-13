import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(dashboard)/expenses/actions", () => ({
  createExpense: vi.fn(),
  updateExpense: vi.fn(() => vi.fn()),
  deleteExpense: vi.fn(),
}));

import { ExpensesClient } from "./ExpensesClient";

const rows = [
  { id: "1", dateISO: "2026-06-09T00:00:00.000Z", description: "Farm Boy run", category: { id: "c1", name: "Groceries", color: "seaweed" }, amountCents: 8432 },
];
const categories = [{ id: "c1", name: "Groceries" }];

describe("ExpensesClient", () => {
  it("renders rows with right-aligned tabular amount and a category pill", () => {
    render(<ExpensesClient total={1} totalCents={8432} rows={rows} categories={categories} />);
    expect(screen.getByText("Farm Boy run")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    const amount = screen.getByText("$84.32");
    expect(amount).toHaveClass("tnum");
    expect(amount).toHaveStyle({ textAlign: "right" });
  });

  it("opens the create modal from the Add button", () => {
    render(<ExpensesClient total={1} totalCents={8432} rows={rows} categories={categories} />);
    fireEvent.click(screen.getByText("Add expense"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add expense", { selector: "h2" })).toBeInTheDocument();
  });

  it("opens the edit modal (prefilled) when a row is clicked", () => {
    render(<ExpensesClient total={1} totalCents={8432} rows={rows} categories={categories} />);
    fireEvent.click(screen.getByText("Farm Boy run"));
    expect(screen.getByText("Edit expense", { selector: "h2" })).toBeInTheDocument();
    expect((screen.getByDisplayValue("84.32") as HTMLInputElement)).toBeInTheDocument();
  });

  it("shows the 'Create another' checkbox in create mode only", () => {
    render(<ExpensesClient total={1} totalCents={8432} rows={rows} categories={categories} />);
    fireEvent.click(screen.getByText("Add expense"));
    expect(screen.getByText("Create another")).toBeInTheDocument();
    // not present when editing
    fireEvent.keyDown(document, { key: "Escape" });
  });

  it("does not show 'Create another' in edit mode (shows Delete instead)", () => {
    render(<ExpensesClient total={1} totalCents={8432} rows={rows} categories={categories} />);
    fireEvent.click(screen.getByText("Farm Boy run"));
    expect(screen.queryByText("Create another")).not.toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
