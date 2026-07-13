/**
 * gacha-event-names.ts — Curated JP-label → English-name mapping for
 * historical gacha event families detected by syncEventSets() in
 * sync-bcdata.ts.
 *
 * Why this exists: BCData has no structured English name for a gacha
 * banner anywhere (verified directly — no series/title/theme data file in
 * DataLocal or resLocal). syncEventSets() clusters units by real banner
 * debut history and can automatically extend an ALREADY-CURATED setName
 * from the database to new units in the same event, with zero translation.
 * But that only works if at least one member of the family already has a
 * name in the database. For a family where NO member is currently named,
 * this static table is consulted as a second-choice fallback before giving
 * up and flagging it for manual review.
 *
 * Provenance: keys are the exact cleaned label produced by
 * cleanBannerLabel() in sync-bcdata.ts, derived from parsing
 * DataLocal/GatyaDataSet{E,N,R}1.csv directly. Values were resolved by
 * cross-referencing each family's actual unit roster (names + known
 * franchise/theme) against two real wiki sources the user supplied on
 * 2026-07-10: a printout of https://battlecats.miraheze.org/wiki/Event_Schedule
 * (current/upcoming events) and https://battlecats.miraheze.org/wiki/Template:Gacha_Events
 * (a comprehensive navbox of essentially every gacha event name, categorized
 * by type). A few names (noted below) come from general Battle Cats
 * community knowledge rather than that navbox, since it doesn't include
 * every very old/delisted collab.
 *
 * IMPORTANT — every value here was cross-checked on 2026-07-11 against the
 * full pre-existing setName catalog already live in the database (from the
 * old hardcoded migrations that seeded the original ~60 curated sets), and
 * adjusted to match verbatim wherever the same real franchise already had a
 * name. Skipping that check the first time around silently created ~30
 * near-duplicate names (e.g. "Merc Storia" here vs "Merc Storia
 * Collaboration" already live) that would have fragmented a single real
 * event into two different `banners`/`setName` values — the exact same
 * shape of bug this whole table exists to fix. Any NEW name added to this
 * file in the future should be checked against the live setName list
 * first (or against this file, which now mirrors it) before assuming a
 * franchise has no existing entry.
 *
 * Deliberately excludes anything that couldn't be resolved with real
 * confidence rather than guessed — see the "still unresolved" list at the
 * bottom of this file for what's missing and why.
 *
 * Only ever used to fill a currently-null setName — never overwrites
 * existing data. Safe to extend over time as new families get resolved.
 */
