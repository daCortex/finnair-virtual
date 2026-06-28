/* ----------------------------------------------------------------
   Finnair Virtual — public marketing site content.
   Mirrors finnairvirtual.lovable.app (the airline's own site).
------------------------------------------------------------------- */

export const SITE = {
  network: { airports: 112, routes: 224, hub: "EFHK" },
  fleetCount: 7,
  longestRangeNm: 8100,
  longestSector: "21h 30m",
  avgSector: "4h 21m",
  mission:
    "An Infinite Flight virtual airline dedicated to simulating the absolute pinnacle of aviation. Join a community of pilots committed to realism, excellence, and Nordic precision.",
  copyright: "Finnair Virtual is a virtual airline exclusively for the Infinite Flight platform. It has no connection or affiliation with Finnair or any other real-world airline, organisation or subsidiary. All logos and trademarks remain the property of their respective owners.",
  madeBy: "Made by Ayaz with love for Finnair Virtual.",
} as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/fleet", label: "Fleet" },
  { href: "/hubs", label: "Hubs" },
  { href: "/routes", label: "Routes" },
  { href: "/career", label: "Career" },
  { href: "/ranks", label: "Ranks" },
  { href: "/modes", label: "Modes" },
  { href: "/plus", label: "Finnair Plus" },
] as const;

export type SiteAircraft = {
  type: string;
  pax: number;
  cruiseAlt: string;
  cruiseSpeed: string;
  rangeNm: number;
  reg: string;
  engines: string;
  acquired: number;
  role: string;
  routesFlown: number;
  family: "Regional" | "Narrowbody" | "Widebody" | "Heritage";
  historic?: boolean; // not flown on scheduled routes — group flights only
  accent?: string; // card illumination colour (used to make a card stand out)
};

