import Link from "next/link";
import { getPilotDashboard, fmtHours, fmtDate, timeAgo } from "@/lib/portal";
import { computeAp } from "@/lib/career";
import { getRotw, getSpotlightRoutes, getDispatches, isSpotlight, firstFlightNo } from "@/lib/ops";
import { listNews } from "@/lib/db";
import { CountUp } from "@/components/portal/CountUp";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const d = await getPilotDashboard();
  if (!d) {
    return (
      <section className="mx-auto max-w-md px-6 py-32 text-center">
        <h1 className="font-display text-3xl font-semibold text-cream">Pilot sign-in required</h1>
        <p className="mt-3 text-cream-dim">Sign in to access your Finnair Virtual flight deck.</p>
        <Link href="/api/auth/discord" className="mt-6 inline-flex rounded-full bg-gold px-6 py-3 text-sm font-medium text-white">Sign in</Link>
      </section>
    );
  }

  const { rank, tier, license } = d;
  const rotw = getRotw();
  const spotlights = getSpotlightRoutes();
  const dispatches = d.gates.career
    ? getDispatches(d.session.pilotId, { authorizedFleet: d.fleet, rankMultiplier: d.rankMultiplier }).slice(0, 3)
    : [];
  const rotwAp = computeAp(rotw.minutes, { spotlight: isSpotlight(rotw.routeNumber), rankMultiplier: d.rankMultiplier }).net;
  const firstName = d.session.displayName.split(" ")[0];
  const events = (await listNews(6)).filter((e) => e.category !== "Route of the Week");

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8 lg:py-10">
      {/* ============ HERO MEMBERSHIP CARD ============ */}
      <section className="rise overflow-hidden rounded-3xl border border-obsidian">
        <div className="aurora relative px-6 py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-30 blur-3xl" style={{ background: "radial-gradient(circle, #c451d6, transparent 70%)" }} />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            {/* identity */}
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-white/55">Welcome back, captain</p>
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-white lg:text-5xl">{firstName}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/12 px-3 py-1 text-sm font-medium text-white">{d.session.callsign}</span>
                <span className="rounded-full px-3 py-1 text-sm font-semibold text-white" style={{ background: tier.current.accent }}>Finnair Plus · {tier.current.name}</span>
                <span className="rounded-full border border-white/25 px-3 py-1 text-sm text-white/85">{license.current.short} licence</span>
                {d.session.demo && <span className="rounded-full border border-white/20 px-2.5 py-1 text-[0.65rem] uppercase tracking-wide text-white/55">demo</span>}
              </div>
            </div>
            {/* AP balance */}
            <div className="shrink-0 rounded-2xl bg-white/8 px-6 py-5 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Aurora Points</p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl text-rose-soft">✦</span>
                <CountUp value={d.apBalance} className="tnum font-display text-4xl font-semibold text-white lg:text-5xl" />
              </p>
              {tier.next ? (
                <p className="mt-1 text-xs text-white/60">{tier.apToNext!.toLocaleString()} AP to {tier.next.name}</p>
              ) : (
                <p className="mt-1 text-xs text-white/60">Top tier achieved ✦</p>
              )}
            </div>
          </div>

          {/* rank progress */}
          <div className="relative mt-8">
            <div className="flex items-end justify-between text-sm">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Rank {rank.current.n} of 9</p>
                <p className="mt-0.5 font-display text-xl font-semibold text-white">{rank.current.name}</p>
              </div>
              <p className="text-right text-xs text-white/60">
                {rank.next ? <>{Math.round(rank.hoursToNext!).toLocaleString()}h to <span className="font-semibold text-white">{rank.next.name}</span></> : "Highest rank attained"}
              </p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/12">
              <div className="bar-fill h-full rounded-full" style={{ ["--to" as string]: `${rank.pct}%`, background: "linear-gradient(90deg,#a99cff,#c451d6)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ============ STAT STRIP ============ */}
      <section className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Flight time", value: fmtHours(d.totalMinutes), sub: `${(d.totalHours).toLocaleString(undefined, { maximumFractionDigits: 0 })} hours logged` },
          { label: "PIREPs filed", value: d.totalPireps.toLocaleString(), sub: `${d.filedPireps.length} on the new system` },
          { label: "Last PIREP", value: timeAgo(d.lastPirepAt), sub: fmtDate(d.lastPirepAt) },
          { label: "Licence", value: license.current.short, sub: license.next ? `${Math.round(license.hoursToNext!)}h to ${license.next.short}` : "Fully type-rated" },
        ].map((c, i) => (
          <div key={c.label} className="rise rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: `${80 + i * 70}ms` }}>
            <p className="text-xs uppercase tracking-[0.18em] text-cream-faint">{c.label}</p>
            <p className="mt-2 font-display text-2xl font-semibold text-cream">{c.value}</p>
            <p className="mt-1 text-xs text-cream-faint">{c.sub}</p>
          </div>
        ))}
      </section>

      {/* ============ ROTW + SPOTLIGHT ============ */}
      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        {/* Route of the week */}
        <div className="rise lg:col-span-2 overflow-hidden rounded-2xl border border-obsidian bg-ink-900 lift" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between border-b border-obsidian/70 px-6 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">✦ Route of the Week</p>
            <span className="text-xs text-cream-faint">Updated weekly by ops</span>
          </div>
          <div className="flex flex-col gap-5 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3 font-display text-3xl font-semibold text-cream">
                <span>{rotw.dep}</span>
                <span className="text-gold">→</span>
                <span>{rotw.arr}</span>
              </div>
              <p className="mt-2 text-sm text-cream-dim">{firstFlightNo(rotw)} · {rotw.aircraft} · {fmtHours(rotw.minutes)}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs uppercase tracking-wide text-cream-faint">Reward</p>
                <p className="font-display text-2xl font-semibold text-cream">✦ {rotwAp.toLocaleString()}</p>
              </div>
              <Link href="/file" className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-white transition-all hover:brightness-125">Fly it</Link>
            </div>
          </div>
        </div>

        {/* Spotlight */}
        <div className="rise rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: "180ms" }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose">2× Spotlight</p>
            <span className="rounded-full bg-rose/10 px-2 py-0.5 text-[0.65rem] text-rose">{spotlights.length} live</span>
          </div>
          <ul className="mt-3 space-y-2">
            {spotlights.map((s) => (
              <li key={s.routeNumber} className="flex items-center justify-between rounded-xl bg-ink-850 px-3 py-2 text-sm">
                <span className="font-medium text-cream">{s.dep} → {s.arr}</span>
                <span className="text-xs text-cream-faint">{firstFlightNo(s)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-cream-faint">Spotlight sectors earn double Aurora Points. Rotated 1–3× a week.</p>
        </div>
      </section>

      {/* ============ EVENTS & GROUP FLIGHTS ============ */}
      {events.length > 0 && (
        <section className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-cream">Events & group flights</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {events.slice(0, 3).map((e, i) => (
              <div key={e.id} className="rise rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${e.category === "Group Flight" ? "bg-rose/10 text-rose" : e.category === "Event" ? "bg-emerald-500/12 text-emerald-600" : "bg-ink-800 text-cream-faint"}`}>{e.category}</span>
                  {e.eventAt && <span className="text-xs text-cream-faint">{new Date(e.eventAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>}
                </div>
                <h3 className="mt-2.5 font-display text-base font-semibold text-cream">{e.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-cream-dim">{e.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ============ DISPATCH BOARD (career) ============ */}
      <section className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-cream">Your dispatch board</h2>
          <Link href="/career" className="text-sm text-gold hover:underline">Open Career →</Link>
        </div>
        {d.gates.career ? (
          <div className="grid gap-4 md:grid-cols-3">
            {dispatches.map((dp, i) => (
              <div key={dp.id} className="rise rounded-2xl border border-obsidian bg-ink-900 p-5 lift" style={{ animationDelay: `${120 + i * 70}ms` }}>
                <div className="flex items-center justify-between">
                  <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${dp.spotlight ? "bg-rose/12 text-rose" : dp.priority === "priority" ? "bg-gold/10 text-gold" : "bg-ink-800 text-cream-faint"}`}>
                    {dp.spotlight ? "2× Spotlight" : dp.priority}
                  </span>
                  <span className="text-xs text-cream-faint">due {dp.dueInHours}h</span>
                </div>
                <div className="mt-3 flex items-center gap-2 font-display text-2xl font-semibold text-cream">
                  {dp.dep} <span className="text-gold">→</span> {dp.arr}
                </div>
                <p className="mt-1 text-xs text-cream-faint">{dp.flightNo} · {dp.aircraft} · {fmtHours(dp.minutes)}</p>
                <div className="mt-4 flex items-center justify-between border-t border-obsidian/70 pt-3">
                  <span className="text-sm text-cream-dim">up to <span className="font-semibold text-cream">✦ {dp.maxAp.toLocaleString()}</span></span>
                  <Link href="/file" className="rounded-full border border-gold/40 px-3.5 py-1.5 text-xs font-medium text-gold hover:bg-gold/8">Accept</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <LockedTile title="Career Mode locks in at Elysian" body="Reach 75 flight hours (rank 3 · Elysian) to unlock auto-dispatched assignments and the Aurora-Points economy." href="/career" hours={Math.max(0, 75 - Math.round(d.totalHours))} />
        )}
      </section>

      {/* ============ RECENT + QUICK ACTIONS ============ */}
      <section className="mt-5 grid gap-4 lg:grid-cols-3">
        {/* recent flights */}
        <div className="rise rounded-2xl border border-obsidian bg-ink-900 lg:col-span-2" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center justify-between border-b border-obsidian/70 px-6 py-3">
            <h2 className="font-display text-base font-semibold text-cream">Recent flights</h2>
            <Link href="/logbook" className="text-sm text-gold hover:underline">Full logbook →</Link>
          </div>
          {d.filedPireps.length === 0 ? (
            <p className="px-6 py-8 text-sm text-cream-faint">No flights filed yet. <Link href="/file" className="text-gold">File your first PIREP</Link>.</p>
          ) : (
            <ul className="divide-y divide-obsidian/60">
              {d.filedPireps.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between px-6 py-3.5 transition-colors hover:bg-ink-850">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-cream">{p.dep} → {p.arr}</span>
                    <span className="text-xs text-cream-faint">{p.flightNo} · {p.aircraft}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-cream-faint">{fmtHours(p.minutes)}</span>
                    <StatusPill status={p.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* quick actions / gates */}
        <div className="rise space-y-3" style={{ animationDelay: "180ms" }}>
          <GateTile label="Special Operations" sub="Celestia rank · 1,200h" href="/special-ops" unlocked={d.gates.specialOps} accent="gold" />
          <GateTile label="oneworld Discover" sub="Sovereign rank · 2,500h" href="/discover" unlocked={d.gates.discover} accent="rose" />
          <GateTile label="Cargo · Logistics Command" sub="Zenith rank · 300h" href="/cargo" unlocked={d.gates.cargo} accent="gold" />
        </div>
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    approved: "bg-emerald-500/12 text-emerald-600",
    pending: "bg-amber-500/12 text-amber-600",
    rejected: "bg-rose-500/12 text-rose-500",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${map[status] ?? "bg-ink-800 text-cream-faint"}`}>{status}</span>;
}

function LockedTile({ title, body, href, hours }: { title: string; body: string; href: string; hours: number }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-obsidian bg-ink-900 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-cream"><span>🔒</span> {title}</p>
        <p className="mt-1 max-w-xl text-sm text-cream-dim">{body}</p>
      </div>
      <span className="shrink-0 rounded-full bg-ink-850 px-4 py-2 text-sm text-cream-dim">{hours}h to go</span>
    </div>
  );
}

function GateTile({ label, sub, href, unlocked, accent }: { label: string; sub: string; href: string; unlocked: boolean; accent: "gold" | "rose" }) {
  return (
    <Link href={href} className={`block rounded-2xl border p-5 lift ${unlocked ? "border-obsidian bg-ink-900" : "border-dashed border-obsidian bg-ink-900/60"}`}>
      <div className="flex items-center justify-between">
        <p className={`font-display text-base font-semibold ${unlocked ? "text-cream" : "text-cream-faint"}`}>{label}</p>
        <span className={`text-sm ${unlocked ? (accent === "rose" ? "text-rose" : "text-gold") : "text-cream-faint"}`}>{unlocked ? "→" : "🔒"}</span>
      </div>
      <p className="mt-1 text-xs text-cream-faint">{unlocked ? "Unlocked · enter" : sub}</p>
    </Link>
  );
}
