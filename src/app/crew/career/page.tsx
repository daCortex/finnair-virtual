import { getPilotDashboard, fmtHours } from "@/lib/portal";
import { getDispatches } from "@/lib/ops";
import { AP_TABLE, LICENSES, CAREER_CODESHARES, CODESHARE_UNLOCK_AP, punctualityBonus, PUNCTUALITY_BONUS } from "@/lib/career";
import { airportCity } from "@/lib/airports";
import { fileableAircraftFor } from "@/lib/aircraft";
import { Locked } from "@/components/portal/Locked";
import { CareerDispatch, type CareerLeg } from "@/components/portal/CareerDispatch";
import { CodeshareInventory } from "@/components/portal/CodeshareInventory";

export const metadata = { title: "Career Mode" };
export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const d = await getPilotDashboard();
  if (!d) return null;
  if (!d.gates.career) {
    return <Locked title="Career Mode" rank="Elysian" hours={75} current={d.totalHours} blurb="Auto-dispatched assignments, the Aurora-Points economy and licence progression open up once you reach Elysian." />;
  }

  const bonus = punctualityBonus(d.license.current.short);
  const board = getDispatches(d.session.pilotId, { authorizedFleet: d.fleet, punctualBonus: bonus });
  const legs: CareerLeg[] = board.map((dp) => ({
    id: dp.id, dep: dp.dep, arr: dp.arr, depCity: airportCity(dp.dep), arrCity: airportCity(dp.arr),
    flightNo: dp.flightNo, aircraft: fileableAircraftFor({ aircraft: dp.aircraft, airline: dp.airline }),
    aircraftLabel: dp.aircraft.replace(/^Finnair |^Nordic Regional /, ""),
    timeLabel: fmtHours(dp.minutes), haul: dp.haul, spotlight: dp.spotlight,
    potentialAp: dp.potentialAp, punctualBonus: dp.punctualBonus, windowMinutes: dp.windowMinutes,
  }));
  const ultra = legs.length === 1 && legs[0].haul === "Ultra";

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Aurora Track</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Career Mode</h1>
          <p className="mt-2 max-w-xl text-cream-dim">Accept an assignment to see its flight summary, potential payout and a completion timer (flight time + 2h). File on time for a flat licence bonus; spotlight sectors pay 2×.</p>
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
        <span className="text-xs text-cream-faint">Refreshes daily · {board.length} assignment{board.length === 1 ? "" : "s"}</span>
      </div>
      {ultra && (
        <p className="mt-2 rounded-xl border border-rose/30 bg-rose/[0.05] px-4 py-2.5 text-sm text-cream-dim">
          <span className="font-semibold text-rose">Ultra-long-haul day.</span> Today&apos;s roster is a single sector — no other flights are dispatched, and it carries the new Ultra-long-haul payout.
        </p>
      )}
      <div className="mt-3">
        <CareerDispatch legs={legs} />
      </div>

      {/* references */}
      <section className="mt-9 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">AP payout by flight time</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(["regional", "continental", "longhaul", "ultralong"] as const).map((c) => (
              <li key={c} className="flex items-center justify-between border-t border-obsidian/60 pt-2">
                <span className="text-cream-dim">{AP_TABLE[c].label}</span>
                <span className="font-semibold text-cream">✦ {AP_TABLE[c].net.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Filing on time adds a flat on-time bonus by licence — PPL +{PUNCTUALITY_BONUS.PPL}, CPL +{PUNCTUALITY_BONUS.CPL}, Command +{PUNCTUALITY_BONUS.Command} AP. Spotlight sectors pay 2×. Your licence: <span className="text-cream-dim">{d.license.current.short} (+{bonus})</span>.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Licences (purchased with AP)</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {LICENSES.map((l) => {
              const have = d.apBalance >= l.cumulativeAp;
              return (
                <li key={l.short} className="flex items-center justify-between gap-3 border-t border-obsidian/60 pt-2">
                  <div><span className={`font-semibold ${have ? "text-cream" : "text-cream-faint"}`}>{l.name}</span> <span className="text-xs text-cream-faint">· {l.apCost === 0 ? "free" : `${l.apCost.toLocaleString()} AP`} · ≤{l.maxHours}h</span></div>
                  {have ? <span className="text-xs text-gold">✓</span> : <span className="text-xs text-cream-faint">🔒</span>}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* codeshare inventory */}
      <section className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-cream">Codeshare networks</h3>
          <span className="text-xs text-cream-faint">{d.apBalance >= CODESHARE_UNLOCK_AP ? "Codeshares unlocked ✓" : `${CODESHARE_UNLOCK_AP.toLocaleString()} AP to initiate`}</span>
        </div>
        <p className="mb-3 mt-1 text-sm text-cream-dim">Jet Airways is free for all pilots. Unlock more passenger partners with Aurora Points — priced low to high.</p>
        <CodeshareInventory items={CAREER_CODESHARES} currency="AP" />
      </section>
    </div>
  );
}
