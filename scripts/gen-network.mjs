/* Generates src/lib/routes.ts, src/lib/airports.ts and src/lib/regions.ts
   from the official FNVA route database. Run: node scripts/gen-network.mjs */
import { writeFileSync } from "node:fs";

// icao: [city, country, iata, lat, lon, region]
const AP = {
  EFHK: ["Helsinki", "Finland", "HEL", 60.317, 24.963, "Finland"],
  // Finland
  EFTP: ["Tampere", "Finland", "TMP", 61.414, 23.604, "Finland"],
  EFTU: ["Turku", "Finland", "TKU", 60.514, 22.263, "Finland"],
  EFJY: ["Jyväskylä", "Finland", "JYV", 62.399, 25.678, "Finland"],
  EFMA: ["Mariehamn", "Finland", "MHQ", 60.122, 19.898, "Finland"],
  EFVA: ["Vaasa", "Finland", "VAA", 63.051, 21.762, "Finland"],
  EFJO: ["Joensuu", "Finland", "JOE", 62.658, 29.608, "Finland"],
  EFKU: ["Kuopio", "Finland", "KUO", 63.007, 27.798, "Finland"],
  EFOU: ["Oulu", "Finland", "OUL", 64.930, 25.355, "Finland"],
  EFKK: ["Kokkola", "Finland", "KOK", 63.721, 23.143, "Finland"],
  EFKI: ["Kajaani", "Finland", "KAJ", 64.285, 27.692, "Finland"],
  EFKS: ["Kuusamo", "Finland", "KAO", 65.988, 29.239, "Finland"],
  EFRO: ["Rovaniemi", "Finland", "RVN", 66.565, 25.830, "Finland"],
  EFKT: ["Kittilä", "Finland", "KTT", 67.701, 24.847, "Finland"],
  EFKE: ["Kemi/Tornio", "Finland", "KEM", 65.779, 24.582, "Finland"],
  EFIV: ["Ivalo", "Finland", "IVL", 68.607, 27.405, "Finland"],
  // Baltics
  EETN: ["Tallinn", "Estonia", "TLL", 59.413, 24.833, "Baltics"],
  EETU: ["Tartu", "Estonia", "TAY", 58.307, 26.690, "Baltics"],
  EVRA: ["Riga", "Latvia", "RIX", 56.924, 23.971, "Baltics"],
  EYVI: ["Vilnius", "Lithuania", "VNO", 54.634, 25.286, "Baltics"],
  // Scandinavia
  ESSA: ["Stockholm", "Sweden", "ARN", 59.652, 17.918, "Scandinavia"],
  ESSV: ["Visby", "Sweden", "VBY", 57.663, 18.346, "Scandinavia"],
  ESGG: ["Gothenburg", "Sweden", "GOT", 57.668, 12.292, "Scandinavia"],
  ENGM: ["Oslo", "Norway", "OSL", 60.194, 11.100, "Scandinavia"],
  ENVA: ["Trondheim", "Norway", "TRD", 63.458, 10.924, "Scandinavia"],
  ENBR: ["Bergen", "Norway", "BGO", 60.293, 5.218, "Scandinavia"],
  ENBO: ["Bodø", "Norway", "BOO", 67.269, 14.365, "Scandinavia"],
  ENZV: ["Stavanger", "Norway", "SVG", 58.877, 5.638, "Scandinavia"],
  ENTC: ["Tromsø", "Norway", "TOS", 69.683, 18.919, "Scandinavia"],
  EKCH: ["Copenhagen", "Denmark", "CPH", 55.618, 12.656, "Scandinavia"],
  EKBI: ["Billund", "Denmark", "BLL", 55.740, 9.152, "Scandinavia"],
  BIKF: ["Reykjavík", "Iceland", "KEF", 63.985, -22.605, "Scandinavia"],
  // British Isles
  EGPH: ["Edinburgh", "United Kingdom", "EDI", 55.950, -3.372, "British Isles"],
  EGCC: ["Manchester", "United Kingdom", "MAN", 53.354, -2.275, "British Isles"],
  EIDW: ["Dublin", "Ireland", "DUB", 53.421, -6.270, "British Isles"],
  EGLL: ["London", "United Kingdom", "LHR", 51.470, -0.454, "British Isles"],
  // Central Europe
  EPGD: ["Gdańsk", "Poland", "GDN", 54.378, 18.466, "Central Europe"],
  EPWA: ["Warsaw", "Poland", "WAW", 52.166, 20.967, "Central Europe"],
  EPKK: ["Kraków", "Poland", "KRK", 50.078, 19.785, "Central Europe"],
  EDDH: ["Hamburg", "Germany", "HAM", 53.630, 9.988, "Central Europe"],
  EDDB: ["Berlin", "Germany", "BER", 52.366, 13.503, "Central Europe"],
  EDDL: ["Düsseldorf", "Germany", "DUS", 51.289, 6.767, "Central Europe"],
  EDDM: ["Munich", "Germany", "MUC", 48.354, 11.786, "Central Europe"],
  EDDF: ["Frankfurt", "Germany", "FRA", 50.033, 8.570, "Central Europe"],
  LKPR: ["Prague", "Czechia", "PRG", 50.101, 14.260, "Central Europe"],
  LHBP: ["Budapest", "Hungary", "BUD", 47.439, 19.262, "Central Europe"],
  LOWW: ["Vienna", "Austria", "VIE", 48.110, 16.570, "Central Europe"],
  LOWS: ["Salzburg", "Austria", "SZG", 47.793, 13.004, "Central Europe"],
  LOWI: ["Innsbruck", "Austria", "INN", 47.260, 11.344, "Central Europe"],
  LJLJ: ["Ljubljana", "Slovenia", "LJU", 46.224, 14.458, "Central Europe"],
  LSZH: ["Zürich", "Switzerland", "ZRH", 47.464, 8.549, "Central Europe"],
  LSGG: ["Geneva", "Switzerland", "GVA", 46.238, 6.109, "Central Europe"],
  // Western Europe
  EHAM: ["Amsterdam", "Netherlands", "AMS", 52.309, 4.764, "Western Europe"],
  EBBR: ["Brussels", "Belgium", "BRU", 50.901, 4.484, "Western Europe"],
  LFPG: ["Paris", "France", "CDG", 49.010, 2.548, "Western Europe"],
  LFML: ["Marseille", "France", "MRS", 43.436, 5.215, "Western Europe"],
  LFMN: ["Nice", "France", "NCE", 43.658, 7.215, "Western Europe"],
  // Mediterranean
  LIPZ: ["Venice", "Italy", "VCE", 45.505, 12.352, "Mediterranean"],
  LIPX: ["Verona", "Italy", "VRN", 45.396, 10.888, "Mediterranean"],
  LIPE: ["Bologna", "Italy", "BLQ", 44.535, 11.289, "Mediterranean"],
  LIMC: ["Milan", "Italy", "MXP", 45.630, 8.728, "Mediterranean"],
  LIRQ: ["Florence", "Italy", "FLR", 43.810, 11.205, "Mediterranean"],
  LIRF: ["Rome", "Italy", "FCO", 41.800, 12.239, "Mediterranean"],
  LIRN: ["Naples", "Italy", "NAP", 40.886, 14.291, "Mediterranean"],
  LICC: ["Catania", "Italy", "CTA", 37.467, 15.066, "Mediterranean"],
  LDSP: ["Split", "Croatia", "SPU", 43.539, 16.298, "Mediterranean"],
  LDDU: ["Dubrovnik", "Croatia", "DBV", 42.561, 18.268, "Mediterranean"],
  LATI: ["Tirana", "Albania", "TIA", 41.415, 19.720, "Mediterranean"],
  LGAV: ["Athens", "Greece", "ATH", 37.937, 23.945, "Mediterranean"],
  LGSR: ["Santorini", "Greece", "JTR", 36.399, 25.479, "Mediterranean"],
  LGSA: ["Chania", "Greece", "CHQ", 35.531, 24.150, "Mediterranean"],
  LGKO: ["Kos", "Greece", "KGS", 36.793, 27.092, "Mediterranean"],
  LGRP: ["Rhodes", "Greece", "RHO", 36.405, 28.086, "Mediterranean"],
  LGIR: ["Heraklion", "Greece", "HER", 35.340, 25.180, "Mediterranean"],
  LTAI: ["Antalya", "Turkey", "AYT", 36.899, 30.801, "Mediterranean"],
  LTFG: ["Alanya", "Turkey", "GZP", 36.299, 32.301, "Mediterranean"],
  LCLK: ["Larnaca", "Cyprus", "LCA", 34.875, 33.625, "Mediterranean"],
  // Iberia & Atlantic
  LEBL: ["Barcelona", "Spain", "BCN", 41.297, 2.078, "Iberia & Atlantic"],
  LEPA: ["Palma", "Spain", "PMI", 39.551, 2.739, "Iberia & Atlantic"],
  LEVC: ["Valencia", "Spain", "VLC", 39.489, -0.481, "Iberia & Atlantic"],
  LEAL: ["Alicante", "Spain", "ALC", 38.282, -0.558, "Iberia & Atlantic"],
  LEMD: ["Madrid", "Spain", "MAD", 40.472, -3.561, "Iberia & Atlantic"],
  LEMG: ["Málaga", "Spain", "AGP", 36.675, -4.499, "Iberia & Atlantic"],
  LPPT: ["Lisbon", "Portugal", "LIS", 38.774, -9.134, "Iberia & Atlantic"],
  LPFR: ["Faro", "Portugal", "FAO", 37.014, -7.966, "Iberia & Atlantic"],
  LPMA: ["Funchal", "Portugal", "FNC", 32.694, -16.778, "Iberia & Atlantic"],
  GCRR: ["Lanzarote", "Spain", "ACE", 28.945, -13.605, "Iberia & Atlantic"],
  GCXO: ["Tenerife North", "Spain", "TFN", 28.483, -16.342, "Iberia & Atlantic"],
  GCTS: ["Tenerife South", "Spain", "TFS", 28.044, -16.572, "Iberia & Atlantic"],
  GCLP: ["Las Palmas", "Spain", "LPA", 27.932, -15.387, "Iberia & Atlantic"],
  // Middle East
  OMDB: ["Dubai", "UAE", "DXB", 25.253, 55.364, "Middle East"],
  OTHH: ["Doha", "Qatar", "DOH", 25.273, 51.608, "Middle East"],
  // Asia
  VIDP: ["Delhi", "India", "DEL", 28.566, 77.103, "Asia"],
  ZSPD: ["Shanghai", "China", "PVG", 31.143, 121.805, "Asia"],
  VHHH: ["Hong Kong", "Hong Kong", "HKG", 22.309, 113.915, "Asia"],
  VTBS: ["Bangkok", "Thailand", "BKK", 13.681, 100.747, "Asia"],
  VTSP: ["Phuket", "Thailand", "HKT", 8.113, 98.317, "Asia"],
  WSSS: ["Singapore", "Singapore", "SIN", 1.359, 103.989, "Asia"],
  RJBB: ["Osaka", "Japan", "KIX", 34.427, 135.244, "Asia"],
  RKSI: ["Seoul", "South Korea", "ICN", 37.469, 126.451, "Asia"],
  RJGG: ["Nagoya", "Japan", "NGO", 34.858, 136.805, "Asia"],
  RJAA: ["Tokyo Narita", "Japan", "NRT", 35.765, 140.386, "Asia"],
  RJTT: ["Tokyo Haneda", "Japan", "HND", 35.553, 139.781, "Asia"],
  YMML: ["Melbourne", "Australia", "MEL", -37.673, 144.843, "Asia"],
  // North America
  CYYZ: ["Toronto", "Canada", "YYZ", 43.677, -79.624, "North America"],
  KJFK: ["New York", "United States", "JFK", 40.640, -73.779, "North America"],
  KORD: ["Chicago", "United States", "ORD", 41.978, -87.905, "North America"],
  KSEA: ["Seattle", "United States", "SEA", 47.450, -122.309, "North America"],
  KDFW: ["Dallas", "United States", "DFW", 32.897, -97.038, "North America"],
  KMIA: ["Miami", "United States", "MIA", 25.793, -80.290, "North America"],
  KLAX: ["Los Angeles", "United States", "LAX", 33.942, -118.408, "North America"],
  MUHA: ["Havana", "Cuba", "HAV", 22.989, -82.409, "North America"],
  MDPC: ["Punta Cana", "Dominican Republic", "PUJ", 18.567, -68.363, "North America"],
};

