"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { NewsPost } from "@/lib/db";

const CATEGORIES = ["Announcement", "Event", "Route", "Update", "Recruitment"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function NewsAdmin({ posts }: { posts: NewsPost[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Announcement");
  const [imageUrl, setImageUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/crew/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", title, body, category, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not publish.");
      } else {
        setTitle("");
        setBody("");
        setImageUrl("");
        setCategory("Announcement");
        router.refresh();
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this news post? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/crew/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      if (res.ok) router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  const inputCls =
    "w-full rounded-xl border border-obsidian/60 bg-ink-850 px-4 py-3 text-sm text-cream placeholder:text-cream-faint focus:border-gold/60 focus:outline-none";

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      {/* Composer */}
      <form
        onSubmit={publish}
        className="rounded-2xl border border-obsidian/50 bg-ink-900 p-6"
      >
        <h2 className="font-display text-2xl font-semibold text-cream">
          Publish news
        </h2>
        <p className="mt-1 text-sm text-cream-dim">
          Posts appear instantly on the public News page.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream-faint">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. June Group Flight: KSEA → EFHK"
              className={inputCls}
              maxLength={140}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream-faint">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-ink-850">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream-faint">
                Image URL <span className="text-cream-faint/70">(optional)</span>
              </label>
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://…"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-wide text-cream-faint">
              Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the announcement… line breaks are kept."
              rows={7}
              className={`${inputCls} resize-y`}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-gold px-6 py-3 text-sm font-normal text-cream transition-all hover:bg-gold-soft disabled:opacity-50"
          >
            {busy ? "Publishing…" : "Publish post"}
          </button>
        </div>
      </form>

      {/* Existing posts */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-cream">
          Published
          <span className="ml-3 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 align-middle text-sm text-gold-soft">
            {posts.length}
          </span>
        </h2>

        <div className="mt-5 space-y-3">
          {posts.length === 0 && (
            <div className="rounded-2xl border border-dashed border-obsidian/60 bg-ink-900 p-10 text-center text-sm text-cream-faint">
              No news posts yet. ✦
            </div>
          )}
          {posts.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-obsidian/50 bg-ink-900 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[0.65rem] uppercase tracking-wide text-gold-soft">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-display text-xl font-semibold text-cream">
                    {p.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-cream-faint">
                    {formatDate(p.createdAt)} · {p.author}
                  </p>
                </div>
                <button
                  onClick={() => remove(p.id)}
                  disabled={deletingId === p.id}
                  className="shrink-0 rounded-full border border-obsidian/60 px-3 py-1.5 text-xs text-cream-faint transition-colors hover:border-red-400/50 hover:text-red-400 disabled:opacity-50"
                >
                  {deletingId === p.id ? "Deleting…" : "Delete"}
                </button>
              </div>
              <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-cream-dim">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
