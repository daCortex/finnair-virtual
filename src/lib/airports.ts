/* Compact ICAO → city/country lookup for the airports in the Finnair network.
   Used to render friendly route labels across the portal. */
export const AIRPORTS: Record<string, { city: string; country: string; iata: string }> = {
  EFHK: { city: "Helsinki", country: "Finland", iata: "HEL" },
  EFRO: { city: "Rovaniemi", country: "Finland", iata: "RVN" },
  EFOU: { city: "Oulu", country: "Finland", iata: "OUL" },
  EFKT: { city: "Kittilä", country: "Finland", iata: "KTT" },
  EFIV: { city: "Ivalo", country: "Finland", iata: "IVL" },
  EFVA: { city: "Vaasa", country: "Finland", iata: "VAA" },
  ESSA: { city: "Stockholm", country: "Sweden", iata: "ARN" },
  ESGG: { city: "Gothenburg", country: "Sweden", iata: "GOT" },
  EKCH: { city: "Copenhagen", country: "Denmark", iata: "CPH" },
  ENGM: { city: "Oslo", country: "Norway", iata: "OSL" },
  EETN: { city: "Tallinn", country: "Estonia", iata: "TLL" },
  EVRA: { city: "Riga", country: "Latvia", iata: "RIX" },
  EYVI: { city: "Vilnius", country: "Lithuania", iata: "VNO" },
  EGLL: { city: "London", country: "United Kingdom", iata: "LHR" },
  LFPG: { city: "Paris", country: "France", iata: "CDG" },
  EDDF: { city: "Frankfurt", country: "Germany", iata: "FRA" },
  EDDM: { city: "Munich", country: "Germany", iata: "MUC" },
  EHAM: { city: "Amsterdam", country: "Netherlands", iata: "AMS" },
  LSZH: { city: "Zurich", country: "Switzerland", iata: "ZRH" },
  LOWW: { city: "Vienna", country: "Austria", iata: "VIE" },
  EIDW: { city: "Dublin", country: "Ireland", iata: "DUB" },
  EPWA: { city: "Warsaw", country: "Poland", iata: "WAW" },
  EBBR: { city: "Brussels", country: "Belgium", iata: "BRU" },
  LEBL: { city: "Barcelona", country: "Spain", iata: "BCN" },
  LEMD: { city: "Madrid", country: "Spain", iata: "MAD" },
  LIRF: { city: "Rome", country: "Italy", iata: "FCO" },
  LGAV: { city: "Athens", country: "Greece", iata: "ATH" },
  LFMN: { city: "Nice", country: "France", iata: "NCE" },
  LPPT: { city: "Lisbon", country: "Portugal", iata: "LIS" },
  KJFK: { city: "New York", country: "United States", iata: "JFK" },
  KORD: { city: "Chicago", country: "United States", iata: "ORD" },
  KLAX: { city: "Los Angeles", country: "United States", iata: "LAX" },
  KSFO: { city: "San Francisco", country: "United States", iata: "SFO" },
  KSEA: { city: "Seattle", country: "United States", iata: "SEA" },
  KMIA: { city: "Miami", country: "United States", iata: "MIA" },
  KDFW: { city: "Dallas", country: "United States", iata: "DFW" },
  RJTT: { city: "Tokyo", country: "Japan", iata: "HND" },
  RKSI: { city: "Seoul", country: "South Korea", iata: "ICN" },
  ZSPD: { city: "Shanghai", country: "China", iata: "PVG" },
  VHHH: { city: "Hong Kong", country: "Hong Kong", iata: "HKG" },
  WSSS: { city: "Singapore", country: "Singapore", iata: "SIN" },
  RPLL: { city: "Manila", country: "Philippines", iata: "MNL" },
  VTBS: { city: "Bangkok", country: "Thailand", iata: "BKK" },
  VABB: { city: "Mumbai", country: "India", iata: "BOM" },
  VIDP: { city: "Delhi", country: "India", iata: "DEL" },
  OMDB: { city: "Dubai", country: "UAE", iata: "DXB" },
  OTHH: { city: "Doha", country: "Qatar", iata: "DOH" },
  YSSY: { city: "Sydney", country: "Australia", iata: "SYD" },
  WMKK: { city: "Kuala Lumpur", country: "Malaysia", iata: "KUL" },
};

export function airportCity(icao: string): string {
  return AIRPORTS[icao]?.city ?? icao;
}
export function airportLabel(icao: string): string {
  const a = AIRPORTS[icao];
  return a ? `${a.city} (${a.iata})` : icao;
}

/* Approximate [lat, lon] for each network airport — for the live map. */
export const AIRPORT_COORDS: Record<string, [number, number]> = {
  EFHK: [60.32, 24.96], EFRO: [66.56, 25.83], EFOU: [64.93, 25.37], EFKT: [67.70, 24.85],
  EFIV: [68.61, 27.41], EFVA: [63.05, 21.76], ESSA: [59.65, 17.92], ESGG: [57.67, 12.29],
  EKCH: [55.62, 12.65], ENGM: [60.19, 11.10], EETN: [59.41, 24.83], EVRA: [56.92, 23.97],
  EYVI: [54.64, 25.29], EGLL: [51.47, -0.46], LFPG: [49.01, 2.55], EDDF: [50.03, 8.57],
  EDDM: [48.35, 11.79], EHAM: [52.31, 4.76], LSZH: [47.46, 8.55], LOWW: [48.11, 16.57],
  EIDW: [53.42, -6.27], EPWA: [52.17, 20.97], EBBR: [50.90, 4.48], LEBL: [41.30, 2.08],
  LEMD: [40.47, -3.57], LIRF: [41.80, 12.25], LGAV: [37.94, 23.95], LFMN: [43.66, 7.21],
  LPPT: [38.77, -9.13], KJFK: [40.64, -73.78], KORD: [41.98, -87.90], KLAX: [33.94, -118.41],
  KSFO: [37.62, -122.38], KSEA: [47.45, -122.31], KMIA: [25.79, -80.29], KDFW: [32.90, -97.04],
  RJTT: [35.55, 139.78], RKSI: [37.46, 126.44], ZSPD: [31.14, 121.81], VHHH: [22.31, 113.91],
  WSSS: [1.36, 103.99], RPLL: [14.51, 121.02], VTBS: [13.69, 100.75], VABB: [19.09, 72.87],
  VIDP: [28.57, 77.10], OMDB: [25.25, 55.36], OTHH: [25.27, 51.61], YSSY: [-33.95, 151.18],
  WMKK: [2.75, 101.71],
};
