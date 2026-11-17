import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Noto_Serif_Display, Saira_Extra_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./nerv-theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* NERV theme fonts. Self-hosted by next/font at build time (2026-11-17): the
   previous hard-coded fonts.gstatic.com file URLs in nerv-theme.css had gone
   stale and 404'd, so NERV silently fell back to system fonts. preload:false keeps
   the original intent — the files only download when [data-theme="nerv"] CSS
   actually uses these families, so default-theme users don't pay for them. */
const nervSys = JetBrains_Mono({
  variable: "--font-nerv-sys",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  preload: false,
});
const nervTitle = Noto_Serif_Display({
  variable: "--font-nerv-title",
  subsets: ["latin"],
  weight: ["900"],
  display: "swap",
  preload: false,
});
const nervStamp = Saira_Extra_Condensed({
  variable: "--font-nerv-stamp",
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The app is always dark (default theme + NERV theme are both dark,
  // there's no light theme) but never told the browser that. Some mobile
  // browsers (notably Android Chrome's "force dark"/"simplified dark
  // theme" for pages that don't declare color-scheme) apply their own
  // heuristic per-element dark-mode conversion, which can invert PNG unit
  // icons that have mostly-light subjects on a transparent background —
  // reported 2026-09-17 by thefigg88 via Discord ("some unit icons are
  // showing with inverted colors... like Rin Tohsaka, at least for me").
  // Declaring color-scheme tells the browser we already handle our own
  // theming, so it stops guessing.
  colorScheme: "dark",
};

export const metadata: Metadata = {
  // Lets Next.js resolve openGraph/canonical URLs to absolute ones
  // (https://battlecatsprogress.app/...) instead of relative paths, which
  // search engines and link-preview crawlers (Discord, Reddit, etc.) need.
  metadataBase: new URL("https://battlecatsprogress.app"),
  title: "Battle Cats Progress",
  description: "Track your Battle Cats game progress: story chapters, legend stages, medals, milestones, and more.",
  openGraph: {
    title: "Battle Cats Progress",
    description: "Track your Battle Cats game progress: story chapters, legend stages, medals, milestones, and more.",
    siteName: "Battle Cats Progress",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent FOUC: apply NERV theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("battlecats-theme");if(t==="nerv")document.documentElement.setAttribute("data-theme","nerv")}catch(e){}})()`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${nervSys.variable} ${nervTitle.variable} ${nervStamp.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
