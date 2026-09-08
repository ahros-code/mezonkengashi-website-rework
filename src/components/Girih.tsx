/**
 * Khatam lattice — the geometric spine of the whole page.
 *
 * The 8-point star is the union of two squares at 45°: outer vertices sit at
 * every 45°, the re-entrant vertices where the edges cross sit at 22.5° offsets
 * on a radius of R·0.7654. Everything else on the page (icons, medallions,
 * section rules) is derived from this same construction.
 */

const INNER_RATIO = 0.76537; // cos(45°)/cos(22.5°)

function starPoints(cx: number, cy: number, r: number, phase = 0) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const a = ((i * 22.5 + phase) * Math.PI) / 180;
    const rad = i % 2 === 0 ? r : r * INNER_RATIO;
    pts.push(`${(cx + rad * Math.cos(a)).toFixed(3)},${(cy + rad * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(" ");
}

function squarePoints(cx: number, cy: number, r: number) {
  const pts: string[] = [];
  for (let i = 0; i < 4; i++) {
    const a = ((i * 90 + 45) * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(3)},${(cy + r * Math.sin(a)).toFixed(3)}`);
  }
  return pts.join(" ");
}

type Props = {
  id: string;
  /** Tile size in user units — larger reads as architecture, smaller as texture. */
  tile?: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  className?: string;
  /** Fills the star bodies as well as stroking them. */
  fill?: string;
};

export function GirihField({
  id,
  tile = 160,
  stroke = "currentColor",
  strokeWidth = 1,
  opacity = 1,
  className,
  fill = "none",
}: Props) {
  const S = tile;
  const R = S * 0.34;
  const q = S * 0.125;

  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={id} width={S} height={S} patternUnits="userSpaceOnUse">
          <g
            fill={fill}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            opacity={opacity}
          >
            {/* stars on the lattice nodes */}
            <polygon points={starPoints(S / 2, S / 2, R)} />
            <polygon points={starPoints(0, 0, R)} />
            <polygon points={starPoints(S, 0, R)} />
            <polygon points={starPoints(0, S, R)} />
            <polygon points={starPoints(S, S, R)} />
            {/* the crosses that fill the interstices */}
            <polygon points={squarePoints(S / 2, 0, q)} />
            <polygon points={squarePoints(S / 2, S, q)} />
            <polygon points={squarePoints(0, S / 2, q)} />
            <polygon points={squarePoints(S, S / 2, q)} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** A single star, used as a seal / bullet / medallion core. */
export function GirihStar({
  size = 24,
  stroke = "currentColor",
  strokeWidth = 1.25,
  fill = "none",
  className,
}: {
  size?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  className?: string;
}) {
  const c = size / 2;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points={starPoints(c, c, c - strokeWidth)}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Medallion for a council member — deterministic from the person's id, so the
 * same person always gets the same figure. No stock portrait stands in for a
 * real scholar.
 */
export function GirihMedallion({
  seed,
  /** Distinguishes two medallions for the same person on one page — the
      gradient id must stay unique or the second one renders the first's fill. */
  scope = "m",
  className,
}: {
  seed: string;
  scope?: string;
  className?: string;
}) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;

  const rings = 3 + (h % 2);
  const phase = (h >> 3) % 45;
  const petals = 8;

  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      fill="none"
    >
      <defs>
        <radialGradient id={`med-${scope}-${seed}`} cx="50%" cy="35%">
          <stop offset="0%" stopColor="#17629c" />
          <stop offset="55%" stopColor="#003a64" />
          <stop offset="100%" stopColor="#00223d" />
        </radialGradient>
      </defs>
      <rect width="200" height="200" fill={`url(#med-${scope}-${seed})`} />

      <g stroke="rgba(248, 183, 0,0.5)" strokeWidth="0.9">
        {Array.from({ length: rings }, (_, i) => (
          <polygon
            key={i}
            points={starPoints(100, 100, 86 - i * 20, phase + i * 11)}
            opacity={0.85 - i * 0.16}
          />
        ))}
      </g>

      <g stroke="rgba(248, 183, 0,0.55)" strokeWidth="0.8">
        {Array.from({ length: petals }, (_, i) => {
          const a = ((i * 360) / petals + phase) * (Math.PI / 180);
          return (
            <circle
              key={i}
              cx={100 + 52 * Math.cos(a)}
              cy={100 + 52 * Math.sin(a)}
              r={17}
              opacity={0.5}
            />
          );
        })}
      </g>

      <polygon
        points={starPoints(100, 100, 26, phase)}
        fill="rgba(248, 183, 0,0.16)"
        stroke="rgba(248, 183, 0,0.7)"
        strokeWidth="1"
      />
    </svg>
  );
}
