# Completed — shops

> **Verified clean** (48) — bounded no-mismatch checks. Skip re-auditing unless scope changes.

- **Ordan Ore seller owner and stock route (shop 1260; NPC 1560):** Active `server/data/definitions/shops.json:263` matches exact `READ-ONLY-DB/docs/shops-items-by-shop.json:22896-22950` for shop identity, Coins currency, seven ore IDs/order, stock 100, and restock interval 200; exact owner/action rows in `docs/shops-by-npc.json:661-668` and `docs/npcs-interactions.json:10236-10244` agree on Ordan/1560/Trade slot 3. Active spawn `npc-spawns.json:23074` establishes reachability; shop definitions route through `NpcInteractionManager.ts:87-99` to `ShopManager.open()` and runtime stock initialization (`ShopManager.ts:375-410`). DB `sells_at`/`buys_at`/`change_per` are not represented in the active shop model; that loss is already covered by AUD-015, so no duplicate is raised. No new mismatch in the bounded ownership/action/stock slice. Static trace only; no transaction, tests/builds, or source/DB changes.

---

- **Ardougne Gem Stall owner and stock route (shop 1017; NPCs 4581/8723):** Active `server/data/definitions/shops.json:20` and exact DB `READ-ONLY-DB/docs/shops-items-by-shop.json:1671-1712` agree on shop identity, owners 4581/8723, Trade slot 3, and configured stock/restock for Sapphire 1607 (2/15000), Emerald 1605 (1/35000), and Ruby 1603 (1/60000); the DB also lists unstocked Diamond 1601 (0/4000), absent from active original stock. NPC 8723 has an active spawn (`npc-spawns.json:2286`); NPC 4581 also has active spawns (including `:18718`). Exact DB interaction key 8723 exposes Trade slot 3; 4581 has no exact NPC interaction entry, and the DB's shop-by-NPC record marks its action source/slot unknown. Active shoploader and Shopkeepers plugin bind both IDs' configured slot 3 to shop 1017; the selected revision-241 cache-derived live actions for NPC 4581 were not decoded, so no cache-action claim is made for that ID. `NPCOptionPacketListener.ts:24-60,63-98`, `NpcInteractionManager.ts:81-99`, and `ShopManager.ts:147-162,568-630` trace a configured Trade click into the shop and generic stock/currency/inventory transaction path. Exact item records `READ-ONLY-DB/docs/items-json/{1607,1605,1603}.json` confirm item identities only; pricing is excluded under AUD-015. The zero-stock Diamond DB row is not treated as a mismatch because no active stock entry is configured. No discrepancy in the bounded active owner binding and three stocked-item/restock values; absent cache-byte action decode is an explicit scope limit.

---

- **Warriors’ Guild Sloane token-claim action (NPC 13616):** Exact `READ-ONLY-DB/docs/npcs-interactions.json:75402-75410` gives slot 3 `Claim-Tokens`; active spawn `server/data/definitions/npc-spawns.json:13545` places ID 13616 in the Guild. `Tokens.WarriorsGuild.js:23-28,38-50,113-122` registers the name/action and includes the Sloane identifier in the shared staff map; `Common.WarriorsGuild.js:25-36,41-61` maps it to Sloane 13616 and reads/pays/clears the persisted token ledger. The ordinary NPC listener dispatches the click slot and then emits active name/action hooks (`NPCOptionPacketListener.ts:24-25,43-51,63-98`); NPC definitions hydrate ordered actions from cache (`NpcDefinition.ts:70-83`). No handler mismatch was found in this slice. The exact selected-cache action list for NPC 13616 was not independently decoded, so slot parity is not claimed as observed. Excludes other Guild options and token accrual; duplicate screen found only separate Gamfred Claim-Shield review (`05_Audit_Log.md:297`). Static bounded trace, no live interaction/tests/builds or TSPS/DB edits.

---

- **Ardougne Silver Stall owner/stock and purchase route (shop 1018; NPC 8722):** Active shop row matches exact DB shop owner/action, currency, IDs 1714/442/2355, stock and restock values. Exact DB interaction key exposes Trade slot 3 and active spawn establishes reachability. Shopkeeper and NPC dispatch route to ShopManager, which caps quantity by request/funds/stock/free slots before stock/currency/inventory mutation. Price parity is excluded under AUD-015; NPC 4582 action reachability is unresolved and not asserted. Bounded route/stock transaction review only; no live purchase/tests/builds or source/DB edits.

---

- **Aaron's Archery Appendages (shop 1000) ↔ Armour salesman 6059 owner binding agrees (Trade optionSlot 3 click) — active shops.json vs DB shops-items-by-shop and shops-by-npc:** Active shops.json id 1000 currency COINS npcInteractions [{npcIds:[6059],optionSlot:3}] vs READ-ONLY-DB shops-items-by-shop owners [{name Armour salesman, npc_ids [6059], option Trade, slot3, source click}] and shops-by-npc 6059 mirror; Runtime via ShopDefinitionLoader + Shopkeepers.plugin registerNpcInteraction; dialogue open_shop liv2fs confirms. Single-shop bounded agreement. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 1000, 6059, 3.

---

