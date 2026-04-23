import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
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

/* NERV fonts moved to nerv-theme.css @font-face rules —
   they only download when [data-theme="nerv"] activates the font-family usage.
   This saves ~150KB+ of font data for non-NERV users (majority). */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Battle Cats Progress",
  description: "Track your Battle Cats game progress — story chapters, legend stages, medals, milestones, and more.",
  openGraph: {
    title: "Battle Cats Progress",
    description: "Track your Battle Cats game progress — story chapters, legend stages, medals, milestones, and more.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
