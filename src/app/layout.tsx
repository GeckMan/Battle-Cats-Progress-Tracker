import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Noto_Serif_Display, Saira_Extra_Condensed } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import "./nerv-theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* NERV v2 fonts */
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifDisplay = Noto_Serif_Display({
  variable: "--font-noto-serif-display",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const sairaExtraCondensed = Saira_Extra_Condensed({
  variable: "--font-saira-extra-condensed",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} ${notoSerifDisplay.variable} ${sairaExtraCondensed.variable} antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
