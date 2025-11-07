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
    <div className="w-full">
      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {data.map((row) => (
          <div key={`mobile-${row.id}`} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {columns.map((c) => {
                const content = c.render ? c.render(row) : String(row[c.key])
                const isLongContent = String(content).length > 30
                
                return (
                  <div key={`mobile-${String(c.key)}-${row.id}`} className={isLongContent ? "space-y-1" : "flex justify-between items-start"}>
                    <span className="text-sm font-medium text-gray-600 block">
                      {c.header}:
                    </span>
                    <span className={`text-sm text-gray-900 ${isLongContent ? 'block mt-1' : 'ml-2'} break-words`}>
                      {content}
                    </span>
                  </div>
                )
              })}
              {(onEdit || onDelete) && (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  {onEdit && (
                    <button
                      className="flex-1 px-3 py-2 text-sm border border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors font-medium"
                      onClick={() => onEdit(row)}
                    >
                      Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="flex-1 px-3 py-2 text-sm border border-red-300 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
                      onClick={() => onDelete(row)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {columns.map((c) => (
                  <th
                    key={`header-${String(c.key)}`}
                    className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {c.header}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <tr 
                key={`row-${row.id}`} 
                className={`hover:bg-gray-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                }`}
              >
                {columns.map((c) => (
                  <td key={`${String(c.key)}-${row.id}`} className="px-6 py-4 text-sm text-gray-900">
                    <div className="max-w-xs">
                      {c.render ? c.render(row) : String(row[c.key])}
                    </div>
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2 justify-start">
                      {onEdit && (
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-blue-300 rounded-lg text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                          onClick={() => onEdit(row)}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
                          onClick={() => onDelete(row)}
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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
    </div>

    {/* Empty State */}
    {data.length === 0 && (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No hay items</h3>
        <p className="mt-2 text-sm text-gray-500">
          Comienza creando tu primer item haciendo clic en el botón "Nuevo Item"
        </p>
      </div>
    )}
  </div>
  )
}
