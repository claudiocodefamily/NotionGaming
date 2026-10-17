import { useState, type FormEvent } from 'react'
import type { Category } from '../categories/categories'
import { shortDay, type TaskItem } from '../tasks/pending'
import { PixelCheckbox } from './PixelCheckbox'

export type MoveAction = { icon: string; label: string; onMove: (id: string) => void }

type Props = {
  item: TaskItem
  today: string
  /** Se muestra el icono de la clasificación cuando la lista no está agrupada por ella. */
  category?: Category
  /** Muestra el día solo si la tarea está atrasada. */
  showOverdue?: boolean
  open: boolean
  onToggleOpen: () => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAddSubtask: (parentId: string, title: string) => void
  move?: MoveAction
}

/** Fila de la columna de tareas: tarea ▸ subtareas desplegables, con acciones. */
export function TaskRow({ item, today, category, showOverdue, open, onToggleOpen, ...actions }: Props) {
  const { task, subtasks, subDone, subTotal } = item
  const { onToggle, onDelete, onAddSubtask, move } = actions
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const day = task.date ? shortDay(task.date, today) : null
  const overdue = showOverdue && day?.overdue && !task.done
  const showSubs = (subTotal > 0 && open) || adding

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddSubtask(task.id, title)
    setTitle('')
  }

  return (
    <li className="animate-pop-in">
      <div className="flex items-center gap-1">
        {subTotal > 0 ? (
          <button
            onClick={onToggleOpen}
            aria-expanded={open}
            aria-label={`${open ? 'Plegar' : 'Desplegar'} subtareas de "${task.title}"`}
            className="w-4 shrink-0"
          >
            <Arrow open={open} />
          </button>
        ) : (
          <span className="w-4 shrink-0" />
        )}
        <button
          onClick={() => onToggle(task.id)}
          aria-pressed={task.done}
          aria-label={task.done ? `Desmarcar "${task.title}"` : `Marcar "${task.title}" como hecha`}
          className="flex min-w-0 flex-1 items-center gap-1.5 py-0.5 text-left"
        >
          <span className="shrink-0 scale-75">
            <PixelCheckbox checked={task.done} />
          </span>
          {category && (
            <span aria-hidden title={category.name} className={task.done ? 'opacity-50' : ''}>
              {category.icon}
            </span>
          )}
          <span
            className={`min-w-0 flex-1 truncate text-[20px] ${task.done ? 'text-ink-dim line-through' : ''}`}
            title={task.title}
          >
            {task.title}
          </span>
        </button>
        {subTotal > 0 && (
          <span className="shrink-0 text-[17px] text-ink-dim" title="Subtareas completadas">
            {subDone}/{subTotal}
          </span>
        )}
        {overdue && day && (
          <span className="shrink-0 text-[17px] text-berry" title="Atrasada">
            ⚠ {day.label}
          </span>
        )}
        <button
          onClick={() => setAdding((a) => !a)}
          className={`shrink-0 px-1 font-pixel text-[10px] ${adding ? 'text-sun' : 'text-ink-dim hover:text-sun'}`}
          aria-label={`Añadir subtarea a "${task.title}"`}
          aria-expanded={adding}
          title="Añadir subtarea"
        >
          +
        </button>
        {move && (
          <button
            onClick={() => move.onMove(task.id)}
            className="shrink-0 px-0.5 text-[16px] opacity-60 hover:opacity-100"
            aria-label={`${move.label}: "${task.title}"`}
            title={move.label}
          >
            {move.icon}
          </button>
        )}
        <button
          onClick={() => {
            if (subTotal > 0 && !confirm(`¿Eliminar "${task.title}" y sus ${subTotal} subtareas?`)) return
            onDelete(task.id)
          }}
          className="shrink-0 px-1 font-pixel text-[10px] text-berry/60 hover:text-berry"
          aria-label={`Eliminar "${task.title}"`}
          title="Eliminar"
        >
          ✕
        </button>
      </div>

      {showSubs && (
        <ul className="ml-[22px] border-l-2 border-dashed border-edge pl-2">
          {subTotal > 0 &&
            open &&
            subtasks.map((s) => (
              <li key={s.id} className="flex items-center gap-1">
                <button
                  onClick={() => onToggle(s.id)}
                  aria-pressed={s.done}
                  aria-label={s.done ? `Desmarcar "${s.title}"` : `Marcar "${s.title}" como hecha`}
                  className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                >
                  <span className="shrink-0 scale-[0.6]">
                    <PixelCheckbox checked={s.done} />
                  </span>
                  <span
                    className={`min-w-0 flex-1 truncate text-[19px] ${s.done ? 'text-ink-dim/60 line-through' : 'text-ink-dim'}`}
                    title={s.title}
                  >
                    {s.title}
                  </span>
                </button>
                <button
                  onClick={() => onDelete(s.id)}
                  className="shrink-0 px-1 font-pixel text-[8px] text-berry/50 hover:text-berry"
                  aria-label={`Eliminar subtarea "${s.title}"`}
                  title="Eliminar"
                >
                  ✕
                </button>
              </li>
            ))}
          {adding && (
            <li>
              <form onSubmit={submit} className="flex gap-2 py-1">
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
                  placeholder="Nueva subtarea..."
                  maxLength={120}
                  className="min-w-0 flex-1 border-2 border-edge bg-soil px-2 py-0.5 text-[19px] text-ink outline-none placeholder:text-ink-dim/60 focus:border-sun"
                  aria-label={`Nueva subtarea de "${task.title}"`}
                />
                <button type="submit" className="pixel-btn px-2 text-[9px] text-sun">
                  OK
                </button>
              </form>
            </li>
          )}
        </ul>
      )}
    </li>
  )
}

export function Arrow({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <span aria-hidden className={`inline-block w-3 font-pixel text-[8px] ${className}`}>
      {open ? '▼' : '▶'}
    </span>
  )
}