- **Edgeville Lever (3090,3475) Pull -> Deep Wilderness (3153,3923) via ObjectActionPacketListener -> lever:teleport -> TeleportHandler Infinity bypass correctly retains teleblock/busy checks:** ObjectActionPacketListener clickType->option emitObjectRoute->walkToObject; Misthalin/Wilderness lever Pull emits lever:teleport; Levers.plugin checks reqs with Infinity (bypass wilderness level) then TeleportHandler teleport NORMAL 3 ticks; TeleportType LEVER unused. Diary task use-the-ardougne-lever separate lever 3090,3956. Clean bounded lever route. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 3090, 3475, 3153, 3923.

---

- **Melee max hit formula fidelity (effectiveLevel prayer+stance+8 -> void floor -> BonusManager strength+64) verified for whip 4151 / dragon scimitar 4587 / bandos chestplate 11832 strength bonuses:** DamageFormulas effectiveStrengthLevel + calculateMaxMeleeHit floor((eff*(bonus+64)+320)/640) + BonusManager STRENGTH bonuses[10] + Void melee void floor(level*110/100) before multiply. DB 4151 melee_strength82==active bonuses[10]82 match; 4587 66 match with attack_stab 8 etc; 11832 4 match. Integer order preserved. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 4151, 4587, 11832.

---

- **Burthorpe Supplies 1055 ↔ Wistan 4106 Trade slot 3 click binding agrees active ↔ DB triple (shops-items-by-shop 5777 + shops-by-npc + npcs-interactions) clean:** Active shops.json 1055 COINS 11 rows npcInteractions [4106 slot3] vs DB shops-items-by-shop Burthorpe Supplies owners Wistan 4106 Trade slot3 click + 11 identical items 1931-1980 + shops-by-npc 4106 + npcs-interactions 4106 Talk-to/Trade; Runtime Shopkeepers.plugin CLICK_FIELDS thirdClick -> registerNpcInteraction 4106:3 shop 1055; loader ShopDefinitionLoader 131-150 preserves stock; spawn 2928,3546 reachable. Second shop/NPC sample distinct from Aaron 1000. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1055, 4106, 1931, 1980.

---

- **Door 1535 DOOR_24 Lumbridge closed → 1536 open ephemeral toggle (Doors.plugin 500 ticks) + catalog + ObjectManager/MapObjects reapply clean:** Doors.plugin DOOR_AUTO_CLOSE_TICKS 500, buildDoorCatalog auto-pairs 1535->1536 same-name id+1, handleMappedDoor swap with offset/rotation, OPEN_OBJECT_STATES Map + Task autoClose 500, reapplyOpenDoorsForRegion on region load; ObjectManager register/deregister baseMap/mapOriginal + MapObjects hash + RegionManager clipping; ObjectIdentifiers DOOR_24/25, DB objects-summary 1535/1536 both named Door closed-state parity; pair not hard-coded. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1535, 1536, 500, 1533.

---

- **Falador teleport SpellTeleports falador teleport 2964,3378,0 NORMAL 37/48 rune pouch + TeleportHandler 3-tick Infinity bypass path clean (distinct from lever Infinity 3090,3475):** SpellTeleports 49-54 teleport NORMAL 37 48 [563,556x3,555] 2964,3378 + handleSelf via CacheDefinitions getSpellName 340-364 + NetworkBuilder IF_BUTTON 550-553 widget 1151 -> Spell.canCast 74-159 level/book/rune-pouch/Staff check -> TeleportHandler checkReqs 80-130 busy/wild20/teleblock/movement/area + TeleportTask 14-50 NORMAL 3 ticks anim 714->715 gfx308 varbit12393; NativeClientPackets 33-45 IF_BUTTON opcodes len8/10 mirrored; DB no teleport table, Wiki authoritative dest/level. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 2964, 3378, 37, 48.

---

- **Ranged max hit formula void+salve integer order clean — effectiveRange prayer/style+8 -> void floor -> (eff*(bonus+64)+320)/640 -> salve/slayer/dragon hunter floor per modifier:** DamageFormulas 1-356 effectiveRangedStrength + maxHit + EquipmentEffects 52-120 CombatEffectiveLevelModifiers/RangedHitModifiers scale floor guard + BonusManager 7-75 RANGED_STRENGTH 11 summed + Salve 1-62 7/6|6/5 + Void 1-55 elite 1125/1000 floor + SlayerHelmet imbued 23/20 + DragonHunter crossbow 5/4 + GearChecks scale floor(value*numer/denom); DB 20997 twisted bow ranged_strength20 + 19481 heavy ballista 15 identities only; Wiki/DPS integer order mirrored. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 20997, 19481, 11, 145.

---

- **Fossil Island General Store 1134 ↔ 7769 Trade slot3 10-item COINS stock 5/10..15/10 triple parity clean (Mairin 1453 clean; Pete 1457 18 vs 14 noted infinite divergence not new per AUD-015):** Active shops.json 1134 10 stock 1931 5/10 etc npcInteractions 7769 slot3 vs DB shops-items-by-shop 12221 10 identical sell1300 buy400 change30 owner 7769 slot3 + shops-by-npc 7769/7776/7784 + npcs-interactions 7769 Talk-to/Trade + spawns 7769 Museum Camp + Mairin 1453 MERMAID'S TEAR 6x100 identical + Pete 1457 VOLCANIC MINE POINTS 18 vs DB 14 infinite sentinel; ShopDefinitionLoader 99-183 normalizeAmount infinite + ShopManager 1-103 currencyHandlers/restockAll; AUD-015 covers pricing metadata, dup-screen 0 hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1134, 7769, 1453, 1457, 1931.

