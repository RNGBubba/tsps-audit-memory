# findings/items-equipment.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

### [AUD-025] Max cape and hood definitions omit their all-99 requirements

Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `server/data/definitions/item-gameplay.json:13282-13283` (item IDs 13280–13281); ingest `server/plugins/items/ItemDefinitionLoader.plugin.js:126-163`; enforcement `server/src/main/typescript/elvarg/net/packet/impl/EquipPacketListener.ts:119-133`; skill indices `server/src/main/typescript/elvarg/game/model/Skill.ts:37-55,116-129`.
DB Reference: `READ-ONLY-DB/docs/items-json/13280.json:40-75` → Max cape item 13280 and `13281.json:40-75` → Max hood item 13281; both equipment records require level 99 in every listed skill, including Sailing. `READ-ONLY-DB/data/items/items-skill-requirements.json:4755-4805` contains corresponding requirement rows.
Description: Active TSPS gameplay definitions have no requirements for these two items, so the ordinary equipment packet path skips the all-99 gate; the legacy positional requirements array also cannot represent the added Sailing skill.
Evidence:
Code currently does: Local item rows 13280 and 13281 contain equipment slot and bonuses but no `requirements` field. The item-definition loader only copies `requirements` when present, and cache hydration does not load the DB's keyed requirement map. `EquipPacketListener.equip()` skips its per-skill check when `getRequirements()` is null, then proceeds to slot assignment. Its requirement loop indexes the array by every runtime `Skill` index; `ItemDefinition.registerCustom()`'s 23-element requirement array cannot represent Sailing at runtime skill index 23.
osrsreboxed-db says: Both records' requirements maps assign 99 to each listed skill through Sailing (24 requirements); schema `data/schemas/schema-items.json:274-315` defines equipment requirements as a nullable skill-keyed map.
Impact: Through the standard equipment packet path, a player without maxed skills can equip either item because the local definition supplies no requirement array. Other equip entry paths and Max variants were not audited.
Suggested fix direction (do NOT implement): Add authoritative requirements to the active runtime definitions and represent requirements by skill key or an array covering every runtime skill; check alternate equip paths and related Max variants before expanding scope.

---
*Last re-verified: Wave 42 — 2026-10-13 — 64 HOLD/HOLD DUP (ranged bows/crossbows/darts/knives/javelins/chinchompas + magic staves/powered staves). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-42 for per-wave evidence.*
