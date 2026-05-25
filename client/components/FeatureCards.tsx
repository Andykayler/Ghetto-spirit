"use client";

const features = [
  {
    id: "raw-talents",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" x2="12" y1="19" y2="22"/>
      </svg>
    ),
    title: "RAW TALENTS",
    desc: "Discovering the next big stars from the streets.",
    accent: "rgba(212,160,23,0.7)",
    bg: "rgba(20,15,5,0.9)",
    imageStyle: {
      background: 'linear-gradient(135deg, rgba(40,25,5,0.95) 0%, rgba(20,12,2,0.95) 100%)',
    },
    artStyle: { background: 'linear-gradient(135deg, #1a0f02 0%, #0d0700 100%)' },
    artistSvg: true,
  },
  {
    id: "real-content",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    ),
    title: "REAL CONTENT",
    desc: "Music, videos, interviews, freestyles & more.",
    accent: "rgba(212,160,23,0.7)",
    bg: "rgba(15,10,5,0.9)",
    imageStyle: { background: 'linear-gradient(135deg, rgba(25,15,5,0.95) 0%, rgba(15,8,2,0.95) 100%)' },
    artStyle: { background: 'linear-gradient(135deg, #100b00 0%, #080500 100%)' },
    studioSvg: true,
  },
  {
    id: "events-shows",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
        <line x1="16" x2="16" y1="2" y2="6"/>
        <line x1="8" x2="8" y1="2" y2="6"/>
        <line x1="3" x2="21" y1="10" y2="10"/>
        <path d="m9 16 2 2 4-4"/>
      </svg>
    ),
    title: "EVENTS & SHOWS",
    desc: "Competitions, concerts and live experiences.",
    accent: "rgba(180,40,40,0.7)",
    bg: "rgba(15,5,5,0.9)",
    imageStyle: { background: 'linear-gradient(135deg, rgba(30,10,5,0.95) 0%, rgba(20,5,2,0.95) 100%)' },
    artStyle: { background: 'linear-gradient(135deg, #150300 0%, #0d0200 100%)' },
    crowdSvg: true,
  },
  {
    id: "growing-together",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10"/>
        <line x1="12" x2="12" y1="20" y2="4"/>
        <line x1="6" x2="6" y1="20" y2="14"/>
      </svg>
    ),
    title: "GROWING TOGETHER",
    desc: "Building careers and creating lasting impact.",
    accent: "rgba(212,160,23,0.7)",
    bg: "rgba(10,8,2,0.9)",
    imageStyle: { background: 'linear-gradient(135deg, rgba(20,15,0,0.95) 0%, rgba(12,8,0,0.95) 100%)' },
    artStyle: { background: 'linear-gradient(135deg, #0d0800 0%, #050400 100%)' },
    growthSvg: true,
  },
];

