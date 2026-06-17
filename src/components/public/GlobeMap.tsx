"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { REGIONS } from "@/lib/regions";
import type { RegionLeg } from "./RegionMap";

const HUB: [number, number] = [60.3172, 24.9633]; // Helsinki-Vantaa

type Arc = { startLat: number; startLng: number; endLat: number; endLng: number; color: string; region: string };
type Pt = { lat: number; lng: number; color: string; region: string; code: string; city: string; isHub?: boolean };

export function GlobeMap({ legs, title }: { legs: RegionLeg[]; title: string }) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<{ arcsData: (d: Arc[]) => void; pointsData: (d: Pt[]) => void; _destructor?: () => void } | null>(null);
  const [active, setActive] = useState<Set<string>>(new Set(REGIONS.map((r) => r.name)));
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const allArcs: Arc[] = legs.map((l) => ({ startLat: HUB[0], startLng: HUB[1], endLat: l.to[0], endLng: l.to[1], color: l.color, region: l.region }));
  const allPts: Pt[] = [
    { lat: HUB[0], lng: HUB[1], color: "#7b6cf0", region: "Finland", code: "EFHK", city: "Helsinki", isHub: true },
    ...legs.map((l) => ({ lat: l.to[0], lng: l.to[1], color: l.color, region: l.region, code: l.code, city: l.city })),
  ];

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const Globe = (await import("globe.gl")).default;
      if (cancelled || !wrapRef.current) return;
      const el = wrapRef.current;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const dark = document.documentElement.classList.contains("dark");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const world: any = new (Globe as any)(el)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("/globe/earth-dark.jpg")
        .bumpImageUrl("/globe/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor(dark ? "#7b6cf0" : "#3b6fe0")
        .atmosphereAltitude(0.18)
        .arcColor("color")
        .arcStroke(0.55)
        .arcAltitudeAutoScale(0.45)
        .arcDashLength(0.45)
        .arcDashGap(0.25)
        .arcDashAnimateTime(reduce ? 0 : 2600)
        .arcsTransitionDuration(0)
        .pointColor("color")
        .pointAltitude(0.01)
        .pointRadius((d: Pt) => (d.isHub ? 0.7 : 0.42))
        .pointsMerge(false)
        .pointLabel((d: Pt) => `<div style="font:600 12px/1.2 system-ui;color:#fff;background:rgba(12,2,67,.9);padding:4px 8px;border-radius:6px">${d.city} (${d.code})</div>`)
        .onPointClick((d: Pt) => { if (!d.isHub) router.push(`/destination/${d.code}`); })
        .width(el.clientWidth)
        .height(el.clientHeight);

      world.arcsData(allArcs);
      world.pointsData(allPts);
      world.pointOfView({ lat: 45, lng: 18, altitude: 2.1 }, 0);
      const controls = world.controls();
      controls.autoRotate = !reduce;
      controls.autoRotateSpeed = 0.45;
      controls.enableZoom = true;
      controls.minDistance = 180;
      globeRef.current = world;
      setLoading(false);

      const onResize = () => world.width(el.clientWidth).height(el.clientHeight);
      window.addEventListener("resize", onResize);
      (world as { _onResize?: () => void })._onResize = onResize;
    })();

    return () => {
      cancelled = true;
      const w = globeRef.current as (typeof globeRef.current & { _onResize?: () => void }) | null;
      if (w?._onResize) window.removeEventListener("resize", w._onResize);
      w?._destructor?.();
      if (wrapRef.current) wrapRef.current.innerHTML = "";
      globeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggle(name: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      const w = globeRef.current;
      if (w) {
        w.arcsData(allArcs.filter((a) => next.has(a.region)));
        w.pointsData(allPts.filter((p) => p.isHub || next.has(p.region)));
      }
      return next;
    });
  }

  function search(e: React.FormEvent) {
    e.preventDefault();
    const code = query.trim().toUpperCase();
    if (code.length >= 3) router.push(`/destination/${code}`);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-obsidian bg-ink-900">
      <div className="flex flex-col gap-3 border-b border-obsidian/70 p-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="font-display text-lg font-semibold text-cream">{title}</h3>
        <form onSubmit={search} className="relative w-full lg:max-w-xs">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cream-faint" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" /><path d="m21 21-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search destination — e.g. OTHH"
            className="w-full rounded-md border border-obsidian bg-ink-850 py-2 pl-9 pr-3 text-sm uppercase text-cream placeholder:normal-case placeholder:text-cream-faint outline-none focus:border-gold-soft" />
        </form>
      </div>

      <div className="flex flex-wrap gap-1.5 px-4 py-3">
        {REGIONS.map((r) => {
          const on = active.has(r.name);
          return (
            <button key={r.name} onClick={() => toggle(r.name)}
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${on ? "border-obsidian bg-ink-850 text-cream" : "border-obsidian/60 text-cream-faint opacity-60"}`}>
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: on ? r.color : "transparent", border: `1.5px solid ${r.color}` }} />
              {r.name}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div ref={wrapRef} className="h-[62vh] min-h-[460px] w-full" style={{ background: "radial-gradient(ellipse at 50% 40%, #1a1147 0%, #0a0524 70%)" }} />
        {loading && <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-white/60">Loading globe…</div>}
        <p className="pointer-events-none absolute bottom-3 left-4 text-[0.7rem] text-white/45">Drag to rotate · scroll to zoom · click a city for details</p>
      </div>
    </div>
  );
}
