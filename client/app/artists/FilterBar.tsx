import { Category } from "./types";
import { SearchIcon, ChevronDownIcon } from "./Icons";

// ─── Filter Bar ───────────────────────────────────────────────────────────────
// Matches design image exactly:
//   - Dark #0a0a0a bg, no visible border top
//   - LEFT: tightly packed category tabs, active = gold text + full-width gold underline
//   - RIGHT: search input (border, placeholder, magnifier right-aligned) + genre dropdown
//   - Fonts: Barlow Condensed, uppercase, tight tracking, small size
// ──────────────────────────────────────────────────────────────────────────────

interface FilterBarProps {
  categories: Category[];
  genres: string[];
  activeCategory: Category;
  selectedGenre: string;
  searchQuery: string;
  genreOpen: boolean;
  onCategoryChange: (cat: Category) => void;
  onGenreChange: (genre: string) => void;
  onSearchChange: (query: string) => void;
  onGenreToggle: () => void;
}

export function FilterBar({
  categories,
  genres,
  activeCategory,
  selectedGenre,
  searchQuery,
  genreOpen,
  onCategoryChange,
  onGenreChange,
  onSearchChange,
  onGenreToggle,
}: FilterBarProps) {
  return (
    <section
      style={{
        background: "#0a0a0a",
        borderBottom: "1px solid #1c1c1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: 52,
        position: "relative",
        zIndex: 10,
      }}
    >

      {/* ── LEFT: Category tabs ── */}
      <div style={{ display: "flex", alignItems: "stretch", height: "100%" }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              style={{
                position: "relative",
                padding: "0 14px",
                height: "100%",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: isActive ? "#C9A84C" : "#888888",
                whiteSpace: "nowrap",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.color = "#cccccc";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.color = "#888888";
              }}
            >
              {cat}
              {/* Gold underline — full width of button, at very bottom */}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: "#C9A84C",
                    display: "block",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── RIGHT: Search + Genre ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

        {/* Search input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#111111",
            border: "1px solid #2c2c2c",
            height: 34,
            padding: "0 10px",
            gap: 8,
            minWidth: 220,
          }}
        >
          <input
            type="text"
            placeholder="SEARCH ARTISTS..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              flex: 1,
              color: "#aaaaaa",
              fontSize: "0.72rem",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          />
          {/* Magnifier icon — right side */}
          <span style={{ color: "#555555", display: "flex", alignItems: "center", flexShrink: 0 }}>
            <SearchIcon />
          </span>
        </div>

        {/* Genre dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={onGenreToggle}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              background: "#111111",
              border: "1px solid #2c2c2c",
              height: 34,
              padding: "0 12px",
              minWidth: 148,
              cursor: "pointer",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#aaaaaa",
            }}
          >
            <span>{selectedGenre}</span>
            <span style={{ color: "#666666", display: "flex", alignItems: "center" }}>
              <ChevronDownIcon />
            </span>
          </button>

          {genreOpen && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 50,
                marginTop: 2,
                background: "#141414",
                border: "1px solid #2c2c2c",
              }}
            >
              {genres.map((g) => (
                <button
                  key={g}
                  onClick={() => onGenreChange(g)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 12px",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: selectedGenre === g ? "#C9A84C" : "#777777",
                    background: selectedGenre === g ? "rgba(201,168,76,0.07)" : "transparent",
                    transition: "background 0.12s, color 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    if (selectedGenre !== g) {
                      (e.currentTarget as HTMLButtonElement).style.color = "#cccccc";
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedGenre !== g) {
                      (e.currentTarget as HTMLButtonElement).style.color = "#777777";
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    }
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}