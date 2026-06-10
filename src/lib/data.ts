/* ----------------------------------------------------------------
   Finnair Virtual — shared content/data (single source of truth)
   An independent, fan-made virtual airline inspired by Finnair. Items
   marked TODO need real values (Discord invite, application form URLs).
------------------------------------------------------------------- */

export const BRAND = {
  name: "Finnair Virtual",
  group: "Finnair Virtual",
  tagline: "The Nordic Way to Fly",
  welcome: "Your Journey North Starts Here.",
  intro:
    "Welcome to Finnair Virtual — a virtual airline for aviation enthusiasts built on Nordic design, hospitality and smooth travel, where realism meets a calm, welcoming community.",
  disclaimer:
    "Finnair Virtual is an independent virtual organisation for flight simulation. It is not affiliated with, endorsed by, or connected to Finnair Plc, the oneworld alliance, or Infinite Flight.",
  // The Discord invite is shared privately with applicants once accepted —
  // it is intentionally NOT published anywhere on the public site.
} as const;

// External integrations (application forms / route database).
export const LINKS = {
  pilotApplication: "#", // TODO: pilot application form
  staffApplication: "#", // TODO: staff application form
  routeDatabase: "#", // TODO: published route database
  credits: "#", // TODO: credits page
  // Application review (form editors / responses) — set when configured.
  pilotApplicationReview: "#",
  staffApplicationReview: "#",
  pilotResponsesSheetId: "",
  staffResponsesSheetId: "",
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/staff", label: "Staff" },
  { href: "/ranks", label: "Ranks" },
  { href: "/operations", label: "Operations" },
  { href: "/news", label: "News" },
  { href: "/codeshares", label: "Codeshares" },
] as const;

export const STATS = [
  { value: 6, suffix: "+", label: "Aircraft types", note: "all-Airbus mainline + regional" },
  { value: 200, suffix: "+", label: "Routes", note: "with our codeshare partners" },
  { value: 100, suffix: "+", label: "Destinations", note: "across Europe, Asia & beyond" },
] as const;

export const PILLARS = [
  {
    title: "Sustainability",
    body: "A commitment to responsible, lower-emission flying and the long path toward carbon-neutral operations.",
  },
  {
    title: "Nordic Heritage",
    body: "A century of Finnish aviation carried in every detail — from cabin design down to the procedure.",
  },
  {
    title: "Comfort & Simplicity",
    body: "Calm, uncluttered travel and sophisticated clarity, from your first PIREP to touchdown.",
  },
  {
    title: "Inclusion",
    body: "A welcoming community where every pilot — from first solo to captain — belongs and grows.",
  },
] as const;

export type Aircraft = {
  type: string;
  variant: string;
  reg: string;
  tagline: string;
  slogan: string;
  family: string;
  seats: number;
  range_nm: number;
  role: string;
  note?: string;
  engines: string; // e.g. "2 × Rolls-Royce Trent XWB-84"
  thrust: string; // e.g. "84,200 lbf each"
  mtow: string; // max take-off weight, e.g. "280 t"
  cruise: string; // typical cruise, e.g. "Mach 0.85"
  recommended: { route: string; flightNo: string }[]; // 1–2 signature routes
};

