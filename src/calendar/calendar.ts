import { dayKey } from '../tasks/dates'
import type { Task } from '../tasks/tasks'

export const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export type CalendarDay = { key: string; day: number; inMonth: boolean }

/** 6 semanas (42 días) empezando en lunes que cubren el mes indicado (month: 0-11). */
export function monthGrid(year: number, month: number): CalendarDay[] {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // lunes = 0
  const start = new Date(year, month, 1 - offset)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    return { key: dayKey(d), day: d.getDate(), inMonth: d.getMonth() === month }
  })
}

export function formatMonth(year: number, month: number): string {
  const label = new Date(year, month, 1).toLocaleDateString('es', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

/** 'all' = todas, 'none' = sin clasificación, o el id de una clasificación. */
export type CategoryFilter = 'all' | 'none' | string

export function matchesFilter(task: Task, filter: CategoryFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'none') return task.categoryId === null
  return task.categoryId === filter
}

/** Agrupa por día las tareas principales (sin subtareas) que pasan el filtro. */
export function tasksByDay(tasks: Task[], filter: CategoryFilter): Map<string, Task[]> {
  const map = new Map<string, Task[]>()
  for (const t of tasks) {
    if (t.parentId !== null || !matchesFilter(t, filter)) continue
    const list = map.get(t.date)
    if (list) list.push(t)
    else map.set(t.date, [t])
  }
  return map
}
