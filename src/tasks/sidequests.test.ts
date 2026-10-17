import { describe, expect, it } from 'vitest'
import { tasksByDay } from '../calendar/calendar'
import { addSubtask, createTask, scheduleTask, sideQuests, subtasksOf, tasksForDay } from './tasks'

describe('misiones secundarias', () => {
  it('no tienen fecha y no salen en el día ni en el calendario', () => {
    const quest = createTask('Aprender acuarela', null, null, 1)
    const today = createTask('Entregar informe', '2026-10-17', null, 2)
    const tasks = [quest, today]
    expect(sideQuests(tasks).map((t) => t.title)).toEqual(['Aprender acuarela'])
    expect(tasksForDay(tasks, '2026-10-17').map((t) => t.title)).toEqual(['Entregar informe'])
    expect([...tasksByDay(tasks, 'all').keys()]).toEqual(['2026-10-17'])
  })

  it('al pasarla a un día se lleva sus subtareas, y puede volver a ser misión', () => {
    const quest = createTask('Mudanza', null, 'vida-diaria', 1)
    let tasks = addSubtask([quest], quest.id, 'Cajas', 2)
    tasks = scheduleTask(tasks, quest.id, '2026-10-20')
    expect(tasksForDay(tasks, '2026-10-20').map((t) => t.title)).toEqual(['Mudanza'])
    expect(subtasksOf(tasks, quest.id)[0].date).toBe('2026-10-20')
    tasks = scheduleTask(tasks, quest.id, null)
    expect(sideQuests(tasks)).toHaveLength(1)
    expect(subtasksOf(tasks, quest.id)[0].date).toBeNull()
  })
})
