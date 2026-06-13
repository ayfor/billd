import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BudgetBar } from "./BudgetBar";

describe("BudgetBar", () => {
  it("caps the fill at 100% even when over budget", () => {
    render(<BudgetBar ratio={1.3} over={true} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });
  it("reflects an under-budget ratio", () => {
    render(<BudgetBar ratio={0.5} over={false} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "50");
  });
});
