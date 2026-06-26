/* ----------------------------------------------------------------
   Finnair Virtual — career economy
   The single source of truth for the rank ladder, pilot licenses,
   Aurora Points (AP), Finnair Plus tiers, the Cargo (Logistics
   Command) track, and auto-dispatch generation.

   Mirrors the FVA Operations Handbook v4.0 ("Nordic Excellence").
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

/* Rank perks no longer grant codeshare routes — codeshares are purchased with
   AP (Career) / LC (Cargo). The full rank-reward structure is being updated. */
export const RANKS: Rank[] = [
  { n: 1, name: "Aurora", hours: 0, group: "core", blurb: "Welcome aboard. Your career begins here.", perks: ["E190 · A319 · A320 · A321 · Dash 8-Q400", "Casual Mode"] },
  { n: 2, name: "Polaris", hours: 25, group: "core", blurb: "Finding your bearings on the northern routes.", perks: ["Boeing 737 family"] },
  { n: 3, name: "Elysian", hours: 75, group: "core", blurb: "Widebody command and the start of Career Mode.", perks: ["A330 · A350", "Career Mode unlocked"] },
  { n: 4, name: "Solstice", hours: 150, group: "core", blurb: "A seasoned hand across the long-haul network.", perks: ["Boeing 787 · Boeing 777"] },
  { n: 5, name: "Zenith", hours: 300, group: "core", blurb: "The peak of the core ladder.", perks: ["Boeing 747 · A380", "Cargo — apply"] },
  { n: 6, name: "Astralis", hours: 600, group: "core", blurb: "Master of the full fleet.", perks: ["All aircraft"] },
  // ---- Exclusive ranks (Finnair Plus member + AURORA Bank access) ----
  { n: 7, name: "Celestia", hours: 1200, group: "exclusive", callsignRange: "86–100", blurb: "An elite aviator. Special Operations clearance granted.", perks: ["Callsign range 86–100", "Special Ops access", "Celestia Discord badge"] },
  { n: 8, name: "Sovereign", hours: 2500, group: "exclusive", apMultiplier: 1.2, callsignRange: "66–85", blurb: "Sovereign of the skies. The oneworld network opens.", perks: ["Callsign range 66–85", "1.2× AP multiplier", "oneworld Discover", "Sovereign Discord badge"] },
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
  apCost: number; // AP cost to unlock this licence (PPL is free)
  cumulativeAp: number; // total AP needed to hold it
  maxHours: number; // max flight duration the licence permits
  fleet: string[];
};

/* Licences are PURCHASED with Aurora Points (per the Ops Handbook):
   PPL free · CPL 2,000 AP · Command +1,000 AP. */
export const LICENSES: License[] = [
  { name: "Private Pilot License", short: "PPL", apCost: 0, cumulativeAp: 0, maxHours: 2, fleet: ["Embraer 190"] },
  { name: "Commercial Pilot License", short: "CPL", apCost: 2000, cumulativeAp: 2000, maxHours: 6, fleet: ["A319", "A320", "A321"] },
  { name: "Command License", short: "Command", apCost: 1000, cumulativeAp: 3000, maxHours: 14, fleet: ["A330", "A350-900"] },
];

export function licenseForAp(ap: number): {
  current: License;
  next: License | null;
  pct: number;
  apToNext: number | null;
} {
  let idx = 0;
  for (let i = 0; i < LICENSES.length; i++) if (ap >= LICENSES[i].cumulativeAp) idx = i;
  const current = LICENSES[idx];
  const next = LICENSES[idx + 1] ?? null;
  if (!next) return { current, next: null, pct: 100, apToNext: null };
  const span = next.cumulativeAp - current.cumulativeAp;
  const into = ap - current.cumulativeAp;
  const pct = span > 0 ? Math.min(100, Math.round((into / span) * 100)) : 0;
  return { current, next, pct, apToNext: Math.max(0, next.cumulativeAp - ap) };
}

/* All fleet a pilot is authorised to fly given their AP balance. */
export function authorizedFleetByAp(ap: number): string[] {
  return LICENSES.filter((l) => ap >= l.cumulativeAp).flatMap((l) => l.fleet);
}

/* ---- Career codeshares (unlocked with AP) ---- */
export const CODESHARE_UNLOCK_AP = 50000; // AP needed to initiate codeshares
export type Codeshare = { name: string; cost: number; free?: boolean };
export const CAREER_CODESHARES: Codeshare[] = [
  { name: "Jet Airways", cost: 0, free: true },
  { name: "Air Asia", cost: 10000 },
  { name: "Cathay Pacific", cost: 30000 },
  { name: "Air India", cost: 35000 },
  { name: "Qatar Airways", cost: 80000 },
];

