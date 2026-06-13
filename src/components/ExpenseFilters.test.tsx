import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

const push = vi.fn();
let current = new URLSearchParams("");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  usePathname: () => "/expenses",
  useSearchParams: () => current,
}));

import { ExpenseFilters } from "./ExpenseFilters";

const categories = [{ value: "c1", label: "Groceries" }];
const months = [{ value: "2026-06", label: "Jun 2026" }];

describe("ExpenseFilters", () => {
  beforeEach(() => { push.mockClear(); current = new URLSearchParams(""); });

  it("pushes a category filter and resets page", () => {
    current = new URLSearchParams("page=3");
    render(<ExpenseFilters categories={categories} months={months} />);
    fireEvent.change(screen.getByLabelText("Category"), { target: { value: "c1" } });
    expect(push).toHaveBeenCalledWith("/expenses?categoryId=c1");
  });

  it("pushes sort changes", () => {
    render(<ExpenseFilters categories={categories} months={months} />);
    fireEvent.change(screen.getByLabelText("Sort"), { target: { value: "amount:asc" } });
    expect(push).toHaveBeenCalledWith("/expenses?sort=amount&dir=asc");
  });

  it("debounces search before pushing q", () => {
    vi.useFakeTimers();
    render(<ExpenseFilters categories={categories} months={months} />);
    fireEvent.change(screen.getByLabelText("Search description"), { target: { value: "farm" } });
    expect(push).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(300); });
    expect(push).toHaveBeenCalledWith("/expenses?q=farm");
    vi.useRealTimers();
  });
});
