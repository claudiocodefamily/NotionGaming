import type { Category } from '../categories/categories'

type Props = {
  categories: Category[]
  value: string | null
  onChange: (id: string | null) => void
}

/** Fila de chips para elegir la clasificación de una tarea nueva. */
export function CategoryPicker({ categories, value, onChange }: Props) {
  const chip = (selected: boolean) =>
    `flex items-center gap-1 border-2 px-2 py-0.5 text-[18px] transition-colors ${
      selected ? '' : 'border-edge text-ink-dim hover:text-ink'
    }`

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Clasificación">
      <button
        type="button"
        role="radio"
        aria-checked={value === null}
        onClick={() => onChange(null)}
        className={chip(value === null)}
        style={value === null ? { borderColor: 'var(--color-ink-dim)', color: 'var(--color-ink)' } : undefined}
      >
        Sin clasificación
      </button>
      {categories.map((c) => {
        const selected = value === c.id
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(c.id)}
            className={chip(selected)}
            style={selected ? { borderColor: c.color, color: c.color, background: `${c.color}22` } : undefined}
          >
            <span aria-hidden>{c.icon}</span>
            {c.name}
          </button>
        )
      })}
    </div>
  )
}
