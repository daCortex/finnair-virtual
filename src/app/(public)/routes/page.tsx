import { ROUTES } from "@/lib/routes";
import { airportCity } from "@/lib/airports";
import { SITE } from "@/lib/site";
import { HubFlipCard } from "@/components/public/HubFlipCard";

export const metadata = { title: "Routes" };

function fmt(min: number) {
  return `${Math.floor(min / 60)}h ${(min % 60).toString().padStart(2, "0")}m`;
}

export default function RoutesPage() {
  const sorted = [...ROUTES].sort((a, b) => a.minutes - b.minutes);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <header className="reveal">
        <p className="eyebrow">The route database</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream lg:text-5xl">From Helsinki, to the world.</h1>
        <p className="mt-4 max-w-2xl text-cream-dim">{SITE.network.routes} routes. One search. Three runways at Helsinki-Vantaa form one bridge between Europe and Asia.</p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[["Total routes", SITE.network.routes], ["Destinations", SITE.network.airports], ["Longest sector", SITE.longestSector], ["Average sector", SITE.avgSector]].map(([k, v]) => (
          <div key={k as string} className="rounded-2xl border border-obsidian bg-ink-900 p-4 lift">
            <p className="text-xs uppercase tracking-wide text-cream-faint">{k}</p>
            <p className="mt-1 font-display text-xl font-semibold text-cream">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8"><HubFlipCard /></div>

      <h2 className="mt-10 font-display text-xl font-semibold text-cream">The route database</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-obsidian bg-ink-900">
        <div className="max-h-[460px] overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-ink-900">
              <tr className="border-b border-obsidian text-xs uppercase tracking-wide text-cream-faint">
                <th className="px-5 py-3 font-normal">Flight #</th><th className="px-5 py-3 font-normal">Departure</th><th className="px-5 py-3 font-normal">Arrival</th><th className="px-5 py-3 font-normal">Aircraft</th><th className="px-5 py-3 font-normal text-right">Flight time</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r) => (
                <tr key={r.routeNumber} className="border-t border-obsidian/40 hover:bg-ink-850">
                  <td className="px-5 py-3 font-mono text-cream">{r.routeNumber.split("/")[0]}</td>
                  <td className="px-5 py-3 text-cream-dim">{airportCity(r.dep)} <span className="text-cream-faint">({r.dep})</span></td>
                  <td className="px-5 py-3 text-cream-dim">{airportCity(r.arr)} <span className="text-cream-faint">({r.arr})</span></td>
                  <td className="px-5 py-3 text-cream-dim">{r.aircraft.replace(/^Finnair |^Nordic Regional /, "")}</td>
                  <td className="px-5 py-3 text-right text-cream-dim">{fmt(r.minutes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-3 text-xs text-cream-faint">{sorted.length} published sectors — scroll the table. Pilots can search & filter the full database in the Crew Centre.</p>
    </div>
  );
}
