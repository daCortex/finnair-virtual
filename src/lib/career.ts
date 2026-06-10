/* ----------------------------------------------------------------
   Finnair Virtual — career economy
   The single source of truth for the rank ladder, pilot licenses,
   Aurora Points (AP), Finnair Plus tiers, the Cargo (Logistics
   Command) track, and auto-dispatch generation.

   Mirrors the FNVA Operations Handbook v4.0 ("Nordic Excellence").
------------------------------------------------------------------- */

/* ======================= RANK LADDER ======================= */

export type Rank = {
  n: number; // ladder position 1..9
  name: string;
  hours: number; // hour threshold to reach it
  blurb: string;
  group: "core" | "exclusive";
  apMultiplier?: number; // rank-based AP bonus (Sovereign 1.2×, Luminary 1.5×)
  callsignRange?: string; // unlocked custom callsign range
  perks?: string[];
  // legacy/manual fields kept for the staff Crew Center
  note?: string;
  manual?: boolean;
  symbol?: string;
};

export const RANKS: Rank[] = [
  { n: 1, name: "Aurora", hours: 0, group: "core", blurb: "Welcome aboard. Your career begins here.", perks: ["E190 · A319 · A320 · A321 · Q400", "Codeshares under 3 hours"] },
  { n: 2, name: "Polaris", hours: 25, group: "core", blurb: "Finding your bearings on the northern routes.", perks: ["Codeshares under 6 hours"] },
  { n: 3, name: "Elysian", hours: 75, group: "core", blurb: "Widebody command and the start of Career Mode.", perks: ["A330-300 · A350-900", "Codeshares under 9 hours", "Career Mode unlocked"] },
  { n: 4, name: "Solstice", hours: 150, group: "core", blurb: "A seasoned hand across the continent.", perks: ["Codeshares under 12 hours"] },
  { n: 5, name: "Zenith", hours: 300, group: "core", blurb: "The peak of the core ladder — all aircraft unlocked.", perks: ["All aircraft", "Cargo operations eligible"] },
  { n: 6, name: "Astralis", hours: 600, group: "core", blurb: "Master of the full network.", perks: ["All codeshares & aircraft"] },
  // ---- Exclusive ranks (Finnair Plus member + AURORA Bank access) ----
  { n: 7, name: "Celestia", hours: 1200, group: "exclusive", callsignRange: "86–100", blurb: "An elite aviator. Special Operations clearance granted.", perks: ["Callsign range 86–100", "Special Ops access", "Celestia Discord badge"] },
  { n: 8, name: "Sovereign", hours: 2500, group: "exclusive", apMultiplier: 1.2, callsignRange: "66–85", blurb: "Sovereign of the skies. The oneworld network opens.", perks: ["Callsign range 66–85", "1.2× AP multiplier", "oneworld Discover routes", "Sovereign Discord badge"] },
  { n: 9, name: "Luminary", hours: 5000, group: "exclusive", apMultiplier: 1.5, callsignRange: "45–65", blurb: "A living legend of Finnair Virtual.", perks: ["Callsign range 45–65", "1.5× AP multiplier", "Luminary Discord badge"] },
];

export type RankProgress = {
  current: Rank;
  next: Rank | null;
  pct: number; // 0–100 toward next
  totalHours: number;
  hoursToNext: number | null;
};

export function rankForHours(totalHours: number): RankProgress {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (totalHours >= RANKS[i].hours) idx = i;
  const current = RANKS[idx];
  const next = RANKS[idx + 1] ?? null;
  if (!next) return { current, next: null, pct: 100, totalHours, hoursToNext: null };
  const span = next.hours - current.hours;
  const into = totalHours - current.hours;
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return { current, next, pct, totalHours, hoursToNext: Math.max(0, next.hours - totalHours) };
}

export function rankByName(name: string): Rank | null {
  return RANKS.find((r) => r.name.toLowerCase() === name.toLowerCase()) ?? null;
}

/* True if a pilot's hours meet or exceed a named rank (for feature-gating). */
export function hasRankAtLeast(totalHours: number, rankName: string): boolean {
  const r = rankByName(rankName);
  return !!r && totalHours >= r.hours;
}

/* ======================= PILOT LICENSES ======================= */

export type License = {
  name: string; // "Private Pilot License"
  short: string; // "PPL"
  hours: number;
  fleet: string[];
};

export const LICENSES: License[] = [
  { name: "Private Pilot License", short: "PPL", hours: 0, fleet: ["Embraer 190"] },
  { name: "Commercial Pilot License", short: "CPL", hours: 150, fleet: ["A319", "A320", "A320neo", "A321"] },
  { name: "Command License", short: "Command", hours: 500, fleet: ["A330", "A350-900"] },
  { name: "Captain", short: "Captain", hours: 1500, fleet: ["Boeing 737", "Boeing 787", "Boeing 777", "Boeing 747"] },
];

export function licenseForHours(totalHours: number): {
  current: License;
  next: License | null;
  pct: number;
  hoursToNext: number | null;
} {
  let idx = 0;
  for (let i = 0; i < LICENSES.length; i++) if (totalHours >= LICENSES[i].hours) idx = i;
  const current = LICENSES[idx];
  const next = LICENSES[idx + 1] ?? null;
  if (!next) return { current, next: null, pct: 100, hoursToNext: null };
  const span = next.hours - current.hours;
  const into = totalHours - current.hours;
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return { current, next, pct, hoursToNext: Math.max(0, next.hours - totalHours) };
}

/* All fleet a pilot is authorised to fly at their hours. */
export function authorizedFleet(totalHours: number): string[] {
  return LICENSES.filter((l) => totalHours >= l.hours).flatMap((l) => l.fleet);
}