export const FLEET: Aircraft[] = [
  {
    type: "A350-900",
    variant: "A350-941XWB",
    reg: "OH-LWP",
    tagline: "The Flagship",
    slogan: "Over the Top of the World",
    family: "Widebody",
    seats: 336,
    range_nm: 8100,
    role: "Long-haul flagship — the backbone of our Europe–Asia network across the Arctic.",
    engines: "2 × Rolls-Royce Trent XWB-84",
    thrust: "84,200 lbf each",
    mtow: "280 t",
    cruise: "Mach 0.85 · FL410",
    recommended: [
      { route: "EFHK → RJTT", flightNo: "AY73" },
      { route: "EFHK → KJFK", flightNo: "AY15" },
    ],
  },
  {
    type: "A330-300",
    variant: "A330-302",
    reg: "OH-LTO",
    tagline: "The Long-Hauler",
    slogan: "Reliable Range",
    family: "Widebody",
    seats: 263,
    range_nm: 6100,
    role: "Widebody for high-demand long-haul and seasonal leisure routes.",
    engines: "2 × GE CF6-80E1",
    thrust: "68,500 lbf each",
    mtow: "233 t",
    cruise: "Mach 0.82 · FL390",
    recommended: [
      { route: "EFHK → OMDB", flightNo: "AY131" },
      { route: "EFHK → VTBS", flightNo: "AY141" },
    ],
  },
  {
    type: "A321",
    variant: "A321-231",
    reg: "OH-LZL",
    tagline: "The European Workhorse",
    slogan: "Precision Across the Continent",
    family: "Narrowbody",
    seats: 209,
    range_nm: 3200,
    role: "High-capacity short and medium-haul jet on our busiest European trunk routes.",
    engines: "2 × IAE V2500 / CFM56-5B",
    thrust: "33,000 lbf each",
    mtow: "93 t",
    cruise: "Mach 0.78 · FL360",
    recommended: [
      { route: "EFHK → EGLL", flightNo: "AY1331" },
      { route: "EFHK → LFPG", flightNo: "AY871" },
    ],
  },
  {
    type: "A320",
    variant: "A320-214",
    reg: "OH-LXA",
    tagline: "The All-Rounder",
    slogan: "Nordic Connections",
    family: "Narrowbody",
    seats: 174,
    range_nm: 3000,
    role: "Short-haul workhorse linking Helsinki with the Nordics and northern Europe.",
    engines: "2 × CFM56-5B",
    thrust: "27,000 lbf each",
    mtow: "78 t",
    cruise: "Mach 0.78 · FL360",
    recommended: [
      { route: "EFHK → ESSA", flightNo: "AY811" },
      { route: "EFHK → EKCH", flightNo: "AY661" },
    ],
  },
  {
    type: "Embraer 190",
    variant: "E190 (Nordic Regional)",
    reg: "OH-LKE",
    tagline: "The Regional",
    slogan: "Lapland & Beyond",
    family: "Regional",
    seats: 100,
    range_nm: 2200,
    role: "Regional jet for domestic Finland and thinner European routes, in Nordic Regional colours.",
    note: "Flown as the E190 where available, or an A319 stand-in in Infinite Flight.",
    engines: "2 × GE CF34-10E",
    thrust: "18,500 lbf each",
    mtow: "51 t",
    cruise: "Mach 0.78 · FL360",
    recommended: [
      { route: "EFHK → EFRO", flightNo: "AY531" },
      { route: "EFHK → EETN", flightNo: "AY1011" },
    ],
  },
];

/* Engine/thrust specs for codeshare aircraft, looked up by model keyword.
   Keeps the codeshare detail view informative without a full per-type table. */
export const AIRCRAFT_SPECS: { match: string; engines: string; thrust: string }[] = [
  { match: "A350", engines: "2 × Rolls-Royce Trent XWB", thrust: "~84,000 lbf" },
  { match: "A330", engines: "2 × Trent 700 / GE CF6 / PW4000", thrust: "~70,000 lbf" },
  { match: "A321", engines: "2 × CFM LEAP-1A / PW1100G", thrust: "~32,000 lbf" },
  { match: "A320", engines: "2 × CFM56 / LEAP-1A", thrust: "~27,000 lbf" },
  { match: "A319", engines: "2 × CFM56 / IAE V2500", thrust: "~23,000 lbf" },
  { match: "A318", engines: "2 × CFM56 / PW6000", thrust: "~23,000 lbf" },
  { match: "A220", engines: "2 × Pratt & Whitney PW1500G", thrust: "~23,300 lbf" },
  { match: "A380", engines: "4 × Trent 900 / GP7200", thrust: "~70,000 lbf" },
  { match: "747", engines: "4 × GE CF6 / PW4000 / RB211", thrust: "~62,000 lbf" },
  { match: "777", engines: "2 × GE90 / PW4000 / Trent 800", thrust: "~110,000 lbf" },
  { match: "787", engines: "2 × GEnx / Trent 1000", thrust: "~74,000 lbf" },
  { match: "767", engines: "2 × GE CF6 / PW4000", thrust: "~60,000 lbf" },
  { match: "757", engines: "2 × RB211 / PW2000", thrust: "~40,000 lbf" },
  { match: "737", engines: "2 × CFM56 / LEAP-1B", thrust: "~27,000 lbf" },
  { match: "E19", engines: "2 × GE CF34", thrust: "~18,500 lbf" },
  { match: "E17", engines: "2 × GE CF34", thrust: "~14,200 lbf" },
  { match: "ATR", engines: "2 × Pratt & Whitney PW127", thrust: "Turboprop" },
];

export function specFor(model: string): { engines: string; thrust: string } | null {
  const m = model.toUpperCase();
  return AIRCRAFT_SPECS.find((s) => m.includes(s.match)) ?? null;
}

export type Hub = {
  city: string;
  iata: string;
  icao: string;
  primary?: boolean;
  region: string;
  /* normalized 0–100 coords on an equirectangular world map */
  x: number;
  y: number;
  blurb?: string;
  departuresPerDay?: number;
  destinations?: number;
  facts?: string[];
};

