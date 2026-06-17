import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { AIRPORTS, AIRPORT_COORDS, airportCity } from "@/lib/airports";
import { regionForIcao } from "@/lib/regions";
import { computeAp, categoryForMinutes, AP_TABLE } from "@/lib/career";

export const dynamic = "force-dynamic";

function fmt(min: number) {
  return `${Math.floor(min / 60)}h ${(min % 60).toString().padStart(2, "0")}m`;
}
function distanceNm(a: string, b: string): number | null {
  const p = AIRPORT_COORDS[a], q = AIRPORT_COORDS[b];
  if (!p || !q) return null;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(q[0] - p[0]), dLon = toRad(q[1] - p[1]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(p[0])) * Math.cos(toRad(q[0])) * Math.sin(dLon / 2) ** 2;
  return Math.round(3440 * 2 * Math.asin(Math.sqrt(h)));
}

export default async function DestinationPage({ params }: { params: Promise<{ icao: string }> }) {
  const { icao } = await params;
  const code = decodeURIComponent(icao).toUpperCase();
  // accept IATA too
  const resolved = AIRPORTS[code] ? code : Object.keys(AIRPORTS).find((k) => AIRPORTS[k].iata === code) ?? code;
  const ap = AIRPORTS[resolved];
  const region = regionForIcao(resolved);
  const flights = ROUTES.filter((r) => r.arr === resolved || r.dep === resolved);
  const dist = distanceNm("EFHK", resolved);

  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-20">
      <Link href="/" className="text-sm text-gold-soft hover:underline">← Back to the network</Link>

      {!ap ? (
        <div className="mt-8 rounded-xl border border-obsidian bg-ink-900 p-10 text-center">
          <h1 className="font-display text-3xl font-semibold text-cream">{code}</h1>
          <p className="mt-3 text-cream-dim">This airport isn’t in the Finnair Virtual network yet. Try another ICAO/IATA code — for example <span className="font-mono text-cream">OTHH</span> or <span className="font-mono text-cream">RJTT</span>.</p>
        </div>
      ) : (
        <>
          <header className="mt-6">
            <div className="flex flex-wrap items-center gap-2">
              {region && <span className="rounded-md px-2.5 py-1 text-xs font-semibold text-white" style={{ background: region.color }}>{region.name}</span>}
              <span className="font-mono text-sm text-cream-faint">{resolved} · {ap.iata}</span>
            </div>
            <h1 className="mt-3 font-display text-4xl font-semibold text-cream lg:text-5xl">{ap.city}</h1>
            <p className="mt-2 text-cream-dim">{ap.country}{dist != null ? ` · ${dist.toLocaleString()} nm from Helsinki` : ""}</p>
          </header>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Flights", String(flights.length)],
              ["Region", region?.name ?? "—"],
              ["Distance", dist != null ? `${dist.toLocaleString()} nm` : "—"],
              ["Hub", "EFHK"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-obsidian bg-ink-900 p-4">
                <p className="text-[0.7rem] uppercase tracking-wide text-cream-faint">{k}</p>
                <p className="mt-1 font-display text-lg font-semibold text-cream">{v}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-9 font-display text-xl font-semibold text-cream">Flights to {ap.city}</h2>
          <div className="mt-3 space-y-2">
            {flights.length === 0 && <p className="rounded-lg border border-dashed border-obsidian bg-ink-900 p-6 text-sm text-cream-faint">No scheduled flights yet.</p>}
            {flights.map((r) => {
              const cat = categoryForMinutes(r.minutes);
              const reward = computeAp(r.minutes).net;
              return (
                <div key={r.routeNumber} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-obsidian bg-ink-900 px-5 py-3.5">
                  <div>
                    <p className="font-medium text-cream">{airportCity(r.dep)} → {airportCity(r.arr)}</p>
                    <p className="text-xs text-cream-faint">{r.routeNumber.split("/")[0]} · {r.aircraft.replace(/^Finnair |^Nordic Regional /, "")} · {AP_TABLE[cat].label}</p>
                  </div>
                  <div className="flex items-center gap-5 text-sm">
                    <span className="text-cream-faint">{fmt(r.minutes)}</span>
                    <span className="font-semibold text-cream">✦ {reward.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <Link href="/crew" className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white">Fly this route in the Crew Centre</Link>
          </div>
        </>
      )}
    </div>
  );
}
