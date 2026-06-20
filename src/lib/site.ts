/* ----------------------------------------------------------------
   Finnair Virtual — public marketing site content.
   Mirrors finnairvirtual.lovable.app (the airline's own site).
------------------------------------------------------------------- */

export const SITE = {
  network: { airports: 112, routes: 224, hub: "EFHK" },
  fleetCount: 7,
  longestRangeNm: 8100,
  longestSector: "13h 20m",
  avgSector: "4h 21m",
  mission:
    "An Infinite Flight virtual airline dedicated to simulating the absolute pinnacle of aviation. Join a community of pilots committed to realism, excellence, and Nordic precision.",
  copyright: "© 2026 Finnair Virtual. All rights reserved. Not affiliated with the real-world Finnair Airlines.",
  madeBy: "Made by Ayaz with love for Finnair VA.",
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
  { type: "Embraer E190", pax: 100, cruiseAlt: "41,000 ft", cruiseSpeed: "Mach 0.82", rangeNm: 2450, reg: "OH-LKE", engines: "2 × GE CF34-10E", acquired: 2006, role: "Regional connector for thin domestic and short Nordic legs", routesFlown: 68, family: "Regional" },
  { type: "Airbus A319", pax: 144, cruiseAlt: "41,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 3700, reg: "OH-LVA", engines: "2 × CFM56-5B", acquired: 1999, role: "Short-haul backbone for European city pairs under 3 hours", routesFlown: 100, family: "Narrowbody" },
  { type: "Airbus A320", pax: 174, cruiseAlt: "39,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 3300, reg: "OH-LXA", engines: "2 × CFM56-5B", acquired: 2002, role: "Workhorse for higher-density continental routes across Europe", routesFlown: 100, family: "Narrowbody" },
  { type: "Airbus A321", pax: 209, cruiseAlt: "39,000 ft", cruiseSpeed: "Mach 0.78", rangeNm: 3200, reg: "OH-LZA", engines: "2 × CFM56-5B", acquired: 1999, role: "Peak-capacity European workhorse — leisure routes and busy trunk lines", routesFlown: 72, family: "Narrowbody" },
  { type: "Airbus A330-300", pax: 279, cruiseAlt: "41,000 ft", cruiseSpeed: "Mach 0.86", rangeNm: 6340, reg: "OH-LTM", engines: "2 × Rolls-Royce Trent 772B", acquired: 2009, role: "Medium-long haul to North America and the Middle East", routesFlown: 16, family: "Widebody" },
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
  { name: "Brussels-Zaventem", icao: "EBBR", iata: "BRU", city: "Brussels", country: "Belgium", role: "Cargo Ops", coords: "50.9014° N · 4.4844° E", blurb: "European cargo gateway — freighter turnarounds and belly-cargo feeders." },
  { name: "London Heathrow", icao: "EGLL", iata: "LHR", city: "London", country: "United Kingdom", role: "Cargo Ops", coords: "51.4700° N · 0.4543° W", blurb: "Transatlantic cargo interchange for high-value freight operations." },
];

export const SITE_MODES = [
  {
    name: "Casual Mode",
    unlock: "Aurora · 0h",
    tagline: "Fly the line at your own pace",
    desc: "The default experience for new pilots. File any unlocked route, log the PIREP, and earn Aurora Points without rigid scheduling.",
    bestFor: "Pilots who fly when they can and want progression without pressure",
    pros: ["No schedule windows", "Any unlocked aircraft / route", "Counts toward rank progression"],
    multiplier: "1.0×",
    scope: "Any unlocked",
  },
  {
    name: "Career Mode",
    unlock: "Elysian · 75h",
    tagline: "A structured, simulated career",
    desc: "Bid for monthly rotations, follow a fixed roster, and operate under realistic airline constraints — fatigue, rest, and reserve duty all apply.",
    bestFor: "Pilots who want a real-world airline rhythm and faster progression",
    pros: ["Higher AP earn rate", "Counts double toward rank", "Eligible for command upgrade pathway"],
    multiplier: "1.25×",
    scope: "Rostered",
  },
  {
    name: "Cargo Mode",
    unlock: "Zenith · 300h · application",
    tagline: "Freight, ferry, and charter ops",
    desc: "Operate dedicated cargo routes on the A330 and A350 plus Boeing freighter ferry legs. Cargo ops run alongside Casual or Career mode, not as a replacement.",
    bestFor: "Senior pilots who want long, technical sectors and unusual routings",
    pros: ["Exclusive long-haul cargo network", "Bonus AP on tech-stop / ferry legs", "Higher the risk, higher the reward!"],
    multiplier: "Bonus",
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
    role: "Founder & Chairman of the Board",
    name: "Ayaz Molla",
    ifc: "ayaz_molla",
    pfp: "/staff/zyrex.png",
    title: "When we started this journey",
    message:
      "When we started this journey, our vision was to create more than just a virtual airline; we wanted to build a family of aviation enthusiasts united by a love of realistic operations and Nordic precision. Thank you to every member of staff and every pilot who makes Finnair Virtual what it is.",
  },
  {
    role: "Chief Executive Officer",
    name: "Lucian Y.",
    ifc: "randomaviator2",
    pfp: "/staff/lucian.png",
    title: "A tight, professional operation",
    message:
      "We run a tight, professional operation. Progress through nine ranks, unlock aircraft and routes as you climb, and earn Aurora tokens through our proprietary banking system. Whether you fly casually or chase the Luminary command seat, there's a structured path waiting for you.",
  },
] as const;

export const SITE_ORG = [
  { unit: "Operations", roles: [{ role: "COO", who: "Vacant" }, { role: "HR Officer", who: "Vacant" }] },
  { unit: "Marketing", roles: [{ role: "CMO", who: "Vacant" }, { role: "Social Manager", who: "Vacant" }] },
  { unit: "Route Coordinators", roles: [{ role: "Route Manager", who: "Vacant" }, { role: "Event Manager", who: "Vacant" }, { role: "Event Manager", who: "Vacant" }, { role: "Event Manager", who: "Vacant" }] },
  { unit: "Training", roles: [{ role: "Training Manager", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }, { role: "Flight Instructor", who: "Vacant" }] },
] as const;
