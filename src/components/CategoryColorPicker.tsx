"use client";

import { CATEGORY_COLORS } from "@/lib/validation/category";

const TOKEN: Record<string, string> = {
  sapphire: "var(--electric-sapphire)",
  seaweed: "var(--seaweed)",
  amethyst: "var(--amethyst)",
  lavender: "var(--lavender-mist)",
};

export function CategoryColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2.5" role="radiogroup" aria-label="Colour">
      <input type="hidden" name="color" value={value} />
      {CATEGORY_COLORS.map((c) => {
        const on = c === value;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={c}
            onClick={() => onChange(c)}
            className="size-7"
            style={{ background: TOKEN[c], border: on ? "3px solid var(--lavender-mist)" : "1px solid var(--border-strong)" }}
          />
        );
      })}
    </div>
  );
}