---

- **Void mage helm 11663 0 attack/magic bonuses via BonusManager correct by design — Void power via VoidEquipment effective-level 145% magic acc + magic damage +50 elite floor via EquipmentEffects not bonus array double-count clean:** DB items-json 11663 Void mage helm Normal attack 0 defence 6x5 magic_damage 0.0 slot head req 42/22 + 11664/11665 siblings 8839 top def45 8840 robe def30 8842 gloves 0; BonusManager BONUS_COUNT14 STRENGTH1 MAGIC_STRENGTH2 update sums getBonuses[11] ammo/crystal-bow void items 0; VoidEquipment voidSet head HELMS+ hands GLOVES+body TOP+legs ROBE 4 cosmetics normal/elite effectiveLevel magic floor(lvl*145/100) ranged elite 1125/1000 melee 110/100 magicDamageBonus elite +50 permille registerCombatEffectiveLevelModifier/MagicDamageBonus; AccuracyFormulas effectiveMagicLevel + DamageFormulas applyMagicDamageBonus via EquipmentEffects integer floor; smoke oracle 578LOC proves no double-count. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 11663, 11664, 8839, 8840, 8842.

---

- **Slayer shops 1324 Equipment COINS Enchanted gem 4155x50 slot4 + 1463 Rewards SLAYER_POINTS 20 IDs slot5 binding + currency handler vs DB shops triple parity clean (tail 2-item Rewards drift noted not filed):** Active shops.json 1324 COINS stock 4155x50 Enchanted gem slot4 + 1463 SLAYER_POINTS 6 infinite 11866/11875/4160/13226/12791/11941 slot5 vs DB shops-items-by-shop 27612 Equipment 13 owners Trade slot4 26 items 4155x50 + 27891 Rewards 13 owners Rewards slot5 tail differs 30692/22586 vs active 2 IDs + shops-by-npc Trade4/Rewards5 per variant + import-osrs-shops CURRENCY_OVERRIDES Points->SLAYER_POINTS + Slayer.plugin currency handler + AnyNpcInteraction transforms + tests shops-data/slayer-assign contain 7663 Krystilia; Tail drift informational not candidate pending per one-root hold. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1324, 1463, 4155, 11866, 12791.

---

- **Warriors Guild Armoury 1370 Anton 2471 Trade slot3 + Food 1371 Lidio 2469 + Potion 1372 Lilly 2470 triple parity 38-item stock exact match clean (Food/Potion siblings also triple verified):** Active shops.json 1370 Armoury COINS 38 stock 1363..1141 npcInteractions Anton2471 slot3 + 1371 Food Lidio2469 +1372 Potion Lilly2470 vs DB shops-items-by-shop 33126 Armoury sells1200 buy600 change20 currency coins owners Anton 2471 Trade slot3 38 items exact order + shops-by-npc 2471 Anton Armoury Trade3 + npcs-interactions 2471 Talk-to/Trade warguild_armour_shopkeeper + npc-spawns Anton 2855,3536 L1 Lidio/Lilly floor0 + npc-dialogue-index variants + shop-owners Wiki + Shopkeepers plugin builds Map npcId:slot -> shopId thirdClick; no Warriors Guild override in custom-shops; parity clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1370, 2471, 2469, 2470, 1363.

---

- **Canifis 4 shops 1036 Barkers 6524 + 1144 General 6525 + 1156 Hair of Dog 6527 + 1304 Rufus 546/6478 + shared 1324 Slayer Equipment Mazchna 13620 byte-parity identity/owner slot3/trade stock/currency clean (infinite 2B vs infinite semantic parity):** Active shops.json 485 entries Canifis subset 1036 Barkers 6524:3 30 rows + 1144 General 6525:3 12 rows + 1156 Hair of Dog 6527:3 2 infinite vs DB shops-items-by-shop Barkers 30 General Canifis 12 Hair of Dog 2 Rufus 8 Slayer Equipment 26 shop_info sells/buys/change + owners + items + shops-by-npc 6524->Barkers 6525->General 6527->Hair 546->Rufus 13620 Slayer Trade4 + shop-owners Wiki + spawns Fidelio/Roavar/Barker/Rufus/Mazchna/Achtryn present; TS infinite 2B vs DB infinite semantic parity; custom-shops no Canifis override; dup 0 hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1036, 1144, 1156, 1304, 1324.

---

- **Port Sarim 5 shops 1051 Brian + 1145 Gerrant + 1419 Betty + 1125 Wydin + 1446 Grum 3 exact parities + 2 zero-stock drops + Gerrant 303 vs 6209 alias not new roots (AUD-024/AUD-015 known):** Active shops.json 1051 Brian 1145 Gerrant 1419 Betty 1125 Wydin 1446 Grum vs DB docs/shops-items-by-shop Brian/Wydin/Gerrant/Grum/Betty shop_info sells/buys/change + owners + shops-by-npc 2892/2891/2890/2889/5905 slot3 Trade + shop-owners Gerrant 1375 vs db 2 systematic zero-stock drops due import + Gerrant net alias 303 tradeable vs 6209 untradeable Evil Bob; Audited 0 Port Sarim findings/candidates before; 3 parities clean, 2 drops + alias informational not promotable pending. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1051, 1145, 1419, 1125, 1446.

