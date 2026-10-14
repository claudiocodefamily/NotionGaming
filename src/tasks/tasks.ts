export type Task = {
  id: string
  title: string
  /** Día al que pertenece la tarea (YYYY-MM-DD). Lo usará el calendario más adelante. */
  date: string
  done: boolean
  createdAt: number
}

export function createTask(title: string, date: string, now = Date.now()): Task {
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${now}-${Math.random()}`
  return { id, title: title.trim(), date, done: false, createdAt: now }
}

export function tasksForDay(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => t.date === date).sort((a, b) => Number(a.done) - Number(b.done) || a.createdAt - b.createdAt)
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
}

export function deleteTask(tasks: Task[], id: string): Task[] {
  return tasks.filter((t) => t.id !== id)
}
