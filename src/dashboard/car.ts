import type { Task } from '../tasks/tasks'

export const STATIONS = ['88.1 LO-FI BOSQUE', '93.5 RETRO FM', '101.7 RÍO SERENO', '106.3 LLUVIA 8-BIT']
export const FUEL_SEGMENTS = 10

/** Kilómetros recorridos: cada tarea o subtarea completada suma 1 km. */
export function kilometers(tasks: Task[]): number {
  return tasks.filter((t) => t.done).length
}
