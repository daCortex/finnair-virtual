import Image from "next/image";
import { SITE_LEADERS, SITE_ORG } from "@/lib/site";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">About</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">A virtual airline built like a real one.</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-cream-dim">Finnair Virtual (FNVA) is an independent Infinite Flight virtual airline inspired by Finland’s flag carrier. We fly a structured, simulated operation out of Helsinki-Vantaa — every flight logged, every hour credited, every rank earned.</p>
        <p className="mt-4 max-w-3xl leading-relaxed text-cream-dim">From your first Aurora sortie to the Luminary command seat, pilots progress through nine ranks, purchase fleet licences and codeshare networks with Aurora Points, and fly across passenger, career and cargo operations. Behind the scenes, a real org structure — a Founder, a CEO, a Board and four staff units — keeps the airline running with Nordic precision and a genuinely welcoming community at its heart.</p>
      </header>

      {/* Leadership — pfp + message + IFC link */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">Leadership</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {SITE_LEADERS.map((l) => (
            <div key={l.name} className="rounded-xl border border-obsidian bg-ink-900 p-6 lift">
              <div className="flex items-center gap-4">
                <Image src={l.pfp} alt={l.name} width={120} height={120} className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-obsidian" />
                <div>
                  <p className="font-display text-lg font-semibold text-cream">{l.name}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-gold-soft">{l.role}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-cream-dim">“{l.message}”</p>
              <a href={l.ifc ? `https://community.infiniteflight.com/u/${l.ifc}` : "https://community.infiniteflight.com"} target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-obsidian px-3 py-1.5 text-xs font-medium text-cream-dim transition-colors hover:border-gold-soft hover:text-cream">
                IFC profile <span aria-hidden className="text-[0.65rem]">↗</span>
              </a>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-cream-faint">Staff profile photos and IFC handles can be dropped in to personalise these cards.</p>
      </section>

      {/* Org chart */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">Organisation</h2>
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-gold/40 bg-gold/[0.03] p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-cream-faint">Founder & Chairman</p>
            <p className="font-display text-lg font-semibold text-cream">Ayaz Molla</p>
          </div>
          <div className="rounded-2xl border border-obsidian bg-ink-900 p-5 text-center">
            <p className="text-xs uppercase tracking-wide text-cream-faint">Chief Executive Officer</p>
            <p className="font-display text-lg font-semibold text-cream">Lucian Y.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SITE_ORG.map((u) => (
              <div key={u.unit} className="rounded-2xl border border-obsidian bg-ink-900 p-5">
                <p className="font-display text-base font-semibold text-cream">{u.unit}</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {u.roles.map((r, i) => (
                    <li key={i} className="flex items-center justify-between border-t border-obsidian/50 pt-2">
                      <span className="text-cream-dim">{r.role}</span>
                      <span className="rounded-full bg-ink-800 px-2 py-0.5 text-[0.65rem] uppercase text-cream-faint">{r.who}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* oneworld alliance */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-cream">A oneworld partner</h2>
        <p className="mt-1 text-sm text-cream-dim">Connecting our pilots to the global oneworld alliance network.</p>
        <div className="halo mt-5 overflow-hidden rounded-[1.75rem] bg-white px-8 py-10" style={{ ["--halo" as string]: "var(--color-gold)" }}>
          <Image src="/brand/oneworld-ay-lockup.webp" alt="Finnair · oneworld alliance partners" width={1860} height={389} className="mx-auto h-16 w-auto max-w-full object-contain lg:h-24" />
        </div>
        <p className="mt-3 text-xs text-cream-faint">An independent fan project — not affiliated with Finnair Plc or the oneworld alliance.</p>
      </section>
    </div>
  );
}
