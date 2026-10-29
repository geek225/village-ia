export function Tree({
  x,
  y,
  scale = 1,
  baobab = false,
}: {
  x: number
  y: number
  scale?: number
  baobab?: boolean
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="2" cy="50" rx={baobab ? 50 : 28} ry="8" fill="#365c38" opacity=".18" />
      <path
        d={
          baobab
            ? 'M-9 50 L-13 13 Q-27 4 -29 -13 L-20 -15 Q-13 -2 -5 -4 L-3 -36 L8 -36 L9 -4 Q23 -4 29 -20 L38 -14 Q28 8 13 13 L13 50Z'
            : 'M-5 48 L-3 4 L8 4 L8 48Z'
        }
        fill="#805531"
        stroke="#634329"
        strokeWidth="2"
      />
      {baobab ? (
        <>
          <path
            d="M-45 -13 Q-55 -42 -32 -49 Q-30 -79 0 -65 Q25 -84 38 -54 Q61 -45 43 -14 Q19 -2 -3 -12Z"
            fill="#377747"
            stroke="#28643c"
            strokeWidth="4"
          />
          <path
            d="M-34 -25 Q-23 -51 -4 -34 M8 -36 Q26 -60 36 -35 M-5 -14 Q14 -36 24 -21"
            fill="none"
            stroke="#59965a"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <circle cx="1" cy="-8" r="31" fill="#3f8345" stroke="#2d6a3b" strokeWidth="3" />
          <circle cx="-15" cy="-17" r="17" fill="#4f954d" />
          <circle cx="15" cy="-22" r="18" fill="#589e52" />
          <circle cx="8" cy="0" r="16" fill="#367944" />
          <circle cx="-16" cy="1" r="13" fill="#4a914a" />
        </>
      )}
    </g>
  )
}