// [destICAO, flightOut, flightBack, aircraft, minutes, category]
const DEST = [
  ["EETN", "AY1011", "AY1012", "A319 / E190", 35, "Short-haul"],
  ["EFTP", "AY269", "AY270", "A319", 35, "Short-haul"],
  ["EFTU", "AY223", "AY224", "A319", 35, "Short-haul"],
  ["EETU", "AY1045", "AY1047", "A319", 45, "Short-haul"],
  ["EFJY", "AY281", "AY282", "A319", 50, "Short-haul"],
  ["EFMA", "AY213", "AY214", "A319", 50, "Short-haul"],
  ["EFVA", "AY311", "AY322", "A319", 50, "Short-haul"],
  ["EFJO", "AY341", "AY342", "A319", 60, "Short-haul"],
  ["EFKU", "AY370", "AY362", "A319 / E190", 60, "Short-haul"],
  ["EVRA", "AY1071", "AY1072", "A319 / E190", 60, "Short-haul"],
  ["ESSA", "AY801", "AY802", "E190 / A321 / A320", 60, "Short-haul"],
  ["EFOU", "AY433", "AY434", "A320 / A321 / E190", 65, "Short-haul"],
  ["EFKK", "AY393", "AY394", "A319", 70, "Short-haul"],
  ["EFKI", "AY415", "AY416", "A319", 75, "Short-haul"],
  ["EFKS", "AY481", "AY482", "A320 / A321 / E190", 75, "Short-haul"],
  ["EYVI", "AY1101", "AY1102", "E190 / A319", 75, "Short-haul"],
  ["ESSV", "AY881", "AY882", "A319", 75, "Short-haul"],
  ["EFRO", "AY531", "AY532", "A320 / A321 / A330", 80, "Short-haul"],
  ["ESGG", "AY671", "AY672", "E190", 85, "Short-haul"],
  ["EFKT", "AY557", "AY558", "A320 / A321", 85, "Short-haul"],
  ["EFKE", "AY581", "AY582", "A319", 90, "Short-haul"],
  ["ENGM", "AY913", "AY914", "A320 / A321 / E190", 90, "Short-haul"],
  ["EPGD", "AY1171", "AY1172", "E190", 95, "Short-haul"],
  ["EFIV", "AY611", "AY612", "A319 / A320", 95, "Short-haul"],
  ["EKCH", "AY961", "AY962", "A320 / A321 / E190", 100, "Short-haul"],
  ["ENVA", "AY923", "AY924", "E190", 100, "Short-haul"],
  ["EPWA", "AY1148", "AY1142", "E190", 105, "Short-haul"],
  ["ENBR", "AY921", "AY922", "A319 / E190", 110, "Short-haul"],
  ["ENBO", "AY931", "AY932", "E190", 115, "Short-haul"],
  ["EDDH", "AY1421", "AY1422", "A320 / A321 / E190", 115, "Short-haul"],
  ["ENZV", "AY921", "AY922", "E190", 115, "Short-haul"],
  ["ENTC", "AY946", "AY947", "A319 / E190", 115, "Short-haul"],
  ["EPKK", "AY1161", "AY1162", "E190", 120, "Short-haul"],
  ["EDDB", "AY1431", "AY1432", "E190 / A320 / A321", 125, "Medium-haul"],
  ["EKBI", "AY5861", "AY5862", "E190", 130, "Medium-haul"],
  ["LKPR", "AY1223", "AY1224", "A320 / A321 / E190", 135, "Medium-haul"],
  ["LHBP", "AY1255", "AY1256", "A320 / A321 / E190", 140, "Medium-haul"],
  ["EDDL", "AY1391", "AY1392", "A320 / A321 / E190", 145, "Medium-haul"],
  ["LOWW", "AY1471", "AY1472", "A320 / A321 / E190", 150, "Medium-haul"],
  ["EHAM", "AY1301", "AY1302", "A320 / A321", 155, "Medium-haul"],
  ["EDDM", "AY1401", "AY1402", "A320 / A321", 155, "Medium-haul"],
  ["LOWS", "AY1501", "AY1502", "A320 / A321", 155, "Medium-haul"],
  ["EBBR", "AY1545", "AY1546", "A320 / A321 / E190", 160, "Medium-haul"],
  ["EDDF", "AY1411", "AY1412", "A320 / A321", 160, "Medium-haul"],
  ["LJLJ", "AY1201", "AY1202", "A321", 160, "Medium-haul"],
  ["EGPH", "AY1373", "AY1376", "A320 / A321 / E190", 165, "Medium-haul"],
  ["LOWI", "AY1491", "AY1492", "A320 / A321", 165, "Medium-haul"],
  ["LSZH", "AY1511", "AY1512", "A320 / A321 / E190", 170, "Medium-haul"],
  ["LIPZ", "AY1781", "AY1782", "A320 / A321", 175, "Medium-haul"],
  ["LIPX", "AY1801", "AY1802", "A320 / A321", 175, "Medium-haul"],
  ["LIPE", "AY1771", "AY1772", "A320 / A321", 180, "Medium-haul"],
  ["LSGG", "AY1531", "AY1532", "A320 / A321", 180, "Medium-haul"],
  ["EGCC", "AY1361", "AY1362", "A320 / A321", 180, "Medium-haul"],
  ["LDSP", "AY1821", "AY1822", "A320 / A321", 180, "Medium-haul"],
  ["LDDU", "AY1831", "AY1832", "A320 / A321", 185, "Medium-haul"],
  ["LIMC", "AY1751", "AY1752", "A320 / A321", 185, "Medium-haul"],
  ["LFPG", "AY1575", "AY1576", "A320 / A321", 185, "Medium-haul"],
  ["EIDW", "AY1381", "AY1382", "A320 / A321 / E190", 190, "Medium-haul"],
  ["EGLL", "AY1331", "AY1332", "A350 / A330 / A320 / A321", 190, "Medium-haul"],
  ["LIRQ", "AY1813", "AY1814", "E190", 195, "Medium-haul"],
  ["LFML", "AY371", "AY372", "A320", 200, "Medium-haul"],
  ["LFMN", "AY1601", "AY1602", "A320 / A321", 205, "Medium-haul"],
  ["LIRF", "AY1761", "AY1762", "A320 / A321", 205, "Medium-haul"],
  ["LATI", "AY1847", "AY1848", "A320", 205, "Medium-haul"],
  ["LIRN", "AY1791", "AY1792", "A320 / A321", 210, "Medium-haul"],
  ["BIKF", "AY991", "AY992", "A320 / A321", 210, "Medium-haul"],
  ["LGAV", "AY2750", "AY2752", "A320", 220, "Medium-haul"],
  ["LTAI", "AY1951", "AY1952", "A320 / A321", 230, "Medium-haul"],
  ["LICC", "AY1805", "AY1806", "A320 / A321", 230, "Medium-haul"],
  ["LGSR", "AY1895", "AY1896", "A320 / A321", 230, "Medium-haul"],
  ["LEBL", "AY5385", "AY1652", "A320 / A321", 235, "Medium-haul"],
  ["LGSA", "AY1859", "AY1860", "A320 / A321", 235, "Medium-haul"],
  ["LGKO", "AY1879", "AY1880", "A320 / A321", 235, "Medium-haul"],
  ["LGRP", "AY1863", "AY1864", "A321", 235, "Medium-haul"],
  ["LTFG", "AY1955", "AY1956", "A320 / A321", 240, "Medium-haul"],
  ["LGIR", "AY1885", "AY1886", "A320 / A321", 240, "Medium-haul"],
  ["LEPA", "AY1691", "AY1692", "A320 / A321", 240, "Medium-haul"],
  ["LEVC", "AY1681", "AY1682", "A320 / A321", 250, "Medium-haul"],
  ["LEAL", "AY1671", "AY1672", "A320 / A321", 260, "Medium-haul"],
  ["LEMD", "AY5389", "AY5390", "A320 / A321", 265, "Medium-haul"],
  ["LEMG", "AY1673", "AY1674", "A320 / A321", 275, "Medium-haul"],
  ["LCLK", "AY1929", "AY1930", "A320 / A321", 275, "Medium-haul"],
  ["LPPT", "AY4395", "AY4396", "A320 / A321", 290, "Medium-haul"],
  ["LPFR", "AY1741", "AY1742", "A320 / A321", 300, "Medium-haul"],
  ["LPMA", "AY1731", "AY1732", "A320 / A321", 345, "Medium-haul"],
  ["GCRR", "AY1711", "AY1712", "A330-300", 365, "Long-haul"],
  ["GCXO", "AY1693", "AY1694", "A330-300", 365, "Long-haul"],
  ["OMDB", "AY1961", "AY1962", "A330-300", 370, "Long-haul"],
  ["GCTS", "AY1695", "AY1696", "A330-300", 370, "Long-haul"],
  ["OTHH", "AY1981", "AY1982", "A330-300", 375, "Long-haul"],
  ["GCLP", "AY1701", "AY1702", "A330-300", 375, "Long-haul"],
  ["VIDP", "AY121", "AY122", "A350-900", 440, "Long-haul"],
  ["CYYZ", "AY31", "AY32", "A330-300 / A350-900", 510, "Long-haul"],
  ["KJFK", "AY15", "AY16", "A330-300 / A350-900", 525, "Long-haul"],
  ["KORD", "AY09", "AY10", "A330-300", 555, "Long-haul"],
  ["KSEA", "AY33", "AY34", "A330-300", 585, "Long-haul"],
  ["ZSPD", "AY87", "AY88", "A350-900", 615, "Long-haul"],
  ["KDFW", "AY19", "AY20", "A350-900", 630, "Long-haul"],
  ["VHHH", "AY99", "AY100", "A350-900", 635, "Long-haul"],
  ["MUHA", "AY28", "AY28", "A350-900", 650, "Long-haul"],
  ["KMIA", "AY7", "AY8", "A350-900", 650, "Long-haul"],
  ["MDPC", "AY23", "AY24", "A350-900", 670, "Long-haul"],
  ["KLAX", "AY01", "AY02", "A350-900", 675, "Long-haul"],
  ["VTBS", "AY141", "AY142", "A350-900", 685, "Long-haul"],
  ["VTSP", "AY151", "AY152", "A350-900", 710, "Long-haul"],
  ["WSSS", "AY131", "AY132", "A350-900", 720, "Long-haul"],
  ["RJBB", "AY69", "AY70", "A350-900", 780, "Ultra-long-haul"],
  ["RKSI", "AY41", "AY42", "A350-900", 780, "Ultra-long-haul"],
  ["RJGG", "AY79", "AY80", "A350-900", 790, "Ultra-long-haul"],
  ["RJAA", "AY73", "AY74", "A350-900", 795, "Ultra-long-haul"],
  ["RJTT", "AY61", "AY62", "A350-900", 810, "Ultra-long-haul"],
  ["YMML", "AY145", "AY146", "A350-900", 1290, "Ultra-long-haul"],
];