export const GACHA_EVENT_NAMES: Record<string, string> = {
  メルクストーリア: "Merc Storia Collaboration",
  伝説のネコルガ族: "Tales of the Nekoluga",
  伝説のネコルガ: "Tales of the Nekoluga",
  Fateコラボガチャ: "Fate/Stay Night Collaboration",
  // Both debut waves of the same real Evangelion collab — kept under one
  // name to match the already-live "Neon Genesis Evangelion Collaboration"
  // rather than letting the later rerun fragment into its own bucket.
  エヴァンゲリオン: "Neon Genesis Evangelion Collaboration",
  エヴァ新世紀: "Neon Genesis Evangelion Collaboration",
  魔法少女まどかマギカ: "Puella Magi Madoka Magica Collaboration",
  // Fixed 2026-07-13 (full-audit find): "Bikkuriman Collaboration" was the
  // ORIGINAL label from the March migrations, but 20260712000012 confirmed
  // "Bikkuriman Chocolate Capsules" is the real canonical name (checked
  // directly against the live app's Sets dropdown) and the whole bulk
  // roster (466-473, 544, 555, 556, 762) got migrated to match in
  // 20260713000007. Using the old label here would have silently
  // re-fragmented the set the next time a new Bikkuriman unit debuts.
  ビックリマン: "Bikkuriman Chocolate Capsules",
  ビックリマンコラボ: "Bikkuriman Chocolate Capsules",
  メタルスラッグディフェンス: "Metal Slug Defense Collaboration",
  // Not in the current wiki navbox (likely delisted after the license
  // lapsed), but this is the real, well-documented Capcom crossover —
  // roster is the classic Sengoku Basara warlord cast (Uesugi Kenshin,
  // Date Masamune, Takeda Shingen, Oda Nobunaga, etc). Distinct from
  // "Sengoku Wargods Vajiras", an unrelated Ponos-original in-house set
  // that's already a separate, real entry in the live database.
  戦国武神バサラーズ: "Sengoku Basara",
  バサラーズ: "Sengoku Basara",
  電脳戦隊ギャラクシーギャルズ: "Cyber Academy Galaxy Gals",
  ダークヒーローズ: "Justice Strikes Back! Dark Heroes",
  超激ダイナマイツセット: "The Dynamites",
  "ダイナマイツ＋４キャラ": "The Dynamites",
  // "The Almighties" is the real gacha-event home (per the wiki's dedicated
  // page) of Thunder God Zeus, Anubis the Protector, Radiant Aphrodite,
  // Shining Amaterasu, Splendid Ganesha, Wrathful Poseidon, Empress Chronos,
  // Hades the Punisher, Lucifer the Fallen, Lightmother Aset, Victorious
  // Skanda, and Gaia the Creator — confirmed beyond doubt by their own
  // third evolved forms literally being named "Almighty <name>" (see
  // 20260303000022_add_form_names). It is NOT the home of Black Zeus,
  // Daybreaker Izanagi, Izanami of Dusk, Raclesa the Lioness, or Squire
  // Luno, despite 20260303000026 briefly mislabeling those five this way —
  // see sync-bcdata.ts's syncBannerMembership doc comment for the full
  // three-pass story (2026-07-11) of getting this right.
  究極降臨ギガントゼウス: "The Almighties",
  ギガントゼウス: "The Almighties",
  // Consolidated with the later rerun (see "ストファイ" below) under the
  // same name already live in the database, rather than inventing a
  // separate "V" / "Event" suffixed variant that would fragment the set.
  "415  ストリートファイターⅤ": "Street Fighter Collaboration",
  "ケリ姫ガチャ(元3.4.0。4.6.0:バナー画像追加改修）": "Princess Punt Sweets Collaboration",
  ケリ姫ガチャ: "Princess Punt Sweets Collaboration",
  超古代勇者ウルトラソウルズ: "Ancient Heroes Ultra Souls",
  ハロウィン: "Halloween Capsules",
  サマーガールズ: "Gals of Summer",
  サマーガールズブルーオーシャン: "Gals of Summer Blue Ocean",
  サマーガールズサンシャイン: "Gals of Summer Sunshine",
  革命軍隊アイアンウォーズ: "Frontline Assault Iron Legion",
  アイアンウォーズ汎用: "Frontline Assault Iron Legion",
  実況パワフルプロ野球: "Power Pro Baseball Collaboration",
  // Fixed 2026-07-13 (full-audit find): both of these used their original
  // March-migration label, but the project's own code already treats
  // "Rurouni Kenshin Gacha" / "Baki Hanma Capsules" as canonical elsewhere
  // (BCU_KNOWN_COLLAB_CATEGORIES in sync-bcdata.ts and
  // fetch-collab-verification-pages.ts) -- confirmed via Kaoru Cat (#753)
  // and Li'l Baki (#795), each independently assigned the "canonical" name
  // in a later migration while the bulk roster stayed on the old one. Bulk
  // rosters (746-752, 789-794) migrated to match in 20260713000007.
  るろ剣: "Rurouni Kenshin Gacha",
  刃牙コラボ: "Baki Hanma Capsules",
  刃牙: "Baki Hanma Capsules",
  ねこのなつやすみ: "Summer Break Cats",
  ねこなつサバイバル編: "Summer Break Cats Castaway",
  ねこなつパラダイス編: "Summer Break Cats Paradise",
  // Matches the already-live "YuruDora Collaboration" — same franchise
  // (ゆるドラシル / "Yuru Dora Shiru"), different English rendering chosen
  // independently the first time around; aligned to avoid a duplicate.
  ゆるドラシル: "YuruDora Collaboration",
  ガルズモンズ: "Girls & Monsters: Angels of Terror",
  ギャルモン9体目: "Girls & Monsters: Angels of Terror",
  大精霊エレメンタルピクシーズ: "Nature's Guardians Elemental Pixies",
  エレメントピクシーズ: "Nature's Guardians Elemental Pixies",
  ソニック: "Sonic the Hedgehog Collaboration",
  モンハン大狩猟クエスト: "Monster Hunter",
  箱の中身クイズ: "What's in the Box",
  トキメキにゃんこ学園: "Heartbeat Catcademy",
  // Matches the already-live "June Bride" exactly — this is literally
  // Hanzo the Betrothed's family, the very first bug reported this
  // session ("hanzo is under the June Bride gacha event"). An earlier
  // draft of this table used an invented "June Bride of the Devil" name
  // for it, which would have fragmented Hanzo away from the rest of the
  // June Bride set instead of fixing the original report.
  悪魔のジューンブライド: "June Bride",
  // "Xmas Gals" reuses the same cast as "Gals of Summer" in winter
  // reskins (Coppermine, Kuu, Kai appear in both families) — same
  // parallel-series pattern, not just a name guess.
  クリスマス: "Xmas Gals",
  クリスマスギャルズ: "Xmas Gals",
  春: "Easter Carnival",
  消滅都市: "Shoumetsu Toshi Collaboration",
  消滅都市2: "Shoumetsu Toshi Collaboration",
  "消滅都市0.": "Shoumetsu Toshi Collaboration",
  超破壊大帝ドラゴンエンペラーズ: "Lords of Destruction Dragon Emperors",
  エンペラーズ: "Lords of Destruction Dragon Emperors",
  "10周年メモリアル": "10th Memorial",
  "生きろ！マンボウ！": "Survive! Mola Mola! Collaboration",
  クラッシュフィーバー: "Crash Fever Collaboration",
  神魔の塔: "Tower of Saviors Collaboration",
  // Medium confidence — not a literal translation ("wanwan anniversary"),
  // but the sole member (Medal King) and the raw label's parenthetical
  // "(legendary small medal)" both point clearly at this event.
  わんわんアニバーサリー: "Medal King's Palace",
  "拡散性ミリオアーサー、ニムエ": "Million Arthur Collaboration",
  "ドラゴンポーカー、猿王": "Dragon Poker Collaboration",
  // Matches the already-live "Red Busters" / "Metal Busters" anti-element
  // buster sets exactly — same real concept as the migration-seeded
  // buckets, just reached here via debut-clustering instead.
  レッドバスターズ: "Red Busters",
  メタルバスターズ: "Metal Busters",
  "2016年末": "Year's End Bash",
  ぐでたま: "Gudetama Collaboration",
  JRA: "JRA",
  春節イベント: "Lunar New Year's Capsules",
  海外版春節イベント: "Lunar New Year's Capsules",
  ホワイトデー: "White Day Capsules",
  // Confirmed via the wiki's "Lucky Capsule" page: its full 9-unit roster
  // (Li'l Cat, Li'l Tank/Axe/Gross/Cow/Bird/Fish/Lizard/Titan Cat) exactly
  // matches these two BCData families combined (6 + 3 members).
  にゃんこ福引: "Lucky Capsule",
  "2016にゃんこ福引": "Lucky Capsule",
  // Confirmed via the wiki's "Best of the Best Milestone Edition" page:
  // Koneko is the event's single new "(Limited)" Uber Rare — every other
  // unit in that banner's roster is a pre-existing character from earlier
  // events, matching this BCData family's single-member size exactly.
  DL記念選抜ガチャ: "Best of the Best Milestone Edition",
  // These 3 labels turned out to be TWO separate evergreen anniversary
  // series, not one — confirmed via exact/root Japanese name matches on
  // the wiki, each pinned down by its own Limited Uber Rare debut pair,
  // and both names match the already-live database entries exactly:
  // "NEO Best of the Best" is 極選抜祭レアガチャ (Goku Senbatsusai Gacha)
  // and debuts Li'l Valkyrie Dark + Agent Staal — an exact match for the
  // "極選抜祭" label. "Best of the Best" (no NEO) is 超選抜祭ガチャ (Chō
  // Senbatsusai Gacha) and debuts Li'l Valkyrie + Trixi the Merc — a root
  // match for "超選抜祭", present in both the "みんなが選んだ" (everyone's
  // choice / domestic) and "海外版" (overseas version) sub-labels.
  極選抜祭: "NEO Best of the Best",
  みんなが選んだ超選抜祭: "Best of the Best",
  海外版超選抜祭: "Best of the Best",
  // Per direct user confirmation (2026-07-11): Baby Gao Cat's family
  // belongs to Uber Fest, Shadow Gao Cat's family belongs to Epic Fest.
  // The live database's existing values for these are the raw literal
  // codes 'UBERFEST'/'EPICFEST' (ALL CAPS) — a companion migration renames
  // those to this same clean "Uber Fest"/"Epic Fest" form so this doesn't
  // create a second, differently-cased duplicate bucket.
  超ネコ祭: "Uber Fest",
  極ネコ祭: "Epic Fest",
  // Confirmed via the wiki's "Ancient Heroes ULTRA SOULS" page: Hanasaka
  // Cat is directly in its Uber Rare roster. This is an abbreviated banner
  // label for the same event as "超古代勇者ウルトラソウルズ" above.
  ウルトラ: "Ancient Heroes Ultra Souls",
  // Confirmed via the wiki's "Cat Release Order" page (ground truth,
  // covers every unit ID with its actual obtaining method): IDs 826-829
  // are Cammy, Juri, Zangief Cat, and Jamie Cat, all obtained via "Street
  // Fighter Collaboration" — matches the already-live database name
  // exactly, and is treated as the same bucket as the base 2019 roster
  // above ("415  ストリートファイターⅤ") rather than a separate variant.
  ストファイ: "Street Fighter Collaboration",
};

/**
 * Families investigated but deliberately left unresolved — flagged by
 * checkEventSetCoverage-style logging instead of guessed at. Documented
 * here so the next person (or Claude) doesn't redo this research from
 * scratch:
 *
 * - "にゃんパズル＆ねば～る君" (old puzzle-game tie-in promo): not present
 *   in the current wiki navbox at all — likely delisted long ago.
 */
