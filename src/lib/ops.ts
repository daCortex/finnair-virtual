/* ----------------------------------------------------------------
   Finnair Virtual — operations: Route of the Week, Spotlight routes
   (2× AP), and Career-mode auto-dispatch.

   ROTW is staff-settable (in-memory demo store). Spotlights and dispatch
   assignments are generated deterministically from the day so they stay
   stable across refreshes and only roll over on a new day/week.
------------------------------------------------------------------- */

import { ROUTES, type Route } from "./routes";
import { AIRPORT_COORDS } from "./airports";
import {
  computeAp,
  categoryForMinutes,
  computeLc,
  cargoCertForHours,
  CARGO_HUBS,
  type FlightCategory,
  type CargoRisk,
} from "./career";

/* ---- deterministic RNG (so dispatch/spotlight are stable per period) ---- */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function dayIndex(d = new Date()): number {
  return Math.floor(d.getTime() / 86_400_000);
}
function weekIndex(d = new Date()): number {
  return Math.floor(dayIndex(d) / 7);
}

export function firstFlightNo(r: Route): string {
  return r.routeNumber.split("/")[0];
}

/* ---- Ops store (demo): Route of the Week + staff-added codeshare routes ---- */
const g = globalThis as unknown as { __fnrOps?: { rotwNo: string; extra: Route[] } };
const store = (g.__fnrOps ??= {
  // default ROTW: the polar flagship to Tokyo
  rotwNo: "AY73/AY74",
  extra: [], // codeshare routes added by staff in the Crew Center
});
store.extra ??= [];

const finnairRoutes = ROUTES.filter((r) => r.airline === "Finnair");

/* All routes = the static network + staff-added codeshares. */
export function allRoutes(): Route[] {
  return [...ROUTES, ...store.extra];
}
export function getExtraRoutes(): Route[] {
  return [...store.extra];
}
export function allAirlines(): string[] {
  return [...new Set(allRoutes().map((r) => r.airline))];
}

/* Staff: add a codeshare route to the database. */
export function addCodeshareRoute(input: {
  routeNumber: string;
  dep: string;
  arr: string;
  aircraft: string;
  minutes: number;
  airline: string;
}): { ok: boolean; error?: string } {
  const routeNumber = input.routeNumber.trim().toUpperCase();
  const dep = input.dep.trim().toUpperCase();
  const arr = input.arr.trim().toUpperCase();
  const airline = input.airline.trim();
  const minutes = Math.round(Number(input.minutes));
  if (!routeNumber || dep.length < 3 || arr.length < 3) return { ok: false, error: "Flight number and valid ICAO airports are required." };
  if (!airline) return { ok: false, error: "Airline is required." };
  if (!Number.isFinite(minutes) || minutes <= 0) return { ok: false, error: "Block time must be greater than zero." };
  if (allRoutes().some((r) => r.routeNumber === routeNumber)) return { ok: false, error: "That flight number already exists." };
  store.extra.push({ routeNumber, dep, arr, aircraft: input.aircraft.trim() || `${airline} aircraft`, minutes, airline });
  return { ok: true };
}
export function removeCodeshareRoute(routeNumber: string): boolean {
  const before = store.extra.length;
  store.extra = store.extra.filter((r) => r.routeNumber !== routeNumber);
  return store.extra.length < before;
}

export function getRotw(): Route {
  return (
    finnairRoutes.find((r) => r.routeNumber === store.rotwNo) ??
    finnairRoutes[0]
  );
}
export function setRotw(routeNumber: string): boolean {
  const ok = finnairRoutes.some((r) => r.routeNumber === routeNumber);
  if (ok) store.rotwNo = routeNumber;
  return ok;
}
export function rotwOptions(): Route[] {
  return finnairRoutes;
}

/* ---- Spotlight routes (2× AP), 1–3 per week ---- */
export function getSpotlightRoutes(d = new Date()): Route[] {
  const r = rng(weekIndex(d) * 7919 + 13);
  const count = 1 + Math.floor(r() * 3); // 1–3
  const pool = [...finnairRoutes];
  const picks: Route[] = [];
  for (let i = 0; i < count && pool.length; i++) {
    picks.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
  }
  return picks;
}
export function isSpotlight(routeNumber: string, d = new Date()): boolean {
  return getSpotlightRoutes(d).some((r) => r.routeNumber === routeNumber);
}

/* ---- Career-mode auto-dispatch ----
   Each pilot gets a small board of assigned flights with a deadline and an AP
   reward. Completing within the window earns the 1.25× punctuality premium;
   spotlight sectors carry 2×. Deterministic per pilot per day. */
export type Dispatch = {
  id: string;
  flightNo: string;
  dep: string;
  arr: string;
  aircraft: string;
  minutes: number;
  category: FlightCategory;
  baseAp: number;
  spotlight: boolean;
  maxAp: number; // with punctuality + spotlight + rank multiplier
  dueInHours: number; // window from "now"
  priority: "standard" | "priority";
};