---

- **Guard 3269 Falador sword,1 vs DB monsters-json 3269 byte-identical (stats/interactions/cache/models) + pickpocket guard lvl40 xp46.8 via name-match + spawns 3036,3355 etc clean:** DB monsters-json 3269 Guard + monsters-complete 3269 mirrored + monsters-cache-data 3269 cache_name fai_falador_guard1 ops Attack/Pickpocket + npcs-interactions 3269 Attack2 Pickpocket3 + npcs-summary Guard + TSPS monsters-complete 1243 field-for-field identical + NpcIdentifiers GUARD_40 3269 + client FAI_FALADOR_GUARD1 + spawns 3 Falador placements level0 + npc-animations 3269 388/836/386 vs cache 808/819 distinct layers + pickpocketing guard wiki Guard level40 xp46.8 covers 3269 via name-match + npc-combat-defs/drops/interactions no override correct cache ops; dup 0. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 3269, 40, 46.8, 3036, 388.

---

- **Ardougne knight pickpocket 3297/3300/8851/8852/8854/11902 L55 84.3XP 50/240 stun3 pouch 22531=50 byte-identical active vs DB 7 variants clean (market knights Attack+Pickpocket vs SotE Attack-only distinct, drops Bones-only parity):** pickpocketing.json knight L55 84.3 50/240 stun3 coinPouch 22531=50 + Pickpocket.Thieving successChance 105/110 gloves/cape + rollLoot always pouch + CoinPouch open + monsters-complete 3297/3300/8851/8852/8854/11902 byte-identical to DB monsters-json + npc-spawns 3297 Ardougne market + npcs-interactions 3297 Attack2 Pickpocket3 8851 Attack only + drops knight_of_ardougne Bones526 only + achievement-diaries Ardougne medium +10% CAND-030 shared diary overrides not re-filed; clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 3297, 3300, 8851, 8852, 8854.

---

- **Duradel 13622 slayer tasks 43/43 byte-identical vs DB including frost-dragons 70-120 weight5 ext180-240 clean (dialogue/shops/spawn via legacy 405 name fallback clean):** Active slayer-tasks 13622 Duradel 43 slugs frost-dragons 70-120 weight5 ext180-240 vs DB docs/slayer-tasks 8822 Duradel 43 entries identical + spawns 405 Duradel 2869,2982 legacy ID reachable via name fallback masterForNpc + npcs-interactions 13622 Assignment Trade Rewards + dialogue-index 13622 5 variants + shops 1324/1463 Trade/Reward parity + Slayer.plugin assignTask slayerLevel filter quantity randomInclusive extended gating absent generic; CAND-103 claim frost absent for 13622 inaccurate for Duradel portion, remains for Nieve 6797/7108 etc only. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 13622, 70, 120, 5, 180.

---

- **Lumbridge General Store 1222 2813/2814 Trade slot3 15-item COINS stock 1931:5/10..9003:5/100 triple parity + spawns 3209,3247 clean (pricing discard AUD-015 only):** Active shops.json 1222 COINS 15 stock 1931:5/10 1935:2/100 etc originalStock 15 identical vs DB shops-items-by-shop Lumbridge General sells1300 buys400 change30 owners Shop keeper2813 + assistant2814 slot3 click 15 identical id/stock/restock + shops-by-npc 2813/2814 Trade slot3 + npcs-interactions 2813 Talk-to/Trade + shop-owners Wiki + dialogue index Transcript Shop keeper + npc-spawns 2813 3209,3247 + ShopDefinition no sells/change fields + Shopkeepers thirdClick 2813:3->1222 2814:3->1222 + ShopManager SALES_TAX 0.85; only AUD-015 differs. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1222, 2813, 2814, 1931, 1300, 3209.

---

- **Edgeville General Store 1102 2821 keeper Trade slot3 14-item COINS stock 1931:5/10..9003:5/100 triple parity + spawns 3080,3511 + Oziach 1264 822 1127:2/500 etc parity clean:** Active shops.json 1102 COINS 14 stock 1931 5/10 etc npcInteractions 2821 slot3 vs DB shops-items-by-shop sells1300 buys400 change30 owners Shop keeper 2821 Trade slot3 14 identical + shops-by-npc 2821->Edgeville + npcs-interactions 2821 Talk-to/Trade + spawns 2821 3080,3511 + Oziach 1264 822 3 items 1127:2/500 etc vs DB identical stock/restock; systematic AUD-015 pricing discard only difference. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1102, 2821, 1931, 1264, 822, 1127.

---

- **Varrock General Store 1362 keeper 2815 slot3 Trade 13-item COINS 1931:5/10..9003:5/100 triple parity vs DB sells1300 owner Shop keeper (Varrock) + spawns 3217,3415 clean (pricing discard AUD-015 only):** Active shops.json 1362 13 stock 1931:5/10 etc npcInteractions 2815 slot3 vs DB shops-items-by-shop Varrock General sells1300 buys400 change30 owners Shop keeper 2815 slot3 + shops-by-npc 2815->Varrock + npcs-interactions Talk-to/Trade + spawns 2815 Varrock 3218,3415 + dialogue open_shop; systematic AUD-015 pricing not Varrock-specific; Assistant 2816 Trade via dialogue open_shop not shop binding informal; clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1362, 2815, 1931, 1300, 3217, 3415.

