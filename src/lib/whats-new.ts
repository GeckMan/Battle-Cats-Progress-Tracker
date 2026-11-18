/**
 * The one-time "What's new" pop-up shown to returning players (src/components/WhatsNew.tsx).
 *
 * To announce a future update: change `id` (any new string, e.g. the date) and the
 * text below. Everyone who logs in afterwards sees it once; dismissing it stores the
 * id on their account (User.seenUpdateId). Accounts created after `releasedAt` skip
 * it, since nothing "changed" for them.
 */
export const CURRENT_UPDATE = {
  id: "2026-11-18",
  releasedAt: "2026-11-18T00:00:00Z",
  title: "What's new on Battle Cats Progress",
  intro: "A big round of fixes and improvements landed. Here's what changed:",
  items: [
    "Faster everywhere: Unit filters switch instantly and unit images load much quicker.",
    "Better on phones: Legend and Story pages are readable with every crown button visible, Unit filters sit behind a Filters button, and you can press and hold a medal to see what it's for.",
    "Safer edits: bulk unit changes can be undone, and if a save fails you now get a message instead of a change that silently didn't stick.",
    "More up to date: new units, True/Ultra Forms, Zero Legends chapters and \"How to Obtain\" info now sync from the Battle Cats Wiki, so they appear soon after they're released in English.",
    "Privacy: setting your progress to Private now hides it everywhere, and you can remove friends or cancel friend requests.",
    "Smaller things: the chat badge no longer shows 99+ on every login, wrong passwords show a message, the NERV theme's fonts work again, and keyboard and screen-reader support is much better.",
  ],
  footer: "Full details are in the changelog on the About page. Thanks to everyone who reported bugs!",
} as const;