/* ======================= AURORA POINTS (AP) ======================= */

export type FlightCategory = "regional" | "continental" | "longhaul" | "ultralong";

export const AP_TABLE: Record<
  FlightCategory,
  { label: string; maxHours: number | null; gross: number; overhead: number; net: number }
> = {
  regional: { label: "Short-haul · under 2h", maxHours: 2, gross: 350, overhead: 50, net: 300 },
  continental: { label: "Medium-haul · 2–6h", maxHours: 6, gross: 1300, overhead: 60, net: 1240 },
  longhaul: { label: "Long-haul · 6–15h", maxHours: 15, gross: 4000, overhead: 300, net: 3700 },
  ultralong: { label: "Ultra-long-haul · 15h+", maxHours: null, gross: 4800, overhead: 300, net: 4500 },
};

export const SPOTLIGHT_MULTIPLIER = 2;

/* On-time bonus is a FLAT amount by pilot licence (added, not multiplied). */
export const PUNCTUALITY_BONUS: Record<string, number> = { PPL: 100, CPL: 200, Command: 300 };
export function punctualityBonus(licenseShort: string): number {
  return PUNCTUALITY_BONUS[licenseShort] ?? 100;
}
/* Cargo on-time bonus (LC) by certification — same 100/200/300 ladder. */
export const CARGO_PUNCTUALITY_BONUS: Record<string, number> = {
  Entry: 100, "Load Master": 200, "Freight Architect": 300,
};
export function cargoPunctualityBonus(certName: string): number {
  return CARGO_PUNCTUALITY_BONUS[certName] ?? 100;
}

export function categoryForMinutes(minutes: number): FlightCategory {
  const h = minutes / 60;
  if (h < 2) return "regional";
  if (h <= 6) return "continental";
  if (h <= 15) return "longhaul";
  return "ultralong";
}

export type ApBreakdown = {
  category: FlightCategory;
  gross: number;
  overhead: number;
  base: number; // band payout (the headline "max")
  spotlight: boolean;
  spotlightBonus: number; // +base when a spotlight sector
  punctual: boolean;
  punctualBonus: number; // flat on-time licence bonus
  net: number; // base (+spotlight)(+on-time)
};

/* Compute AP for a flight. The band payout is the headline max — spotlight
   doubles it (+base), and filing on time adds a FLAT licence bonus. No rank or
   ×1.25 inflation (rankMultiplier is accepted for back-compat but ignored). */
export function computeAp(
  minutes: number,
  opts: { punctual?: boolean; spotlight?: boolean; punctualBonus?: number; rankMultiplier?: number } = {},
): ApBreakdown {
  const category = categoryForMinutes(minutes);
  const row = AP_TABLE[category];
  const base = row.net;
  const spotlight = !!opts.spotlight;
  const spotlightBonus = spotlight ? base : 0;
  const punctual = !!opts.punctual;
  const punctualBonus = punctual ? Math.round(opts.punctualBonus ?? 0) : 0;
  const net = base + spotlightBonus + punctualBonus;
  return {
    category,
    gross: row.gross,
    overhead: row.overhead,
    base,
    spotlight,
    spotlightBonus,
    punctual,
    punctualBonus,
    net,
  };
}

/* Estimate a pilot's lifetime AP balance from their logged hours (demo model:
   historical hours are valued at the ~per-hour blend of the AP table). */
export const AP_PER_HOUR_ESTIMATE = 300;
export function estimateApFromHours(totalHours: number): number {
  return Math.round(totalHours * AP_PER_HOUR_ESTIMATE);
}

/* Estimate a pilot's lifetime Logistic Coins (LC) balance from the cargo hours
   they have flown (demo model). Cargo only unlocks at Zenith (300h), so this is
   driven by hours beyond that gate until real cargo tracking lands. */
export const LC_PER_HOUR_ESTIMATE = 130;
export function estimateLcFromHours(cargoHours: number): number {
  return Math.max(0, Math.round(cargoHours * LC_PER_HOUR_ESTIMATE));
}

/* ======================= FINNAIR PLUS TIERS ======================= */

export type Tier = {
  name: string;
  min: number; // AP threshold
  accent: string; // hex for the tier badge
  blurb: string;
  perks: string[]; // what unlocking this tier grants
};

