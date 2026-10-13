# findings/combat.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

### [AUD-001] Elemental weaknesses are not ingested into server NPC combat definitions

Severity: Medium
Status: Open
Category: 2. Monsters / NPCs / Combat Stats (also 9. Combat Formulas)
Location: `server/src/main/typescript/elvarg/game/definition/loader/impl/NpcDefinitionLoader.ts:9-40,69-111,227-242`; `server/src/main/typescript/elvarg/game/definition/NpcDefinition.ts:18-55,211-245`; magic roll/damage paths at `server/src/main/typescript/elvarg/game/content/combat/formula/AccuracyFormulasDpsCalc.ts:558-590` and `.../DamageFormulas.ts:325-353`
DB Reference: `READ-ONLY-DB/docs/monsters-complete.json` → NPC 1 (Molanisk: `elemental_weakness_type=3`, `elemental_weakness_percent=60`) and NPC 2 (Aberrant spectre: type 1, percent 50). TSPS runtime `server/data/definitions/monsters-complete.json` contains matching field values for both sample IDs.
Description: TSPS reads the fork-schema monster dump but does not translate or retain its elemental-weakness fields in the server NPC definition/combat path.
Evidence:
Code currently does: `NpcDefinitionLoader.CombatStats` declares no weakness fields. `fromMonsterDump()` maps combat fields but not either elemental field. Loader assignment at lines 227-242 applies only translated stats/properties. `NpcDefinition` has no weakness state/accessor. Inspected magic accuracy and damage calculations do not consult target weakness; a server search for `elemental_weakness`, `elementalWeakness`, and `ELEMENTAL_WEAKNESS` found no TypeScript/plugin consumer.
osrsreboxed-db says: Its monster rows 1 and 2 carry explicit weakness type/percent. A read-only JSON comparison confirmed TSPS's actual vendored rows 1 and 2 carry the same values, ruling out absent local input for these samples.

Impact: The server cannot apply the DB-provided elemental weakness behavior to player magic attacks through the inspected NPC/combat path. A full census of applicable spells/monsters remains part of the combat audit.
Suggested fix direction (do NOT implement): Preserve weakness metadata in NPC runtime definitions and implement its combat effect after verifying exact OSRS rules and boundary behavior for missing/zero weakness.

---

### [AUD-002] Ranged defence is collapsed to the standard category

Severity: Medium
Status: Open
Category: 2. Monsters / NPCs / Combat Stats (also 9. Combat Formulas)
Location: `server/src/main/typescript/elvarg/game/definition/loader/impl/NpcDefinitionLoader.ts:9-40,95-110,215-225`; `server/src/main/typescript/elvarg/game/definition/NpcDefinition.ts:7-15`; `server/src/main/typescript/elvarg/game/content/combat/formula/AccuracyFormulasDpsCalc.ts:452-466`
DB Reference: `READ-ONLY-DB/docs/monsters-complete.json` → NPC 2 (Aberrant spectre): `defence_ranged_light=15`, `defence_ranged_standard=0`, `defence_ranged_heavy=15`. The same values are present in TSPS's local runtime `server/data/definitions/monsters-complete.json` key `2`.
Description: TSPS's NPC combat model retains one ranged-defence bonus and always reads the DB's standard value, while the authoritative row distinguishes light, standard, and heavy.
Evidence:
Code currently does: `fromMonsterDump()` maps only `monster.defence_ranged_standard` into `defenceBonuses.ranged`; loader writes that one number to stat slot 14. `NpcDefinition` documents a single ranged defence slot. `AccuracyFormulasDpsCalc.defenseRangedRoll(enemy)` reads one `BonusManager.DEFENCE_RANGE` value and accepts no ranged attack-category argument.
osrsreboxed-db says: NPC 2 has light/heavy values 15 and standard 0. The local TSPS source data retains all three values, confirming the collapse is in the adapter/model rather than the sample input.

Impact: Against this NPC, the current ranged defence roll uses 0 for all ranged attacks; attacks in light/heavy categories do not receive their record's defence bonus. Other NPCs' impact depends on whether their three values differ.
Suggested fix direction (do NOT implement): Carry the three fields into NPC runtime state and choose the matching value for the incoming ranged attack category before the defence roll.

---

### [AUD-003] Vendored Whisperer ranged defence exceeds the authoritative DB

Severity: Medium
Status: Open
Category: 19. Data consistency bugs (also 2. Monsters / NPCs / Combat Stats)
Location: `server/src/main/typescript/elvarg/game/definition/loader/impl/NpcDefinitionLoader.ts:102-110,137,203-225`; `server/data/definitions/monsters-complete.json` → IDs 12206-12207
DB Reference: `READ-ONLY-DB/docs/monsters-complete.json` → NPC IDs 12206 and 12207, The Whisperer.
Description: The server's actual vendored monster data specifies ranged defence 300 for both Whisperer variants; the authoritative DB gives 250 in all three ranged-defence categories.
Evidence:
Code currently does: `NpcDefinitionLoader` reads `./data/definitions/monsters-complete.json`, applies same-name entries and maps `defence_ranged_standard` into the runtime's single ranged-defence slot. Read-only JSON comparison found TSPS IDs 12206 and 12207 have light/standard/heavy = 300 and their names match the corresponding DB keys.
osrsreboxed-db says: IDs 12206 and 12207 each have `defence_ranged_light=250`, `defence_ranged_standard=250`, `defence_ranged_heavy=250`.

