import { useState } from 'react'
import { formatMonth, monthGrid, tasksByDay, WEEKDAYS, type CategoryFilter } from '../calendar/calendar'
import type { Category } from '../categories/categories'
import { formatLongDate, parseDayKey } from '../tasks/dates'
import { tasksForDay, type Task } from '../tasks/tasks'
import { AddTaskForm } from './AddTaskForm'
import { FilterBar } from './FilterBar'
import { TaskList } from './TaskList'

const MAX_MARKS = 3
const NO_CATEGORY_COLOR = 'var(--color-ink-dim)'

type Props = {
  tasks: Task[]
  categories: Category[]
  today: string
  onAdd: (title: string, date: string, categoryId: string | null) => void
  onAddSubtask: (parentId: string, title: string) => void
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function CalendarPanel({ tasks, categories, today, onAdd, onAddSubtask, onToggle, onDelete }: Props) {
  const todayDate = parseDayKey(today)
  const [view, setView] = useState({ year: todayDate.getFullYear(), month: todayDate.getMonth() })
  const [selected, setSelected] = useState(today)
  const [rawFilter, setFilter] = useState<CategoryFilter>('all')
  // si se elimina la clasificación filtrada, se vuelve a "Todas"
  const filter =
    rawFilter === 'all' || rawFilter === 'none' || categories.some((c) => c.id === rawFilter) ? rawFilter : 'all'

  const byDay = tasksByDay(tasks, filter)
  const colorOf = new Map(categories.map((c) => [c.id, c.color]))
  const grid = monthGrid(view.year, view.month)
  const selectedTasks = tasksForDay(byDay.get(selected) ?? [], selected)

  const shiftMonth = (delta: number) => {
    const d = new Date(view.year, view.month + delta, 1)
    setView({ year: d.getFullYear(), month: d.getMonth() })
  }
  const goToday = () => {
    setView({ year: todayDate.getFullYear(), month: todayDate.getMonth() })
    setSelected(today)
  }
  const selectDay = (key: string) => {
    setSelected(key)
    const d = parseDayKey(key)
    if (d.getMonth() !== view.month) setView({ year: d.getFullYear(), month: d.getMonth() })
  }

  return (
    <section
      id="panel-calendario"
      role="tabpanel"
      aria-labelledby="tab-calendario"
      className="pixel-panel p-4 sm:p-6"
      style={{ ['--panel-color' as string]: 'var(--color-river)' }}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          onClick={() => shiftMonth(-1)}
          className="pixel-btn px-3 py-2 text-[11px] text-river"
          aria-label="Mes anterior"
        >
          ◀
        </button>
        <h2 className="text-center font-pixel text-[11px] leading-relaxed text-river sm:text-sm">
          {formatMonth(view.year, view.month).toUpperCase()}
        </h2>
        <div className="flex gap-2">
          <button onClick={goToday} className="pixel-btn hidden px-3 py-2 text-[10px] text-sun sm:block">
            HOY
          </button>
          <button
            onClick={() => shiftMonth(1)}
            className="pixel-btn px-3 py-2 text-[11px] text-river"
            aria-label="Mes siguiente"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="mb-4">
        <FilterBar categories={categories} value={filter} onChange={setFilter} />
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5" role="grid" aria-label="Calendario">
        {WEEKDAYS.map((w) => (
          <div key={w} className="pb-1 text-center font-pixel text-[9px] text-ink-dim">
            {w}
          </div>
        ))}
        {grid.map((d) => {
          const dayTasks = byDay.get(d.key) ?? []
          const isToday = d.key === today
          const isSelected = d.key === selected
          const pending = dayTasks.filter((t) => !t.done).length
          return (
            <button
              key={d.key}
              onClick={() => selectDay(d.key)}
              aria-pressed={isSelected}
              aria-label={`${formatLongDate(parseDayKey(d.key))}: ${dayTasks.length} tareas`}
              className={`flex aspect-square flex-col items-start justify-between border-2 p-1 text-left transition-colors sm:aspect-[5/4] sm:p-1.5 ${
                isSelected
                  ? 'border-river bg-river/15'
                  : isToday
                    ? 'border-sun bg-panel-2'
                    : 'border-edge bg-panel-2 hover:border-ink-dim'
              } ${d.inMonth ? '' : 'opacity-40'}`}
            >
              <span className={`text-[18px] leading-none ${isToday ? 'text-sun' : ''}`}>{d.day}</span>
              {dayTasks.length > 0 && (
                <span className="flex w-full flex-nowrap items-center gap-0.5 overflow-hidden">
                  {dayTasks.slice(0, MAX_MARKS).map((t) => (
                    <span
                      key={t.id}
                      className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${t.done ? 'opacity-35' : ''}`}
                      style={{ background: (t.categoryId && colorOf.get(t.categoryId)) || NO_CATEGORY_COLOR }}
                    />
                  ))}
                  {dayTasks.length > MAX_MARKS && (
                    <span className="hidden text-[14px] leading-none text-ink-dim sm:inline">
                      +{dayTasks.length - MAX_MARKS}
                    </span>
                  )}
                  {pending === 0 && <span className="sr-only">todas completadas</span>}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 border-t-2 border-dashed border-edge pt-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="inline-block font-pixel text-[11px] text-sun first-letter:uppercase">
            {formatLongDate(parseDayKey(selected)).toUpperCase()}
          </h3>
          {selected !== today && (
            <button onClick={goToday} className="text-ink-dim underline-offset-4 hover:text-ink hover:underline">
              Volver a hoy
            </button>
          )}
        </div>
        <div className="mb-4">
          <AddTaskForm
            // al filtrar por una clasificación, las tareas nuevas la usan por defecto
            key={filter}
            categories={categories}
            initialCategoryId={filter === 'all' || filter === 'none' ? null : filter}
            onAdd={(title, categoryId) => onAdd(title, selected, categoryId)}
          />
        </div>
        <TaskList
          tasks={selectedTasks}
          allTasks={tasks}
          categories={categories}
          onAddSubtask={onAddSubtask}
          onToggle={onToggle}
          onDelete={onDelete}
          emptyMessage={filter === 'all' ? 'No hay tareas este día.' : 'No hay tareas de esta clasificación este día.'}
        />
      </div>
    </section>
  )
}
