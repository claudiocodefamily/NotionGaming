export function PixelCheckbox({ checked }: { checked: boolean }) {
  return (
    <svg viewBox="0 0 10 10" className="h-7 w-7 shrink-0" shape-rendering="crispEdges" aria-hidden>
      <rect x="0" y="0" width="10" height="10" fill={checked ? '#8cc152' : '#b8aa88'} />
      <rect x="1" y="1" width="8" height="8" fill="#15130d" />
      {checked && (
        <g fill="#8cc152">
          <rect x="2" y="5" width="1" height="1" />
          <rect x="3" y="6" width="1" height="1" />
          <rect x="4" y="5" width="1" height="1" />
          <rect x="5" y="4" width="1" height="1" />
          <rect x="6" y="3" width="1" height="1" />
          <rect x="7" y="2" width="1" height="1" />
        </g>
      )}
    </svg>
  )
}
