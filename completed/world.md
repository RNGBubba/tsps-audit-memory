# Completed — world

> **Verified clean** (88) — bounded no-mismatch checks. Skip re-auditing unless scope changes.

- **Grace slot-5 Toggle Counter interaction (NPC 5919):** Exact `READ-ONLY-DB/docs/npcs-interactions.json:38334-38343` lists slot 5 `Toggle Counter`; active spawn `Typescript-RSPS/server/data/definitions/npc-spawns.json:16311` makes Grace reachable. Cache action hydration populates `NpcDefinition.actions` (`NpcDefinition.ts:70-79,127-129`), NPC_OPTION_5 decodes to click type 5 (`ClientProtocol.ts:654-656`), and `NPCOptionPacketListener.ts:15,24-25,63-97` dispatches the indexed action to the plugin. `Agility.plugin.js:175-181,428-431` registers the exact `Toggle Counter` handler and persists its state. No slot-5 mismatch; View Laps slot 4 and other Grace behavior were not audited. Static bounded trace; no runtime interaction/tests/builds or source/DB changes.

---

- **Pyromancer wearable exact-key review (IDs 20704/20706/20708/20710):** Active `server/data/definitions/item-gameplay.json:20706,20708,20710,20712` matches exact keyed DB records `READ-ONLY-DB/docs/items-json/{20704,20706,20708,20710}.json:17-22,33-50` for item identity, player equipability, body/legs/head/feet slots, all 14 zero bonuses, null requirements, and numeric high/low alchemy (480/320, 420/280, 300/200, 120/80). The active rows' `sellable:false` and DB `tradeable:false` do not establish usable alchemy: `MagicOnItemPacketListener.ts:191-199` gates on runtime tradeability/sellability, and tradeability is cache-derived; no alchemy action or cache decode was performed. No mismatch in the compared fields. Duplicate screening found no available-register match, subject to the partial pending-register recovery caveat. Static review only; other Pyromancer/set-effect behavior excluded.

---

- **Lumberjack wearable exact-key and alchemy eligibility review (IDs 10933/10939/10940/10941):** Active `server/data/definitions/item-gameplay.json:10935,10941-10943` and exact DB keys `READ-ONLY-DB/docs/items-json/{10933,10939,10940,10941}.json:17-23,33-50` match player equipability, slots, all 14 zero bonuses, null requirements, and high/low alchemy 30/20. Active rows set `sellable:false`, while the DB explicitly marks all four untradeable; the shared alchemy consumer rejects untradeable items before value checks (`MagicOnItemPacketListener.ts:191-199`), so no alchemy behavior mismatch results. This is consistent with official item metadata for Lumberjack boots. The Lumberjack XP set effect is separately implemented and outside this equipment-field check; other outfit components/cohorts remain open.

---

- **Ghostly wearable exact-key review (IDs 6106–6111):** Active `Typescript-RSPS/server/data/definitions/item-gameplay.json:6108-6113` matches exact keyed `READ-ONLY-DB/docs/items-json/{6106,6107,6108,6109,6110,6111}.json:17-22,33-50` for item identity, player equipability, slot (boots/body/legs/head/hands/cape), all 14 bonuses, and null requirements. Numeric alchemy values also match every record where active values are nonzero; active zeroes for robe IDs 6107/6108 match neither positive DB alchemy, but these items are untradeable in DB and the active rows set `sellable:false`, so the ordinary alchemy gate cannot consume them (cache-derived tradeability was not decoded). Loader and normal equip/bonus paths were traced (`ItemDefinitionLoader.plugin.js:147-164`; `EquipPacketListener.ts:119-145,216-220`; `BonusManager.ts:39-50,76-85`). No mismatch in compared equipment fields or resulting ordinary equip bonuses. Duplicate screen clear for Ghostly IDs/title in available Memory registers and detailed findings; partial historical recovery caveat remains. Static review only; no live equip, tests/builds, or TSPS/DB edits.

---

