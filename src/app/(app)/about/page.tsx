export default function AboutPage() {
  return (
    <div className="p-4 pt-16 md:p-8 max-w-2xl space-y-10">

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
          and compare where you both stand. More features are in the works.
        </p>
      </section>

      {/* Features */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Current Features
        </h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Story</strong> — track cleared chapters, treasures, and zombie outbreaks across all three arcs</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Legend</strong> — log your crown progress through Stories of Legend, Uncanny Legends, and Zero Legends</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Medals</strong> — see all Meow Medals and mark which ones you&apos;ve earned, with auto-sync from your story and legend progress</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Milestone Stages</strong> — check off Crazed Cats, Manic Cats, Advent stages, and Catclaw ranks</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Unit Collection</strong> — browse all 800+ cats with sprites, track which you own and their form level, filter by rarity, source, and gacha set</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Activity & Chat Panel</strong> — slide-out panel with a live activity feed (smart-batched mass updates) and a global chat board for all users</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Social</strong> — add friends, view their profiles, compare your progress side by side, and browse their unit collection</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Mobile Support</strong> — fully responsive layout with a hamburger menu, optimized grids, and touch-friendly controls</span>
          </li>
        </ul>
      </section>

      {/* Changelog */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Changelog
        </h2>

        <ChangelogEntry
          version="0.9"
          date="March 24, 2026"
          items={[
            "Chat friend requests — hover a username in chat to add them as a friend or view their profile",
            "Smarter polling — reduced unnecessary background requests for activity, chat, and friend request counts",
            "Per-subchapter crown limits — ZL chapters now correctly show 1 or 2 crowns instead of 4",
          ]}
        />

        <ChangelogEntry
          version="0.8"
          date="March 2026"
          items={[
            "Unit comparison view — see what units friends have that you don't, filter by rarity and form level",
            "Friend unit collection browser — view a friend's full unit collection from their profile",
            "BCData auto-sync — unit names and legend stages update automatically from game data weekly",
          ]}
        />

        <ChangelogEntry
          version="0.7"
          date="March 2026"
          items={[
            "Mobile support — fully responsive layout with hamburger menu and touch-friendly controls",
            "Activity & Chat panel — slide-out drawer with a live activity feed and global chat",
            "NERV theme — optional Evangelion-inspired CRT terminal aesthetic in Settings",
          ]}
        />

        <ChangelogEntry
          version="0.6"
          date="March 2026"
          items={[
            "Unit Collection — browse 800+ cats with sprites, track form levels, filter by rarity/source/gacha set",
            "Milestones page — track Crazed, Manic, Advent stages, and Catclaw ranks",
            "Progress comparison — compare your overall stats and SoL subchapters with friends",
          ]}
        />

        <ChangelogEntry
          version="0.1"
          date="January 2026"
          items={[
            "Site launch — Story, Legend, Medals tracking and friend/compare system",
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
            Stage names, medal data, and unit sprites sourced from the{" "}
            <a
              href="https://battlecats.miraheze.org/wiki/Battle_Cats_Wiki"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-200"
            >
              Battle Cats Wiki
            </a>
            .
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
            <span className="text-gray-600 mt-0.5 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
