import { describe, expect, it } from "vitest";
import { paginate } from "./pagination";

describe("paginate", () => {
  it("computes skip/take/pageCount for a full first page", () => {
    const p = paginate(23, 1);
    expect(p).toMatchObject({ page: 1, skip: 0, take: 25, pageCount: 1 });
    expect(p.label).toBe("Showing 23 of 23 · page 1 of 23".replace("23 · page 1 of 23", "23 · page 1 of 1"));
  });
  it("computes a middle page", () => {
    const p = paginate(60, 2);
    expect(p).toMatchObject({ page: 2, skip: 25, take: 25, pageCount: 3 });
    expect(p.label).toBe("Showing 25 of 60 · page 2 of 3");
  });
  it("clamps out-of-range pages", () => {
    expect(paginate(60, 99).page).toBe(3);
    expect(paginate(60, 0).page).toBe(1);
    expect(paginate(60, -5).page).toBe(1);
  });
  it("handles the empty case", () => {
    const p = paginate(0, 1);
    expect(p).toMatchObject({ page: 1, pageCount: 1, skip: 0 });
    expect(p.label).toBe("No expenses");
  });
});
