export default function AboutPage() {
  return (
    <div className="p-8 max-w-2xl space-y-10">

      {/* ── Hero ───────────────────────────────────────────────── */}
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

      {/* ── What is this? ──────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          What is this?
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Battle Cats Progress is a personal tracker and social hub built for fans of The Battle Cats.
          The game doesn&apos;t offer a way to publicly share your progress or compare notes with friends —
          so this site fills that gap.
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Track your Story, Legend, Medals, and Milestones. Add friends, view their profiles, and compare
          where you both stand in the game. More features are on the way.
        </p>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Current Features
        </h2>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Story</strong> — Track cleared chapters, treasures, and zombie outbreaks across all three arcs.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Legend</strong> — Log your crown progress through Stories of Legend, Uncanny Legends, and Zero Legends.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Medals</strong> — See all Meow Medals and toggle which ones you&apos;ve earned. Auto-syncs with your tracked story/legend progress.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Milestones</strong> — Check off Crazed Cats, Manic Cats, Advent stages, Catclaw ranks, and more.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Social</strong> — Send friend requests, view friends&apos; progress, and compare stats side-by-side.</span>
          </li>
        </ul>
      </section>

      {/* ── Announcements ──────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Announcements
        </h2>

        <Announcement
          date="March 2026"
          title="Site Launch 🎉"
          body="Battle Cats Progress is live! Core tracking for Story, Legend, Medals, and Milestones is ready to use. Friend system and compare view are also available. More features coming soon."
        />
      </section>

      {/* ── Planned Features ───────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Coming Soon
        </h2>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Unit Collection</strong> — Track which cats you own, their levels, and true form status. Compare your collection with friends.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Activity Feed</strong> — See what your friends have been up to recently.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Profile Settings</strong> — Edit your display name and privacy preferences.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Better Compare</strong> — Side-by-side progress bars for all story arcs, all legend sagas, and medals.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Friend Chat</strong> — Send messages to friends without leaving the site.</span>
          </li>
        </ul>
      </section>

      {/* ── Credits ────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-100 border-b border-gray-800 pb-2">
          Credits
        </h2>
        <div className="text-sm text-gray-400 space-y-2">
          <p>
            Built by <strong className="text-gray-200">GeckMan</strong> — a fan project born out of wanting a better way to track progress and compare notes with friends.
          </p>
          <p>
            Game data (stage names, medal list) sourced from the{" "}
            <a
              href="https://battle-cats.fandom.com/wiki/Battle_Cats_Wiki"
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
