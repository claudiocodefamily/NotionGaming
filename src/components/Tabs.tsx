export type TabItem<T extends string> = { id: T; label: string; icon: string; color: string }

type Props<T extends string> = {
  tabs: TabItem<T>[]
  active: T
  onChange: (id: T) => void
}

/** Pestañas tipo menú de videojuego, pegadas al panel que muestran. */
export function Tabs<T extends string>({ tabs, active, onChange }: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label="Secciones"
      className="relative z-10 -mb-[6px] flex items-end gap-2 overflow-x-auto px-1"
    >
      {tabs.map((t) => {
        const selected = t.id === active
        return (
          <button
            key={t.id}
            id={`tab-${t.id}`}
            role="tab"
            aria-selected={selected}
            aria-label={t.label}
            aria-controls={`panel-${t.id}`}
            onClick={() => onChange(t.id)}
            className={`flex shrink-0 items-center gap-2 border-3 border-b-0 px-3 py-2.5 font-pixel text-[10px] transition-colors sm:px-4 sm:text-[11px] ${
              selected ? 'bg-panel pb-[16px]' : 'mb-[6px] border-edge bg-soil text-ink-dim hover:text-ink'
            }`}
            style={selected ? { borderColor: t.color, color: t.color } : undefined}
          >
            <span aria-hidden className="text-base leading-none">
              {t.icon}
            </span>
            {/* en móvil las pestañas no activas muestran solo el icono para que quepan */}
            <span className={selected ? '' : 'hidden sm:inline'}>{t.label}</span>
          </button>
        )
      })}
    </div>
  )
}
