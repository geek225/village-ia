import { Hut } from './Hut'
import { Tree } from './Tree'

export function VillageLandscape() {
  return (
    <svg className="landscape" viewBox="0 0 1200 780" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <pattern id="grassTexture" width="34" height="34" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="9" r="1.5" fill="#6ba259" opacity=".5" />
          <circle cx="23" cy="25" r="1.2" fill="#47894e" opacity=".45" />
          <path d="M15 4l-2 5 5-2" stroke="#6b9e50" strokeWidth="1.2" fill="none" opacity=".5" />
        </pattern>
        <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#acd487" />
          <stop offset="1" stopColor="#88ba6c" />
        </linearGradient>
        <linearGradient id="water" x1="0" x2="1" y1="0" y2="1">
          <stop stopColor="#68d1df" />
          <stop offset="1" stopColor="#2295b4" />
        </linearGradient>
        <pattern id="waterLines" width="50" height="26" patternUnits="userSpaceOnUse">
          <path d="M2 10q11 -6 21 0t22 0" fill="none" stroke="#caf4ef" strokeWidth="2" opacity=".55" />
        </pattern>
      </defs>

      <rect width="1200" height="780" fill="url(#ground)" />
      <rect width="1200" height="780" fill="url(#grassTexture)" />

      {/* Main East-West Village Pathway */}
      <path
        d="M-40 264 Q170 210 310 289 T620 294 T940 295 T1240 245 L1240 398 Q1000 435 840 389 T535 400 T260 390 T-40 414Z"
        fill="#d6b16c"
        stroke="#c19a58"
        strokeWidth="4"
      />
      <path
        d="M-40 278 Q170 231 310 307 T620 313 T940 313 T1240 263"
        fill="none"
        stroke="#f0d69c"
        strokeWidth="22"
        strokeLinecap="round"
      />

      {/* Royal Access Pathway (to Palace) */}
      <path
        d="M410 -20 Q390 120 490 230 T525 450 T435 620"
        fill="none"
        stroke="#d6b16c"
        strokeWidth="94"
      />
      <path
        d="M410 -20 Q390 120 490 230 T525 450 T435 620"
        fill="none"
        stroke="#f0d69c"
        strokeWidth="17"
      />

      {/* South Village Pathway */}
      <path
        d="M-20 578 Q165 520 310 572 T592 597 T850 567 T1230 615"
        fill="none"
        stroke="#d7b16c"
        strokeWidth="90"
      />
      <path
        d="M-20 578 Q165 520 310 572 T592 597 T850 567 T1230 615"
        fill="none"
        stroke="#f0d69c"
        strokeWidth="17"
      />

      {/* River and water bank */}
      <path
        d="M835 655 Q910 606 975 648 T1115 656 T1235 635 L1235 790 L790 790 Q830 725 835 655Z"
        fill="url(#water)"
        stroke="#328d88"
        strokeWidth="7"
      />
      <path
        d="M835 655 Q910 606 975 648 T1115 656 T1235 635 L1235 790 L790 790 Q830 725 835 655Z"
        fill="url(#waterLines)"
      />
      <path
        d="M860 666 Q915 639 965 667 T1085 669"
        fill="none"
        stroke="#d7f4eb"
        strokeWidth="4"
        opacity=".8"
      />
      <path
        d="M835 658 818 691 827 736 862 774 M1230 643 1207 690 1219 740"
        fill="none"
        stroke="#47794b"
        strokeWidth="20"
      />

      {/* Fences and vegetable gardens */}
      <g stroke="#835833" strokeWidth="7" strokeLinecap="round">
        <path d="M22 440V518 M60 439V516 M98 439V516 M136 438V515 M18 458H143 M18 488H143" />
        <path d="M934 458V526 M973 458V526 M1012 458V526 M1051 458V526 M930 477H1059 M930 505H1059" />
      </g>
      <g fill="#6eac50" stroke="#4e9145" strokeWidth="2">
        <circle cx="45" cy="475" r="9" />
        <circle cx="78" cy="474" r="10" />
        <circle cx="113" cy="476" r="9" />
        <circle cx="957" cy="492" r="8" />
        <circle cx="1000" cy="493" r="9" />
        <circle cx="1041" cy="492" r="8" />
      </g>

      {/* Market Stalls */}
      <g transform="translate(111 641)">
        <rect x="-43" y="0" width="88" height="52" rx="5" fill="#d9ad67" stroke="#875632" strokeWidth="4" />
        <path d="M-49 3V-27H51V3Z" fill="#f1d49c" stroke="#875632" strokeWidth="3" />
        <path d="M-49 -27H-29V3H-49Z M-9 -27H11V3H-9Z M31 -27H51V3H31Z" fill="#d9583b" />
        <path d="M-29 -27V3 M-9 -27V3 M11 -27V3 M31 -27V3" stroke="#875632" strokeWidth="3" />
        <path d="M-35 15H35" stroke="#a97c44" strokeWidth="4" />
      </g>
      <g transform="translate(1054 583)">
        <rect x="-39" y="0" width="78" height="48" rx="5" fill="#d9ad67" stroke="#875632" strokeWidth="4" />
        <path d="M-45 3V-25H45V3Z" fill="#f1d49c" stroke="#875632" strokeWidth="3" />
        <path d="M-45 -25H-27V3H-45Z M-9 -25H9V3H-9Z M27 -25H45V3H27Z" fill="#2c94aa" />
        <path d="M-27 -25V3 M-9 -25V3 M9 -25V3 M27 -25V3" stroke="#875632" strokeWidth="3" />
      </g>

      {/* Specialists Huts */}
      <Hut x={205} y={160} scale={0.78} roof="#b76b43" name="Chercheur" />
      <Hut x={966} y={174} scale={0.78} roof="#bb7543" name="Guérisseuse" />
      <Hut x={206} y={491} scale={0.74} roof="#98703f" name="Développeur" />
      <Hut x={641} y={598} scale={0.66} roof="#a45e3f" name="Créative" />
      <Hut x={1000} y={493} scale={0.75} roof="#936a3f" name="Conseiller" />

      {/* Royal Palace Court */}
      <g transform="translate(600 152)">
        <ellipse cx="0" cy="112" rx="182" ry="38" fill="#315b3c" opacity=".16" />
        <path d="M-171 84 -154 -24 -117 -57 117 -57 154 -24 171 84Z" fill="#b9693f" stroke="#81442e" strokeWidth="6" />
        <path d="M-180 -24 0 -104 180 -24Z" fill="#dda446" stroke="#9d6627" strokeWidth="6" />
        <path d="M-150 -28 0 -88 150 -28" fill="none" stroke="#f7d274" strokeWidth="8" />
        <path d="M-136 -15H136V78H-136Z" fill="#e4c27c" stroke="#a67a43" strokeWidth="5" />
        <path d="M-102 -12V75 M-51 -12V75 M0 -12V75 M51 -12V75 M102 -12V75" stroke="#a96a39" strokeWidth="11" />
        <path d="M-126 1H126 M-126 30H126 M-126 59H126" stroke="#f2d99e" strokeWidth="4" />
        <path d="M-58 82 -43 117H43L58 82Z" fill="#c64c35" stroke="#8d3527" strokeWidth="5" />
        <path d="M-40 84 0 114 40 84" fill="none" stroke="#f1c45a" strokeWidth="7" />
        <path d="M-145 -14 -145 -78 -116 -64 -91 -78 -91 -14Z" fill="#bd302b" stroke="#e8bd52" strokeWidth="4" />
        <path d="M-131 -59 0 -46 -106 -31Z" fill="#f1c355" />
        <path d="M91 -14V-78L116 -64 145 -78V-14Z" fill="#bd302b" stroke="#e8bd52" strokeWidth="4" />
        <path d="M104 -59 0 -46 130 -31Z" fill="#f1c355" />
        <g fill="#f1c45a">
          <circle cx="-147" cy="-85" r="7" />
          <circle cx="147" cy="-85" r="7" />
          <circle cx="0" cy="-108" r="9" />
        </g>
      </g>

      {/* Sacred Village Well */}
      <g transform="translate(393 438)">
        <ellipse cx="0" cy="8" rx="46" ry="17" fill="#4c7844" opacity=".18" />
        <path d="M-40 -2V30Q0 49 40 30V-2Z" fill="#858c85" stroke="#4b6250" strokeWidth="5" />
        <ellipse cx="0" cy="-2" rx="40" ry="14" fill="#c8d3cd" stroke="#526b59" strokeWidth="5" />
        <ellipse cx="0" cy="-2" rx="27" ry="8" fill="#398fa2" />
        <path d="M-23 -6q12-6 23 0t23 0" fill="none" stroke="#8ee0dc" strokeWidth="3" />
      </g>

      {/* River Wooden Bridge */}
      <g transform="translate(917 704) rotate(-13)">
        <path d="M-72 -10 Q0 -31 72 -10L72 24Q0 2 -72 24Z" fill="#a66e3b" stroke="#74482c" strokeWidth="5" />
        <path d="M-57 -10V22 M-37 -14V17 M-17 -18V12 M3 -18V12 M23 -15V15 M43 -12V18 M62 -9V21" stroke="#e2b779" strokeWidth="4" />
        <path d="M-80 -19Q0 -41 80 -19 M-80 28Q0 6 80 28" fill="none" stroke="#68462e" strokeWidth="5" />
      </g>

      {/* Vegetation & Sacred Trees */}
      <Tree x={48} y={90} scale={0.8} />
      <Tree x={376} y={102} scale={0.9} />
      <Tree x={786} y={95} scale={0.9} />
      <Tree x={1133} y={100} scale={0.85} />
      <Tree x={71} y={338} scale={0.8} />
      <Tree x={836} y={384} scale={0.9} />
      <Tree x={1139} y={355} scale={0.8} />
      <Tree x={395} y={616} scale={0.9} />
      <Tree x={751} y={518} scale={0.8} />
      <Tree x={1130} y={680} scale={0.8} />
      <Tree x={50} y={693} scale={0.75} />
      <Tree x={1100} y={260} scale={0.8} baobab />

      {/* Flowers and pebbles */}
      <g fill="#f1c55c" opacity=".9">
        <circle cx="313" cy="311" r="4" />
        <circle cx="331" cy="321" r="3" />
        <circle cx="862" cy="329" r="4" />
        <circle cx="842" cy="345" r="3" />
        <circle cx="729" cy="608" r="3" />
        <circle cx="286" cy="698" r="4" />
      </g>
    </svg>
  )
}
