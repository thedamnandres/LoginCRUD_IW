import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export const itemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().min(2, 'Mínimo 2 caracteres'),
  description: z.string().optional(),
})

export type ItemForm = z.infer<typeof itemSchema>

export const ModalForm: React.FC<{
  title: string
  open: boolean
  onClose: () => void
  initial?: Partial<ItemForm>
  onSubmit: (data: ItemForm) => Promise<void> | void
}> = ({ title, open, onClose, initial, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ItemForm>({
    defaultValues: initial as ItemForm,
  })

  useEffect(() => { reset(initial as ItemForm) }, [initial, reset])

  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white w-full max-w-md rounded-xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">✕</button>
        </div>

        <form
          onSubmit={handleSubmit(async (data) => { await onSubmit(data); onClose(); })}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm mb-1 text-white">Título</label>
            <input
              {...register('title', { required: 'Requerido', minLength: { value: 2, message: 'Mínimo 2 caracteres' } })}
              className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white placeholder-gray-300"
              placeholder="Título del item"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-white">Descripción</label>
            <textarea
              {...register('description')}
              className="w-full border border-gray-600 rounded-md px-3 py-2 bg-gray-700 text-white placeholder-gray-300"
              placeholder="Descripción opcional"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {/* mantenemos colores originales; solo el texto en blanco */}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-md border text-white"
            >
              Cancelar
            </button>
            <button
              disabled={isSubmitting}
              className="px-3 py-2 rounded-md bg-black text-white disabled:opacity-60"
            >
              {isSubmitting ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
