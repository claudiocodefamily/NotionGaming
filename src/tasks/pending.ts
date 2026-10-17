import type { Category } from '../categories/categories'
import { dayKey, parseDayKey } from './dates'
import type { Task } from './tasks'

export type PendingItem = { task: Task; subtasks: Task[]; subDone: number; subTotal: number }
export type PendingGroup = { category: Category | null; items: PendingItem[] }

/**
 * Tareas principales sin terminar (de cualquier día) agrupadas por clasificación,
 * en el orden de las clasificaciones y con "sin clasificación" al final.
 * Cada tarea lleva sus subtareas pendientes.
 */
export function pendingGroups(tasks: Task[], categories: Category[]): PendingGroup[] {
  const pending = tasks
    .filter((t) => t.parentId === null && !t.done)
    .sort((a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt)

  const toItem = (task: Task): PendingItem => {
    const subs = tasks.filter((t) => t.parentId === task.id).sort((a, b) => a.createdAt - b.createdAt)
    const subDone = subs.filter((s) => s.done).length
    return { task, subtasks: subs.filter((s) => !s.done), subDone, subTotal: subs.length }
  }

  const known = new Set(categories.map((c) => c.id))
  const groups: PendingGroup[] = categories.map((c) => ({
    category: c,
    items: pending.filter((t) => t.categoryId === c.id).map(toItem),
  }))
  // las tareas cuya clasificación ya no existe cuentan como "sin clasificación"
  groups.push({
    category: null,
    items: pending.filter((t) => t.categoryId === null || !known.has(t.categoryId)).map(toItem),
  })
  return groups.filter((g) => g.items.length > 0)
}

/** Etiqueta corta del día relativa a hoy: Hoy, Mañana, Ayer o "17 oct". */
export function shortDay(key: string, today: string): { label: string; overdue: boolean } {
  const t = parseDayKey(today)
  const rel = (n: number) => dayKey(new Date(t.getFullYear(), t.getMonth(), t.getDate() + n))
  const overdue = key < today
  if (key === today) return { label: 'Hoy', overdue }
  if (key === rel(1)) return { label: 'Mañana', overdue }
  if (key === rel(-1)) return { label: 'Ayer', overdue }
  const label = parseDayKey(key).toLocaleDateString('es', { day: 'numeric', month: 'short' }).replace('.', '')
  return { label, overdue }
}
