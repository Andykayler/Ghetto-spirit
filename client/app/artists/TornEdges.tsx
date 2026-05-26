// ─── Torn Paper Edge Decorations ─────────────────────────────────────────────

export const TornEdgeBottom = () => (
  <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
      <path
        d="M0,0 L0,40 Q30,58 60,42 Q90,26 130,48 Q170,62 210,44 Q250,28 290,50 Q330,62 375,45 Q415,30 455,52 Q495,62 535,44 Q575,28 615,50 Q655,62 700,43 Q740,26 780,48 Q820,62 860,44 Q900,28 940,50 Q985,63 1025,46 Q1065,30 1105,52 Q1145,62 1185,44 Q1230,26 1280,50 Q1350,64 1440,46 L1440,0 Z"
        fill="#0A0A0A"
      />
    </svg>
  </div>
);

export const TornEdgeTop = () => (
  <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ lineHeight: 0 }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
      <path
        d="M0,60 L0,20 Q30,4 60,18 Q90,32 130,12 Q170,0 210,16 Q250,32 290,10 Q330,0 375,15 Q415,30 455,8 Q495,0 535,16 Q575,32 615,10 Q655,0 700,17 Q740,34 780,12 Q820,0 860,16 Q900,32 940,10 Q985,0 1025,14 Q1065,30 1105,8 Q1145,0 1185,16 Q1230,34 1280,10 Q1350,0 1440,14 L1440,60 Z"
        fill="#0d0d0d"
      />
    </svg>
  </div>
);