export const SITE_FLEET: SiteAircraft[] = [
  { type: "Embraer E190", pax: 100, cruiseAlt: "41,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 2450, reg: "OH-LKE", engines: "2 × GE CF34-10E", acquired: 2006, role: "Regional connector for thin domestic and short Nordic legs", routesFlown: 68, family: "Regional" },
  { type: "Airbus A319", pax: 144, cruiseAlt: "41,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 3700, reg: "OH-LVA", engines: "2 × CFM56-5B", acquired: 1999, role: "Short-haul backbone for European city pairs under 3 hours", routesFlown: 100, family: "Narrowbody" },
  { type: "Airbus A320", pax: 174, cruiseAlt: "39,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 3300, reg: "OH-LXA", engines: "2 × CFM56-5B", acquired: 2002, role: "Workhorse for higher-density continental routes across Europe", routesFlown: 100, family: "Narrowbody" },
  { type: "Airbus A321", pax: 209, cruiseAlt: "39,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 3200, reg: "OH-LZA", engines: "2 × CFM56-5B", acquired: 1999, role: "Peak-capacity European workhorse — leisure routes and busy trunk lines", routesFlown: 72, family: "Narrowbody" },
  { type: "Airbus A330-300", pax: 279, cruiseAlt: "41,000 ft", cruiseSpeed: "Mach 0.82", rangeNm: 6340, reg: "OH-LTM", engines: "2 × Rolls-Royce Trent 772B", acquired: 2009, role: "Medium-long haul to North America and the Middle East", routesFlown: 16, family: "Widebody" },
  { type: "Airbus A350-900", pax: 321, cruiseAlt: "43,000 ft", cruiseSpeed: "Mach 0.85", rangeNm: 8100, reg: "OH-LWA", engines: "2 × Rolls-Royce Trent XWB-84", acquired: 2015, role: "Flagship long-haul aircraft for Asia and transatlantic services", routesFlown: 50, family: "Widebody" },
  { type: "Boeing 757-200", pax: 227, cruiseAlt: "38,000 ft", cruiseSpeed: "Mach 0.80", rangeNm: 3900, reg: "OH-LBR", engines: "2 × Rolls-Royce RB211-535E4", acquired: 1997, role: "Heritage leisure jet in historic Finnair livery — reserved exclusively for special group flights and events, never scheduled routes.", routesFlown: 0, family: "Heritage", historic: true, accent: "#2E7BF6" },
];

export type SiteHub = {
  name: string;
  icao: string;
  iata: string;
  city: string;
  country: string;
  role: "Main Hub" | "Cargo Ops";
  coords: string;
  careerCount?: number;
  blurb: string;
};

export const SITE_HUBS: SiteHub[] = [
  { name: "Helsinki-Vantaa", icao: "EFHK", iata: "HEL", city: "Helsinki", country: "Finland", role: "Main Hub", coords: "60.3172° N · 24.9633° E", careerCount: 220, blurb: "Primary operating base. Every long-haul rotation and most short-haul rotations originate or terminate here. Helsinki's northern geography makes it the shortest physical bridge between Europe and East Asia." },
  { name: "Brussels-Zaventem", icao: "EBBR", iata: "BRU", city: "Brussels", country: "Belgium", role: "Cargo Ops", coords: "50.9014° N · 4.4844° E", blurb: "Our continental cargo gateway. Sitting at the heart of Western Europe, Brussels feeds freight into the EU network with quick freighter turnarounds and belly-cargo connections — the launch point for most of our short and medium-haul Logistics Command contracts." },
  { name: "London Heathrow", icao: "EGLL", iata: "LHR", city: "London", country: "United Kingdom", role: "Cargo Ops", coords: "51.4700° N · 0.4543° W", blurb: "Our transatlantic interchange — belly-hold freight and high-value express consignments connecting onward to North America." },
];

export const SITE_MODES = [
  {
    name: "Casual Mode",
    unlock: "Aurora · 0h",
    tagline: "Fly the line at your own pace",
    desc: "The default experience for new pilots. File any unlocked route, log the PIREP, and earn Aurora Points without rigid scheduling.",
    bestFor: "Pilots who fly when they can and want progression without pressure",
    pros: ["No schedule windows", "Any unlocked aircraft / route", "Counts toward rank progression"],
    multiplier: "Standard AP",
    scope: "Any unlocked",
  },
  {
    name: "Career Mode",
    unlock: "Elysian · 75h",
    tagline: "A structured, simulated career",
    desc: "Bid for monthly rotations, follow a fixed roster, and operate under realistic airline constraints — fatigue, rest, and reserve duty all apply.",
    bestFor: "Pilots who want a real-world airline rhythm and faster progression",
    pros: ["AP + a flat on-time bonus", "Counts double toward rank", "Eligible for command upgrade pathway"],
    multiplier: "AP + on-time bonus",
    scope: "Rostered",
  },
  {
    name: "Cargo Mode",
    unlock: "Zenith · 300h · staff approval",
    tagline: "Freight, ferry, and charter ops",
    desc: "A separate freight track that runs alongside Casual or Career mode. Move loads out of Brussels & London for Logistic Coins (LC). Unlocking it requires reaching Zenith and a quick staff application to confirm you're ready for the heavier ops.",
    bestFor: "Senior pilots who want long, technical sectors and unusual routings",
    pros: ["Earns Logistic Coins, not AP", "Higher risk bands pay more", "Staff application required to unlock"],
    multiplier: "Logistic Coins (LC)",
    scope: "Freight network",
  },
] as const;

export const PLUS_EARN = [
  { label: "Short-haul", note: "under 2 hours", ap: 100 },
  { label: "Medium-haul", note: "2–6 hours", ap: 300 },
  { label: "Long-haul", note: "over 6 hours", ap: 900 },
] as const;

/* About — leadership & org */
export const SITE_LEADERS = [
  {
    role: "Founder & CEO",
    name: "Ayaz Molla",
    ifc: "ayaz_molla",
    pfp: "/staff/zyrex.png",
    title: "Making the experience realistic and limitless",
    message:
      "I have been flying in Infinite Flight for more than 3 years and have been a pilot in many VAs — namely Qatari, Saudia, Indian, Aeroflot and Starlux — and have previously been staff for Qatari Virtual. In my time as a pilot, I noticed most VAs depend on human intervention to run effectively, which also limits the experience of fellow pilots. As Finnair VA CEO & Founder, my aim is to minimise that by making most things pre-planned, automated, simpler and quicker — making the experience of FVA pilots feel very realistic and limitless. Pilots unlock new routes and aircraft types as they progress through their rank. Every FVA pilot is part of the Finnair Plus banking system: they earn Aurora Points in Career mode to unlock passenger codeshare airlines, and Logistic Coins in Cargo mode to unlock cargo codeshare routes. Every play mode has been meticulously crafted and automated, with daily flight dispatches in the crew centre and rewards to be claimed on every flight. Thank you to every member of staff and every pilot who makes Finnair Virtual what it is. Special thanks to my friends Ayush, Victor and Luca for making this possible.",
  },
  {
    role: "Chief Operating Officer",
    name: "Luca",
    ifc: "randomaviator2",
    pfp: "/staff/lucian.png",
    title: "A tight, professional operation",
    message:
      "We run a tight, professional operation. Progress through nine ranks, unlock aircraft and routes as you climb, and earn Aurora tokens through our proprietary banking system. Whether you fly casually or chase the Luminary command seat, there's a structured path waiting for you.",
  },
] as const;

export const SITE_ORG = [
  { unit: "Operations", roles: [{ role: "CHRO", who: "Vacant" }, { role: "Codeshare Officer", who: "Vacant" }] },
  { unit: "Marketing", roles: [{ role: "CMO", who: "Vacant" }, { role: "Social Manager", who: "Vacant" }] },
  { unit: "Route Coordinators", roles: [{ role: "Route Manager", who: "Vacant" }, { role: "Event Manager", who: "Vacant" }, { role: "Event Manager", who: "Vacant" }, { role: "Event Manager", who: "Vacant" }] },
  { unit: "Training", roles: [{ role: "Training Manager", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }] },
] as const;
