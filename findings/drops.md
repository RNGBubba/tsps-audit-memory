# findings/drops.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

### [AUD-004] Empty shared-table reference suppresses herb rolls
Severity: High
Status: Open
Category: 3. Drop Tables (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/npcs/NpcDrops.plugin.js:220-245,323-333,383-397`; vendored `server/data/definitions/npc-drops.json:152-158`.
DB Reference: `READ-ONLY-DB/docs/drops-json/npc-drops.json` -> `tables.aberrant_spectre.entries` row at key `aberrant_spectre`: `{shared_table:"", weight:78, out_of:128}`, with metadata listing the empty shared-table key; `READ-ONLY-DB/docs/drops-json/subtables.json` -> `herb.entries`, the named herb table.
Description: The empty-string shared-table key used for the Aberrant spectre herb roll is treated as absent by runtime truthiness checks and emits no item.
Evidence:
Code currently does: shared-table loading inserts references only when `entry.shared_table` is truthy; `resolveEntry` likewise recurses only when the field is truthy. For the empty string row, no `item_id` exists, so the resolver returns an empty list. Weighted main-roll selection still selects this row, suppressing an herb drop.
osrsreboxed-db says: The authoritative NPC drop file defines the aberrant_spectre herb row with `shared_table: ""` and lists the empty key in `meta.shared_tables`; the separate subtables file contains `herb` and no empty-string table. The source's generated runtime data preserves the empty-key row.
Impact: Each selected empty-key herb roll produces nothing instead of the intended multi-herb result; the audited behavior affects multiple tables using this encoding.
Suggested fix direction (do NOT implement): Resolve the documented empty-key convention explicitly at the runtime schema boundary so valid shared-table rows cannot be silently dropped.
-
### [NEW-ITEM-001] Rune pouch menu omits management actions and substitutes chat for Open
Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/items/RunePouch.plugin.js:9-10,148-160,163-191,226-235`; `PluginManager.ts:1559-1564,3350-3383`; `ItemActionPacketListener.ts:39-53`; `NetworkBuilder.ts:1001-1021`.
DB Reference: `READ-ONLY-DB/docs/items-json/12791.json` (Rune pouch), `24416.json` (Rune pouch (l)), `27281.json` (Divine rune pouch), `27509.json` (Divine rune pouch (l)); these verify item identities only. Menu rules cross-checked against OSRS Wiki Rune pouch and Divine rune pouch pages.
Description: Rune pouch Open only prints rune contents; Configure actions for both pouches and Revert for divine variants have no callback.
Evidence:
Code currently does: registers only Open and Empty callbacks for the four pouch names. Open sends a chat listing; source comments explicitly state the storage interface is unimplemented. Deposits through item-on-item, Empty, and spell consumption do exist, so those are not claimed absent. Dispatch marks handled only when a callback runs.
osrsreboxed-db says: Keys confirm all four pouch item identities; DB does not encode menu semantics. OSRS Wiki documents pouch management/configuration and the divine pouch Revert action.
Impact: No selective storage UI/configuration or divine revert via the expected menu actions.
Suggested fix direction (do NOT implement): Implement the actual pouch management UI and register the full verified action set; retain currently working deposit/empty/spell use paths.

### [NEW-HUNTER-001] Level 1 Hunter trap limit is one below the OSRS rule
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/hunter/Traps.Hunter.js:22-26,44-46`; active registration `Hunter.plugin.js:45,58-60`.
DB Reference: `READ-ONLY-DB/docs/items-json/10006.json` -> Bird snare; `docs/npcs-summary.json` key 5549 -> Crimson swift; `docs/objects-summary.json` key 9345 -> Bird snare. Wiki trap table: https://oldschool.runescape.wiki/w/Hunter#Multiple_traps.
Description: At Hunter levels 1–19, the cap formula allows one non-special trap instead of two.
Evidence:
Code currently does: `limit` returns `min(5,1+floor(level/20))`; at level 1 this is 1, and `canLay` rejects placing another at existing count >= limit. Bird snare activation is live.
osrsreboxed-db says: Keys identify Bird snare, Crimson swift and bird-snare object; Wiki's current table says level 1 allows two traps, with later thresholds 40/60/80.
Impact: Low-level players are denied a second valid trap.
Suggested fix direction (do NOT implement): Use the verified level bands and preserve trap-specific caps.

### [NEW-HUNTER-002] Magic boxes incorrectly accept smoke and get a catch-rate bonus
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/hunter/Traps.Hunter.js:191-204,240-245`; active route `Hunter.plugin.js:57-60,93-95`.
DB Reference: `READ-ONLY-DB/docs/items-summary.json` keys 10025 Magic box, 594 lit torch, 20720 Bruma torch; `docs/objects-summary.json` keys 19223-19226 Magic box forms; `docs/npcs-summary.json` key 3134 Imp.
Description: Torch use on an idle magic box is accepted as smoking, and the smoke bonus increases its catch chance.
Evidence:
Code currently does: `bait` accepts lit/Bruma torches for any idle trap, sets `smoked=true`; `attempt` adds +2/256 for any smoked trap. Magic-box kind is not excluded.
osrsreboxed-db says: Keys verify items/NPC/object identities; OSRS Wiki Magic box page says magic boxes cannot be smoked and torch use should fail.
Impact: Magic-box imp traps can receive an unsupported catch-rate bonus.
Suggested fix direction (do NOT implement): Reject smoke action for magic boxes and ensure unsupported state cannot affect later catch rolls.

### [NEW-HUNTER-003] Wilderness trap bonus applies to unrelated methods
Severity: Low
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/hunter/Traps.Hunter.js:22-26,44-46`; magic-box activation in `Hunter.plugin.js:57-60`.
DB Reference: `READ-ONLY-DB/docs/items-summary.json` key 10025; `docs/npcs-summary.json` key 3134; `docs/objects-summary.json` key 19223; TSPS spawn `server/data/definitions/npc-spawns.json:8842` is Imp 3134 at (2886,5313), plane 2.
Description: Any unlimited trap kind gets an extra Wilderness trap, including magic-box Imp hunting.
Evidence:
Code currently does: `limit` increments whenever Wilderness level > 0 without restricting trap kind; at Hunter 80 the magic-box cap rises from 5 to 6.
osrsreboxed-db says: Keys establish Magic box/Imp identities; Wiki multiple-trap rule restricts the Wilderness extra to black salamander/chinchompa hunting, not magic boxes.
Impact: Players can place one extra magic box in Wilderness beyond the regular cap.
Suggested fix direction (do NOT implement): Restrict the extra slot to the specific verified Wilderness methods.

### [NEW-FLETCH-001] Broad-arrow recipe bypasses Broader Fletching unlock
Severity: High
Status: Open
Category: 7. Slayer Tasks (reward unlock context) and 11. Skills & Experience / 21. Server-specific issues
Location: `Typescript-RSPS/server/plugins/skills/Fletching.plugin.js:414-447,561-579`.
DB Reference: `READ-ONLY-DB/docs/items-json/11874.json` broad arrowheads and `4160.json` broad arrows; item IDs corroborated in ItemIdentifiers.ts. DB confirms item identity only; Wiki Broader Fletching unlock requires 300 Slayer points.
Description: Broad arrows are available with only the Fletching level/material checks, without the Slayer unlock.
Evidence:
Code currently does: Registers broad arrowheads -> broad arrows as an ordinary arrow-tip recipe, level 52, 150 XP/set; action checks only level and materials.
osrsreboxed-db says: Records verify identities. OSRS Wiki Broad arrows says creation requires Broader Fletching unlock; Slayer Rewards lists 300 points.
Impact: Players can craft broad arrows without the prerequisite Slayer reward.
Suggested fix direction (do NOT implement): Gate recipe execution on the persisted Broader Fletching unlock.

---

### [AUD-064] Hill Giants drop looting bags outside the Wilderness

Severity: Medium
Status: Open
Category: 3. Drop Tables (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/npcs/NpcDrops.plugin.js:404-432,437-455,463-489`; live drop data `Typescript-RSPS/server/data/definitions/npc-drops.json:100046-100061,217221-217229`; live spawns `Typescript-RSPS/server/data/definitions/npc-spawns.json:2807-2816`; override `Typescript-RSPS/server/data/definitions/npc-drop-overrides.json:41` (used for ID 7261, not ordinary IDs 2098–2103).
DB Reference: `READ-ONLY-DB/docs/drops-json/npc-drops.json` `tables.hill_giant.tertiary` item 11941 and `npcs[2098]` through `npcs[2103]` → `hill_giant`; `READ-ONLY-DB/docs/items-json/11941.json` key 11941 -> Looting bag.
Description: The generic tertiary roller awards Hill Giant looting bags at the configured 1/5 rate without applying the DB's Wilderness-only condition. TSPS has reachable Hill Giant spawns outside its configured Wilderness zones, so those kills can produce the restricted item.
Impact: A non-Wilderness Hill Giant kill can yield a Looting bag, bypassing its Wilderness-only drop rule and granting a trade-restricted storage item from ordinary areas.
Suggested fix direction (do NOT implement): Apply the location condition for the looting-bag tertiary row during rolling; avoid making a broad text-note parser the only semantic mechanism for drop restrictions.

---

### [AUD-077] Pre-roll entries use the main-table denominator
Severity: Medium
Status: Open
Category: 3. Drop Tables (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/npcs/NpcDrops.plugin.js:275-283,342-356`; runtime definitions `Typescript-RSPS/server/data/definitions/npc-drops.json:1690-1700`.
DB Reference: `READ-ONLY-DB/docs/drops-json/npc-drops.json` -> `tables.abyssal_sire.entries` Unsired item 13273, `pre_roll=true`, `rarity_raw="1/100"`; same table has `main_max_roll=139` and main entry Battlestaff weight 6/out_of 139. `READ-ONLY-DB/docs/items-json/13273.json` key 13273 identifies Unsired.
Description: A pre-roll entry's probability is altered to use the main table's denominator when its row provides `weight` and `rarity_raw` but no numeric `out_of`.
Evidence:
Code currently does: `hits(entry)` reads only `entry.out_of`, rejects it if it is not a positive integer, then treats an integer `weight` as numerator. The Sire Unsired row has weight 1 but no `out_of`; `rollOnce()` therefore always rejects the pre-roll. Because `preRollHit` remains false, the main 139-slot table then rolls independently.
osrsreboxed-db says: The Unsired row is a 1/100 pre-roll. Its record represents a one-percent pre-roll independent of the main drop table; the numeric main table denominator is 139. Runtime TSPS vendored data has the same row shape. The schema defines `pre_roll` independently and gives `rarity_raw` for unresolved textual rate, but the live pre-roll helper ignores `rarity_raw`.
Impact: Unsired cannot drop from the sampled Abyssal Sire table; each kill instead receives an ordinary main-table roll where a successful Unsired pre-roll would suppress it.
Suggested fix direction (do NOT implement): Normalize numeric pre-roll rates into a usable numerator/denominator before `hits()` or provide a dedicated pre-roll parser that preserves rational rates.

---
*Last re-verified: Wave 41 — 2026-10-13 — 62 HOLD/HOLD DUP + 2 new CAND (Bronze scim 1321 defence_slash 0 vs 1 + Warhammer family 1335/1339/1341/1343/1345/1347 melee_strength 9/16/19/20/31/48 vs 11/18/22/27/39/62). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-41 for per-wave evidence.*
