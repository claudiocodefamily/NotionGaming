import type { ReactNode } from 'react'
import type { Task } from '../tasks/tasks'
import { FUEL_SEGMENTS, kilometers, STATIONS } from './dashboard'
import { useStored } from '../useStored'

/** Pantalla del viaje (por ahora negra) y tablero del auto debajo. */
export function Dashboard({ tasks }: { tasks: Task[] }) {
  const [on, setOn] = useStored('notiongaming:llaves', true)
  const [station, setStation] = useStored('notiongaming:emisora', 0)
  const km = kilometers(tasks)
  // la gasolina se conectará con el modo focus; por ahora el tanque está lleno
  const fuel = FUEL_SEGMENTS
  const tune = (delta: number) => setStation((station + delta + STATIONS.length) % STATIONS.length)

  return (
    <section aria-label="Tablero del auto" className="mb-8">
      <div
        className="relative flex h-40 items-center justify-center border-[3px] border-edge bg-black sm:h-52"
        style={{ boxShadow: '0 0 0 3px var(--color-soil), 6px 6px 0 0 rgb(0 0 0 / 0.55)' }}
        aria-label="Pantalla del viaje"
      >
        {!on && <p className="animate-pulse font-pixel text-[9px] text-ink-dim/50">INSERTA LAS LLAVES</p>}
      </div>

      <div
        className="mx-2 grid grid-cols-2 gap-3 border-[3px] border-t-0 border-edge bg-[#1d1812] p-3 sm:mx-6 lg:grid-cols-[1fr_1fr_1.4fr_1fr]"
        style={{ boxShadow: '6px 6px 0 0 rgb(0 0 0 / 0.55)' }}
      >
        <Gauge label="KILOMETRAJE" on={on}>
          <div className="flex items-end gap-0.5 sm:gap-1" aria-label={`${km} kilómetros`}>
            {String(km)
              .padStart(6, '0')
              .split('')
              .map((d, i) => (
                <span
                  key={i}
                  className={`w-4 border-2 border-edge bg-black text-center text-[21px] leading-6 sm:w-5 sm:text-[26px] sm:leading-7 ${on ? 'text-ink' : 'text-ink/20'}`}
                >
                  {on ? d : '0'}
                </span>
              ))}
            <span className="ml-1 text-ink-dim">km</span>
          </div>
        </Gauge>

        <Gauge label="GASOLINA" on={on}>
          <div className="flex items-center gap-1.5" aria-label={on ? 'Tanque lleno' : 'Apagado'}>
            <span className="text-berry">E</span>
            <div className="flex gap-0.5">
              {Array.from({ length: FUEL_SEGMENTS }, (_, i) => {
                const lit = on && i < fuel
                const color = i < 2 ? 'bg-berry' : i < 5 ? 'bg-sun' : 'bg-leaf'
                return <span key={i} className={`h-6 w-2 ${lit ? color : 'bg-edge/40'}`} />
              })}
            </div>
            <span className="text-leaf">F</span>
          </div>
        </Gauge>

        <Gauge label="EMISORA" on={on} className="col-span-2 lg:col-span-1">
          <div className="flex w-full items-center gap-1.5">
            <button
              onClick={() => tune(-1)}
              disabled={!on}
              className="pixel-btn px-1.5 py-1 text-[8px] text-river disabled:opacity-40"
              aria-label="Emisora anterior"
            >
              ◀
            </button>
            <div
              className="min-w-0 flex-1 truncate border-2 border-edge bg-[#0d1a10] px-2 text-center text-[19px] leading-7 text-leaf"
              aria-live="polite"
            >
              {on ? (STATIONS[station] ?? STATIONS[0]) : ''}
            </div>
            <button
              onClick={() => tune(1)}
              disabled={!on}
              className="pixel-btn px-1.5 py-1 text-[8px] text-river disabled:opacity-40"
              aria-label="Emisora siguiente"
            >
              ▶
            </button>
          </div>
        </Gauge>

        <Gauge label="LLAVES" on className="col-span-2 lg:col-span-1">
          <button
            onClick={() => setOn(!on)}
            aria-pressed={on}
            aria-label={on ? 'Quitar las llaves' : 'Poner las llaves'}
            title={on ? 'Quitar las llaves' : 'Poner las llaves'}
            className="flex items-center gap-3"
          >
            <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-edge bg-black">
              <span className="absolute top-0.5 font-pixel text-[5px] text-ink-dim">ON</span>
              {on && <KeyIcon className="rotate-90" />}
            </span>
            {!on && <KeyIcon />}
            <span className={`font-pixel text-[8px] ${on ? 'text-leaf' : 'text-ink-dim'}`}>
              {on ? 'ENCENDIDO' : 'APAGADO'}
            </span>
          </button>
        </Gauge>
      </div>
    </section>
  )
}

type GaugeProps = { label: string; on: boolean; className?: string; children: ReactNode }

function Gauge({ label, on, className = '', children }: GaugeProps) {
  return (
    <div className={`flex min-w-0 flex-col justify-between gap-2 border-2 border-edge bg-soil/70 p-2 ${className}`}>
      <span className="flex items-center gap-1.5 font-pixel text-[7px] text-ink-dim">
        <span className={`h-1.5 w-1.5 ${on ? 'bg-leaf' : 'bg-edge'}`} />
        {label}
      </span>
      <div className={`flex min-h-9 items-center transition-opacity ${on ? '' : 'opacity-50'}`}>{children}</div>
    </div>
  )
}

/** Llave en pixel art. */
function KeyIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 8"
      className={`h-4 w-8 shrink-0 transition-transform ${className}`}
      shapeRendering="crispEdges"
      aria-hidden
    >
      <g fill="var(--color-sun)">
        <rect x="0" y="1" width="1" height="6" />
        <rect x="1" y="0" width="4" height="1" />
        <rect x="1" y="7" width="4" height="1" />
        <rect x="5" y="1" width="1" height="6" />
        <rect x="6" y="3" width="10" height="2" />
        <rect x="11" y="5" width="1" height="2" />
        <rect x="14" y="5" width="1" height="2" />
      </g>
      <rect x="2" y="3" width="2" height="2" fill="var(--color-edge)" />
    </svg>
  )
}
