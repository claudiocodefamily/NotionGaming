import { describe, expect, it } from 'vitest'
import { addSubtask, createTask, deleteTask, subtasksOf, tasksForDay, toggleTask, type Task } from './tasks'

function macroWithSubs(): { tasks: Task[]; macro: Task } {
  const macro = createTask('Proyecto', '2026-10-17', 'trabajo', 1)
  let tasks = [macro]
  tasks = addSubtask(tasks, macro.id, 'Parte 1', 2)
  tasks = addSubtask(tasks, macro.id, 'Parte 2', 3)
  return { tasks, macro }
}

describe('subtareas', () => {
  it('heredan fecha y clasificación y no aparecen como tareas del día', () => {
    const { tasks, macro } = macroWithSubs()
    const subs = subtasksOf(tasks, macro.id)
    expect(subs.map((s) => [s.title, s.date, s.categoryId, s.parentId])).toEqual([
      ['Parte 1', '2026-10-17', 'trabajo', macro.id],
      ['Parte 2', '2026-10-17', 'trabajo', macro.id],
    ])
    expect(tasksForDay(tasks, '2026-10-17').map((t) => t.title)).toEqual(['Proyecto'])
  })

  it('la macro se completa sola al terminar todas sus subtareas', () => {
    const { tasks, macro } = macroWithSubs()
    const [s1, s2] = subtasksOf(tasks, macro.id)
    let next = toggleTask(tasks, s1.id)
    expect(next.find((t) => t.id === macro.id)?.done).toBe(false)
    next = toggleTask(next, s2.id)
    expect(next.find((t) => t.id === macro.id)?.done).toBe(true)
    // desmarcar una subtarea reabre la macro
    next = toggleTask(next, s1.id)
    expect(next.find((t) => t.id === macro.id)?.done).toBe(false)
  })

  it('marcar la macro marca todas sus subtareas', () => {
    const { tasks, macro } = macroWithSubs()
    const next = toggleTask(tasks, macro.id)
    expect(next.every((t) => t.done)).toBe(true)
  })

  it('una subtarea nueva reabre una macro completada', () => {
    const { tasks, macro } = macroWithSubs()
    const next = addSubtask(toggleTask(tasks, macro.id), macro.id, 'Parte 3', 4)
    expect(next.find((t) => t.id === macro.id)?.done).toBe(false)
  })

  it('no permite subtareas de subtareas', () => {
    const { tasks, macro } = macroWithSubs()
    const sub = subtasksOf(tasks, macro.id)[0]
    expect(addSubtask(tasks, sub.id, 'Nieta')).toBe(tasks)
  })

  it('eliminar la macro elimina sus subtareas; eliminar la última pendiente completa la macro', () => {
    const { tasks, macro } = macroWithSubs()
    expect(deleteTask(tasks, macro.id)).toEqual([])
    const [s1, s2] = subtasksOf(tasks, macro.id)
    const next = deleteTask(toggleTask(tasks, s1.id), s2.id)
    expect(next.find((t) => t.id === macro.id)?.done).toBe(true)
  })
})
