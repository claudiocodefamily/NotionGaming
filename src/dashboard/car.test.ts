import { describe, expect, it } from 'vitest'
import { addSubtask, createTask, subtasksOf, toggleTask } from '../tasks/tasks'
import { kilometers } from './car'

describe('kilometers', () => {
  it('suma 1 km por cada tarea o subtarea completada', () => {
    const macro = createTask('Informe', '2026-10-17', null, 1)
    let tasks = addSubtask([macro, createTask('Correos', '2026-10-17', null, 2)], macro.id, 'Datos', 3)
    expect(kilometers(tasks)).toBe(0)
    tasks = toggleTask(tasks, subtasksOf(tasks, macro.id)[0].id) // la macro se completa sola
    expect(kilometers(tasks)).toBe(2)
  })
})