/* General Finnair fun facts, mixed into each hub's fact pool. */
export const FINNAIR_FACTS: string[] = [
  "Finnair was founded on 1 November 1923, making it one of the oldest airlines still operating.",
  "Finnair has one of the strongest safety records in the industry — no fatal jet accident in its history.",
  "Helsinki's location lets Finnair fly the shortest routes between Europe and Asia, straight over the Arctic.",
  "Finnair joined the oneworld alliance in 1999 as one of its early members.",
  "Every Finnair flight uses the simple callsign “Finnair” — our virtual flights wear the AY code too.",
  "Finnair's mainline fleet is all-Airbus, led by the long-range A350 XWB.",
  "Finnair's signature shade is Twilight Blue, set against a crisp white livery.",
];

// Finnair Virtual's Finnish hubs.
export const HUBS: Hub[] = [
  {
    city: "Helsinki-Vantaa",
    iata: "HEL",
    icao: "EFHK",
    primary: true,
    region: "Finland",
    x: 56.93,
    y: 16.49,
    blurb: "Our headquarters and the Nordic gateway between Europe and Asia.",
    departuresPerDay: 120,
    destinations: 90,
    facts: [
      "Helsinki-Vantaa (EFHK) is Finland's main airport and Finnair's home base.",
      "Helsinki is one of the world's northernmost capital cities.",
      "The airport is famed for its calm, design-led terminals and fast Asia connections.",
      "EFHK sits about 18 km north of central Helsinki.",
    ],
  },
  {
    city: "Rovaniemi",
    iata: "RVN",
    icao: "EFRO",
    region: "Finnish Lapland",
    x: 57.18,
    y: 13.02,
    blurb: "Our gateway to the Arctic — the official Airport of Santa Claus.",
    departuresPerDay: 12,
    destinations: 6,
    facts: [
      "Rovaniemi (EFRO) sits right on the Arctic Circle in Finnish Lapland.",
      "It is marketed as the official hometown — and airport — of Santa Claus.",
      "Winter brings a surge of charter traffic for the Northern Lights and snow.",
      "Long polar nights make it one of the best places on Earth to see the aurora.",
    ],
  },
];

// The 9-rank career ladder (Aurora → Luminary) lives in lib/career.ts — the
// single source of truth for the AP economy, licenses and tiers. Re-exported
// here so existing imports (rank.ts, Crew Center) keep working.
export { RANKS, type Rank } from "./career";
import { RANKS as RANK_LIST } from "./career";

// A manual trainee tag staff can assign below the entry rank (not hours-based).
export const ACRUX_RANK = {
  name: "Cadet",
  hours: 0,
  note: "Trainee — assigned manually by staff before first solo.",
  manual: true,
} as const;

// The full ladder as displayed (Cadet sits below the entry rank Aurora).
export const RANK_LADDER = [ACRUX_RANK, ...RANK_LIST];

// Every rank label staff can assign in the Crew Center (career ranks + Cadet).
export const RANK_NAMES: readonly string[] = [
  ...RANK_LIST.map((r) => r.name),
  ACRUX_RANK.name,
];

export type StaffMember = {
  role: string;
  name?: string;
  handle?: string;
  bio?: string;
  vacant?: boolean;
  note?: string;
};

export type StaffGroup = {
  group: string;
  members: StaffMember[];
};

export const STAFF_GROUPS: StaffGroup[] = [
  {
    group: "Executive Governing Body",
    members: [
      {
        role: "Chairman",
        name: "Aarne",
        bio: "Aviation enthusiast and the founder of Finnair Virtual. I started this community to bring Nordic calm and realism to virtual flying, and I spend my time keeping the operation professional, welcoming and a little bit Finnish.",
      },
      {
        role: "President",
        name: "Saima",
        bio: "Focused on airline operations, realism and community. As President I help Finnair Virtual grow while keeping it a friendly place to fly. Outside the sim I enjoy reading, music and long walks in the cold.",
      },
      {
        role: "Executive Director",
        name: "Eino",
        bio: "A long-time avgeek who believes in doing things the right way. As Executive Director I make sure the airline runs with professionalism and genuine enthusiasm, backed by a dedicated staff team. Hyvää lentoa — happy flying!",
      },
    ],
  },
  {
    group: "Board of Directors",
    members: [
      {
        role: "Director of Marketing",
        name: "Venla",
        bio: "Creative designer with a love of branding, events and clean Nordic aesthetics. I look after graphics and the community experience here at Finnair Virtual. Off-sim I'm into running, cycling and design projects.",
      },
      {
        role: "Director of HR",
        name: "Onni",
        bio: "Here to make joining and growing at Finnair Virtual feel effortless. I spend my free time plane-spotting and flying virtually whenever the Northern skies are clear.",
      },
      {
        role: "Director of Operations",
        name: "Kaarina",
        bio: "I bring a dispatch and crew-scheduling mindset to the role, building the routes, schedules and tools that make every flight feel realistic. Professionalism and immersion are what I care about most.",
      },
    ],
  },
  {
    group: "Marketing",
    members: [
      {
        role: "Graphic Designer",
        name: "Niilo",
        bio: "I create clean, modern promotional graphics and social content that match Finnair Virtual's calm, design-led style.",
      },
      {
        role: "Graphic Designer",
        vacant: true,
        note: "Portfolio required — message Finnair Virtual to apply or learn more.",
      },
      {
        role: "Social Media Manager",
        name: "Aino",
        bio: "Hello! I'm a minor avgeek who loves planes, trains and ships. My favourite aircraft is the A350. I keep our socials active and help spread the word about the VA.",
      },
      {
        role: "Event Manager",
        vacant: true,
      },
    ],
  },
  {
    group: "Operations",
    members: [
      {
        role: "Document Manager",
        name: "Tapio",
        bio: "I keep our manuals, charts and resources accurate and up to date so that every pilot gets the most realistic experience possible. I'm all about professionalism and detail.",
      },
      {
        role: "Route Manager",
        vacant: true,
      },
      {
        role: "PIREP Manager",
        name: "Helmi",
        bio: "I look after PIREPs at Finnair Virtual — reviewing reports and crediting hours. You'll usually find me somewhere in the virtual skies over the Baltic.",
      },
    ],
  },
  {
    group: "Human Resources",
    members: [
      { role: "Chief Recruiter", vacant: true },
      { role: "Recruiter", vacant: true },
      { role: "Recruiter", vacant: true },
      { role: "Chief Pilot", vacant: true },
    ],
  },
];

