import { Check, Plus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import type { Quest } from '../game/useGame'
import { RARITIES, type Rarity } from '../game/xp'

const RARITY_STYLE: Record<Rarity, string> = {
  common: 'text-ink-dim border-line',
  rare: 'text-neon-cyan border-neon-cyan/50',
  epic: 'text-neon-pink border-neon-pink/50',
  legendary: 'text-neon-amber border-neon-amber/60',
}

type Props = {
  quests: Quest[]
  onToggle: (id: string) => void
  onAdd: (title: string, rarity: Rarity) => void
}

export function QuestList({ quests, onToggle, onAdd }: Props) {
  const [title, setTitle] = useState('')
  const [rarity, setRarity] = useState<Rarity>('common')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    onAdd(t, rarity)
    setTitle('')
  }

  return (
    <div className="space-y-2">
      {quests.map((q) => (
        <button
          key={q.id}
          onClick={() => onToggle(q.id)}
          className={`group flex w-full items-center gap-3 rounded-lg border bg-panel px-3 py-2.5 text-left transition hover:bg-panel-2 ${
            q.done ? 'border-line opacity-60' : 'border-line hover:border-neon-cyan/40'
          }`}
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
              q.done ? 'border-neon-lime bg-neon-lime/20 text-neon-lime' : 'border-ink-dim/50 group-hover:border-neon-cyan'
            }`}
          >
            {q.done && <Check size={14} strokeWidth={3} />}
          </span>
          <span className={`flex-1 text-sm ${q.done ? 'line-through' : ''}`}>{q.title}</span>
          <span className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${RARITY_STYLE[q.rarity]}`}>
            {RARITIES[q.rarity].label} · {RARITIES[q.rarity].xp} XP
          </span>
        </button>
      ))}

      <form onSubmit={submit} className="flex flex-col gap-2 pt-2 sm:flex-row">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nueva misión..."
          className="min-w-0 flex-1 rounded-lg border border-line bg-panel px-3 py-2 text-sm outline-none placeholder:text-ink-dim/70 focus:border-neon-cyan/60"
        />
        <div className="flex gap-2">
          <select
            value={rarity}
            onChange={(e) => setRarity(e.target.value as Rarity)}
            className="flex-1 rounded-lg border border-line bg-panel px-2 py-2 text-sm outline-none focus:border-neon-cyan/60"
            aria-label="Rareza"
          >
            {(Object.keys(RARITIES) as Rarity[]).map((r) => (
              <option key={r} value={r}>
                {RARITIES[r].label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="flex items-center gap-1 rounded-lg border border-neon-cyan/60 bg-neon-cyan/10 px-3 py-2 text-sm font-medium text-neon-cyan hover:bg-neon-cyan/20"
          >
            <Plus size={16} /> Añadir
          </button>
        </div>
      </form>
    </div>
  )
}
