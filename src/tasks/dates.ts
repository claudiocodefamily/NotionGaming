/** Clave de día local en formato YYYY-MM-DD (sin desfases por zona horaria). */
export function dayKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatLongDate(date: Date): string {
  return date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })
}
