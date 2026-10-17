import { useState } from 'react'

const STORAGE_KEY = 'notiongaming:collapsed'

/** Ids de elementos plegados, recordados en el navegador. */
export function useCollapsed(defaults: string[] = []) {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return new Set(raw ? (JSON.parse(raw) as string[]) : defaults)
    } catch {
      return new Set(defaults)
    }
  })

  const toggle = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
      } catch {
        // sin almacenamiento: no se recuerda
      }
      return next
    })
  }

  return { isCollapsed: (id: string) => collapsed.has(id), toggle }
}