export default function FeatureCards() {
  return (
    <section
      className="relative"
      style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(5,3,0,0.97) 15%, rgba(5,3,0,0.97) 100%)',
        marginTop: '-2px',
      }}
    >
      {/* Torn edge top */}
      <div style={{ height: '12px', overflow: 'hidden', position: 'relative' }}>
        <svg viewBox="0 0 1440 12" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <path
            d="M0,12 L0,6 L30,2 L60,8 L90,3 L120,9 L150,4 L180,10 L210,3 L240,8 L270,2 L300,9 L330,4 L360,10 L390,3 L420,8 L450,2 L480,9 L510,4 L540,10 L570,3 L600,8 L630,2 L660,9 L690,4 L720,10 L750,3 L780,8 L810,2 L840,9 L870,4 L900,10 L930,3 L960,8 L990,2 L1020,9 L1050,4 L1080,10 L1110,3 L1140,8 L1170,2 L1200,9 L1230,4 L1260,10 L1290,3 L1320,8 L1350,2 L1380,9 L1410,4 L1440,8 L1440,12 Z"
            fill="rgba(212,160,23,0.2)"
          />
        </svg>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4" style={{ borderTop: '1px solid rgba(212,160,23,0.15)' }}>
        {features.map((f, i) => (
          <div
            key={f.id}
            className="relative overflow-hidden group cursor-pointer"
            style={{
              borderRight: i < 3 ? '1px solid rgba(212,160,23,0.1)' : 'none',
              minHeight: '220px',
            }}
          >
            {/* Card background art */}
            <div
              className="absolute inset-0 transition-all duration-500 group-hover:scale-105"
              style={f.artStyle}
            >
              {/* Inner artwork SVGs */}
              {f.artistSvg && <ArtistArt />}
              {f.studioSvg && <StudioArt />}
              {f.crowdSvg && <CrowdArt />}
              {f.growthSvg && <GrowthArt />}
            </div>

            {/* Overlay gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)`,
              }}
            />

            {/* Accent color top border on hover */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 opacity-0 group-hover:opacity-100"
              style={{ background: f.accent }}
            />

            {/* Content */}
            <div className="relative z-10 p-5 flex flex-col justify-end h-full min-h-[220px]">
              <div
                className="mb-3 transition-all duration-300 group-hover:scale-110"
                style={{ color: f.accent }}
              >
                {f.icon}
              </div>
              <h3
                className="font-barlow-cond font-bold mb-1.5 tracking-wider"
                style={{ fontSize: '15px', color: '#F0F0F0', letterSpacing: '2px' }}
              >
                {f.title}
              </h3>
              <p
                className="font-barlow text-xs leading-relaxed"
                style={{ color: '#888', lineHeight: 1.6 }}
              >
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArtistArt() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 220" preserveAspectRatio="xMidYMid slice">
      {/* Microphone stand */}
      <line x1="100" y1="60" x2="100" y2="180" stroke="rgba(212,160,23,0.15)" strokeWidth="3"/>
      <ellipse cx="100" cy="55" rx="18" ry="22" fill="none" stroke="rgba(212,160,23,0.2)" strokeWidth="2"/>
      {/* Spotlights */}
      <path d="M0,0 L50,100" stroke="rgba(212,160,23,0.06)" strokeWidth="20"/>
      <path d="M200,0 L150,100" stroke="rgba(212,160,23,0.06)" strokeWidth="20"/>
      {/* Stage floor */}
      <rect x="0" y="185" width="200" height="35" fill="rgba(212,160,23,0.05)"/>
      <line x1="0" y1="185" x2="200" y2="185" stroke="rgba(212,160,23,0.15)" strokeWidth="1"/>
      {/* Crowd silhouettes */}
      {[20, 50, 80, 110, 140, 170].map((x) => (
        <ellipse key={x} cx={x} cy={195} rx={10} ry={12} fill="rgba(180,120,0,0.08)"/>
      ))}
    </svg>
  );
}

function StudioArt() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 220" preserveAspectRatio="xMidYMid slice">
      {/* Speaker */}
      <rect x="130" y="40" width="55" height="100" rx="4" fill="rgba(40,25,5,0.8)" stroke="rgba(212,160,23,0.15)" strokeWidth="1"/>
      <circle cx="157" cy="80" r="18" fill="none" stroke="rgba(212,160,23,0.2)" strokeWidth="2"/>
      <circle cx="157" cy="80" r="8" fill="rgba(212,160,23,0.08)"/>
      <rect x="145" y="115" width="25" height="12" rx="2" fill="rgba(212,160,23,0.1)"/>
      {/* Mixing board */}
      <rect x="20" y="130" width="160" height="60" rx="3" fill="rgba(30,20,5,0.8)" stroke="rgba(212,160,23,0.12)" strokeWidth="1"/>
      {[40, 65, 90, 115, 140, 165].map((x) => (
        <rect key={x} x={x} y={140} width={8} height={30} rx={2} fill="rgba(212,160,23,0.12)"/>
      ))}
      {/* Knobs */}
      {[35, 60, 85, 110, 135, 160].map((x) => (
        <circle key={x} cx={x + 4} cy={152} r={5} fill="rgba(212,160,23,0.15)" stroke="rgba(212,160,23,0.2)" strokeWidth="1"/>
      ))}
      {/* Glow */}
      <ellipse cx="100" cy="100" rx="60" ry="40" fill="rgba(180,100,0,0.05)"/>
    </svg>
  );
}

function CrowdArt() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 220" preserveAspectRatio="xMidYMid slice">
      {/* Stage lights */}
      {[30, 100, 170].map((x) => (
        <path key={x} d={`M${x},0 L${x - 40},220 L${x + 40},220 Z`} fill="rgba(200,80,0,0.04)"/>
      ))}
      {/* Crowd silhouettes */}
      {[15, 40, 65, 90, 115, 140, 165, 190].map((x, i) => (
        <ellipse key={x} cx={x} cy={180 + (i % 3) * 8} rx={12} ry={20 + (i % 2) * 5} fill="rgba(150,80,0,0.15)"/>
      ))}
      {/* Arms up */}
      {[30, 80, 130, 175].map((x) => (
        <path key={x} d={`M${x},160 L${x - 8},140 M${x},160 L${x + 8},140`} stroke="rgba(180,100,0,0.2)" strokeWidth="3" strokeLinecap="round"/>
      ))}
      {/* Stage */}
      <rect x="0" y="90" width="200" height="20" fill="rgba(150,60,0,0.1)"/>
      {/* Light beam */}
      <ellipse cx="100" cy="80" rx="30" ry="8" fill="rgba(220,100,0,0.12)"/>
    </svg>
  );
}

function GrowthArt() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 200 220" preserveAspectRatio="xMidYMid slice">
      {/* Growth chart bars */}
      {[
        { x: 20, h: 40, y: 160 },
        { x: 50, h: 70, y: 130 },
        { x: 80, h: 55, y: 145 },
        { x: 110, h: 100, y: 100 },
        { x: 140, h: 80, y: 120 },
        { x: 170, h: 130, y: 70 },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={b.y} width={22} height={b.h} rx={2} fill="rgba(212,160,23,0.12)" stroke="rgba(212,160,23,0.2)" strokeWidth="1"/>
      ))}
      {/* Trend line */}
      <path d="M30,165 Q80,130 100,110 Q140,85 185,65" stroke="rgba(212,160,23,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Rising dots */}
      <circle cx="30" cy="165" r="3" fill="rgba(212,160,23,0.5)"/>
      <circle cx="100" cy="110" r="3" fill="rgba(212,160,23,0.5)"/>
      <circle cx="185" cy="65" r="4" fill="rgba(212,160,23,0.7)"/>
      {/* Arrow */}
      <path d="M185,65 L192,55 M185,65 L178,55" stroke="rgba(212,160,23,0.6)" strokeWidth="2" strokeLinecap="round"/>
      {/* Grid lines */}
      {[80, 120, 160].map((y) => (
        <line key={y} x1="10" y1={y} x2="190" y2={y} stroke="rgba(212,160,23,0.06)" strokeWidth="1"/>
      ))}
    </svg>
  );
}
