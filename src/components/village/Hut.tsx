export function Hut({
  x,
  y,
  scale = 1,
  roof = '#b95e3f',
  name,
}: {
  x: number
  y: number
  scale?: number
  roof?: string
  name: string
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="54" rx={81} ry={13} fill="#395c38" opacity=".17" />
      <path d="M-62 6 L-58 50 L58 50 L62 6Z" fill="#e9c68a" stroke="#a97a48" strokeWidth="3" />
      <path d="M-20 50 L-20 22 Q0 5 20 22 L20 50Z" fill="#75452d" stroke="#5b3a2a" strokeWidth="3" />
      <path d="M-72 8 Q0 -70 72 8 L60 23 Q0 -3 -60 23Z" fill={roof} stroke="#7b4c31" strokeWidth="3" />
      <path
        d="M-59 7 Q0 -48 59 7 M-48 3 Q0 -36 48 3 M-38 -5 Q0 -26 38 -5 M-25 -15 Q0 -28 25 -15"
        fill="none"
        stroke="#e2ad68"
        strokeWidth="3"
        opacity=".8"
      />
      <path d="M-48 21 L-48 43 M48 21 L48 43" stroke="#c79d64" strokeWidth="4" />
      <rect x="-48" y="23" width="17" height="16" rx="2" fill="#80c9d1" stroke="#9b7745" strokeWidth="2" />
      <path d="M-39 23v16 M-48 31h17" stroke="#9b7745" strokeWidth="2" />
      <text
        x="0"
        y="71"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#284a32"
        stroke="#f8eac8"
        strokeWidth="3"
        paintOrder="stroke"
      >
        {name}
      </text>
    </g>
  )
}
