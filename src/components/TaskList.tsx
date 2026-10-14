import type { Task } from '../tasks/tasks'
import { PixelCheckbox } from './PixelCheckbox'

type Props = {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onToggle, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <p className="py-6 text-center text-ink-dim">
        No hay tareas para hoy.
        <br />
        ¡Añade tu primera misión!
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <li
          key={t.id}
          className={`animate-pop-in flex items-center gap-3 border-2 bg-panel-2 px-3 py-2 ${
            t.done ? 'border-green/40' : 'border-edge'
          }`}
        >
          <button
            onClick={() => onToggle(t.id)}
            className="flex min-w-0 flex-1 items-center gap-3 text-left"
            aria-pressed={t.done}
            aria-label={t.done ? `Desmarcar "${t.title}"` : `Marcar "${t.title}" como hecha`}
          >
            <PixelCheckbox checked={t.done} />
            <span className={`min-w-0 break-words ${t.done ? 'text-ink-dim line-through' : ''}`}>{t.title}</span>
          </button>
          <button
            onClick={() => onDelete(t.id)}
            className="shrink-0 px-2 py-1 font-pixel text-sm text-red/70 hover:text-red"
            aria-label={`Eliminar "${t.title}"`}
            title="Eliminar"
          >
            ✕
          </button>
        </li>
      ))}
    </ul>
  )
}
