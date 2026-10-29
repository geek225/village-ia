import type { AgentKind } from '../../types/agent'

export function CharacterArt({ kind, active = false }: { kind: AgentKind; active?: boolean }) {
  const shared = {
    stroke: '#513729',
    strokeWidth: 2.6,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  }

  if (kind === 'king') {
    return (
      <svg viewBox="0 0 100 140" className={`character-svg ${active ? 'character-active' : ''}`} role="img" aria-label="Le Roi">
        <ellipse cx="50" cy="132" rx="31" ry="6" fill="#284b36" opacity=".25" />
        <g className="character-body">
          <path d="M31 83 25 118 43 122 50 91 57 122 76 118 68 83Z" fill="#f0bb51" {...shared} />
          <path d="M28 77 Q50 66 72 77 L82 125 Q50 139 18 125Z" fill="#a83228" {...shared} />
          <path d="M40 80 50 91 60 80 66 124 34 124Z" fill="#e8b64a" stroke="#7c3329" strokeWidth="2" />
          <path d="M28 88 12 103 20 111 38 99 M72 88 89 101 82 110 65 98" fill="#7e2825" {...shared} />
          <path d="M17 109 23 113 29 106 M82 108 76 113 70 106" fill="#603a2b" {...shared} />
          <ellipse cx="50" cy="54" rx="23" ry="27" fill="#77452e" {...shared} />
          <path d="M28 48 Q23 23 50 22 Q77 23 72 49 L64 40 54 37 43 41 34 49Z" fill="#30231e" stroke="#30231e" strokeWidth="2" />
          <path d="M32 56 Q31 72 50 77 Q68 72 68 56 L61 67 50 71 39 67Z" fill="#37251f" />
          <path d="M39 53h5 M57 53h5" stroke="#241a17" strokeWidth="3" strokeLinecap="round" />
          <path d="M43 62 Q50 66 57 62" fill="none" stroke="#f2c99c" strokeWidth="2" strokeLinecap="round" />
          <path d="M22 40 28 19 41 28 50 9 59 28 73 18 78 42 67 37 33 37Z" fill="#f4c44d" stroke="#9b641b" strokeWidth="2.5" />
          <circle cx="50" cy="25" r="4.5" fill="#a93028" />
          <circle cx="32" cy="34" r="3" fill="#3d79a6" />
          <circle cx="68" cy="34" r="3" fill="#3d79a6" />
          <path d="M37 83 50 99 63 83" fill="none" stroke="#f9df8b" strokeWidth="3" />
          <circle cx="50" cy="101" r="6" fill="#f2c34c" stroke="#8d641c" strokeWidth="2" />
          <path d="M84 48 87 115" stroke="#714724" strokeWidth="5" strokeLinecap="round" />
          <path d="M78 50 Q87 37 96 50 Q87 63 78 50Z" fill="#f5c64c" stroke="#9b641b" strokeWidth="2" />
        </g>
      </svg>
    )
  }

  if (kind === 'griot') {
    return (
      <svg viewBox="0 0 100 140" className={`character-svg griot-art ${active ? 'character-active' : ''}`} role="img" aria-label="Le Griot">
        <ellipse cx="48" cy="131" rx="27" ry="5" fill="#284b36" opacity=".25" />
        <g className="character-body">
          <g className="griot-leg-a">
            <path d="M34 98 29 119 23 126 36 130 47 108 48 98Z" fill="#603d2b" {...shared} />
            <path d="M22 124 15 130 36 133 39 129Z" fill="#3a3027" {...shared} />
          </g>
          <g className="griot-leg-b">
            <path d="M55 98 58 118 68 125 58 131 42 110 43 98Z" fill="#76482f" {...shared} />
            <path d="M58 127 73 128 77 134 55 133Z" fill="#3a3027" {...shared} />
          </g>
          <path d="M28 58 Q49 49 67 60 L70 102 Q48 112 26 101Z" fill="#cc4e2e" {...shared} />
          <path d="M31 64 63 63 60 101 34 102Z" fill="#e4a23b" />
          <path d="M31 69h31 M32 78h29 M33 87h27 M34 96h25" stroke="#285f4a" strokeWidth="4" />
          <path d="M29 65 16 83 25 91 38 75 M64 66 77 81 70 90 58 76" fill="#78472e" {...shared} />
          <path d="M18 86 27 91 22 98 13 92Z M70 86 78 92 73 99 65 92Z" fill="#6c422e" {...shared} />
          <ellipse cx="48" cy="43" rx="18" ry="22" fill="#814c32" {...shared} />
          <path d="M30 38 Q27 17 49 17 Q70 18 67 40 L61 31 50 29 39 33Z" fill="#32231e" />
          <path d="M27 37 Q19 29 27 19 L33 10 49 14 61 8 72 22 67 38 59 29 39 29Z" fill="#c64c32" stroke="#873823" strokeWidth="2.5" />
          <path d="M30 24 Q49 31 67 22" fill="none" stroke="#f0c658" strokeWidth="4" />
          <path d="M38 43h4 M54 43h4" stroke="#211916" strokeWidth="3" strokeLinecap="round" />
          <path d="M41 52 Q48 56 55 51" fill="none" stroke="#efc39a" strokeWidth="2" />
          <path d="M29 61 18 65 15 80 23 82 35 70" fill="#f0b94d" {...shared} />
          <path d="M65 61 76 62 82 77 75 82 62 71" fill="#d34c2d" {...shared} />
          <path d="M18 59 Q4 60 9 83 Q14 98 28 92 L31 82 18 80Z" fill="#b97831" stroke="#7b4c25" strokeWidth="2.5" />
          <ellipse cx="17" cy="78" rx="5" ry="9" fill="#e6bb58" />
          <path d="M17 69 28 62 M17 87 28 93" stroke="#7b4c25" strokeWidth="2" />
          <path d="M43 63 50 70 58 63" fill="none" stroke="#f3cd69" strokeWidth="3" />
        </g>
      </svg>
    )
  }

  if (kind === 'researcher') {
    return (
      <svg viewBox="0 0 100 140" className={`character-svg ${active ? 'character-active' : ''}`} role="img" aria-label="Le Chercheur">
        <ellipse cx="50" cy="132" rx="28" ry="6" fill="#284b36" opacity=".22" />
        <g className="character-body">
          <path d="M32 81 28 119 43 124 50 91 58 124 74 119 67 81Z" fill="#e9d6ad" {...shared} />
          <path d="M27 76 Q48 66 70 77 L79 123 Q51 135 21 123Z" fill="#376b88" {...shared} />
          <path d="M43 78 50 91 58 78 65 124 35 124Z" fill="#f0debc" />
          <path d="M29 85 15 100 21 108 39 96 M70 85 82 98 76 106 61 96" fill="#376b88" {...shared} />
          <ellipse cx="50" cy="50" rx="21" ry="25" fill="#835136" {...shared} />
          <path d="M29 48 Q25 25 50 24 Q76 25 71 49 L66 39 52 35 39 40Z" fill="#32241d" />
          <path d="M30 38 Q21 26 35 17 Q50 8 66 18 Q78 24 70 39 L61 28 39 29Z" fill="#eee4cf" stroke="#c7b99c" strokeWidth="2" />
          <path d="M32 30 Q50 39 69 29 M33 25 Q50 33 68 24" fill="none" stroke="#c6b591" strokeWidth="3" />
          <path d="M39 49h4 M57 49h4" stroke="#211916" strokeWidth="3" strokeLinecap="round" />
          <path d="M42 59 Q50 63 58 58" fill="none" stroke="#efc39a" strokeWidth="2" />
          <path d="M36 53 Q50 70 64 53" fill="none" stroke="#513526" strokeWidth="4" />
          <path d="M64 88 82 81 89 87 74 103 62 100Z" fill="#d8e4ec" stroke="#6c8494" strokeWidth="2" />
          <path d="M74 87 83 89 76 97" fill="none" stroke="#6c8494" strokeWidth="2" />
        </g>
      </svg>
    )
  }

  const palettes: Record<Exclude<AgentKind, 'king' | 'griot' | 'researcher' | 'spirits'>, { cloth: string; head: string; accent: string; skin: string }> = {
    notary: { cloth: '#5c3a82', head: '#bc3b78', accent: '#f0bf54', skin: '#8a5237' },
    developer: { cloth: '#266b55', head: '#2e2824', accent: '#65b9a2', skin: '#75452f' },
    creative: { cloth: '#246a91', head: '#236a91', accent: '#edb24d', skin: '#855036' },
    advisor: { cloth: '#3d6a3d', head: '#9f7435', accent: '#e7c361', skin: '#69402c' },
  }
  const palette = palettes[kind as keyof typeof palettes] || palettes.advisor
  const label = kind === 'notary' ? 'La Guérisseuse' : kind === 'developer' ? 'Le Développeur' : kind === 'creative' ? 'La Créative' : 'Le Conseiller'

  return (
    <svg viewBox="0 0 100 140" className={`character-svg ${active ? 'character-active' : ''}`} role="img" aria-label={label}>
      <ellipse cx="50" cy="132" rx="28" ry="6" fill="#284b36" opacity=".22" />
      <g className="character-body">
        <path d="M33 83 28 119 43 124 50 94 58 124 73 119 67 83Z" fill="#62432f" {...shared} />
        <path d="M27 77 Q50 67 72 78 L79 123 Q50 136 20 123Z" fill={palette.cloth} {...shared} />
        <path d="M43 79 50 91 59 79 65 124 35 124Z" fill={palette.accent} />
        <path d="M29 85 14 99 20 108 39 96 M71 85 85 97 77 107 61 96" fill={palette.cloth} {...shared} />
        <ellipse cx="50" cy="49" rx="21" ry="25" fill={palette.skin} {...shared} />
        <path d="M29 42 Q25 24 50 23 Q75 24 71 44 L63 34 51 32 39 36Z" fill="#2e241f" />
        <path d="M25 39 Q25 19 44 16 Q65 9 76 31 L70 42 61 30 40 31 31 43Z" fill={palette.head} stroke="#6e4534" strokeWidth="2.5" />
        <path d="M30 29 Q50 38 71 27" fill="none" stroke={palette.accent} strokeWidth="4" />
        <path d="M34 23 Q50 31 67 21" fill="none" stroke={palette.accent} strokeWidth="2" />
        <path d="M39 49h4 M57 49h4" stroke="#211916" strokeWidth="3" strokeLinecap="round" />
        <path d="M42 59 Q50 63 58 58" fill="none" stroke="#efc39a" strokeWidth="2" />
        {kind === 'notary' && (
          <g>
            <path d="M68 64 83 67 87 86 71 92" fill="#f0dfb9" stroke="#815b3c" strokeWidth="2" />
            <path d="M74 73h8 M74 79h8 M74 85h6" stroke="#9a815b" strokeWidth="2" />
          </g>
        )}
        {kind === 'developer' && (
          <g>
            <rect x="62" y="70" width="27" height="20" rx="2" fill="#26384b" stroke="#b7c9d2" strokeWidth="2" />
            <rect x="66" y="74" width="19" height="12" fill="#91d5dd" />
            <path d="m70 80 3 3 5-6" stroke="#2a786d" strokeWidth="2" fill="none" />
            <path d="M59 93h34l-5 5H64Z" fill="#4e6674" />
          </g>
        )}
        {kind === 'creative' && (
          <g>
            <path d="M66 68 86 76 77 94 60 86Z" fill="#f3ead7" stroke="#72553c" strokeWidth="2" />
            <circle cx="73" cy="77" r="3" fill="#d34a35" />
            <circle cx="79" cy="81" r="3" fill="#3b8b73" />
            <circle cx="70" cy="84" r="3" fill="#e7ad42" />
          </g>
        )}
        {kind === 'advisor' && (
          <g>
            <rect x="64" y="70" width="24" height="24" rx="3" fill="#f6efcf" stroke="#806139" strokeWidth="2" />
            <path d="M69 88V82 M76 88V77 M83 88V73" stroke="#39815c" strokeWidth="3" />
          </g>
        )}
      </g>
    </svg>
  )
}
