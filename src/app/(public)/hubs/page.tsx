import Image from "next/image";
import { SITE_HUBS } from "@/lib/site";

export const metadata = { title: "Hubs" };

const BANNER_IMG: Record<string, string> = {
  EFHK: "/hubs/helsinki.webp",
  EBBR: "/hubs/brussels.webp",
  EGLL: "/hubs/london.webp",
};
const FACTS: Record<string, { label: string; value: string }[]> = {
  EFHK: [
    { label: "Runways", value: "3" }, { label: "Terminals", value: "1 & 2" },
    { label: "Role", value: "Europe–Asia gateway" }, { label: "Based since", value: "1923" },
  ],
  EBBR: [
    { label: "Runways", value: "3" }, { label: "Ops", value: "24/7 freight" },
    { label: "Role", value: "European cargo gateway" }, { label: "Cargo", value: "Belly + freighter" },
  ],
  EGLL: [
    { label: "Runways", value: "2" }, { label: "Terminals", value: "2–5" },
    { label: "Role", value: "Transatlantic cargo" }, { label: "Freight", value: "High-value" },
  ],
};

export default function HubsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">Operating bases</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">One main hub. A Nordic network.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Finnair Virtual is built around Helsinki-Vantaa — one of the world’s northernmost major hubs and the shortest physical bridge between Europe and East Asia. Two cargo bases at Brussels and London extend our freight reach across the continent and the Atlantic.</p>
      </header>

      <div className="mt-10 space-y-6">
        {SITE_HUBS.map((h, i) => (
          <div key={h.icao} className="rise overflow-hidden rounded-xl border border-obsidian bg-ink-900 lift" style={{ animationDelay: `${i * 70}ms` }}>
            {/* Airport banner */}
            <div className="relative flex h-48 items-end overflow-hidden p-6">
              {BANNER_IMG[h.icao] && <Image src={BANNER_IMG[h.icao]} alt={`${h.city} airport`} fill sizes="100vw" className="object-cover" priority={i === 0} />}
              <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,4,30,0.15) 0%, rgba(8,4,30,0.45) 55%, rgba(8,4,30,0.88) 100%)" }} />
              <div className="relative">
                <span className="rounded bg-white/20 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white backdrop-blur">{h.role}</span>
                <h2 className="mt-2 font-display text-3xl font-semibold text-white">{h.name}</h2>
                <p className="text-sm text-white/75">{h.city}, {h.country} · {h.icao} · {h.iata}</p>
              </div>
            </div>
            <div className="p-6">
              <p className="text-xs text-cream-faint">{h.coords}</p>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-cream-dim">{h.blurb}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(FACTS[h.icao] ?? []).map((f) => (
                  <div key={f.label} className="rounded-lg border border-obsidian bg-ink-850 p-3">
                    <p className="text-[0.65rem] uppercase tracking-wide text-cream-faint">{f.label}</p>
                    <p className="mt-0.5 font-display text-base font-semibold text-cream">{f.value}</p>
                  </div>
                ))}
                {h.careerCount != null && (
                  <div className="rounded-lg border border-gold/30 bg-gold/[0.04] p-3">
                    <p className="text-[0.65rem] uppercase tracking-wide text-cream-faint">Career routes</p>
                    <p className="mt-0.5 font-display text-base font-semibold text-cream">{h.careerCount}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