---

- **Canifis Rooftop 40 xp 8 obstacles 14843 TALL_TREE_2 GAP_9-13 14844-14848 POLE_VAULT 14894 GAP_14 14897 vs DB objects-summary anchor 14843 Tall tree identity-clean + landing 3510,3485 vs Wiki 240 lapBonus clean (gap5 delta informational):** CanifisRooftop key canifis lapXp240 pet36842 marks 40 tiles 8 obstacles 1-8 lv40 xp10/8/8/10/8/10/8/175 via TALL_TREE 14843 GAP_9-14 14844-14848 POLE_VAULT 14894 helper gap leap vs DB objects-summary 14843 Tall tree 14844 Gap etc identity-only + tests lap ENDS [3510,3485,0] GAP_14 landing + docs agility absent - tiles/movement unverified guess; Registry has no existing Canifis agility check; gap5 11 vs plugin 8 delta informational. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 14843, 14844, 14848, 14894, 14897, 40.

---

- **Konar quo Maten 8623 slayer tasks 37 byte-identical TSPS vs DB 37 identical slugs/weights/quantities/locations + shops 1324/1463 dialogue/spawn clean:** Active slayer-tasks 8623 Konar 37 tasks quantity/extended/slayer/combat/weight/npc_names/locations vs DB slayer-tasks 5622 Konar 37 identical typographical artefacts bosses->bosse faithfully copied vs Slayer.plugin loader SLAYER_MASTERS vs spawn 1308,3784 Mount Karuulm + dialogue Transcript:Konar 6 variants + shops 1324 Equipment 1463 Rewards slot4/5; byte-identical distinct from Duradel CHK-125. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8623, 37, 1308, 3784, 37, 37.

---

- **Graceful set 11850-11861 + recolours 13579+ 30% run restore via MovementQueue->EquipmentEffects->GracefulOutfit 6-piece vs DB items-json weight +/- and Shop 1444 MARK_OF_GRACE vs DB clean:** Active 11850-11861 base + recolours -3/-4/-5/-6 vs DB 11850 cost30 weight -3 vs inv 11851 +3 weight mirrored; loader weight cache-derived inert; GracefulOutfit PIECES 3%/4%+SET 10%=30% via registerRunEnergyRestoreModifier MovementQueue runEnergyRestoreDelay 1700-Agility*10 -> AGILITY_CAPE substitute; Shop 1444 vs DB shops-items-by-shop Grace 5919 MARK_OF_GRACE clean; weight -3 vs 0.6 drift inert. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11850, 11861, 13579, 11849, 5919, 30.

---

- **Smithing Rune bar 2363 Runite 451 + Coal 453 x8 lvl85 xp50 via SMELTING_RECIPES vs DB items 451/453/2363 cost3200/45/5000 + Wiki 85/50 + Mining 451 CHK-098 distinct from CAND-018 Mithril interval and CAND-091 Varrock double:** Active Smithing.plugin SMELTING_RECIPES Runite 1+8 lvl85 xp50 FURNACE object + SmithingTask 5-tick + immediate 1-tick vs DB items-json 451 cost3200 453 cost45 2363 cost5000 + Mining 451 CHK-098 + Coal 453 CHK-145 + Wiki 85/50 8-coal; interval distinct from CAND-018 5vs4 and CAND-091 10% double. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 2363, 451, 453, 85, 50, 8.

---

- **Shop 1110 Falador General Store 2819 slot3 + 1138 Frenita's Cookery 8685 slot3 vs DB shops-items-by-shop 13/12-stock 1300/400/30 + 1000/550/10 owner slot3 triple-parity clean (mislabeled 1138 != Falador in ticket, pricing AUD-015 systematic):** Active shops 1110 Falador General 13-stock 1931:5/100..9003:5/100 + 2819 Talk-to/Trade slot3 spawn 2957,3386 vs 1138 Frenita's 12-stock 2313:5/200..1980:20/50 +8685 2566,3098 + DB shops-items-by-shop both byte-identical stock/restock + shops-by-npc slot3 + Loader AUD-015 pricing discard systematic; general family CHK-071/126/129/133 distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1110, 1138, 2819, 8685, 13, 12.

---

- **Arceuus Shadow Veil 15344 L47 58xp 5 Earth/5 Fire/5 Cosmic 30s buff hasShadowVeil 15% thieving avoid via Pickpocket.Thieving fail() vs Wiki L47 58 30s 15% stun avoid clean:** ArceuusSpells shadow veil 15344 L47 58xp runes 557x5/554x5/564x5 anim8979 gfx1881 cooldown30000 getMaxLevel*600 hasShadowVeil 15% before dodgy 36.25% combine via Pickpocket line261 message "prevents you from being noticed" vs Wiki 47 58 15% does not affect blackjacking clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 15344, 47, 58, 557, 554, 15.

---

