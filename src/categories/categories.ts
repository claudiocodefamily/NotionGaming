export type Category = {
  id: string
  name: string
  color: string
  icon: string
}

/** Colores disponibles para clasificaciones, en sintonía con la paleta naturaleza. */
export const CATEGORY_COLORS = [
  '#5aaed0', // río
  '#c98a3e', // madera
  '#8cc152', // hoja
  '#d0583f', // baya
  '#e3b34a', // sol
  '#a68bd1', // lavanda
  '#4fb3a0', // laguna
  '#a3a08a', // piedra
]

export const CATEGORY_ICONS = ['🎓', '💼', '🌿', '💻', '📚', '🏋️', '🎨', '🏠', '💰', '🎮', '❤️', '⭐']

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'universidad', name: 'Universidad', color: '#5aaed0', icon: '🎓' },
  { id: 'trabajo', name: 'Trabajo', color: '#c98a3e', icon: '💼' },
  { id: 'vida-diaria', name: 'Vida diaria', color: '#8cc152', icon: '🌿' },
  { id: 'freelance', name: 'Freelance', color: '#d0583f', icon: '💻' },
]

export function createCategory(name: string, color: string, icon: string): Category {
  const now = Date.now()
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${now}-${Math.random()}`
  return { id, name: name.trim(), color, icon }
}

/** True si ya existe una clasificación con ese nombre (sin distinguir mayúsculas ni espacios). */
export function nameTaken(categories: Category[], name: string): boolean {
  const n = name.trim().toLocaleLowerCase('es')
  return categories.some((c) => c.name.toLocaleLowerCase('es') === n)
}
