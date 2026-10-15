import { useState, type FormEvent } from 'react'
import type { Category } from '../categories/categories'
import { CategoryPicker } from './CategoryPicker'

type Props = {
  categories: Category[]
  onAdd: (title: string, categoryId: string | null) => void
}

export function AddTaskForm({ categories, onAdd }: Props) {
  const [title, setTitle] = useState('')
  // se recuerda la última clasificación usada para añadir varias seguidas
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const selected = categories.some((c) => c.id === categoryId) ? categoryId : null

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title, selected)
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva tarea..."
          maxLength={120}
          className="min-w-0 flex-1 border-2 border-edge bg-soil px-3 py-2 text-ink outline-none placeholder:text-ink-dim/60 focus:border-river"
          aria-label="Nueva tarea"
        />
        <button type="submit" className="pixel-btn bg-river/10 px-4 py-3 text-[11px] text-river hover:bg-river/20">
          + AÑADIR
        </button>
      </div>
      <CategoryPicker categories={categories} value={selected} onChange={setCategoryId} />
    </form>
  )
}
