-- Ryan (2026-10-28): the Best of the Best Milestone Edition filter showed only
-- Metal Maiden Koneko; 20260928000001 tagged only her (#873).
-- Evidence: wiki "Best of the Best Milestone Edition (Gacha Event)" (v15.6) roster
-- = Metal Maiden Koneko (limited) + 14 Uber Super Rares + 11 non-collab Legend Rares.
-- Unit numbers matched by name against the seed (#s are in-game numbers):
--  Ubers: Nekoluga 34, Baby Cat 59, Oda Nobunaga 73, Thundia 76, Raiden 87,
--    The Grateful Crane 135, Nurse Cat 143, Catman 196, Mizli 360,
--    Mighty Thermae D-Lux 417, Adventurer Kanna 607, Mighty Carrowsell 674,
--    Pegasa 733, Victorious Skanda 811
--  Legend Rares: Musashi Miyamoto 448, Headmistress Jeanne 449 (wiki: "Jeanne"),
--    High Lord Babel 450, Ushiwakamaru 451, Wonder MOMOCO 455, Legeluga 461,
--    Mighty Kristul Muu 463, Lumina 478, Doktor Heaven 481, Gaia the Creator 493,
--    Kyosaka Nanaho 544
-- Additive banner tag only; setName untouched.
UPDATE "Unit"
SET "banners" = COALESCE("banners", ARRAY[]::TEXT[]) || ARRAY['Best of the Best Milestone Edition']
WHERE "unitNumber" IN (34,59,73,76,87,135,143,196,360,417,607,674,733,811,
                       448,449,450,451,455,461,463,478,481,493,544)
AND NOT ('Best of the Best Milestone Edition' = ANY(COALESCE("banners", ARRAY[]::TEXT[])));
