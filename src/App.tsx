import { useState } from 'react'
import { Hud } from './components/Hud'
import { QuestList } from './components/QuestList'
import { RewardToast } from './components/RewardToast'
import { Sidebar } from './components/Sidebar'
import { useGame } from './game/useGame'

export default function App() {
  const { state, reward, clearReward, toggleQuest, addQuest, resetGame } = useGame()
  const [menuOpen, setMenuOpen] = useState(false)

  const pending = state.quests.filter((q) => !q.done).length

  return (
    <div className="relative flex h-full">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <Hud xp={state.xp} streak={state.streak} onMenu={() => setMenuOpen(true)} />

        <main className="mx-auto w-full max-w-3xl px-4 py-8 md:px-8 md:py-12">
          <div className="mb-2 text-4xl">🛰️</div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Base de operaciones</h1>
          <p className="mb-10 text-ink-dim">
            Bienvenido, jugador. Aquí empieza tu aventura: completa misiones para ganar XP y subir de nivel. Pronto
            podrás crear tus propias Zonas con un editor de bloques como en Notion.
          </p>

          <section>
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-pixel text-xs text-neon-cyan">MISIONES ACTIVAS</h2>
              <span className="text-xs text-ink-dim">{pending} pendientes</span>
            </div>
            <QuestList quests={state.quests} onToggle={toggleQuest} onAdd={addQuest} />
          </section>

          <button
            onClick={() => {
              if (confirm('¿Reiniciar la partida? Perderás tu XP y misiones.')) resetGame()
            }}
            className="mt-12 text-xs text-ink-dim/70 underline-offset-4 hover:text-ink-dim hover:underline"
          >
            Reiniciar partida
          </button>
        </main>
      </div>

      <RewardToast reward={reward} onDone={clearReward} />
    </div>
  )
}
