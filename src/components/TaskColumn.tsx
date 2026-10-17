import type { ReactNode } from 'react'
import type { Category } from '../categories/categories'
import { formatLongDate, parseDayKey } from '../tasks/dates'
import { dayTasks, groupByCategory, itemOf, shortDay, upcomingByDay, type TaskItem } from '../tasks/pending'
import { sideQuests, type Task } from '../tasks/tasks'
import { useCollapsed } from '../useCollapsed'
import { Arrow, TaskRow, type MoveAction } from './TaskRow'

const NONE = '__none'

type Props = {
  tasks: Task[]
  categories: Category[]
  today: string
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onAddSubtask: (parentId: string, title: string) => void
  onSchedule: (id: string, date: string | null) => void
}

/** Columna principal: pendientes del día, próximos pendientes y misiones secundarias. */
export function TaskColumn({ tasks, categories, today, onSchedule, ...actions }: Props) {
  const { isCollapsed, toggle } = useCollapsed()
  const byId = new Map(categories.map((c) => [c.id, c]))

  const todays = dayTasks(tasks, today)
  const todayDone = todays.filter((t) => t.done).length
  const byCategory = groupByCategory(tasks, todays, categories)
  const upcoming = upcomingByDay(tasks, today)
  const upcomingCount = upcoming.reduce((n, d) => n + d.items.filter((i) => !i.task.done).length, 0)
  const quests = sideQuests(tasks).map((t) => itemOf(tasks, t))

  const toQuest: MoveAction = {
    icon: '🗡️',
    label: 'Pasar a misiones secundarias',
    onMove: (id) => onSchedule(id, null),
  }
  const toToday: MoveAction = { icon: '📅', label: 'Pasar a hoy', onMove: (id) => onSchedule(id, today) }

  const row = (item: TaskItem, extra: { category?: Category; showOverdue?: boolean; move: MoveAction }) => (
    <TaskRow
      key={item.task.id}
      item={item}
      today={today}
      open={!isCollapsed(item.task.id)}
      onToggleOpen={() => toggle(item.task.id)}
      {...actions}
      {...extra}
    />
  )

  return (
    <aside aria-label="Tus tareas" className="space-y-6">
      <Section
        id="__dia"
        title="PENDIENTES DEL DIA"
        color="var(--color-leaf)"
        count={`${todayDone}/${todays.length}`}
        open={!isCollapsed('__dia')}
        onToggle={() => toggle('__dia')}
      >
        <p className="mb-2 inline-block text-ink-dim first-letter:uppercase">{formatLongDate(parseDayKey(today))}</p>
        <div
          className="mb-3 h-4 border-2 border-edge bg-soil p-0.5"
          role="progressbar"
          aria-valuenow={todayDone}
          aria-valuemax={todays.length}
          aria-label="Tareas del día completadas"
        >
          <div
            className="pixel-bar h-full bg-leaf transition-[width] duration-300"
            style={{ width: `${todays.length ? Math.round((todayDone / todays.length) * 100) : 0}%` }}
          />
        </div>
        {byCategory.length === 0 ? (
          <p className="py-2 text-ink-dim">Nada para hoy. ¡Crea una tarea! ⚔️</p>
        ) : (
          <ul className="space-y-3">
            {byCategory.map((g) => {
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
                    <span className="ml-auto text-ink-dim">{g.items.filter((i) => !i.task.done).length}</span>
                  </button>
                  {open && (
                    <ul className="mt-1 space-y-0.5">
                      {g.items.map((item) => row(item, { showOverdue: true, move: toQuest }))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Section>

      <Section
        id="__proximos"
        title="PROXIMOS PENDIENTES"
        color="var(--color-river)"
        count={String(upcomingCount)}
        open={!isCollapsed('__proximos')}
        onToggle={() => toggle('__proximos')}
      >
        {upcoming.length === 0 ? (
          <p className="py-2 text-ink-dim">Sin tareas en los próximos días.</p>
        ) : (
          <ul className="space-y-3">
            {upcoming.map((d) => {
              const did = `day:${d.date}`
              const open = !isCollapsed(did)
              const date = parseDayKey(d.date)
              const weekday = date.toLocaleDateString('es', { weekday: 'long' })
              return (
                <li key={d.date}>
                  <button
                    onClick={() => toggle(did)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-2 border-b-2 border-edge pb-1 text-left text-river"
                  >
                    <Arrow open={open} />
                    <span className="inline-block first-letter:uppercase">
                      {weekday} · {shortDay(d.date, today).label}
                    </span>
                    <span className="ml-auto text-ink-dim">{d.items.filter((i) => !i.task.done).length}</span>
                  </button>
                  {open && (
                    <ul className="mt-1 space-y-0.5">
                      {d.items.map((item) =>
                        row(item, {
                          category: item.task.categoryId ? byId.get(item.task.categoryId) : undefined,
                          move: toToday,
                        }),
                      )}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </Section>

      <Section
        id="__misiones"
        title="MISIONES SECUNDARIAS"
        color="var(--color-sun)"
        count={String(quests.filter((i) => !i.task.done).length)}
        open={!isCollapsed('__misiones')}
        onToggle={() => toggle('__misiones')}
      >
        {quests.length === 0 ? (
          <p className="py-2 text-ink-dim">Sin misiones. Apunta aquí lo que harás algún día.</p>
        ) : (
          <ul className="space-y-0.5">
            {quests.map((item) =>
              row(item, {
                category: item.task.categoryId ? byId.get(item.task.categoryId) : undefined,
                move: toToday,
              }),
            )}
          </ul>
        )}
      </Section>
    </aside>
  )
}

type SectionProps = {
  id: string
  title: string
  color: string
  count: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}

function Section({ id, title, color, count, open, onToggle, children }: SectionProps) {
  return (
    <section aria-labelledby={id}>
      <button
        id={id}
        onClick={onToggle}
        aria-expanded={open}
        className="mb-3 flex w-full items-center gap-2 text-left"
        style={{ color }}
      >
        <Arrow open={open} />
        <h2 className="font-pixel text-[11px]">{title}</h2>
        <span className="ml-auto text-ink-dim">{count}</span>
      </button>
      {open && children}
    </section>
  )
}
