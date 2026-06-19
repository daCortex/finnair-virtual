import Image from "next/image";
import Link from "next/link";
import { TIERS } from "@/lib/career";

export const metadata = { title: "Finnair Plus" };

export default function PlusPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">AURORA Banking</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">The currency of your career.</h1>
        <p className="lead mt-4 max-w-2xl text-cream-dim">Finnair Plus is a private economy for our pilots. Earn Aurora Points (AP) with every flight and climb five tiers — each milestone a recognition of your dedication to the airline.</p>
      </header>

      {/* Tiers — uniform membership cards, the metallic shine contained to the
          card itself. Names + AP threshold only; no descriptions. */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <div key={t.name} className="rise" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="metal-card relative aspect-[3/2] overflow-hidden rounded-xl shadow-[0_18px_40px_-22px_rgba(12,2,67,0.55)] transition-transform duration-300 hover:-translate-y-1">
              <Image src={`/tiers/${t.name.toLowerCase()}.png`} alt={`Finnair Plus ${t.name} tier`} fill sizes="(max-width:1024px) 50vw, 33vw" className="object-cover" />
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="font-medium text-cream">{t.name}</p>
              <p className="text-xs text-cream-faint">{t.min.toLocaleString()}+ AP</p>
            </div>
          </div>
        ))}
      </section>

      <p className="mt-10 text-sm text-cream-dim">AP is earned through Career and Cargo operations. Pilots can view the full payout structure in the <Link href="/crew" className="text-gold-soft hover:underline">Crew Centre</Link>.</p>
    </div>
  );
}
