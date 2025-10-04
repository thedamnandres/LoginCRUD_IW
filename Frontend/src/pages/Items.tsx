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
    r.ownerEmail ??
    r.owner_email ??
    r.ownerUsername ??
    r.owner_username ??
    (r.owner && (r.owner.email || r.owner.username || r.owner.name)) ??
    (r.user && (r.user.email || r.user.username || r.user.name)) ??
    r.user_email ??
    r.user_username ??
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
      { key: 'id', header: 'ID' },
      { key: 'title', header: 'Título' },
      { key: 'description', header: 'Descripción' },
    ] as const

    const adminExtra = adminMode ? [{ key: 'ownerEmail', header: 'Owner' } as const] : []
    return [...base, ...adminExtra]
  }, [adminMode])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">
          Items {adminMode ? '(todos)' : '(mis items)'}
        </h1>
        <button
          onClick={() => { setEditing(null); setOpen(true) }}
          className="px-3 py-2 rounded-md bg-black text-white"
        >
          Nuevo
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {String(error)}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando…</p>
      ) : (
        <DataTable<Item>
          columns={columns as any}
          data={rows}
          onEdit={(row) => { setEditing(row); setOpen(true) }}
          onDelete={onDelete}
        />
      )}

      <ModalForm
        title={editing ? 'Editar item' : 'Nuevo item'}
        open={open}
        onClose={() => setOpen(false)}
        initial={editing ?? {}}
        onSubmit={editing ? onUpdate : onCreate}
      />
    </div>
  )
}

export default Items
