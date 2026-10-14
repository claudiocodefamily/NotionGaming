import { Flame, Menu } from 'lucide-react'
import { levelFromXp, streakMultiplier, titleForLevel } from '../game/xp'

type Props = { xp: number; streak: number; onMenu: () => void }

export function Hud({ xp, streak, onMenu }: Props) {
  const { level, current, needed } = levelFromXp(xp)
  const pct = Math.round((current / needed) * 100)

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-void/80 px-4 py-3 backdrop-blur md:px-6">
      <button
        onClick={onMenu}
        className="rounded-md p-2 text-ink-dim hover:bg-panel-2 hover:text-ink md:hidden"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </button>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neon-cyan/60 bg-panel font-pixel text-xs text-neon-cyan glow-cyan">
        {level}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
          <span className="truncate">
            <span className="font-pixel text-[10px] text-neon-cyan">NIVEL {level}</span>
            <span className="ml-2 text-ink-dim">{titleForLevel(level)}</span>
          </span>
          <span className="shrink-0 tabular-nums text-ink-dim">
            {current} / {needed} XP
          </span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full border border-line bg-panel"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemax={needed}
          aria-label="Experiencia"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-neon-pink transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div
        className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-panel px-2.5 py-1.5 text-sm"
        title={`Racha de ${streak} días · multiplicador x${streakMultiplier(streak)}`}
      >
        <Flame size={16} className={streak > 0 ? 'text-neon-amber' : 'text-ink-dim'} />
        <span className="tabular-nums">{streak}</span>
      </div>
    </header>
  )
}
