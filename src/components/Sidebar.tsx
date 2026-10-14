import { Home, Lock, Map, ScrollText, Swords, Trophy, X } from 'lucide-react'
import type { ReactNode } from 'react'

const ZONES = ['Base de operaciones', 'Ideas', 'Diario de campaña']

type Props = { open: boolean; onClose: () => void }

export function Sidebar({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 md:hidden ${open ? '' : 'hidden'}`}
        onClick={onClose}
        aria-hidden
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-line bg-panel transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="font-pixel text-sm text-neon-cyan text-glow">QUESTLOG</span>
          <button onClick={onClose} className="text-ink-dim hover:text-ink md:hidden" aria-label="Cerrar menú">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6 text-sm">
          <div className="space-y-1">
            <Item icon={<Home size={16} />} active>
              Inicio
            </Item>
            <Item icon={<Swords size={16} />}>Misiones</Item>
          </div>

          <Section title="Zonas">
            {ZONES.map((z) => (
              <Item key={z} icon={<Map size={16} />}>
                {z}
              </Item>
            ))}
          </Section>

          <Section title="Próximamente">
            <Item icon={<ScrollText size={16} />} locked>
              Quest Board
            </Item>
            <Item icon={<Trophy size={16} />} locked>
              Logros
            </Item>
          </Section>
        </nav>

        <div className="border-t border-line px-5 py-3 text-[11px] text-ink-dim">Fase 0 · versión local</div>
      </aside>
    </>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 px-2 font-pixel text-[9px] uppercase tracking-wider text-ink-dim">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}

function Item({
  icon,
  children,
  active,
  locked,
}: {
  icon: ReactNode
  children: ReactNode
  active?: boolean
  locked?: boolean
}) {
  return (
    <button
      disabled={locked}
      className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors ${
        active
          ? 'border border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan'
          : locked
            ? 'cursor-not-allowed text-ink-dim/60'
            : 'text-ink-dim hover:bg-panel-2 hover:text-ink'
      }`}
    >
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {locked && <Lock size={12} />}
    </button>
  )
}
