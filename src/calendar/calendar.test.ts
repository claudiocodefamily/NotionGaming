import { describe, expect, it } from 'vitest'
import { createTask } from '../tasks/tasks'
import { formatMonth, matchesFilter, monthGrid, tasksByDay } from './calendar'

describe('monthGrid', () => {
  it('empieza en lunes y cubre 6 semanas', () => {
    // octubre 2026 empieza en jueves
    const grid = monthGrid(2026, 9)
    expect(grid).toHaveLength(42)
    expect(grid[0]).toEqual({ key: '2026-09-28', day: 28, inMonth: false })
    expect(grid[3]).toEqual({ key: '2026-10-01', day: 1, inMonth: true })
    expect(grid.filter((d) => d.inMonth)).toHaveLength(31)
  })

  it('no añade relleno si el mes empieza en lunes', () => {
    // junio 2026 empieza en lunes
    expect(monthGrid(2026, 5)[0].key).toBe('2026-06-01')
  })
})

describe('filtros', () => {
  const uni = createTask('A', '2026-10-14', 'universidad')
  const libre = createTask('B', '2026-10-14', null)
  const trabajo = createTask('C', '2026-10-20', 'trabajo')

  it('filtra por clasificación, sin clasificación o todas', () => {
    expect(matchesFilter(uni, 'all')).toBe(true)
    expect(matchesFilter(libre, 'none')).toBe(true)
    expect(matchesFilter(uni, 'none')).toBe(false)
    expect(matchesFilter(trabajo, 'trabajo')).toBe(true)
  })

  it('agrupa por día solo las tareas que pasan el filtro', () => {
    const byDay = tasksByDay([uni, libre, trabajo], 'universidad')
    expect([...byDay.keys()]).toEqual(['2026-10-14'])
    expect(byDay.get('2026-10-14')).toEqual([uni])
  })
})

it('formatea el mes en español con mayúscula inicial', () => {
  expect(formatMonth(2026, 9)).toBe('Octubre de 2026')
})