export const TIERS: Tier[] = [
  { name: "Classic", min: 0, accent: "#AFAFAF", blurb: "Every journey starts here.", perks: ["Finnair Plus member card", "Casual Mode access", "Community Discord role"] },
  { name: "Signature", min: 2500, accent: "#7F1894", blurb: "A recognised regular of the network.", perks: ["Signature Discord badge", "Priority PIREP review", "Request a custom callsign number"] },
  { name: "Imperial", min: 50000, accent: "#0C0243", blurb: "A pillar of Finnair Virtual.", perks: ["Imperial badge & profile flair", "Early sign-up for events & group flights", "Codeshare networks unlocked"] },
  { name: "Prestige", min: 150000, accent: "#1E0B57", blurb: "Among our most decorated aviators.", perks: ["Prestige badge", "Reserved group-flight slots", "A vote on new routes & liveries"] },
  { name: "Centurion", min: 500000, accent: "#121212", blurb: "Master aviator — the summit of Finnair Plus.", perks: ["Centurion role", "Advisory Board seat", "Bespoke personal callsign", "A place on the Wall of Fame"] },
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

/* Cargo hubs (per the Ops Handbook) and the daily dispatch limits. */
export const CARGO_HUBS = ["EBBR", "EGLL"] as const; // Brussels & London

export type CargoCert = {
  name: string;
  hours: number; // cargo hours required
  lcReq: number; // LC required (Freight Architect needs 150,000 LC too)
  dailyLimit: number; // contracts dispatched per day
  fleet: string[];
};

export const CARGO_CERTS: CargoCert[] = [
  { name: "Entry", hours: 0, lcReq: 0, dailyLimit: 2, fleet: ["E190-F"] },
  { name: "Load Master", hours: 250, lcReq: 0, dailyLimit: 3, fleet: ["A321 Cargo"] },
  { name: "Freight Architect", hours: 750, lcReq: 150000, dailyLimit: 3, fleet: ["B777-F", "B747-8F"] },
];

export type CargoRisk = "low" | "medium" | "high";

export const CARGO_TABLE: Record<
  CargoRisk,
  { label: string; net: number; multiplier: number; deduction: number }
> = {
  low: { label: "Low · Standard", net: 1400, multiplier: 1.0, deduction: 0 },
  medium: { label: "Medium · Perishable", net: 3000, multiplier: 1.2, deduction: 0 },
  high: { label: "High · Specialized", net: 5500, multiplier: 1.3, deduction: 0.2 },
};

export function cargoCertForHours(cargoHours: number, lc = 0): CargoCert {
  let c = CARGO_CERTS[0];
  for (const cert of CARGO_CERTS) if (cargoHours >= cert.hours && lc >= cert.lcReq) c = cert;
  return c;
}

/* Logistics Credits for a cargo contract — the headline payout per risk band.
   High-risk contracts are subject to a potential 20% deduction. */
export function computeLc(risk: CargoRisk): { net: number; min: number } {
  const row = CARGO_TABLE[risk];
  return { net: row.net, min: Math.round(row.net * (1 - row.deduction)) };
}

/* ---- Cargo codeshares (unlocked with LC at Freight Architect) ----
   Jet Airways is the free starter for everyone; the rest are priced in LC. */
export const CARGO_CODESHARES: Codeshare[] = [
  { name: "Jet Airways", cost: 0, free: true },
  { name: "UPS", cost: 20000 },
  { name: "Saudia Cargo", cost: 30000 },
  { name: "FedEx", cost: 35000 },
  { name: "Qatar Cargo", cost: 40000 },
];

/* Display helper: codeshares sorted free-first, then ascending by price. */
export function sortedCodeshares(list: Codeshare[]): Codeshare[] {
  return [...list].sort((a, b) => Number(b.free ?? false) - Number(a.free ?? false) || a.cost - b.cost);
}

/* Demo earnings for a cargo PIREP (no risk band stored): value by flight time. */
export function cargoEarningsForMinutes(minutes: number): number {
  const h = minutes / 60;
  if (h < 2) return CARGO_TABLE.low.net; // 1,400 LC
  if (h <= 6) return CARGO_TABLE.medium.net; // 3,000 LC
  return CARGO_TABLE.high.net; // 5,500 LC
}

/* ======================= GATES ======================= */

export const GATES = {
  careerMode: "Elysian", // 75h+
  cargoMode: "Zenith", // 300h+
  specialOps: "Celestia", // 1200h+
  oneworldDiscover: "Sovereign", // 2500h+
} as const;
