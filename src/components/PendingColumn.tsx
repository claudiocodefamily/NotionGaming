import type { Category } from '../categories/categories'
import { pendingGroups, shortDay } from '../tasks/pending'
import type { Task } from '../tasks/tasks'
import { useCollapsed } from '../useCollapsed'
import { PixelCheckbox } from './PixelCheckbox'

const NONE = '__none'
const COLUMN = '__column'

type Props = {
  tasks: Task[]
  categories: Category[]
  today: string
  onToggle: (id: string) => void
}

/** Columna con todas las tareas pendientes agrupadas: clasificación ▸ tarea ▸ subtareas. */
export function PendingColumn({ tasks, categories, today, onToggle }: Props) {
  // en móvil la columna empieza plegada para no tapar las tareas de hoy
  const { isCollapsed, toggle } = useCollapsed([COLUMN])
  const groups = pendingGroups(tasks, categories)
  const total = groups.reduce((n, g) => n + g.items.length, 0)
  const columnCollapsed = isCollapsed(COLUMN)

  return (
    <aside aria-label="Tareas pendientes">
      <button
        onClick={() => toggle(COLUMN)}
        aria-expanded={!columnCollapsed}
        className="flex w-full items-center gap-2 text-left lg:pointer-events-none"
      >
        <Arrow open={!columnCollapsed} className="lg:hidden" />
        <h2 className="font-pixel text-[11px] text-sun">PENDIENTES</h2>
        <span className="ml-auto text-ink-dim">{total}</span>
      </button>

      <div className={`mt-3 ${columnCollapsed ? 'hidden lg:block' : ''}`}>
        {groups.length === 0 ? (
          <p className="py-4 text-ink-dim">¡Nada pendiente! 🏆</p>
        ) : (
          <ul className="space-y-3">
            {groups.map((g) => {
              const gid = g.category?.id ?? NONE
              const open = !isCollapsed(gid)
              const color = g.category?.color ?? 'var(--color-ink-dim)'
              return (
                <li key={gid}>
                  <button
                    onClick={() => toggle(gid)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-2 border-b-2 pb-1 text-left"
                    style={{ borderColor: color, color }}
                  >
                    <Arrow open={open} />
                    <span aria-hidden>{g.category?.icon ?? '📦'}</span>
                    <span className="font-pixel text-[9px] uppercase">{g.category?.name ?? 'Sin clasificación'}</span>
                    <span className="ml-auto text-ink-dim">{g.items.length}</span>
                  </button>

                  {open && (
                    <ul className="mt-1 space-y-0.5">
                      {g.items.map(({ task, subtasks, subDone, subTotal }) => {
                        const day = shortDay(task.date, today)
                        const hasSubs = subTotal > 0
                        const taskOpen = hasSubs && !isCollapsed(task.id)
                        return (
                          <li key={task.id}>
                            <div className="flex items-center gap-1">
                              {hasSubs ? (
                                <button
                                  onClick={() => toggle(task.id)}
                                  aria-expanded={taskOpen}
                                  aria-label={`${taskOpen ? 'Plegar' : 'Desplegar'} subtareas de "${task.title}"`}
                                  className="w-4 shrink-0"
                                >
                                  <Arrow open={taskOpen} />
                                </button>
                              ) : (
                                <span className="w-4 shrink-0" />
                              )}
                              <button
                                onClick={() => onToggle(task.id)}
                                aria-label={`Marcar "${task.title}" como hecha`}
                                className="flex min-w-0 flex-1 items-center gap-1.5 py-0.5 text-left"
                              >
                                <span className="shrink-0 scale-75">
                                  <PixelCheckbox checked={false} />
                                </span>
                                <span className="min-w-0 flex-1 truncate text-[20px]" title={task.title}>
                                  {task.title}
                                </span>
                              </button>
                              {hasSubs && (
                                <span className="shrink-0 text-[17px] text-ink-dim">
                                  {subDone}/{subTotal}
                                </span>
                              )}
                              <span
                                className={`shrink-0 text-[17px] ${day.overdue ? 'text-berry' : 'text-ink-dim'}`}
                                title={day.overdue ? 'Atrasada' : undefined}
                              >
                                {day.overdue && '⚠ '}
                                {day.label}
                              </span>
                            </div>
                            {taskOpen && subtasks.length > 0 && (
                              <ul className="ml-[22px] border-l-2 border-dashed border-edge pl-2">
                                {subtasks.map((s) => (
                                  <li key={s.id}>
                                    <button
                                      onClick={() => onToggle(s.id)}
                                      aria-label={`Marcar "${s.title}" como hecha`}
                                      className="flex w-full min-w-0 items-center gap-1.5 text-left"
                                    >
                                      <span className="shrink-0 scale-[0.6]">
                                        <PixelCheckbox checked={false} />
                                      </span>
                                      <span
                                        className="min-w-0 flex-1 truncate text-[19px] text-ink-dim"
                                        title={s.title}
                                      >
                                        {s.title}
                                      </span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}

function Arrow({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <span aria-hidden className={`inline-block w-3 font-pixel text-[8px] ${className}`}>
      {open ? '▼' : '▶'}
    </span>
  )
}
