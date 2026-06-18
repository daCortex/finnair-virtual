import Image from "next/image";
import { RANKS } from "@/lib/career";

export const metadata = { title: "Ranks" };

/* A signature colour per rank, chosen to evoke each medallion and to stay
   legible in both light and dark themes. Tune these to match the final rank
   artwork when it lands. */
const RANK_COLOR: Record<string, string> = {
  Aurora: "#14A88F",
  Polaris: "#3B7BE0",
  Elysian: "#7A5CF0",
  Solstice: "#D98A1F",
  Zenith: "#D63A5E",
  Astralis: "#4A5BF0",
  Celestia: "#B645C8",
  Sovereign: "#C99A2E",
  Luminary: "#C9A227",
};

export default function RanksPage() {
  // Render top-down from the summit so the column reads as a ladder you climb.
  const ladder = [...RANKS].reverse();

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">Pilot career progression</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">Nine ranks. One ascent.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Climb the ladder as you accumulate flight hours, unlocking new aircraft, routes and privileges with every rung. The final three are exclusive ranks with AURORA Bank access.</p>
      </header>

      {/* The ladder */}
      <div className="relative mt-12 pl-4 sm:pl-6">
        {/* Vertical rail */}
        <div className="absolute bottom-2 left-[2.35rem] top-2 w-px bg-gradient-to-b from-rose/40 via-obsidian to-gold/40 sm:left-[3.1rem]" aria-hidden />

        <div className="space-y-5">
          {ladder.map((r, idx) => {
            const color = RANK_COLOR[r.name] ?? "#3B7BE0";
            const summit = idx === 0;
            return (
              <div key={r.name} className="rise relative flex gap-4 sm:gap-5" style={{ animationDelay: `${idx * 55}ms` }}>
                {/* Medallion on the rail */}
                <div className="relative z-10 shrink-0">
                  <div
                    className="flex h-[3.75rem] w-[3.75rem] items-center justify-center rounded-full bg-ink-950"
                    style={{ boxShadow: `0 0 0 2px ${color}, 0 0 22px -4px ${color}` }}
                  >
                    <Image src={`/ranks/${r.name.toLowerCase()}.png`} alt={`${r.name} rank`} width={400} height={400} className="h-11 w-11 object-contain" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-semibold text-white ring-2 ring-ink-950" style={{ background: color }}>{r.n}</span>
                </div>

                {/* Card */}
                <div
                  className="min-w-0 flex-1 rounded-2xl border bg-ink-900 p-4 lift"
                  style={{ borderColor: `color-mix(in srgb, ${color} 38%, transparent)`, background: `linear-gradient(180deg, color-mix(in srgb, ${color} 7%, var(--color-ink-900)), var(--color-ink-900))` }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-xl font-semibold" style={{ color }}>{r.name}</h2>
                    {summit && <span className="rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-white" style={{ background: color }}>Summit</span>}
                    <span className="rounded-full bg-ink-800 px-2 py-0.5 text-xs text-cream-dim">{r.hours.toLocaleString()} h+</span>
                    {r.group === "exclusive" && <span className="rounded-full bg-rose/10 px-2 py-0.5 text-xs text-rose">Exclusive</span>}
                    {r.apMultiplier && <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">{r.apMultiplier}× AP</span>}
                  </div>
                  <p className="mt-1 text-sm text-cream-dim">{r.blurb}</p>
                  {r.perks && (
                    <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
                      {r.perks.map((p) => <li key={p} className="flex items-center gap-1.5"><span style={{ color }}>•</span>{p}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}

          {/* Base of the ladder */}
          <div className="relative flex items-center gap-4 pt-1 sm:gap-5">
            <div className="z-10 flex h-[3.75rem] w-[3.75rem] shrink-0 items-center justify-center rounded-full border border-dashed border-obsidian bg-ink-950 text-[0.6rem] uppercase tracking-wide text-cream-faint">Start</div>
            <p className="text-sm text-cream-dim">Every pilot begins at <span className="font-medium" style={{ color: RANK_COLOR.Aurora }}>Aurora</span> — your first logged flight starts the climb.</p>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center font-display text-lg text-cream-dim">Nine ranks. Five thousand hours.</p>
    </div>
  );
}
