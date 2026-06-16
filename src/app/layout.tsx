import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

/* Display typeface: Finnair Sans for headings & the brand voice; body/UI use
   Inter for its full weight range.
   Font credit (CC BY 4.0): Web Fonts — https://www.onlinewebfonts.com */
const display = localFont({
  variable: "--font-display",
  src: [
    { path: "../../public/fonts/finnair-sans.woff", weight: "400", style: "normal" },
  ],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
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
      className={`${display.variable} ${sans.variable} ${mono.variable} h-full antialiased`}
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
