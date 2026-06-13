import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ExpensesEmptyState } from "./ExpensesEmptyState";

describe("ExpensesEmptyState", () => {
  it("educates the quick-add shortcut", () => {
    render(<ExpensesEmptyState />);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
    expect(screen.getByText(/No expenses yet/i)).toBeInTheDocument();
  });
});