export type Partner = {
  name: string;
  kind: string;
};

export const PARTNERS: Partner[] = [
  { name: "British Airways Virtual", kind: "United Kingdom" },
  { name: "Iberia Virtual", kind: "Spain" },
  { name: "Aer Lingus Virtual", kind: "Ireland" },
  { name: "SAS Virtual", kind: "Scandinavia" },
  { name: "Qatari Virtual", kind: "Qatar" },
  { name: "Japan Airlines Virtual", kind: "Japan" },
  { name: "Cathay Virtual", kind: "Hong Kong" },
  { name: "Malaysia Airlines Virtual", kind: "Malaysia" },
  { name: "Qantas Virtual", kind: "Australia" },
  { name: "American Virtual", kind: "United States" },
];

export type Requirement = string;

export const APPLY = {
  pilot: {
    title: "Pilot Application",
    minAge: 13,
    requirements: [
      "Infinite Flight Pro subscription",
      "At least Grade 3",
      "Active IFC account in good standing",
      "Discord access",
      "At least 13 years old",
      "Not on the IFVARB Blacklist or Watchlist",
      "File at least one PIREP every 2 weeks",
      "Constant Discord usage",
    ] as Requirement[],
  },
  staff: {
    title: "Staff Application",
    minAge: 16,
    requirements: [
      "Infinite Flight Pro subscription",
      "At least Grade 3",
      "Active IFC account in good standing",
      "Discord access",
      "At least 16 years old",
      "Not on the IFVARB Blacklist or Watchlist",
      "Able to work on a weekly basis",
      "Constant Discord usage",
    ] as Requirement[],
  },
} as const;

/* ---- PIREP multipliers ----
   A multiplier code multiplies the pilot's raw flight time when filing.
   Add/adjust codes here (e.g. for events). */
export type Multiplier = { code: string; value: number; label: string };

export const MULTIPLIERS: Multiplier[] = [
  // Ordered by value.
  { code: "VEGA", value: 1.3, label: "Vega Program — 1.3×" },
  { code: "ROTW", value: 1.5, label: "ROTW — 1.5×" },
  { code: "IF48", value: 1.5, label: "IF48 — 1.5×" },
  { code: "LYRA", value: 1.6, label: "Lyra Program — 1.6×" },
  { code: "AYEVENT2X", value: 2, label: "AYEVENT2X — 2×" },
  { code: "GTR1ST", value: 2, label: "GTR 1st Place — 2×" },
  { code: "POTM3RD", value: 2.5, label: "POTM 3rd — 2.5×" },
  { code: "AYEVENT3X", value: 3, label: "AYEVENT3X — 3×" },
  { code: "POTM2ND", value: 3, label: "POTM 2nd — 3×" },
  { code: "NEWYEAR2026", value: 3, label: "NEW YEAR 2026 — 3×" },
  { code: "POTM1ST", value: 4, label: "POTM 1st — 4×" },
  { code: "AYEVENT5X", value: 5, label: "AYEVENT5X — 5×" },
  { code: "EVENT", value: 5, label: "Event — 5×" },
];

/* Resolve a code to its multiplier value (1 if blank/unknown). */
export function multiplierFor(code: string | null | undefined): number {
  if (!code) return 1;
  const m = MULTIPLIERS.find(
    (x) => x.code.toUpperCase() === code.trim().toUpperCase(),
  );
  return m ? m.value : 1;
}
