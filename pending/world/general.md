# Pending — world/general

> **Candidates** (34) — need verification before promotion. Each is a **CAND**; triple-verify active + exact DB key + Wiki before filing. One root per entry.

- **Dragon hunter wand incorrectly stacks with Salve amulet (i) against undead dragons:** Active Dragon hunter wand effects and Salve amulet(i) effects compose without exclusion, multiplying their combat modifiers against an undead dragon. Exact DB keys verify item identity; official dragon-hunter and Salve rules require that the Salve bonus does not stack with dragon-bane weapon bonuses. Candidate-only; evidence and precise paths retained in prior report sources.

---

- **Butterfly net Hunter requirement (ID 10010):** Active wearable omits exact DB Hunter 15 requirement; ordinary equip has no Hunter gate. Candidate-only.

---

- **Ardougne diary pickpocket override:** Reachable pickpocket success logic omits medium Ardougne +10% override and hard-tier global override. Candidate-only; distinct shared Thieving behavior.

---

- **Serpentine helm / Noxious halberd envenom chance:** Active chance is 1/6, current official rules specify 1/2. Candidate-only; separate from `NEW-COMBAT-009` Virulence special.

---

- **Tuna cooking no-burn threshold is too low (Raw tuna 359 → Tuna 361 / burnt tuna 367):** Active stopBurn 58 guarantees success at 58; current official level is 63 on fires and ordinary ranges. Candidate-only.

---

- **Normal Infinity hat/top/bottoms retain the pre-2024 zero Magic-damage bonus (IDs 6918/6916/6924):** Active bonus slot 12 is 0; exact DB keys/current official page specify 1% for each. Loader and runtime magic max-hit consumer confirm behavior. Candidate-only; already recorded in legacy Work Log.

---

- **Bone dagger Backstab omits conditional guaranteed accuracy (IDs 8872/8874/8876/8878):** Active special registers only ordinary accuracy roll; current official special rule guarantees hit for targets not previously damaged by the wielder (or whose latest attacker differs). Candidate-only; Defence-drain behavior excluded.

---

- **Appearance save sanitizer may discard selectable current-cache kits outside legacy bounds:** Client can select/cache-send IDs, but PlayerSave clamps kit slots to legacy ranges. No concrete selectable revision-241 out-of-range kit was decoded; conditional candidate.

---

- **Dragon mace Shatter uses the selected Spike/stab defence roll (base ID 1434):** Active special cost/multipliers match; MACE Spike is stab and no special crush override exists, whereas official Shatter rolls against crush defence. Candidate-only; Bounty Hunter/ornamented variants excluded.

---

- **Withdraw-All-but-one silently no-ops with one item in the bank slot:** Active amount logic produces zero and skips `Bank.withdraw()` when total is one; current official Bank rules specify user-facing feedback. Candidate-only; missing feedback scope only.

---

- **Dorgeshuun crossbow Snipe (item 8880) corroboration:** Conditional guaranteed-hit omission corroborates Bone dagger target-history candidate; player-only Defence drain corroborates accepted `NEW-COMBAT-001`. Not separate candidates.

---

- **Aurel quest gate and Phantom Muspah shard exclusivity were resumed and independently rechecked on 2026-10-12.** Both remain candidate-only under the integrity hold. See current entries above and `05_Audit_Log.md` for the chronological note.

---

