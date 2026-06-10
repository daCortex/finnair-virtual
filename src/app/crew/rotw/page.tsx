import { getRotw, rotwOptions, getSpotlightRoutes, firstFlightNo } from "@/lib/ops";
import { airportCity } from "@/lib/airports";
import { fmtHours } from "@/lib/portal";
import { RotwManager } from "@/components/RotwManager";

export const dynamic = "force-dynamic";

export default function CrewRotwPage() {
  const current = getRotw();
  const spotlights = getSpotlightRoutes();
  const options = rotwOptions().map((r) => ({
    routeNumber: r.routeNumber,
    label: `${firstFlightNo(r)} · ${airportCity(r.dep)} → ${airportCity(r.arr)} (${fmtHours(r.minutes)})`,
  }));

  return (
    <section className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
      <h2 className="font-display text-2xl font-semibold text-cream">Route of the Week</h2>
      <p className="mt-1 text-sm text-cream-dim">Feature a route on every pilot’s dashboard. Update it weekly to keep the network fresh.</p>

      <div className="mt-5 rounded-2xl border border-obsidian bg-ink-900 p-6">
        <p className="text-xs uppercase tracking-wide text-cream-faint">Currently featured</p>
        <p className="mt-1 font-display text-2xl font-semibold text-cream">{airportCity(current.dep)} → {airportCity(current.arr)}</p>
        <p className="text-sm text-cream-faint">{firstFlightNo(current)} · {current.aircraft} · {fmtHours(current.minutes)}</p>
        <div className="mt-5">
          <RotwManager current={current.routeNumber} options={options} />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-obsidian bg-ink-900 p-6">
        <h3 className="font-display text-base font-semibold text-cream">Spotlight routes (2× AP) — this week</h3>
        <p className="mt-1 text-xs text-cream-faint">Auto-rotated 1–3× per week. These sectors pay double Aurora Points.</p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {spotlights.map((s) => (
            <li key={s.routeNumber} className="rounded-full bg-rose/10 px-3 py-1 text-sm text-rose">{airportCity(s.dep)} → {airportCity(s.arr)}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
