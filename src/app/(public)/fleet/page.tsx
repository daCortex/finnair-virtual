import Image from "next/image";
import { SITE_FLEET } from "@/lib/site";

export const metadata = { title: "Fleet" };

/* Map each fleet type to its livery render in /public/fleet. */
const RENDER: Record<string, string> = {
  "Embraer E190": "E190", "Airbus A319": "A319", "Airbus A320": "A320",
  "Airbus A321": "A321", "Airbus A330-300": "A330", "Airbus A350-900": "A350",
  "Boeing 757-200": "B757",
};

/* Types without an official Finnair livery in Infinite Flight (flown generic). */
const GENERIC = new Set(["Embraer E190", "Airbus A319", "Airbus A320"]);

export default function FleetPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">The fleet</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">Seven aircraft. One livery.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">From regional Embraers to the long-haul A350-900, every aircraft in our fleet earns its place — short-haul workhorses feed the trunk network while widebodies push to Asia and across the Atlantic. Our seventh aircraft sits apart from the schedule: a <span className="font-medium text-cream">Boeing 757-200 in historic Finnair livery</span>, kept purely for special group flights and events.</p>
      </header>

      <div className="mt-8 flex flex-wrap gap-6 text-sm">
        {[["Aircraft", "7"], ["Destinations", "200+"], ["Longest range", "8,100 nm"]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-obsidian bg-ink-900 px-5 py-3 lift">
            <p className="text-xs uppercase tracking-wide text-cream-faint">{k}</p>
            <p className="font-display text-xl font-semibold text-cream">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SITE_FLEET.map((a, i) => (
          <div
            key={a.type}
            className={`rise group flex flex-col overflow-hidden rounded-2xl border bg-ink-900 lift ${a.historic ? "halo border-transparent" : "border-obsidian"}`}
            style={a.historic ? ({ animationDelay: `${i * 60}ms`, "--halo": a.accent } as React.CSSProperties) : { animationDelay: `${i * 60}ms` }}
          >
            {/* Image stage — fixed height, graphic centred & uniformly contained */}
            <div className="relative h-40 overflow-hidden bg-gradient-to-b from-ink-850 to-ink-900" style={a.historic ? { background: `linear-gradient(180deg, color-mix(in srgb, ${a.accent} 18%, transparent), transparent)` } : undefined}>
              <div className="absolute inset-0 flex items-center justify-center px-6">
                <Image src={`/fleet/${RENDER[a.type] ?? "A320"}.webp`} alt={`Finnair ${a.type}`} width={1016} height={706} className="max-h-[72%] w-auto max-w-[90%] object-contain transition-transform duration-700 group-hover:scale-105" />
              </div>
              <span className="absolute left-4 top-3 rounded px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide backdrop-blur" style={a.historic ? { background: `color-mix(in srgb, ${a.accent} 22%, transparent)`, color: a.accent } : undefined}>
                <span className={a.historic ? "" : "text-gold"}>{a.family}</span>
              </span>
              <span className="absolute right-4 top-3 font-mono text-xs text-cream-faint">{a.reg}</span>
            </div>
            <div className="flex flex-1 flex-col px-5 py-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-semibold text-cream">{a.type}</h2>
                {GENERIC.has(a.type) && (
                  <span className="rounded bg-rock/25 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-cream-dim" title="No official Finnair livery in Infinite Flight">Generic livery</span>
                )}
                {a.historic && (
                  <span className="rounded px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide" style={{ background: `color-mix(in srgb, ${a.accent} 18%, transparent)`, color: a.accent }}>Group flights only</span>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-dim">{a.role}</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                {[["PAX", a.pax], ["Range", `${a.rangeNm.toLocaleString()} nm`], ["Cruise alt", a.cruiseAlt], ["Cruise", a.cruiseSpeed], ["Engines", a.engines], ["Acquired", a.acquired]].map(([k, v]) => (
                  <div key={k as string} className="border-t border-obsidian/50 pt-2">
                    <dt className="text-[0.7rem] uppercase tracking-wide text-cream-faint">{k}</dt>
                    <dd className="text-cream">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-auto border-t border-obsidian/50 pt-3 text-xs text-cream-faint">{a.historic ? "Reserved for group flights & events" : `${a.routesFlown} routes flown`}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
