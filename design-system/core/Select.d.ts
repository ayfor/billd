import * as React from 'react';

export interface SelectOption { value: string; label: string; }

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Uppercase eyebrow label. */
  label?: string;
  /** Options as strings or {value,label}. Ignored if children given. */
  options?: (string | SelectOption)[];
  iconBase?: string;
}

/** A native select styled as a billd field, with a pixel chevron. */
export function Select(props: SelectProps): JSX.Element;
