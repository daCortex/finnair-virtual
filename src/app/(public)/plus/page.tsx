import Image from "next/image";
import Link from "next/link";
import { TIERS } from "@/lib/career";

export const metadata = { title: "Finnair Plus" };

/* Per-tier card finish — a premium gradient membership card (chip + foil)
   rather than a flat image, progressing silver → blue → indigo → heather →
   black-gold. White/cream text fixed (the card is always a dark object). */
type Finish = { bg: string; glow: string; pattern: string; accent: string; foil?: string };
const FINISH: Record<string, Finish> = {
  Classic: {
    bg: "linear-gradient(135deg,#3a3f44,#1b1e22 60%,#0e1012)",
    glow: "radial-gradient(130% 105% at 85% -10%, rgba(199,204,209,0.4), transparent 55%)",
    pattern: "repeating-linear-gradient(115deg, rgba(199,204,209,0.5) 0 1px, transparent 1px 7px)",
    accent: "#d7dce1",
  },
  Signature: {
    bg: "linear-gradient(135deg,#173a72,#0b1d3e 60%,#060f20)",
    glow: "radial-gradient(130% 105% at 85% -10%, rgba(91,141,239,0.5), transparent 55%)",
    pattern: "repeating-linear-gradient(115deg, rgba(91,141,239,0.45) 0 1px, transparent 1px 8px)",
    accent: "#8fb0f6",
  },
  Imperial: {
    bg: "linear-gradient(135deg,#2a1c5e,#130b30 60%,#080418)",
    glow: "radial-gradient(130% 105% at 85% -10%, rgba(140,120,255,0.45), transparent 55%)",
    pattern: "repeating-conic-gradient(from 30deg, rgba(255,255,255,0.08) 0deg 6deg, transparent 6deg 18deg)",
    accent: "#aa9cff",
  },
  Prestige: {
    bg: "linear-gradient(135deg,#4a1a52,#220a28 60%,#100512)",
    glow: "radial-gradient(130% 105% at 85% -10%, rgba(219,131,231,0.45), transparent 55%)",
    pattern:
      "repeating-linear-gradient(60deg, rgba(219,131,231,0.16) 0 2px, transparent 2px 12px), repeating-linear-gradient(-60deg, rgba(219,131,231,0.16) 0 2px, transparent 2px 12px)",
    accent: "#e29aec",
  },
  Centurion: {
    bg: "linear-gradient(135deg,#15161a,#0a0b0d 60%,#050506)",
    glow: "radial-gradient(130% 105% at 85% -10%, rgba(216,175,90,0.3), transparent 55%)",
    pattern: "repeating-linear-gradient(115deg, rgba(216,175,90,0.15) 0 1px, transparent 1px 14px)",
    accent: "#e9c986",
    foil: "linear-gradient(90deg, transparent, rgba(216,175,90,0.5), transparent)",
  },
};

export default function PlusPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">AURORA Banking</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">The currency of your career.</h1>
        <p className="lead mt-4 max-w-2xl text-cream-dim">Finnair Plus is a private economy for our pilots. Earn Aurora Points (AP) with every flight and climb five tiers — each milestone a recognition of your dedication to the airline.</p>
      </header>

      {/* Tiers — premium gradient membership cards (chip + foil). */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((t, i) => {
          const f = FINISH[t.name] ?? FINISH.Classic;
          return (
            <div key={t.name} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
              <div
                className="group relative aspect-[1.6/1] overflow-hidden rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1"
                style={{ background: f.bg, boxShadow: `inset 0 0 0 1px ${f.accent}55, 0 18px 44px -22px rgba(8,2,40,0.65)` }}
              >
                <div aria-hidden className="absolute inset-0" style={{ background: f.glow }} />
                <div aria-hidden className="absolute inset-0 opacity-[0.13]" style={{ backgroundImage: f.pattern }} />
                {f.foil && <div aria-hidden className="absolute inset-0 opacity-40 mix-blend-screen" style={{ background: f.foil }} />}
                <div aria-hidden className="absolute inset-x-0 top-0 h-1/2" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.09), transparent)" }} />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <p className="font-mono text-[0.55rem] uppercase tracking-[0.4em] text-white/55">Finnair Plus</p>
                    <Image src="/brand/finnair-emblem-white.png" alt="" width={510} height={287} className="h-3.5 w-auto opacity-80" />
                  </div>
                  <p className="mt-1.5 font-display text-2xl font-semibold tracking-wide" style={{ color: f.accent, textShadow: "0 1px 1px rgba(0,0,0,0.4)" }}>
                    {t.name}
                  </p>

                  {/* EMV-style chip */}
                  <div className="mt-4 h-8 w-11 rounded-md" style={{ background: "linear-gradient(135deg, #f0d488, #b8862f)", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.4)" }}>
                    <div aria-hidden className="m-[3px] h-[calc(100%-6px)] rounded-sm opacity-60" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.35) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.35) 1px, transparent 1px)", backgroundSize: "7px 5px" }} />
                  </div>

                  <div className="mt-auto">
                    <p className="font-display text-lg" style={{ color: f.accent }}>{t.min.toLocaleString()}+ AP</p>
                    <p className="mt-0.5 text-xs leading-snug text-white/55">{t.blurb}</p>
                  </div>
                </div>

                {/* sweeping sheen on hover */}
                <span aria-hidden className="pointer-events-none absolute -inset-y-6 -left-1/3 w-1/4 rotate-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[440%]" />
              </div>
            </div>
          );
        })}
      </section>

      <p className="mt-10 text-sm text-cream-dim">AP is earned through Career and Cargo operations. Pilots can view the full payout structure in the <Link href="/crew" className="text-gold-soft hover:underline">Crew Centre</Link>.</p>
    </div>
  );
}
