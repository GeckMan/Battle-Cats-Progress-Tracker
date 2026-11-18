import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import AboutClient from "./AboutClient";

// This page doesn't require a login (see robots.ts's comment on why),
// making it the one page worth its own search-friendly metadata instead of
// inheriting the generic root layout title/description.
export const metadata: Metadata = {
  title: "About — Battle Cats Progress",
  description:
    "A fan-made progress tracker for The Battle Cats. Track story chapters, legend stages, meow medals, milestones, and your unit collection, then compare with friends.",
  openGraph: {
    title: "About — Battle Cats Progress",
    description:
      "A fan-made progress tracker for The Battle Cats. Track story chapters, legend stages, meow medals, milestones, and your unit collection, then compare with friends.",
  },
};

export default async function AboutPage() {
  const session = await getServerSession(authOptions);
  return (
    <AboutClient loggedIn={!!session}>
      <div className="space-y-10">

        {/* Hero */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-100">Battle Cats Progress</h1>
          <p className="text-gray-400 text-sm">
            A fan-made tracker for{" "}
            <a
              href="https://www.ponos.jp/en/battlecats/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-200"
            >
              The Battle Cats
            </a>{" "}
            by PONOS. Not affiliated with or endorsed by PONOS Corporation.
          </p>
        </div>

        {/* What is this? */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
            What is this?
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Battle Cats Progress is a personal tracker built for fans of The Battle Cats. The game
            doesn&apos;t have a great way to share your progress or see where your friends are at, so
            this site tries to fill that gap.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            You can track your Story, Legend, Medals, Milestones, and Unit Collection, add friends,
            and compare where you both stand. Game data updates automatically from the game files and
            the Battle Cats Wiki, so new cats and chapters show up soon after they&apos;re released in
            English. More features are in the works.
          </p>
        </section>

        {/* Features */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
            Current Features
          </h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Story</strong> &mdash; track cleared chapters, treasures, and zombie outbreaks across all three arcs</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Legend</strong> &mdash; log your crown progress through Stories of Legend, Uncanny Legends, and Zero Legends</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Medals</strong> &mdash; see all Meow Medals and mark which ones you&apos;ve earned (press and hold on a phone to see what each one is for), with auto-sync from your story and legend progress</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Milestone Stages</strong> &mdash; check off Crazed Cats, Manic Cats, Advent stages, and Catclaw ranks</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Unit Collection</strong> &mdash; browse all 800+ cats with sprites, track which you own and their form level, filter by rarity, source, and gacha set</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Activity &amp; Chat Panel</strong> &mdash; slide-out panel with a live activity feed and a global chat board for all users</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Social</strong> &mdash; add friends, view their profiles, compare your progress side by side, and browse their unit collection. Set your progress to Private any time to hide it, even from friends</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Mobile Support</strong> &mdash; fully responsive layout with a hamburger menu, optimized grids, and touch-friendly controls</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-500">&rarr;</span>
              <span><strong className="text-gray-100">Backup &amp; Restore</strong> &mdash; export all your progress to a file and import it again from Settings</span>
            </li>
          </ul>
        </section>

        {/* Bug Reports & Feedback */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
            Thanks for the Bug Reports
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            This site gets better because people take the time to report what&apos;s broken. Big
            thanks to{" "}
            <strong className="text-gray-200">bvg</strong>,{" "}
            <strong className="text-gray-200">JSDPLAYSBCEN</strong>,{" "}
            <strong className="text-gray-200">mranimemeboi</strong>,{" "}
            <strong className="text-gray-200">HexagonForce</strong>,{" "}
            <strong className="text-gray-200">Setredid</strong>,{" "}
            <strong className="text-gray-200">shroomp</strong>,{" "}
            <strong className="text-gray-200">warhammer775ig</strong>,{" "}
            <strong className="text-gray-200">mingq</strong>, and{" "}
            <strong className="text-gray-200">thefigg88</strong>{" "}
            for flagging issues on the site and on Reddit. If you spot something off, let us know.
            It helps everyone.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Found a bug or have feedback? DM Geck directly on{" "}
            <a
              href="https://discord.gg/3zsm3he8qQ"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-200"
            >
              Discord
            </a>
            .
          </p>
        </section>

        {/* Changelog */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
            Changelog
          </h2>

          <ChangelogEntry
            version="1.4"
            date="November 18, 2026"
            items={[
              "Faster site: one background check instead of three, Unit filters switch instantly (the catalog loads once), and unit images are served as static files",
              "Phone layouts: Legend and Story show one saga/arc at a time with full names and every crown button; dashboard labels no longer cut off; Unit filters sit behind a Filters button",
              "Undo for bulk unit changes (and a confirmation before clearing a large selection); failed saves on Story, Legend and Medals now show a message and roll back",
              "Press and hold a medal on a phone to see its name and what it's for",
              "Game data now also syncs from the Battle Cats Wiki (mirrored every other day): new English units, True/Ultra Forms and Zero Legends chapters appear even before the game-data dump catches up, units from collabs that haven't run in English yet stay hidden until they do, and \"How to Obtain\" and set names follow the wiki",
              "Fixes from that sync: Ryuichi, Hare of Inaba, Zero Legends 36\u201337, Voli's Ultra Form, Akechi Mitsuhide's True Form, Nekoluga's evolved name, Nyanko Rangers / Download Celebration! banners, merged duplicate seasonal sets",
              "Privacy: Private progress is now hidden everywhere (compare pages and the activity feed included), and you can remove friends or cancel friend requests",
              "Chat badge no longer shows 99+ on every login, wrong passwords show a message, and the NERV theme's fonts load again",
              "Accessibility: visible keyboard focus in both themes, screen-reader labels, brighter low-contrast text, and support for your device's reduce-motion setting",
            ]}
          />
          <ChangelogEntry
            version="1.3"
            date="October 2026"
            items={[
              "Cut background requests so the site stays within its hosting limits (it briefly went offline in October)",
              "Data fixes from player reports: Burgle Boss Cat is obtainable again, festival banner tags corrected, duplicate Fate and World Trigger collab entries merged, base Rare/Super Rare cats removed from special gacha filters",
            ]}
          />
          <ChangelogEntry
            version="1.2"
            date="July 21, 2026"
            items={[
              "Unit Collection can now sort by the real in-game Cat Guide order (scraped weekly from the wiki) instead of release order — it's the default now, with a saved toggle to switch back",
              "Milestone Stages page repacked into a tighter masonry layout so category panels use the screen better and it's clearer there's more to scroll",
              "Removed the Advent Stages milestone category — every stage in it already has an equivalent Meow Medal — and added three missing Awakening Stage follow-ups instead: The Eldest Queen, Papuu's Paradox, and Z-Onel Resurrected!",
              "Removed \"Catburger Awakens!\" from Awakened Stages — that content has been removed from the game",
              "Fixed unobtainable units (like Cheetah Cat) showing up when browsing a specific gacha Set",
              "Medals page: added a \"Backfill Stages\" button — earned Meow Medals can now fill in matching Legend crown and Story treasure/zombie progress, not just the other way around",
              "Unit form labels changed from \"Form 1/Form 2\" to \"NF/EF\" (Normal Form/Evolved Form)",
              "Social moved in the sidebar to sit right above About",
            ]}
          />

          <ChangelogEntry
            version="1.1"
            date="July 14, 2026"
            items={[
              "Units now show far more accurate \"How to Obtain\" info, auto-synced weekly from the wiki's Cat Release Order page",
              "Re-verified every unit flagged as a real-world collaboration against its own wiki page, fixing dozens of mistagged units and several miscategorized gacha sets (Bikkuriman, Baki Hanma, Rurouni Kenshin) that had split into two entries in the Sets filter",
              "Fixed wiki links breaking for units with an \"&\" in their name",
              "Fixed the Compare button overlapping the Activity & Chat button on a friend's profile page",
              "Chat & Activity panel opens more reliably on mobile and no longer fights with the on-screen keyboard",
            ]}
          />

          <ChangelogEntry
            version="1.0"
            date="July 8, 2026"
            items={[
              "Meow Medals now sync automatically from the same weekly game-data update as units and legend stages, including medal artwork, instead of relying on a manual wiki scrape",
              "Fixed a bug causing most cats to show the wrong rarity in Unit Collection",
              "Chat messages can now be deleted (your own message anytime, or any message if you're an admin)",
              "Progress Waveform on the dashboard now shows your full history instead of just the last 30 days, with cleaner date labels",
              "Activity feed now groups everything one person did in a single sitting into one entry, instead of splitting it up by action type",
              "Added a live \"online now\" counter to the Activity panel",
              "Login attempts are now logged, with suspicious activity flagged for admins",
              "Security hardening: upgraded Next.js, added rate limiting and stronger error handling across the API",
            ]}
          />

          <ChangelogEntry
            version="0.95"
            date="June 2026"
            items={[
              "Added Vercel Web Analytics to keep an eye on site traffic",
              "Backend hardening pass: consistent error handling and rate limiting across all API routes",
              "More reliable unit rarity detection from game data",
            ]}
          />

          <ChangelogEntry
            version="0.91"
            date="March 2026"
            items={[
              "Added a hidden \"Unleash the Cat\" easter egg on this page",
              "Hover tooltips and accordions for units and medals",
              "Fixed medal hex borders, tooltip positioning, and a laggy Medals page scroll",
            ]}
          />

          <ChangelogEntry
            version="0.9"
            date="March 24, 2026"
            items={[
              "Chat friend requests: hover a username in chat to add them as a friend or view their profile",
              "Smarter polling: reduced unnecessary background requests for activity, chat, and friend request counts",
              "Per-subchapter crown limits: ZL chapters now correctly show 1 or 2 crowns instead of 4",
            ]}
          />

          <ChangelogEntry
            version="0.8"
            date="March 2026"
            items={[
              "Unit comparison view: see what units friends have that you don't, filter by rarity and form level",
              "Friend unit collection browser: view a friend's full unit collection from their profile",
              "BCData auto-sync: unit names and legend stages update automatically from game data weekly",
            ]}
          />

          <ChangelogEntry
            version="0.7"
            date="March 2026"
            items={[
              "Mobile support: fully responsive layout with hamburger menu and touch-friendly controls",
              "Activity & Chat panel: slide-out drawer with a live activity feed and global chat",
              "NERV theme: optional Evangelion-inspired CRT terminal aesthetic in Settings",
            ]}
          />

          <ChangelogEntry
            version="0.6"
            date="March 2026"
            items={[
              "Unit Collection: browse 800+ cats with sprites, track form levels, filter by rarity/source/gacha set",
              "Milestones page: track Crazed, Manic, Advent stages, and Catclaw ranks",
              "Progress comparison: compare your overall stats and SoL subchapters with friends",
            ]}
          />

          <ChangelogEntry
            version="0.1"
            date="January 2026"
            items={[
              "Site launch: Story, Legend, Medals tracking and friend/compare system",
            ]}
          />
        </section>

        {/* Credits */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
            Credits
          </h2>
          <div className="text-sm text-gray-400 space-y-2">
            <p>
              Built by <strong className="text-gray-200">Geck</strong>. Started as a personal project to track progress and compare with friends.
            </p>
            <p>
              Unit names and rarities, legend stage names, and the meow medal catalog are synced
              weekly from{" "}
              <a
                href="https://git.battlecatsmodding.org/fieryhenry/BCData"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-200"
              >
                fieryhenry&apos;s BCData
              </a>
              , an extracted, versioned dump of the game&apos;s data files. Huge thanks to fieryhenry
              for maintaining it.
            </p>
            <p>
              Unit sprites, medal artwork, and newer units, forms and &ldquo;How to Obtain&rdquo; details
              come from the{" "}
              <a
                href="https://battlecats.miraheze.org/wiki/Battle_Cats_Wiki"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-200"
              >
                Battle Cats Wiki
              </a>
              , which we mirror every other day with Miraheze&apos;s permission. Thanks to the wiki&apos;s
              editors for keeping it current, and to Jenny_on_Wiki for helping set that up.
            </p>
            <p>
              The Battle Cats is developed and published by{" "}
              <a
                href="https://www.ponos.jp/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-200"
              >
                PONOS Corporation
              </a>
              . All game assets belong to PONOS.
            </p>
          </div>
        </section>

      </div>
    </AboutClient>
  );
}

function ChangelogEntry({
  version,
  date,
  items,
}: {
  version: string;
  date: string;
  items: string[];
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-2">
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold bg-amber-950/50 border border-amber-800 text-amber-300 rounded px-1.5 py-0.5 leading-none">
          v{version}
        </span>
        <span className="text-xs text-gray-500">{date}</span>
      </div>
      <ul className="space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-400 leading-relaxed">
            <span className="text-gray-500 mt-0.5 flex-shrink-0">&bull;</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
