import Link from "next/link";
import Image from "next/image";
import { PublicNav } from "@/components/public/PublicNav";
import { Finnix } from "@/components/public/Finnix";
import { SITE } from "@/lib/site";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <PublicNav />
      <main className="flex-1">{children}</main>
      <Finnix />

      <footer className="border-t border-obsidian bg-ink-900">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <Image src="/brand/finnair-emblem-navy-transparent.png" alt="" width={1050} height={590} className="logo-light-theme h-7 w-auto" />
                <Image src="/brand/finnair-emblem-white-transparent.png" alt="" width={510} height={287} className="logo-dark-theme h-7 w-auto" />
                <span className="text-xl tracking-tight text-cream"><span className="font-semibold">Finnair</span><span className="font-light text-cream-dim"> Virtual</span></span>
              </div>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-faint">{SITE.mission}</p>
            </div>
            <div>
              <h3 className="eyebrow">Connect</h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><a href="https://community.infiniteflight.com" target="_blank" rel="noopener noreferrer" className="text-cream-dim transition-colors hover:text-gold">Infinite Flight Community ↗</a></li>
                <li><a href="https://community.infiniteflight.com/u/ayaz_molla/summary" target="_blank" rel="noopener noreferrer" className="text-cream-dim transition-colors hover:text-gold">Founder &amp; CEO · Ayaz (ZYREX) ↗</a></li>
                <li><a href="https://community.infiniteflight.com/u/randomaviator2/summary" target="_blank" rel="noopener noreferrer" className="text-cream-dim transition-colors hover:text-gold">COO · Luca ↗</a></li>
                <li><Link href="/join" className="text-cream-dim transition-colors hover:text-gold">Join the airline</Link></li>
                <li><Link href="/crew" className="text-gold transition-colors hover:text-cream">Crew Centre →</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-obsidian/60 pt-6 text-xs leading-relaxed text-cream-faint">
            <p className="max-w-4xl">{SITE.copyright}</p>
            <p className="mt-2">{SITE.madeBy}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
