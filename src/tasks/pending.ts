import type { Category } from '../categories/categories'
import { dayKey, parseDayKey } from './dates'
import type { Task } from './tasks'

export type TaskItem = { task: Task; subtasks: Task[]; subDone: number; subTotal: number }
export type CategoryGroup = { category: Category | null; items: TaskItem[] }
export type DayGroup = { date: string; items: TaskItem[] }

/** Pendientes primero y las hechas al final; dentro de cada bloque, por día y por orden de creación. */
function doneLast(a: Task, b: Task): number {
  return Number(a.done) - Number(b.done) || compareDates(a.date, b.date) || a.createdAt - b.createdAt
}

/** Ordena por día, con las misiones secundarias (sin fecha) al final. */
function compareDates(a: string | null, b: string | null): number {
  if (a === b) return 0
  if (a === null) return 1
  if (b === null) return -1
  return a.localeCompare(b)
}

/** Una tarea principal con sus subtareas (las hechas al final) y su progreso. */
export function itemOf(tasks: Task[], task: Task): TaskItem {
  const subs = tasks.filter((t) => t.parentId === task.id).sort(doneLast)
  return { task, subtasks: subs, subDone: subs.filter((s) => s.done).length, subTotal: subs.length }
}

/** Tareas principales del día: las de hoy (hechas incluidas) y las de días pasados sin terminar. */
export function dayTasks(tasks: Task[], today: string): Task[] {
  return tasks
    .filter((t) => t.parentId === null && t.date !== null && (t.date === today || (t.date < today && !t.done)))
    .sort(doneLast)
}

/**
 * Agrupa tareas principales por clasificación, en el orden de las clasificaciones
 * y con "sin clasificación" al final. Las hechas quedan al final de su grupo.
 */
export function groupByCategory(tasks: Task[], top: Task[], categories: Category[]): CategoryGroup[] {
  const sorted = [...top].sort(doneLast)
  const known = new Set(categories.map((c) => c.id))
  const groups: CategoryGroup[] = categories.map((c) => ({
    category: c,
    items: sorted.filter((t) => t.categoryId === c.id).map((t) => itemOf(tasks, t)),
  }))
  // las tareas cuya clasificación ya no existe cuentan como "sin clasificación"
  groups.push({
    category: null,
    items: sorted.filter((t) => t.categoryId === null || !known.has(t.categoryId)).map((t) => itemOf(tasks, t)),
  })
  return groups.filter((g) => g.items.length > 0)
}

/** Tareas principales de los próximos días, agrupadas por día en orden. */
export function upcomingByDay(tasks: Task[], today: string): DayGroup[] {
  const upcoming = tasks.filter((t) => t.parentId === null && t.date !== null && t.date > today).sort(doneLast)
  const groups = new Map<string, TaskItem[]>()
  for (const t of upcoming) {
    const date = t.date as string
    groups.set(date, [...(groups.get(date) ?? []), itemOf(tasks, t)])
  }
  return [...groups.keys()].sort().map((date) => ({ date, items: groups.get(date)! }))
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
