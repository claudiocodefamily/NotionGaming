import { describe, expect, it } from 'vitest'
import { DEFAULT_CATEGORIES } from '../categories/categories'
import { pendingGroups, shortDay } from './pending'
import { addSubtask, createTask, subtasksOf, toggleTask } from './tasks'

describe('pendingGroups', () => {
  it('agrupa las tareas pendientes por clasificación, con subtareas pendientes y su progreso', () => {
    const macro = createTask('Informe', '2026-10-20', 'trabajo', 1)
    let tasks = [
      macro,
      createTask('Correos', '2026-10-17', 'trabajo', 2),
      createTask('Hecha', '2026-10-17', 'trabajo', 3),
      createTask('Leer', '2026-10-18', 'universidad', 4),
      createTask('Suelta', '2026-10-17', null, 5),
      createTask('Huérfana', '2026-10-17', 'borrada', 6),
    ]
    tasks = toggleTask(tasks, tasks[2].id)
    tasks = addSubtask(tasks, macro.id, 'Datos', 7)
    tasks = addSubtask(tasks, macro.id, 'Gráficas', 8)
    tasks = toggleTask(tasks, subtasksOf(tasks, macro.id)[0].id)

    const groups = pendingGroups(tasks, DEFAULT_CATEGORIES)
    expect(groups.map((g) => [g.category?.name ?? null, g.items.map((i) => i.task.title)])).toEqual([
      ['Universidad', ['Leer']],
      ['Trabajo', ['Correos', 'Informe']],
      [null, ['Suelta', 'Huérfana']],
    ])
    const informe = groups[1].items[1]
    expect([informe.subtasks.map((s) => s.title), informe.subDone, informe.subTotal]).toEqual([['Gráficas'], 1, 2])
  })
})

describe('shortDay', () => {
  it('usa etiquetas relativas y marca las atrasadas', () => {
    expect(shortDay('2026-10-17', '2026-10-17')).toEqual({ label: 'Hoy', overdue: false })
    expect(shortDay('2026-10-18', '2026-10-17')).toEqual({ label: 'Mañana', overdue: false })
    expect(shortDay('2026-10-16', '2026-10-17')).toEqual({ label: 'Ayer', overdue: true })
    expect(shortDay('2026-10-01', '2026-10-17').overdue).toBe(true)
  })
})
