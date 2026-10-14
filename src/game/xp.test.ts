import { describe, expect, it } from 'vitest'
import { levelFromXp, questReward, streakMultiplier, xpToNextLevel } from './xp'

describe('levelFromXp', () => {
  it('empieza en nivel 1', () => {
    expect(levelFromXp(0)).toEqual({ level: 1, current: 0, needed: 100 })
  })

  it('sube de nivel al llegar justo al umbral', () => {
    expect(levelFromXp(100)).toEqual({ level: 2, current: 0, needed: 150 })
  })

  it('acumula varios niveles', () => {
    // 100 + 150 + 200 = 450 para llegar a nivel 4
    expect(levelFromXp(470)).toEqual({ level: 4, current: 20, needed: xpToNextLevel(4) })
  })

  it('ignora XP negativa', () => {
    expect(levelFromXp(-50).level).toBe(1)
  })
})

describe('rachas', () => {
  it('no da bonus el primer día y se limita a x1.5', () => {
    expect(streakMultiplier(0)).toBe(1)
    expect(streakMultiplier(1)).toBe(1)
    expect(streakMultiplier(3)).toBe(1.2)
    expect(streakMultiplier(30)).toBe(1.5)
  })

  it('aplica el multiplicador a la recompensa', () => {
    expect(questReward('epic', 1)).toBe(50)
    expect(questReward('legendary', 6)).toBe(150)
  })
})
