import { describe, expect, it } from 'vitest'
import { weekOf } from '../calendar/calendar'
import { DEFAULT_CATEGORIES } from '../categories/categories'
import { dayTasks, groupByCategory, shortDay, upcomingByDay } from './pending'
import { addSubtask, createTask, subtasksOf, toggleTask } from './tasks'

const TODAY = '2026-10-17'

describe('pendientes del día', () => {
  it('incluye las de hoy (hechas al final) y las atrasadas sin terminar, agrupadas por clasificación', () => {
    let tasks = [
      createTask('Hecha', TODAY, 'trabajo', 1),
      createTask('Correos', TODAY, 'trabajo', 2),
      createTask('Atrasada', '2026-10-15', 'trabajo', 3),
      createTask('Atrasada hecha', '2026-10-15', 'trabajo', 4),
      createTask('Leer', TODAY, 'universidad', 5),
      createTask('Huérfana', TODAY, 'borrada', 6),
      createTask('Mañana', '2026-10-18', 'trabajo', 7),
      createTask('Misión', null, 'trabajo', 8),
    ]
    tasks = toggleTask(tasks, tasks[0].id)
    tasks = toggleTask(tasks, tasks[3].id)

    const groups = groupByCategory(tasks, dayTasks(tasks, TODAY), DEFAULT_CATEGORIES)
    expect(groups.map((g) => [g.category?.name ?? null, g.items.map((i) => i.task.title)])).toEqual([
      ['Universidad', ['Leer']],
      ['Trabajo', ['Atrasada', 'Correos', 'Hecha']],
      [null, ['Huérfana']],
    ])
  })

  it('una tarea marcada se queda en su lista, al final, y sus subtareas hechas también van al final', () => {
    const macro = createTask('Informe', TODAY, 'trabajo', 1)
    let tasks = [macro, createTask('Otra', TODAY, 'trabajo', 2)]
    tasks = addSubtask(tasks, macro.id, 'Datos', 3)
    tasks = addSubtask(tasks, macro.id, 'Gráficas', 4)
    tasks = toggleTask(tasks, subtasksOf(tasks, macro.id)[0].id)
    let [group] = groupByCategory(tasks, dayTasks(tasks, TODAY), DEFAULT_CATEGORIES)
    expect(group.items[0].subtasks.map((s) => s.title)).toEqual(['Gráficas', 'Datos'])
    expect([group.items[0].subDone, group.items[0].subTotal]).toEqual([1, 2])

    tasks = toggleTask(tasks, macro.id)
    ;[group] = groupByCategory(tasks, dayTasks(tasks, TODAY), DEFAULT_CATEGORIES)
    expect(group.items.map((i) => [i.task.title, i.task.done])).toEqual([
      ['Otra', false],
      ['Informe', true],
    ])
  })
})

describe('próximos pendientes', () => {
  it('agrupa por día en orden, sin hoy, pasados ni misiones', () => {
    const tasks = [
      createTask('Parcial', '2026-10-20', 'universidad', 1),
      createTask('Banco', '2026-10-18', null, 2),
      createTask('Hoy', TODAY, null, 3),
      createTask('Pasada', '2026-10-10', null, 4),
      createTask('Misión', null, null, 5),
      createTask('Gym', '2026-10-18', null, 6),
    ]
    expect(upcomingByDay(tasks, TODAY).map((d) => [d.date, d.items.map((i) => i.task.title)])).toEqual([
      ['2026-10-18', ['Banco', 'Gym']],
      ['2026-10-20', ['Parcial']],
    ])
  })
})

describe('weekOf', () => {
  it('la semana va de sábado a viernes', () => {
    const sat = ['2026-10-17', '2026-10-18', '2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23']
    expect(weekOf(new Date(2026, 9, 17))).toEqual(sat) // sábado
    expect(weekOf(new Date(2026, 9, 23))).toEqual(sat) // viernes
    expect(weekOf(new Date(2026, 9, 16))[0]).toBe('2026-10-10') // un viernes pertenece a la semana anterior
  })
})

describe('shortDay', () => {
  it('usa etiquetas relativas y marca las atrasadas', () => {
    expect(shortDay(TODAY, TODAY)).toEqual({ label: 'Hoy', overdue: false })
    expect(shortDay('2026-10-18', TODAY)).toEqual({ label: 'Mañana', overdue: false })
    expect(shortDay('2026-10-16', TODAY)).toEqual({ label: 'Ayer', overdue: true })
    expect(shortDay('2026-10-01', TODAY).overdue).toBe(true)
  })
})
