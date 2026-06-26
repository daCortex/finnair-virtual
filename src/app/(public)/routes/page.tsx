import { ROUTES } from "@/lib/routes";
import { airportCity } from "@/lib/airports";
import { SITE } from "@/lib/site";
import { RoutesTable, type RouteRow } from "@/components/public/RoutesTable";

export const metadata = { title: "Routes" };

function fmt(min: number) {
  return `${Math.floor(min / 60)}h ${(min % 60).toString().padStart(2, "0")}m`;
}

export default function RoutesPage() {
  const rows: RouteRow[] = [...ROUTES]
    .sort((a, b) => a.minutes - b.minutes)
    .map((r) => {
      const nums = r.routeNumber.split("/");
      return {
        outNo: nums[0],
        retNo: nums[1] ?? "—",
        depCity: airportCity(r.dep),
        dep: r.dep,
        arrCity: airportCity(r.arr),
        arr: r.arr,
        aircraft: r.aircraft.replace(/^Finnair |^Nordic Regional /, ""),
        minutes: r.minutes,
        time: fmt(r.minutes),
        airline: r.airline,
      };
    });

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

      <h2 className="mt-10 font-display text-xl font-semibold text-cream">The route database</h2>
      <p className="mb-4 mt-1 text-sm text-cream-dim">Search by city, ICAO, aircraft or flight number — and filter by haul length. Every route carries an outbound and a return flight number.</p>
      <RoutesTable rows={rows} />
    </div>
  );
}
