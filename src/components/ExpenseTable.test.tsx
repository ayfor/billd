import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExpenseTable } from "./ExpenseTable";

describe("ExpenseTable", () => {
  const rows = [
    { id: "1", date: new Date("2026-06-09"), description: "Farm Boy run", category: { name: "Groceries", color: "seaweed" }, amountCents: 8432 },
  ];
  it("renders date, description, category pill, and right-aligned tabular amount", () => {
    render(<ExpenseTable rows={rows} />);
    expect(screen.getByText("Farm Boy run")).toBeInTheDocument();
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    const amount = screen.getByText("$84.32");
    expect(amount).toHaveClass("tnum");
    expect(amount).toHaveStyle({ textAlign: "right" });
  });
});
