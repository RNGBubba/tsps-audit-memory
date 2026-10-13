# Completed — combat

> **Verified clean** (26) — bounded no-mismatch checks. Skip re-auditing unless scope changes.

- **Protect from Magic vs Corporeal Beast magic attacks:** Exact prayer key `READ-ONLY-DB/docs/prayers-json/17.json` confirms Prayer 37 and 20/min drain; NPC key `docs/monsters-json/319.json` identifies Corporeal Beast and its magic style but encodes no boss-specific mitigation. Active `PrayerHandler.ts:92-103,134-151,499` maps magic protection to prayer index 16 and enforces Prayer 37; `Beast.CorporealBeast.js:139-145` registers `CorpAttacks.method()` for Corp. Its `CorpAttacks.js:34-41,82-95` bypasses generic prayer protection then keeps 2/3 damage while Protect from Magic is active, matching the current official [Corporeal Beast](https://oldschool.runescape.wiki/w/Corporeal_Beast) rule that the prayer reduces magic damage by 33%. This corrects the initial candidate misread (“blocks one third” means 2/3 damage remains). Available-register screen found no same Corp/prayer-exception candidate; the prayer base/Tele Block, dragonfire, Corp drop, and Protect from Missiles records cover separate scopes. No mismatch in the checked magic variants; melee, stomp, and other boss effects excluded. Static review only; no source/DB edits, tests, builds, or live combat.

---

- **Armoured kraken Bounty task eligibility and task-drop scaling (NPC 15210):** Current official [Bounty tasks](https://oldschool.runescape.wiki/w/Bounty_tasks) and [Armoured kraken](https://oldschool.runescape.wiki/w/Armoured_kraken) state that task/pre-roll odds scale with the player's damage contribution; active/authoritative Armoured kraken drop rows match their baseline rarity, and selected task rows exist. However, active `PortTasks.plugin.js:1-3` states bounty tasks are displayed but unavailable; `Board.PortTasks.js:98-102,113-120` rejects every non-courier task on acceptance. The specific Bounty task path therefore is not currently reachable through the implemented task board, so the OSRS damage-scaling rule does not establish a player-visible active mismatch. Bounded no-candidate outcome; no task acceptance or boss kill was run, no TSPS/READ-ONLY-DB edits or tests/builds. Other bounty behavior excluded.

---

- **Kraken (slug kraken / table kraken) main_max_roll 128 weight sum 128 + 38 entries + gem shared 2 + separate Trident 1/512 Tentacle 1/400 + tertiary Jar 1/1000 Pet 1/3000 Clue 1/500 match DB routing and weights (noted flag enrich only):** Active npc-drops.json:114266 table kraken 38 main sum128 shared gem 2/128 separate_roll 2 rows tertiary 3 rows vs DB npc-drops.json identical weights/quantities; Runtime NpcDrops loadDrops tablesByNpc + rollSharedTable cumulative walk + tertiary out_of<=1 skip. Active enriches 9 material noted:true absent in DB export (Wiki-correct). Single-species routing/weight verified. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; dup-screened (0 prior hits) before filing. No live build/test or TSPS/DB edits. Sample IDs 128, 38, 2, 512.

---

- **Zulrah rotation engine (ZulrahFight + PhaseCursor + Rotations) dive/surface attackable gate + OPENING→ROTATIONS[0-3]→CLOSING random repeat clean — no DB phase table to mismatch:** ZulrahFight STEP_TICKS 3 FIRST 9 DIVE 3 RESURFACE1 RISE3 PhaseCursor tick drain beginPhase dive→resurface→surface attackable Infinity/+4/+3 transformId -1 for green moveTo POSITION spawn; Rotations OPENING 4 barrages CLOSING 5×ranged+FILL counted as first of next rotation random next may repeat; Shrine.Zulrah onlyWhenSurfaced blocks hits when !attackable + halberd gate + cap 50; npc-combat-defs no phase table, DB monsters cache 2042-2044 only base stats/params attack/ defence, no rotation field; docs zulrah.md timers Near-Reality documented deferrals. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 2042, 2043, 2044, 5071.

---

- **Corporeal Beast 319 melee defence triad stab 25 / slash 200 / crush 100 (vs DB monsters-json 319) loader stats[10-12] + AccuracyFormulas defenceBonus consumer clean (second Corp sample distinct from magic protection CHK-011):** DB monsters-json 319 defence_stab25 slash200 crush100 magic150 + monsters-complete mirror; Vendored monsters-complete.json 319 identical 25/200/100; NpcDefinitionLoader fromMonsterDump defenceBonuses stab/slash/crush -> stats[10/11/12]; NpcDefinition slots 10-14 STAB/SLASH/CRUSH/MAGIC/RANGED; AccuracyFormulasDpsCalc 77-86 defenceBonus stats[10+bonusIndex] melee path preserves 25/200/100 via BonusManager STAB/SLASH/CRUSH; Wiki identity via wiki_url; ranged collapse AUD-002 + elemental AUD-001 are distinct families not re-filed; dup-screen 0 stab/slash/crush hits for 319. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 319, 25, 200, 100, 150.

---

- **Cerberus 5862 drop table cerberus main 130 + 4 separate 1/520 + rareDrop 3/130 byte-identical active vs DB clean (brimstone flags ignored matches hydra pattern but not filed as duplicate):** Active npc-drops cerberus table 47553 main_max_roll130 wiki Cerberus brimstone_key_roll true vs DB docs/drops-json npc-drops 47050 identical + subtables rareDrop/gem megaRare + overrides none for 5862 + NpcDrops.plugin loadDrops tablesByNpc 5862->cerberus roll policies (NESTED depth4 RingOfWealth filter separate_roll/roll_group) + monsters-json 5862 Cerberus slayer91 wiki Cerberus; Active vs DB byte-identical checked slice; plugin brimstone flags ignored (pattern matches known hydra/Kril pending not re-filed); dup-screen 0 hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 5862, 130, 520, 47553, 47050.

---

- **Dagannoth Supreme 2265 vendored vs DB 2265 byte-identical 46 fields (303 hp255 max30 range speed4 550 def) loader + spawn + drops identical clean (AUD-001/002 generic gaps apply not per-NPC):** DB monsters-json 2265 Dagannoth Supreme 303 size3 hp255 max30 ranged speed4 aggressive/poison levels255/255/128/255/255 def10/10/10/255/550 elemental 3/35% slayer1 vs Active monsters-complete 907 identical 46 fields; Loader NpcDefinitionLoader 22-111 227-290 CombatStats defence_ranged_standard 550 collapse AUD-002 + elemental unread AUD-001 architecturally but no visible delta 550 uniform; Spawns 6467 2906,4384 +15235 + npcs-interactions 2265 Attack; Drops dagannoth_supreme main128 30 entries 5 tertiary brimstone true Wiki enrichment noted; clean per-NPC. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 2265, 303, 255, 30, 550.

---

- **Vorkath drop 8058-8061 emptiness parity — TSPS and READ-ONLY-BOTH zero tables/npcs (no vorkath table, both meta 1112 tables identical) vs monsters 8060/8061 byte-identical clean (drop absence is DB data gap not TSPS-vs-DB mismatch):** Active npc-drops 3092 npcs 1112 tables no vorkath 0 hits + DB docs/drops-json upstream meta 2026-09-15 same 0 hits + NpcDrops.plugin loadDrops no Vorkath branch overrides none + monsters 8060 392cb 460hp + 8061 732cb 750hp dragon/fiery/undead byte-identical vendored; Runtime tableForNpc null -> dropFor 0; DB also empty so active vs DB parity holds (identical emptiness) distinct from CAND-120 instance/acid/spawn missing, distinct from dragon-hunter CAND stacking; Wiki Vorkath page not in 1659 scanned pages. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 8058, 8060, 8061, 1112, 3092.

---

- **Kalphite Queen 963 crawling vs 965 airborne 2-phase 6270/gfx1055 Transform 20 ticks heal255 Revert 2000 forceAccurate multi-target + Worker hatch 1/20 vs DB 963/965/4303 byte-identical clean (drops kalphite_queen 126-pool identical):** Plugin KQ_IDS 963 965 4303 4304 CRAWLING 963 AIRBORNE965 WORKER961 HP255 TransformTask 20 heal255 RevertTask2000 worker hatch 1/20 13 cocoons tunnels 3827/19053 rope954 KalphiteQueenCombat ranged fan + magic chain prayer drain vs DB monsters-complete 963 craw stab50 slash50 crush10 magic100 ranged100 weak4/40% vs 965 air 100/100/100/10 ranged10 weak inverted 4303/4304 dupes 6500/6501 PvM weak0 identical; Drops kalphite_queen main126 31 entries 9 consumables separate 1/9 8 tertiary 1/3000 identical; Gaps 6500/6501 not in KQ_IDS +15616/15617 absent from dumps dead code informational. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 963, 965, 4303, 4304, 6270.

---

- **Corporeal Beast 319 stomp 7-tick 30-51 typeless via underneath SIZE5 vs DB max_hit 33 melee-only no stomp field clean (vendored 319 byte-identical CHK-073 melee triad distinct):** Beast.CorporealBeast TIMER7 STOMP anim1686 min30 max51 underneath SIZE5 bounds stomp victims RED randomInclusive tickBeast 7% gate vs CorpShared ROOMS 2974-3007 VARBIT999 vs CorpAttacks 4-attack 33/65/55/40 + docs corporeal-beast Wiki 7-tick 30-51 through prayer anim CORP_DOUBLE_STOMP + tests 6 ticks no hit 7th tick 30-51 + DB monsters-complete 319 byte-identical + DB monsters-json 319 max_hit33 melee only schema no stomp field + Wiki infobox max hit 33 Melee 65 Magic 51 Stomp ; No registry duplicate distinct from CHK-011 magic protection and CHK-073 melee triad. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 319, 7, 30, 51, 1686.

---

- **Pet Kraken 12655 via Boss Kraken 494 1/3000 tertiary vs DB docs/drops-json kraken table byte-identical clean (5 kraken tables cave/pygmy/spined/armoured/kraken mapped + 494 sole pet source, vampyre 15212/veiled 15576 tables absent in BOTH not TSPS-vs-DB mismatch):** TSPS npc-drops kraken Boss 494 1/3000 Pet Kraken 12655 tertiary + cave 492 pygmy15206 spined15208 armoured15210 vs DB docs/drops-json byte-identical 5 tables each entries/separate_rolls + overrides 15207 pygmy 15209 spined 15211 armoured 15213 vampyre 15577 veiled but vampyre/veiled tables missing in both DB and TSPS + monsters-complete 494 Kraken 291cb slayer87 492 127cb 15206 93 etc + Pets.plugin KRAKEN petId6640 item12655 dialogue291 + items 12655 Pet Kraken; vampyre_kraken/veiled_kraken absent in BOTH is DB data gap not TSPS regression. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 12655, 494, 492, 15206, 15208.

---

- **Zulrah drop zulrah table 250 + NPCs 2042/2043/2044 routing byte-identical TSPS vs DB + rolls2 via applyWikiCorrections + lootUnderPlayer retarget clean (rotation CHK-054 distinct):** Active npc-drops tables.zulrah main250 10/249 rareDrop 4x1/1024 uniques 2x1/13107 mutagens tertiary Jar1/3000 Pet1/4000 elite1/75 at 209k + npcs 2042/2043/2044 ->[zulrah] vs DB docs/drops-json 1112 tables byte-identical + subtables rareDrop identical + overrides no Zulrah + NpcDrops.plugin rolls=2 Wiki two rolls tertiary excluded + Shrine.Zulrah lootUnderPlayer retargets to fight.player + ZulrahShared forms 2042-2044 + monsters-complete 2042-2044 byte-identical; clean distinct from rotation engine. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 2042, 2043, 2044, 250, 249.

---

- **Abyssal Sire 5886-5891/5908/11961 monster 350/425 66 demons bay-identical vs DB 5886 + Sire drop abyssal_sire main139 byte-identical + override Abyssal orphan 13262 1/2560 clean (generic NpcDrops orphan handling):** DB monsters-json 5886-5908 Sire phases 350 hb425 max66 demons + RSPS monsters-complete 5886-5891/5908 identical duplicate flags + active npc-drops abyssal_sire main139 vs DB docs/drops-json identical ~34 entries + overrides addTertiary orphan 13262 1/2560 (5/128 via Unsired) compensates Wiki omission + spawns 5886 4 locs + slayer vannaka/chaeldar/konar etc + NpcIdentifiers + ItemIdentifiers Unsi red/orphan etc; Sire drop byte-identical + override correct; clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 5886, 5891, 5908, 11961, 139, 13262.

---

- **Nex 11278 combat 1001 hp3400 max33 crush/ranged/magic speed4 def stab40 slash140 crush60 magic300 ranged 190/150 + drops nex 14-roll vs DB monsters-json 11278 byte-identical + dialogue 19 variants clean:** TSPS monsters-complete 11278 combat1001 size3 hp3400 max33 crush/ranged/magic speed4 att315/str200/def260/mag230/rng350 def40/140/60/300 ranged190/150 elemental0 vs DB docs/monsters-json 11278 byte-identical; Drops nex 14-roll 34 entries 2 tertiary vs DB docs/drops-json nex identical; Dialogue index 11278 Transcript Nex 19 variants vs DB identical; NpcIdentifiers NEX 11278; Clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11278, 3400, 33, 1001, 14, 190.

---

- **Alchemical Hydra 8615-8622 monster stats 8 forms hp1100 atk100 mage260 elemental 3/50 byte-identical active vs DB 8615-8622 (distinct from CAND-001 pre-roll drops eye/fang/heart):** Active monsters-complete 8615-8622 Serpentine/Electric/Fire/Extinguished 35/55 max + syndromes + DB monsters-json 8615-8622 all fields verbatim including duplicate/slayer95/1320; loader NpcDefinitionLoader name-guarded; AUD-001/002 still apply generically; verified distinct root from CAND-001 eye/fang/heart pre-roll hits() reject. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 8615, 8622, 8617, 8618, 8621, 1100, 35, 55.

---

- **Wilderness boss Scorpia 6615 monsters-complete + scorpia drops main128 pre_roll 11930/11933 rarity_raw 1/256 + 31 main + looting 1/3 tertiary 2722 pet 6616 spawn byte-identical active vs DB 6615 (noted enrichment + AUD-001/002 still apply 284x3):** Active monsters-complete 6615 vs DB monsters-json 6615 identical att250 str150 def180 elemental 4/35 ranged 284×3 -> loader single + drops scorpia main_max_roll128 2 pre_roll 1/256 rarity_raw -> NpcDrops hits() guard + 31 main battlestaves/herbs/ores + spawn 3233,10341 + 6616 offspring; noted flags enrichment only delta. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 6615, 6616, 128, 11930, 11933, 284, 284.

---

- **Container wiring Inventory 28 DEFAULT vs Bank 11x352 STACKS vs Equipment 14 vs Trading 28 + PlayerSave/JSON/SQLite hydration 28/14 + capacity-aware PacketSender/packet listeners clean (distinct from CAND-096 1410 truncation):** Inventory 28 DEFAULT refresh 3214 vs Equipment 14 vs Bank per-tab 352 STACKS 11 tabs deposit/withdraw vs Trading inner 28 vs PlayerSave inventory 28 equipment 14 banks Map vs Json/SQLite hydrateItems pad/truncate + PacketSender capacity-aware vs ItemContainer add/switch meta-aware stacking. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 28, 352, 14, 3214, 11, 28.

---

- **Boss Nightmare 9432 monsters-complete + the_nightmare drops main100 27 weighted + 8 separate uniques 24417-24517 + tertiary 24491 team-scaled 1/800 clean byte-identical active vs DB 9432 (10 resource noted enrichment only, no spawn plugin-spawn intentional):** Active monsters-complete 9432 vs DB monsters-json 9432 40 fields identical + drops the_nightmare 100 Always Big bones/Bones 27 weighted 8 separate 24417 1/750 etc identical except 10 resources noted true Wiki-correct vs spawn intentional absence via spawn-sync skip + loader NpcDefinitionLoader name-guarded. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 9432, 100, 24417, 24491, 800, 120.

---

- **TzTok-Jad 3127 monsters-complete + duplicate 6506 byte-identical active vs DB 3127 (instanced via FightCaves wave63 fire cape 6570 via plugin, no drops table both sides parity correct) + TzTokJadCombat melee/ranged/magic 3-tick prayer clean:** Active monsters-complete 3127 vs DB monsters-json 3127 38 fields identical + duplicate 6506 same + loader NpcDefinitionLoader AUD-001/002 still apply + no drops table 3092/1112 both absent correct + TzhaarFightCaves 63 waves FINAL_WAVE + TzhaarMonsters 50/50 ranged/magic via TzTokJadCombat 3 ticks. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 3127, 6506, 63, 6570, 3.

---

- **TzKal-Zuk 7706 monsters-complete + duplicate 7706 cohort vs DB 7706 1400/7/1200 max null typeless byte-identical + Inferno 69 waves TIERS+ZUK69 vs wiki distinct from Jad 3127 CHK-175 (Mole JAD 7700/7704 separate):** Active monsters-complete 7706 vs DB 7706 1400/7/1200 null ranged/magic/typeless speed10 550/450 elem 2/40 + InfernoWaves TIERS bat/blob/meleer + InfernoRun 69 waves + Zuk 7706 tick-driven Max251 vs DB 3127 Jad 702/5/250 + 7700 JAD Inferno 900/5/350 113 byte-identical cohort. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 7706, 7700, 3127, 1400, 69, 69.

---

- **Abyssal whip 4151 slash82 str82 Atk70 WHIP speed4 vs Abyssal tentacle 12006 slash90 str86 Atk75 WHIP vs DB 4151 cost120001 + 12006 cost289800 + Kraken component 12004 non-equip clean distinct from CHK-046 drop 12004 1/400:** Active 4151 WHIP 0,82,0,82 WHIP Atk70 weight0.45 high72000 low48000 vs DB 4151 82/82/70 whip4 cost120001 + tentacle 12006 90/86 Atk75 WHIP high173880 vs DB 12006 90/86/75 whip4 cost289800 trade false vs component 12004 non-equip + BonusManager slash1 strength + Accuracy/Damage consumers distinct from drop CHK-046. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4151, 12006, 12004, 82, 90, 70.

---

- **Dagannoth Prime 2266 monsters-complete + dagannoth_prime drops main128 magic max50 speed4 vs DB 2266 byte-identical family with Supreme 2265 CHK-083 distinct magic vs ranged via loader NpcDefinition fromMonsterDump + spawns 2911,4387/4451:** Active monsters-complete 2266 Prime vs DB 2266 46 fields identical 303 size3 hp255 max50 magic speed4 def255/255/255/255/10 elemental 3/35 + loader resolveAttackType MAGIC vs Supreme ranged 30 + drops dagannoth_prime main128 30 entries tertiary 12113 vs Supreme family via NpcDrops. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 2266, 2265, 128, 303, 50, 10.

---

- **Zulrah 2042/2043/2044 500 trio + Snakeling 2045/2046 hp1 vs DB 2042/2043/2044 500 + Snakeling 2045/2046 via monsters-complete + ZulrahFight transform setNpcTransformationId + Rotations zulrah rolls2 byte-identical clean:** Active monsters-complete 2042 Green 500 max41 + 2043 Magma 500 max30 + 2044 Tanzanite 500 max41 + 2045/2046 hp1 max15/13 vs DB 2042/2043/2044 500 + Snakeling 2045/2046 hp1 via NpcDefinitionLoader Slav=1 xp500 size5 poison/venom + ZulrahFight shared HP transform setNpcTransformationId + ZulrahRotations OPENING 4 + ROTATIONS 9-10 phases Wiki only no DB phase table + NpcDrops rolls2 + ZulrahHazards 2045/2046 already CHK-054/124 clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 2042, 2043, 2044, 2045, 2046, 500, 12939, 41.

---

- **Slayer cave-kraken weights Chaeldar 12 (30-50) + Nieve 6 (100-120)+ Konar 9 (80-100)+ Duradel 9 (100-120) ext150-240/180-240 via Slayer.plugin weighted roll vs DB Nieve 1752 w6/ Duradel 9077 w9 byte-identical distinct from CAND-103 frost 5 vs 8 Chance of Heavy Frost unlock root:** Active slayer-tasks Nieve 6797 frost 5 60-100 + cave-kraken Nieve 6 100-120 + Chaeldar 12 30-50 + Konar 9 80-100 via Slayer.plugin weight/quantity vs DB slayer-tasks 07 w6/9/12 byte-identical via loader weighted sum 138 vs CAND-103 frost-dragons weight5 vs 8 via Chance of Heavy Frost 100pts + I See Dragons extend 180-240 not branched distinctly hold dup for frost vs cave-kraken clean. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 6797, 7108, 13622, 30, 50, 100, 120, 80.

---

- **Abyssal demon 415/416 150hp max8 stab demon slayer85 byte-identical active vs DB 415 via monsters-complete + whip 4151 1/512 parity:** Active monsters-complete 415 Abyssal demon vs DB monsters-json 415.json byte-identical 38 fields (150hp max8 stab 97/67/135 def20/20/20/0/20 demon slayer85) + duplicate 416. Drops abyssal_demon 4151 Abyssal whip 1/512 separate_roll weight1 out512 identical both sides + 13265 dagger 1/32000. Loader -> DamageFormulas clean. Distinct from Kraken 12004 CHK-046 1/400. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 415, 416, 4151, 150, 8, 85, 512, 13265.

---

- **Cave crawler 406 22hp max3 stab slayer10 byte-identical active vs DB 406 via monsters-complete (King 127 phantom, Right head):** Active monsters-complete 406 Cave crawler 22hp max3 stab 10/10/5/5 weak0/0 slayer10 vs DB monsters-json 406.json byte-identical 38 fields (22 vs 22.0 float). 127 is Right head object not monster. Loader defence_ranged_standard 10 collapse moot. Drops cave_crawler 128 byte-identical. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 406, 127, 22, 3, 10, 128.
