import { useState } from 'react'

const STORAGE_KEY = 'notiongaming:tab'

/** Pestaña activa, recordada en el navegador para volver a la misma al recargar. */
export function useStoredTab<T extends string>(valid: readonly T[], fallback: T) {
  const [tab, setTab] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return valid.includes(saved as T) ? (saved as T) : fallback
    } catch {
      return fallback
    }
  })

  const change = (next: T) => {
    setTab(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // sin almacenamiento: no se recuerda la pestaña
    }
  }

  return [tab, change] as const
}
