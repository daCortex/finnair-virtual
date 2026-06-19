import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/* Type system:
   • Geist — a modern, minimal, sleek grotesque for headings & UI.
   • Newsreader — an elegant serif (with italics) for descriptions / lead copy,
     giving editorial contrast against the clean grotesque. */
const display = Geist({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const serif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finnairvirtual.example"),
  title: {
    default: "Finnair Virtual — Crew Center",
    template: "%s · Finnair Virtual",
  },
  description:
    "Crew Center for Finnair Virtual — staff operations: pilot roster, PIREP review, applications, live flights, stats, LOA and reports.",
  robots: { index: false },
  keywords: [
    "virtual airline",
    "Finnair Virtual",
    "Infinite Flight",
    "flight simulation",
    "VA",
  ],
  openGraph: {
    title: "Finnair Virtual — The Nordic Way to Fly",
    description:
      "An independent virtual airline for flight simulation. Nordic design, hospitality and smooth travel across 100+ destinations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${serif.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink-950 text-cream">
        {/* Apply saved theme before paint (default light) — avoids a flash.
            An external file (not an inline script) loaded beforeInteractive,
            so it runs before hydration without tripping React's script rules. */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
