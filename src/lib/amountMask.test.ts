import { describe, expect, it } from "vitest";
import { maskAmount } from "./amountMask";

describe("maskAmount", () => {
  it("groups thousands in the whole part", () => {
    expect(maskAmount("1234")).toBe("1,234");
    expect(maskAmount("1234567")).toBe("1,234,567");
  });
  it("keeps up to two decimals and drops extra", () => {
    expect(maskAmount("1234.5")).toBe("1,234.5");
    expect(maskAmount("12.999")).toBe("12.99");
  });
  it("strips letters and stray symbols", () => {
    expect(maskAmount("$1,2a3b4")).toBe("1,234");
  });
  it("keeps only the first decimal point", () => {
    expect(maskAmount("12.3.4")).toBe("12.34");
  });
  it("handles a bare decimal", () => {
    expect(maskAmount(".5")).toBe("0.5");
  });
});
