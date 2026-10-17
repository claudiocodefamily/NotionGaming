import { useCategories } from './categories/useCategories'
import { CalendarPanel } from './components/CalendarPanel'
import { CategoriesPanel } from './components/CategoriesPanel'
import { NewTaskPanel } from './components/NewTaskPanel'
import { Tabs, type TabItem } from './components/Tabs'
import { TaskColumn } from './components/TaskColumn'
import { dayKey } from './tasks/dates'
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
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
            <div className="border-b-2 border-dashed border-edge pb-6 lg:border-r-2 lg:border-b-0 lg:pr-6 lg:pb-0">
              <TaskColumn
                tasks={tasks}
                categories={categories.categories}
                today={today}
                onToggle={toggle}
                onDelete={remove}
                onAddSubtask={addSubtask}
                onSchedule={schedule}
              />
            </div>
            <NewTaskPanel tasks={tasks} categories={categories.categories} today={today} onAdd={add} />
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