Impact: The server loads a standard ranged defence bonus 50 points above the authoritative value for both Whisperer definitions, increasing their ranged defence roll. The light/heavy runtime effects are already limited by the single-standard-field collapse documented in AUD-002.
Suggested fix direction (do NOT implement): Refresh/correct the two vendored rows against the authoritative dump, retaining local overrides only if intentionally documented.

---

### [AUD-021] Deadeye and Mystic Vigour are absent from the prayer engine

Severity: High (conditional on current OSRS prayer parity being in scope)
Status: Open
Category: 18. Missing modern OSRS features (also 8. Prayer, 9. Combat Formulas, and 20. Client-specific issues)
Location: `server/src/main/typescript/elvarg/game/content/PrayerHandler.ts:481-511,572-615`; `server/src/main/typescript/elvarg/net/packet/impl/ItemActionPacketListener.ts:123-163`; `server/src/main/typescript/elvarg/game/entity/impl/player/persistence/PlayerSave.ts:21-46`; client prayer definitions `client/rs/prayer/prayers.ts:122-570`; cache IDs `client/runelite/api/gameval/ItemID.ts:17303-17306,` and `VarbitID.ts:10390-10397`.
DB Reference: `READ-ONLY-DB/docs/items-json/30626.json` → item 30626 Deadeye prayer scroll, untradeable; `docs/items-json/30627.json` → item 30627 Mystic vigour prayer scroll, untradeable. The supplied prayer corpus contains records only for IDs 1–29; schema `data/schemas/schema-prayers.json:38-72` has no fields for the later prayer bonuses.
Description: TSPS has cache item/varbit identifiers for the 2025 prayers, but its active server prayer values, client prayer definitions, persisted unlock flags, and scroll-action switch stop before both additions.
Evidence:
Code currently does: `PrayerData.values()` enumerates 29 prayers through Rigour/Augury; quick prayer selection derives from that set. The first-item-action switch handles legacy scroll IDs 2542–2544 only; persistence includes Preserve/Rigour/Augury unlock attributes only. No Deadeye/Mystic Vigour runtime prayer entry, selection, unlock attribute/action, or combat consumer was found in the traced server/client prayer paths. The read-only DB records the two untradeable scroll items, but has no corresponding prayer data rows.
osrsreboxed-db says: Item records 30626 and 30627 identify the untradeable Deadeye and Mystic Vigour prayer scrolls. DB prayer data itself ends at ID 29 and therefore cannot establish the later prayer stats. The OSRS Wiki pages for [Deadeye](https://oldschool.runescape.wiki/w/Deadeye) and [Mystic Vigour](https://oldschool.runescape.wiki/w/Mystic_Vigour) document level requirements 62/63, drain 20/min, prayer effects, and scroll unlocks; each is an OSRS source, not a DB-record assertion.
Impact: On current OSRS rules, players cannot unlock, select, activate, quick-pray, or receive combat effects from either prayer despite the corresponding cache IDs and authoritative scroll item records. Conditional on this project intending current OSRS parity.
Suggested fix direction (do NOT implement): Add complete prayer definitions, scroll unlock/persistence, cache-tab state and conflict rules, and formula consumers, after verifying the correct cache/UI mapping and additive Defence behavior. Treat missing prayer DB rows as a source-corpus limitation, not a TS-vs-DB value mismatch.

---

### [AUD-059] Accursed sceptre Condemn skips valid zero-damage hits and all NPCs

Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/AccursedSceptre.SpecialAttack.js:10-14,39-44`; registration `Typescript-RSPS/server/plugins/combat/SpecialAttacks.plugin.js:11-13`; resolved-hit hook `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:842-843`.
DB Reference: `READ-ONLY-DB/docs/items-json/27665.json` -> item 27665, Accursed sceptre; equipable weapon. DB establishes item identity; special mechanics are confirmed by the OSRS Wiki Accursed sceptre special-attack section: https://oldschool.runescape.wiki/w/Accursed_sceptre#Special_attack.
Description: Condemn's after-hit gate requires positive damage, although OSRS defines any accurate hit as a successful hit regardless of damage; it also immediately skips every NPC target.
Evidence:
Code currently does: The active `SpecialAttacks.plugin.js` imports this handler and registers item 27665. `handleAfterHitEffects` returns unless the hit is accurate and total damage is greater than zero, then calls `condemn(target)`. That damage check suppresses a valid accurate zero-damage hit even against a player, contrary to the documented rule. For positive-damage accurate hits, `condemn` returns immediately whenever `!target.isPlayer()`, so NPCs receive no drain. Two in-memory smokes invoked the registered handler: an accurate zero-damage player hit produced zero skill writes; an accurate positive-damage NPC hit left Defence at 100 and produced zero `setDefenceLevel` writes. Live `NPC` state exposes temporary mutable Defence (`NPC.ts:426-449`) and the …
Impact: Condemn fails to drain stats for successful accurate zero-damage player hits and for any NPC target, weakening the special's intended effect in those cases.
Suggested fix direction (do NOT implement): Add per-NPC temporary Defence and Magic level state consumed by combat calculations, then apply Condemn's capped 15% reductions on successful hits to both players and NPCs.

---

### [AUD-070] Normal sheep never enter a sheared state or regrowth cooldown
Severity: Medium
Status: Open
Category: 2. Monsters / NPCs / Combat Stats (also 5. NPC Interactions / Right-click options and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/quests/quests/SheepShearer.Quest.js:38-50,145-158,294-320,376-378`; identifiers `Typescript-RSPS/server/src/main/typescript/elvarg/util/NpcIdentifiers.ts:2489-2495,2579-2582`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json` -> sheep IDs 2693–2699 (lines 17870-17924) and 2786–2789 (lines 18474-18504), each named Sheep with `Shear` option slot 1. DB establishes identity/options, not transformation timing. Current OSRS Wiki Sheep page specifies one wool, visibly thinner sheared state, and 50-tick regrowth for normal sheep: https://oldschool.runescape.wiki/w/Sheep.
Description: The active Shear option and shears-on-NPC handlers award wool for whitelisted normal sheep but do not transform the NPC, suppress further shearing, or track a regrowth timer.
Evidence:
Code currently does: `handleNpcInteraction` and `handleItemOnNpc` both call `shearSheep(player)` for the listed normal-sheep IDs. `shearSheep` checks shears and inventory capacity, animates, adds one wool, and sends a message; it is not passed the NPC and mutates no NPC state. The same live NPC ID remains in `SHEARABLE_SHEEP_IDS`, so repeat interactions award additional wool immediately. Identifier constants map the configured IDs to Sheep, and the authoritative NPC records expose the Shear action.
osrsreboxed-db says: The keyed interaction records verify that IDs 2693–2699 and 2786–2789 are Sheep with a Shear option. The authoritative DB does not encode shear state or timer; current OSRS Wiki behavior states that shearing a normal sheep yields one wool and changes its appearance to the thinner sheared form, which regrows after 50 ticks.
Impact: Players can repeatedly shear the same sheep for multiple wool without waiting for regrowth; the sheared appearance/state is absent. Finding scope is limited to normal sheep IDs handled by this quest hook; Zanaris-specific 100-tick behavior and other sheep are not asserted.
Suggested fix direction (do NOT implement): Apply the sheared NPC form and a per-NPC regrowth transition for the normal sheep IDs, keeping special variants on their own verified timing.

---

### [AUD-076] Dawnbringer special attack lacks its Theatre of Blood target restriction
Severity: Medium
Status: Open
Category: 18. Missing modern OSRS features (also 9. Combat Formulas and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/Dawnbringer.SpecialAttack.js:20-23` (target-gate TODO and `canAttack`); item 22516 registration in that plugin; `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:509-525` (combat eligibility invokes `canAttack`).
DB Reference: `READ-ONLY-DB/docs/items-json/22516.json` key 22516 -> Dawnbringer; confirms item identity/equipability, not the special restriction. Current OSRS Wiki Dawnbringer page: https://oldschool.runescape.wiki/w/Dawnbringer.
Description: The registered Pulsate special accepts any target because its combat-method gate unconditionally returns true instead of enforcing Theatre of Blood target eligibility.
Evidence:
Code currently does: `Dawnbringer.SpecialAttack.js` registers Pulsate for item 22516 and `canAttack(character, target)` returns `true` without examining target, room, or region. `CombatFactory.canAttack()` invokes that method on the active combat method, making the missing condition reachable. The plugin itself marks the target/room restriction TODO.
osrsreboxed-db says: Item key 22516 verifies Dawnbringer identity and equipment status; it does not encode special-attack semantics. Current Wiki documents Pulsate as a blast toward Verzik Vitur within Theatre of Blood. Exact cache target form and TSPS encounter/room mapping are unverified, so this finding does not claim which in-raid NPC IDs should pass or that Theatre encounter support is otherwise complete.
Impact: Any reachable Dawnbringer Pulsate target passes combat eligibility, including targets outside the documented Theatre of Blood use; the intended encounter restriction is not enforced.
Suggested fix direction (do NOT implement): Enforce the Theatre of Blood encounter/target condition using authoritative region and target identities; do not infer it from item ID alone.

---
*Last re-verified: Wave 40 — 2026-10-13 — all HOLD/HOLD DUP, 0 new CAND/CHK (700+ scouts Waves 22-40). Registry 40/215/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-40 for per-wave evidence.*
