export default function AboutPage() {
  return (
    <div className="p-8 max-w-2xl space-y-10">

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
          You can track your Story, Legend, Medals, and Milestones, add friends, and compare where
          you both stand. More features are in the works.
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
            <span><strong className="text-gray-100">Milestones</strong> — check off Crazed Cats, Manic Cats, Advent stages, Catclaw ranks, and more</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-500">→</span>
            <span><strong className="text-gray-100">Social</strong> — add friends, view their profiles, and compare your progress side by side</span>
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
            <span><strong className="text-gray-300">Unit Collection</strong> — track which cats you own, their levels, and true form status, and compare with friends</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Activity Feed</strong> — see what your friends have been up to recently</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Profile Settings</strong> — update your display name and privacy preferences</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Better Compare</strong> — side by side progress for all story arcs, legend sagas, and medals</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gray-600">◦</span>
            <span><strong className="text-gray-300">Friend Chat</strong> — send messages to friends without leaving the site</span>
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
            Built by <strong className="text-gray-200">GeckMan</strong>. Started as a personal project to track progress and compare with friends.
          </p>
          <p>
            Stage names and medal data sourced from the{" "}
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
