import { useState } from 'react'
import type { Category } from '../categories/categories'
import { parseDayKey } from '../tasks/dates'
import type { Task } from '../tasks/tasks'
import { AddTaskForm } from './AddTaskForm'
import { WeekCalendar } from './WeekCalendar'

type Kind = 'principal' | 'secundaria'

type Props = {
  tasks: Task[]
  categories: Category[]
  today: string
  onAdd: (title: string, date: string | null, categoryId: string | null) => void
}

/** Zona para crear tareas: principales (con día elegido en la semana) o misiones secundarias. */
export function NewTaskPanel({ tasks, categories, today, onAdd }: Props) {
  const [kind, setKind] = useState<Kind>('principal')
  const [day, setDay] = useState(today)
  const dayLabel = parseDayKey(day).toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })

  const kindBtn = (k: Kind, icon: string, label: string, color: string) => (
    <button
      type="button"
      role="radio"
      aria-checked={kind === k}
      onClick={() => setKind(k)}
      className={`flex-1 border-2 px-2 py-2 font-pixel text-[9px] ${kind === k ? '' : 'border-edge text-ink-dim hover:text-ink'}`}
      style={
        kind === k
          ? { borderColor: color, color, background: `color-mix(in srgb, ${color} 12%, transparent)` }
          : undefined
      }
    >
      <span aria-hidden className="mr-1.5 font-sans text-[15px]">
        {icon}
      </span>
      {label}
    </button>
  )

  return (
    <div className="space-y-6">
      <section aria-labelledby="semana">
        <h2 id="semana" className="mb-3 font-pixel text-[11px] text-river">
          SEMANA
        </h2>
        <WeekCalendar
          tasks={tasks}
          categories={categories}
          today={today}
          selected={day}
          onSelect={(d) => {
            setDay(d)
            setKind('principal')
          }}
        />
      </section>

      <section aria-labelledby="nueva-tarea">
        <h2 id="nueva-tarea" className="mb-3 font-pixel text-[11px] text-sun">
          NUEVA TAREA
        </h2>
        <div className="mb-3 flex gap-2" role="radiogroup" aria-label="Tipo de tarea">
          {kindBtn('principal', '⚔️', 'PRINCIPAL', 'var(--color-leaf)')}
          {kindBtn('secundaria', '🗡️', 'SECUNDARIA', 'var(--color-sun)')}
        </div>
        <p className="mb-3 text-ink-dim">
          {kind === 'principal' ? (
            <>
              Para el <span className="text-ink">{day === today ? `día de hoy (${dayLabel})` : dayLabel}</span>. Elige
              otro día en la semana.
            </>
          ) : (
            'Sin fecha: irá a misiones secundarias.'
          )}
        </p>
        <AddTaskForm
          categories={categories}
          onAdd={(title, categoryId) => onAdd(title, kind === 'principal' ? day : null, categoryId)}
          placeholder={kind === 'principal' ? 'Nueva tarea...' : 'Nueva misión...'}
        />
      </section>
    </div>
  )
}