- **Public-chat Hide suppresses overhead text (mode 3):** Revision-241 cache CS2 option script 175 maps Public tab Show standard/Friends/none/Hide options (ops 3–6) to modes 0/1/2/3 through scripts 184/CHAT_SETFILTER; op 2 separately selects autochat mode 4. Current official [Chat Interface](https://oldschool.runescape.wiki/w/Chat_Interface#Public) says Hide suppresses public chat-panel messages but allows overhead, while Show none ceases public display. Cache chat-display script 90 confirms mode 2 returns before public overhead processing, while mode 3 filters the panel message and continues to its later overhead path. However, active server `PlayerRelations.setChatModes()` clamps modes to 0–3 and `canReceivePublicChatFrom()` permits only mode 0 or friend senders in mode 1 (`Typescript-RSPS/server/src/main/typescript/elvarg/game/model/PlayerRelations.ts:49-52,79-83`). Both `ChatPacketListener.handleText()` recipient delivery (`.../net/packet/impl/ChatPacketListener.ts:46-68`) and `PlayerSession.createActorUpdates()` overhead serialization (`.../net/PlayerSession.ts:536-547`) use that predicate, suppressing mode-3 overhead. Candidate limited to Hide-mode overhead; chat-panel Hide filtering is implemented in the cache script; no unrelated public-chat claim.

---

- **Stronghold of Security door questions accept every selected answer (conditional on door exposure):** Active `StrongholdOfSecurity.plugin.js:18-20` registers `Doors.open` for each floor door. `SosDoors.js:121-140` builds answer callbacks that record the door as answered and call `pass()` after displaying any selected option's response; `open()` only asks once for a qualifying gap door, then subsequent opens pass through. Active question data includes both `Correct!` and `Wrong!`/`Incorrect!` options (`stronghold-of-security.json:168-183,681-695`), yet the handler never checks correctness. Current official [Stronghold of Security](https://oldschool.runescape.wiki/w/Stronghold_of_Security) states that the second door occasionally asks new visitors a security question and they must answer correctly to pass. Exact DB object summaries identify door/route object names only, not answer mechanics. Candidate applies if the named Stronghold doors/actions are exposed: active object-spawns is empty and selected-cache door placement/actions were not decoded, so current map exposure is unverified. No duplicate in available Memory registers; static trace only, no live interaction.

---

- **Ring of dueling Fortis Colosseum teleport lacks Hero-title unlock (IDs 2552–2567):** Active `items/jewellery/teleportJewellery.js:92-115` exposes Fortis Colosseum for every charged ring ID (8 to 1) with no rank predicate; `Jewellery.plugin.js:100-115,136-166,179-198` routes inventory Rub and worn options through that destination and generic teleport requirements only. The active Colosseum tracks Hero at 12,000 Glory (`ColosseumShared.js:93-96,124-130`) and persists best Glory after a finished run (`Rewards.Colosseum.js:117-121`, `ColosseumRun.js:361-367`), but the ring route never checks it. Exact `READ-ONLY-DB/docs/items-json/2566.json:2-23,33-50` identifies the one-charge ring; same active cohort IDs 2552–2567 map charges 8–1. Current official [Ring of dueling](https://oldschool.runescape.wiki/w/Ring_of_dueling) specifies Fortis Colosseum unlock upon earning the Hero title; the official Colosseum rank threshold is 12,000 Glory. Duplicate-screened available Memory registers; no ring/Colosseum unlock candidate found. The active data comment says the destination is open because there was no Colosseum, but a Colosseum implementation is present. Candidate-only; static review, no teleport/tests/builds or TSPS/DB edits.

---

- **Granite hammer Hammer Blow misses fail to deal the guaranteed 5 damage (IDs 21742–21744):** Active `Typescript-RSPS/server/plugins/combat/specials/GraniteHammer.SpecialAttack.js:20-37` registers all three hammer variants with 60% special-energy drain, 1.5× accuracy, and +5 minimum/maximum damage bonuses, but no miss-damage branch. `PendingHit.ts:185-190,278-322` resolves inaccurate hits to zero damage; the +5 bounds are rolled only for accurate hits through `CombatFactory.rollSpecialDamage()` (`CombatFactory.ts:299-327`). The authoritative key `READ-ONLY-DB/docs/items-json/21742.json:2-3,17-22` confirms item 21742 is an equipable Granite hammer but contains no special-attack contract. Current official [Granite hammer](https://oldschool.runescape.wiki/w/Granite_hammer#Special_attack) rules say Hammer Blow guarantees at least 5 damage even on a miss, except against targets immune to ordinary attacks. Candidate-only; duplicate screening of available Memory registers found no Granite hammer/Hammer Blow entry. The plugin itself notes this missing behavior at line 2. Static trace only; no combat or tests/builds.

---

- **Attack and Strength prayers fail to conflict (DB prayers 2–3; active indexes 1–2):** The exact prayer records `READ-ONLY-DB/docs/prayers-json/2.json:2-13` and `3.json:2-13` identify Burst of Strength and Clarity of Thought and their separate bonuses; DB/schema do not encode conflict groups. Active `PrayerHandler.ts:154-167` resets same-family, Ranged, and Magic prayers when activating either basic Strength or Attack prayers, but Strength activation does not clear Attack and Attack activation does not clear Strength. Both flags therefore remain active and their separate accuracy/damage consumers can apply both bonuses. `QuickPrayers.ts:207-220` repeats the same omission during setup selection. Current official [Prayer](https://oldschool.runescape.wiki/w/Prayer#Conflicting_prayers) puts both families in the same Offence Boosting conflict group. Candidate-only; duplicate search across accessible Memory registers found no cross-family conflict candidate. Static trace only; no live prayer interaction or tests/builds.

---

- **Magic pyre-log creation overconsumes Sacred oil and omits creation XP/timing (1513 + oil → 3448):** Active `Typescript-RSPS/server/plugins/quests/quests/ShadesOfMortton.Quest.js:167-175,536-579` assigns Magic logs a five-dose recipe; the reachable item-on-item handler drains those doses, deletes one log, and adds one Magic pyre log synchronously, with no Firemaking XP award or production delay. Exact keys `READ-ONLY-DB/docs/items-json/{1513,3430,3432,3434,3436,3448}.json` confirm Magic logs, Sacred oil doses, and Magic pyre logs. Current official [Magic pyre logs](https://oldschool.runescape.wiki/w/Magic_pyre_logs#Creation) specifies four oil doses, level 1 Firemaking, 20 XP, and four ticks. No same-recipe/root candidate found in the available Memory registers; NEW-FIRE-001 is colored-log lighting, a different action. Scope is Magic pyre logs only; other pyre-log tiers were not checked.

---

- **Power of Death is not applied by four registered staff specials (IDs 11791, 12904, 22296, 24144):** Active `StaffOfTheDead.SpecialAttack.js`, `ToxicStaffOfTheDead.SpecialAttack.js`, `StaffOfLight.SpecialAttack.js`, and `StaffOfBalance.SpecialAttack.js` each drain 100% and play activation effects (`:19-24`) but contain no defensive-state application; each file explicitly notes the missing incoming-damage hook. The core provides such a consumer mechanism (`EquipmentEffects.ts:106-110,162-166`; `CombatFactory.ts:247-248`), but these specials register no modifier or timed state. Exact keys `READ-ONLY-DB/docs/items-json/{11791,12904,22296,24144}.json:2-3,17-19` establish the four equipable staff identities. Current official [Staff of the Dead](https://oldschool.runescape.wiki/w/Staff_of_the_Dead) documents the shared special: halve incoming melee damage for one minute; the three upgraded variants share its benefits. Duplicate screen found no Power of Death candidate in the pending or detailed finding registers. No live combat test.

---

- **Barrows equipped degradation short-circuits after the first piece (Ahrim's and all sets; `||=` bug):** `Typescript-RSPS/server/plugins/items/BarrowsEquipment.plugin.js:62-69` iterates `player.getEquipment().getItems()` and for each Barrows item executes `changed ||= setDurability(item, durability(item)-1)`. JS `||=` short-circuits the RHS once `changed` is `true`, so only the first equipped Barrows piece in iteration order actually degrades each tick; remaining equipped pieces are skipped. `Barrows.ts` (`Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/Barrows.ts:1-60`) defines `BASE_ITEMS` (4708,4710,4712,4714…), `stageItemId` mapping `4856+index*6+stage`, and `isBarrowsItem`/`baseItemId` used by both degrade and amulet logic; `degradeEquipment` is invoked from `startDegradation` (`:87-118`) on a 90-tick `Task` while in combat (`CombatFactory.inCombat`). The amulet branch (`:71-82`) correctly sets `changed=true` without `||=`. Expected OSRS rule: all equipped Barrows pieces degrade independently. Candidate-only; verified by code inspection + Ahrim base/stage IDs and runtime Task trigger. No existing `registry.json` Barrows-degradation candidate; `AUD-069` is a distinct NPC-option binding. No DB item-rule parity claim needed (degradation timing is not DB-encoded); no TSPS/DB edits.

---

- **Charged Tome of Fire (shield 20714) does not boost Fire Surge (10020 Fire Surge / 21879) max hit (conditional on charges):** Exact `READ-ONLY-DB/docs/items-json/{20714,20716}.json` identify `20714 Tome of Fire` and `20716 Tome of Fire (empty)` as `equipable:true, slot:shield, requirements:{magic:50}, magic +8/+8, magic_damage 0.0` with `tradeable false`; `27358` is an additional Tome variant — DB confirms equipment/bonus/requirement only (not charges). Active `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/magic/CombatSpells.ts` defines `FIRE_SURGE = new CombatNormalSpell({maximumHit:24, baseExperience:50.5, levelRequired:95, spellId:21879, members:true})` with runes `556×7/554×10/21880`; `DamageFormulas.ts:getMagicMaxhit(180-203)` → `CombatSpells.applyChargeMaxHit(313-318)` only boosts `Charge` (+ god-spell capes) to `30`, and `applyMagicDamageBonus(325-341)` uses `MAGIC_STRENGTH` + prayers via `EquipmentEffects`. Searched `server/src/**` + `server/plugins/**/*.js` for `tome.*fire`/`fire.*tome`/`20714`/`50%` tome damage — no shield-tome `50%` fire-spell max-hit branch exists (searched `DamageFormulas.ts`, `EquipmentEffects.ts`, `MagicCombatMethod.ts`, `CombatFactory.ts`; only `TOME_OF_FIRE` constants appear in `ItemIdentifiers.ts` and wintertodt rewards). Expected current [Tome of Fire](https://oldschool.runescape.wiki/w/Tome_of_fire) / [Fire Surge](https://oldschool.runescape.wiki/w/Fire_Surge) when charged (burnt pages → 20718) and equipped in shield slot, the Tome adds 50% magic damage to fire combat spells (consuming one charge per hit) — for `Fire Surge` that is `24 → 36` before other bonuses; active generic magic hit path never applies that 50% for `20714` vs `FIRE_SURGE`. Candidate-only, conditional on the shield being the charged variant having remaining charges (charge persistence/consumption unverified in TSPS; empty 20716 correctly should not boost). Distinct from `CAND-092` (halberd sweep) and prior elemental-spell handoff notes. No DB damage rule; no live cast damage test/builds; no TSPS/DB edits.

---

- **Ordinary lamp/lantern lighting (tinderbox 590 -> oil lamp 4522/4524/4525, oil lantern 4537/4539, candle lantern 4529/4531/4534, bullseye 4544/4550) has no active tinderbox onItemOnItem handler — only Darkness predicate check, no swap:** ItemIdentifiers 4522 OIL_LAMP, 4524 lit, 4525 empty, 4527 empty candle, 4529/4531/4534 candle lit variants, 4537/4539 oil lantern, 4540 frame, 4542 lens, 4544/4550 bullseye lit family; Darkness.plugin.js CARRIED_LIGHT_SOURCE_IDS predicate only; Firemaking.plugin.js 590 tinderbox + LIGHTABLE_LOGS only, zero lamp/lantern refs; item-gameplay 4524-4550 defines lit/unlit but no action mapping; exhaust grep plugins for tinderbox x 452x =0 hits; Client ItemOnItem -> PluginManager dispatch falls through. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line block). DB keys verify item/NPC/object identities; runtime dispatch traced; Wiki supplies missing rule where DB not authoritative. Candidate-only; 4522, 4524, 4525, 4529, 4531, 4537 sampled. Distinct root; dup screen vs registry findings/pending/completed 0 hits for primary terms. No live build/test or TSPS/DB edits.

---

- **Ruby bolts (e) 9242 / Ruby dragon bolts (e) 21944 Blood Forfeit proc: 10% fixed vs Wiki 1/11 inclusive (9.09%), no PvP vs PvP diary/accuracy branching, and inaccurate hits never proc (Wiki roll regardless of accuracy):** RangedData 29-50 ENCHANTED_RUBY_BOLT cost 10% HP, forfeit min(100,20% target) GFX754 1.31x; CombatFactory 365 boltEffectTriggered = Misc.getRandom(10)==1 (1/11 inclusive, not 1/10) with optional multiplier only; applyExtraHitRolls 377 early if(!accurate) skip, requires RANGED+player+boltEffects+trigger then getSpecialEffectsMultiplier; PendingHit prepareHits accurate via rollAccuracy; No target.isPlayer branch, no diary check. DB 9242/21944 identity only; Wiki defines PvP care, diary adjust, accuracy-independent roll. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line block). DB keys verify item/NPC/object identities; runtime dispatch traced; Wiki supplies missing rule where DB not authoritative. Candidate-only; 9242, 21944, 756 sampled. Distinct root; dup screen vs registry findings/pending/completed 0 hits for primary terms. No live build/test or TSPS/DB edits.

---

- **Trade escrow persistence is not atomic — sequential dual saves violate Trading.ts:302-303 comment; crash between saves dupes/loses items (in-memory atomic only):** Trading.ts 240-340 acceptTrade TRADE_SCREEN freeSlots + button_delay + state machine to ACCEPTED_CONFIRM_SCREEN + transfer loop addItem + emitTradeCompleted x2 + sequential Trading.save(player) then save(interact_) then reset + encodeTradeClose; abort 214-238 rollback; Player.ts:1068 logout closeTrade before save. Sequential dual PlayerSave violates own atomic comment. DB has zero trade-container keys. Normal-operation dupe-safe via validate+state-machine but crash between second save gap remains. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line block). DB keys verify identities; runtime dispatch traced; Wiki supplies missing rule where DB not authoritative. Candidate-only; 302, 303, 240, 95 sampled. Distinct root; dup screen vs registry findings/pending/completed 0 hits for primary terms (see scout dupHint). No live build/test or TSPS/DB edits.

---

- **Music unlock bitfields (27 varps 20..4945 + varbit 10078 varp 3883/18) never written by server — region->track Music.forRegion fires unconditionally on region change bypassing unlock state (no READ-ONLY-DB music corpus):** Client vars 27 MUSIC_UNLOCK_VARPS 20-4945 capacity864 varbit10078 varp3883/18 + music-data.json regions collapsed regionId ((x>>6)<<8|(y>>6)) -> trackId Music.forRegion + PlayerSession tick flush sceneTile BoatManager lastMusicRegion compare -> encodePlaySong 133 10B -> NetworkBuilder varp_transmit never handles 27 unlock varps 3883/10078 + Cs2Vm playSong MusicSystem synthesis no unlock gate + docs ferox-enclave 'server has no music unlocks, so the music follows the region'; Giant Lair / Mad Angel overrides via sendSong; DB has no music table; pending 0 music hits. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Non-SoS emote unlocks absent — Flex 12062 (Atlas Below Ice Mountain q4GQkU), Crab dance 10065 (Crab Quest conditional branches), Fortis Salute Grand Champion 20000 have DB dialogue/varbit sources + animations but no active server varbit 12062/10065 send/persistence/handler; interface enables all slots without gating (SoS 2309-2312 correctly gated only):** Active SosData claim() sendVarbit 2309-2312 Flap/Slap/Idea/Stamp + SosRewards 2000/3000/5000 + stronghold-of-security.json reward.emoteVarbit correct; Emotes.plugin 56 slots no unlock varbit gating, Emotes.ts empty EmoteData AUD-017 separate; Flex DB 9ebee09c q4GQkU You have unlocked flex emote Atlas training + inferred-actions + varbit 12062 + client seq emote_flex 8917 but no server send; Crab DB 8ff344 conditional has not unlocked branches + varbit 10065 + client 10051/52 but no server gate Quest plugin no Crab Quest; Fortis DB b0792a Grand Champion will unlock + ColosseumShared RANKS 20000 Rewards gloryFor no emote send + client 10796 varlamore_salute; interface enables all slots, SoS only correct case. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Ancient wyvern shield creation (visage 21637 + elemental shield 2890 @ anvil 66 Smithing -> 21634) has no active handler and shield omitted from CombatEquipment.hasDragonProtectionGear (only anti-dragon/dragonfire shield/ward):** Identifiers 21633/21634/21637 present + DB visage 750k; Smithing.plugin anvil only handles SMITHABLE_EQUIPMENT_BY_BAR 2349-2363 no visage branch grep visage/WYVERN 0 handlers, no onItemOnItem/onObject; CombatEquipment.hasDragonProtectionGear only ANTI_DRAGON_SHIELD/DRAGONFIRE_SHIELD/WARD omits ANCIENT_WYVERN_SHIELD despite wiki dragonfire protection lineage. Two related gaps for same item family, one root cause collection via wyvern line; distinct from existing wyvern parity. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Super restore 3024-3031 gameplay rows vs DB items-json 3024/3026/3028/3030 value/highAlch/lowAlch/weight/examine diverged + blighted 24598-24605 + mix 11493 + LMS 23567 coverage incomplete/truncated (effect 8+25% faithful):** Active item-gameplay 3024 value10468/7830/5033/2505 high144 low96 weight0 examine X dose(s) of super restore potion noteId chain vs DB items-json 3024 cost300 low120 high180 weight0.035 4 doses 3026 cost240 low96 high144 weight0.03 3028 cost180 low72 high108 weight0.025 3030 cost120 low48 high72 weight0.02 examine doses of super restore potion linked 15277 etc tradeable true; Blighted 24598 cost40 low16 high24 weight0.035 vs 24601 etc diverged or unverified due 10MB truncation; Potions.plugin applySuperRestore 8+25% (27% with holy wrench) faithful to DB wiki restore 8+25%; Effect clean, gameplay metadata divergent, LMS/mix not fully readable; no duplicate registry hit. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Fighter torso (broken) 20513 weight 0 vs DB 4.0 + examine Unknown vs A broken Penance Fighter torso. (distinct from fighter torso 10551 CHK-012 clean):** Active item-gameplay 20513 Fighter torso (broken) examine Unknown NONE weight0 value0 high0 low0 vs DB items-json 20513 weight4.0 cost1 low0 high0 examine A broken Penance Fighter torso. equipable false null placeholder20514 wiki Fighter torso (Broken); Active 10551 CHK-012 clean Fighter torso weight4 bonuses62/85/62 req40 BODY + 24175 (l) weight4 clean; BrokenItem.ts FIGHTER_TORSO_BROKEN [10551,20513] runtime consumer; dup-screen 0 hits for 20513 distinct from 10551 CHK-012. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Treasure Trails emote clues 10238 Bow at top of lighthouse + family have DB identities but zero Treasure Trails emote/clue validation system — no Uri/no validation handler, SoS 2309-2312 correctly gated only emote system present:** DB items-json 10238 Clue scroll hard Bow at lighthouse cost20 examine A clue! + registry 10238 Clue scroll hard - Bow at top of lighthouse timestamp 2026-08-25 vs TSPS item-gameplay 10238 generic Clue scroll hard examine A set of instructions value0 high0 low0 weight0 identical to generic rows 10236/10240 + HorrorFromTheDeep lighthouse world 4577 but no emote clue 10238 handler Uri validation + SoS authoritative 4 floors emoteVarbit 2309 Flap 2310 Slap 2311 Idea 2312 Stamp via stronghold-of-security.json + SosData claim sendVarbit + SosRewards coins+jingle; Emote system absent beyond SoS. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 10238, 2309, 2310, 2311, 2312, 10236, 10240).

---

- **Smoke Burst 62 maxHit 13 understated vs Wiki 17 (Burst_spells table 17/36 vs active 13/36; equals Smoke Rush 13 copy-paste; Shadow 64 18/37 Blood 68 21/39 Ice 70 22/40 clean rune-identities DB-verified):** CombatSpells SMOKE_BURST 62 maxHit13 baseExp36 Air2 Fire2 Chaos4 Death2 radius1 vs Wiki Smoke Burst 17 36 same runes Burst table 17; SHADOW_BURST 64 18/37 Soul2 Chaos4 Air1 Death2 clean drain 10% 3x3; BLOOD 68 21/39 Blood2 heal floor(dmg*0.15) vs Wiki 25% deferred to tier audit; ICE 70 22/40 Water4 freeze10s via freeze16.6 ticks; DB rune IDs 560/562/556/554/566/565/555 only; Sire disorient 50% p1 absent informational. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 62, 64, 68, 70, 13011, 560, 562, 556).

---

- **Lunar Vengeance self L94 4×Astral 9075/10×Earth 557/2×Death 560 self path dead-defines 94/112 but delegates to EffectSpells 9136 L94 14000 (140) vs Wiki 112 + does NOT award Magic XP vs other L93 3×Astral 10000 vs Wiki 108 correctly awards via LunarSpell.cast:** LunarSpells SELF vengeance 94/112 4×9075/10×557/2×560 delegates to EffectSpells VENGEANCE 9136 L94 14000 4× + OTHER 9135 L93 10000 3× vs DB items 9075 Astral 557 Earth 560 identities only vs Wiki Vengeance 94 112XP 4/10/2 vs Other 93 108XP 3/10/2; EffectSpells sets hasVengeance+30s timer157 anim8316/gfx726 consumes runes but does NOT award XP vs LunarSpell.cast for other does award 108. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 94, 93, 112, 108, 9075, 557, 560, 9136).

---

- **Charge attribute charge:until via 420s attribute transient not persisted in PlayerSave persistentAttributeKeys vs Teleblock 12445 timer persisted 300s/150s protected via Timer 161 (VarPlayer 109/110 gap but not spell rows):** ChargeSpell 299-318 charge:until 420s via attribute vs TELEBLOCK 1730 CombatEffectSpell 300s/150s protected via Combat.teleblockTimer SecondsTimer persisted via PlayerSave teleblockTimer vs charge not in persistentAttributeKeys 42-53 so logout loss vs TeleportHandler checkReqs plus god-spell 30 cap via DamageFormulas applyChargeMaxHit vs DB VarPlayer 109 TRAWLER/110 gap no spell DB. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 109, 110, 12445, 420, 300, 150, 1190, 1191).

---

- **Granite helm 10589 / body 10564 / legs 6809 / shield 3122 understated requirements vs DB (helm Def40 omitted, body/legs Def50+Str50 omitted vs DB Def50+Str50, shield magic -2 vs 0 plus Def50 gate) + helm bonus drift, boots 21643 clean:** Active item-gameplay granite family vs DB items-json exact keys: 10589 helm COIF Def40 omitted vs DB Def50+Str50, 10564 body no requirements vs DB Str50 Def50, 6809 legs no requirements vs DB Str50 Def50, 3122 shield magic_def -2 vs DB 0 plus Def50 gate understated; boots 21643 feet -3/-1 15/16/17 Def50 clean via CHK-005. Loader ItemDefinitionLoader onto cache BONUS/REQ; BONUS offset causes ranged attack drift like mithril family but helm family is COIF not HELMET distinct. Distinct from Neitiznot 10828 CHK-228 and antique lamp 21640 mis-ID. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 10589, 10564, 6809, 3122, 21643, 4153, 12848, 21736, 21739, 21742).
