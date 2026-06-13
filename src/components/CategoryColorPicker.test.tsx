import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CategoryColorPicker } from "./CategoryColorPicker";

describe("CategoryColorPicker", () => {
  it("renders the 4 palette swatches and marks the selected one", () => {
    render(<CategoryColorPicker value="seaweed" onChange={() => {}} />);
    for (const c of ["sapphire", "seaweed", "amethyst", "lavender"]) {
      expect(screen.getByRole("radio", { name: c })).toBeInTheDocument();
    }
    expect(screen.getByRole("radio", { name: "seaweed" })).toHaveAttribute("aria-checked", "true");
  });
  it("calls onChange when a swatch is picked", () => {
    const onChange = vi.fn();
    render(<CategoryColorPicker value="seaweed" onChange={onChange} />);
    fireEvent.click(screen.getByRole("radio", { name: "amethyst" }));
    expect(onChange).toHaveBeenCalledWith("amethyst");
  });
});
