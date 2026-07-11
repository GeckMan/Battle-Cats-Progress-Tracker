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
 * Deliberately excludes anything that couldn't be resolved with real
 * confidence rather than guessed — see the "still unresolved" list at the
 * bottom of this file for what's missing and why.
 *
 * Only ever used to fill a currently-null setName — never overwrites
 * existing data. Safe to extend over time as new families get resolved.
 */
export const GACHA_EVENT_NAMES: Record<string, string> = {
  メルクストーリア: "Merc Storia",
  伝説のネコルガ族: "Tales of the Nekoluga",
  伝説のネコルガ: "Tales of the Nekoluga",
  Fateコラボガチャ: "Fate/Stay Night: Heaven's Feel",
  エヴァンゲリオン: "Neon Genesis Evangelion",
  エヴァ新世紀: "2nd Neon Genesis Evangelion Gacha",
  魔法少女まどかマギカ: "Madoka Magica",
  ビックリマン: "Bikkuriman",
  ビックリマンコラボ: "Bikkuriman",
  メタルスラッグディフェンス: "Metal Slug",
  // Not in the current wiki navbox (likely delisted after the license
  // lapsed), but this is the real, well-documented Capcom crossover —
  // roster is the classic Sengoku Basara warlord cast (Uesugi Kenshin,
  // Date Masamune, Takeda Shingen, Oda Nobunaga, etc). Distinct from
  // "Sengoku Wargods Vajiras", an unrelated Ponos-original in-house set.
  戦国武神バサラーズ: "Sengoku Basara",
  バサラーズ: "Sengoku Basara",
  電脳戦隊ギャラクシーギャルズ: "Cyber Academy Galaxy Gals",
  ダークヒーローズ: "Justice Strikes Back! Dark Heroes",
  超激ダイナマイツセット: "THE DYNAMITES",
  "ダイナマイツ＋４キャラ": "THE DYNAMITES",
  究極降臨ギガントゼウス: "The Almighties The Majestic Zeus",
  ギガントゼウス: "The Almighties The Majestic Zeus",
  // Base 2019 roster only (Akuma/Ryu/Chun-Li/Guile/Zangief/Blanka/Dhalsim/
  // Ken) — NOT the 2021 "Champion Edition" rerun, which split new units
  // across a separate Red Team/Blue Team, and which this table
  // deliberately does not attempt to resolve (see bottom of file).
  "415  ストリートファイターⅤ": "Street Fighter V Collaboration Event",
  "ケリ姫ガチャ(元3.4.0。4.6.0:バナー画像追加改修）": "Princess Punt Sweets",
  ケリ姫ガチャ: "Princess Punt Sweets",
  超古代勇者ウルトラソウルズ: "Ancient Heroes ULTRA SOULS",
  ハロウィン: "Halloween Capsules",
  サマーガールズ: "Gals of Summer",
  サマーガールズブルーオーシャン: "Gals of Summer Blue Ocean",
  サマーガールズサンシャイン: "Gals of Summer Sunshine",
  革命軍隊アイアンウォーズ: "Frontline Assault IRON LEGION",
  アイアンウォーズ汎用: "Frontline Assault IRON LEGION",
  実況パワフルプロ野球: "Power Pro Baseball",
  るろ剣: "Rurouni Kenshin",
  刃牙コラボ: "Baki Hanma",
  刃牙: "Baki Hanma",
  ねこのなつやすみ: "Summer Break Cats",
  ねこなつサバイバル編: "Summer Break Cats Castaway",
  ねこなつパラダイス編: "Summer Break Cats Paradise",
  ゆるドラシル: "Yurudrasil",
  ガルズモンズ: "Girls & Monsters: Angels of Terror",
  ギャルモン9体目: "Girls & Monsters: Angels of Terror",
  大精霊エレメンタルピクシーズ: "Nature's Guardians ELEMENTAL PIXIES",
  エレメントピクシーズ: "Nature's Guardians ELEMENTAL PIXIES",
  ソニック: "Sonic the Hedgehog",
  モンハン大狩猟クエスト: "Monster Hunter",
  箱の中身クイズ: "What's in the Box",
  トキメキにゃんこ学園: "Heartbeat Catcademy",
  悪魔のジューンブライド: "June Bride of the Devil",
  // "Xmas Gals" reuses the same cast as "Gals of Summer" in winter
  // reskins (Coppermine, Kuu, Kai appear in both families) — same
  // parallel-series pattern, not just a name guess.
  クリスマス: "Xmas Gals",
  クリスマスギャルズ: "Xmas Gals",
  春: "Easter Carnival",
  消滅都市: "Shoumetsu Toshi",
  消滅都市2: "Shoumetsu Toshi",
  "消滅都市0.": "Shoumetsu Toshi",
  超破壊大帝ドラゴンエンペラーズ: "Lords of Destruction DRAGON EMPERORS",
  エンペラーズ: "Lords of Destruction DRAGON EMPERORS",
  "10周年メモリアル": "10th Memorial",
  "生きろ！マンボウ！": "Survive! Mola Mola!",
  クラッシュフィーバー: "Crash Fever",
  神魔の塔: "Tower of Saviors",
  // Medium confidence — not a literal translation ("wanwan anniversary"),
  // but the sole member (Medal King) and the raw label's parenthetical
  // "(legendary small medal)" both point clearly at this event.
  わんわんアニバーサリー: "Medal King's Palace",
  "拡散性ミリオアーサー、ニムエ": "Million Arthur",
  "ドラゴンポーカー、猿王": "Dragon Poker",
  レッドバスターズ: "RED BUSTERS",
  メタルバスターズ: "METAL BUSTERS",
  "2016年末": "Year's End Bash",
  ぐでたま: "Gudetama",
  JRA: "JRA",
  春節イベント: "Lunar New Year",
  海外版春節イベント: "Lunar New Year",
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
  // the wiki, each pinned down by its own Limited Uber Rare debut pair:
  // "NEO Best of the Best" is 極選抜祭レアガチャ (Goku Senbatsusai Gacha)
  // and debuts Li'l Valkyrie Dark + Agent Staal — an exact match for the
  // "極選抜祭" label. "Best of the Best" (no NEO) is 超選抜祭ガチャ (Chō
  // Senbatsusai Gacha) and debuts Li'l Valkyrie + Trixi the Merc — a root
  // match for "超選抜祭", present in both the "みんなが選んだ" (everyone's
  // choice / domestic) and "海外版" (overseas version) sub-labels.
  極選抜祭: "NEO Best of the Best",
  みんなが選んだ超選抜祭: "Best of the Best",
  海外版超選抜祭: "Best of the Best",
};

