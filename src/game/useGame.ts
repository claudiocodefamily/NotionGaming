import { useCallback, useEffect, useState } from 'react'
import { levelFromXp, questReward, type Rarity } from './xp'
import { dayKey, nextStreak } from './streak'

export type Quest = { id: string; title: string; rarity: Rarity; done: boolean; rewarded?: boolean }

export type GameState = {
  xp: number
  streak: number
  lastActiveDay: string | null
  quests: Quest[]
}

export type Reward = { id: number; amount: number; levelUp: number | null }

const STORAGE_KEY = 'questlog:v1'

const STARTER_QUESTS: Quest[] = [
  { id: 'q1', title: 'Explora tu Base de operaciones', rarity: 'common', done: false },
  { id: 'q2', title: 'Escribe tu primera idea en una Zona', rarity: 'rare', done: false },
  { id: 'q3', title: 'Planifica tu semana como una campaña', rarity: 'epic', done: false },
  { id: 'q4', title: 'Termina ese proyecto que llevas posponiendo', rarity: 'legendary', done: false },
]

const INITIAL: GameState = { xp: 0, streak: 0, lastActiveDay: null, quests: STARTER_QUESTS }

function load(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL
  } catch {
    return INITIAL
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>(load)
  const [reward, setReward] = useState<Reward | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // sin almacenamiento (modo privado): la partida vive solo en memoria
    }
  }, [state])

  const toggleQuest = (id: string) => {
    const quest = state.quests.find((q) => q.id === id)
    if (!quest) return
    const quests = state.quests.map((q) => (q.id === id ? { ...q, done: !q.done } : q))
    if (quest.done) {
      // desmarcar no quita XP, y volver a marcarla no la da otra vez
      setState({ ...state, quests })
      return
    }
    const now = new Date()
    const streak = nextStreak(state.streak, state.lastActiveDay, now)
    const amount = quest.rewarded ? 0 : questReward(quest.rarity, streak)
    const before = levelFromXp(state.xp).level
    const after = levelFromXp(state.xp + amount).level
    if (amount > 0) setReward({ id: Date.now(), amount, levelUp: after > before ? after : null })
    setState({
      ...state,
      quests: quests.map((q) => (q.id === id ? { ...q, rewarded: true } : q)),
      xp: state.xp + amount,
      streak,
      lastActiveDay: dayKey(now),
    })
  }

  const addQuest = useCallback((title: string, rarity: Rarity) => {
    const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now())
    setState((s) => ({ ...s, quests: [...s.quests, { id, title, rarity, done: false }] }))
  }, [])

  const resetGame = useCallback(() => setState(INITIAL), [])
  const clearReward = useCallback(() => setReward(null), [])

  return { state, reward, clearReward, toggleQuest, addQuest, resetGame }
}
