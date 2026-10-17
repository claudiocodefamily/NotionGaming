import { useCategories } from './categories/useCategories'
import { AddTaskForm } from './components/AddTaskForm'
import { CalendarPanel } from './components/CalendarPanel'
import { CategoriesPanel } from './components/CategoriesPanel'
import { PendingColumn } from './components/PendingColumn'
import { Tabs, type TabItem } from './components/Tabs'
import { TaskList } from './components/TaskList'
import { dayKey, formatLongDate } from './tasks/dates'
import { sideQuests, tasksForDay } from './tasks/tasks'
import { useTasks } from './tasks/useTasks'
import { useToday } from './tasks/useToday'
import { useStoredTab } from './useStoredTab'

type Tab = 'tareas' | 'calendario' | 'clasificaciones'

const TABS: TabItem<Tab>[] = [
  { id: 'tareas', label: 'TAREAS', icon: '📋', color: 'var(--color-moss)' },
  { id: 'calendario', label: 'CALENDARIO', icon: '📅', color: 'var(--color-river)' },
  { id: 'clasificaciones', label: 'CLASIFICACIONES', icon: '🏷️', color: 'var(--color-sun)' },
]

export default function App() {
  const { tasks, add, addSubtask, schedule, toggle, remove, clearCategory } = useTasks()
  const categories = useCategories()
  const now = useToday()
  const today = dayKey(now)
  const todays = tasksForDay(tasks, today)
  const done = todays.filter((t) => t.done).length
  const quests = sideQuests(tasks)
  const pct = todays.length ? Math.round((done / todays.length) * 100) : 0
  const [tab, setTab] = useStoredTab<Tab>(['tareas', 'calendario', 'clasificaciones'], 'tareas')

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <header className="mb-8 text-center">
        <h1 className="title-shadow font-pixel text-2xl leading-snug text-leaf sm:text-3xl">NOTION GAMING</h1>
        <p className="mt-3 font-pixel text-[10px] tracking-wider text-sun">TU DIA ES UNA AVENTURA</p>
      </header>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'tareas' && (
        <section
          id="panel-tareas"
          role="tabpanel"
          aria-labelledby="tab-tareas"
          className="pixel-panel p-4 sm:p-6"
          style={{ ['--panel-color' as string]: 'var(--color-moss)' }}
        >
          <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
            <div className="border-b-2 border-dashed border-edge pb-4 lg:border-r-2 lg:border-b-0 lg:pr-6 lg:pb-0">
              <PendingColumn tasks={tasks} categories={categories.categories} today={today} onToggle={toggle} />
            </div>
            <div>
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
                  <div
                    className="pixel-bar h-full bg-leaf transition-[width] duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="mb-5">
                <AddTaskForm
                  categories={categories.categories}
                  onAdd={(title, categoryId) => add(title, today, categoryId)}
                />
              </div>

              <TaskList
                tasks={todays}
                allTasks={tasks}
                categories={categories.categories}
                onToggle={toggle}
                onDelete={remove}
                onAddSubtask={addSubtask}
                move={{ icon: '🗡️', label: 'Pasar a misiones secundarias', onMove: (id) => schedule(id, null) }}
              />

              <div className="mt-8 border-t-2 border-dashed border-edge pt-6">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-pixel text-sm text-sun">🗡️ MISIONES SECUNDARIAS</h2>
                  <span className="text-ink-dim">Sin fecha · 📅 la pasa a hoy</span>
                </div>
                <div className="mb-5">
                  <AddTaskForm
                    categories={categories.categories}
                    onAdd={(title, categoryId) => add(title, null, categoryId)}
                    placeholder="Nueva misión..."
                  />
                </div>
                <TaskList
                  tasks={quests}
                  allTasks={tasks}
                  categories={categories.categories}
                  onToggle={toggle}
                  onDelete={remove}
                  onAddSubtask={addSubtask}
                  move={{ icon: '📅', label: 'Pasar a hoy', onMove: (id) => schedule(id, today) }}
                  emptyMessage={'Sin misiones secundarias.\nApunta aquí lo que harás algún día.'}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {tab === 'calendario' && (
        <CalendarPanel
          tasks={tasks}
          categories={categories.categories}
          today={today}
          onAdd={add}
          onAddSubtask={addSubtask}
          onToggle={toggle}
          onDelete={remove}
        />
      )}

      {tab === 'clasificaciones' && (
        <CategoriesPanel
          categories={categories.categories}
          onAdd={categories.add}
          onDelete={(c) => {
            if (!confirm(`¿Eliminar la clasificación "${c.name}"? Sus tareas quedarán sin clasificación.`)) return
            categories.remove(c.id)
            clearCategory(c.id)
          }}
        />
      )}
    </div>
  )
}