/**
 * Families investigated but deliberately left unresolved — flagged by
 * checkEventSetCoverage-style logging instead of guessed at. Documented
 * here so the next person (or Claude) doesn't redo this research from
 * scratch:
 *
 * - "ストファイ" (a later Street Fighter rerun, unit IDs 826-829 in the
 *   14.7.0 snapshot available): the user supplied the actual wiki pages
 *   for both team rosters, which confirmed the full current lineup —
 *   Blue Team: Blanka, Dhalsim, Ken, E. Honda, Sagat, M. Bison, Luke, Juri
 *   (+ Akuma); Red Team: Ryu, Chun-Li, Guile, Zangief, Balrog, Vega,
 *   Sakura, Cammy (+ Akuma). That also confirms Vega genuinely belongs to
 *   Street Fighter Red Team (resolves the "Lady of Deception Vega" report
 *   from Reddit as correct data, not a bug — her evolved form under that
 *   name is presumably the same base Vega unit here). Still couldn't map
 *   BCData's 826-829 to these specific names though, since the 14.7.0
 *   snapshot has them unnamed — likely predates this particular rerun
 *   entirely (Champion Edition-era Street Fighter characters like Luke/
 *   Juri/Cammy are recent). Needs an actual sync against live/current
 *   BCData to resolve, not something a wiki printout can fix.
 * - "にゃんパズル＆ねば～る君" (old puzzle-game tie-in promo): not present
 *   in the current wiki navbox at all — likely delisted long ago.
 * - "超ネコ祭" / "極ネコ祭" (Baby Gao / Shadow Gao festival pair): no
 *   confident match found.
 * - "ウルトラ" (single member: Hanasaka Cat): too ambiguous a label on its
 *   own to confidently tie to Ultra Souls or an Ultra Selection event.
 */
