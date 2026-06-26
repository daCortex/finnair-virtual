export const metadata = { title: "Live Map" };
export const dynamic = "force-dynamic";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <header className="rise mb-5">
        <p className="eyebrow">Operations</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-cream">Live map</h1>
        <p className="mt-2 max-w-xl text-cream-dim">Live Infinite Flight traffic across the network, in real time — powered by inflight.info.</p>
      </header>
      <div className="rise overflow-hidden rounded-2xl border border-obsidian">
        <iframe
          src="https://inflight.info/embed.html?token=tok_e6266c9379a1123abf35b760a5c4bbab"
          style={{ width: "100%", height: "70vh", minHeight: 520, border: 0 }}
          loading="lazy"
          title="Live Flights"
        />
      </div>
    </div>
  );
}
