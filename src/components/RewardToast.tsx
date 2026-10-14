import { useEffect } from 'react'
import type { Reward } from '../game/useGame'

export function RewardToast({ reward, onDone }: { reward: Reward | null; onDone: () => void }) {
  useEffect(() => {
    if (!reward) return
    const t = setTimeout(onDone, reward.levelUp ? 2700 : 1700)
    return () => clearTimeout(t)
  }, [reward, onDone])

  if (!reward) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center" aria-live="polite">
      {reward.levelUp ? (
        <div key={reward.id} className="animate-level-pop rounded-2xl border border-neon-pink/60 bg-void/90 px-10 py-8 text-center shadow-[0_0_40px_rgb(232_121_249/0.4)]">
          <div className="font-pixel text-lg text-neon-pink text-glow">¡LEVEL UP!</div>
          <div className="mt-3 text-sm text-ink-dim">Ahora eres nivel</div>
          <div className="font-pixel text-3xl text-neon-cyan text-glow">{reward.levelUp}</div>
        </div>
      ) : (
        <div key={reward.id} className="animate-float-up font-pixel text-xl text-neon-lime text-glow">
          +{reward.amount} XP
        </div>
      )}
    </div>
  )
}
