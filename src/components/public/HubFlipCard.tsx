/* Flip card for the routes page: front = Helsinki-Vantaa aerial, back = the
   airport diagram. Drop the real Infinite Flight screenshots in as
   /img/efhk-aerial.webp + /img/efhk-diagram.webp and they’ll appear; until
   then a tasteful gradient placeholder is shown. Hover (or tab) to flip. */
export function HubFlipCard() {
  return (
    <div className="flip group h-[320px] w-full" tabIndex={0}>
      <div className="flip-inner h-full w-full rounded-xl">
        {/* FRONT — aerial */}
        <div className="flip-face rounded-xl border border-obsidian">
          <div className="aurora flex h-full w-full flex-col justify-end p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">Helsinki-Vantaa · EFHK</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-white">Aerial view</h3>
            <p className="mt-1 text-sm text-white/65">Three runways, one bridge between Europe and Asia.</p>
            <p className="mt-4 text-xs text-white/45">Hover to view the airport diagram →</p>
          </div>
        </div>
        {/* BACK — diagram */}
        <div className="flip-face flip-back rounded-xl border border-obsidian">
          <div className="flex h-full w-full flex-col justify-end p-6" style={{ background: "linear-gradient(135deg,#0e1733,#1a2358 60%,#2a1b6b)" }}>
            <p className="text-xs uppercase tracking-[0.28em] text-white/55">EFHK · Ground chart</p>
            <h3 className="mt-1 font-display text-2xl font-semibold text-white">Airport diagram</h3>
            <p className="mt-1 text-sm text-white/65">Stands, taxiways and runway layout from Infinite Flight.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