// ---- routes.ts ----
const routes = DEST.map(([arr, out, back, ac, min]) => ({
  routeNumber: `${out}/${back}`, dep: "EFHK", arr, aircraft: ac, minutes: min, airline: "Finnair",
}));
const routesTs = `/* AUTO-GENERATED by scripts/gen-network.mjs — official FNVA route database.
   ${routes.length} destinations from Helsinki-Vantaa (EFHK). */

export type Route = { routeNumber: string; dep: string; arr: string; aircraft: string; minutes: number; airline: string };

export const ROUTES: Route[] = ${JSON.stringify(routes, null, 2)};

export const ROUTE_AIRLINES = ["Finnair"] as const;
`;
writeFileSync(new URL("../src/lib/routes.ts", import.meta.url), routesTs);

// ---- airports.ts ----
const airportEntries = Object.entries(AP).map(([icao, [city, country, iata]]) => `  ${icao}: { city: ${JSON.stringify(city)}, country: ${JSON.stringify(country)}, iata: ${JSON.stringify(iata)} },`).join("\n");
const coordEntries = Object.entries(AP).map(([icao, [, , , lat, lon]]) => `  ${icao}: [${lat}, ${lon}],`).join("\n");
const airportsTs = `/* AUTO-GENERATED by scripts/gen-network.mjs — network airports. */
export const AIRPORTS: Record<string, { city: string; country: string; iata: string }> = {
${airportEntries}
};

export function airportCity(icao: string): string {
  return AIRPORTS[icao]?.city ?? icao;
}
export function airportLabel(icao: string): string {
  const a = AIRPORTS[icao];
  return a ? \`\${a.city} (\${a.iata})\` : icao;
}

/* [lat, lon] for each network airport — for the maps. */
export const AIRPORT_COORDS: Record<string, [number, number]> = {
${coordEntries}
};
`;
writeFileSync(new URL("../src/lib/airports.ts", import.meta.url), airportsTs);

