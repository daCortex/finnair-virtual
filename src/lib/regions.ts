/* ----------------------------------------------------------------
   Network regions — each destination belongs to a region with its own
   colour, used to colour the home-page network map and its legend.
------------------------------------------------------------------- */

export type Region = { name: string; color: string; icaos: string[] };

export const REGIONS: Region[] = [
  { name: "Finland", color: "#0C0243", icaos: ["EFRO", "EFOU", "EFKT", "EFIV", "EFVA"] },
  { name: "Baltics", color: "#3B6FE0", icaos: ["EETN", "EVRA", "EYVI"] },
  { name: "Scandinavia", color: "#12B5A8", icaos: ["ESSA", "ESGG", "EKCH", "ENGM"] },
  { name: "Central Europe", color: "#8E5BFF", icaos: ["EDDF", "EDDM", "LSZH", "LOWW", "EPWA"] },
  { name: "Western Europe", color: "#2BA84A", icaos: ["LFPG", "EHAM", "EBBR", "LFMN"] },
  { name: "British Isles", color: "#E2456A", icaos: ["EGLL", "EIDW"] },
  { name: "Mediterranean", color: "#F2A33A", icaos: ["LIRF", "LGAV"] },
  { name: "Iberia & Atlantic", color: "#00A0B0", icaos: ["LEBL", "LEMD", "LPPT"] },
  { name: "Middle East", color: "#C77D2E", icaos: ["OMDB", "OTHH"] },
  { name: "Asia", color: "#E0529C", icaos: ["RJTT", "RKSI", "ZSPD", "VHHH", "WSSS", "RPLL", "VTBS", "VABB", "VIDP", "WMKK", "YSSY"] },
  { name: "North America", color: "#5B6CFF", icaos: ["KJFK", "KORD", "KLAX", "KSFO", "KSEA", "KMIA", "KDFW"] },
];

const ICAO_REGION = new Map<string, Region>();
for (const r of REGIONS) for (const i of r.icaos) ICAO_REGION.set(i, r);

export function regionForIcao(icao: string): Region | null {
  return ICAO_REGION.get(icao) ?? null;
}
export function regionName(icao: string): string {
  return ICAO_REGION.get(icao)?.name ?? "—";
}
export function regionColor(icao: string): string {
  return ICAO_REGION.get(icao)?.color ?? "#0C0243";
}
