import { useEffect, useState } from 'react'

/** Fecha actual que se refresca cada minuto, para que "hoy" cambie al pasar la medianoche. */
export function useToday(): Date {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])
  return now
}
