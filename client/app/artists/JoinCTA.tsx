import { ArrowRightIcon } from "./Icons";

// ─── Join the Movement CTA ────────────────────────────────────────────────────
// Matches design image:
//   - Same #0a0a0a dark bg as grid — no visible bg break
//   - Gold paint splatters bottom-left + bottom-right (same style as hero)
//   - City skyline silhouette faint gold above torn edge
//   - CTA box: 1px gold border, centered, compact
//     - Line 1: "THINK YOU HAVE WHAT IT TAKES?" — small grey condensed
//     - Line 2: "JOIN THE MOVEMENT →" — large Bebas Neue white
//   - Torn white paper rip at very bottom (same as hero bottom)
// ──────────────────────────────────────────────────────────────────────────────

export function JoinCTA() {
  return (
    <section
      style={{
        position: "relative",
        background: "#0a0a0a",
        overflow: "hidden",
        // enough room for content + torn edge 48px
        paddingBottom: 48,
      }}
    >

      {/* ── 1. Warm dark gradient — same atmosphere as hero ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 120% 80% at 50% 100%, #1a1004 0%, #0e0a03 40%, #080604 100%)",
          pointerEvents: "none",
        }}
      />

      {/* ── 2. Gold paint splatter — BOTTOM LEFT ── */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 44,
          width: "28%",
          height: "85%",
          pointerEvents: "none",
          opacity: 0.55,
        }}
      >
        <svg
          viewBox="0 0 300 220"
          preserveAspectRatio="xMinYMax slice"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <radialGradient id="ctasl1" cx="20%" cy="80%" r="60%">
              <stop offset="0%"  stopColor="#C98A0A" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#8B5E08" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#4a3005" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ctasl2" cx="55%" cy="95%" r="45%">
              <stop offset="0%"  stopColor="#A06808" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#5a3a04" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="50"  cy="185" rx="130" ry="80"  fill="url(#ctasl1)" />
          <ellipse cx="160" cy="210" rx="90"  ry="50"  fill="url(#ctasl2)" />
          <circle cx="15"  cy="120" r="10" fill="#C98A0A" opacity="0.32" />
          <circle cx="40"  cy="100" r="5"  fill="#D4960C" opacity="0.24" />
          <circle cx="8"   cy="155" r="6"  fill="#B87808" opacity="0.28" />
          <circle cx="200" cy="170" r="4"  fill="#C9840A" opacity="0.18" />
          <circle cx="250" cy="195" r="3"  fill="#D4960C" opacity="0.14" />
          <path d="M10,145 Q50,135 85,150 Q55,158 10,152Z" fill="#C98A0E" opacity="0.2" />
          <path d="M60,185 Q110,172 145,188 Q115,196 60,192Z" fill="#A06810" opacity="0.18" />
        </svg>
      </div>

      {/* ── 3. Gold paint splatter — BOTTOM RIGHT ── */}
      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: 44,
          width: "30%",
          height: "85%",
          pointerEvents: "none",
          opacity: 0.5,
        }}
      >
        <svg
          viewBox="0 0 300 220"
          preserveAspectRatio="xMaxYMax slice"
          style={{ width: "100%", height: "100%" }}
        >
          <defs>
            <radialGradient id="ctasr1" cx="80%" cy="82%" r="58%">
              <stop offset="0%"  stopColor="#C98A0A" stopOpacity="0.78" />
              <stop offset="50%" stopColor="#8B5E08" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#4a3005" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ctasr2" cx="45%" cy="95%" r="42%">
              <stop offset="0%"  stopColor="#A06808" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#5a3a04" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="255" cy="182" rx="125" ry="78"  fill="url(#ctasr1)" />
          <ellipse cx="145" cy="208" rx="88"  ry="48"  fill="url(#ctasr2)" />
          <circle cx="285" cy="118" r="9"  fill="#C98A0A" opacity="0.3" />
          <circle cx="260" cy="98"  r="5"  fill="#D4960C" opacity="0.22" />
          <circle cx="292" cy="152" r="6"  fill="#B87808" opacity="0.26" />
          <circle cx="100" cy="168" r="4"  fill="#C9840A" opacity="0.16" />
          <path d="M220,142 Q258,132 292,148 Q264,156 220,150Z" fill="#C98A0E" opacity="0.18" />
          <path d="M140,182 Q188,170 222,186 Q192,194 140,190Z" fill="#A06810" opacity="0.16" />
        </svg>
      </div>

      {/* ── 4. Gold dust particles ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {([
          [5,30,2],[10,60,1.5],[3,80,2.5],[18,45,1.5],
          [88,25,2],[93,55,1.5],[82,72,2],[96,85,1.5],
          [45,15,1.5],[52,35,2],[38,55,1.5],[60,8,2],
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
              opacity: 0.1 + (i % 5) * 0.06,
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* ── 5. CTA content — vertically padded, centered ── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "52px 48px 48px",
        }}
      >
        {/* Gold border box */}
        <div
          style={{
            border: "1px solid #C9A84C",
            background: "rgba(201,168,76,0.02)",
            padding: "20px 64px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          {/* Line 1 — small grey label */}
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#666666",
              margin: 0,
            }}
          >
            Think you have what it takes?
          </p>

          {/* Line 2 — large CTA */}
          <button
            style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "1.85rem",
              letterSpacing: "0.1em",
              color: "#ffffff",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 0,
              margin: 0,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
            }}
          >
            JOIN THE MOVEMENT <ArrowRightIcon />
          </button>
        </div>
      </div>

      {/* ── 6. City skyline silhouette — faint gold above torn edge ── */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 0,
          right: 0,
          opacity: 0.16,
          pointerEvents: "none",
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

      {/* ── 7. Torn white paper rip — identical to hero bottom ── */}
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