- **Silver-bar furnace smelting (item IDs 442→2355):** Active `Smithing.plugin.js:126-151,381-393,405-418,465-495,569-597,718-790,849-860` configures one Silver ore (442) into one Silver bar (2355), level 20, 13.7 Smithing XP, guaranteed success. Exact keys `READ-ONLY-DB/docs/items-json/442.json` and `2355.json` verify ore/bar identities; the DB item records do not encode recipe rules. Current official [Silver bar](https://oldschool.runescape.wiki/w/Silver_bar) confirms level 20, 13.7 XP, one ore, and furnace facility; active bar/ore identifiers resolve to 442/2355 (`ItemIdentifiers.ts:441,2268`). Menu smelting and item-on-furnace routes both reach `performSmeltAction`; success consumes one ore and produces one bar with the configured XP. No mismatch in this recipe slice. Excludes tick cadence, Blast Furnace/Superheat, Varrock armour double-bar chance, quests, and other metals. Duplicate screen found no Silver smelting-specific candidate; broader Smithing issues remain separately recorded. Static review only; no live smelt/tests/builds or TSPS/DB edits.

---

- **Fighter torso official alchemy/equipment check (ID 10551):** Exact DB and active row agree on player equipability, body slot, Defence 40, and all 14 bonuses. Although the active row has positive alchemy values, it is untradeable/unsellable and the ordinary alchemy route requires both flags; current official [Fighter torso](https://oldschool.runescape.wiki/w/Fighter_torso) says it is “Not alchemisable.” Active-versus-DB alchemy numbers therefore do not establish a behavior mismatch. Bounded no-new-mismatch result; no live interaction/tests/builds or TSPS/READ-ONLY-DB edits.

---

- **Motherlode Mine upper-level ladder unlock/transition:** Active `MotherlodeMine.plugin.js` routes the bottom/top base ladders 19044/19045 via Ladder → Climb and checks the saved Percy upper-level unlock before ascent; Percy purchase requires base Mining 57 and 100 nuggets, then saves that unlock. Current official [Motherlode Mine](https://oldschool.runescape.wiki/w/Motherlode_Mine) states the same upper-floor requirements and one-time fee. `ObjectDefinition.ts` resolves player-specific cache multilocs and the object listener dispatches the selected action to the name/action handler; exact DB summary keys 19047–19050 identify Ladder variants and 19051 Bank chest but do not list base IDs 19044/19045 or encode route semantics. No mismatch in this bounded gate/transition slice; placements and full object-variant mapping were not audited. Duplicate screen found only the distinct northern Dark tunnel diary route candidate. Static review only; no live traversal, tests/builds, or source/DB edits.

---

- **Lunar armour wearable cohort (IDs 9096–9100):** Active gameplay rows `Typescript-RSPS/server/data/definitions/item-gameplay.json:9098-9102` match exact authoritative `READ-ONLY-DB/docs/items-json/{9096,9097,9098,9099,9100}.json:17-23,33-52` for player equipability, slots, all 14 bonuses, Magic 65 + Defence 40 requirements, and numeric high/low alchemy 60/40. Active tradeable/sellable flags and DB untradeable status align; the normal alchemy route rejects the items before using configured alchemy values. Loader copies active rows (`ItemDefinitionLoader.plugin.js:143-164`); ordinary equip checks supplied requirements (`EquipPacketListener.ts:119-145`), and BonusManager aggregates all 14 fields (`BonusManager.ts:39-50`). Duplicate screen found Lunar cape 9101 is separately covered, not this five-piece cohort. Static item-presence route only; no acquisition route or live equip/alchemy was verified; no tests/builds or source/DB edits.

---

- **Non-members-world prayer gate (Retribution/Redemption/Smite):** Active `FreeToPlay.plugin.js:78-82,111-126` rejects prayer requirements above 45 when running on a non-members world; active prayer definitions set Retribution 46, Redemption 49 and Smite 52 (`PrayerHandler.ts:504-506`), so the hook blocks all three. Exact DB prayer keys 22–24 independently mark them members-only and give the same levels; current official [Prayer](https://oldschool.runescape.wiki/w/Prayer) marks these unlocks members-only. `PrayerHandler.canUse()` runs the plugin veto before the ordinary level check (`:228-243`). Shipped `world.json` leaves `membersWorld` absent, which defaults to members (`WorldDefinition.ts:176-180`), so this review establishes correct gate logic only, not shipped-world exposure. Bounded no-mismatch check; static trace only, no live activation/tests/builds or TSPS/READ-ONLY-DB edits.

---

- **Incoming Trade/Group chat filter (type 101):** Active `Trading.requestTrade()` sends the receiver a chat line with raw type 101 plus a separate `TRADE_REQUEST` packet; neither is gated by the Trade filter. The client decoder preserves type 101, `OsrsClient` adds the sender-prefixed line to chat history and marks chat transmit, and cache CS2 applies synchronized Trade/Group modes to message types 101/103/113 (`server/src/main/typescript/elvarg/game/content/Trading.ts:46,133-163`; `client/network/packet/ServerBinaryDecoder.ts:1107-1135,1704-1710`; `client/game/OsrsClient.ts:3067-3090`; cache scripts 90/175). Current official Chat Interface rules describe Show none as filtering received requests/messages from the chat tab; separate request-state delivery is outside that display filter. No mismatch in this bounded receive/display path. Duplicate screen found no matching Memory item; no live interaction, tests/builds, or TSPS/READ-ONLY-DB edits.

---

- **Protect from Missiles vs player ranged damage:** Exact `READ-ONLY-DB/docs/prayers-json/18.json:1-10` identifies Prayer 18, Prayer 40, and 20/minute drain; it does not specify the player-vs-player reduction. Active `PrayerHandler.ts:17-32,105-146,496-508` maps widget child 22 to runtime index 17 and gates activation; `NetworkBuilder.ts:529-531` dispatches the widget action. Player ranged attacks resolve through `RangedCombatMethod.ts:17-25`, `PendingHit.ts:144-253`, and `CombatFactory.ts:173-205,230-250,785-832`; the matching active protection prayer applies `PRAYER_DAMAGE_REDUCTION_AGAINST_PLAYERS = 0.6` (`CombatConstants.ts:1-12`), i.e. 40% reduction, matching the current official [Protect from Missiles](https://oldschool.runescape.wiki/w/Protect_from_Missiles) rule. This is distinct from NPC prayer exceptions. No mismatch in this bounded player-vs-player damage slice; no runtime combat/tests/builds or TSPS/READ-ONLY-DB edits.

---

- **Sailing SET_HEADING and boat world-entity synchronization (opcode 214):** Client helm steering sends semantic `set_heading` with a masked 0–15 heading (`client/game/sailing/HelmSteering.ts:37-75,114-163`; `client/network/serverConnection/outgoing/movement.ts:9-13`), encoded as one-byte opcode 214. Server packet table/decoder and `NetworkBuilder.ts:282-288` accept the same opcode/length/value and route to `BoatManager.setHelmHeading`; it validates helm ownership/range before setting authoritative boat heading. `BoatMovement` advances authoritative pose; `WorldEntitySync.ts:36-115,132-134` serializes pose changes/spawns and client inbound sync applies them to `WorldEntity`. No wire/state/sync mismatch in this bounded transition. `READ-ONLY-DB` contains no packet contract. Duplicate screen found no SET_HEADING/helm transition entry in available audit registers; static only, no live sailing, tests/builds or TSPS/READ-ONLY-DB edits.

---

- **Superhuman Strength prayer ID 7:** Exact `READ-ONLY-DB/docs/prayers-json/7.json:2-12` and active `PrayerHandler.ts:483-490` agree on Prayer 13, +10% Strength, and 10 points/minute drain. Client prayer metadata and the active melee max-hit consumer apply the same effect; current official rules reserve the below-20 +1 minimum for Burst of Strength (ID 2), not this prayer. Bounded no-mismatch result; other prayers and combined-drain behavior remain outside scope. Static trace only; no tests/builds or source/DB changes.

---

- **Druid robe wearable exact-key review (IDs 538/540):** Active rows `Typescript-RSPS/server/data/definitions/item-gameplay.json:540,542` match exact `READ-ONLY-DB/docs/items-json/538.json:17-23,33-50` and `540.json:17-23,33-50` for player equipability, legs/body slots, all 14 bonuses (Prayer +4; other fields zero), null requirements, and high/low alchemy 18/12 and 24/16. `ItemDefinitionLoader.plugin.js:126-164` overlays active fields onto cache-hydrated definitions; `EquipPacketListener.ts:119-145` checks only supplied requirements and equips the active slot; `BonusManager.ts:39-50` aggregates the active bonuses. `MagicOnItemPacketListener.ts:174-225` requires cache-derived tradeability plus active sellability and alchemy values; cache membership was not independently decoded and no live alchemy was attempted. No mismatch in this bounded two-item sample; the item-definition loading pipeline remains open. Duplicate screen found no matching IDs/titles in available registers. Static only; no tests/builds or TSPS/READ-ONLY-DB changes.

---

- **Ferox Pool of Refreshment object route (39651):** Exact `READ-ONLY-DB/docs/objects-summary.json:79330-79334` identifies 39651 as Pool of Refreshment. The active Ferox plugin registers `Pool.FeroxEnclave.js:10-20` for `Drink`; `ObjectActionPacketListener.ts:32-60,67-84` resolves the live object/cache definition, action slot and emits the matching named handler. `Common.FeroxEnclave.js:31-41` restores current skills to max, clears poison/venom/disease, restores run energy, and deactivates prayers; `SkillManager.setCurrentLevels()` changes temporary/current levels without base XP (`SkillManager.ts:531-539`). The handler does not change special-attack energy, matching current official [Ferox Enclave](https://oldschool.runescape.wiki/w/Ferox_Enclave) mechanics. Active cache target is `osrs-241_2026-09-30`; custom object-spawn override file is empty, so static map-object reachability depends on the selected cache. No same object/route result in screened Memory registers. Existing Ferox handler test fixture exercises restore (`server/tests/ferox-enclave.test.cjs:141-155`); not run. Bounded clean result; no source/DB edits or live interaction.

---

- **Bryophyta/Growthling combat-stat sample (NPCs 8195/8194):** Active `monsters-complete.json:2550-2551` matches exact authoritative monster keys 8194/8195 for the checked combat cadence, combat level, max-hit and attack inputs; Bryophyta's dedicated lair configuration separates its melee 16 and magic 10 maxima. Loader mapping and combat-provider resolution were traced, including Growthling's dynamic spawn. No mismatch in the bounded field set; elemental weakness, drops, poison, and other fields were excluded. No live combat/tests/builds or source/DB edits.

---

- **Motherlode Mine sack Search transfer path:** Client object-action packet, server decoder/listener, active plugin registration, sack handler and ItemContainer insertion/persist/sync flow were traced. Search transfers only quantities accepted by inventory capacity, decrements only transferred sack counts, and persists/synchronizes remaining state. Exact DB keys identify outputs; action exposure for active handler ID 26688 was not independently decoded, so no broader object-ID/action parity claim is made. No mismatch in bounded transfer logic; static only, no tests/builds or source/DB edits.

---

- **Angler wearable exact-key review (IDs 13258–13261):** Active `Typescript-RSPS/server/data/definitions/item-gameplay.json:13260-13263` matches exact `READ-ONLY-DB/docs/items-json/{13258,13259,13260,13261}.json:17-23,33-50` for player equipability, head/body/legs/feet slots, all 14 zero bonuses, and null requirements. Active alchemy values differ on hat, top, and boots, but all four active rows are `sellable:false`; the ordinary alchemy listener rejects them before consuming items or using values. No mismatch in this bounded equipment/alchemy behavior; set XP was outside this completed slice and is separately recorded as a candidate in `02_Pending_Audits.md` (also summarized in `05_Audit_Log.md`). Static trace only; no tests/builds or source/DB edits.

---

- **Prospector wearable exact-key review (IDs 12013–12016):** Active `Typescript-RSPS/server/data/definitions/item-gameplay.json:12015-12018` matches exact `READ-ONLY-DB/docs/items-json/{12013,12014,12015,12016}.json:17-23,33-50` for player equipability, head/body/legs/feet slots, all 14 zero bonuses, and null requirements. Ordinary equip loads these slots and checks supplied requirements; BonusManager sums the active bonus arrays. Other item fields such as weight were outside this bounded comparison. The outfit's missing +2.5% Mining XP effect is an existing separate candidate (normal/golden/Volcanic Mine set coverage), not an equipment-parity mismatch. No new mismatch; static only, no tests/builds or source/DB edits.

---

- **Zombie aggressive sample ID 26 (Zombie Level 13,1) — active aggressive true matches DB + name-guard pass + spawn lifecycle via NpcSpawnDefinitionLoader:** NpcDefinitionLoader.fromMonsterDump maps aggressive true with name-guard 214; monsters-complete.json 26 aggressive true byte-identical to DB; NpcDefinition aggressive/allowTolerance + NpcAggression + AggressionTolerance 1000 ticks; spawn via NpcSpawnDefinitionLoader 37-108 -> NPC.create + World.add. Sample-level parity, spawn lifecycle verified. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 26, 2452, 9684.

---

- **Easy clue MAP family (2713/2716/2719/3516/3518 + Interface 337 MAP006) present and matches DB keyed records — no handler mismatch, data-driven clue gated by tier ownsClue:** Active item-gameplay 2713 MAP001 etc set-of-instructions tradeable false + client ItemID TRAIL_CLUE_EASY_MAP + InterfaceID 337 + DB items-json 2713/2716/2719/3516/3518 keyed name/examine match. Triple match, reading via interface 337 not server handler; distribution via tier-level gate. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 2713, 2716, 2719, 3516.

---

- **Prayer Sharp Eye (prayer 8 index 3, drain 5) varbit 4122 activation + 105% Ranged attack/strength consumers match DB prayers-json 4 drain 5 requirements {prayer:8}:** PrayerHandler PrayerData Sharp Eye index3 RANGED_PRAYERS canUse 8 + reset groups, drain sum resistance 60+bns*2, AccuracyFormulasDpsCalc 155-158 105% ranged attack, DamageFormulas 112-115 105% strength, DB prayers-json 4 {drain_per_minute 5, requirements prayer:8, bonuses ranged:5} identical. Single prayer sample clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 4, 8, 4122, 27.

---

- **Wyrm 8610 (Wyrm Idle) combat stats vs DB monsters-json 8610 exact — aggressive false, combat 97, size3, hp120, max13, speed4, levels 85/60/80/80/80, bonuses 0/30/0/30, def 10/50/50/50/20/20/10, elemental 3/50, slayer 62/123 match; npc-combat-defs anims server-side only:** Monsters-complete 2623 vs monsters-json 8610 identical; NpcDefinitionLoader fromMonsterDump name-guarded + stats slots; consumer AccuracyFormulasDpsCalc.npcAttackBonus. Single-ID bounded parity verified; deathTicks 4 vs default 2 is server-side only. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 8610, 120, 13, 97.

---

- **3rd Age ranged cohort 10330/10332/10334/10336 bonuses/slots/requirements (Def 45+Ranged 65) and alchemy high/low match exact DB equipment records — 4-piece clean:** Active gameplay 10330 body bonuses -15,30,55,47,60,60,55 etc req [0,45,0,0,65] high30480 low20320; 10332 legs -10,17,31,25,33,30,31 etc req same high30360 low20240; 10334 coif -2,9,4,7,10,5,8 req same high30240 low20160; 10336 vambraces -10,11,6,5,7,9,0 req same high30300 low20200. DB 10330/10332/10334/10336 equipment slot/bonuses/requirements/alchemy identical. ItemDefinitionLoader/Equip/BonusManager/MagicOnItem consumers traced. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 10330, 10332, 10334, 10336.

---

- **Dialogue splice single variant: NPC 1314 Bartender (Dead Man's Chest) standard-dialogue 3-option choice (Nothing/Grog/Rum) matches DB docs/dialogues/b10ac701f92309d3.json via NpcDialogues flatten/nest/presentMenu — no loss:** Active npc-dialogues.json Bartender + index 1314 variants standard-dialogue vs DB dialogues b10ac701 3-option menu + manifest + index 9153 mirror; Runtime pickVariant->flatten/nestOrphanConditions/resolveCondition/resolveJump->presentMenu DialogueChainBuilder preserves options. Single variant clean, no duplicate AUD/CAND/CHK for Bartender. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 1314, b10ac701.

---

- **Quest persistence Cook's Assistant varp 29 — attribute quest.cooks_assistant.stage persisted via PlayerSave + QuestRuntime registerQuest/sendConfig; varp 29 ephemeral mirror clean:** CooksAssistant.Quest.js varp 29 started 1 complete 2 registerQuest cooks_assistant; QuestRuntime 292-308 persistAttribute + setStage sendConfig 29 + refreshQuestList, login 255-273 only sends header varps 101/1782/6347/11877; PlayerSave 42-53 persistAttributeKeys + 581-596 migrateAttributeKey + 681-684 fromPlayer clone; DB has no varp table, Wiki authoritative stage values; no persistence conflict. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 29, 101, 1782, 6347.

---

- **Grand Exchange offer escrow per-offer atomic — copy-check-swap + single PlayerPersistence save for inventory+attribute clean (contrasts Trade dual-save non-atomic CAND-108):** GrandExchange.plugin confirm 258-272 copy-check-swap then single completedOffers[slot]= + saveOffers 275-278, collect 296-323 copy-check-swap destination then single delete+save 330-332, abort single + save, timers scheduleCompletion re-save finished 75-110; PlayerSave PLAYER_PERSISTENCE single save serializes both containers; ItemContainer getCopiedItems/swap + Inventory/Bank Stacks 28/352 + GameConstants cap; crash before save rolls back both, after commits both; no dupe/loss window; DB no container keys. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 28, 352, 10.

---

- **Dialogue Hans 3105 standard-dialogue 5-option choice splice preserves options via pickVariant/flatten/nestOrphanConditions/presentMenu clean (second dialogue sample distinct from Bartender 1314):** Active npc-dialogue-index 3105 Hans variants standard-dialogue + npc-dialogues Hans 5-option choice; NpcDialogues.plugin pickVariant default>standard 29-60 + flatten 122-197 collectPageOptions nestOrphan presentMenu OptionDialogue; DB dialogues 62f257429c4fbc89 default standard-dialogue 5 options (Looking../kill../don't know../tell../Nothing) + manifest 1341 + DB index 3105 mirror; CHK-049 Bartender 1314 3-option distinct; no loss. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 3105, 62f257429c4fbc89, 5.

---

- **Armadyl blessed dragonhide 12506/12508/12510/12512 bonuses/slots/reqs/alchemy Def40+Ranged70 + bonuses exact DB match clean (4-piece cohort):** Active item-gameplay 12506 bracers GLOVES -10,11,6,5,7,8,0,1 req40/70 high2400 low1600 + 12508 body BODY -15,30,55,47,60,50,55 7800/5200 + 12510 chaps LEGS -10,17,31,25,33,28,31 3600/2400 + 12512 coif MED_HELMET head -1,7,4,7,10,4,8 1200/800 vs DB items-json 12506/12508/12510/12512 equipment slot/requirements/bonuses/alchemy identical; ItemDefinitionLoader/Equip/BonusManager/MagicOnItem traced. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 12506, 12508, 12510, 12512.

---

- **Prayer Hawk Eye (prayer 26, DB id 12, drain 10) — varbit 4124 + 110% ranged attack/strength via RANGED_PRAYERS grouping clean:** PrayerHandler HAWK_EYE PrayerData 26/10 button 19816 config 4124 PRAYER_BY_CHILD 28->11 RANGED_PRAYERS reset logic; Activation toggle + canUse 26 + processDrain 10*0.6=6.0 per tick resistance 60+bonus*2 -> 10/min; Consumers AccuracyFormulasDpsCalc 155-172 110% attack + DamageFormulas 104-122 110% strength; DB prayers-json 12 Hawk Eye 26/10.0 ranged 10 exact; Wiki Increases Ranging by 10% 10/min; Grouping mutual exclusion verified, no drain mismatch. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 12, 26, 4124, 19816.

---

- **Clue scroll hard anagram 19904 ZHLUG ROG PDQ examine cache-derived only — gameplay JSON examine A set of instructions is never applied (loader ignores examine, cache opcode 3 authoritative) clean partial-data drift:** Active item-gameplay 19904 Clue scroll (hard) examine A set of instructions vs DB items-json 19904 + infobox_cleaner hard-> A clue! + cache dump no examine field; ItemDefinitionLoader 143-164 copies bonuses/reqs/alch only, examine from cached.examine (ItemDefinition 100-101 ObjType opcode 3); gameplay examine drift not player-visible; family hard 2722-2748/19840-19911 vs master 19835 control Hopefully leads confirms rule; second clue sample clean, distinct from CAND-107 casket stackability and CAND-113 distribution tier gaps. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 19904, 2722, 19835, 7250.

---

- **Ground item Take OPOBJ1 opcode 102 len7 [byteSub ctrl][shortLE Y][shortAdd id][shortAdd X] vs Examine EXAMINE_OBJ 104 len6 take/pickup vs examine distinct framing/dispatch clean:** Client ClientPacketId OPOBJ1 102 len7 Take vs EXAMINE_OBJ 104 len6 + MenuAction GroundItemFirstOption 18 vs ExamineGroundItem 1004 encode ctrl+LE/Add transforms vs server NativeClientPackets 79/80/157 mirror + ClientProtocol native OPOBJ1 byteSub+shortLE+shortAdd+shortAdd optionIndex1 vs examine short+shortLE+shortLE option Examine + high GROUND_ITEM_ACTION 232 varlen + NetworkBuilder ground_item_action -> groundItemAction pickup vs examine branches -> PickupItemPacketListener privateArea/stackId/busy walkToGroundItem ItemOnGroundManager vs examine sendMessage + SecondGroundItemOption for non-take; DB 526 Bones identity only; CHK-025 examine clean distinct root. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 102, 104, 232, 526, 1004.

---

- **Zamorak blessed d'hide 6-piece 10368/10370/10372/10374/19936/23194 bonuses/slots/reqs Def40+Ranged70 + alchemy exact DB 10368/10370/10372/10374/19936/23194 clean (6-piece cohort):** Active item-gameplay 10368 bracers GLOVES -10,11,6,5,7,8 prayer1 req40/70 high2400 low1600 + 10370 body PLATEBODY -15,30,55,47,60,50,55 7800/5200 + 10372 chaps LEGS -10,17,31,25,33,28,31 3600/2400 + 10374 coif COIF -1,7,4,7,10,4,8 1200/800 + 19936 boots FEET -10,7,4,4,4,4,4 5580/3720 + 23194 shield SHIELD -15,-15,-11,-10,7,21,18,16,15,14 17000/11333 vs DB items-json 10368/10370/10372/10374/19936/23194 slot/requirements/bonuses/alchemy identical; Loader hydrateEquipmentType etc copies bonuses/reqs/alch weight not runtime; Equip/BonusManager traced; weight drift not copied. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 10368, 10370, 10372, 10374, 19936.

---

- **Preserve prayer 55 DB id 25 drain 3.0 + 50% boosted-stat duration (90 vs 60 ticks) parity vs DB prayers-json 25 exact — drain/varbit clean (warm-up 15s AUD-020 is separate):** DB prayers-json 25 Preserve members true drain_per_minute 3.0 req55 bonuses {} 50% longer + schema; Server PrayerHandler PRESERVE PrayerData 55/3 config5466 + SkillManager varbit5453 unlock + canUse 55 + processDrain 3*0.6 resistance + Player 447-493 90 vs 60 via isActivated(PRESERVE); DB vs server drain 3.0==3 + requirement 55 match + bonuses {} + members null + varbit 5453/5466 wiring consistent; Warm-up 15s before effect is Wiki-only not DB, already AUD-020 (Player 3x90s no age check) not re-filed; Torn scroll 21047 vs Null 2542 is current-rule not DB contradiction. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 25, 55, 3, 5466, 5453.

---

- **King Black Dragon 239 combat parity byte-identical active monsters-complete vs DB monsters-json 239 (lvl 276 hp240 max25 att240 str240 def240 magic240 range1 def stab40 slash90 crush90 magic80 ranged 70/40 slayer1 dose) loader + formula consumers clean:** DB monsters-json 239 KBD 276 size5 hp240 max25 stab+dragonfire speed4 aggressive/poison true slayer_level1 att240/str240/def240/magic240/range1 atkBonus 0 def stab40 slash90 crush90 magic80 ranged light70 standard70 heavy40 elemental 2/50; Active monsters-complete 117 byte-identical; Loader NpcDefinitionLoader 62-243 CombatStats + fromMonsterDump name-guarded stats 0-4/5/7/9/10-14 hitpoints 240 speed4 max25; Definition slots 0-4/5/7/9/10-14 cache hydrates combatLevel 276 size5; Consumers AccuracyFormulas defenceBonus 10+index npcAttackBonus slots effective levels stats+9; generic gaps elemental dropped AUD-001 + ranged collapse AUD-002 are distinct engine roots not data mismatches. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 239, 276, 240, 25, 70.

---

- **Saradomin blessed d'hide 4-piece 10384/10386/10388/10390 bonuses/slots/reqs Def40+Ranged70 + alchemy exact DB 10384/10386/10388/10390 clean (distinct from Armadyl 12506 and Guthix 10376 cohorts):** Active item-gameplay 10384 bracers GLOVES -10,11,6,5,7,8 prayer1 req40/70 high2400 low1600 + 10386 body PLATEBODY -15,30,55,47,60,50,55 7800/5200 + 10388 chaps LEGS -10,17,31,25,33,28,31 3600/2400 + 10390 coif COIF -1,7,4,7,10,4,8 1200/800 vs DB items-json 10384/10386/10388/10390 slot/requirements/bonuses/alchemy identical; Loader hydrates type copies bonuses/reqs/alch weight not runtime; Equip Slot mapping GLOVES->HANDS 9 BODY->4 LEGS->7 COIF->0, req gate, BonusManager consumed; weight drift inert; dup-screen 0 hits for Saradomin 10384 cohort. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 10384, 10386, 10388, 10390, 40.

---

- **Firemaking Magic logs 1513 burn Lv75 303.8 XP campfire 137 ticks +38 max300 vs Wiki/DB identities clean (value 1218 vs cost320 GE snapshot only):** Firemaking.plugin LIGHTABLE_LOGS 59 Lv75 XP303.8 campfire ticks 137 +38 max300 create/extendTicks session generic fire 100-198 vs READ-ONLY-DB items-json 1513 Magic logs tradeable noteable cost320 weight2 buy12000 + items-complete mirror + item-gameplay 1515 examine/weight/highAlch/lowAlch match DB value1218 only GE drift + ItemIdentifiers MAGIC_LOGS 1513 + tests firemaking 75/303.8 + Wiki Firemaking/Magic_logs/Foresters Campfire 75 303.8 137+38 max300 5-tile; 3-way triangulation exact level/XP/campfire match; value field not gameplay. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 1513, 75, 303.8, 137, 320.

---

- **NPC spawn lifecycle Hans 3105 single static spawn 3207,3233,0 via NpcSpawnDefinitionLoader -> NPC.create -> World MobileList add queue; death NPCDeathTask deathTicks -> World remove queue -> NPCRespawnTask clone -> add queue; hot-reload + World tick order clean (second spawn sample distinct from Zombie 26):** NpcSpawnDefinitionLoader DEFAULT_WANDER_RADIUS5 CLIENT/SERVER mapping toDefinition validation applyToWorld capacity+NPC.create+setRadius+setFace+World.add + spawnedNpcs tracking + removePreviouslyAppliedNpcs splice queues MobileList SlotMinHeap 32768; NPC clone create spawnPosition facing radius; NPCDeathTask ticks deathTicks emit PluginNpcDeath -> remove respawn ticks -> NPCRespawnTask clone -> World.addNPCQueue; World.process TaskManager ground_items add/remove players add/remove NPCs processNpcMechanics updateLocalNpcs flush; NPCMovementCoordinator radius0/5 wandering 26% roll; Distinct second sample from CHK Zombie 26. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 3105, 3207, 3233, 5, 32768.

---

- **Dialogue Ned 824/4280/5864 multi-variant 4+7+1+1 splice 824/5865 legacy vs DB 86165/e8277/cc078/fa350 variants slug-identical + DragonSlayer/PrinceAli selectors clean (third dialogue sample distinct from Hans 3105/Bartender 1314):** Active npc-dialogues Ned 4 variants kV2zlz JqCMUq etc + DSI 7 + PAR 1 + Hist 1 via index 824/4280/5864 triples identical to DB 86165 4 default before/after treasure + e8277 7 DSI + cc078 fa350; NpcDialogues.plugin pickVariant/flatten/nestOrphan/collectPageOptions/resolveJump/presentMenu preserve Yes/No rope wool below jumps; DragonSlayer NED_NPC_IDS 818,5865,824,4280,5864 selector VARP176 stage + answerCondition map/ship + PrinceAli 4280 stage20-100 wool wig; Shops none slot but interface; dup 0 hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 824, 4280, 5864, 818, 5865.

---

- **Trade accept second path CONFIRM_SCREEN -> ACCEPTED_CONFIRM_SCREEN confirmScreen exchange via Trading.acceptTrade inventory.addItem + Trading.save both + encodeTradeClose clean (second trade sample distinct from GE escrow):** Trading.acceptTrade 236-326 INVENTORY 3322 OFFER335 CONFIRM334 INVENTORY336 TradeState NONE..ACCEPTED_CONFIRM_SCREEN validates button_delay first-stage slotsNeeded check second-stage CONFIRM_SCREEN sets ACCEPTED_CONFIRM_SCREEN exchange inventory.addItem both PluginManager.emitTradeCompleted Trading.save both resetAttributes encodeTradeClose sendInterfaceRemoval; NetworkBuilder trade_action accept/confirm_accept -> acceptTrade state decides path + ClientProtocol TRADE_ACTION 0-5 + ClientBinaryEncoder tradeAction byte/short/int vs ServerPackets TRADE_REQUEST 154 OPEN155 UPDATE156 CLOSE157; TradeState offer/confirm stages distinct from GE per-offer atomic CHK-057. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 3322, 335, 334, 336, 154.

---

- **Krystilia Wilderness slayer 7663 tasks 37 inc black-dragon [8,16] ext[40,60] byte-identical TSPS vs DB slayer-tasks.json clean (brutal black dragon not a Wilderness task, belongs to Duradel/Konar):** Active server/data/definitions/slayer-tasks.json 7663 Krystilia 37 tasks black-dragon qty[8,16] ext[40,60] npc_names[black dragon] vs Authoritative docs/slayer-tasks.json 7663 lines 4875 identical every task brutal excluded; Runtime Slayer.plugin loads SLAYER_MASTERS assignTask slayerLevel filter + weight roll randomInclusive quantity no extended_quantity isTaskNpc exact lowercased name match getCurrentDefinition; Update.py fetches 10 masters resolves npc_names via monsters-complete; Dup-screen 0 Krystilia hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 7663, 7663, 8, 16, 40.

---

- **Dialogue Wise Old Man 2108 family 14 IDs 19 variants 3082 is Phoenix not WOM vs DB 4ad1b0bed7d9d82f 19 variants slug-identical + manifest + NpcDialogues flatten/nest/presentMenu preserve 5-option initial clean:** Active npc-dialogue-index 2108/2110/2111/2112/2113/4306 etc 14 IDs each Transcript Wise Old Man 19 variants standard-dialogue-initial/subsequent + using-items x6 + telescopes etc vs DB index 2108 identical 19 + DB 4ad1b0 4606 lines default subsequent 5-option Could I have free stuff etc + manifest 2966 Transcript Wise Old Man; Active npc-dialogues Wise Old Man default subsequent 19 keys preserved + NpcDialogues pickVariant 29-60 flatten 122-197 nestOrphan collectPageOptions resolveJump 360-470 presentMenu paginated More... Vampyre Slayer conditions/jumps; Task label 3082 is Phoenix pet not WOM no active index key for 3082; No duplicate registry for WOM splice. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 2108, 3082, 4306, 8407, 19.

---

- **Construction Mahogany table built 13298 Dining hotspot 15298 level52 xp840 6x8782 vs DB objects-summary 13298 name match clean (flatpack 8558 tradeability out-of-scope):** ConstructionData CONSTRUCTION_HOTSPOTS DINING_TABLE 15298 MAHOGANY_DINING_TABLE buildables CONSTRUCTION_BUILDABLES level52 xp840 menu8120 menuRow5578 object13298 6x8782 KITCHEN_TABLE 3 variants; ConstructionPlugin HOTSPOT_BY_OBJECT_ID + BUILDABLE_BY_KEY menuRowId scripts 1404/1406 hammer/saw + buildFurniture anim3676 setFurniture XP + PlayerHouseInstance placement; DB objects-summary 13298 Mahogany table 15473 duplicate 39896 name match + items-json 8558 flatpack tradeable true vs 8120 interface placeholder + cache icon; No flatpack crafting path, construction flow only; dup 0. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 13298, 15298, 8120, 8558, 8782.

---

- **General Graardor 2215 general_graardor main127 vs DB byte-identical + Bandos chestplate 11832 bonuses 98/93/105/133 Def65 vs DB equip/alchemy identical clean (GWD private-area 40KC gate not DB):** Active npc-drops 81403 general_graardor main127 22 entries tertiary4 brimstone true vs DB docs/drops 80712 identical; Runtime NpcDrops tablesByNpc rollTable rollOnce dropFor + GodWars Encounters PrivateArea killCount40 ECUMENICAL_KEY respawn150 + GeneralGraardor MELEE 60 crush vs RANGED slam + GodWarsShared generalIds 2215/2216 room2840-2900 + monsters 2215 Graardor 255HP combat624 + items 11832 Bandos chestplate body bonuses 98/93/105 133 Def65 cost290k low116k high174k identical to DB items-json 11832; clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 2215, 127, 11832, 2216, 2840.

---

- **Kree'arra 3162 Normal + 6492 PvM Arena + 12443 Deadman Apocalypse + 15697 duplicate 580/255/69 byte-identical to DB + kreearra drops 127-roll identical + spawn 2832,5302 + combat 69/21/25 clean:** Active monsters-complete 3162 Kree Normal 580/5/255/69 melee+ranged+magic s3 slayer1 att300/def260/mage200/range380 elemental 1/30% vs DB 3162/6492/12443/15697 byte-identical (duplicate true for 15697) + drops kreearra 127-roll 8/127 hides runes 44/127 coins paired potions separate + tertiary 1/5000 pet + spawn 2832,5302 + bodyguards + KreeArra.GodWars 69/21/25 wind6980 6/2/2 split halberd-gated + dialogue overhead; paired-potion prose already candidate separate. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 3162, 6492, 12443, 15697, 127.

---

- **Piscatoris Falconry Catch with Gyr Falcon 5531 spotted 43/104 5532 dark 57/132 5533 dashing 69/156 + Matthias 1340 hire vs DB npcs-interactions 5531 Catch + dialogue 1340 vs items-complete 10023 glove /10125 furs clean (120-line submodule of Hunter):** Catching.Hunter hire 43 Hunter 500coins empty weapon/shield -> FALCONERS_GLOVE_2 + catchFalcon level+nearby 8 + available + reserve 2t ANIM.FALCON5162 chance spawn GYR_FALCON 1342-1344 at kebbit tile blockMovement untargetable hide kebbit due tick+100 + retrieve Bones+fur exchange vs Data falconry 5531 43/104 10125 +5532 57/132 10115 +5533 69/156 10127 furs GYR 1342-1344 low26 high310 vs DB npcs-interactions 5531 speedy Catch etc + dialogue Matthias 4 sections + items-complete glove 10023 furs 10125; clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 5531, 5532, 5533, 1342, 1343.

---

- **Construction Oak tables POH 13294 Oak + 13295 Carved oak + 13578 Kitchen 22/240 31/360 32/180 vs wiki clean (Mahogany Homes 24887 Oak table dialogue but zero MH handler orphan informational):** ConstructionData DINING_TABLE15298 OAK_DINING_TABLE 22/240 13294 4x8778 CARVED_OAK31/360 13295 6x8778 KITCHEN_TABLE15405 OAK_KITCHEN32/180 13578 3x8778 vs ConstructionPlugin BUILDABLE_BY_KEY HOTSPOT_BY_OBJECT buildFurniture hammer/saw level/material anim3676 XP vs DB items-json 8116 Oak dining incomplete +8552 Carved oak flatpack members true cost10 vs 24887 Oak table MH incomplete separate family + dialogues 098a MH Oak table conditions + npc-dialogue-index Mahogany Homes 5 tiers transcript orphan no plugin handler + DB cache data value drift expected POH non-tradeable; POH clean, MH handler missing orphan not filed pending (no runtime quest for MH furniture). — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 13294, 13295, 13578, 8116, 8552.

---

- **Reward casket (beginner) 23245 stack true weight0 examine I hope this was easy loot vs DB items-json 23245 stack true weight0 cost50 low20 high30 parity clean (compliments CAND-107 family which inaccurately includes 23245 as mismatched but loader ignores stack/weight anyway):** Active item-gameplay 23245 stack true weight0 value50 high30 low20 examine I hope this was easy loot vs DB items-json 23245 stack true weight0 cost50 low20 high30 equip false members false + items-cache 20543 elite etc stack true by ALWAYS + DB Wiki complement; ItemDefinition hydrateFromCache stack ALWAYS/weight/examine + Loader copies only doubleHanded/sellable/highAlch etc not stackable/weight/examine so elite family false weight5 inert runtime still cache stack true; CAND-107 lumps 23245 incorrectly but open flow still missing for family; 23245 single ID parity clean. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 23245, 20543, 20545, 19836, 20546.

---

- **Phantom Muspah 12077/12078/12079/12080/12082 +15549 deadman definitions 5 forms byte-identical vs DB 12077-12082 + spawns 12079 2844,4255 + drops phantom_muspah main235 identical clean (no boss plugin gap already CAND-043/046 separate):** Active monsters-complete 12077-12082 15549 verbatim mirror READ-ONLY-DB 12077 Ranged 12078 Melee 12079 Shielded 75HP anomaly 12080 Post-shield + npc-spawns single 12079 2844,4255 + drops phantom_muspah main235 38 entries unique/supplies separate + items 27614 shard note-only + NpcDrops no shard suppression + spawns vs DB no boss plugin exists explicit gap docs/npc-spawns 115; definitions/drop parity clean distinct from handler gap CAND-043/046. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 12077, 12079, 12080, 15549, 2844, 235.

---

- **Obor 7416 byte-identical TSPS monsters-complete key 7416 vs DB monsters-json 7416 + monsters-complete 7416 all 38 fields + lair custom max 22/26 anim 4666/7183 via giant-boss-lairs clean distinct from chest CAND-114:** TSPS monsters-complete 2362 Obor 7416 single-line JSON combat 38 fields vs DB monsters-json 7416 + monsters-complete 133525 second copy byte-identical + cache no 7416 row + lair config giant-boss-lairs boss7416 custom maxHit melee22 ranged26 anim4666 + Obor.GiantLairs combat provider 7416 reach/knockback + drops obor main135 separate from chest obor_chest118 distinct root CAND-114 chest; parity clean 38 fields. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 7416, 56380, 118, 135, 4666, 2362.

---

- **Clue scroll (hard) 19840 16.48N 30.01W sextant 19840 vs DB 19840 cost20 low8 high12 weight0.02 A clue! examine cache opcode3 authoritative clean (loader ignores examine, sellable false gate blocks alch, duplicate-screen 19904 distinct):** DB items-json 19840 cost20 low8 high12 weight0.02 examine A clue! members trade false stack false duplicate false + cache-derived + items-search vs Active item-gameplay 19840 examine A set of instructions trade false vs hydrateFromCache stack ALWAYS/weight/examine cache + Loader copies only equipment/highAlch etc not weight/examine; high/low 0 vs DB 8/12 not alchable via sellable false; 19835 master Hopefully leads control; 19904 sibling distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 19840, 19841, 19835, 20, 8, 12.

---

- **Ahrim's set 4708 hood +4710 staff +4712 robetop +4714 robeskirt (4711/4713/4715 noted) vs DB items-json 4710-4714 stats/requirements Magic70/Def70 slot alch clean weight 2.25 vs 2.267 rounding only:** DB items-json 4708 hood +4710 staff +4712 robetop +4714 robeskirt canonical stats + item-gameplay 4708-4717 cache-derived bonuses noteId weight value alch + Barrows BASE_ITEMS SETS.arims degraded 4856+index*6 + BarrowsEquipment durability 90 ticks; custom-items no override; weight rounding 2.267->2.25 etc only drift. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4708, 4710, 4712, 4714, 4711, 4713.

---

- **Zalcano Golem 9051 drop golem_zalcano Always 16-24x23907 Imbued tephra vs DB 87365 byte-identical + npcs 9051->golem_zalcano + 9049 Zalcano 336/300/53 vs DB 9049 byte-identical clean (distinct from CAND-124 9050/tephra missing encounter):** Active npc-drops golem_zalcano Always 23907 Imbued tephra 16-24 vs DB docs/drops 87365 byte-identical + npcs 9051->golem_zalcano + 9049->zalcano mapping + NpcDrops.plugin rollTable always/rollOnce/tertiary wilderness + monsters-complete 9051 Golem 64/14 + 9049 Zalcano 336/300/53 byte-identical vs DB monsters-json 9049/9051 + spawns 9051 + CAND-124 weak-phase 9050 + tephra 23905 missing encounter distinct from golem payload parity clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 9051, 23907, 9049, 87365, 64, 336.

---

- **Desert Treasure I varp440 key desert_treasure_i via QuestRuntime registerQuest + PlayerSave persistent quest.desert_treasure_i.stage + spellBook Ancient unlock varbit358 + varp440 SPELL_UNLOCK clean (direct translate, gaps in header comments limited):** DesertTreasureI.Quest stages 12 (1..15) varp440 3QP vs QuestRuntime registerQuest buildJournal dialogue hooks + PlayerSave persistentAttributeKeys clone/migrate attributes quest.stage + quest.points + PlayerPersistence interface + PluginManager persistAttribute bridge + PacketSender SPELL_UNLOCK_VARPS[440,15] SPELL_UNLOCK_VARBITS[358,0x7fffffff] Ancient + MagicSpellbook enum + vars VARP_DESERT_TREASURE440 + NpcDialogues transcript engine + QuestCommand ::quest; Direct translate gaps in header but varp440 persistence correct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 440, 358, 1, 15, 440, 3.

---

- **Firemaking Willow logs 1519 30/90/116+17 campfire ticks vs DB items-json 1519 cost40 weight2 + Wiki making-fires + Campfire tables clean:** Firemaking.plugin LIGHTABLE_LOGS willow 30 xp90 campfire 116+17 max300 vs DB items-json 1519 Willow logs cost40 low16 high24 weight2 + items-wiki titles + ItemIdentifiers WILLOW_LOGS 1519 vs tests firemaking 30/90 among 16 logs fire lifetime 100-198 campfire create102-144 extend105-300 lifecycle; DB+RuneLite cache vs Wiki Firemaking row contract byte-identical; clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1519, 30, 90, 116, 17, 1520.

---

- **Turoth 426-432 10397 spiked 12583 bloodthirsty leafy slayer55 stab4 vs DB monsters-json 426/10397/12583 + drops bloodthirsty/spiked 128 vs DB byte-identical + LeafBladedBattleaxe 1.175x via meleeHitModifier clean (Hunter 18 modules runtime vs DB reference tables only):** Active monsters-complete Turoth Baby 426 83/76 Dad427 89/81 Mum428 87/79 Child429 85/77 spiked 244/195 bloodthirsty 366/292 leafy slayer55 stab4 vs DB monsters-json 426/10397/12583 identical + monsters-complete source 6MB + drops npc-drops bloodthirsty_turoth spiked 128 vs DB identical + LeafBladedBattleaxe regex turoth|kurask LEAF_BLADED 1.175x via EquipmentEffects + test 100->117.5 + Hunter.plugin 89 lines 18 modules tick-driven vs DB no behavioral counterpart only tables; Turoth identities byte-identical clean, Hunter runtime not DB-comparable. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 426, 10397, 12583, 426, 55, 4.

---

- **Pets plugin PETS[] partition: drop-table pets via npc-drops:roll awardDroppedPets vs skilling pets via skill:success onSkill + cats distinct, tertiary pet rows vs READ-ONLY-DB clean:** Active Pets.plugin PETS[] ~120 entries petFamily() skill!=null -> one family per skill Heron 13320 Fishing Beaver 13322 Woodcutting Rock Golem 13321 Mining etc wire to api.onCustomEvent skill:success SKILL_PET_VARIANTS vs non-skill wire to npc-drops:roll awardDroppedPets splices itemId from drops mainDrop/requiresFlag cats 1555-1560 generic reclaimable false; NpcDrops.plugin loads npc-drops 3092/1112 + subtables + overrides rollTable/hits weight/out_of + tertiary Tangleroot 20661 1/5375 Ikkle Hydra 22746 etc vs DB docs/drops-json npc-drops same schema meta 1112 parity without files edited. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 13320, 13322, 13321, 20661, 22746, 28801.

---

- **Burthorpe 4 drop tables archer/guard/servant/soldier byte-identical active vs READ-ONLY-DB + 9 NPC mappings 4086/4087/4096-4100/4104 (+4088 via overrides) via NpcDrops applyOverrides/tablesByNpc clean (Burthorpe Supplies 1055/Wistan already CHK-051):** Active npc-drops archer_burthorpe guard_burthorpe servant_burthorpe (Bones Always) soldier_burthorpe @10345/92722/155565/168177 vs DB 10256/92014/154621/167200 byte-identical + npcs mapping 4086/4087->soldier 4096-4098->archer 4099-4100->guard 4104->servant + overrides addNpcs 4088 Soldier (Burthorpe) + NpcDrops.plugin load applyOverrides rollTable hits; generic handler no Burthorpe plugin clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4086, 4087, 4096, 4099, 4104, 4088.

---

- **Shadow Burst 64 lvl/runes/maxHit18 radius1 XP37 3x3 clean + Blood 68 21/39 + Ice 70 22/40 vs Wiki burst spells table clean (Smoke 13 vs 17 candidate separate):** CombatSpells SHADOW_BURST 64 18/37 Soul2 Chaos4 Air1 Death2 radius1 3x3 vs Wiki 64/18/37 clean drain 10% guard + BLOOD 68 21/39 Blood2 vs Wiki 21/39 + ICE 70 22/40 Water4 freeze10s via MagicCombatMethod spellRadius1 + DB rune identities 560/562/556 verified; Smoke 13 vs 17 filed separately CAND-157. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 64, 68, 70, 18, 21, 22.

---

- **Commander Zilyana 2205 + minions 2206-2209 (Starlight/Growler/Bree/Priest) monsters + commander_zilyana/bree/growler/starlight drops byte-identical active vs DB + only heavy75→100 AUD-002 collapse informational:** Active monsters-complete 2205 596 hp255 max27 + 2206-2209 vs DB monsters-json 2205-2209 46 fields each byte-identical + drops commander_zilyana main133 + bree/growler/starlight main127 priest hard1 etc identical except noted enrichment; loader collapses heavy75 generic AUD-002; GodWarsShared faction door26504. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 2205, 2206, 2207, 2208, 2209, 596, 133.

---

- **Wilderness boss Venenatis 6610 monsters-complete + venenatis drops main126 + 38 main + 11 separate uniques + 6 tertiary byte-identical active vs DB 6610 (adds noted flags informational) + VenenatisCombatMethod toggle MELEE/MAGIC clean:** Active monsters-complete 6610 vs DB monsters-json 6610 byte-identical + loader NpcDefinitionLoader AUD-001/002 elemental weakness discard + drops venenatis main_max_roll126 38 main 11 separate 6 tertiary identical except noted flags Wiki-correct + spawn 3332,3734 + Venenatis.ts wiring alternating prayer drain. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 6610, 126, 38, 11, 3332.

---

- **Giant Mole 5779 monsters-complete + giant_mole drops 131 main + 3 Always + 20 weighted + 2 shared + 5 tertiary (brimstone) byte-identical active vs DB 5779 (4612 is not a mole variant, AUD-001/002 still apply 60/60/60):** Active monsters-complete 5779 vs DB monsters-json 5779 38 fields identical + Loader NpcDefinitionLoader AUD-001 weakness 3/50 discarded + AUD-002 ranged 60/60/60 -> standard only + drops giant_mole 131 Always Mole claw/skin weighted longsword etc shared gem + tertiary 12646 1/3000 + plugin + spawns 1759,5189 + GiantMole burrow 5-50% lair. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 5779, 4612, 131, 3, 20, 200.

---

- **Demonic gorilla 7144/7145/7146 monsters-complete + demonic_gorilla drops 500 (Always Malicious ashes + 1/500 Ballista + separate Zenyte 1/300 Light/Heavy frame) byte-identical active vs DB 7144-7146 (duplicate flag faithful, MM II gap distinct):** Active monsters-complete 7144-7146 vs DB monsters-json 7144-7146 38 fields identical duplicate false/true faithful + drops demonic_gorilla main500 20+ weapons/runes/pots/herbs + separate Zenyte shard 1/300 Light 1/750 Heavy 1/1500 byte-identical except spawns cache-only 20 instances Crash Site; dialogue Transcript Demonic gorilla; Monkey Madness varp365 gap distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 7144, 7145, 7146, 500, 275, 380.

---

- **Wilderness boss Vet'ion 6611 Normal / 6612 Enraged + hellhounds 6613/6614 monsters + drops + rebornTimer 500 + transformation byte-identical active vs DB 6611/6612 (hellhound tables 1/3 looting bag parity):** Active monsters-complete 6611/6612 vs DB monsters-json 6611/6612 38 fields identical atk6/5 speed + Vetion.ts hellhound spawn hp<=125 zero-damage guard + drops skeleton_hellhound 1/3 looting bag 1/5000 scroll + main Skull 1/618 identical; loader AUD-001/002 weakness/ranged collapse informational. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 6611, 6612, 6613, 6614, 500, 125, 618.

---

- **Prayer Eagle Eye 20 drain20/min Prayer44 +15% Ranged attack/strength varbit4126 RANGED group vs DB 20 + client drain12 tick (0.6*20) + combat 115%  Accuracy/Damage faithfully distinct from Sharp Eye CHK-043 and Hawk Eye:** DB prayers 20 drain20.0 req Prayer44 bonuses ranged15 + PrayerData EAGLE_EYE 44/20/19821/4126 index19 RANGED + client prayers drain12 varbit4126 1.15 multipliers + Accuracy rangedAttack 115 + Damage rangedStrength 115 + processDrain 12 resistance 60+bns*2 swift faithfully distinct Sharp Eye 4/5. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 20, 44, 20, 4126, 19, 115.

---

- **Arceuus Vile Vigour 15304 L66 76xp 1 Soul/3 Air 10.2s cooldown prayer->runEnergy 1:1 vs Wiki L66 76 3 Air 1 Soul drain all remaining if insufficient clean:** ArceuusSpells vile vigour 15304 L66 76xp runes 566x1/556x3 anim8978 gfx1876 cooldown10200 min(prayer,100-energy) drain+runEnergy+sendRunEnergy blocking max energy/no prayer vs Wiki 66 76 17 ticks 10.2s 1:1 fill clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 15304, 66, 76, 566, 556, 10.2.

---

- **Prayer Mystic Might 21 drain20/min Prayer45 +15% Magic attack/defence +2% magic damage (-11) varbit4127 MAGIC group vs DB 21 20.0 clean (DB encodes +15, Wiki +2% damage):** DB prayers 21 drain20.0 req Prayer45 bonuses magic15 + PrayerData 45/20/19823/4127 MAGIC + Accuracy magicAttack 115 defenceMagic blend + Damage magicDamage 20 permille +2% vs client drain12 varbit4127; magic damage not in DB schema Wiki +2% faithful. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 21, 45, 20, 4127, 20, 115.

---

- **Standard Wind Strike 1152 L1 2 maxHit 5XP Air556+Mind558 + Fire Surge 21879 L95 24 maxHit 50.5 XP 21880 Wrath vs DB 556/558/554/21880/20714 identities + Wiki 1/2 + 95/24 clean (Charge 30 distinct, Burst CAND-157 separate, Tome CAND-093 50% boost separate):** CombatSpells WIND_STRIKE 1/1152 2/5 + FIRE_SURGE 95/21879 24/50.5 556x7/554x10/21880 vs DB items 556 Air 558 Mind 554 Fire 21880 Wrath 20714 Tome shield Magic50 + Damage getMagicMaxhit 180-212 + Charge30 only via applyChargeMaxhit + Autocasting map; 1152 XP 5 vs 5.5 existing finding not refiled Tome 50% absent CAND-093 separate. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1152, 21879, 556, 558, 554, 21880, 20714.

---

- **Great Olm 7554 + claws 7553/7555 monsters-complete vs DB 7554 byte-identical (no drops mapping raid chest both sides, no COX plugin both sides, loader AUD-001/002 elemental/ranged collapse informational no numeric drift):** Active monsters-complete 7554 head vs DB 7554 + claws 7553/7555 + drops none both sides vs ToA present COX absent both sides + loader NpcDefinitionLoader single attackType/rangedDef per AUD-001/002. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 7554, 7553, 7555, 7554.

---

- **Verzik Vitur 8371 P1→P2 transition non-combat absent both DB 8371.json + TSPS 8371 both missing parity + phases 8370/8372/8374 + 10831/10833/10835 byte-identical + ToB chest 32737/32738 vs drops none both sides + no ToB plugin both sides informational clean:** DB 8371 absent + TSPS 8371 absent via monsters-complete 8367 etc + 8370/8372/8374/10831/10833/10835 identical stats + NpcDefinition cache fallback + npc-drops none both + Theatre chest not NPC drop ToB plugin absent both sides informational. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8371, 8370, 8372, 8374, 10831, 10833, 32737.

---

- **Hunter Box trap Chinchompa 53 198.4 + Carnivorous 63 265 via box trap level27 item10008 vs DB 10033/10034/10008 identities clean vs Wiki 53/63 distinct from NEW-HUNTER-001 bird-snare cap 1 vs 2:** Data.Hunter box 27 item10008 vs DB Box trap 10008 cost32 + creatures 2910 Chinchompa 53 198.4 loot 10033 vs DB 10033 cost140 ranged45 + 2911 Carnivorous 63 loot 10034 vs DB cost160 ranged70 + Traps eligible level gate + Hunter.plugin Lay/Box trap via Traps vs NEW-HUNTER 001/002/003 cap/smoke/wilderness distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 10008, 10033, 10034, 53, 63, 27.

---

- **Amulet of fury 6585 vs glory 1704 vs DB 6585/1704 bonuses 10/10/15/15/8/5 vs 10/10/3/3/6/3 slot AMULET requirements null vs glory family 1706-1708-1710 eternal 19707 + fury-or 12436 blood 24780 byte-identical via ItemDefinitionLoader cache overlay clean:** Active 6585 AMULET 0 vs DB fury 10/10/15/15/8/5 weight0.01 slot neck + glory 1704 10/10/3/3/6/3 vs DB cost17625 + family 1706-11978 same + Jewellery/BloodFury consumers + Loader weight/cache not overlaid inert + BonusManager 5/3 prayer vs 3/6. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 6585, 1704, 19707, 12436, 24780, 10.

---

- **Artio 11992 monsters-complete 320cb 450hp 35max 40/40/40 vs DB 11992 byte-identical + artio drops main128 5 uniques 358/358/618/716/912 separate_roll clean with Callisto 6609 control singles nerf distinct from CAND-016 independent-roll:** Active 11992 Artio vs DB 11992 40/40/40 byte-identical + drops artio 128 358/618/716/912 + Callisto 6609 470cb 1000hp 55 control singles nerf identical but drops separate vs CAND-016 independent separate_roll hold distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11992, 6609, 320, 450, 128, 358.

---

- **Trade offer 180 TRADE_ACTION byte short int short vs decode + TradeWindowState stage offer/confirm parity vs client clean distinct from AUD-062 IF_CLOSE 55:** Client encodeTradeAction 180 byte 0-5 + short slot + int qty + short itemId var-byte vs server ClientProtocol decode byte action + short slot + int qty + signedShort + dispatch NetworkBuilder -> Trading handleItem resets ACCEPTED->TRADE + moveItems stack split + sendState vs client ServerBinaryDecoder 154-157 encodeTrade* mirror; edit invalidates acceptance; distinct from AUD-062 Escape IF_CLOSE 55; no DB packet key. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 180, 154, 155, 156, 157, 55.

---

- **CLAN_CHAT friends_chat channel 190 var-byte vs decode vs FriendsChatManager handler ignore-only triple parity clean (distinct from CAND-051 public overhead suppression):** Client CHAT 190 byte 0 public/1 game/2 friends_chat via ClientBinaryEncoder vs server ClientProtocol decode byte 0/1/2 + encodeChatMessage channel9 vs clan7 + NetworkBuilder chat vs social dispatch + FriendsChatManager loop offline+hasIgnore only + FriendsList route vs Client ServerBinaryDecoder CHAT_MESSAGE 120 type9->channel + FRIENDS_CHAT_UPDATE 121 mirror; public path via PlayerRelations canReceivePublicChatFrom mode 0/1+friend + PlayerSession forcedChat overhead vs clan distinct; CHAT_SENDCLAN 5010 no-op stub separate; ID 646 Ice wolf not clan packet; CAND-051 public Hide mode3 already filed. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 190, 120, 121, 9, 7, 5008, 5010, 646.

---

- **Ancient Burst/Barrage 12891 Ice Barrage 94/30/52 + Shadow 64 18/37 + Blood 68 21/39 + Ice 70 22/40 freeze multi clean vs burst Smoke 62 13 vs 17 already CAND-157 (Wiki Barrage/Burst table, DB rune 555/565/560/566 verify):** Active CombatSpells 62/13/36+64/18/37+68/21/39+70/22/40+12891 94/30/52 via CombatSpells -> MagicCombatMethod radius 1 + isBarrage hits 3x3 up to 9 vs CombatFactory freeze seconds/0.6 ticks; Ice Barrage 94/30/52 Water6 Blood2 Death4 radius1 freeze20 exact + Burst Shadow/Blood/Ice 18/37 21/39 22/40 within tolerance vs Wiki; Smoke 62 13 vs 17 is CAND-157 same root hold; freeze drift +0.33 systematic via Misc.getTicks informational not new root; DB items-json 555/565/560/566/556/562 identity only. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 12891, 62, 64, 68, 70, 13, 18, 21.

---

- **Salve amulet 4081 + (i)12017 vs DB 4081/12017 defence 3/3/3 prayer3 melee0 via loader + SalveAmulet.js undead-gated 15%/20% EquipmentEffects -> Damage/Accuracy correct distinct from CAND-017 dragon/salve stack:** Active item-gameplay 4081/12017 AMULET bonuses [0,0,0,0,0,3,3,3,0,0,0,0,0,3] vs DB 4081/12017 3/3/3 prayer3 + 10588(e)/12018(ei) 20% family; loader and BonusManager melee0 intentional; SalveAmulet SALVES 7/6 vs 6/5 + magic 15/20 via wornName AMULET_SLOT + hasAttribute undead -> EquipmentEffects applyMeleeHit/rangedHit/magicDamage + AccuracyFormulas per wiki DPS calculator correct vs tests salve-amulet + gear-passives; missing stacking 30% dragon-hunter+salve already CAND-017 so CHK not candidate. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4081, 12017, 10588, 12018, 3, 15, 20, 6.

---

- **Arhein General 1393 + Alry Aerial 1425 MOLCH PEARL 8-stock vs DB Arhein 11 + Alry owner 8521 Trade3 clean + Lovecraft 1220 10 vs DB 19 is AUD-024 zero-stock filter hold dup:** Active shops.json 1393 Arhein 11-stock COINS slot3 3200 vs DB shops-items-by-shop Arhein 11 sells1300/400 delta30 + 1425 Alry 8-stock MOLCH PEARL slot3 8521 vs DB Alry 8 Molch pearl owner 8521 Trade3 exact parity; 1220 Lovecraft 10 vs DB 19 10+9 zero-stock 317/345/321 etc filtered via import-osrs-shops amount<=0 + ShopDefinitionLoader normalizeAmount already AUD-024 systematic not aerial-specific. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1393, 1425, 1220, 3200, 8521, 4789, 317, 345.

---

- **Lost City varp147 6-stage + Dramen 771 branch -> 772 staff (31/36 craft/WC) vs DB 771/772 772 weapon -1 -1 10 10 0 2 3 1 10 via QuestRuntime 147 distinct from fairy ring wielder + 1305 Dragon longsword control:** Active LostCity.Quest varp147 6 stages + Shamus/tree/Cave/door via QuestRuntime 147 mirror + Items 771/772 branch->staff knife 31/36 vs DB items-json 771/772 772 weapon -1 -1 10 10 etc weight1.8 + control 1305 Dragon longsword LONGSWORD Attack60 via loader + wield check FairyRings lunar 772 gate vs DB quest-pages Transcript Lost City + objects 1292 Dramen tree identity + Wiki VarPlayer LOST_CITY 147 distinct gateway not DB numeric. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 147, 771, 772, 1305, 31, 36, 1292.

---

- **Fairy Rings via DB Table 89 64 codes BKS/AIR/AJR/AJQ via FairyRings.plugin loadRings cache vs objects-summary 12003/12094/12095/29495/29560/43109 (ticket 29431 Trophy pedestal 29942 TOX gate mismatch not DB fairy) name-registered Fairy ring interface 398/381 varbit3985-87 clean:** Active FairyRings 89:34 loadRings rows -> code/dest 92-107 DARK_WARNING AJQ HIDEOUT AIR ringOptions Zanaris BKS 410 + Configure + Last-dest vs cache doc dialect dial + DB objects-summary 29431 Trophy pedestal not fairy + 29942 no DB key + server ObjectIdentifiers 12003:6821 confirming DB non-fairy vs test 64 rings AJR/AJQ via fairyTeleportTicks; DB docs not encode codes (cache table) only ID/name; ticket IDs mismatch is namespace typo not active mismatch. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 89, 29431, 29942, 12003, 12094, 12095, 29495, 29560.

---

- **Scythe of Vitur 22325 slash125 not 45 attack80 str90 2h scythe via CombatMethodResolver ScytheCombatMethod 1-3 halved max hits via Npc size cap 3 not CombatSpecial 5 speed vs DB 22325 charged vs 22485 uncharged specialised 776 vs Bowfa:** ScytheOfVitur 22325 charged vs DB 22325 charged slash125 melee75 via ScytheCombatMethod MAX_HITS3 hitCount min(size,3) -> 1-3 PendingHit halved floor max0/2^n vs CombatSpecial byItemId not registered (special 776 -1 per item-combat-styles + specialBar -1) resolver via CombatFactory loop resolver array vs CombatSpecial.registry separate + requirements 80/90 via Item 22325 vs Wiki 3-tile wide 1x3 not modelled documented header vs Bowfa vs tests scythe-and-bowfa. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 22325, 22485, 125, 75, 80, 90, 776, 5.

---

- **Prayer bones bury Big 532 15 XP + Babydragon 534 30 XP vs gilded altar 2.5+burners 52.5/105 via BONE_XP ArceuusOfferings 532:15 534:30 vs Wiki 15/52.5 30/105 via ConstructionAltars GILDED2.5+burners*0.5:** BONE_XP 532:15 534:30 vs gilded 2.5 + 0.5* burners max 3.5 =52.5/105 vs DB items-json 532/534 identity only via Prayer bury anim827 task2 tick + ConstructionAltars offerHouseBones 2.5+min(2,lit)*0.5 via distinct from Earth altar CAND-005 runecraft 34763 DB not encodes XP via Wiki. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 532, 534, 15, 30, 2.5, 52.5, 105, 532.

---

- **Desert Treasure I varp440 diamonds 4670-4673 (1250/140/210 vs cost250) + ring 4657 350/140/210 vs staff 4675 Ancient staff value79944 high60k magic50 attack50 vs book 7633 The sleeping seven vs DB 4670-4673/4657/4675 vs Quest varp440 distinct from Desert Treasure II:** Active DesertTreasureI registerQuest varp440 diamonds 4670-4673 CHK vs ring 4657 vs staff 4675 Ancient staff vs book 7633 via ItemDefinitionLoader overlay vs DB items-json 4670-4673/4657/4675 + QuestRuntime 440/15 vs Autocasting 4675 vs wiki 80k Eblis dialogue vs CHK-139 varp440 SPELL_UNLOCK distinct + CHK already covers 440/15 hold vs Desert Treasure II via Quest 139 distinct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 440, 4670, 4673, 4657, 4675, 7633, 1250, 350.

---

- **Fire cape 6570 [1,1,1,1,1,11*5 4 prayer2] + Infernal 21295 [4,4,4,1,1,12*5 8 prayer2] via CAPE_SLOT 1 vs DB 6570 Fire cape + 21295 Infernal cape slot cape via loader distinct from 21297 animation dummy equipable false not cape vs 20445/21287 broken via BrokenItem:** Active item-gameplay 6570 Fire CAPE + 21295 Infernal CAPE vs DB items-json 6570 1x5 11x5 4 prayer2 cost65007 low26002 high39004 + 21295 4x3 12x5 8 prayer2 cost80k + 21297 animation item not cape dummy 1 vs BrokenItem FIRE_CAPE_BROKEN 20445 + INFERNAL 21287 via ItemDefinitionLoader CAPE->CAPE_SLOT 1 + BonusManager index0-4 attack 1-4 vs 5-9 defence 11-12 vs Examine broken loader-ignored cache authoritative. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 6570, 21295, 21297, 20445, 21287, 1, 11, 4.

---

- **God capes Saradomin 2412 + Guthix 2413 + Zamorak 2414 CAPE [0,0,0,10,0,1,1,2,10] Magic60 vs DB 2412-2414 cape attack_magic10 def_magic10 Magic60 + staves 2415-2417 6/6 vs ticket ID shuffle correct vs loader distinct vs 2415 is staff not cape:** Active item-gameplay 2412-2414 CAPE bonuses [0,0,0,10,0,1,1,2,10] Magic60 CAPE_SLOT via ItemDefinitionLoader cache name-guard onto BonusManager vs DB items-json 2412 Saradomin + 2413 Guthix + 2414 Zamorak cape attack_magic10 def10 Magic60 via skill-requirements 60 vs DB cape slot via loader vs ticket 2412-vs-Zamorak shuffle vs 2415 Saradomin staff -1,-1,6,6 2 via slot not cape via family via CAPE_SLOT vs HEAD_SLOT. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 2412, 2413, 2414, 2415, 2417, 10, 10, 60.

---

- **Mimic 8633 230hp max23 vs DB 8633 230 max23 byte-identical via monsters-complete vs DB 8633 vs ticket 230 Demon butler not Mimic via scans 300/27 no DB 230 via spawns 21450 vs 24162 The Mimic vs drops the_mimic/_2 vs CHK distinct:** Active monsters-complete 8633 The Mimic 230hp max23 vs DB 8633 230 max23 byte-identical 46 fields vs DB 230.json missing vs cache mirror vs ticket 230 Demon butler not Mimic vs CHK for Mimic vs ticket{chr(34)}300hp 27max{chr(34)} no 300/27 in DB via scans vs spawns 21450 Demon butler 230 at 2664 vs 24162 Mimic 8633 at 2718 vs drops the_mimic_2 — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8633, 230, 300, 27, 21450, 24162, 7404.

---

- **Fire giant 2075 86/111/11 slash fiery weak2/100 slayer1 byte-identical active vs DB 2075 via monsters-complete (2073/1582 phantom, Brutal separate):** Active monsters-complete 2075 Fire giant 86hp 111cb max11 slash fiery vs DB monsters-json 2075 byte-identical 40+ fields (65/65/65 29/31 etc weak2/100) + 2076-2084 dupes + 7251/7252 109/150/13 variants byte-identical. 1582/2073 have no DB rows (phantom). Brutal is separate Lizardman/Brutal dragon category not fire giant. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 2075, 2076, 7251, 7252, 1582, 2073, 86, 11.

---

- **Crawling Hand 448 16hp max1 crush undead slayer5 byte-identical active vs DB 448 via monsters-complete (7386/397 phantom, distinct):** Active monsters-complete 448 Crawling Hand 8cb 16hp max1 crush undead slayer5 16xp vs DB monsters-json 448.json byte-identical 40+ fields. 7386/397 are not Crawling Hand monsters. Loader NpcDefinitionLoader -> DamageFormulas maxHit1; spawns Slayer Tower 3412-3424. No prior 448 crawling audit. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 448, 7386, 397, 16, 1, 5, 8.

---
*Last re-verified: Wave 41 — 2026-10-13 — 62 HOLD/HOLD DUP + 2 new CAND (Bronze scim 1321 defence_slash 0 vs 1 + Warhammer family 1335/1339/1341/1343/1345/1347 melee_strength 9/16/19/20/31/48 vs 11/18/22/27/39/62). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-41 for per-wave evidence.*
