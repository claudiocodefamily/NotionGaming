import { describe, expect, it } from 'vitest'
import { dayKey } from './dates'
import { createTask, deleteTask, tasksForDay, toggleTask } from './tasks'

describe('tareas', () => {
  it('crea una tarea pendiente con el título recortado y su fecha', () => {
    const t = createTask('  Estudiar cálculo  ', '2026-10-14', 1)
    expect(t).toMatchObject({ title: 'Estudiar cálculo', date: '2026-10-14', done: false })
  })

  it('filtra por día y deja las completadas al final', () => {
    const a = { ...createTask('A', '2026-10-14', 1), done: true }
    const b = createTask('B', '2026-10-14', 2)
    const c = createTask('C', '2026-10-15', 3)
    expect(tasksForDay([a, b, c], '2026-10-14').map((t) => t.title)).toEqual(['B', 'A'])
  })

  it('marca, desmarca y elimina', () => {
    const t = createTask('A', '2026-10-14')
    const marked = toggleTask([t], t.id)
    expect(marked[0].done).toBe(true)
    expect(toggleTask(marked, t.id)[0].done).toBe(false)
    expect(deleteTask(marked, t.id)).toEqual([])
  })
})

describe('dayKey', () => {
  it('usa la fecha local con ceros a la izquierda', () => {
    expect(dayKey(new Date(2026, 0, 5))).toBe('2026-01-05')
  })
})
