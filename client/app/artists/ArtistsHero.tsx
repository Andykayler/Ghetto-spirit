import { HeroCrown } from "./HeroCrown";

// ─── Artists Hero Section ─────────────────────────────────────────────────────
// Layout (matches design image):
//   [LEFT 44%]  "OUR ARTISTS" (huge white) + gold italic tagline below
//   [1px gold divider line, ~80px tall, vertically centered]
//   [CENTER 28%] description paragraph
//   [RIGHT 28%] crown SVG pushed to far right edge
//
// Background: near-black warm dark, heavy gold paint splatter LEFT + BOTTOM-RIGHT
// Bottom: white torn paper rip edge across full width
// ──────────────────────────────────────────────────────────────────────────────

export function ArtistsHero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0c0b08",
        // Fixed height matching the image proportion — hero is compact, ~210px content + 48px torn edge
        paddingBottom: 48,
      }}
    >
      {/* ── 1. Warm dark radial background ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 140% 110% at 10% 55%, #281900 0%, #1c1104 25%, #0e0a03 55%, #080704 100%)",
        }}
      />

      {/* ── 2. Subtle grain/noise texture ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.3,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "140px 140px",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* ── 3. Gold paint splatter — LEFT (large warm blob, matches image) ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "22%",
          pointerEvents: "none",
          opacity: 0.62,
        }}
      >
        <svg
          viewBox="0 0 280 240"
          preserveAspectRatio="xMinYMid slice"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <radialGradient id="sl1" cx="22%" cy="38%" r="62%">
              <stop offset="0%"  stopColor="#D4900A" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#A06810" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#5C3C08" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sl2" cx="50%" cy="78%" r="48%">
              <stop offset="0%"  stopColor="#C9840A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7A4C06" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Main large warm blob */}
          <ellipse cx="55" cy="95" rx="140" ry="105" fill="url(#sl1)" />
          {/* Lower secondary blob */}
          <ellipse cx="120" cy="210" rx="90" ry="58" fill="url(#sl2)" />
          {/* Splatter dots */}
          <circle cx="18"  cy="22"  r="10" fill="#C98A0E" opacity="0.38" />
          <circle cx="45"  cy="10"  r="5"  fill="#D4960C" opacity="0.28" />
          <circle cx="8"   cy="55"  r="6"  fill="#B87808" opacity="0.32" />
          <circle cx="180" cy="68"  r="4"  fill="#C9840A" opacity="0.2" />
          <circle cx="155" cy="32"  r="7"  fill="#C9840A" opacity="0.18" />
          <circle cx="210" cy="115" r="3"  fill="#D4960C" opacity="0.16" />
          <circle cx="35"  cy="158" r="5"  fill="#C9840A" opacity="0.26" />
          <circle cx="80"  cy="228" r="4"  fill="#B87808" opacity="0.2" />
          {/* Paint streak smears */}
          <path d="M15,45 Q50,38 85,54 Q60,61 15,50Z" fill="#C98A0E" opacity="0.22" />
          <path d="M4,112 Q42,100 75,117 Q48,125 4,120Z" fill="#A06810" opacity="0.2" />
          <path d="M90,168 Q145,155 178,172 Q150,180 90,175Z" fill="#C9840A" opacity="0.16" />
        </svg>
      </div>

      {/* ── 4. Gold paint splatter — BOTTOM RIGHT ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 44, // sits above torn edge
          width: "32%",
          height: "70%",
          pointerEvents: "none",
          opacity: 0.42,
        }}
      >
        <svg
          viewBox="0 0 380 180"
          preserveAspectRatio="xMaxYMax slice"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <radialGradient id="sr1" cx="75%" cy="85%" r="52%">
              <stop offset="0%"  stopColor="#C98A0A" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#7A4C06" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="300" cy="155" rx="120" ry="65" fill="url(#sr1)" />
          <circle cx="372" cy="95"  r="7"   fill="#C9840A" opacity="0.28" />
          <circle cx="340" cy="80"  r="4"   fill="#D4960C" opacity="0.22" />
          <circle cx="358" cy="132" r="5"   fill="#C9840A" opacity="0.18" />
        </svg>
      </div>

      {/* ── 5. Gold dust particles ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {([
          [12,18,3],[6,52,2],[20,72,2.5],[4,88,2],[16,38,1.5],
          [83,14,2],[90,32,1.5],[76,58,2],[93,78,1.5],[86,8,2.5],
          [43,7,1.5],[50,23,2],[36,43,1.5],[58,4,2],
          [68,85,1.5],[63,68,2],[73,93,1.5],
        ] as [number,number,number][]).map(([x, y, s], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: s,
              height: s,
              borderRadius: "50%",
              background: "#C9A84C",
              opacity: 0.12 + (i % 5) * 0.07,
            }}
          />
        ))}
      </div>

      {/* ── 6. MAIN CONTENT ROW ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          // Horizontal padding matches image — generous left, tight right
          padding: "38px 48px 0 48px",
          gap: 0,
          minHeight: 170,
        }}
      >

        {/* ── LEFT: Title + Tagline (~44% width) ── */}
        <div style={{ flex: "0 0 44%", paddingRight: 36 }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "clamp(4rem, 7.5vw, 6.8rem)",
              color: "#ffffff",
              lineHeight: 0.92,
              letterSpacing: "0.02em",
              margin: 0,
              // Subtle text shadow like the image — no glow, just depth
              textShadow: "3px 3px 0 rgba(0,0,0,0.6)",
            }}
          >
            OUR ARTISTS
          </h1>
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              color: "#C9A84C",
              fontSize: "clamp(0.88rem, 1.25vw, 1.1rem)",
              fontWeight: 600,
              fontStyle: "italic",
              letterSpacing: "0.2em",
              marginTop: 14,
              marginBottom: 0,
            }}
          >
            RAW TALENT. REAL STORIES. ONE MOVEMENT.
          </p>
        </div>

        {/* ── DIVIDER: 1px vertical gold line ── */}
        <div
          style={{
            flexShrink: 0,
            width: 1,
            height: 86,
            background: "linear-gradient(to bottom, transparent 0%, #C9A84C 20%, #C9A84C 80%, transparent 100%)",
            opacity: 0.75,
            alignSelf: "center",
          }}
        />

        {/* ── CENTER: Description (~27% width) ── */}
        <div style={{ flex: "0 0 27%", paddingLeft: 36, paddingRight: 24 }}>
          <p
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: "#c0b8ae",
              fontSize: "0.875rem",
              lineHeight: 1.78,
              margin: 0,
            }}
          >
            We represent a diverse family of artists who live the culture and speak the truth. From
            emerging voices to established forces, this is the future of entertainment.
          </p>
        </div>

        {/* ── RIGHT: Crown (~29% width, right-aligned) ── */}
        <div
          style={{
            flex: "0 0 29%",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingRight: 8,
          }}
        >
          <HeroCrown />
        </div>

      </div>

      {/* ── 7. City skyline silhouette — faint gold, sits just above torn edge ── */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 0,
          right: 0,
          pointerEvents: "none",
          opacity: 0.17,
        }}
      >
        <svg
          viewBox="0 0 1440 70"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 70, display: "block" }}
        >
          <path
            d="M0,70 L0,50 L25,50 L25,42 L42,42 L42,34 L52,34 L52,28 L62,28 L62,22 L72,22
               L72,28 L82,28 L82,22 L90,22 L90,14 L98,14 L98,10 L106,10 L106,14 L114,14
               L114,22 L122,22 L122,28 L134,28 L134,34 L148,34 L148,40 L162,40 L162,34
               L172,34 L172,26 L182,26 L182,18 L190,18 L190,10 L198,10 L198,18 L206,18
               L206,26 L218,26 L218,34 L232,34 L232,40 L248,40 L248,34 L262,34 L262,26
               L274,26 L274,16 L284,16 L284,8 L294,8 L294,16 L304,16 L304,26 L318,26
               L318,34 L334,34 L334,40 L350,40 L350,34 L364,34 L364,24 L376,24 L376,14
               L386,14 L386,6 L396,6 L396,14 L406,14 L406,24 L420,24 L420,34 L436,34
               L436,40 L454,40 L454,34 L468,34 L468,24 L480,24 L480,16 L490,16 L490,8
               L500,8 L500,16 L510,16 L510,24 L524,24 L524,34 L540,34 L540,40 L558,40
               L558,34 L572,34 L572,24 L584,24 L584,16 L594,16 L594,8 L604,8 L604,16
               L614,16 L614,24 L628,24 L628,34 L644,34 L644,40 L662,40 L662,34 L676,34
               L676,24 L688,24 L688,14 L698,14 L698,6 L708,6 L708,14 L718,14 L718,24
               L732,24 L732,34 L748,34 L748,40 L766,40 L766,34 L780,34 L780,24 L792,24
               L792,16 L802,16 L802,8 L812,8 L812,16 L822,16 L822,24 L836,24 L836,34
               L852,34 L852,40 L870,40 L870,34 L884,34 L884,24 L896,24 L896,14 L906,14
               L906,6 L916,6 L916,14 L926,14 L926,24 L940,24 L940,34 L956,34 L956,40
               L974,40 L974,34 L988,34 L988,24 L1000,24 L1000,16 L1010,16 L1010,8 L1020,8
               L1020,16 L1030,16 L1030,24 L1044,24 L1044,34 L1060,34 L1060,40 L1078,40
               L1078,34 L1092,34 L1092,24 L1104,24 L1104,14 L1114,14 L1114,6 L1124,6
               L1124,14 L1134,14 L1134,24 L1148,24 L1148,34 L1164,34 L1164,40 L1182,40
               L1182,34 L1196,34 L1196,24 L1208,24 L1208,16 L1218,16 L1218,8 L1228,8
               L1228,16 L1238,16 L1238,24 L1252,24 L1252,34 L1268,34 L1268,40 L1286,40
               L1286,34 L1302,34 L1302,26 L1316,26 L1316,18 L1326,18 L1326,26 L1336,26
               L1336,34 L1354,34 L1354,42 L1376,42 L1376,48 L1408,48 L1408,52 L1440,52
               L1440,70 Z"
            fill="#C9A84C"
          />
        </svg>
      </div>

      {/* ── 8. Torn white paper rip edge ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          lineHeight: 0,
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          style={{ width: "100%", height: 48, display: "block" }}
        >
          {/* Main white tear */}
          <path
            d="M0,48 L0,30
               Q10,20 22,28 Q30,34 42,22 Q50,12 62,24 Q70,32 82,18
               Q90,8 103,20 Q112,30 124,16 Q133,5 146,18
               Q155,27 168,14 Q177,4 190,16 Q199,25 212,12
               Q222,2 235,14 Q244,23 258,10 Q268,0 281,12
               Q290,21 304,8 Q314,0 327,12 Q336,21 350,8
               Q360,0 373,12 Q382,21 396,8 Q406,0 419,11
               Q429,20 443,7 Q453,0 466,10 Q476,19 490,6
               Q500,0 514,10 Q524,19 538,6 Q548,0 562,10
               Q572,19 586,6 Q596,0 610,10 Q620,19 634,6
               Q644,0 658,10 Q668,19 682,7 Q692,0 706,11
               Q716,20 730,8 Q740,0 754,12 Q764,21 778,8
               Q788,0 802,12 Q812,21 826,8 Q836,1 850,13
               Q860,22 874,9 Q884,1 898,13 Q908,22 922,9
               Q932,1 946,13 Q956,22 970,9 Q980,2 994,14
               Q1004,23 1018,10 Q1028,2 1042,14 Q1052,23 1066,10
               Q1076,3 1090,15 Q1100,24 1114,11 Q1124,3 1138,15
               Q1148,24 1162,11 Q1172,4 1186,16 Q1196,25 1210,12
               Q1220,4 1234,16 Q1244,25 1258,12 Q1268,5 1282,17
               Q1292,26 1306,13 Q1316,5 1330,17 Q1340,26 1354,14
               Q1364,6 1378,18 Q1388,27 1402,18 Q1414,10 1428,20
               Q1436,27 1440,30 L1440,48 Z"
            fill="#ede8e0"
          />
          {/* Thin shadow line to show paper depth */}
          <path
            d="M0,31 Q90,24 180,32 Q270,40 360,28 Q450,18 540,30
               Q630,40 720,28 Q810,18 900,30 Q990,40 1080,28
               Q1170,18 1260,30 Q1350,40 1440,31"
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2.5"
          />
        </svg>
      </div>

    </section>
  );
}