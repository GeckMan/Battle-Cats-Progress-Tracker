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

      {/* Announcements */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Announcements
        </h2>

        <Announcement
          date="March 2026"
          title="Friend unit collection viewer"
          body="You can now browse a friend's unit collection from their profile page. See which cats they've obtained and at what form level, with the same filters and sprite display as your own collection. Fully read-only — no editing their progress."
        />

        <Announcement
          date="March 2026"
          title="Mobile support"
          body="The site is now fully responsive. On phones and tablets, the sidebar collapses into a hamburger menu, grids reflow to fit your screen, and tables scroll horizontally. Everything works on the go."
        />

        <Announcement
          date="March 2026"
          title="Activity & Chat panel"
          body="The activity feed and a new global chat are now in a slide-out panel on the right side of the screen. Click the Activity & Chat button in the top-right corner to open it. Mass updates are auto-summarized and chat is visible to all users."
        />

        <Announcement
          date="March 2026"
          title="Unit Collection launched"
          body="Browse all 800+ cats with wiki sprites, track which ones you own and their form level, and filter by rarity, unlock source, or gacha set. Unit progress now counts toward your overall completion percentage."
        />

        <Announcement
          date="March 2026"
          title="Milestones page added"
          body="You can now track Crazed Cats, Manic Cats, Advent stages, and Catclaw milestones from the new Milestones page in the nav."
        />

        <Announcement
          date="January 2026"
          title="Site launch"
          body="Battle Cats Progress is live. Story, Legend, Medals, and the friend/compare system are all up and running. More stuff coming as time allows."
        />
      </section>

      {/* Coming Soon */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Coming Soon
        </h2>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Profile Settings</strong> — update your display name and privacy preferences</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Better Compare</strong> — side by side progress for all story arcs, legend sagas, and medals</span>
          </li>
        </ul>
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

function Announcement({
  date,
  title,
  body,
}: {
  date: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border border-gray-700 rounded-lg p-4 bg-black space-y-1">
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-500">{date}</span>
        <span className="text-sm font-semibold text-gray-100">{title}</span>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{body}</p>
    </div>
  );
}
