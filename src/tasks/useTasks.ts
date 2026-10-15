import { useEffect, useState } from 'react'
import { clearCategory, createTask, deleteTask, toggleTask, type Task } from './tasks'

const STORAGE_KEY = 'notiongaming:tasks:v1'

function load(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    // las tareas del paso 1 no tenían clasificación
    return raw ? (JSON.parse(raw) as Task[]).map((t) => ({ ...t, categoryId: t.categoryId ?? null })) : []
  } catch {
    return []
  }
}

/** Tareas guardadas en el navegador (localStorage). */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      // sin almacenamiento disponible: las tareas viven solo en memoria
    }
  }, [tasks])

  return {
    tasks,
    add: (title: string, date: string, categoryId: string | null) =>
      setTasks((ts) => [...ts, createTask(title, date, categoryId)]),
    toggle: (id: string) => setTasks((ts) => toggleTask(ts, id)),
    remove: (id: string) => setTasks((ts) => deleteTask(ts, id)),
    clearCategory: (categoryId: string) => setTasks((ts) => clearCategory(ts, categoryId)),
  }
}
