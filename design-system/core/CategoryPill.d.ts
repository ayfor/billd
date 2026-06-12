import * as React from 'react';

export interface CategoryPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Category name, e.g. "Groceries", "Dining out". Resolves the glyph. */
  category: string;
  /** Override the resolved icon name. */
  icon?: string;
  iconBase?: string;
}

/** A category label prefixed by its pixel glyph; neutral, square-cornered. */
export function CategoryPill(props: CategoryPillProps): JSX.Element;