- **Dialogue Bob 10619 Transcript:Bob 3 variants + Death to Dorgeshuun/Lost Tribe + shop 1047 Bob's Brilliant Axes 7 rows 1265:5/100 etc Trade slot3 + Repair 4 via BarrowsEquipment vs DB npcs-interactions Talk/Trade/Repair + shops-items-by-shop + spawns 3232,3203 clean:** Active dialogue-index 10619 Transcript Bob f210ddf16a6c3513 vs DB identical 3 variants + shops 1047 7 rows 1265:5/100 etc slot3 10619 vs DB shops-by-npc + npcs-interactions 1 Talk-to 3 Trade 4 Repair Bob + Barrows Repair suffix all parity + Shopkeepers 10619:3 binding via ShopManager; pricing AUD-015 excluded. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 10619, 1047, 1265, 1351, 1349, 1363.

---

- **Dialogue Elena 1102/4257/8791-8798/8838/9148 + Hosidius 10982/10983/11034 variants Biohazard/MEP1/Plague City/SoTE transcript parity vs DB dialogue-index + Talk-to (8798 Escape) + no-shop vs Bob CHK-171 10619 shop 1047 distinct clean:** Active dialogue-index 1102/4257 5-page 60+ variants Transcript Elena Biohazard 8 MEP1 10 etc + 10982 Hosidius vs DB identical slugs + npcs-interactions 1102 Talk-to@1 8798 Escape1 10982 Talk-to@1 + shops-by-npc empty parity distinct from Bob 10619 shop 1047 + NpcDialogues pickVariant/flatten/presentMenu via NpcInteractionManager clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1102, 4257, 8791, 10982, 60, 11034.

---

- **World Fremennik Rellekka vs Lunar 3200 tuning spawn 3089,3524 multi/pvp/f2p + objects 544/4615/4616/5008 Tunnel 5008 vs DB objects-summary anchor 544 Broken Fence + shortcuts + charter 3200 Tyras 14 routes distinct from tuning clean:** Active world.json spawn 3089,3524 membersWorld vs world zones no 3200 tuning + object-spawns [] cache-provided + Rellekka.plugin Tunnel 5008 2731,3712->2773,10162 + charter-ships 3200 coin Port Tyras vs 3200,3840 multi coord + npc-spawns Rellekka dense 3895 Lunar sparse vs DB objects-summary 544/4615/4616/5008 name parity. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 544, 4615, 4616, 5008, 3089, 3200.

---

- **Shop stock RESTOCK 1260 Ore seller 7x100/200 + per-shop varying ticks (Ardougne Gem 15000/35000/60000 etc) vs DB restock_time + importer restockTicks + Loader parseTicks + ShopManager displayEntries/restockShop interval clean (distinct from AUD-015 pricing + AUD-024 zero-stock):** Importer stockAmount+originalStock restockTicks tick>0 + Loader RawShop parseTicks per-item restockTicks/restockTime/restock + default ticks + ShopDefinition.StockDefinition + ShopManager runtime displayEntries retains sold-out originals + restockShop interval soldItemDestock else itemTick/default -> delta tick-decay vs DB shops-items-by-shop restock_time + Client encodeShopOpen 6-int per slot decoder clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1260, 200, 4, 100, 15000, 1000.

---

- **Shop Drogo's Mining Emporium 1099 5895 dwarf 2-stock 2347/1265 4/100 vs DB 2347/1265 stocked + 436/438/440/453 0-stock importer-filtered distinct from Lowe/Armoury CAND-156 BA drift clean:** Active shops 1099 2-stock 2347 Rune pickaxe 4/100 1265 Bronze pickaxe 4/100 vs DB 2 stocked + 4 zero-stock 436 Arrowheads etc filtered by importer amount>0 + owner 5895 Talk-to/Trade slot3 via shops-by-npc + spawn 3036,9846 Dwarven Mines vs Armoury/Lowe's BA arrow 882 vs 11700 CAND-156 distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1099, 5895, 2347, 1265, 4, 100.

---

- **Shop Draynor Seed Market 1098 [500,2121] Olivia 10-stock COINS 5318:20/100..5309:5/100 slot3 vs DB 10 clean + 6 zero-stock 5322 filtered via importer AUD-024 + pricing AUD-015 + Draynor has no General Store in DB or active correct absence:** Active shops 1098 COINS 10-stock 5318:20/100..5309:5/100 [500,2121] slot3 vs DB 16 items 10 clean identical + 6 zero 5322 filtered + owner Olivia Talk-to/Trade slot3 via shops-by-npc + spawn 3078,3251 + Loader default ticks + importer zero-filter AUD-024 + generals family CHK-071/126/129/133/163 separate. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1098, 500, 2121, 5318, 10, 16.

---

- **Piscarilius food shops Frankie 1135 6963 11-stock + Leenz 1204 6986 10-stock vs Tynan 1358 Sandworms 13431 + Kenelme 1195 2309 zero-stock AUD-024 distinct lineage from CHK-156 anglerfish 6825 fishing 13439 82/120 triple-parity clean:** Active shops 1135/1204 11/10-stock + 1358 Tynan Sandworms 13431 + 1195 Kenelme 2309 zero-stock vs DB shops-items-by-shop Frankie/Tynan/Kenelme/Leenz byte-identical triple parity + npcs-interactions 6963/6986 Trade slot3 vs Fishing 6825 Bait 13439 82 [3,36] CHK-156 distinct; pricing AUD-015 zero-stock AUD-024 systematic 303 vs 6209 alias informational. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 6963, 6986, 6964, 7202, 6825, 13439, 13431.

