export type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

export const RARITIES: Record<Rarity, { label: string; xp: number }> = {
  common: { label: 'Común', xp: 10 },
  rare: { label: 'Rara', xp: 25 },
  epic: { label: 'Épica', xp: 50 },
  legendary: { label: 'Legendaria', xp: 100 },
}

/** XP necesaria para pasar del nivel `level` al siguiente. Crece suave: 100, 150, 200... */
export function xpToNextLevel(level: number): number {
  return 100 + (level - 1) * 50
}

/** Calcula nivel y progreso dentro del nivel a partir de la XP total acumulada. */
export function levelFromXp(totalXp: number): { level: number; current: number; needed: number } {
  let level = 1
  let remaining = Math.max(0, Math.floor(totalXp))
  while (remaining >= xpToNextLevel(level)) {
    remaining -= xpToNextLevel(level)
    level++
  }
  return { level, current: remaining, needed: xpToNextLevel(level) }
}

/** Multiplicador por racha: +10% por día seguido a partir del segundo, máximo x1.5. */
export function streakMultiplier(streakDays: number): number {
  const bonus = Math.max(0, streakDays - 1) * 0.1
  return Math.min(1.5, Math.round((1 + bonus) * 10) / 10)
}

export function questReward(rarity: Rarity, streakDays: number): number {
  return Math.round(RARITIES[rarity].xp * streakMultiplier(streakDays))
}

export function titleForLevel(level: number): string {
  if (level >= 30) return 'Leyenda'
  if (level >= 20) return 'Campeón'
  if (level >= 10) return 'Veterano'
  if (level >= 5) return 'Aventurero'
  return 'Novato'
}
