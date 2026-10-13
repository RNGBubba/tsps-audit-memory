# Completed — skills

> **Verified clean** (48) — bounded no-mismatch checks. Skip re-auditing unless scope changes.

- **Lobster Cooking recipe (377→379; burnt 381):** Active `Cooking.plugin.js:14,49,126-146,149-230,238-262,264-280,306-308` configures four-tick cooking, level 40, one raw lobster per attempt, 120 XP on success, lobster output, burnt lobster on failure, and item-on-object/Range Cook routes. `ItemIdentifiers.ts:376-380` resolves the IDs. Exact DB item keys `READ-ONLY-DB/docs/items-json/{377,379,381}.json:2-3` confirm Raw lobster, Lobster, and Burnt lobster identities only. Current official [Lobster](https://oldschool.runescape.wiki/w/Lobster) confirms the checked input/output, level, 120 XP, failure output, level-74 no-burn threshold, and four-tick recipe. Available-register duplicate screen found no same-recipe discrepancy; the established broader burn-mechanic checks are separate. No mismatch in this bounded recipe slice; burn-chance parity beyond threshold and live behavior were not assessed. Static review only; no source/DB edits, tests, builds, or live interaction.

---

- **Gargoyle Gold ore noted-drop row (NPC 1543; item 444):** Active and exact authoritative DB rows match the main-table quantity 10–20 and 10/128 odds; only active data carries `noted:true`, which current official [Gargoyle drop table](https://oldschool.runescape.wiki/w/Gargoyle#Drops) confirms. Exact DB item key links noted Gold ore 445; active drop materialization applies the note flag, and NPC 1543 has active spawns. The DB omission is not an active behavior mismatch. Bounded no-new-mismatch result; no live kill/tests/builds or TSPS/READ-ONLY-DB edits.

---

- **NPC Examine client/server transition (Aberrant spectre ID 2):** The active client builds Examine from the transformed NPC type ID while retaining the live server NPC ID; menu dispatch resolves that server ID to the cache NPC type and sends EXAMINE_NPC. Client/server opcode and two-byte short-add decoding agree; server lookup returns the active definition's examine text and sends a game chat message decoded by the client. Exact DB key `READ-ONLY-DB/docs/monsters-json/2.json:2-3,39-43` and active vendored row `server/data/definitions/monsters-complete.json:3` both give ID 2, Aberrant spectre, “A very smelly ghost”; active spawn at `npc-spawns.json:15560` establishes a reachable sample. No mismatch in the bounded path. DB has no packet contract; packet mechanics are source-internal. Static trace only; no live interaction, packet capture, cache decode, tests/builds, or source/DB edits. Other NPCs and object/item Examine paths excluded.

---

- **Barrows repair pricing (helm 60/weapon 100/body 90/legs 80 per 1000 durability) matches Wiki Barrows_equipment 60k/100k/90k/80k (330k/set) — REPAIR_COSTS [60,100,90,80]:** BarrowsEquipment.plugin.js REPAIR_COSTS [60,100,90,80], repairCost idx%4 mapping, MAX_DURABILITY 1000, TICKS_PER_DEGRADE 90, durability stages 4856+idx*6+stage; Bob/Aneirin/Tindel/Dunstan Repair/Talk-to wired; DB wiki-page-text transcludes {{Barrows repair}} no inline cost; pricing matches Wiki Template:Barrows_repair. Clean for pricing (NPC coverage partial noted). — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 4708, 4856, 60, 100.

---

- **Steel arrow fletching (STEEL_ARROWTIPS 41 + HEADLESS 53 -> STEEL_ARROW 886) level 30 xp 75 amount 15×15->15 matches Wiki Steel arrow Creation 30/75/15+15->15:** Fletching.plugin ARROW_RECIPES_BY_TIP entry steel level30 xp75 outputAmount15 requirements [HEADLESS×15,STEEL×15] intervalTicks2 via buildRecipe; resolveArrowRecipe headless guard; CreationMenu->Task->performFletchingAction consume+addItem 886×15 + addExperiences 75; DB items-json 886/41/53 identity only; Wiki authoritative 30 Fletching 75 XP (5 per arrow) 15+15->15. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 41, 53, 886, 30.

---

- **Herblore Super attack potion (Irit unf 101 + Eye of newt 221 -> 145 at 45/100 XP) mapping matches DB 101/221/145 identities and Wiki 45/100 - single recipe clean:** Herblore.plugin CLEANABLE/UNFINISHED/FINISHED maps: IRIT_POTION_UNF 101+EYE_OF_NEWT 221 -> SUPER_ATTACK_3_ 145 level45 xp100; UseItemPacketListener->PluginManager->Herblore handler with level gate/anim/consume/xp; DB items-json 101/221/145/259 verify identities only (schema has no recipe fields); Wiki Creation 45/100 correct. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 101, 221, 145, 259.

---

- **Arrow-shaft Fletching 6-way knife-on-log recipes (1511 15@1/5, 1521 30@15/10, 1519 45@30/15, 1517 60@45/20, 1515 75@60/25, 1513 90@75/30) all match Wiki — interval 3 ticks via LOG_RECIPES_BY_LOG:** Fletching.plugin LOG_RECIPE_DEFINITIONS arrow-shaft rows + TICKS_CUT_LOGS 3 via buildRecipe/indexBy + resolveKnifeOnLogsRecipe(LOG_RECIPES_BY_LOG) -> CreationMenu -> FletchingTask performFletchingAction (level/material gates, consume log, add 52, grant XP). DB items-json 52/946/1511/1521/1519/1517/1515/1513 verify identities only. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 52, 946, 1511, 1521.

---

- **Herblore Super defence 107 Cadantine unf + 239 White berries -> 163 (lvl66/150 XP) bounded recipe mapping clean (second Herblore sample distinct from Super attack 101/221/145):** Herblore.plugin FINISHED_POTIONS [107:239]->163 lvl66 xp150 + UNFINISHED Cadantine->107 + handler 119-141 + CLEANABLE log 143; ItemIdentifiers 107/239/163, UseItemPacketListener 12-38 + PluginManager 1496-1500 + SkillManager 162-165 addExperiences HERBLORE 150; DB 107 Cadantine unf + 239 White berries + 163 Super defence(3) identity-only, no recipe fields; Wiki Creation 66/150 authoritative; screened vs CHK Super attack and AUD-065/066. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 107, 239, 163, 66.

---

- **Fletching Oak longbow 845 single-root cut OAK_LOGS->OAK_LONGBOW_U_ 56 25/25/1 + string 56+ bowstring ->845 25/25/1 ticks 3/2 clean (Willow 35/33.3 sibling out-of-scope):** Fletching.plugin LOG_RECIPE OAK_LONGBOW_U_ 90 level25 xp25 intervalTicks 3 anim1248 reqs KNIFE+OAK_LOGS + STRINGING OAK_LONGBOW 161-166 level25 xp25 interval 2 anim6685 reqs 56+bowstring 1->1 via buildRecipe/indexBy->CreationMenu->Task->performFletchingAction; ItemIdentifiers 56/845, DB 56 Oak (u) + 845 Oak longbow identities + titles registry proves wiki pages; DB no recipe fields, Wiki 25/25/1 authoritative; Willow 92-95 35/33.3 sibling also matches but excluded single-root. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 56, 845, 25, 6685.

---

- **Cooking Shark 383→385 raw→cooked level 80 xp 210 stopBurn 94 burnt 387 ticks 4 via CookingTask shared machinery clean (distinct from Lobster 377→379 40/120):** Cooking.plugin COOKABLES Shark level80 xp210 stopBurn94 burnt387 COOK_INTERVAL_TICKS 4 GAUNTLETS_STOP_BURN 89 COOKABLE_BY_RAW FIRE/COOKABLE_OBJECT_NAMES isSuccess burn formula linear 42 + stopBurn/cape 89 vs 94; Dispatch onItemOnObject handleCook name+action+raw check -> startCooking level/inventory gate -> activeSessions nextCookTick cycle+4 -> CookingTask tick walk/hitpoints/movement/MapObjects/distance -> deleteNumber raw emit cooking:burn/add cooked or burnt emit cooking:success addExperiences 210; ItemIdentifiers 383/385/387, DB items-json 383/385/387 identities only; Wiki 80/210/4/94 authoritative; AUD-071 source-specific burn reductions shared root not shark-specific duplicate. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 383, 385, 387, 80, 210.

---

- **Fletching Willow longbow 847 cut WILLOW_LOGS 1519→58 40/41.5 ticks3 + string 58+BOW_STRING→847 40/41.5 ticks2 both match Wiki distinct from Willow shortbow 35/33.3 and Oak longbow 25/25 cleans:** Fletching.plugin LOG_RECIPE WILLOW_LONGBOW_U_ 92-95 40/41.5 TICKS_CUT_LOGS 3 anim1248 + STRINGING WILLOW_LONGBOW 176-182 40/41.5 TICKS_STRING_BOWS 2 anim6686 via buildRecipe/indexBy->CreationMenu->Task; ItemIdentifiers 58/847/1519, DB items-json 58 Willow (u)+847 Willow longbow+56 Oak (u)+845 Oak longbow+60/849 sibling identities distinct, cache tradeable/members, Wiki Willow longbow (u) 40 41.5 T3 + Willow longbow 40 41.5 T2 vs Oak 25/25 and Willow short 35/33.3; registry CHK-060 Oak clean + CAND-002 Willow short conflict only, so 58/847 is new distinct single-root clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 58, 847, 1519, 40, 41.5.

---

- **Runecrafting Mist/Steam combination altar identity — no dedicated Mist/Steam altar object 4695/4694; plugin 13 altars 34760-34771 + Blood clean on object-summary vs Wiki (combination crafted at Air/Water and Fire/Water):** Runecrafting.plugin RUNES_BY_ALTAR_ID 34760-34771 ALTAR_33..57 + 27978/43479 Blood Craft-rune/Bind talisman/rift/pouch; ObjectIdentifiers no MIST_ALTAR/STEAM_ALTAR; DB objects-summary 34760-34772 each named Altar grep Mist/Steam altar 0 hits only Vent/Pump; Items-summary 4695 Mist 4694 Steam identities; Registry CAND-005 Earth 34763/Water 34762/Mind/Blood only prior altar deltas, triple-verify 0 Mist/Steam entries; Wiki Mist=Air+Water Steam=Water+Fire at existing altars not dedicated object => clean on identity axis, combination missing is feature gap out-of-scope. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 4695, 4694, 34760, 34763, 27978.

---

- **Ultra compost 21483 + Super 6034 + Volcanic ash 21622 + bin 3271 item identities vs DB items-json exact identities clean (no DB patch-state table to mismatch; farming-data rev237 cache+RuneLite):** DB items-json 21483 Ultracompost cost85 high51 low34 weight3 buy2000 + 21622 Volcanic ash cost200 buy13000 + 6032 Compost 6034 Supercompost 6470 Potion 3271 Compost bin unobtainable + cache dumps + wiki timestamps Ultra2026-06-22 etc; TSPS Services bin machine COMPOST_NAMES 1-4 SUPER/COMPOST tiers binFor/binValue capacities 15/30 timers 60/90 ash 25/50->tier3 + Patches fertilize 18/26/36 lives+=tier harvest CRYSTAL 16+4*compost Model diseaseChance*[1,0.5,0.2,0.1] patchValue + Spells Fertile Soil 83/87 ultra branch; DB has no farming-data patch-state table, TSPS farming-data.json is rev237 cache+RuneLite export, so identity parity clean, no DB-state mismatch. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 21483, 21622, 6032, 6034, 6470.

---

- **Woodcutting Yew tree 372-390 Lv60 175XP 1515 logs 19 loc IDs 4536/5121/.../57790 CUT_CHANCE yew stump 9714 multi despawn190 clean:** Woodcutting.plugin Yew entry 372-390 + CUT_CHANCE yew ticks/deplete/bird-nest/XP vs DB objects-summary 19 Yew Tree locs + stump 9714 + items-json 1515 Yew logs 64/96; TSPS TREES lookup by name activeSessions single-tick tick rollLog (1+low*(99-L)/98+high*(L-1)/98)/256 tier + Guild +7 boost success awards log/xp/lumberjack pet nests depletes despawn190; dup-screen 0 hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1515, 4536, 9714, 60, 175.

---

- **Farming patch Rake OPLOC loc option distinct from OPLOC1-5 vs LOC_INTERACT 231 via ObjectDefinition.getInteractions + Patches.Farming objectInteraction/itemOnObject clean:** Client MenuAction 440-510 OPLOC1-5 permuted 7B GameObjectFirst..Fifth MenuOpcode 3-6/1001 base+arg ctrl vs server NativeClientPackets 96/28/42/38/51 + NativeClientPackets mirror + ClientProtocol 231 LOC_INTERACT varlen -> object_option clickType 1-5 + ObjectActionPacketListener executeAction MapObjects.getPrivateArea ObjectDefinition.forPlayer getInteractions clickType-1 -> Patches.Farming objectInteraction rake->startWork(ticks1800 rake() weeds Weeds anim2273 xp4) itemOnObject same; farming-data 110 patches type/varbit/x/y + DB objects-summary name-only 15063 Weedy patch etc; Distinct third farming sample from Ultra. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 231, 96, 28, 15063, 4774.

---

- **Agility Log balance 3 courses 23145 Gnome/23144 Barbarian/23542 Wilderness + 8 shortcuts 16546/23274/16540/20882/57593/56991 via ObjectIdentifiers -> buildIndex -> ObstacleRunner balance walk clean (identity only DB):** Agility.plugin buildIndex OBSTACLES_BY_OBJECT usable/at/rollSuccess/attemptObstacle/finishObstacle lapBonus Gnome Barbarian Wilderness courses + agility-shortcuts.json 8 log entries lv33 4 fail90 etc + IdEnums ObjectIds 33 LOG_BALANCE variants vs DB objects-summary Log balance identity only + ObstacleRunner expandSteps lock BUSY BALANCE_WALK 762; 25 orphan LOG_BALANCE constants DB names but no handler expected unused; Existing Gnome XP finding separate, dup-screen 0 new. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 23145, 23144, 23542, 16546, 23274.

---

- **Master Farmer pickpocket loot 45 seeds + farmingRate clamp min(85,Farming) + 48/1000 herb conserve 1..85 vs DB no pickpocket table (DB npc-drops combat only) identity cross-check clean:** Active pickpocketing.json master_farmer L38 43XP 90/240 stun3 45-entry table 4 farmingRate entries vs Pickpocket.Thieving rollLoot tableRate min(85,Farming) pick-=rate + weighted pick + thieving.md Wiki provenance; DB docs/drops-json npc-drops no master_farmer table (combat only), npcs-interactions 5730/5731 slot3 Pickpocket + npcs-summary Master Farmer IDs confirm cache authority, items-json 5318 etc 45 seed IDs members true verify identities, farming clamp + herb 48/1000 conserve at Farming 1..85 verified; no duplicate registry entry, prior cohort left low-Farming boundary open now closed. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 5730, 5318, 5731, 48, 85.

---

- **Monkfish 7944 fishing L62 rolls 48-90 XP120 + cooking 7944->7946 L62 XP150 stop92 + food heal16 + item alch 7942/7944/7946 clean vs DB 7942/7943/7944/7946 (burnt 7948 1/1 vs 0/0 drift informational):** Fishing.plugin MONKFISH 7944 L62 rolls48-90 pet138583 MONKFISH_NET small net Swan Song Npc4316 Net via SPOT_TOOLS_BY_NPC catchChance rollCatch vs DB items-json 7942 Fresh raw 10/4/6 7943 Fresh cooked + 7944 Raw 230/92/138 buy13000 + Cooking.plugin RAW_MONKFISH 62/150/92 gauntlets86 cape isSuccess + Food.plugin heal16 + item-gameplay 7942 0/6/4 7944 365/138/92 7946 439/138/92 7948 0/1/1 vs DB 7948 Burnt 1/0/0 drift 1/1 informational; Wiki Raw/Monkfish titles confirm identities; StopBurn 92 matches except shared AUD-071 90-91 nuance not re-filed. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 7944, 7946, 7942, 7948, 4316.

---

- **Farming allotment second-sample Hosidius 1733,3558 vs Catherby 2805,3466 disease-free gating 7925 Hosidius vs flower/scarecrow only correctly without Morytania 4490/Kourend 7927 branches clean (distinct from CAND-105 Harmony 3789/3794 failure):** farming-data 110 patches ALLOTMENT 27113 4771 1733,3558 Hosidius + 8552 4771 2805,3466 Catherby + 21950 4771 3794 Harmony vs Model.Farming diseaseFree 78-103 protected/POISON_IVY/HESPORI/HERB Troll/Weiss/hosidiusProtected box 1720,3540 + faladorProtected 3003,3372 fortis 1581,3094 else ALLOTMENT flower proximity 32 tiles; Patches.Farming login 7925 hosidiusProtected + 4465 falador + 4130 fortis no 4490/7927 consumption; VarbitID 4771/4772 7925/7927/4490/4465; Hosidius correctly gated via 7925 box, non-privileged correctly fall through to flower/scarecrow only, no diary gate expected; DB no patch table; distinct second-sample clean vs CAND-105 Harmony failure. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1733, 2805, 4771, 4772, 7925.

---

- **Mining Runite ore 451 rocks 14859/4860/2106/2107/7461 level 85 xp125 vs DB items-cache 451 cost3200 low1280 high1920 + Wiki 85/125 distinct from 20-70 series clean (silver 20/40 gold 40/65 mithril 50/80 adamantite 70/95):** Mining.plugin ROCKS Runite rocks level85 xp125 oreId 451 cycles23 respawn45 objectIds variant 14859-7461 vs DB items-cache 451 Runite ore cost3200 low1280 high1920 linked452 placeholder16241 + ObjectIdentifiers 11376/11377/36209 canonical Runite rocks + items-wiki titles 2026-07-06 + Wiki Infobox 85/125 byte-identical to plugin + downstream Smithing Runite bar 2363 level85 xp50 coal8 matches; Series Silver 20/40 Coal30/50 Gold40/65 Mithril 50 vs Wiki55 drift separate candidate Apex 85 isolated monotonic. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 451, 452, 14859, 85, 125.

---

- **Ancient wyvern shield 21633 charged / 21634 uncharged vs DB parity clean slot SHIELD req Defence75 Smithing70 bonuses -10x3 15/-10 etc tradeable/alchemy/weight clean (visage 21637 cost 750k also clean):** Active item-gameplay 21633 charged bonuses [-10,-10,-10,15,-10,72,80,75,15,-5,-2] req Defence75 Smith70 trade false 1200000/800000 + 21634 uncharged 22/30/25 bonuses -55 melee_strength weight4.535 vs DB items-json 21633/21634/21637 identities slot req bonuses/alchemy/weight/linked noted verified; Loader copies type/req/bonus/alch, BonusManager sums, Equip gates, Alchemy pays; parity clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 21633, 21634, 21637, 21635, 75.

---

- **Farming bush patch BUSH 6 crops 20min 5 patches 34006 Guild 4772 + 4 outer 4771 via farming-data rev237 Watering excluded + poison-ivy immunity + saveLife 90-190 CTS clean:** farming-data BUSH 6 crops 20min 5-8 stages regrow20 lives4 states GROWING/HARVESTABLE/DISEASED/DEAD varbit arrays 5 BUSH patches 34006 1260,3733 Guild 4772 + 7580 2617,3225 +7579 2591,3863 +7578 2940,3221 +7577 3181,3357 vs Data ROWS REDBERRIES..POISON_IVY seed/produce/level/payment WATERABLE excludes BUSH PET_RATES + Model advanceFarm saveLife 90-190 CTS diseaseFree poison-ivy true patchValue + Patches farm offset PATCHES_BY_REGION varbit reuse syncNearby + Services compost + generate-farming-data RuneLite varbit decode + DB dialogues gardener 4 cabbages + poison ivy bushes don't get diseased; DB no farming table; dup 0. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 34006, 4772, 4771, 20, 4.

---

- **Seed vault 26206 + seed box 24482 / herb sack 24478 / silklined 33135 identities vs DB objects-summary/items-json clean (vault per-player map guildObject Vault; no DB vault-state table):** Guild.Farming guildObject vault map per-player farm.vault {id:count} 2^31-1 cap Deposit-all Withdraw 1/5/10/All noteTemplate + Patches farmFor attribute persistence + Data farming-data rev237 + Model nextGrowth + Services bins + DB objects-summary 26206 Seed vault + items-json 24482 Open seed box 24478 herb sack 33135 silklined existence + items-summary cross-check + dialogue Guild NPCs Amelia/Allanna/Jane no vault dialogue; DB has no vault mechanics table, Farming.plugin Core split verified, no duplicate registry vault entry. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 26206, 24482, 24478, 33135, 4771.

---

- **Mining Iron ore 440 rocks 7455/7488 level15 xp35 vs DB 11364/11365/36203/42833 identity + items-json 440 cost17 low6 high10 clean distinct from Runite 451 85/125 apex (stale rock IDs provenance gap not level bug):** Mining.plugin ROCKS Iron level15 xp35 ore440 vs DB items-json 440 Iron ore cost17 low6 high10 + objects-summary Iron rocks 11364 11365 36203 42833 vs active 7455/7488 grep 0 hits stale IDs gap not level bug + item-gameplay 442 value83 vs cost17 GE drift + Wiki Iron ore 15/35 Runite 85/125 distinct; ROCKS catalog monotonic Iron 15 vs Runite 85; dedup 0 iron pending vs runite clean CHK-098 separate root. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 440, 451, 11364, 7455, 15.

---

- **Seers Village Rooftop 570 agility course 60 6 obstacles 14927 WALL_15/14928 GAP_27 etc identity vs DB objects-summary anchor 14927 Wall + plugin lapXp570 clean:** SeersRooftop.js seers lapXp570 pet35205 marks 60 5 tiles 6 obstacles 1-6 lv60 xp45/20/20/20/25/435 total565+lapBonus5 + Agility.plugin finalIndex lapBonus calc ObltacleRunner render + ObjectIdentifiers WALL_15 14927 GAP 27-29 EDGE3 TIGHTROPE9 vs DB objects-summary 14927 Wall 14928 Gap etc identity-only + tests lap ENDS [2704,3464,0] EDGE landing + docs agility-courses roc rev241 cache; Wiki lap/XP actual not DB-encoded but plugin matches Wiki; dup 0 hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 14927, 14928, 14929, 14931, 14932.

---

- **Farming apple fruit tree 5283 seed 5496 sapling 1955 cooking apple + seedling 5480/5488 stack true vs DB false divergence note vs DB items-json clean (growth 160m x6 27/22/8.5/1199.5 Patches lifecycle wired):** Data ROWS APPLE 27/22/8.5/1199.5 Sweetcorn9 CACHE timing FRUIT_TREE160m x6 sapling 5496 seedlings 5480/5488 + Model nextGrowth/diseaseChance 17 saveLife 25-80 advanceFarm + Patches plant water growth check harvest pay Services cropRewards pet 1/500 petRate9000 + DB items-json 5283 trade true 5496 trade true + items-cache + Wiki; DB no farming-state table; Seedling 5480/5488 stack true vs DB false weight 0.9 divergence noted informational, not promoted; dup 0 apple hits; clean on wired lifecycle vs DB identities. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 5283, 5496, 5480, 5488, 1955.

---

- **Karil's set 4732 coif +4734 crossbow +4736 leathertop +4738 leatherskirt (4733/4735/4737 noted) vs DB items-json 4732/4734/4736/4738 stats/requirements Ranged70/Def70/ alch/tradeability/slots byte-identical clean:** DB items-json 4732 coif Ranged70 Def70 +7 ranged -1 magic def 6/9/12/6/10 cost13000 +4734 crossbow Ranged70 +84 ranged cost160k speed4 +4736 leathertop -15 magic +30 ranged def47/42/50/65/57 cost50k +4738 leatherskirt -10 magic +17 ranged 26/20/28/35/33 cost47k vs RSPS item-gameplay 4733-4741 4732-4738 explicit bonuses/reqs/anims/values + cache summary + skill-requirements Ranged70/Def70 + buy limits 15; Noted 4733/4735/4737 first-class RSPS vs DB virtual linked_id_noted pattern; shop/preset name not ID so drift tolerant; minor textual/weight drift only. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4732, 4734, 4736, 4738, 4733, 4735.

---

- **Farming Yew tree 5315 seed + 5361 seedling + 5373 sapling + 5315 cost143 + farming-data YEW 40m x10 stages 8 TREE patches + Patches harvest↔Woodcutting chop 1515 clean byte-consistent:** Data ROW YEW Lv60 81/0/7069.9 payment cactus spine 10 + farming-data timing YEW TREE 40m stages10 regrow0 + states TREE YEW GROWING/HARVESTABLE etc 8 patches 33732 56953 etc + Model nextGrowth diseaseChance + Patches healthCheck harvest Woodcutting chop 1515 + Services petRate 11242 + item-gameplay 5315 cost143 low57 high85 weight0 buy200 +5361/5367/5373 seedling weights 0.9 vs0.907 trunc + Wiki Yew Farming; byte-consistent farming/woodcutting handoff. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 5315, 5361, 5367, 5373, 1515, 60.

---

- **Tuna 359 fishing lvl35 rolls 8/64 xp80 + Harpoon vs Cage/Harpoon generic spot vs DB items-json 359 Raw tuna cost40 clean distinct from Cooking CAND-034 stop58vs63 + Food 7060 heal20 vs22 CAND-090:** Fishing.plugin FISH TUNA 359 lvl35 rolls 8/64 xp80 pet257770 TOOLS HARPOON vs Cage/Harpoon generic spot Harpoon vs DB items-json 359 Raw tuna cost40 361 Tuna cost40 367 Burnt + item-gameplay 359/361/7060 alch matches DB but value drift informational + Cooking 359->361 lvl30 xp100 stop58 vs Wiki 63 gauntlets exclude correct + Food TUNA heal10 correct 7060 heal20 vs22 already CAND-090 + creation 7086 chopped tuna no handler; Fishing mapping clean byte-identical distinct from Cooking/Food candidates. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 359, 361, 367, 7060, 7086, 35.

---

- **Mining Coal 453 rocks 7456 lvl30 xp50 vs DB items-json 453 cost45 + objects-summary 4676/11366 coal rocks distinct from Mithril 50/80 + Smithing Steel x2 Mithril x4 Adamant x6 Runite x8 consumes 453 clean (stale 7456 provenance gap informational):** DB items-json 453 Coal cost45 low18 high27 weight2.267 members false + items-complete mirror + items-cache + Wiki Coal Mining 30/50 time30s + TSPS item-gameplay 453 Coal value204 high27 low18 + ItemIdentifiers COAL453 + Mining.plugin Coal rocks 7456 lvl30 xp50 ore453 pet290640 cycles15 respawn7 vs Mithril 50/80 distinct + ObjectIdentifiers 4676/11366/11367/36204 vs plugin 7456 KORE2 staleness gap + objects-summary Coal rocks 4676 etc none is 7456 + Smithing SMELTING_RECIPES Steel2 Mithril4 Adamant6 Runite8 correctly consumes 453 + Motherlode ORES coal; level/XP parity clean, object-ID staleness informational. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 453, 454, 4676, 11366, 7456, 30.

---

- **Thermonuclear smoke devil family 498/499/7406/12577/13659 vs DB byte-identical + thermonuclear_smoke_devil drops main_max_roll107 (Occult 1/350 etc separate yarn Shark 5/856 Pet 1/3000) + Swamp toad 2150 alchemy/weight/trade parity clean (value188 vs cost2 not trade-price) + 28 ground spawns vs diary:** Vendored monsters-complete 499/498/7406/12577/13659 byte-identical DB + monsters-json 499 combat301 hp240 max8 weakness1/20 etc + npc-drops thermonuclear_smoke_devil 107 Always Ashes Occult 1/350 Shark 5/856 Battlestaff 1/512 Dragon chain 1/2000 Jar 1/2000 Pet 1/3000 brimstone true identical + item-gameplay 2150 vs DB 2150 cost2 weight0.5 examine slippery + ground-items 28x 2150 gnome-stronghold vs achievement diary; AUD-001/002 still apply but no new mismatch. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 498, 499, 7406, 12577, 13659, 2150.

---

- **POH Construction Guild trophy hotspot 15394 GUILD_TROPHY Quest Hall 4 buildables 13522 Anti-Dragon Shield 13523 Glory 13524 Legends 31986 Mythical vs DB objects-summary clean distinct from League/fishing trophy 26:** ConstructionData QUEST_HALL 9/10 GUILD_TROPHY hotspot 15394 4 buildables MOUNTED_* level47 teak plank + guild item vs ConstructionPlugin HOTSPOT_BY_OBJECT_ID + DB objects-summary 15394 13522-13524 31986 SKILL_HALL/QUEST_HALL neighbours; viewer 5708-5711; league hall AUD 41024-41034 distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 15394, 13522, 13523, 13524, 31986, 26.

---

- **Farming Magic tree 5316 seed / 5362 seedling / 5374 sapling lvl75 plant145.5 check13768.3 + 1513 logs + 40m 12 stages 8 TREE patches vs DB items-json byte-consistent + Yew CHK-137 clean (harvest→woodcutting:chop handoff via Patches validates):** Active Data.Farming ROW MAGIC 75 145.5/0/13768.3 Coconut25 vs DB items 5316 cost422 weight0 + 5362 0.907 vs saplings trunc + 1513 logs cost320 + cache farming-data MAGIC TREE 40m stages12 vs YEW stages10 8 TREE patches + Model disease/pet/nextGrowth + Patches harvest blocks WOOD_TREES emits woodcutting:chop 1513 validateTree/depleteTree vs Woodcutting TREES 75/250/199 stump9713; byte-consistent second sample extends CHK-137. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 5316, 5362, 5374, 1513, 75, 145.5.

---

- **Fishing Anglerfish 13439 spot 6825 Piscarilius lvl82 rolls 3/36 xp120 bait Sandworms 13431 via Fishing.plugin hasToolRequirements/rollCatch vs DB items-json 13439 cost450 weight0.4 + npcs-interactions 6825 Bait clean (Diabolic 30773 pending distinct):** Active FISH.ANGLERFISH 13439 lvl82 [3,36] xp120 pet78649 ANGLERFISH_ROD bait 13431 vs Active item-gameplay 13439 value1425 high270 low180 weight0.33 vs DB 13439 cost450 low180 high270 weight0.4 + SPOT_TOOLS_BY_NPC 6825 Rod Fishing spot Piscarilius 3 spawns vs DB npcs-interactions 6825 Bait + Cooking RAW 13439 lvl84 xp230; Diabolic enhancer pending distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 13439, 6825, 13431, 30773, 82, 120.

---

- **Fletching Dragon arrow 11212 arrowtips 11237 + headless 53 Lv90 225XP 15x15 2 ticks via ARROW_RECIPES_BY_TIP + headless creation vs DB 11212 cost800 ranged60 weight0 clean (CAND-097 mithril dart feather distinct):** Fletching.plugin ARROW_RECIPES_BY_TIP 11237->11212 Lv90 xp225 output15 headless 53 ticks2 vs DB 11212 cost800 low320 high480 ranged60 weight0 + Wiki 90/225 15 Creation 2 ticks + UseItem->resolveArrowRecipe->CreationMenu->FletchingTask; value 1585 vs 800 AUD-015 excluded. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11212, 11237, 53, 90, 225, 800.

---

- **Farming Herb Toadflax 5296 38/34/38.5 + Snapdragon 5300 87.5/98.5 vs Data.Farming ROW clean (Ranarr CAND-044 27 vs 26.5 isolated) + DB 3049/2998/3000 identities clean via Patches deferred HERB XP path:** Data.Farming ROWS Toadflax 38,34,38.5 + Snapdragon 87.5/98.5 vs Wiki clean + Ranarr 32,27,30.5 CAND-044 isolated vs DB items 5296/3049/2998/3000 identities only + farming-data 80min herb 4x20 + Patches harvest HERB deferred plant XP on lives==0. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 5296, 5300, 38, 34, 87.5, 3049.

---

- **Hunter Herbiboar 7785/7786 + spawns 7831-7839 Harvest via Herbiboar 80/31 XP1950-2461 1-3 herbs + pet 6500 vs DB npcs-interactions 7785 Harvest + monsters 6616 scorpia offspring 6616 byte-identical clean distinct from Box trap CHK-186 53/63:** Hunter Herbiboar tracking/harvest 7785 vs DB 7785 Harvest + NpcIdentifiers fossil_herbiboar 7785/7786 + Object 30532 Tunnel + XP curve 80=1950 95=2385 99=2461 viaContext + DB 6616 scorpia offspring identical vs active 6616 + spawns 7831-7839 Mushroom + Herblore31 + Rumours lvl80 distinct Box trap 53. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 7785, 7786, 6616, 30532, 80, 31.

---

- **Armadyl crossbow 11785 (ticket mislabels 22134 as Adamant kiteshield/Drawers) vs DB 11785 attack_ranged 100 prayer1 ranged_str0 slot weapon Ranged70 weaponType crossbow loader+ammo byte-identical clean:** Ticket 22134 is Adamant kiteshield 22133/Drawers 22134 not armadyl; true armadyl 11785 active bonuses [0,0,0,0,100...1] vs DB items-json 11785 attack_ranged 100 prayer1 ranged_strength 0 weight6 via ItemDefinitionLoader onto cache + RangedData ARMADYL_CROSSBOW ammo table dragon bolt 117/122 + BonusManager index4 range + Equip gate Ranged70 from DB skill-requirements 11785 via loader fallback to cache; 22134 DB object Drawers not weapon so no 110 drift exists; 11785 itself is parity clean on checked subset. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11785, 22134, 22133, 100, 70, 117, 122.

---

- **Werewolf Agility lap 60/730 12-index 22 entries via Agility plugin + ObstacleRunner Werewolf 12-24 via buildIndex sum 730 lapBonus0 skullball explicitly not-done vs Wiki via docs/agility-courses:** Active courses/Werewolf 12-24 stones/hurdles/pipe/deathslide lapXp730 12 indices built via Agility.plugin buildIndex lapBonus Math.max0 round((lapXp-sum)*10)/10 via OBSTACLES_BY_OBJECT + findObstacle + advanceCourse/completeLap + WerewolfAgility trapdoor/ladder/stick 4179 vs DB objects-summary 11641/11643/11638/11657 identity only + items-json 4179 stick + docs/agility-courses 730 5*10+3*20+15+25+200+380 vs Wiki 60 730; lapTotal 50+60+15+25+200+380=730 so lapBonus 0 no missing; Skill/skullball Goals 11651-53 Boss 5923 intentionally Not done documented. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 730, 11641, 11643, 11638, 11657, 11651, 4179, 60.

---

- **Barrows objects 10284 Ladder_29 @5937 vs DB 10284 Ladder + 20667-20672 Staircase + 20723/20724 Chest Stone chest + 35899 Tunnel routing via region 14231 varbit 1394 distinct from Ladder hold not chest:** Active Barrows 14231 region + ObjectIdentifiers LADDER_29 10284 + STAIRCASE 20667-20672 + CHEST 20723/20724 + TUNNEL 35899 via Barrows decode + ObjectDefinition size 2/3 vs DB objects-summary 10284 Ladder 20667-20772 Staircase 20723/20724 Chest 35899 Tunnel + client KOUREND_LADDER_INACTIVE/ BARROWS_STONE_CHEST + region varbit 1394 + stairs 11362 -> chest search not 10284 vs existing AUD-069/NEW-GE-SET/NEW-UI/CAND-088 distinct roots. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 10284, 20667, 20672, 20723, 20724, 35899, 1394, 5937.

---

- **Troll Stronghold herb patch 18816 + Weiss 33176 HERB varbit4771 x2826 y3694 via farming-data 18816 vs Weiss Model.diseaseFree 78 Troll+Weiss immunity permanent via 2800-2840 3670-3710 + 2830-2870 3920-3950 before 27/128 roll vs DB object name Herb patch only via cache not DB table distinct from CAND-105 Harmony:** Active farming-data 18816 2826,3694 vs 33176 2848,3934 varbit4771 via generate-farming-data HERB + patch heuristic vs Model.Farming diseaseFree early HERB true before hosidius/falador + advanceFarm transition vs Patches syncPatch 64-tiles vs DB objects-summary 18818 Herb patch name only gap vs RuneLite cache; Wiki never-diseased Troll vs CAND-105 Harmony 9372 3789,2837 + 21950 missing 7927/4490 gate acknowledges Troll+Weiss present vs CHK-096 Hosidius clean distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 18816, 33176, 4771, 2826, 3694, 2848, 3934, 27.

---

- **Gem bag 12020/24481 + 766/16250 vs Herb sack 13226/24478/33135 families distinct vs DB 12020 Gem bag vs 13226 Herb sack + Casket 12034 medium not herb vs 24457 Canal barge vs DB gem bag not clash vs CAND-150 open/close vs CHK-105 seed/herb identities clean distinct:** Gem bag family 766/12020/24481 vs Herb sack family 13226/24478/33135 via Items cache data vs gameplay definitions vs DB items-json 12020 Gem bag + 24481 open + 13226 herb + 24478 open + cache 24457 canal barge vs ticket 12034 Casket medium + 24457 gem vs DB 12034 Casket + ItemIdentifiers no overlap + Guild.Farming herb sack vs Patches vs docs/motherlode NOT BUILT vs CAND-150 gem bag open/close missing vs CHK-105 seed vault distinct independent distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 12020, 24481, 766, 13226, 24478, 33135, 12034, 24457.

---

- **Nechryael 8/11 max_hit 11 byte-identical active vs DB 8/11 + spawns reachable via NpcDefinitionLoader -> DamageFormulas clean; distinct from CAND-011 soft-clay noted-drop 1761:** Active monsters-complete 8/11 max_hit 11 matches DB monsters-json 8.json/11.json; loader NpcDefinitionLoader 83 maxHit mapping + DamageFormulas calculateMaxMeleeHit consume via getMaxHit; spawns 8 at Slayer Tower 3433,3570 and 11 at 3403,9968 reachable. Verified distinct root from CAND-011 Nechryael 11 item1761 noted-drop omission via drops-json. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8, 11, 11, 1761, 75, 105.

---

- **Bloodveld 484 (and duplicate 485) 120hp max5 melee/magic size2 demon 50 slayer byte-identical active vs DB 484 via monsters-complete:** Active monsters-complete 484 vs DB monsters-json 484.json byte-identical 40+ fields (76cb 120hp max5 melee/magic size2 demon slayer50 120xp 7 masters) + duplicate 485 mirror true. NpcDefinitionLoader -> DamageFormulas clean; spawns Stronghold Slayer Cave reachable. Bounded clean check; no mismatch. Distinct from Jelly 437 CHK and Mutated bloodveld 1225 pending. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 484, 485, 120, 5, 76, 50, 120.

---

- **Dust devil 423 105hp max8 melee/ranged weak1/35 slayer65 byte-identical active vs DB 423 via monsters-complete (distinct from CAND-192 facemask 4164):** Active monsters-complete 423 Dust devil vs DB monsters-json 423.json byte-identical 40+ fields (105hp max8 melee/ranged 105/70/40 def0 weak1/35 slayer65 105xp) + duplicate 7249 Catacombs 130/10. Loader NpcDefinitionLoader -> DamageFormulas clean; spawns Smoke Dungeon 3209,9361 reachable; drops dust_devil tables weight/out present. Facemask 4164 Slayer10 gate already CAND-192 distinct. Bounded clean check; no mismatch. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 423, 7249, 105, 8, 65, 105, 4164.

---

- **Aberrant spectre 2/3/5 90hp max8 magic spectral weak1/50 slayer60 byte-identical active vs DB 2 via monsters-complete (nose peg 4168 CAND-205 distinct):** Active monsters-complete 2 Aberrant spectre vs DB monsters-json 2.json byte-identical 40+ fields (90hp max8 magic def90 magic105 weak1/50 ranged 15/0/15 slayer60 90xp spectral undead) + dupes 3/5 duplicate true. Loader AUD-002 ranged triple collapse informational. Nose peg 4168 Slayer60 omitted already CAND-205 distinct. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 2, 3, 5, 90, 8, 60, 50, 4168.

---

- **Pyrefiend 433-436 45hp max4 melee+magic slayer30 + GWD 3139 48hp max5 vs DB 433/3139 byte-identical + drops pyrefiend 128-roll clean (440 Jelly mislabel):** Active monsters-complete 433 Pyrefiend 45hp max4 + 3139 GWD 48hp max5 vs DB monsters-json 433.json/3139 byte-identical 40 fields. 440 is Jelly 75/5 not pyrefiend; 9471 no monster rows. Drops pyrefiend 128-roll byte-identical both sides. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 433, 434, 435, 436, 3139, 440, 9471, 45, 4.

---

- **Magic shortbow chain 72/861 lvl80 83.3XP + longbow 70/859 lvl85 91.5XP via Fletching 1513 clean — ticket 64 is Maple u mislabel:** Active Fletching.plugin LOG_RECIPE MAGIC_LOGS->MAGIC_SHORTBOW_U_ 80/83.3 T3 + MAGIC_LONGBOW_U_ 85/91.5 T3 + STRINGING 80/83.3 + 85/91.5 T2 vs DB items-json 72/70/861/859 identities. Wiki Magic shortbow u 80/83.3 + longbow 85/91.5 clean. 64 is Maple shortbow u 50/50 not magic. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 72, 70, 861, 859, 1513, 64, 80, 83.3.

---
*Last re-verified: Wave 43 — 2026-10-13 — 64 HOLD/HOLD DUP (arrows/bolts/ammo + jewellery + capes/gloves/boots parity; 2 stream-fails recovered). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-43 for per-wave evidence.*
