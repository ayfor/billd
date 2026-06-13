import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("color tokens", () => {
  const css = readFileSync("src/styles/tokens/colors.css", "utf8").toLowerCase();

  it.each(["#272727", "#efe9f4", "#5863f8", "#00b295", "#935fa7"])(
    "defines palette hue %s",
    (hex) => {
      expect(css).toContain(hex);
    },
  );

  it("defines no red: only the five billd hues appear as 6-digit hex colors", () => {
    const allowed = new Set([
      "#272727", "#efe9f4", "#5863f8", "#00b295", "#935fa7",
      "#2d2d2d", "#1f1f1f", "#333333", "#6a74f9", "#4751e6",
    ]);
    const hexes = css.match(/#[0-9a-f]{6}\b/g) ?? [];
    for (const h of hexes) expect(allowed).toContain(h);
  });
});
