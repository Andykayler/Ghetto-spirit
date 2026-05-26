// ─── Graffiti Drip Crown — matches the open-filigree stencil in the image ────

export const HeroCrown = () => (
  <svg
    viewBox="0 0 220 200"
    style={{
      width: 200,
      height: 180,
      filter:
        "drop-shadow(0 0 22px rgba(201,168,76,0.55)) drop-shadow(0 6px 12px rgba(0,0,0,0.8))",
    }}
  >
    <defs>
      <linearGradient id="cg" x1="5%" y1="0%" x2="95%" y2="100%">
        <stop offset="0%"  stopColor="#F2D96A" />
        <stop offset="25%" stopColor="#C9A84C" />
        <stop offset="60%" stopColor="#9A7020" />
        <stop offset="100%" stopColor="#5C3C08" />
      </linearGradient>
      <linearGradient id="cgLight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"  stopColor="#F5E080" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#C9A84C" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#8B6010" stopOpacity="0" />
      </linearGradient>
      <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>

    {/* ── OUTER CROWN SILHOUETTE (filled, with inner cut-outs for filigree look) ── */}

    {/* Left spike */}
    <polygon points="18,128 14,50 26,54 38,90 52,68 58,80 68,38 72,50 84,22 92,30"
      fill="url(#cg)" filter="url(#rough)" />
    {/* Right spike */}
    <polygon points="202,128 206,50 194,54 182,90 168,68 162,80 152,38 148,50 136,22 128,30"
      fill="url(#cg)" filter="url(#rough)" />
    {/* Centre spike */}
    <polygon points="72,50 84,22 110,5 136,22 148,50 128,38 110,12 92,38"
      fill="url(#cg)" filter="url(#rough)" />

    {/* Main crown body — large trapezoid */}
    <path
      d="M14,128 L14,60 L38,90 L58,80 L68,38 L92,30 L110,12 L128,30 L152,38 L162,80 L182,90 L206,60 L206,128 Z"
      fill="url(#cg)"
      filter="url(#rough)"
    />

    {/* Inner shadow to create depth / open-top look */}
    <path
      d="M28,128 L28,75 L48,95 L64,84 L76,48 L92,36 L110,18 L128,36 L144,48 L156,84 L172,95 L192,75 L192,128 Z"
      fill="url(#cgLight)"
      opacity="0.35"
    />

    {/* ── BASE BAND ── */}
    <rect x="14" y="120" width="192" height="20" rx="2" fill="url(#cg)" filter="url(#rough)" />
    {/* Band highlight */}
    <rect x="14" y="120" width="192" height="8" rx="2"
      fill="#F5E080" opacity="0.18" />
    {/* Band dark outline */}
    <rect x="14" y="120" width="192" height="20" rx="2"
      fill="none" stroke="#3a2800" strokeWidth="1.5" />

    {/* ── CUTOUT WINDOWS inside crown body for the open/filigree look ── */}
    <path d="M40,118 L40,85 Q55,75 70,85 L70,118 Z" fill="#0e0c09" opacity="0.55" />
    <path d="M78,118 L78,70 Q96,58 110,60 Q124,58 142,70 L142,118 Z" fill="#0e0c09" opacity="0.45" />
    <path d="M150,118 L150,85 Q165,75 180,85 L180,118 Z" fill="#0e0c09" opacity="0.55" />

    {/* ── GEMS on base band ── */}
    <circle cx="55"  cy="130" r="8" fill="#0d0b08" stroke="#C9A84C" strokeWidth="2" />
    <circle cx="55"  cy="130" r="3.5" fill="#D4A840" opacity="0.7" />
    <circle cx="110" cy="130" r="8" fill="#0d0b08" stroke="#C9A84C" strokeWidth="2" />
    <circle cx="110" cy="130" r="3.5" fill="#D4A840" opacity="0.7" />
    <circle cx="165" cy="130" r="8" fill="#0d0b08" stroke="#C9A84C" strokeWidth="2" />
    <circle cx="165" cy="130" r="3.5" fill="#D4A840" opacity="0.7" />

    {/* ── DARK OUTLINE over entire crown for stencil definition ── */}
    <path
      d="M14,128 L14,60 L38,90 L58,80 L68,38 L92,30 L110,12 L128,30 L152,38 L162,80 L182,90 L206,60 L206,128 Z"
      fill="none"
      stroke="#2a1a02"
      strokeWidth="2"
      filter="url(#rough)"
    />

    {/* ── DRIPS hanging from base ── */}
    {/* drip 1 */}
    <path d="M32,140 Q33,154 31,165 Q29,154 32,140" fill="#C9A84C" opacity="0.88" />
    <ellipse cx="31.5" cy="166" rx="3.5" ry="4.5" fill="#C9A84C" opacity="0.85" />
    {/* drip 2 */}
    <path d="M55,140 Q56,150 55,157 Q54,150 55,140" fill="#C9A84C" opacity="0.7" />
    <ellipse cx="55" cy="158" rx="3" ry="3.5" fill="#C9A84C" opacity="0.65" />
    {/* drip 3 — tallest */}
    <path d="M80,140 Q82,157 80,170 Q78,157 80,140" fill="#C9A84C" opacity="0.92" />
    <ellipse cx="80" cy="171" rx="4.5" ry="5.5" fill="#C9A84C" opacity="0.9" />
    {/* drip 4 */}
    <path d="M110,140 Q112,153 110,162 Q108,153 110,140" fill="#C9A84C" opacity="0.82" />
    <ellipse cx="110" cy="163" rx="3.5" ry="4" fill="#C9A84C" opacity="0.78" />
    {/* drip 5 */}
    <path d="M135,140 Q136,149 135,155 Q134,149 135,140" fill="#C9A84C" opacity="0.65" />
    <ellipse cx="135" cy="156" rx="2.8" ry="3.2" fill="#C9A84C" opacity="0.6" />
    {/* drip 6 */}
    <path d="M158,140 Q160,154 158,164 Q156,154 158,140" fill="#C9A84C" opacity="0.85" />
    <ellipse cx="158" cy="165" rx="4" ry="4.8" fill="#C9A84C" opacity="0.82" />
    {/* drip 7 */}
    <path d="M183,140 Q184,150 183,157 Q182,150 183,140" fill="#C9A84C" opacity="0.6" />
    <ellipse cx="183" cy="158" rx="2.5" ry="3" fill="#C9A84C" opacity="0.55" />

    {/* ── Ambient gold specks ── */}
    <circle cx="6"   cy="80"  r="2"   fill="#F5D78E" opacity="0.5" />
    <circle cx="10"  cy="110" r="1.2" fill="#F5D78E" opacity="0.4" />
    <circle cx="214" cy="75"  r="2"   fill="#F5D78E" opacity="0.48" />
    <circle cx="216" cy="105" r="1.2" fill="#F5D78E" opacity="0.38" />
    <circle cx="110" cy="0"   r="1.8" fill="#F5D78E" opacity="0.55" />
    <circle cx="75"  cy="8"   r="1.2" fill="#F5D78E" opacity="0.42" />
    <circle cx="145" cy="8"   r="1.2" fill="#F5D78E" opacity="0.42" />
  </svg>
);