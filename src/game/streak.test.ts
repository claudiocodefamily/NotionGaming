import { describe, expect, it } from 'vitest'
import { nextStreak } from './streak'

const today = new Date(2026, 9, 14)

describe('nextStreak', () => {
  it('empieza en 1 sin actividad previa', () => {
    expect(nextStreak(0, null, today)).toBe(1)
  })
  it('se mantiene si ya jugaste hoy', () => {
    expect(nextStreak(4, '2026-10-14', today)).toBe(4)
  })
  it('suma si jugaste ayer, incluso cruzando de mes', () => {
    expect(nextStreak(4, '2026-10-13', today)).toBe(5)
    expect(nextStreak(2, '2026-09-30', new Date(2026, 9, 1))).toBe(3)
  })
  it('se reinicia si saltaste un día', () => {
    expect(nextStreak(9, '2026-10-12', today)).toBe(1)
  })
})
