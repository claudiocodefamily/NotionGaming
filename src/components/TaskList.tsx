import type { Category } from '../categories/categories'
import type { Task } from '../tasks/tasks'
import { CategoryTag } from './CategoryTag'
import { PixelCheckbox } from './PixelCheckbox'

type Props = {
  tasks: Task[]
  categories: Category[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, categories, onToggle, onDelete }: Props) {
  const byId = new Map(categories.map((c) => [c.id, c]))

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
      {tasks.map((t) => {
        const category = t.categoryId ? byId.get(t.categoryId) : undefined
        return (
          <li
            key={t.id}
            className={`animate-pop-in flex items-center gap-3 border-2 bg-panel-2 px-3 py-2 ${
              t.done ? 'border-leaf/40' : 'border-edge'
            }`}
          >
            <button
              onClick={() => onToggle(t.id)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
              aria-pressed={t.done}
              aria-label={t.done ? `Desmarcar "${t.title}"` : `Marcar "${t.title}" como hecha`}
            >
              <PixelCheckbox checked={t.done} />
              <span className="flex min-w-0 flex-1 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className={`min-w-0 break-words ${t.done ? 'text-ink-dim line-through' : ''}`}>{t.title}</span>
                {category && (
                  <span className={t.done ? 'opacity-50' : ''}>
                    <CategoryTag category={category} />
                  </span>
                )}
              </span>
            </button>
            <button
              onClick={() => onDelete(t.id)}
              className="shrink-0 px-2 py-1 font-pixel text-sm text-berry/70 hover:text-berry"
              aria-label={`Eliminar "${t.title}"`}
              title="Eliminar"
            >
              ✕
            </button>
          </li>
        )
      })}
    </ul>
  )
}
