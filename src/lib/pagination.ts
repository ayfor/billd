export const PER_PAGE = 25;

export type Pagination = {
  page: number;
  perPage: number;
  skip: number;
  take: number;
  pageCount: number;
  label: string;
};

export function paginate(total: number, rawPage: number, perPage = PER_PAGE): Pagination {
  const pageCount = Math.max(1, Math.ceil(total / perPage));
  const page = Math.min(Math.max(1, Math.floor(rawPage) || 1), pageCount);
  const skip = (page - 1) * perPage;
  const take = perPage;
  const shown = Math.min(perPage, Math.max(0, total - skip));
  const label =
    total === 0
      ? "No expenses"
      : `Showing ${shown} of ${total} · page ${page} of ${pageCount}`;
  return { page, perPage, skip, take, pageCount, label };
}
