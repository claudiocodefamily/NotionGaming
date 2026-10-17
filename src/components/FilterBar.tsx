import type { CategoryFilter } from '../calendar/calendar'
import type { Category } from '../categories/categories'

type Props = {
  categories: Category[]
  value: CategoryFilter
  onChange: (filter: CategoryFilter) => void
}

/** Chips para filtrar por clasificación: todas, sin clasificación o una concreta. */
export function FilterBar({ categories, value, onChange }: Props) {
  const options: { id: CategoryFilter; label: string; icon?: string; color: string }[] = [
    { id: 'all', label: 'Todas', color: 'var(--color-ink)' },
    ...categories.map((c) => ({ id: c.id, label: c.name, icon: c.icon, color: c.color })),
    { id: 'none', label: 'Sin clasificación', color: 'var(--color-ink-dim)' },
  ]

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Filtrar por clasificación">
      {options.map((o) => {
        const selected = value === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            className={`flex items-center gap-1 border-2 px-2 py-0.5 text-[18px] transition-colors ${
              selected ? '' : 'border-edge text-ink-dim hover:text-ink'
            }`}
            style={selected ? { borderColor: o.color, color: o.color, background: 'var(--color-panel-2)' } : undefined}
          >
            {o.icon && <span aria-hidden>{o.icon}</span>}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
