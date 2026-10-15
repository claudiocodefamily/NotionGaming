import { useState, type FormEvent } from 'react'
import { CATEGORY_COLORS, CATEGORY_ICONS, nameTaken, type Category } from '../categories/categories'

type Props = {
  categories: Category[]
  onAdd: (name: string, color: string, icon: string) => void
  onDelete: (category: Category) => void
}

export function CategoriesPanel({ categories, onAdd, onDelete }: Props) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(CATEGORY_COLORS[0])
  const [icon, setIcon] = useState(CATEGORY_ICONS[0])
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    if (nameTaken(categories, name)) {
      setError('Ya existe una clasificación con ese nombre.')
      return
    }
    onAdd(name, color, icon)
    setName('')
    setError(null)
  }

  return (
    <section
      id="panel-clasificaciones"
      role="tabpanel"
      aria-labelledby="tab-clasificaciones"
      className="pixel-panel p-4 sm:p-6"
      style={{ ['--panel-color' as string]: 'var(--color-sun)' }}
    >
      <h2 className="mb-4 font-pixel text-sm text-sun">CLASIFICACIONES</h2>

      {categories.length === 0 ? (
        <p className="mb-5 text-ink-dim">Aún no tienes clasificaciones.</p>
      ) : (
        <ul className="mb-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-1.5 border-2 py-0.5 pr-1 pl-2"
              style={{ borderColor: c.color, color: c.color, background: `${c.color}1a` }}
            >
              <span aria-hidden>{c.icon}</span>
              {c.name}
              <button
                onClick={() => onDelete(c)}
                className="ml-1 px-1 font-pixel text-[10px] text-ink-dim hover:text-berry"
                aria-label={`Eliminar clasificación ${c.name}`}
                title="Eliminar"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="space-y-3 border-t-2 border-dashed border-edge pt-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError(null)
            }}
            placeholder="Nueva clasificación..."
            maxLength={24}
            className="min-w-0 flex-1 border-2 border-edge bg-soil px-3 py-2 text-ink outline-none placeholder:text-ink-dim/60 focus:border-sun"
            aria-label="Nombre de la nueva clasificación"
          />
          <button type="submit" className="pixel-btn bg-sun/10 px-4 py-3 text-[11px] text-sun hover:bg-sun/20">
            + CREAR
          </button>
        </div>
        {error && <p className="text-berry">{error}</p>}

        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Color">
          <span className="w-14 text-ink-dim">Color</span>
          {CATEGORY_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              aria-label={`Color ${c}`}
              onClick={() => setColor(c)}
              className={`h-7 w-7 border-2 ${color === c ? 'border-ink' : 'border-soil'}`}
              style={{ background: c, boxShadow: color === c ? `0 0 0 2px ${c}` : undefined }}
            />
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Icono">
          <span className="w-14 text-ink-dim">Icono</span>
          {CATEGORY_ICONS.map((i) => (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={icon === i}
              onClick={() => setIcon(i)}
              className={`flex h-8 w-8 items-center justify-center border-2 text-lg ${
                icon === i ? 'border-sun bg-sun/15' : 'border-edge hover:border-ink-dim'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </form>
    </section>
  )
}
