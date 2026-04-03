import { cn } from '@/lib/utils/cn'

export interface Column<T> {
  key: keyof T | string
  header: string
  className?: string
  cell?: (row: T) => React.ReactNode
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[]
  rows: T[]
  keyField?: keyof T
  emptyMessage?: string
  className?: string
  loading?: boolean
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField,
  emptyMessage = 'No data yet.',
  className,
  loading,
}: DataTableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-white/[6%]', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[6%] bg-surface-raised/50">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium text-ink-subtle uppercase tracking-wide',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-ink-subtle">
                Loading…
              </td>
            </tr>
          )}
          {!loading && rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-ink-subtle">
                {emptyMessage}
              </td>
            </tr>
          )}
          {!loading &&
            rows.map((row, i) => (
              <tr
                key={keyField ? String(row[keyField]) : i}
                className="border-b border-white/[4%] last:border-0 hover:bg-white/[2%] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={cn('px-4 py-3 text-ink-muted', col.className)}
                  >
                    {col.cell
                      ? col.cell(row)
                      : String(row[col.key as keyof T] ?? '—')}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
