import type { ServiceId } from "@/lib/site";

/**
 * Service icons drawn from the same construction as the khatam lattice —
 * octagram, pointed arch, 45° square. They are meant to read as one set of
 * marks cut by the same hand, not as six icons picked from a library.
 */

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.3,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: "false" as const,
};

/** Octagram outline shared by several marks. */
const STAR_24 =
  "M24 6 L28.2 12.8 L36 9 L32.2 16.8 L39 21 L32.2 25.2 L36 33 L28.2 29.2 L24 36 L19.8 29.2 L12 33 L15.8 25.2 L9 21 L15.8 16.8 L12 9 L19.8 12.8 Z";

function Council() {
  return (
    <svg {...base}>
      <path d={STAR_24} />
      <circle cx="24" cy="21" r="4.4" />
      <path d="M10 41h28" />
      <path d="M15 41v-3.4M24 41v-3.4M33 41v-3.4" />
    </svg>
  );
}

function Audit() {
  return (
    <svg {...base}>
      {/* pointed Timurid arch as the document plate */}
      <path d="M11 43V21c0-7.2 5.8-13 13-13s13 5.8 13 13v22z" />
      <path d="M17.5 26.5l4.6 4.6L31 22" />
      <path d="M11 43h26" />
      <path d="M24 8V3" />
    </svg>
  );
}

function Dispute() {
  return (
    <svg {...base}>
      <path d="M24 9v31M14 40h20" />
      <path d="M9 16h30" />
      <path d="M9 16l-5 10a5.4 5.4 0 0 0 10 0z" />
      <path d="M39 16l-5 10a5.4 5.4 0 0 0 10 0z" />
      <path d="M24 9a2.6 2.6 0 1 0 0-.1z" />
    </svg>
  );
}

function Education() {
  return (
    <svg {...base}>
      <path d="M24 12L6 19l18 7 18-7z" />
      <path d="M13 23v9c0 3.4 5 6 11 6s11-2.6 11-6v-9" />
      <path d="M42 19v11" />
    </svg>
  );
}

function Consulting() {
  return (
    <svg {...base}>
      {/* the khatam, nested: star, octagon, star — a product built up in layers.
          Drawn as single outlines; two crossed squares read as a hexagram at icon size. */}
      <polygon points="43,24 37.4,29.6 37.4,37.4 29.6,37.4 24,43 18.4,37.4 10.6,37.4 10.6,29.6 5,24 10.6,18.4 10.6,10.6 18.4,10.6 24,5 29.6,10.6 37.4,10.6 37.4,18.4" />
      <polygon points="33.7,28 28,33.7 20,33.7 14.3,28 14.3,20 20,14.3 28,14.3 33.7,20" opacity="0.7" />
      <polygon points="29.4,24 27.8,25.6 27.8,27.8 25.6,27.8 24,29.4 22.4,27.8 20.2,27.8 20.2,25.6 18.6,24 20.2,22.4 20.2,20.2 22.4,20.2 24,18.6 25.6,20.2 27.8,20.2 27.8,22.4" />
    </svg>
  );
}

function Zakat() {
  return (
    <svg {...base}>
      {/* a measured share cut out of the whole */}
      <path d="M24 5a19 19 0 1 1-13.4 32.4" />
      <path d="M24 5v19H10.6" opacity="0.55" />
      <path d="M10.6 37.4A19 19 0 0 1 24 5" strokeDasharray="3 3.4" />
      <circle cx="24" cy="24" r="3.2" />
    </svg>
  );
}

const map: Record<ServiceId, () => React.JSX.Element> = {
  council: Council,
  audit: Audit,
  dispute: Dispute,
  education: Education,
  consulting: Consulting,
  zakat: Zakat,
};

export function ServiceIcon({ id }: { id: ServiceId }) {
  const C = map[id];
  return <C />;
}

/* --- consultation form marks: who is asking, and the two needs that are not services --- */

function Bank() {
  return (
    <svg {...base}>
      <path d="M6 18L24 7l18 11z" />
      <path d="M11 22v14M19 22v14M29 22v14M37 22v14" />
      <path d="M6 40h36" />
    </svg>
  );
}

function Business() {
  return (
    <svg {...base}>
      <path d="M9 42V16l15-9 15 9v26z" />
      <path d="M17 42v-9h14v9" />
      <path d="M17 22h4M27 22h4M17 28h4M27 28h4" opacity="0.7" />
    </svg>
  );
}

function Person() {
  return (
    <svg {...base}>
      <circle cx="24" cy="16" r="7" />
      <path d="M9 41c0-8.3 6.7-14 15-14s15 5.7 15 14" />
    </svg>
  );
}

function Advice() {
  return (
    <svg {...base}>
      {/* a pointed-arch speech bubble */}
      <path d="M8 33V21C8 13 15 7 24 7s16 6 16 14v12H18l-8 7v-7z" />
      <path d="M17 21h14M17 27h9" opacity="0.7" />
    </svg>
  );
}

function Other() {
  return (
    <svg {...base}>
      <path d={STAR_24} />
      <circle cx="24" cy="21" r="1.4" />
    </svg>
  );
}

export type WizardIconId = "bank" | "business" | "person" | "learner" | "advice" | "other";

const wizardMap: Record<WizardIconId, () => React.JSX.Element> = {
  bank: Bank,
  business: Business,
  person: Person,
  learner: Education,
  advice: Advice,
  other: Other,
};

export function WizardIcon({ id }: { id: WizardIconId | ServiceId }) {
  const C = id in wizardMap ? wizardMap[id as WizardIconId] : map[id as ServiceId];
  return <C />;
}

/* --- small utility marks --- */

export function ArrowMark() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function PinMark() {
  return (
    <svg {...base} width="20" height="20">
      <path d="M24 44s14-13.2 14-23a14 14 0 1 0-28 0c0 9.8 14 23 14 23z" />
      <circle cx="24" cy="20" r="5" />
    </svg>
  );
}

export function ClockMark() {
  return (
    <svg {...base} width="20" height="20">
      <circle cx="24" cy="24" r="18" />
      <path d="M24 13v11l7 5" />
    </svg>
  );
}

/** Telegram's paper plane, drawn in the same stroke as the other marks. */
export function PlaneMark() {
  return (
    <svg {...base} width="20" height="20">
      <path d="M42 7L5 21.5l12 4.5 4.5 13.5 7-8.5L39 38z" />
      <path d="M17 26l17-12-12.5 16" />
    </svg>
  );
}

export function PhoneMark() {
  return (
    <svg {...base} width="20" height="20">
      <path d="M16 6l6 8-4.4 4.4a24 24 0 0 0 11 11L33 25l8 6-4 8C22 39 9 26 9 11z" />
    </svg>
  );
}
