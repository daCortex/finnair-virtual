import Link from "next/link";
import { getPilotDashboard, fmtHours } from "@/lib/portal";
import { getCargoContracts } from "@/lib/ops";
import { CARGO_CERTS, CARGO_TABLE, CARGO_CODESHARES, cargoCertForHours } from "@/lib/career";
import { airportCity } from "@/lib/airports";
import { Locked } from "@/components/portal/Locked";

export const metadata = { title: "Cargo · Logistics Command" };
export const dynamic = "force-dynamic";

const riskColor: Record<string, string> = {
  low: "bg-ink-800 text-cream-dim",
  medium: "bg-amber-500/12 text-amber-600",
  high: "bg-rose/12 text-rose",
};

export default async function CargoPage() {
  const d = await getPilotDashboard();
  if (!d) return null;
  if (!d.gates.cargo) {
    return <Locked title="Logistics Command" rank="Zenith" hours={300} current={d.totalHours} blurb="The Cargo track — freight contracts paid in Logistic Coins (LC) — opens at Zenith, the peak of the core ladder." accent="rose" />;
  }

  // Cargo is a separate track with its own hours/LC (fresh in demo).
  const cargoHours = 0;
  const cargoLc = 0;
  const cert = cargoCertForHours(cargoHours, cargoLc);
  const contracts = getCargoContracts(d.session.pilotId, cargoHours, cargoLc);
  const codeshareUnlocked = cert.name === "Freight Architect";

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow" style={{ color: "var(--color-rose)" }}>Logistics Command · Cargo Track</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Freight operations</h1>
          <p className="mt-2 max-w-xl text-cream-dim"><span className="italic">Tarkkuus</span> — precision. Move freight out of <span className="text-cream">Brussels</span> &amp; <span className="text-cream">London</span> to earn Logistic Coins (LC). LC are strictly for cargo — separate from your Aurora Points.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 px-5 py-3 text-right">
          <p className="text-xs uppercase tracking-wide text-cream-faint">Certification</p>
          <p className="font-display text-xl font-semibold text-cream">{cert.name}</p>
          <p className="text-xs text-cream-faint">{cert.fleet.join(" · ")} · {cert.dailyLimit}/day</p>
        </div>
      </header>

      {/* contracts */}
      <div className="mt-7 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-cream">Today’s contracts</h2>
        <span className="text-xs text-cream-faint">{cert.dailyLimit} per day · operational audit on submission</span>
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contracts.map((c, i) => (
          <div key={c.id} className="rise flex flex-col rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center justify-between">
              <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${riskColor[c.risk]}`}>{c.riskLabel}</span>
              <span className="font-mono text-xs text-cream-faint">{c.flightNo}</span>
            </div>
            <p className="mt-3 font-display text-xl font-semibold text-cream">{airportCity(c.dep)} <span className="text-rose">→</span> {airportCity(c.arr)}</p>
            <p className="mt-0.5 text-xs text-cream-faint">{c.dep}–{c.arr} · {c.aircraft} · {fmtHours(c.minutes)}</p>
            <p className="mt-2 rounded-lg bg-ink-850 px-3 py-1.5 text-xs text-cream-dim">📦 {c.scenario}</p>
            <div className="mt-auto flex items-center justify-between border-t border-obsidian/70 pt-3.5">
              <div>
                <p className="text-xs text-cream-faint">payout</p>
                <p className="font-display text-lg font-semibold text-cream">◆ {c.lc.toLocaleString()} LC</p>
                {c.risk === "high" && <p className="text-[0.65rem] text-rose">min ◆ {c.lcMin.toLocaleString()} (−20% risk)</p>}
              </div>
              <Link href="/crew/file" className="rounded-full px-4 py-2 text-xs font-semibold text-white transition-all hover:brightness-125" style={{ background: "var(--color-rose)" }}>Accept</Link>
            </div>
          </div>
        ))}
      </div>

      {/* references */}
      <section className="mt-9 grid gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Risk &amp; reward</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(["low", "medium", "high"] as const).map((r) => (
              <li key={r} className="flex items-center justify-between border-t border-obsidian/60 pt-2">
                <span className="text-cream-dim">{CARGO_TABLE[r].label} · ×{CARGO_TABLE[r].multiplier}</span>
                <span className="text-cream-faint">◆ {CARGO_TABLE[r].net.toLocaleString()} LC{CARGO_TABLE[r].deduction > 0 ? ` (−${CARGO_TABLE[r].deduction * 100}%)` : ""}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Higher risk and longer flights carry higher potential rewards. High-risk loads are subject to a 20% deduction.</p>
        </div>
        <div className="rounded-2xl border border-obsidian bg-ink-900 p-6">
          <h3 className="font-display text-base font-semibold text-cream">Cargo progression</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {CARGO_CERTS.map((c) => (
              <li key={c.name} className="flex items-start justify-between gap-3 border-t border-obsidian/60 pt-2">
                <div>
                  <span className={`font-semibold ${c.name === cert.name ? "text-rose" : "text-cream"}`}>{c.name}</span>
                  <span className="text-xs text-cream-faint"> · {c.hours === 0 ? "starting" : `${c.hours}h`}{c.lcReq > 0 ? ` + ${c.lcReq.toLocaleString()} LC` : ""}</span>
                  <p className="text-xs text-cream-faint">{c.fleet.join(" · ")} · {c.dailyLimit}/day</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Plus periodic “Delivery Ferry” assignments — high-yield aircraft deliveries from the manufacturer.</p>
        </div>
      </section>

      {/* cargo codeshares */}
      <section className="mt-5 rounded-2xl border border-obsidian bg-ink-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-cream">Cargo codeshares</h3>
          <span className="text-xs text-cream-faint">{codeshareUnlocked ? "Available ✓" : "Unlocks at Freight Architect"}</span>
        </div>
        <p className="mt-1 text-sm text-cream-dim">Purchase partner freight networks with LC once you reach Freight Architect.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CARGO_CODESHARES.map((c) => (
            <span key={c.name} className="rounded-full border border-obsidian bg-ink-850 px-3 py-1.5 text-sm text-cream-dim">
              {c.name} <span className="text-xs text-cream-faint">· {c.cost.toLocaleString()} LC</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
