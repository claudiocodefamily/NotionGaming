import { useState } from 'react'
import { WEEK_SAT, weekOf } from '../calendar/calendar'
import type { Category } from '../categories/categories'
import { parseDayKey } from '../tasks/dates'
import type { Task } from '../tasks/tasks'

const MAX_MARKS = 4
const NO_CATEGORY_COLOR = 'var(--color-ink-dim)'

type Props = {
  tasks: Task[]
  categories: Category[]
  today: string
  selected: string
  onSelect: (day: string) => void
}

/** Semana de sábado a viernes con los pendientes de cada día; elegir un día lo usa para la tarea nueva. */
export function WeekCalendar({ tasks, categories, today, selected, onSelect }: Props) {
  const [offset, setOffset] = useState(0)
  const base = parseDayKey(today)
  const days = weekOf(new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset * 7))
  const colorOf = new Map(categories.map((c) => [c.id, c.color]))
  const pendingOn = (day: string) => tasks.filter((t) => t.parentId === null && t.date === day && !t.done)
  const weekTotal = days.reduce((n, d) => n + pendingOn(d).length, 0)

  const fmt = (key: string) =>
    parseDayKey(key).toLocaleDateString('es', { day: 'numeric', month: 'short' }).replace('.', '')

  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <button
          onClick={() => setOffset((o) => o - 1)}
          className="pixel-btn px-2 py-1 text-[10px] text-river"
          aria-label="Semana anterior"
        >
          ◀
        </button>
        <div className="flex-1 text-center">
          <span className="text-ink">
            {fmt(days[0])} – {fmt(days[6])}
          </span>
          <span className="ml-2 hidden text-ink-dim sm:inline">· {weekTotal} pendientes</span>
        </div>
        {offset !== 0 && (
          <button onClick={() => setOffset(0)} className="pixel-btn px-2 py-1 text-[8px] text-sun">
            HOY
          </button>
        )}
        <button
          onClick={() => setOffset((o) => o + 1)}
          className="pixel-btn px-2 py-1 text-[10px] text-river"
          aria-label="Semana siguiente"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1" role="listbox" aria-label="Día de la tarea nueva">
        {days.map((day, i) => {
          const pending = pendingOn(day)
          const isToday = day === today
          const isSelected = day === selected
          const past = day < today
          return (
            <button
              key={day}
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(day)}
              aria-label={`${WEEK_SAT[i]} ${fmt(day)}, ${pending.length} pendientes`}
              className={`flex min-h-[78px] flex-col items-center border-2 px-0.5 py-1 transition-colors ${
                isSelected ? 'border-sun bg-sun/10' : 'border-edge bg-soil hover:border-ink-dim'
              } ${past ? 'opacity-60' : ''}`}
            >
              <span className={`text-[17px] leading-none ${isToday ? 'text-leaf' : 'text-ink-dim'}`}>
                {WEEK_SAT[i]}
              </span>
              <span className={`font-pixel text-[11px] leading-6 ${isToday ? 'text-leaf' : 'text-ink'}`}>
                {parseDayKey(day).getDate()}
              </span>
              <span className="mt-auto flex flex-wrap justify-center gap-0.5">
                {pending.slice(0, MAX_MARKS).map((t) => (
                  <span
                    key={t.id}
                    className="h-1.5 w-1.5"
                    style={{ background: (t.categoryId && colorOf.get(t.categoryId)) || NO_CATEGORY_COLOR }}
                  />
                ))}
              </span>
              {pending.length > 0 && <span className="text-[16px] leading-none text-ink-dim">{pending.length}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
