// src/pages/Items.tsx
import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import { DataTable } from '../components/DataTable'
import { ModalForm, type ItemForm } from '../components/ModalForm'
import type { Item } from '../types'
import { useAuth } from '../auth/AuthContext'

const BASE = '/items'

type RawItem = {
  id: string | number
  name: string
  description?: string
  owner?: any
  ownerEmail?: string
  owner_email?: string
  ownerUsername?: string
  owner_username?: string
  user?: any
  user_email?: string
  user_username?: string
  ownerId?: string | number
  owner_id?: string | number
}

const Items: React.FC = () => {
  const { user } = useAuth()

  // Modo admin real (según respuesta del backend)
  const [adminMode, setAdminMode] = useState<boolean>(false)

  const [rows, setRows] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Item | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Heurística inicial (por si viene algo en user); puede corregirse tras el fetch
  const isAdminHeuristic =
    (user?.role?.toLowerCase?.() === 'admin') ||
    ((user as any)?.is_superuser === true) ||
    ((user as any)?.isAdmin === true) ||
    ((user as any)?.is_admin === true)

  const ownerDisplay = (r: RawItem) =>
    (r.owner && r.owner.username) ??
    r.ownerUsername ??
    r.owner_username ??
    (r.owner && (r.owner.name || r.owner.email)) ??
    (r.user && (r.user.username || r.user.name || r.user.email)) ??
    r.user_username ??
    r.ownerEmail ??
    r.owner_email ??
    r.user_email ??
    (r.ownerId ?? r.owner_id ?? '')

  const mapRawToItem = (r: RawItem): Item => ({
    id: r.id,
    title: r.name,
    description: r.description,
    ownerEmail: ownerDisplay(r) ? String(ownerDisplay(r)) : undefined,
  })

  const fetchRows = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1) Intentar como ADMIN -> /items/all
      //    Si funciona, marcamos adminMode=true
      try {
        const { data } = await api.get(`${BASE}/all`)
        const mapped: Item[] = (data as RawItem[]).map(mapRawToItem)
        setRows(mapped)
        setAdminMode(true)
        return
      } catch (err: any) {
        const status = err?.response?.status
        // Si es 401/403/404, asumimos que no es admin y caemos a /items/
        if (![401, 403, 404].includes(status)) {
          // Si fue otro tipo de error (500, red, etc.), lo mostramos
          throw err
        }
      }

      // 2) Fallback USER -> /items/
      const { data } = await api.get(`${BASE}/`)
      const mapped: Item[] = (data as RawItem[]).map(mapRawToItem)
      setRows(mapped)
      setAdminMode(false)
    } catch (err: any) {
      console.error('FETCH ERROR:', err?.response?.status, err?.response?.data || err?.message)
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'No se pudo cargar la lista de items'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRows()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* depender de user por si cambia */ user?.id])

  // El back espera { name, description? }
  const toBody = (p: ItemForm) => ({
    name: p.title,
    description: p.description ?? undefined,
  })

  const onCreate = async (payload: ItemForm) => {
    setError(null)
    try {
      await api.post(`${BASE}/`, toBody(payload))
      await fetchRows()
    } catch (err: any) {
      console.error('CREATE ERROR:', err?.response?.status, err?.response?.data || err?.message)
      alert('No se pudo crear:\n' + JSON.stringify(err?.response?.data ?? err?.message, null, 2))
      throw err
    }
  }

  const onUpdate = async (payload: ItemForm) => {
    if (!editing) return
    setError(null)
    try {
      await api.put(`${BASE}/${editing.id}`, toBody(payload))
      await fetchRows()
    } catch (err: any) {
      console.error('UPDATE ERROR:', err?.response?.status, err?.response?.data || err?.message)
      alert('No se pudo actualizar:\n' + JSON.stringify(err?.response?.data ?? err?.message, null, 2))
      throw err
    }
  }

  const onDelete = async (row: Item) => {
    if (!confirm(`¿Eliminar item "${row.title}"?`)) return
    setError(null)
    try {
      await api.delete(`${BASE}/${row.id}`)
      await fetchRows()
    } catch (err: any) {
      console.error('DELETE ERROR:', err?.response?.status, err?.response?.data || err?.message)
      alert('No se pudo eliminar:\n' + JSON.stringify(err?.response?.data ?? err?.message, null, 2))
      throw err
    }
  }

  const columns = useMemo(() => {
    const base = [
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descripción' },
    ] as const

    const adminExtra = adminMode ? [{ key: 'ownerEmail', header: 'Usuario' } as const] : []
    return [...base, ...adminExtra]
  }, [adminMode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Gestión de Notas
                </h1>
                <p className="text-gray-600 flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    adminMode 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {adminMode ? 'Vista Administrador' : 'Vista Personal'}
                  </span>
                  {adminMode ? 'Viendo todos los items del sistema' : 'Viendo solo tus items'}
                </p>
              </div>
              <button
                onClick={() => { setEditing(null); setOpen(true) }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Item
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{String(error)}</p>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2 text-gray-600">
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg font-medium">Cargando items...</span>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <DataTable<Item>
                  columns={columns as any}
                  data={rows}
                  onEdit={(row) => { setEditing(row); setOpen(true) }}
                  onDelete={onDelete}
                />
              </div>
            )}
          </div>

          {/* Modal */}
          <ModalForm
            title={editing ? 'Editar item' : 'Nuevo item'}
            open={open}
            onClose={() => setOpen(false)}
            initial={editing ?? {}}
            onSubmit={editing ? onUpdate : onCreate}
          />
        </div>
      </div>
    </div>
  )
}

export default Items
