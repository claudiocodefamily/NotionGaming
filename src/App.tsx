import { AddTaskForm } from './components/AddTaskForm'
import { TaskList } from './components/TaskList'
import { dayKey, formatLongDate } from './tasks/dates'
import { tasksForDay } from './tasks/tasks'
import { useTasks } from './tasks/useTasks'
import { useToday } from './tasks/useToday'

export default function App() {
  const { tasks, add, toggle, remove } = useTasks()
  const now = useToday()
  const today = dayKey(now)
  const todays = tasksForDay(tasks, today)
  const done = todays.filter((t) => t.done).length
  const pct = todays.length ? Math.round((done / todays.length) * 100) : 0

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="title-shadow font-pixel text-2xl leading-snug text-leaf sm:text-3xl">NOTION GAMING</h1>
        <p className="mt-3 font-pixel text-[10px] tracking-wider text-sun">TU DIA ES UNA AVENTURA</p>
      </header>

      <section className="pixel-panel p-4 sm:p-6" style={{ ['--panel-color' as string]: 'var(--color-moss)' }}>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-pixel text-sm text-river">TAREAS DE HOY</h2>
          <span className="inline-block text-ink-dim first-letter:uppercase">{formatLongDate(now)}</span>
        </div>

        <div className="mb-5">
          <div className="mb-1 flex justify-between text-ink-dim">
            <span>Progreso</span>
            <span>
              {done}/{todays.length}
            </span>
          </div>
          <div
            className="h-5 border-2 border-edge bg-soil p-0.5"
            role="progressbar"
            aria-valuenow={done}
            aria-valuemax={todays.length}
            aria-label="Tareas completadas hoy"
          >
            <div className="pixel-bar h-full bg-leaf transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="mb-5">
          <AddTaskForm onAdd={(title) => add(title, today)} />
        </div>

        <TaskList tasks={todays} onToggle={toggle} onDelete={remove} />
      </section>
    </div>
  )
}