---

- **Agility Pollnivneach Rooftop 70 tiles3 9 obstacles 14935 BASKET_4 14936 MARKET_STALL_13 14937 BANNER_13 14938 GAP_30 14939 TREE_53 14940 ROUGH_WALL_5 14941 MONKEYBARS 14944 TREE_126 14945 DRYING_LINE vs DB 14935-14941+14944-14945 identities + Wiki 10/45/65/35/75/5/55/60/540 total890 lap890 bonus0 clean distinct from Canifis CHK-141 + Seers CHK-113:** Active PollnivneachRooftop 70 lap890 pet33422 marks70 3 tiles vs DB objects-summary 14935 Basket etc + Agility.plugin finalIndex9 lapBonus0 + tests LAP_ENDS 3363,2998 vs Wiki Pollnivneach 10/45/65/35/75/5/55/60/540 total890 distinct Canifis 141 Seers 113. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 14935, 14936, 14937, 14938, 14939, 14940, 14941, 14944.

---

- **Shop Solihib's Food Stall 1326 Ape Atoll 5249 4-stock COINS 4012:200/100 1963:1000/1000 4016:10/100 4014:20/100 vs DB Solihib 5249 Trade slot3 identical triple parity clean (1961 not stocked correctly, AUD-015 pricing discard systematic):** Active shops 1326 COINS 4-stock 4012 Banana stew etc vs DB shops-items-by-shop Solihib 5249 identical stock/restock + shops-by-npc 5249 Trade slot3 + npc-interactions 5249 Talk-to/Trade slot3 + spawn 2769,2789 Ape Atoll vs Khazard 1961 Eastern egg not stocked correctly. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1326, 5249, 4012, 1963, 4016, 4014.

---

- **Regular Void 8839 top 45×5 + 8840 robe 30×5 + 8842 gloves 6×5 + 11663-11665 helms vs DB 8839/8840/11663 identical + locked (l) 24177 (or) 26463 vs DB null-req cosmetics + VoidEquipment voidSet elite vs normal 100/145 accuracy logic clean distinct from elite CAND-094/NEW-ITEM-008:** Active Void knight top 8839 PLATEBODY 45×5 Def42/42/42/22 vs DB top 45×5 + robe 8840 LEGS 30×5 vs DB + gloves 8842 + helms 11663-11665 + locked (l) 24177 (or) (l)(or) vs DB null-req cosmetics by design + VoidEquipment voidSet() normal/elite helm+gloves+top/robe accurate elite 145/1125 vs CHK-084 bonus-0. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8839, 8840, 8842, 11663, 24177, 26463.

---

- **Shop Martin Thwait's Lost and Found 1228 3193 Trade slot3 + ROGUES candy shop  954 stocked 11-stock COINS vs DB 954 candy 50/100 identical triple parity clean distinct from CAND-168 maze 7235 wall safe / rogue equip 5553:** Active shops 1228 11-stock 954:50/100 1523:25/100 etc vs DB shops-items-by-shop 1228 identical stock + shops-by-npc 3193 Trade slot3 + npcs-interactions 3193 Talk-to/Trade slot3 + dialogue-index 3193 Transcript Martin + spawn 16309 Rogues Den distinct maze CAND-168. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1228, 3193, 954, 50, 100, 3193.

---

- **Agility Gnome Stronghold 1 pip e10/11 23138/23139 + net 23134/23135 + log 23145 + rope 23557 + branch 23559/23560 7 indexes 8 locs identities lap110.5 Lv1 vs DB objects-summary 23145-23139 anchors clean distinct from NEW-AGILITY-001/002 XP redistribution/marks + Pollnivneach CHK-189:** GnomeStronghold 7 indexes 23138/23139 share idx7 xp7.5/7.5/5/7.5/5/7.5/7.5 total47.5 lapBonus63 pet35609 vs DB 23145 Log 23134 net 23138 pipe + Agility.plugin buildIndex lapBonus=lapXp-total + tests LAP_ENDS 2484,3437 + ObstackeRunner vs NEW-AGILITY XP redistribution distinct + Pollnivneach 189 + Canifis 141 + Seers 113 distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 23138, 23139, 23134, 23135, 23145, 23557, 23559, 110.5.

---

- **Teleports Paddewwa ANCIENT 54/64 @3097,9880 [563x2,556,554] vs Varrock NORMAL 25/35 @3213,3424 [563,556x3,554] via SpellTeleports name-mapped → TeleportHandler 3/5 ticks vs DB 8007/12781 tablet identities + strike 1152 CHK-177 distinct + alch 1162 EffectSpells distinct clean:** SpellTeleports Map varrock 25/35 NORMAL 563,556x3,554 3213,3424 + paddewwa 54/64 ANCIENT 563x2,556,554 3097,9880 vs DB tablet 8007/12781 identities + CacheDefinitions 596/601 name resolver + TeleportHandler checkReqs wild20/teleblock + Strike 1152 CombatSpells + Alch 1162 EffectSpells disjoint. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 3097, 9880, 3213, 3424, 8007, 12781, 1162.

---

