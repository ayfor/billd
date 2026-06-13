import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "./page";

describe("landing page", () => {
  it("renders the BILLD wordmark in the pixel display face", () => {
    render(<Home />);
    const wordmark = screen.getByRole("heading", { level: 1 });
    expect(wordmark).toHaveTextContent("BILLD");
    expect(wordmark).toHaveStyle({ fontFamily: "var(--font-pixel)" });
  });

  it("shows all five palette tokens", () => {
    render(<Home />);
    for (const hex of ["#272727", "#efe9f4", "#5863f8", "#00b295", "#935fa7"]) {
      expect(screen.getByText(hex)).toBeInTheDocument();
    }
  });
});
