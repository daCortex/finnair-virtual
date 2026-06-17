import Image from "next/image";
import { RANKS } from "@/lib/career";

export const metadata = { title: "Ranks" };

export default function RanksPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">Pilot career progression</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">Nine ranks. One ascent.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Progress through the ranks as you accumulate flight hours, unlocking new aircraft, routes and privileges. The final three are exclusive ranks with AURORA Bank access.</p>
      </header>

      <ol className="mt-10 space-y-3">
        {RANKS.map((r, i) => (
          <li key={r.name} className="rise" style={{ animationDelay: `${i * 45}ms` }}>
            <div className={`flex items-stretch gap-4 rounded-2xl border p-4 lift ${r.group === "exclusive" ? "border-rose/30 bg-rose/[0.03]" : "border-obsidian bg-ink-900"}`}>
              <div className="relative h-16 w-16 shrink-0">
                <Image src={`/ranks/${r.name.toLowerCase()}.png`} alt={`${r.name} rank`} width={400} height={400} className="h-full w-full object-contain drop-shadow-sm" />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink-900 text-[0.6rem] font-semibold text-cream-dim ring-1 ring-obsidian">{r.n}</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-xl font-semibold text-cream">{r.name}</h2>
                  <span className="rounded-full bg-ink-800 px-2 py-0.5 text-xs text-cream-dim">{r.hours.toLocaleString()} h+</span>
                  {r.group === "exclusive" && <span className="rounded-full bg-rose/10 px-2 py-0.5 text-xs text-rose">Exclusive</span>}
                  {r.apMultiplier && <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs text-gold">{r.apMultiplier}× AP</span>}
                </div>
                <p className="mt-1 text-sm text-cream-dim">{r.blurb}</p>
                {r.perks && (
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-cream-faint">
                    {r.perks.map((p) => <li key={p} className="flex items-center gap-1.5"><span className="text-gold">•</span>{p}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-center font-display text-lg text-cream-dim">Nine ranks. Five thousand hours.</p>
    </div>
  );
}
