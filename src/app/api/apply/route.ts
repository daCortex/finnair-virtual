/* Pilot / Staff application intake → Discord webhook.
   Set DISCORD_APPLY_WEBHOOK to deliver applications to a Discord channel;
   without it the form still accepts submissions (delivered: false). */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Field = { label: string; value: string };

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type === "staff" ? "staff" : "pilot";
  const fields = Array.isArray(body.fields) ? (body.fields as Field[]) : [];

  // Basic validation: require IFC + Discord + a reason.
  const get = (label: string) =>
    (fields.find((f) => f.label.toLowerCase().includes(label))?.value ?? "").trim();
  if (!get("ifc")) return Response.json({ error: "Your IFC username is required." }, { status: 400 });
  if (!get("discord")) return Response.json({ error: "Your Discord username is required." }, { status: 400 });
  if (get("why").length < 10) return Response.json({ error: "Please tell us a little more about why you'd like to join." }, { status: 400 });

  const webhook = process.env.DISCORD_APPLY_WEBHOOK;
  let delivered = false;
  if (webhook) {
    const embed = {
      title: type === "staff" ? "🛠️ New Staff Application" : "✈️ New Pilot Application",
      color: type === "staff" ? 0x7c1791 : 0x0c0243,
      fields: fields
        .filter((f) => f.value && f.value.trim())
        .slice(0, 25)
        .map((f) => ({ name: f.label, value: f.value.slice(0, 1024), inline: f.value.length < 40 })),
      footer: { text: "Finnair Virtual · applications" },
      timestamp: new Date().toISOString(),
    };
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: "Finnair Virtual Recruitment", embeds: [embed] }),
      });
      delivered = res.ok;
    } catch {
      delivered = false;
    }
  }

  return Response.json({ ok: true, delivered });
}
