import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { AIRPORT_COORDS, AIRPORTS } from "@/lib/airports";
import { SITE } from "@/lib/site";
import { regionForIcao } from "@/lib/regions";
import type { RegionLeg } from "@/components/public/RegionMap";
import { GlobeMap } from "@/components/public/GlobeMap";
import { HeroSlideshow } from "@/components/public/HeroSlideshow";

export const metadata = { title: "Finnair Virtual — Elevating Virtual Aviation" };

function legs() {
  const hub = AIRPORT_COORDS.EFHK;
  const seen = new Set<string>();
  const out: RegionLeg[] = [];
  for (const r of ROUTES) {
    if (r.airline !== "Finnair") continue;
    for (const code of [r.dep, r.arr]) {
      if (code === "EFHK" || seen.has(code) || !AIRPORT_COORDS[code]) continue;
      const region = regionForIcao(code);
      if (!region) continue;
      seen.add(code);
      out.push({ to: AIRPORT_COORDS[code], code, city: AIRPORTS[code]?.city ?? code, region: region.name, color: region.color });
    }
  }
  return { hub, out };
}

const VALUES = [
  { tag: "Career Ranks", title: "Nine ranks. One ascent.", body: "Climb from Aurora to Luminary across 5,000 hours of structured progression.", href: "/ranks", icon: "M12 21V5M6 11l6-6 6 6" },
  { tag: "Career Mode", title: "Every flight, credited.", body: "Log hours across seven aircraft and 221 routes — your record follows you.", href: "/career", icon: "M5 4h14v16H5zM9 9h6M9 13h4" },
  { tag: "Leadership", title: "A crew built on precision.", body: "A real org structure — Founder, CEO, Board and four staff units.", href: "/about", icon: "M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  { tag: "Aurora Banking", title: "An economy that rewards.", body: "Earn Aurora Points with every flight and rise through Finnair Plus.", href: "/plus", icon: "M12 2 2 9l10 13L22 9 12 2zM3.5 9h17M9 3 7 9l5 13M15 3l2 6-5 13" },
];

export default function Home() {
  const { out } = legs();
  return (
    <div>
      {/* HERO */}
      <section className="aurora relative overflow-hidden">
        <HeroSlideshow />
        <div className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle,#c451d6,transparent 70%)" }} />
        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <p className="reveal text-xs uppercase tracking-[0.32em] text-white/55">Finnair Virtual · Infinite Flight</p>
          <h1 className="reveal mt-4 max-w-3xl font-display text-5xl font-semibold leading-[1.02] tracking-tight lg:text-7xl" style={{ animationDelay: "80ms" }}>
            <span className="nitro-shine">Elevating virtual aviation.</span>
          </h1>
          <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-white/70" style={{ animationDelay: "160ms" }}>
            Experience the skies with a community dedicated to simulated realism and excellence — Nordic precision, from your first Aurora flight to the Luminary command seat.
          </p>
          <div className="reveal mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <Link href="/join" className="btn-shine-blue rounded-full bg-white px-6 py-3 text-sm font-semibold text-fin-blue transition-transform hover:scale-[1.03]">Apply Now</Link>
            <Link href="/crew" className="btn-shine rounded-full border border-white/50 bg-white/15 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/25">Crew Centre</Link>
            <Link href="/ranks" className="btn-shine rounded-full border border-white/45 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20">View Ranks</Link>
            <Link href="/fleet" className="btn-shine rounded-full border border-white/45 bg-white/10 px-6 py-3 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20">Explore Fleet</Link>
          </div>
        </div>
      </section>

      {/* GLOBAL NETWORK */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The network</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-cream lg:text-4xl">A global network from Helsinki.</h2>
          </div>
          <p className="text-sm text-cream-dim"><span className="font-semibold text-cream">{SITE.network.airports} airports</span> across <span className="font-semibold text-cream">{SITE.network.routes} scheduled flights</span> · hub {SITE.network.hub}</p>
        </div>
        <GlobeMap legs={out} title="Route network by region" />
        <p className="mt-3 text-xs text-cream-faint">Toggle regions in the legend, spin the globe, or search a destination ICAO (e.g. OTHH) for full flight details.</p>
      </section>

      {/* VALUE PROP */}
      <section className="tint-blue border-y border-obsidian/60">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <p className="eyebrow">Why Finnair Virtual?</p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-cream lg:text-4xl">More than a flight log — a career in the sky.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <Link key={v.tag} href={v.href} className="rise group relative overflow-hidden rounded-xl border border-obsidian bg-ink-900 p-6 lift" style={{ animationDelay: `${i * 70}ms` }}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gold-soft/30 bg-gold-soft/10 text-gold-soft transition-colors group-hover:bg-gold-soft/15">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={v.icon} /></svg>
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-soft">{v.tag}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-cream">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">{v.body}</p>
                <span className="mt-4 inline-block text-sm text-gold-soft transition-transform group-hover:translate-x-1">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — compact */}
      <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8">
        <div className="aurora flex flex-col items-center justify-between gap-4 rounded-xl px-6 py-7 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">Your career starts at Aurora.</h2>
            <p className="mt-1 text-sm text-white/65">Join a community built on realism and Nordic precision.</p>
          </div>
          <Link href="/join" className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-fin-blue transition-transform hover:scale-[1.03]">Apply to Finnair Virtual</Link>
        </div>
      </section>
    </div>
  );
}