// ---- regions.ts ----
const REGION_META = [
  ["Finland", "#0C0243"], ["Baltics", "#3B6FE0"], ["Scandinavia", "#12B5A8"],
  ["Central Europe", "#8E5BFF"], ["Western Europe", "#2BA84A"], ["British Isles", "#E2456A"],
  ["Mediterranean", "#F2A33A"], ["Iberia & Atlantic", "#00A0B0"], ["Middle East", "#C77D2E"],
  ["Asia", "#E0529C"], ["North America", "#5B6CFF"],
];
const byRegion = {};
for (const [icao, info] of Object.entries(AP)) {
  if (icao === "EFHK") continue;
  const reg = info[5];
  (byRegion[reg] ??= []).push(icao);
}
const regionEntries = REGION_META.map(([name, color]) => `  { name: ${JSON.stringify(name)}, color: ${JSON.stringify(color)}, icaos: ${JSON.stringify(byRegion[name] ?? [])} },`).join("\n");
const regionsTs = `/* AUTO-GENERATED by scripts/gen-network.mjs — network regions. */
export type Region = { name: string; color: string; icaos: string[] };

export const REGIONS: Region[] = [
${regionEntries}
];

const ICAO_REGION = new Map<string, Region>();
for (const r of REGIONS) for (const i of r.icaos) ICAO_REGION.set(i, r);

export function regionForIcao(icao: string): Region | null { return ICAO_REGION.get(icao) ?? null; }
export function regionName(icao: string): string { return ICAO_REGION.get(icao)?.name ?? "—"; }
export function regionColor(icao: string): string { return ICAO_REGION.get(icao)?.color ?? "#0C0243"; }
`;
writeFileSync(new URL("../src/lib/regions.ts", import.meta.url), regionsTs);

console.log(`Wrote ${routes.length} routes, ${Object.keys(AP).length} airports, ${REGION_META.length} regions.`);
