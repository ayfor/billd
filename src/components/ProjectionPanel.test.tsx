import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectionPanel } from "./ProjectionPanel";

describe("ProjectionPanel", () => {
  it("renders the projected numeral + status when not too early", () => {
    render(<ProjectionPanel status={{ tooEarly: false, projectedCents: 231040, onPace: true, label: "On pace · under budget", tone: "positive" }} />);
    expect(screen.getByText("$2,310.40")).toBeInTheDocument();
    expect(screen.getByText("On pace · under budget")).toBeInTheDocument();
  });
  it("renders the guard copy when too early", () => {
    render(<ProjectionPanel status={{ tooEarly: true, projectedCents: 0, onPace: true, label: "Too early to call", tone: "muted" }} />);
    expect(screen.getByText("Too early to call")).toBeInTheDocument();
    expect(screen.queryByText(/projected month end/)).not.toBeInTheDocument();
  });
});
