import Link from "next/link";
import type { Codeshare } from "@/lib/career";
import { sortedCodeshares } from "@/lib/career";

/* Codeshare partners as an unlockable inventory — Jet Airways is the free
   starter (unlocked); the rest are locked with a price, shown ascending.
   Passenger partners are priced in AP, cargo partners in LC. Once unlocked, a
   partner's full route list becomes browsable in the route database (and its
   sectors start appearing on dispatch). */
export function CodeshareInventory({ items, currency, routesHref = "/crew/routes" }: { items: Codeshare[]; currency: "AP" | "LC"; routesHref?: string }) {
  const sorted = sortedCodeshares(items);
  const icon = currency === "AP" ? "✦" : "◈";
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((c) => {
        const unlocked = !!c.free;
        return (
          <div
            key={c.name}
            className={`flex flex-col gap-2 rounded-2xl border p-4 ${unlocked ? "border-gold/40 bg-gold/[0.05]" : "border-obsidian bg-ink-900"}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-display text-base font-semibold text-cream">{c.name}</p>
                <p className="text-xs text-cream-faint">{unlocked ? "Free starter · all pilots" : "Partner network"}</p>
              </div>
              {unlocked ? (
                <span className="shrink-0 rounded-full bg-gold/15 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-gold">Unlocked</span>
              ) : (
                <span className="shrink-0 text-right">
                  <span className="block font-display text-sm font-semibold text-cream">{icon} {c.cost.toLocaleString()}</span>
                  <span className="block text-[0.6rem] uppercase tracking-wide text-cream-faint">🔒 {currency}</span>
                </span>
              )}
            </div>
            {unlocked && (
              <Link href={`${routesHref}?airline=${encodeURIComponent(c.name)}`} className="text-xs font-medium text-gold-soft hover:text-cream">
                View routes in database →
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
