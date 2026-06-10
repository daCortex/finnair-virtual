import { ROUTES, ROUTE_AIRLINES } from "@/lib/routes";
import { computeAp, categoryForMinutes } from "@/lib/career";
import { getRotw, getSpotlightRoutes, firstFlightNo } from "@/lib/ops";
import { getPilotDashboard } from "@/lib/portal";
import { airportCity } from "@/lib/airports";
import { RouteFinder, type EnrichedRoute } from "@/components/portal/RouteFinder";

export const metadata = { title: "Route Database" };
export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const d = await getPilotDashboard();
  const rankMult = d?.rankMultiplier ?? 1;
  const rotwNo = getRotw().routeNumber;
  const spotlightNos = new Set(getSpotlightRoutes().map((r) => r.routeNumber));

  const routes: EnrichedRoute[] = ROUTES.map((r) => {
    const spotlight = spotlightNos.has(r.routeNumber);
    const ap = computeAp(r.minutes, { spotlight, rankMultiplier: rankMult }).net;
    return {
      routeNumber: r.routeNumber,
      flightNo: firstFlightNo(r),
      dep: r.dep,
      arr: r.arr,
      depCity: airportCity(r.dep),
      arrCity: airportCity(r.arr),
      aircraft: r.aircraft.replace(/^Finnair |^Nordic Regional /, ""),
      minutes: r.minutes,
      airline: r.airline,
      category: categoryForMinutes(r.minutes),
      ap,
      spotlight,
      rotw: r.routeNumber === rotwNo,
    };
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise mb-6">
        <p className="eyebrow">Network</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Route database</h1>
        <p className="mt-3 max-w-2xl text-cream-dim">
          {ROUTES.length} routes across the Finnair Virtual network and oneworld codeshares. Search by flight number, city or ICAO —
          each card shows the Aurora Points you’d earn{rankMult > 1 ? ` at your ${d?.rank.current.name} rank` : ""}.
        </p>
      </header>
      <RouteFinder routes={routes} airlines={["All", ...ROUTE_AIRLINES]} />
    </div>
  );
}
