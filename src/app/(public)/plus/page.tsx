import Image from "next/image";
import { TIERS } from "@/lib/career";
import { PLUS_EARN } from "@/lib/site";

export const metadata = { title: "Finnair Plus" };

export default function PlusPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">AURORA Banking</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">The currency of your career.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">Finnair Plus is a private economy for our pilots. Earn Aurora Points (AP) with every flight and climb five tiers — each milestone a recognition of your dedication to the airline.</p>
      </header>

      {/* Tiers — designed membership cards */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <div key={t.name} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="overflow-hidden rounded-2xl shadow-[0_18px_40px_-22px_rgba(12,2,67,0.5)] transition-transform duration-300 hover:-translate-y-1">
              <Image src={`/tiers/${t.name.toLowerCase()}.png`} alt={`Finnair Plus ${t.name} tier`} width={944} height={642} className="block w-full" />
            </div>
            <p className="mt-3 text-center text-sm text-cream-faint">{t.blurb}</p>
          </div>
        ))}
      </section>

      {/* Earning */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">How you earn</h2>
        <p className="mt-1 text-sm text-cream-dim">Aurora Points are granted automatically based on flight duration.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {PLUS_EARN.map((e) => (
            <div key={e.label} className="rounded-2xl border border-obsidian bg-ink-900 p-5 lift">
              <p className="text-sm font-medium text-cream">{e.label}</p>
              <p className="text-xs text-cream-faint">{e.note}</p>
              <p className="mt-3 font-display text-3xl font-semibold text-cream">✦ {e.ap}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-cream-faint">A private economy for our pilots — keep flying to advance through the tiers.</p>
      </section>
    </div>
  );
}