- **Falador herb patch 8150 at 3058,3311 varbit4774 HERB 20m x4 vs RuneLite farming-data CACHE states GROWING/HARVESTABLE via farming patch path clean (15506 is Wheat object not herb, DB item 8150 Teak chest namespace distinct):** Active farming-data 8150 HERB 3058,3311 varbit4774 among 10 HERB + timing 20m x4 lives3+compost + Data.Farming HERB seeds 5296-5316 + Model.nextGrowth + Patches syncPatch varbit+object vs RuneLite PatchImplementation 20m/4 stages + Wiki farming; ID 15506 DB Wheat object not herb, DB items-json 8150 Teak chest item namespace vs object 8150 herb patch explains missing 8150-8153 in objects-summary gap not active mismatch. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8150, 15506, 5296, 4774, 3058, 3311.

---

- **House teleport NORMAL 40/30 [563,556,557] 2953,3224 vs tablet 8013 TELEPORT_TO_HOUSE vs 8008 Lumbridge vs 8014/8015 bones Tablets vs tablet construction:house-tablet branching outside+inside vs spell not Falador 37/48 vs Paddewwa 54/64 via SpellTeleports handleSelf distinct:** SpellTeleports 53 house 40/30 563,556,557 2953,3224 via SpellTeleports.plugin ItemAction breakTablet 8013 vs House inside/outside via ConstructionPlugin houseTablet borrowed vs TELE_TAB 5 tick4069 via TeleportHandler same checks vs 8008 Lumbridge vs 8014 bones Bananas 1159 vs 8015 peaches not teleport vs 12781 Paddewwa ANCIENT 54/64 CHK-198 control vs CHK-053 Falador 37/48 distinct via Cache 596/601 + NetworkBuilder IF_BUTTON. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8013, 8008, 8014, 8015, 12781, 563, 556, 557.

---

- **Potion storage 29999 unlock dummy + Reagent pouch 29996 + chugging barrel 30000 + Mix MOX/AGA/LYE 30005-30026 Mix vs store vs Bank layout 11x352=3520 vs Bank tab distinct no index-confusion via shop 1234 vs varbit11295 vs POTION_BY_ITEM_ID chain drain distinct:** ItemIdentifiers REAGENT_POUCH 29996 + POTION_STORAGE 29999 + CHUGGING_BARREL 30000 + MOX pastes 30005-30010 vs MMM mixes 30011-30026 vs Shop 1234 Mixology 29971 vs ItemDefinitionLoader cache vs Potions mix chainId dose vs Bank TOTAL_BANK_TABS 11 via layout/displaySlot vs Varbit 11295 MM_POTION_STORAGE_UNLOCKED client only vs DB items-json 29999 unlock dummy + 30000 barrel + dialogue Mox/Aga/Lye hopper vs mixer vs Mix vs Store not Bank tab -> separate containers. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 29999, 29996, 30000, 30005, 30011, 1234, 29971, 11295.

---

- **Task scheduler Task delay3 DEFAULT vs DiaryProgress tierComplete Task via TaskManager DEFAULT 3-tick varbit+dialogue vs Tasks plugin persist start vs DiaryTasks varbit 6291 Ardougne count* distinct from port-tasks id74:** Task base delay/countdown vs TaskManager process pending->active vs TaskType DEFAULT vs DiaryData 12 diaries + DiaryProgress tierComplete Task delay3 -> TaskManager.submit vs TierCompleteTask execute re-checks started+tierComplete vs varbits started/count/complete + Journal 741 scripts 6844/2524 + port-tasks 74 banana vs Diary key string namespace distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 74, 6291, 3, 741, 6844, 2524, 6845, 12.

---

- **Catherby Arhein General Store 1393 11-stock COINS slot3 3200 vs DB shops-items-by-shop Arhein triple parity clean (Fortis 1131 mislabel):** Active `shops.json:395` Arhein General Store 1393 COINS 11-stock 1925:10/50 etc slot3 3200 Arhein vs DB `shops-items-by-shop` Arhein 11 items 1300/400/30 slot3 3200 byte-identical + shops-by-npc 3200 Trade slot3 + npcs-interactions 3200 Talk-to/Trade + spawn 2803,3430 + loader normalizeAmount + Shopkeepers 3200:3->1393. Fortis 1131 is Varlamore distinct. Pricing AUD-015 excluded. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1393, 3200, 11, 1300, 400, 1131, 1925, 22660.

---

- **Rimmington General Store 1300 13-stock COINS slot3 2823 vs DB shops-items-by-shop Rimmington triple parity clean (Fortis Gem 1130 mislabel AUD-024):** Active `shops.json:303` Rimmington General Store 1300 13-stock 1931:5/10 etc slot3 2823 Shop keeper (Rimmington) vs DB `shops-items-by-shop` Rimmington 13 items 1300/400/30 slot3 2823 byte-identical + shops-by-npc 2823 Trade slot3 + npcs-interactions 2823 Talk-to/Trade + spawn 2947,3217. Fortis Gem 1130 13336 3-stock vs DB 4 items zero-stock 1601 delta is AUD-024 systematic. Pricing AUD-015 excluded. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1300, 2823, 13, 1300, 400, 1130, 13336, 1931.

---
*Last re-verified: Wave 43 — 2026-10-13 — 64 HOLD/HOLD DUP (arrows/bolts/ammo + jewellery + capes/gloves/boots parity; 2 stream-fails recovered). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-43 for per-wave evidence.*
