import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/(dashboard)/expenses/actions", () => ({
  createExpense: vi.fn(),
  updateExpense: vi.fn(() => vi.fn()),
  deleteExpense: vi.fn(),
}));

import { QuickAdd } from "./QuickAdd";

const categories = [{ id: "c1", name: "Groceries" }, { id: "c2", name: "Transit" }];

function setup() {
  return render(
    <QuickAdd categories={categories} defaultCategoryId="c2">
      <p>page content</p>
    </QuickAdd>,
  );
}

describe("QuickAdd", () => {
  it("opens the create modal on Cmd/Ctrl+K with the Create another checkbox", () => {
    setup();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add expense", { selector: "h2" })).toBeInTheDocument();
    expect(screen.getByText("Create another")).toBeInTheDocument();
  });

  it("preselects the most-recently-used category", () => {
    setup();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("c2");
  });

  it("closes on Escape", () => {
    setup();
    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
