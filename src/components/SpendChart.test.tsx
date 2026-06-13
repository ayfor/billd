import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// jsdom has no layout; stub ResponsiveContainer to a fixed size so Recharts renders.
vi.mock("recharts", async (orig) => {
  const actual = await orig<typeof import("recharts")>();
  return { ...actual, ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div style={{ width: 600, height: 220 }}>{children}</div> };
});

import { SpendChart, type ChartPoint } from "./SpendChart";

const points: ChartPoint[] = [
  { day: 1, actual: 1000, projected: null },
  { day: 2, actual: 3000, projected: 3000 },
  { day: 3, actual: null, projected: 9000 },
];

describe("SpendChart", () => {
  it("shows the empty state when the month has no spend", () => {
    render(<SpendChart points={[]} expectedCents={240000} today={2} empty />);
    expect(screen.getByText(/No spending yet/i)).toBeInTheDocument();
  });
  it("renders the chart (not the empty state) when there is data", () => {
    // Recharts needs real layout to draw its SVG (absent in jsdom); assert the
    // non-empty branch is taken. Live e2e verifies the actual rendered chart.
    render(<SpendChart points={points} expectedCents={240000} today={2} />);
    expect(screen.queryByText(/No spending yet/i)).not.toBeInTheDocument();
  });
});
