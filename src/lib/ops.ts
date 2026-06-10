/* ----------------------------------------------------------------
   Finnair Virtual — operations: Route of the Week, Spotlight routes
   (2× AP), and Career-mode auto-dispatch.

   ROTW is staff-settable (in-memory demo store). Spotlights and dispatch
   assignments are generated deterministically from the day so they stay
   stable across refreshes and only roll over on a new day/week.
------------------------------------------------------------------- */

import { ROUTES, type Route } from "./routes";
import {
  computeAp,
  categoryForMinutes,
  computeLc,
  cargoCertForHours,
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

/* ---- Route of the Week (staff-settable) ---- */
const g = globalThis as unknown as { __fnrOps?: { rotwNo: string } };
const store = (g.__fnrOps ??= {
  // default ROTW: the polar flagship to Tokyo
  rotwNo: "AY73/AY74",
});

const finnairRoutes = ROUTES.filter((r) => r.airline === "Finnair");

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
  const target = 5;
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
  lc: number;
  cert: string;
};

const CARGO_TYPES = ["E190-F", "A321-F", "B777-F", "B747-8F"];

export function getCargoContracts(pilotId: number, cargoHours = 0, d = new Date()): CargoContract[] {
  const r = rng((pilotId + 7) * 40503 + dayIndex(d));
  const cert = cargoCertForHours(cargoHours).name;
  const pool = finnairRoutes.filter((rt) => rt.minutes >= 90); // freight = meaningful sectors
  const risks: CargoRisk[] = ["low", "low", "medium", "medium", "high"];
  const out: CargoContract[] = [];
  const used = new Set<string>();
  let guard = 0;
  while (out.length < 5 && guard++ < 200 && pool.length) {
    const rt = pool[Math.floor(r() * pool.length)];
    if (used.has(rt.routeNumber)) continue;
    used.add(rt.routeNumber);
    const risk = risks[Math.floor(r() * risks.length)];
    const ac = CARGO_TYPES[Math.min(CARGO_TYPES.length - 1, Math.floor((rt.minutes / 600) * CARGO_TYPES.length))];
    out.push({
      id: `C-${rt.routeNumber}-${dayIndex(d)}`,
      flightNo: "AY8" + firstFlightNo(rt).replace(/\D/g, "").padStart(3, "0").slice(-3),
      dep: rt.dep,
      arr: rt.arr,
      aircraft: ac,
      minutes: rt.minutes,
      risk,
      riskLabel: risk === "low" ? "Standard" : risk === "medium" ? "Perishable" : "Specialized",
      lc: computeLc(risk).net,
      cert,
    });
  }
  return out.sort((a, b) => b.lc - a.lc);
}