/* ======================= AURORA POINTS (AP) ======================= */

export type FlightCategory = "regional" | "continental" | "longhaul";

export const AP_TABLE: Record<
  FlightCategory,
  { label: string; maxHours: number | null; gross: number; overhead: number; net: number }
> = {
  regional: { label: "Regional (<2h)", maxHours: 2, gross: 350, overhead: 50, net: 300 },
  continental: { label: "Continental (2–6h)", maxHours: 6, gross: 1440, overhead: 200, net: 1240 },
  longhaul: { label: "Long-Haul (>6h)", maxHours: null, gross: 4200, overhead: 500, net: 3700 },
};

export const PUNCTUALITY_MULTIPLIER = 1.25;
export const SPOTLIGHT_MULTIPLIER = 2;

export function categoryForMinutes(minutes: number): FlightCategory {
  const h = minutes / 60;
  if (h < 2) return "regional";
  if (h <= 6) return "continental";
  return "longhaul";
}

export type ApBreakdown = {
  category: FlightCategory;
  gross: number;
  overhead: number;
  base: number;
  punctual: boolean;
  spotlight: boolean;
  rankMultiplier: number;
  multiplier: number; // combined applied multiplier
  net: number; // final AP awarded
};

/* Compute AP for a flight. Multipliers stack: punctuality (1.25×), spotlight
   (2×) and the pilot's rank multiplier (Sovereign 1.2× / Luminary 1.5×). */
export function computeAp(
  minutes: number,
  opts: { punctual?: boolean; spotlight?: boolean; rankMultiplier?: number } = {},
): ApBreakdown {
  const category = categoryForMinutes(minutes);
  const row = AP_TABLE[category];
  const punctual = !!opts.punctual;
  const spotlight = !!opts.spotlight;
  const rankMultiplier = opts.rankMultiplier ?? 1;
  const multiplier =
    (punctual ? PUNCTUALITY_MULTIPLIER : 1) *
    (spotlight ? SPOTLIGHT_MULTIPLIER : 1) *
    rankMultiplier;
  const net = Math.round(row.net * multiplier);
  return {
    category,
    gross: row.gross,
    overhead: row.overhead,
    base: row.net,
    punctual,
    spotlight,
    rankMultiplier,
    multiplier,
    net,
  };
}

/* Estimate a pilot's lifetime AP balance from their logged hours (demo model:
   historical hours are valued at the ~per-hour blend of the AP table). */
export const AP_PER_HOUR_ESTIMATE = 300;
export function estimateApFromHours(totalHours: number): number {
  return Math.round(totalHours * AP_PER_HOUR_ESTIMATE);
}

/* ======================= FINNAIR PLUS TIERS ======================= */

export type Tier = {
  name: string;
  min: number; // AP threshold
  accent: string; // hex for the tier badge
  blurb: string;
};

export const TIERS: Tier[] = [
  { name: "Classic", min: 0, accent: "#AFAFAF", blurb: "Every journey starts here." },
  { name: "Signature", min: 2500, accent: "#7F1894", blurb: "A recognised regular of the network." },
  { name: "Imperial", min: 50000, accent: "#0C0243", blurb: "A pillar of Finnair Virtual." },
  { name: "Prestige", min: 150000, accent: "#1E0B57", blurb: "Among our most decorated aviators." },
  { name: "Centurion", min: 500000, accent: "#121212", blurb: "Master aviator — Advisory Board & custom callsign." },
];

export function tierForAp(ap: number): { current: Tier; next: Tier | null; pct: number; apToNext: number | null } {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) if (ap >= TIERS[i].min) idx = i;
  const current = TIERS[idx];
  const next = TIERS[idx + 1] ?? null;
  if (!next) return { current, next: null, pct: 100, apToNext: null };
  const span = next.min - current.min;
  const into = ap - current.min;
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return { current, next, pct, apToNext: Math.max(0, next.min - ap) };
}

/* ======================= CARGO — LOGISTICS COMMAND ======================= */

export type CargoCert = { name: string; hours: number; fleet: string[] };

export const CARGO_CERTS: CargoCert[] = [
  { name: "Handler", hours: 0, fleet: ["E190-F"] },
  { name: "Loadmaster", hours: 250, fleet: ["A321-F"] },
  { name: "Freight Architect", hours: 750, fleet: ["B777-F", "B747-8F"] },
];

export type CargoRisk = "low" | "medium" | "high";

export const CARGO_TABLE: Record<
  CargoRisk,
  { label: string; net: number; adjustment: number; incentive: number }
> = {
  low: { label: "Low · Standard", net: 1400, adjustment: 0, incentive: 1.0 },
  medium: { label: "Medium · Perishable", net: 3000, adjustment: -0.1, incentive: 1.25 },
  high: { label: "High · Specialized", net: 5500, adjustment: -0.2, incentive: 1.3 },
};

export function cargoCertForHours(cargoHours: number): CargoCert {
  let c = CARGO_CERTS[0];
  for (const cert of CARGO_CERTS) if (cargoHours >= cert.hours) c = cert;
  return c;
}

/* Logistics Credits for a cargo contract, with variance + incentive applied. */
export function computeLc(risk: CargoRisk, performance = true): { base: number; adjusted: number; net: number } {
  const row = CARGO_TABLE[risk];
  const adjusted = Math.round(row.net * (1 + row.adjustment));
  const net = Math.round(adjusted * (performance ? row.incentive : 1));
  return { base: row.net, adjusted, net };
}

/* ======================= GATES ======================= */

export const GATES = {
  careerMode: "Elysian", // 75h+
  cargoMode: "Zenith", // 300h+
  specialOps: "Celestia", // 1200h+
  oneworldDiscover: "Sovereign", // 2500h+
} as const;
