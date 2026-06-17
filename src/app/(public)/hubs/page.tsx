import { SITE_HUBS } from "@/lib/site";

export const metadata = { title: "Hubs" };

const BANNER: Record<string, string> = {
  EFHK: "linear-gradient(120deg,#0c0243 0%,#1b2a7a 55%,#2748c9 100%)",
  EBBR: "linear-gradient(120deg,#0e1733 0%,#3a1f7a 60%,#7c1791 100%)",
  EGLL: "linear-gradient(120deg,#0c0243 0%,#114a4a 55%,#12b5a8 100%)",
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
            {/* Airport banner — real Infinite Flight banners drop in here */}
            <div className="relative flex h-36 items-end p-6" style={{ background: BANNER[h.icao] ?? BANNER.EFHK }}>
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-25 blur-2xl" style={{ background: "radial-gradient(circle,#ffffff,transparent 70%)" }} />
              <div className="relative">
                <span className="rounded bg-white/15 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white">{h.role}</span>
                <h2 className="mt-2 font-display text-3xl font-semibold text-white">{h.name}</h2>
                <p className="text-sm text-white/65">{h.city}, {h.country} · {h.icao} · {h.iata}</p>
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
      <p className="mt-4 text-xs text-cream-faint">Tip: drop in real Infinite Flight airport banners for Helsinki, London and Brussels to replace the gradient headers.</p>
    </div>
  );
}
