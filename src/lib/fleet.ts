/* ----------------------------------------------------------------
   Finnair Virtual — Live Fleet (demo).
   A demonstration model of the airline's physical fleet and where each
   tail currently sits. "Live Mode" is an addition to Career/Cargo: pilots
   claim an idle aircraft and fly its dispatch from/to a hub. Aircraft away
   from a hub generate a 1.5× spotlight ferry flight back home.

   This is a DEMO — it will be staff-only at launch until Infinite Flight
   exposes a public live-tracking feature. Real positions/assignments will
   be wired to live data later. */

import { airportCity } from "./airports";

export const FLEET_HUBS = ["EFHK", "EBBR", "EGLL"] as const;

export type FleetAircraft = {
  reg: string;
  type: string;
  family: "Narrowbody" | "Widebody";
  location: string; // ICAO
  assignedPilot: string | null;
};

/* Demo composition per the brief: 2× A320, 3× A330, 5× A350. */
export const LIVE_FLEET: FleetAircraft[] = [
  { reg: "OH-LXA", type: "Airbus A320", family: "Narrowbody", location: "EFHK", assignedPilot: "Ayaz M." },
  { reg: "OH-LXB", type: "Airbus A320", family: "Narrowbody", location: "LFPG", assignedPilot: null },
  { reg: "OH-LTN", type: "Airbus A330-300", family: "Widebody", location: "EFHK", assignedPilot: null },
  { reg: "OH-LTO", type: "Airbus A330-300", family: "Widebody", location: "OMDB", assignedPilot: "Lucian Y." },
  { reg: "OH-LTP", type: "Airbus A330-300", family: "Widebody", location: "EGLL", assignedPilot: null },
  { reg: "OH-LWA", type: "Airbus A350-900", family: "Widebody", location: "RJTT", assignedPilot: null },
  { reg: "OH-LWB", type: "Airbus A350-900", family: "Widebody", location: "EFHK", assignedPilot: "Zyrex" },
  { reg: "OH-LWC", type: "Airbus A350-900", family: "Widebody", location: "KJFK", assignedPilot: null },
  { reg: "OH-LWD", type: "Airbus A350-900", family: "Widebody", location: "EFHK", assignedPilot: null },
  { reg: "OH-LWE", type: "Airbus A350-900", family: "Widebody", location: "VHHH", assignedPilot: null },
];

export function isAtHub(icao: string): boolean {
  return (FLEET_HUBS as readonly string[]).includes(icao);
}

export function fleetLocationLabel(icao: string): string {
  return `${airportCity(icao)} (${icao})`;
}

/* Summary for the dashboard header strip. */
export function fleetSummary() {
  const total = LIVE_FLEET.length;
  const atHub = LIVE_FLEET.filter((a) => isAtHub(a.location)).length;
  const idle = LIVE_FLEET.filter((a) => !a.assignedPilot).length;
  const ferryAvailable = LIVE_FLEET.filter((a) => !isAtHub(a.location)).length;
  return { total, atHub, away: total - atHub, idle, ferryAvailable };
}

/* Group the fleet by type for display (A320 ×2, A330 ×3, A350 ×5). */
export function fleetByType(): { type: string; tails: FleetAircraft[] }[] {
  const order: string[] = [];
  const map = new Map<string, FleetAircraft[]>();
  for (const a of LIVE_FLEET) {
    if (!map.has(a.type)) { map.set(a.type, []); order.push(a.type); }
    map.get(a.type)!.push(a);
  }
  return order.map((type) => ({ type, tails: map.get(type)! }));
}
