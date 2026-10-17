import { describe, expect, it } from 'vitest'
import { tasksByDay } from '../calendar/calendar'
import { pendingGroups, shortDay } from './pending'
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

  it('aparecen al final de su clasificación en pendientes, como Misión', () => {
    const quest = createTask('Algún día', null, 'trabajo', 1)
    const dated = createTask('Reunión', '2026-10-25', 'trabajo', 2)
    const [group] = pendingGroups([quest, dated], [{ id: 'trabajo', name: 'Trabajo', color: '#000', icon: '💼' }])
    expect(group.items.map((i) => i.task.title)).toEqual(['Reunión', 'Algún día'])
    expect(shortDay(null, '2026-10-17')).toEqual({ label: 'Misión', overdue: false })
  })
})
