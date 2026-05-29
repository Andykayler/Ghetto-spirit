// HeroCrown.tsx

export const HeroCrown = () => (
  <svg
    viewBox="0 0 220 200"
    style={{
      width: "160px",
      height: "140px",
      maxWidth: "100%",
      filter:
        "drop-shadow(0 0 18px rgba(212,175,55,0.22)) drop-shadow(0 8px 18px rgba(0,0,0,0.65))",
    }}
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7D774" />
        <stop offset="30%" stopColor="#D4AF37" />
        <stop offset="65%" stopColor="#A97B18" />
        <stop offset="100%" stopColor="#6F4A08" />
      </linearGradient>

      <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFF1B8" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#FFF1B8" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* MAIN */}
    <path
      d="
        M20 135
        L20 72
        L48 98
        L72 45
        L110 15
        L148 45
        L172 98
        L200 72
        L200 135
        Z
      "
      fill="url(#goldGradient)"
      stroke="#2A1B05"
      strokeWidth="3"
    />

    {/* CUTOUTS */}
    <path
      d="M88 128 L88 72 Q110 52 132 72 L132 128 Z"
      fill="#0A0A0A"
      opacity="0.55"
    />

    <path
      d="M42 128 L42 92 Q55 78 70 92 L70 128 Z"
      fill="#0A0A0A"
      opacity="0.45"
    />

    <path
      d="M150 128 L150 92 Q165 78 178 92 L178 128 Z"
      fill="#0A0A0A"
      opacity="0.45"
    />

    {/* HIGHLIGHT */}
    <path
      d="
        M26 122
        L26 82
        L50 102
        L74 52
        L110 24
        L146 52
        L170 102
        L194 82
        L194 122
        Z
      "
      fill="url(#goldHighlight)"
      opacity="0.35"
    />

    {/* BASE */}
    <rect
      x="18"
      y="126"
      width="184"
      height="18"
      rx="3"
      fill="url(#goldGradient)"
      stroke="#2A1B05"
      strokeWidth="2"
    />

    {/* GEMS */}
    {[58, 110, 162].map((x) => (
      <g key={x}>
        <circle
          cx={x}
          cy="135"
          r="8"
          fill="#0A0A0A"
          stroke="#D4AF37"
          strokeWidth="2"
        />
        <circle
          cx={x}
          cy="135"
          r="3"
          fill="#D4AF37"
          opacity="0.8"
        />
      </g>
    ))}

    {/* DRIPS */}
    <path
      d="M40 144 Q42 160 40 172"
      stroke="#D4AF37"
      strokeWidth="4"
      strokeLinecap="round"
    />

    <path
      d="M80 144 Q82 154 80 162"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />

    <path
      d="M110 144 Q113 164 110 178"
      stroke="#D4AF37"
      strokeWidth="5"
      strokeLinecap="round"
    />

    <path
      d="M145 144 Q147 156 145 166"
      stroke="#D4AF37"
      strokeWidth="3"
      strokeLinecap="round"
    />

    <path
      d="M182 144 Q184 158 182 170"
      stroke="#D4AF37"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* DRIP ENDS */}
    <circle cx="40" cy="173" r="3" fill="#D4AF37" />
    <circle cx="80" cy="163" r="2.5" fill="#D4AF37" />
    <circle cx="110" cy="179" r="4" fill="#D4AF37" />
    <circle cx="145" cy="167" r="2.5" fill="#D4AF37" />
    <circle cx="182" cy="171" r="3" fill="#D4AF37" />
  </svg>
);