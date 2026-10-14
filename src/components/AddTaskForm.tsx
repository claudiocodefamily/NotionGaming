import { useState, type FormEvent } from 'react'

export function AddTaskForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title)
    setTitle('')
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
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
    </form>
  )
}
