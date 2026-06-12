import * as React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Uppercase eyebrow label rendered above the field. */
  label?: string;
  /** Small helper text below the field. */
  hint?: string;
  size?: 'md' | 'lg';
  /** Inline prefix glyph, e.g. "$" for money entry. */
  prefix?: string;
}

/** A crisp, modern text field — sunken well, square corners, Sapphire focus. */
export function Input(props: InputProps): JSX.Element;
