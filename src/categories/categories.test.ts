import { describe, expect, it } from 'vitest'
import { DEFAULT_CATEGORIES, createCategory, nameTaken } from './categories'

describe('clasificaciones', () => {
  it('trae las cuatro clasificaciones por defecto', () => {
    expect(DEFAULT_CATEGORIES.map((c) => c.name)).toEqual(['Universidad', 'Trabajo', 'Vida diaria', 'Freelance'])
  })

  it('crea una clasificación con el nombre recortado', () => {
    expect(createCategory('  Gym ', '#8cc152', '🏋️')).toMatchObject({ name: 'Gym', color: '#8cc152', icon: '🏋️' })
  })

  it('detecta nombres repetidos sin importar mayúsculas', () => {
    expect(nameTaken(DEFAULT_CATEGORIES, ' trabajo ')).toBe(true)
    expect(nameTaken(DEFAULT_CATEGORIES, 'Hobbies')).toBe(false)
  })
})
