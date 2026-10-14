export function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Devuelve la racha tras una actividad en `today`, dado el último día activo. */
export function nextStreak(streak: number, lastActiveDay: string | null, today: Date): number {
  const todayKey = dayKey(today)
  if (lastActiveDay === todayKey) return Math.max(1, streak)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  if (lastActiveDay === dayKey(yesterday)) return streak + 1
  return 1
}
