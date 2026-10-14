export function PixelCheckbox({ checked }: { checked: boolean }) {
  return (
    <svg viewBox="0 0 10 10" className="h-7 w-7 shrink-0" shape-rendering="crispEdges" aria-hidden>
      <rect x="0" y="0" width="10" height="10" fill={checked ? '#4ade80' : '#a29fd0'} />
      <rect x="1" y="1" width="8" height="8" fill="#0b0a1f" />
      {checked && (
        <g fill="#4ade80">
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
