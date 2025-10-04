import React from 'react'

export type Column<T> = {
  key: keyof T
  header: string
  render?: (row: T) => React.ReactNode
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  onEdit,
  onDelete
}: {
  columns: Column<T>[]
  data: T[]
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm text-black">
        <thead className="bg-gray-50 text-black">
          <tr>
            {columns.map((c) => (
              <th
                key={`header-${String(c.key)}`}
                className="text-left px-4 py-3 font-semibold"
              >
                {c.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th key="acciones-header" className="px-4 py-3">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`row-${row.id}`} className="border-t">
              {columns.map((c) => (
                <td key={`${String(c.key)}-${row.id}`} className="px-4 py-2">
                  {c.render ? c.render(row) : String(row[c.key])}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    {onEdit && (
                      <button
                        className="px-2 py-1 border rounded text-red-600"
                        onClick={() => onEdit(row)}
                      >
                        Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="px-2 py-1 border rounded text-red-600"
                        onClick={() => onDelete(row)}
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
