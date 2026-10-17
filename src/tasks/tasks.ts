export type Task = {
  id: string
  title: string
  /** Día al que pertenece la tarea (YYYY-MM-DD). */
  date: string
  done: boolean
  createdAt: number
  /** Clasificación de la tarea, o null si no tiene. */
  categoryId: string | null
  /** Tarea macro a la que pertenece esta subtarea, o null si es una tarea principal. */
  parentId: string | null
}

function newId(now: number): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${now}-${Math.random()}`
}

export function createTask(title: string, date: string, categoryId: string | null = null, now = Date.now()): Task {
  return { id: newId(now), title: title.trim(), date, done: false, createdAt: now, categoryId, parentId: null }
}

/** Crea una subtarea que hereda la fecha y la clasificación de su tarea macro. */
export function createSubtask(parent: Task, title: string, now = Date.now()): Task {
  return { ...createTask(title, parent.date, parent.categoryId, now), parentId: parent.id }
}

export function subtasksOf(tasks: Task[], parentId: string): Task[] {
  return tasks.filter((t) => t.parentId === parentId).sort((a, b) => a.createdAt - b.createdAt)
}

/** Tareas principales (no subtareas) de un día, con las completadas al final. */
export function tasksForDay(tasks: Task[], date: string): Task[] {
  return tasks
    .filter((t) => t.date === date && t.parentId === null)
    .sort((a, b) => Number(a.done) - Number(b.done) || a.createdAt - b.createdAt)
}

/** Una tarea macro se completa sola cuando todas sus subtareas están hechas. */
function syncParent(tasks: Task[], parentId: string): Task[] {
  const subs = tasks.filter((t) => t.parentId === parentId)
  if (subs.length === 0) return tasks
  const allDone = subs.every((t) => t.done)
  return tasks.map((t) => (t.id === parentId ? { ...t, done: allDone } : t))
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  const task = tasks.find((t) => t.id === id)
  if (!task) return tasks
  const done = !task.done
  // marcar una tarea macro marca (o desmarca) también todas sus subtareas
  const next = tasks.map((t) => (t.id === id || t.parentId === id ? { ...t, done } : t))
  return task.parentId ? syncParent(next, task.parentId) : next
}

/** Elimina una tarea y, si es macro, todas sus subtareas. */
export function deleteTask(tasks: Task[], id: string): Task[] {
  const task = tasks.find((t) => t.id === id)
  const next = tasks.filter((t) => t.id !== id && t.parentId !== id)
  return task?.parentId ? syncParent(next, task.parentId) : next
}

export function addSubtask(tasks: Task[], parentId: string, title: string, now = Date.now()): Task[] {
  const parent = tasks.find((t) => t.id === parentId)
  if (!parent || parent.parentId !== null) return tasks
  // una subtarea nueva está pendiente, así que la macro deja de estar completa
  return syncParent([...tasks, createSubtask(parent, title, now)], parentId)
}

/** Deja sin clasificación las tareas de una clasificación que se elimina. */
export function clearCategory(tasks: Task[], categoryId: string): Task[] {
  return tasks.map((t) => (t.categoryId === categoryId ? { ...t, categoryId: null } : t))
}
