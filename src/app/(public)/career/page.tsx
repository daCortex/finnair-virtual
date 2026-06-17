import Link from "next/link";
import { RANKS } from "@/lib/career";
import { SITE_MODES } from "@/lib/site";

export const metadata = { title: "Career" };

export default function CareerPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">Progression</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">From First Officer, to Captain.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Nine ranks. Three flying modes. A single, structured path that rewards every logged hour — from your first Aurora flight to the Luminary command seat.</p>
      </header>

      {/* The ladder */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">The ladder</h2>
        <p className="mt-1 font-display text-lg text-gold-soft">Nine ranks. Five thousand hours.</p>
        <div className="mt-4 overflow-hidden rounded-xl border border-obsidian bg-ink-900">
          {RANKS.map((r, i) => (
            <div key={r.name} className={`flex items-center justify-between px-5 py-3.5 ${i > 0 ? "border-t border-obsidian/60" : ""} ${r.group === "exclusive" ? "bg-rose/[0.03]" : ""}`}>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-cream-faint">{String(r.n).padStart(2, "0")}</span>
                <span className="font-display text-lg font-semibold text-cream">{r.name}</span>
                {r.group === "exclusive" && <span className="rounded-full bg-rose/10 px-2 py-0.5 text-[0.65rem] uppercase text-rose">Exclusive</span>}
              </div>
              <span className="text-sm text-cream-dim">{r.hours.toLocaleString()} h</span>
            </div>
          ))}
        </div>
      </section>

      {/* Modes */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-cream">Three ways to fly</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {SITE_MODES.map((m, i) => {
            const accent = ["#12B5A8", "#0c0243", "#7c1791"][i];
            return (
              <div key={m.name} className="rounded-xl border border-obsidian bg-ink-900 p-5 lift" style={{ borderTop: `3px solid ${accent}` }}>
                <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: accent }}>{m.unlock}</p>
                <h3 className="mt-2 font-display text-lg font-semibold text-cream">{m.name}</h3>
                <p className="mt-1.5 text-sm text-cream-dim">{m.desc}</p>
                <ul className="mt-3 space-y-1 border-t border-obsidian/60 pt-3 text-xs text-cream-faint">
                  {m.pros.slice(0, 3).map((p) => <li key={p} className="flex items-start gap-1.5"><span style={{ color: accent }}>✓</span>{p}</li>)}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-obsidian bg-ink-900 px-6 py-12 text-center">
        <h2 className="font-display text-2xl font-semibold text-cream">Your career starts at Aurora.</h2>
        <Link href="/join" className="rounded-full bg-gold px-7 py-3 text-sm font-semibold text-white transition-all hover:brightness-125">Apply now</Link>
      </section>
    </div>
  );
}
