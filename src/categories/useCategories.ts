import { useEffect, useState } from 'react'
import { createCategory, DEFAULT_CATEGORIES, type Category } from './categories'

const STORAGE_KEY = 'notiongaming:categories:v1'

function load(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Category[]) : DEFAULT_CATEGORIES
  } catch {
    return DEFAULT_CATEGORIES
  }
}

/** Clasificaciones guardadas en el navegador. La primera vez se crean las cuatro por defecto. */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories))
    } catch {
      // sin almacenamiento disponible: viven solo en memoria
    }
  }, [categories])

  return {
    categories,
    add: (name: string, color: string, icon: string) =>
      setCategories((cs) => [...cs, createCategory(name, color, icon)]),
    remove: (id: string) => setCategories((cs) => cs.filter((c) => c.id !== id)),
  }
}
