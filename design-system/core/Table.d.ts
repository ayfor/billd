import * as React from 'react';

export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  width?: string | number;
  /** Custom cell renderer: (value, row, index) => node. */
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  columns: TableColumn[];
  rows: any[];
  rowKey?: (row: any, index: number) => React.Key;
  onRowClick?: (row: any, index: number) => void;
}

/**
 * billd's data table — uppercase header rules, hover rows, money columns
 * right-aligned with tabular numerals.
 * @startingPoint section="Data" subtitle="Expenses-style data table" viewport="640x280"
 */
export function Table(props: TableProps): JSX.Element;