export function getDispatches(
  pilotId: number,
  opts: { authorizedFleet?: string[]; rankMultiplier?: number; maxCodeshareHours?: number } = {},
  d = new Date(),
): Dispatch[] {
  const r = rng((pilotId + 1) * 2654435761 + dayIndex(d));
  const spotlights = new Set(getSpotlightRoutes(d).map((x) => x.routeNumber));
  const rankMult = opts.rankMultiplier ?? 1;

  // Eligible routes: prefer Finnair mainline the pilot can fly.
  let pool = finnairRoutes.slice();
  if (opts.authorizedFleet?.length) {
    const ok = pool.filter((rt) =>
      opts.authorizedFleet!.some((f) =>
        rt.aircraft.toLowerCase().includes(f.toLowerCase().replace("-", " ").slice(0, 4)),
      ),
    );
    if (ok.length >= 4) pool = ok;
  }

  const board: Dispatch[] = [];
  const used = new Set<string>();
  const target = 3; // 3 auto-dispatched flights per pilot per day
  let guard = 0;
  while (board.length < target && guard++ < 200 && pool.length) {
    const rt = pool[Math.floor(r() * pool.length)];
    if (used.has(rt.routeNumber)) continue;
    used.add(rt.routeNumber);
    const minutes = rt.minutes;
    const spotlight = spotlights.has(rt.routeNumber);
    const base = computeAp(minutes, { rankMultiplier: rankMult }).net;
    const max = computeAp(minutes, { punctual: true, spotlight, rankMultiplier: rankMult }).net;
    board.push({
      id: `${rt.routeNumber}-${dayIndex(d)}`,
      flightNo: firstFlightNo(rt),
      dep: rt.dep,
      arr: rt.arr,
      aircraft: rt.aircraft,
      minutes,
      category: categoryForMinutes(minutes),
      baseAp: base,
      spotlight,
      maxAp: max,
      dueInHours: 24 + Math.floor(r() * 48), // 24–72h window
      priority: spotlight || r() > 0.7 ? "priority" : "standard",
    });
  }
  // priority/spotlight first, then by reward
  return board.sort(
    (a, b) =>
      Number(b.spotlight) - Number(a.spotlight) ||
      (a.priority === "priority" ? -1 : 0) - (b.priority === "priority" ? -1 : 0) ||
      b.maxAp - a.maxAp,
  );
}

/* ---- Cargo (Logistics Command) — contract generation ---- */
export type CargoContract = {
  id: string;
  flightNo: string;
  dep: string;
  arr: string;
  aircraft: string;
  minutes: number;
  risk: CargoRisk;
  riskLabel: string;
  scenario: string;
  lc: number;
  lcMin: number; // floor after a possible high-risk deduction
  cert: string;
};

const CARGO_TYPES = ["E190-F", "A321 Cargo", "B777-F", "B747-8F"];
const CARGO_DESTS = ["EFHK", "EKCH", "ESSA", "ENGM", "EDDF", "LFPG", "LIRF", "LEMD", "OMDB", "OTHH", "KJFK", "RJTT", "VHHH", "WSSS", "VABB", "KMIA"];
const SCENARIOS: Record<CargoRisk, string[]> = {
  low: ["General consignment", "Automotive parts", "Industrial machinery", "Consumer electronics", "Apparel & textiles"],
  medium: ["Fresh produce", "Cut flowers", "Chilled seafood", "Dairy shipment", "Live tropical fish"],
  high: ["Pharmaceuticals, temp-controlled", "Medical instruments", "Aircraft engine (oversize)", "Hazardous materials", "Time-critical sports equipment"],
};

function blockMinutes(a: string, b: string): number {
  const p = AIRPORT_COORDS[a], q = AIRPORT_COORDS[b];
  if (!p || !q) return 120;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(q[0] - p[0]), dLon = toRad(q[1] - p[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(p[0])) * Math.cos(toRad(q[0])) * Math.sin(dLon / 2) ** 2;
  const nm = 3440 * 2 * Math.asin(Math.sqrt(h));
  return Math.max(75, Math.round((nm / 460) * 60) + 25); // ~460kt + taxi/climb
}

export function getCargoContracts(pilotId: number, cargoHours = 0, cargoLc = 0, d = new Date()): CargoContract[] {
  const r = rng((pilotId + 7) * 40503 + dayIndex(d));
  const cert = cargoCertForHours(cargoHours, cargoLc);
  const limit = cert.dailyLimit; // 2 at Entry (1 per hub), 3 at Load Master+
  const risks: CargoRisk[] = ["low", "low", "medium", "medium", "high"];
  const out: CargoContract[] = [];
  const used = new Set<string>();
  let guard = 0;
  while (out.length < limit && guard++ < 200) {
    const dep = CARGO_HUBS[out.length % CARGO_HUBS.length]; // alternate Brussels / London
    const arr = CARGO_DESTS[Math.floor(r() * CARGO_DESTS.length)];
    const key = `${dep}-${arr}`;
    if (arr === dep || used.has(key)) continue;
    used.add(key);
    const minutes = blockMinutes(dep, arr);
    const risk = risks[Math.floor(r() * risks.length)];
    const ac = CARGO_TYPES[Math.min(CARGO_TYPES.length - 1, Math.floor((minutes / 600) * CARGO_TYPES.length))];
    const lc = computeLc(risk);
    out.push({
      id: `C-${dep}-${arr}-${dayIndex(d)}`,
      flightNo: "FX" + (100 + Math.floor(r() * 800)),
      dep, arr, aircraft: ac, minutes, risk,
      riskLabel: risk === "low" ? "Standard" : risk === "medium" ? "Perishable" : "Specialized",
      scenario: SCENARIOS[risk][Math.floor(r() * SCENARIOS[risk].length)],
      lc: lc.net,
      lcMin: lc.min,
      cert: cert.name,
    });
  }
  return out.sort((a, b) => b.lc - a.lc);
}
