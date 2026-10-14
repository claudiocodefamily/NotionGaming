import { useEffect, useState } from 'react'
import { createTask, deleteTask, toggleTask, type Task } from './tasks'

const STORAGE_KEY = 'notiongaming:tasks:v1'

function load(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
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
    add: (title: string, date: string) => setTasks((ts) => [...ts, createTask(title, date)]),
    toggle: (id: string) => setTasks((ts) => toggleTask(ts, id)),
    remove: (id: string) => setTasks((ts) => deleteTask(ts, id)),
  }
}
