import Link from "next/link";
import { getPilotDashboard, fmtHours } from "@/lib/portal";
import { getDispatches } from "@/lib/ops";
import { AP_TABLE, LICENSES, CAREER_CODESHARES, CODESHARE_UNLOCK_AP } from "@/lib/career";
import { airportCity } from "@/lib/airports";
import { Locked } from "@/components/portal/Locked";

export const metadata = { title: "Career Mode" };
export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const d = await getPilotDashboard();
  if (!d) return null;
  if (!d.gates.career) {
    return <Locked title="Career Mode" rank="Elysian" hours={75} current={d.totalHours} blurb="Auto-dispatched assignments, the Aurora-Points economy and licence progression open up once you reach Elysian." />;
  }

  const board = getDispatches(d.session.pilotId, { authorizedFleet: d.fleet, rankMultiplier: d.rankMultiplier });

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Aurora Track</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Career Mode</h1>
          <p className="mt-2 max-w-xl text-cream-dim">Fly your dispatched assignments to bank Aurora Points. Complete within the window for a 1.25× premium; spotlight sectors pay 2×.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 px-5 py-3 text-right">
          <p className="text-xs uppercase tracking-wide text-cream-faint">Licence</p>
          <p className="font-display text-xl font-semibold text-cream">{d.license.current.short}</p>
          <p className="text-xs text-cream-faint">{d.fleet.length} aircraft authorised</p>
        </div>
      </header>

      {/* dispatch board */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-cream">Dispatch board</h2>
        <span className="text-xs text-cream-faint">Refreshes daily · {board.length} open contracts</span>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {board.map((dp, i) => (
          <div key={dp.id} className="rise flex flex-col rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${dp.spotlight ? "bg-rose/12 text-rose" : dp.priority === "priority" ? "bg-gold/10 text-gold" : "bg-ink-800 text-cream-faint"}`}>{dp.spotlight ? "2× Spotlight" : dp.priority}</span>
              <span className="text-xs text-cream-faint">due {dp.dueInHours}h</span>
            </div>
            <p className="mt-3 font-display text-xl font-semibold text-cream">{airportCity(dp.dep)} <span className="text-gold">→</span> {airportCity(dp.arr)}</p>
            <p className="mt-0.5 text-xs text-cream-faint">{dp.flightNo} · {dp.dep}–{dp.arr} · {dp.aircraft} · {fmtHours(dp.minutes)}</p>
            <div className="mt-auto flex items-center justify-between border-t border-obsidian/70 pt-3.5">
              <div>
                <p className="text-xs text-cream-faint">reward up to</p>
                <p className="font-display text-lg font-semibold text-cream">✦ {dp.maxAp.toLocaleString()}</p>
              </div>
              <Link href="/crew/file" className="rounded-full bg-gold px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-125">Accept & fly</Link>
            </div>
          </div>
        ))}
      </div>

      {/* references */}
      <section className="mt-9 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">AP earnings (net, after overhead)</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(["regional", "continental", "longhaul"] as const).map((c) => (
              <li key={c} className="flex items-center justify-between border-t border-obsidian/60 pt-2">
                <span className="text-cream-dim">{AP_TABLE[c].label}</span>
                <span className="font-semibold text-cream">✦ {AP_TABLE[c].net.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Multipliers stack — punctuality ×1.25, spotlight ×2{d.rankMultiplier > 1 ? `, your ${d.rank.current.name} rank ×${d.rankMultiplier}` : ""}.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Licences (purchased with AP)</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LICENSES.map((l) => {
              const have = d.apBalance >= l.cumulativeAp;
              return (
                <li key={l.short} className="flex items-start justify-between gap-3 border-t border-obsidian/60 pt-2">
                  <div><span className={`font-semibold ${have ? "text-cream" : "text-cream-faint"}`}>{l.short}</span> <span className="text-xs text-cream-faint">· {l.apCost === 0 ? "free" : `${l.apCost.toLocaleString()} AP`} · ≤{l.maxHours}h</span><p className="text-xs text-cream-faint">{l.fleet.join(" · ")}</p></div>
                  {have ? <span className="text-xs text-gold">✓</span> : <span className="text-xs text-cream-faint">🔒</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* codeshares */}
      <section className="mt-5 rounded-2xl border border-obsidian bg-ink-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-cream">Codeshare networks</h3>
          <span className="text-xs text-cream-faint">{d.apBalance >= CODESHARE_UNLOCK_AP ? "Codeshares unlocked ✓" : `${CODESHARE_UNLOCK_AP.toLocaleString()} AP to initiate`}</span>
        </div>
        <p className="mt-1 text-sm text-cream-dim">Initial-tier routes are exclusive to Finnair Virtual. Unlock partner networks with AP to fly their metal.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CAREER_CODESHARES.map((c) => (
            <span key={c.name} className={`rounded-full border px-3 py-1.5 text-sm ${c.free ? "border-gold/40 bg-gold/8 text-gold" : "border-obsidian bg-ink-850 text-cream-dim"}`}>
              {c.name} <span className="text-xs text-cream-faint">· {c.free ? "Free" : `${c.cost.toLocaleString()} AP`}</span>
            </span>
          ))}
          <span className="self-center text-xs text-cream-faint">…and more later</span>
        </div>
      </section>
    </div>
  );
}
