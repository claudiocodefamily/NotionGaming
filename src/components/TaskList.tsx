import { useState, type FormEvent } from 'react'
import type { Category } from '../categories/categories'
import { subtasksOf, type Task } from '../tasks/tasks'
import { CategoryTag } from './CategoryTag'
import { PixelCheckbox } from './PixelCheckbox'

type Props = {
  /** Tareas principales a mostrar. */
  tasks: Task[]
  /** Todas las tareas, para encontrar las subtareas de cada una. */
  allTasks: Task[]
  categories: Category[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAddSubtask: (parentId: string, title: string) => void
  /** Botón opcional para mover la tarea (a hoy, o a misiones secundarias). */
  move?: MoveAction
  emptyMessage?: string
}

type MoveAction = { icon: string; label: string; onMove: (id: string) => void }

export function TaskList({ tasks, allTasks, categories, onToggle, onDelete, onAddSubtask, move, emptyMessage }: Props) {
  const byId = new Map(categories.map((c) => [c.id, c]))

  if (tasks.length === 0) {
    return (
      <p className="py-6 text-center whitespace-pre-line text-ink-dim">
        {emptyMessage ?? 'No hay tareas para hoy.\n¡Añade tu primera misión!'}
      </p>
    )
  }

  return (
    <ul className="space-y-2">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          subtasks={subtasksOf(allTasks, t.id)}
          category={t.categoryId ? byId.get(t.categoryId) : undefined}
          onToggle={onToggle}
          onDelete={onDelete}
          onAddSubtask={onAddSubtask}
          move={move}
        />
      ))}
    </ul>
  )
}

type ItemProps = {
  task: Task
  subtasks: Task[]
  category?: Category
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAddSubtask: (parentId: string, title: string) => void
  move?: MoveAction
}

function TaskItem({ task, subtasks, category, onToggle, onDelete, onAddSubtask, move }: ItemProps) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const subDone = subtasks.filter((s) => s.done).length

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAddSubtask(task.id, title)
    setTitle('')
  }

  return (
    <li className={`animate-pop-in border-2 bg-panel-2 ${task.done ? 'border-leaf/40' : 'border-edge'}`}>
      <div className="flex items-center gap-3 px-3 py-2">
        <button
          onClick={() => onToggle(task.id)}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
          aria-pressed={task.done}
          aria-label={task.done ? `Desmarcar "${task.title}"` : `Marcar "${task.title}" como hecha`}
        >
          <PixelCheckbox checked={task.done} />
          <span className="flex min-w-0 flex-1 flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <span className={`min-w-0 break-words ${task.done ? 'text-ink-dim line-through' : ''}`}>{task.title}</span>
            <span className={`flex shrink-0 items-center gap-2 ${task.done ? 'opacity-50' : ''}`}>
              {subtasks.length > 0 && (
                <span className="text-ink-dim" title="Subtareas completadas">
                  {subDone}/{subtasks.length}
                </span>
              )}
              {category && <CategoryTag category={category} />}
            </span>
          </span>
        </button>
        <button
          onClick={() => setAdding((a) => !a)}
          className={`shrink-0 px-1.5 py-1 font-pixel text-xs ${adding ? 'text-sun' : 'text-ink-dim hover:text-sun'}`}
          aria-label={`Añadir subtarea a "${task.title}"`}
          aria-expanded={adding}
          title="Añadir subtarea"
        >
          +
        </button>
        {move && (
          <button
            onClick={() => move.onMove(task.id)}
            className="shrink-0 px-1 py-1 text-[18px] opacity-70 hover:opacity-100"
            aria-label={`${move.label}: "${task.title}"`}
            title={move.label}
          >
            {move.icon}
          </button>
        )}
        <button
          onClick={() => {
            if (subtasks.length > 0 && !confirm(`¿Eliminar "${task.title}" y sus ${subtasks.length} subtareas?`)) return
            onDelete(task.id)
          }}
          className="shrink-0 px-1.5 py-1 font-pixel text-sm text-berry/70 hover:text-berry"
          aria-label={`Eliminar "${task.title}"`}
          title="Eliminar"
        >
          ✕
        </button>
      </div>

      {(subtasks.length > 0 || adding) && (
        <div className="mr-3 mb-2 ml-6 space-y-1 border-l-2 border-dashed border-edge pl-3 sm:ml-8">
          {subtasks.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <button
                onClick={() => onToggle(s.id)}
                className="flex min-w-0 flex-1 items-center gap-2 py-0.5 text-left"
                aria-pressed={s.done}
                aria-label={s.done ? `Desmarcar "${s.title}"` : `Marcar "${s.title}" como hecha`}
              >
                <span className="scale-75">
                  <PixelCheckbox checked={s.done} />
                </span>
                <span className={`min-w-0 break-words text-[20px] ${s.done ? 'text-ink-dim line-through' : ''}`}>
                  {s.title}
                </span>
              </button>
              <button
                onClick={() => onDelete(s.id)}
                className="shrink-0 px-1.5 font-pixel text-[10px] text-berry/60 hover:text-berry"
                aria-label={`Eliminar subtarea "${s.title}"`}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
          {adding && (
            <form onSubmit={submit} className="flex gap-2 pt-1">
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setAdding(false)}
                placeholder="Nueva subtarea..."
                maxLength={120}
                className="min-w-0 flex-1 border-2 border-edge bg-soil px-2 py-1 text-[20px] text-ink outline-none placeholder:text-ink-dim/60 focus:border-sun"
                aria-label={`Nueva subtarea de "${task.title}"`}
              />
              <button type="submit" className="pixel-btn px-2 text-[10px] text-sun">
                OK
              </button>
            </form>
          )}
        </div>
      )}
    </li>
  )
}
