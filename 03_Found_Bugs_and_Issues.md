> **Authoritative findings register — 40 findings. Mirrored in `registry.json` (`findings[]`).** Legacy 40-block provenance copy is frozen at [`FULL_AUDIT_REPORT.md`](FULL_AUDIT_REPORT.md). See [`00_INDEX.md`](00_INDEX.md) deduplication report (2026-10-12).

## Detailed Findings
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

### [AUD-007] Legacy server PacketSender calls silently discard packets

Severity: Medium
Status: Open
Category: 13. Client ↔ Server Protocol / Packets (also 21. Server-specific issues)
Location: `server/src/main/typescript/elvarg/net/PlayerSession.ts:98-100,147-150`; callers in `server/src/main/typescript/elvarg/net/packet/PacketSender.ts:145-148,202-205,208-212,335-338`; command consumers `server/plugins/commands/PlayerCommands.plugin.js:127-134` and `server/plugins/commands/AdminCommands.plugin.js:804`.
DB Reference: Not data-comparable; packet transport has no corresponding osrsreboxed-db record.
Description: The legacy `PlayerSession.write(builder)` path is an empty method, but PacketSender and active user-facing callers continue to invoke it for logout, URL, exit and noclip actions.
Evidence:
Code currently does: `write(_builder)` has no body and notes the unported callers remain no-ops. `sendClientPacket` is the active binary egress method, but the cited PacketSender paths use `write` rather than it.
osrsreboxed-db says: No DB mapping for protocol packet behavior; this finding is based on active TypeScript call graph only.
Impact: These calls return without emitting a packet; dependent UX/actions do not reach the client. Verified call sites include store/donate links and administrator-triggered client close.
Suggested fix direction (do NOT implement): Migrate active callers to supported binary packets/handlers or remove obsolete APIs and callers during deliberate clean cutover; do not retain callable silent sends.

### [AUD-008] Declared native NPC option-5 opcode 50 has no decoder case

Severity: Low
Status: Open
Category: 13. Client ↔ Server Protocol / Packets
Location: `client/common/network/ClientPacketId.ts:33-42,97-154`; `server/src/main/typescript/elvarg/net/protocol/NativeClientPackets.ts:25-43,98-158`; decoder `server/src/main/typescript/elvarg/net/protocol/ClientProtocol.ts:1-18,638-656`; dispatch `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:793-794`; encoder `client/network/serverConnection/outgoing/interact.ts:54-90`.
DB Reference: Not data-comparable; native packet semantics have no corresponding DB records.
Description: Both client/server native packet tables declare OPNPC5 as opcode 50 with length 3, but server ClientProtocol maps opcode 57 to option 5 and has no case 50. The current browser client uses opcode 57 for its option-5 action, masking the unused declaration for in-repo traffic.
Evidence:
Code currently does: Opcode 50 passes declared packet-size lookup but is decoded as raw and discarded by NetworkBuilder. Client outgoing option 5 encodes as ClientPacket.OPNPC1 (57), which the server maps to click type 5.
osrsreboxed-db says: No DB mapping for native packet IDs or dispatch.
Impact: A sender that emits the declared native OPNPC5 opcode 50 has its interaction silently ignored; current in-repo client option 5 still decodes by opcode 57.
Suggested fix direction (do NOT implement): Align packet declarations, encoder, and decoder on the intended native opcode and migrate callers together; remove obsolete alias if any.

### [AUD-014] Valid NPC Talk-to clicks open unrelated generic shops

Severity: Medium
Status: Open
Category: 4. Shops (also 5. NPC Interactions / Right-click options and 19. Data consistency bugs)
Location: `server/data/definitions/npc-interactions.json:1-5,14-17,48-57,60-64`; `server/data/definitions/custom-shops.json:5-8`; `server/src/main/typescript/elvarg/game/definition/loader/impl/NpcInteractionDefinitionLoader.ts:32-42,99-121`; `server/src/main/typescript/elvarg/game/entity/impl/npc/NpcInteractionManager.ts:81-98`; `server/src/main/typescript/elvarg/net/packet/impl/NPCOptionPacketListener.ts:24-25,63-73`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json` IDs 221/315/2460/4921/6059; `docs/shops-by-npc.json` IDs 4921/6059; transcript index `docs/npc-dialogue-index.json` ID 4921.
Description: Five active first-click mappings attach unrelated generic shops to NPCs whose authoritative first option is Talk-to: Rick (221), Leagues Tutor (315), Ajjat (2460), Charlie the cook (4921), and Armour salesman (6059).
Evidence:
Code currently does: `npc-interactions.json` routes those first clicks to shop IDs 8/2/3/1/4 respectively. `custom-shops.json` identifies IDs 8/2/3/4 as Mage Armor, Food, Potion, and Arrow shops; ID 1 is Rune Shop. `NpcInteractionDefinitionLoader` loads the bindings, the packet listener uses `clickType - 1` for the cache action slot and dispatches `NpcInteractionManager.handle()` before plugin callbacks; the manager opens the configured shop and returns before dialogue handling.
osrsreboxed-db says: IDs 221, 315, 2460, 4921, and 6059 all have option slot 1 `Talk-to` (`npcs-interactions.json:1680-1687,2294-2302,15974-15982,32106-32112,39095-39102`). ID 4921's only shop owner record is The Shrimp and Parrot via dialogue (`shops-by-npc.json:2832-2841`), and its dialogue index points to a Heroes' Quest transcript (`npc-dialogue-index.json:44702-44709`). ID 6059's DB shop is Aaron's Archery Appendages via slot 3 `Trade` (`shops-by-npc.json:3176-3185`); vendored `shops.json` retains that correct slot-3 binding, but its first-click action is separately overridden by the core interaction mapping.
Impact: A valid first-click action such as Talk-to on these NPCs opens an unrelated generic shop instead of reaching the NPC's normal dialogue/plugin behavior. The mapping for 6059's valid Trade slot remains a separate correct shop binding; the first-click conflict is the verified issue. No claim is made here for configured second-click mappings that do not correspond to a DB option.
Suggested fix direction (do NOT implement): Remove or correct the first-click shop actions; bind click shops only to the matching DB option slot and shop, and keep dialogue-opened shops in transcript actions.

### [AUD-015] Shop pricing percentages and stock-change metadata are discarded

Severity: Medium
Status: Open
Category: 4. Shops (also 19. Data consistency bugs)
Location: `server/scripts/import-osrs-shops.mjs:75-85,122-135`; `server/src/main/typescript/elvarg/game/definition/loader/impl/ShopDefinitionLoader.ts:14-33,111-165`; `server/src/main/typescript/elvarg/game/model/container/shop/ShopManager.ts:568-576,670-682,836-844`.
DB Reference: `READ-ONLY-DB/docs/shops-items-by-shop.json` → The Shrimp and Parrot, `shop_info`: `sells_at=1300`, `buys_at=750`, `change_per=30`; schema `data/schemas/schema-shops-items-by-shop.json:1-30`.
Code currently does: Importer `originalStock()` emits item ID, amount, and optional positive `restock_time`; rebuilt rows contain ID, name, currency, stock, and NPC click metadata. `RawShopDefinition` has no `sells_at`, `buys_at`, or `change_per`; `ShopManager.itemPrice()` uses a per-item override or item value/Blood Money value, and selling uses a fixed `SALES_TAX=0.85`. Per-item restock ticks are not the lost field; `change_per` is the stock-dependent price adjustment.
osrsreboxed-db says: The Shrimp and Parrot has `sells_at=1300`, `buys_at=750`, `change_per=30`; the schema defines selling/buying percentages and price change per item stocked/sold.
Impact: The sampled runtime shop cannot apply its DB-recorded price multipliers or stock-dependent price movement. Per-item restock timing is separately retained for imported positive-stock rows. No all-shops pricing census is asserted.
Suggested fix direction (do NOT implement): Preserve shop-level price/change metadata through import, loader, and buy/sell calculation; verify behavior against records where fields exist.

### [AUD-017] Legacy emote packet path reads an unpopulated lookup map

Severity: Low (conditional on a caller using the legacy `emote` message)
Status: Open
Category: 17. Duplication / Dead code / Unused definitions (also 21. Server-specific issues)
Location: `server/src/main/typescript/elvarg/game/content/Emotes.ts:14-18,89-145`; `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:762-763`; active interface implementation `server/plugins/interface/Emotes.plugin.js:10-57,124-183`; client sends `client/game/OsrsClient.ts:7030-7033`, `client/network/serverConnection/outgoing/misc.ts:37-40`, and `client/network/packet/ClientBinaryEncoder.ts:442-446`.
DB Reference: Not data-comparable. The inspected DB does not define the `emote` network-message lookup or server dispatch contract; dialogue transcript emote actions are not a source for this packet behavior.
Description: The legacy server emote message dispatches into an empty map; a separate populated emote array is used by the active interface plugin and does not populate the legacy lookup.
Evidence:
Code currently does: `EmoteData.emotes` is initialized to an empty `Map` and has no population call in the inspected code; `forId()` only reads it. `NetworkBuilder` routes incoming `emote` packets to `Emotes.doEmote()`, which performs `forId()` and therefore cannot resolve normal entries. The local `EMOTES` constant is not connected to that map. The active interface plugin resolves slots through a separate populated array and performs animations through interface-action handlers. No in-repository callsite of the client `sendEmote` API was found beyond its wrapper/transport definitions.
osrsreboxed-db says: No authoritative DB record for this message, emote slot map, or dispatch implementation was identified; no DB mismatch is claimed.
Impact: A caller that sends the legacy `emote` message cannot resolve normal emotes via this path. Since no in-repository caller was found and the interface plugin is a distinct active route, an ordinary player-facing failure on the current UI is not established.
Suggested fix direction (do NOT implement): Remove the unused legacy dispatch/map if the interface-plugin route is canonical, or populate and route the legacy path from the same authoritative emote mapping if callers are required.

### [AUD-019] Bank search discards the submitted search text

Severity: Medium
Status: Open
Category: 12. Inventory / Banking / Containers (also 15. Interfaces / UI)
Location: `server/src/main/typescript/elvarg/game/model/container/impl/Bank.ts:227-258,761-768,1061-1066`; dispatch `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:484-490`.
DB Reference: Not data-comparable; this is an input-routing defect.
Description: Submitting a bank search invokes the search callback without forwarding the typed syntax, so the search tab receives no matching items.
Evidence:
Code currently does: The bank search button installs `new bankEntered((input) => Bank.search(player, input))`. NetworkBuilder dispatches the submitted `packet.value` to `action.execute(packet.value)`, but `bankEntered.execute(syntax)` calls `this.execFunc()` with no argument. `Bank.search` stores the received syntax, and `addToBankSearch` checks `itemName.toLowerCase().includes(player.getSearchSyntax())`; with `undefined`, `includes` searches for the literal string `"undefined"`.
osrsreboxed-db says: Not applicable; no item data discrepancy is asserted.
Impact: Normal non-empty user search terms do not reach filtering; ordinary bank item names yield an empty search result set.
Suggested fix direction (do NOT implement): Forward the submitted syntax through the entered-input callback and verify empty and non-empty search behavior.

### [AUD-020] Preserve extends boosted-stat drain before its activation delay

Severity: Medium
Status: Open
Category: 8. Prayer
Location: `server/src/main/typescript/elvarg/game/entity/impl/player/Player.ts:447-493`; activation state `server/src/main/typescript/elvarg/game/content/PrayerHandler.ts:200-205,493,507`.
DB Reference: `READ-ONLY-DB/docs/prayers-json/25.json` → prayer 25 Preserve: boosted stats last 50% longer, Prayer requirement 55, drain 3.0/min. DB record/schema does not specify the activation delay.
Description: The server switches boosted-stat decay to 90 seconds as soon as Preserve is active, without checking its 15-second continuous activation requirement.
Evidence:
Code currently does: Both the boosted-stat decay threshold and timer restart at `Player.ts:448,476,491-492` select 90 seconds solely from `PrayerHandler.isActivated(PRESERVE)`. The activation path marks the prayer active; the inspected consumer has no age/eligibility check. The DB supports the extended-decay effect, while the OSRS Wiki Preserve page states it only takes effect after the prayer has been active for at least 15 seconds.
osrsreboxed-db says: Prayer 25 says boosted stats last 50% longer and drain 3.0 Prayer points per minute; it neither records nor contradicts the 15-second delay.
Impact: Activating Preserve shortly before a scheduled stat drain grants the 90-second interval immediately, including a benefit from flicking that OSRS rules disallow.
Suggested fix direction (do NOT implement): Track continuous Preserve activation time and apply the extended interval only after the required warm-up; keep the DB finding scoped to the effect/rate it actually records.

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

### [AUD-023] Conflicting variant bindings suppress shops

Severity: Medium
Status: Open
Category: 4. Shops (also 5. NPC Interactions / Right-click options)
Location: `server/data/definitions/shops.json:83-84,470-471`; `server/plugins/npcs/Shopkeepers.plugin.js:6,78-89,106-109`; interaction model/loader `server/src/main/typescript/elvarg/game/definition/NpcInteractionDefinition.ts:10-15,37-50`, `.../NpcInteractionDefinitionLoader.ts:21-25,62-88`.
DB Reference: `READ-ONLY-DB/docs/shops-items-by-shop.json` → Daga's Scimitar Smithy (Default) and (Monkey Madness I), both owner NPC 5250/slot 3; TzHaar-Hur-Lek's Ore and Gem Store (Default) and (Karamja gloves), both owner NPC 2184/slot 3. The TzHaar records are at lines 30946-31072 and 31073-31199; `docs/npcs-interactions.json` identifies the respective NPC Trade actions.
Description: Distinct shop variants map to the same NPC/option binding. The active shopkeeper registration detects each duplicate and drops the binding, so neither variant is opened through that generic action. Confirmed examples are Daga's quest-dependent smithy and TzHaar-Hur-Lek's default/Karamja-gloves store.
Evidence:
Code currently does: Vendored `shops.json` contains both Daga rows at `(npcId=5250, optionSlot=3)` and both TzHaar-Hur-Lek rows at `(npcId=2184, optionSlot=3)`. `Shopkeepers.plugin.js` stores an ambiguous binding as `null` on collision, then skips null entries rather than registering any of the conflicting shops. No Daga- or TzHaar-specific alternate shop handler was found in the searched plugin paths.
osrsreboxed-db says: The DB exports each pair of separate shop variants with the same owner NPC and option slot; the Daga variants differ by quest state, while the TzHaar-Hur-Lek variants differ by Karamja gloves pricing. These variants are not interchangeable inventory records.
Impact: The shared Trade option cannot select either shop variant through the inspected generic binding path. This finding covers two confirmed collision samples, not a complete collision census.
Suggested fix direction (do NOT implement): Resolve the applicable shop variant from player/world state at interaction time; avoid silently suppressing an otherwise valid owner action.

### [AUD-024] Zero-stock shop rows are removed before runtime

Severity: Medium
Status: Open
Category: 4. Shops (also 19. Data consistency bugs)
Location: `server/scripts/import-osrs-shops.mjs:75-85`; `server/src/main/typescript/elvarg/game/definition/loader/impl/ShopDefinitionLoader.ts:131-150` shop stock import; runtime slot/restock `server/src/main/typescript/elvarg/game/model/container/shop/ShopManager.ts:382-410,449-471,503-511,800-820`.
DB Reference: `READ-ONLY-DB/docs/shops-items-by-shop.json` → Amelia's Seed Shop, item rows 5322, 5320, 5323, and 5321 with amount 0 and positive restock times; `data/schemas/schema-shops-items-by-shop.json:65-100` permits amount 0.
Description: The importer drops stock rows whose amount is zero, so the runtime cannot display those listed sold-out items or retain their item-specific restock data.
Evidence:
Code currently does: `import-osrs-shops.mjs:75-85` filters every stock entry with `amount <= 0`, and `ShopDefinitionLoader.ts:131-138` independently drops nonpositive entries. Exact DB shop key Amelia's Seed Shop has Tomato seed 5322 at stock 0/restock 100; active shop 1011 is reached by spawned NPC 8530's Trade slot 3 but `shops.json:14` omits 5322. ShopManager display retains sold-out rows only if their IDs appear in the original stock map/order, both built only from loader definitions (`:375-410,449-471,503-511`). The missing slot also prevents its item-specific restock timer from being retained. This independently confirms the omission through both import and runtime loading; it is the existing AUD-024 root cause.
osrsreboxed-db says: Amelia's Seed Shop has the named entries at amount 0 with positive restock times; the schema permits integer zero quantities. These are comparator stock records, not evidence of their buyability while empty.
Impact: The sampled shop omits these sold-out item slots and cannot apply their per-item restock timers through the omitted row. No all-shop impact count is asserted.
Suggested fix direction (do NOT implement): Preserve zero-amount stock definitions and restock metadata through import/runtime while preventing purchase until stock is positive.

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

### [AUD-026] Price Checker item state is not sent to its custom widget container

Severity: Medium
Status: Open
Category: 15. Interfaces / UI (also 12. Inventory / Banking / Containers and 21. Server-specific issues)
Location: `server/plugins/interface/PriceChecker.plugin.js:9-20,46-77,221-282`; `server/src/main/typescript/elvarg/net/PacketSender.ts:759-790,1253-1264`; client snapshot path `client/network/packet/ServerBinaryDecoder.ts:721-736`, `client/network/serverConnection/handlers/inboundUi.ts:45-62`, `client/game/OsrsClient.ts:3627-3630,6659-6748`.
DB Reference: Not data-comparable. The dialogue-derived Price Checker passage `READ-ONLY-DB/docs/dialogues/eb3fad4c5d2b103e.json:139-183` describes opening the interface but does not specify container synchronization; no DB item-record mismatch is claimed.
Description: Price Checker refresh sends its `PriceCheckerContainer` through an item-container API that silently returns without encoding custom containers; the separate player inventory snapshot updates only the player inventory, not the Price Checker widget's item grid.
Evidence:
Code currently does: `refreshItems()` invokes `sendItemContainer(this, (464<<16)|2)` and then separately sends the real inventory to the mirrored side container. `PriceCheckerContainer` extends `ItemContainer`, not `Inventory` or `Equipment`. `PacketSender.sendItemContainer()` emits inventory data only for constructor name `Inventory`, flags `Equipment`, and silently returns for other container classes. `sendInventory()` encodes script inventory slots, but the inspected ordinary `INVENTORY_SNAPSHOT` receiver updates `OsrsClient.inventory` (ID 93); it does not associate that snapshot with Price Checker group 464 child 2. Server click handlers for withdrawals consume item/slot identity from that custom widget container.
osrsreboxed-db says: Its dialogue export records an interface-opening action but provides no widget item-state protocol or authoritative item contents for this panel.
Impact: The server stores deposited items and recalculates totals, but the browser does not receive their item IDs/quantities for the panel's custom grid; users cannot reliably see or select deposited items for withdrawal through that grid.
Suggested fix direction (do NOT implement): Send custom container slots through the interface inventory-script mechanism or a dedicated widget-container packet and verify the resulting widget ID/UID matches the click handler.

### [AUD-027] Richard has an unsupported second-click generic shop binding

Severity: Low
Status: Open
Category: 4. Shops (also 5. NPC Interactions / Right-click options and 19. Data consistency bugs)
Location: `server/data/definitions/npc-interactions.json:42-46`; `server/data/definitions/custom-shops.json:9`; active routing `server/src/main/typescript/elvarg/net/packet/impl/NPCOptionPacketListener.ts:24-25,63-73`, `.../game/entity/impl/npc/NpcInteractionManager.ts:81-98`; correct shop mapping `server/data/definitions/shops.json:302`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json:14324-14331` → NPC 2200 Richard has option 1 Talk-to and option 3 Trade, with no option 2; `docs/shops-by-npc.json:1033-1042` maps his actual Wilderness Cape Shop to slot 3.
Description: The core definition binds NPC 2200's second click to a generic Melee Weapon Shop although the authoritative option list has no second-click action; Richard's named shop is correctly bound separately to slot 3.
Evidence:
Code currently does: Vendored interaction row 2200 maps `second_click` to `core.shops.open` with `shopId:5`; custom shop ID 5 is `Melee Weapon Shop`. The NPC packet listener accepts click types 1–5, indexes the action if present, then calls `NpcInteractionManager.handle()` before checking whether a plugin handles the action; that manager resolves the configured NPC/slot binding and opens the shop. The expected Wilderness Cape Shop is separately assigned to NPC 2200/slot 3 in `shops.json`.
osrsreboxed-db says: NPC 2200's DB menu exposes only Talk-to at slot 1 and Trade at slot 3; the DB owner mapping identifies Richard's Wilderness Cape Shop as the slot-3 click shop.
Impact: The current menu does not expose this slot-2 action, so no normal visible click failure is established; a client that submits slot 2 nevertheless reaches the unrelated generic shop. This is a bounded misbinding, not a claim of a corpus-wide interaction issue.
Suggested fix direction (do NOT implement): Remove the unsupported slot-2 binding and retain the shop action only at the DB-matching Trade slot.

### [AUD-028] Emblem Trader Rewards shop has no active NPC 308 binding

Severity: Medium
Status: Open
Category: 4. Shops (also 5. NPC Interactions / Right-click options and 19. Data consistency bugs)
Location: `server/data/definitions/shops.json:430-432`; binding generator `server/plugins/npcs/Shopkeepers.plugin.js:75-110`; NPC routing `server/src/main/typescript/elvarg/net/packet/impl/NPCOptionPacketListener.ts:63-97`, `.../game/entity/impl/npc/NpcInteractionManager.ts:81-99`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json:2248-2255` → NPC 308 Emblem Trader option 3 `Rewards`; `docs/shops-by-npc.json:68-90` lists three slot-3 click shops; `docs/shops-items-by-shop.json:4361-4375,4747-4763,5008-5025` records those shops and owner NPC 308 at slot 3.
Description: The authoritative NPC menu and shop-owner export expose a click-operated Rewards shop for NPC 308, but none of the corresponding active TSPS shop definitions binds that NPC/slot and no matching Emblem Trader shop handler was found in the inspected plugins.
Evidence:
Code currently does: The three generated Bounty Hunter shop rows are present in vendored `shops.json`, but their `npcInteractions` do not bind NPC 308. `Shopkeepers.plugin.js` generates core click bindings from those `npcInteractions` rows; the active `Emblems.plugin.js` handles emblem death-drop behavior, not the Rewards shop. Thus the packet listener reaches no core binding for NPC 308/slot 3 and, absent a plugin handler, emits the generic “Nothing interesting happens” response.
osrsreboxed-db says: NPC 308 exposes `Rewards` at option slot 3. Three shop exports identify click-source `Rewards` access at that slot and list NPC IDs 308, 7943, and 12113 as owners. The DB does not identify which variant is intended in every world mode; this finding asserts only the missing dispatch binding for NPC 308.
Impact: The NPC's visible Rewards action does not open any of the three DB-backed shops through the inspected runtime binding path. Variant selection across modes remains unresolved.
Suggested fix direction (do NOT implement): Add an explicit NPC 308/slot-3 dispatch that resolves the correct shop variant from the active game mode; avoid guessing one global shop where the source exports alternatives.

### [AUD-030] Offensive combat spells omit per-cast base Magic experience

Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 9. Combat Formulas)
Location: `server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:736-737,922-960`; `game/content/combat/magic/CombatSpells.ts:280-282,320-338`.
DB Reference: The inspected READ-ONLY-DB schema/data has no combat spell XP rule; comparator: [OSRS Wiki Combat spells](https://oldschool.runescape.wiki/w/Combat_spells), Offensive spells. TSPS spell record `CombatSpells.WIND_STRIKE` defines `baseExperience()` as 5 at lines 320-338; Wiki currently lists Wind Strike at 5.5 XP.
Description: Combat XP dispatch awards damage-based Magic XP for accurate offensive spells but does not award the spell-specific base XP. Splashes receive a fixed 52 Magic XP rather than the selected spell's base award.
Evidence:
Code currently does: `CombatFactory.rewardExp()` adds only `floor(hitDamage * OSRS_DAMAGE_XP / 2)` for accurate non-defensive magic at lines 949-954; the `previousCast.baseExperience()` addition is commented out at line 952. On a splash it adds constant 52 with `multipliers=false` at lines 956-958. The selected `CombatSpell` exposes `baseExperience()`; Wind Strike returns 5. The award function is invoked from player hit processing at lines 736-737.
osrsreboxed-db says: No DB row in the inspected source set defines combat spell base-XP award semantics. OSRS Wiki states offensive spells grant spell-related XP when cast, plus damage-based XP; splashes receive only the spell's base XP. Its current Wind Strike table entry is 5.5 XP, while TSPS's sample value is 5. This finding concerns the unconditionally omitted base award and fixed splash constant; the whole spell XP table was not compared.
Impact: Accurate casts lose the spell-specific reward, and splashes use one unrelated constant rather than the selected spell's reward. Other per-spell configured values may have independent mismatches not included here.
Suggested fix direction (do NOT implement): Award the selected combat spell's base XP once per cast regardless of hit accuracy; award damage XP only for damage, and use the selected spell data for splash behavior with the intended world multiplier.

### [AUD-031] Combat XP flooring discards OSRS fractional tenths

Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 9. Combat Formulas)
Location: `server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:922-990`; `game/content/skill/SkillManager.ts:111-119,150-165,487-495`; skill packet `net/packet/PacketSender.ts:1108-1118`.
DB Reference: No combat XP formula or fractional XP representation was found in the inspected READ-ONLY-DB schemas/data. Comparator: [OSRS Wiki Experience](https://oldschool.runescape.wiki/w/Experience) and [Combat spells](https://oldschool.runescape.wiki/w/Combat_spells) document tenths-based fixed-point XP and per-damage rules.
Description: Combat reward formulas floor XP to whole numbers, and SkillManager sanitization also floors existing/current XP values to integers. This discards fractional combat rewards and prevents their accumulation to the next visible whole XP.
Evidence:
Code currently does: `CombatFactory.rewardExp()` floors Hitpoints `hitDamage * OSRS_DAMAGE_XP / 3` at line 969, defensive Magic at 977, and per-style splits at 989; accurate Magic damage XP is also floored at 952. `SkillManager.sanitizeExperienceValue()` floors at line 115; it is applied to stored skill XP before subsequent awards and by `getExperience()`. Thus a one-damage, standard-multiplier hit awards 1 Hitpoints XP rather than preserving 1.3 XP; repeating such hits cannot accumulate the missing tenths.
osrsreboxed-db says: The inspected DB supplies no skill-award arithmetic. OSRS Wiki says XP is a signed 32-bit integer treated as fixed-point with one decimal, and multi-decimal awards are rounded down to one decimal; combat spell XP includes 1.33 Hitpoints XP per damage.
Impact: Low-damage combat and fractional-split rewards systematically lose XP, reducing total progression versus one-decimal OSRS arithmetic. The level threshold curve through 99 was separately checked and matches; this is an award/storage precision defect, not a threshold-table defect.
Suggested fix direction (do NOT implement): Preserve XP at one-decimal fixed-point precision (or equivalent accumulated remainder) across formulas, multipliers, storage and packet display; round down to tenths, not whole XP.

### [NEW-MINING-001] Valid 3rd Age and gilded pickaxes are rejected by Mining
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 1. Items & Equipment and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Mining.plugin.js:15-28,80-94,128-133`; item constants `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:18442,21466`.
DB Reference: `READ-ONLY-DB/docs/items-json/20014.json` key 20014 -> 3rd Age pickaxe, `equipable=true`, `equipable_weapon=true`, weapon type `pickaxe`; `READ-ONLY-DB/docs/items-json/23276.json` key 23276 -> Gilded pickaxe, same tool identity/equipability. Wiki sources cited in the finding establish the distinct Mining-use levels.
Description: The active Mining whitelist omits two valid pickaxes, so the common tool resolver rejects them even when present and usable for the player's Mining level.
Evidence:
Code currently does: `PICKAXES` lists bronze through crystal/infernal picks (15-26), omitting 20014 and 23276. `findBestPickaxe` searches only that list and returns null otherwise (80-94); `startMining` reports no usable pickaxe (128-133). The shared helper is used by normal Mining and other routes including Motherlode and Gemstone Crab.
osrsreboxed-db says: The exact keyed records identify both player-equipable pickaxe weapons. Item 20014 has Attack 65 equipment requirement; 23276 has Mining 41 and Attack 40. The 3rd Age pickaxe's Mining-use requirement is separately verified from OSRS Wiki as level 61; Mining use and wielding requirements differ.
Impact: Players who rely on either pickaxe as their only Mining tool are denied mining interactions despite satisfying the Mining-use level.
Suggested fix direction (do NOT implement): Include both exact item IDs in the tool catalog with verified Mining-use levels and mining behavior; keep equip requirements separate.

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

### [AUD-058] Broad-bolt fletching does not enforce Broader Fletching unlock

Severity: Medium
Status: Open
Category: 7. Slayer Tasks (Slayer rewards/unlocks) and 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Fletching.plugin.js:481-511,561-615,767-773,793-883`; item-on-item route `Typescript-RSPS/server/src/main/typescript/elvarg/net/NetworkBuilder.ts:358-363`, `UseItemPacketListener.ts:12-40`.
DB Reference: `READ-ONLY-DB/docs/items-json/11875.json` -> Broad bolts (item 11875); `docs/items-json/11876.json` -> Unfinished broad bolts (11876); `docs/items-json/314.json` -> Feather (314). DB confirms identities/stackability only. Current OSRS Wiki Broad bolts and Slayer Rewards pages require 55 Fletching plus Broader Fletching, unlocked from a Slayer master for 300 Slayer points, to craft broad bolts.
Description: The reachable broad-bolt crafting recipe checks level and ingredients but not the Broader Fletching Slayer unlock.
Evidence:
Code currently does: `BOLT_RECIPES_BY_UNFINISHED` includes unfinished broad bolts -> broad bolts at level 55 and 30 XP, requiring 10 feathers and 10 unfinished bolts to output 10. Item-on-item dispatch resolves the recipe and opens the creation menu without checking unlock state. Both immediate crafting and the timed session enforce Fletching level/material availability but have no Slayer unlock check; a code search found no Broader Fletching state implementation. The real item-on-item route is forwarded by NetworkBuilder and handled by UseItemPacketListener.
osrsreboxed-db says: Exact item records identify output/input/feather IDs; the DB does not encode the reward unlock. OSRS Wiki confirms Broader Fletching requires a 300 Slayer point purchase and is required to make broad bolts.
Impact: Players lacking the Slayer unlock can craft broad bolts and gain Fletching XP when they meet only the level/material requirements.
Suggested fix direction (do NOT implement): Add the persistent unlock state and validate it when offering and executing the broad-bolt crafting action.

### [NEW-FLETCH-003] Mithril crossbow stringing recipe is dropped at initialization
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Fletching.plugin.js:264-270,297-315`; identifier `ItemIdentifiers.ts:8120`.
DB Reference: `READ-ONLY-DB/docs/items-json/9461.json` unstrung Mithril crossbow; `9181.json` strung Mithril crossbow; ItemIdentifiers defines output as `MITHRIL_CROSSBOW=9181`, not `MITH_CROSSBOW`.
Description: A misspelled/nonexistent item enum causes the mithril crossbow stringing recipe to be filtered out.
Evidence:
Code currently does: Recipe row uses `MITH_CROSSBOW`; `buildRecipe` requires integer itemId and returns null otherwise, then `.filter(Boolean)` removes it. This output alias is absent; DB/runtime identifier is `MITHRIL_CROSSBOW` 9181.
osrsreboxed-db says: Item keys identify unstrung and strung crossbows; Wiki confirms stringing at Fletching 54 yields 32 XP.
Impact: Players cannot string an unstrung mithril crossbow through this recipe.
Suggested fix direction (do NOT implement): Use the exact registered output ID and retain the recipe in the initialized lookup.

### [NEW-CONSTRUCTION-001] League hall room and furniture are absent from active Construction catalogs
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/plugin/impl/construction/ConstructionData.ts:42-71,84-90`; `ConstructionPlugin.ts:321-330`; `PlayerHouseInstance.ts:213-232`.
DB Reference: `READ-ONLY-DB/docs/objects-summary.json` IDs 41024–41034 identify League hall hotspots; item records for IDs 995,3420,954,1763,8790,8778,8782,8784,8786,970 verify example materials. Wiki League hall page supplies current Construction mechanics/materials.
Description: Active room and hotspot/buildable catalogs have no League hall entries, so the room and its furniture cannot be selected or built.
Evidence:
Code currently does: Room selection matches only the static `CONSTRUCTION_ROOMS`; target resolution/build options derive only from `CONSTRUCTION_HOTSPOTS` and `CONSTRUCTION_BUILDABLES`. No League hall room or hotspot/buildable entries exist in these active catalogs.
osrsreboxed-db says: Object IDs 41024–41034 identify League hall hotspots. DB does not establish rules; Wiki describes room and furniture.
Impact: League hall housing content is unavailable through the active Construction system.
Suggested fix direction (do NOT implement): Add the verified room, hotspot mappings, and buildable recipes using exact cache IDs and rule requirements.

### [NEW-CLIENT-001] Full-cache index download failures are swallowed and startup advances to login
Severity: Medium
Status: Open
Category: 13. Client ↔ Server Protocol / Packets (client cache/startup path; also 15. Interfaces / UI and 20. Client-specific issues)
Location: `Typescript-RSPS/client/rs/cache/CacheFiles.ts:602-622`; `CacheSystem.ts:16-27,166-175`; `Dat2CacheLoaderFactory.ts:270-272`; `Caches.ts:298-318`; `OsrsClient.ts:6250-6260,6334-6338,6386-6400,6616-6622`; `OsrsClientApp.tsx:327-362`.
DB Reference: None; READ-ONLY-DB has no browser cache transport/persistence contract.
Description: A failed required dat2 index fetch is caught and logged, but cache initialization continues and the startup error path presents a login screen despite missing model/cache data.
Evidence:
Code currently does: `fetchDat2` catches each index rejection with `.catch(console.error)`, returns a map missing that index; `MemoryStore.fromFiles` leaves the slot undefined; `CacheSystem.getIndex` throws when phased loading requests it; phased startup catches and transitions to LOGIN_SCREEN rather than exposing a cache failure. This is a traced source path, not an executed browser smoke.
osrsreboxed-db says: No database contract applies.
Impact: User reaches login with a partially initialized client that cannot load cache-dependent world rendering.
Suggested fix direction (do NOT implement): Propagate required index failure to a user-visible recoverable cache-load error rather than treating incomplete cache state as startup success.

### [NEW-FARMING-001] Tithe Farm reward shop offers both body-type-restricted tops
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Farming.plugin.js:5-10`; `server/plugins/skills/farming/Patches.Farming.js:646-663`; `server/plugins/skills/farming/Tithe.Farming.js:12-14,204-215`.
DB Reference: `READ-ONLY-DB/docs/npcs-summary.json` key `6920` -> Farmer Gricoller; `docs/shops-by-npc.json` key `6920` and `docs/shops-items-by-shop.json` -> Farmer Gricoller's Rewards, option `Rewards`, slot 3, including item IDs `13642` and `13643`; `docs/items-json/13642.json` -> Farmer's jacket, equipable body item; `docs/items-json/13643.json` -> Farmer's shirt, equipable body item. The DB establishes NPC/shop/item identities, not body-type eligibility; current OSRS Wiki Farmer's Rewards states the jacket is only available to body type A and the shirt only to body type B: https://oldschool.runescape.wiki/w/Farmer_Gricoller%27s_Rewards.
Description: The active Tithe Farm reward handler offers both body-type-specific tops to every player without checking player body type.
Evidence:
Code currently does: Farming plugin registers and attaches `Patches.attach`; that registers `api.onNpcInteraction(npcInteraction)`. When Farmer Gricoller is clicked, `titheNpc` maps the complete `REWARDS` array into choices. The purchase callback checks distance, points, and only the specific Herb sack/Bologa unlock gates before `Patches.give`; no body-type check gates Farmer's jacket or Farmer's shirt.
osrsreboxed-db says: NPC 6920 is Farmer Gricoller; the authoritative owner mapping exposes the Rewards click at slot 3, and the shop stock includes both item 13642 Farmer's jacket and item 13643 Farmer's shirt. Both keyed item records identify equipable body-slot clothing. The OSRS Wiki's current Farmer Gricoller's Rewards stock note restricts the jacket to body type A and the shirt to body type B; the DB does not encode that eligibility rule.
Impact: Either body type can spend 150 Tithe points on the top reserved for the other body type, contrary to the reward shop's documented eligibility.
Suggested fix direction (do NOT implement): Apply the verified body-type eligibility when presenting and executing the two top rewards; retain the shared rewards for other outfit pieces.

### [NEW-SAILING-001] Salvaging ignores the Whirlpool surprise keg's chance boost
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/sailing/Salvaging.plugin.js:63-67,115-154,173-186,274-280`; Sailing plugin discovery/registration in `server/src/main/typescript/elvarg/plugins/PluginManager.ts:518-594,1724-1750,1943-1949`.
DB Reference: `READ-ONLY-DB/docs/items-json/31811.json` -> Whirlpool surprise; `docs/objects-summary.json` key `59694` -> Keg of whirlpool surprise, and keys `60464`/`60465` -> raised/sunken Small shipwreck; `docs/items-json/32847.json` -> Small salvage. `ItemIdentifiers.ts:29487-29489` and `ObjectIdentifiers.ts:28814,29166-29167` corroborate the runtime IDs. DB confirms identities only; OSRS Wiki rule source: https://oldschool.runescape.wiki/w/Shipwreck_salvaging (success-rate and whirlpool surprise notes) and https://oldschool.runescape.wiki/w/Whirlpool_surprise (keg boost).
Description: A player manually deploying a salvaging hook receives no chance benefit from an on-board keg of Whirlpool surprise.
Evidence:
Code currently does: The active `Salvaging.plugin.js` registers `deployHook` on object interactions. On successful rolls, `salvageTick` calls `successChance(low, high, player.getSkillManager().getCurrentLevel(Skill.SAILING))` directly. The probability helper clamps and interpolates only the passed level; there is no keg/effect modifier in this runtime path, and bounded source search found no Whirlpool-keg Sailing modifier. `Player.getSkillManager().getCurrentLevel` returns the stored current level. Thus with a `Keg of whirlpool surprise` (cache object 59694) onboard, the manual hook still rolls at the unboosted base/current level rather than applying the Wiki-documented invisible +2 specifically to chance. The adjacent shipwreck requirement gate also uses ra…
osrsreboxed-db says: The exact item, keg object, wreck forms, and salvage identities are 31811, 59694, 60464/60465, and 32847. DB records do not define effects. OSRS Wiki says an on-board keg grants an invisible +2 Sailing boost that improves the salvaging rate when manually salvaging; the Wiki's separate boostability note excludes using that invisible boost to meet shipwreck level requirements.
Impact: Players salvaging small shipwrecks with the documented keg setup receive fewer successful salvage rolls than the documented OSRS rate; other wreck types share the same raw-level chance path.
Suggested fix direction (do NOT implement): Apply the keg's verified chance-only Sailing modifier to the salvage-success calculation without treating it as a visible level requirement boost.

### [NEW-COMBAT-002] NPC magic defence uses Magic level for known Defence-level exceptions

Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 2. Monsters / NPCs / Combat Stats and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/formula/AccuracyFormulasDpsCalc.ts:558-590`; stat slot contract `server/src/main/typescript/elvarg/game/definition/NpcDefinition.ts:7-15`; DB loader mapping `server/src/main/typescript/elvarg/game/definition/loader/impl/NpcDefinitionLoader.ts:75-80,209-225`.
DB Reference: `READ-ONLY-DB/docs/monsters-json/7584.json` -> Ice demon normal (Defence 160, Magic 390, Magic defence bonus 40); `7585.json` -> challenge mode (Defence 240, Magic 585, Magic defence bonus 40); `10831.json` -> Verzik Vitur phase 1 (Defence 10, Magic 180, Magic defence bonus 10); `10833.json` -> phase 2 (Defence 120, Magic 180, Magic defence bonus 40); `10835.json` -> phase 3 (Defence 120, Magic 180, Magic defence bonus 60). TSPS's vendored `server/data/definitions/monsters-complete.json` has matching same-name source records for these sampled IDs.
Description: The common NPC magic-defence roll path always computes `(Magic level + 9) * (Magic defence bonus + 64)`. Current OSRS mechanics explicitly use physical Defence level instead of Magic level for Verzik Vitur and Ice demon.
Evidence:
Code currently does: `defenseMagicRoll()` uses `getCurrentDefinition().getStats()[4] + 9` for every NPC, then multiplies by the NPC Magic-defence bonus plus 64 and floors the result. `NpcDefinition` maps slot 4 to Magic level; `NpcDefinitionLoader.fromMonsterDump()` and its assignment map `monster.magic_level` into slot 4 but do not store a separate magic-defence-level selector. For the sampled DB rows, the implementation therefore uses effective levels 189/189/189/399/594, whereas OSRS's exception rule requires 19/129/129/169/249 respectively. With each row's recorded magic-defence bonus, these yield code rolls 13,986 / 19,656 / 23,436 / 41,496 / 61,776 instead of exception-rule rolls 1,406 / 13,416 / 15,996 / 17,576 / 25,896.
osrsreboxed-db says: The cited keyed records carry the distinct physical Defence and Magic levels, and the Magic defence bonuses; itemized monster JSON does not specify which level the game uses in the Magic-defence calculation. Official OSRS Wiki [Magic § Monster Magic defence](https://oldschool.runescape.wiki/w/Magic) says only Verzik Vitur and Ice demon use physical Defence level instead of Magic level. [Ice demon](https://oldschool.runescape.wiki/w/Ice_demon) independently states its magic defence is calculated from Defence level; [Verzik Vitur](https://oldschool.runescape.wiki/w/Verzik_Vitur) provides phase-specific stats and NPC IDs, of which sampled DB phase IDs are 10831, 10833 and 10835. The exact combat rule comes from the Wiki; the levels and bonu…
Impact: Magic attacks against these sampled NPC forms use a magic-defence roll substantially higher than the OSRS exception rule, reducing their magic hit chance; sampled effects range from about 1.47x (Verzik phase 2) to 29.5x (Verzik phase 1). Other NPC exception coverage is limited to these five exact IDs; code/Wiki identify Verzik and Ice demon families, but no exhaustive mapping of every corresponding cache form/DB ID was completed.
Suggested fix direction (do NOT implement): Add explicit NPC magic-defence level semantics for the two documented exception families and verify every phase/difficulty form against its keyed DB record and official combat rules.

### [NEW-COMBAT-001] Bandos godsword Warstrike omits NPC stat drain
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/SpecialAttacks.plugin.js:20`; `server/plugins/combat/specials/BandosGodsword.SpecialAttack.js:9-27,29-54,57-69`; `server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:118-149,841-843`; `server/src/main/typescript/elvarg/game/entity/impl/npc/NPC.ts:426-449`.
DB Reference: `READ-ONLY-DB/docs/items-json/11804.json` key `11804` -> Bandos godsword; `docs/monsters-json/2215.json` key `2215` -> General Graardor (255 Hitpoints, combat stats). These records verify item/NPC identity and the example target only; special behavior is confirmed by OSRS Wiki: https://oldschool.runescape.wiki/w/Bandos_godsword#Special_attack.
Description: The active Warstrike post-hit handler drains combat levels only for player targets; any NPC target returns before applying the damage-based drain.
Evidence:
Code currently does: `SpecialAttacks.plugin.js` registers `BandosGodsword.SpecialAttack`; the plugin registers item `BANDOS_GODSWORD` and attaches `warstrike` as its `handleAfterHitEffects`. `CombatFactory.getMethod()` selects the equipped special method, and resolved hits invoke that method's after-hit effect. `warstrike()` calculates `floor(totalDamage)`, then returns at `!target.isPlayer()`; its only drain path iterates the player-skill order and calls the player SkillManager. NPC exposes a mutable temporary Defence level (`getDefenceLevel`/`setDefenceLevel`) but no full stat-drain API in the inspected source range.
osrsreboxed-db says: Key `11804` identifies the equipable Bandos godsword. Monster key `2215` identifies General Graardor and provides its combat stats. Neither DB record encodes special-attack effects. OSRS Wiki states Warstrike drains the opponent's combat levels equal to damage in Defence, Strength, Prayer, Attack, Magic, Ranged order.
Impact: Warstrike hits on NPCs apply none of the documented combat-level drain, including Defence drain used against bosses; player-target handling is distinct and not claimed defective here.
Suggested fix direction (do NOT implement): Implement NPC combat-stat drain state and apply the same ordered, damage-bounded Warstrike drain to NPC targets while preserving each stat's floor and restoration semantics.

### [NEW-COMMAND-001] Password command accepts credentials the client refuses
Severity: Medium
Status: Open
Category: 13. Client ↔ Server Protocol / Packets (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/commands/PlayerCommands.plugin.js:164-182`; command route `server/src/main/typescript/elvarg/net/packet/impl/ChatPacketListener.ts:26-30` and `CommandPacketListener.ts:6-33`; rights default `server/src/main/typescript/elvarg/plugins/PluginManager.ts:1624-1645`; client validation `client/common/authentication.ts:7-11`, `client/game/login/LoginState.ts:443-468`, `client/game/OsrsClient.ts:5734-5748`; persisted hash `server/src/main/typescript/elvarg/game/entity/impl/player/Player.ts:555-557` and login verification `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:872-893`.
DB Reference: Not data-driven; no READ-ONLY-DB source specifies TSPS account password policy or command semantics.
Description: The unrestricted `::changepassword` handler stores 4–7-character passwords that the browser client refuses to submit at login, and rejects 20-character passwords that the client permits.
Evidence:
Code currently does: `ChatPacketListener` routes `::` input into `CommandPacketListener`; the active command registers with no minimum-rights restriction, and PluginManager interprets an omitted rights value as unrestricted. The handler rejects `pass.length <= 3` or `>= 20`, so it accepts lengths 4–19, hashes them, and updates the player's password hash. The hash is saved on logout and checked during login. The client enforces password lengths 8–20 in `LoginState.getCredentialValidationMessage()` and does not connect when that check fails. Thus a 4–7-character password changed through the command is persisted but unusable through the first-party client; a 20-character password accepted by that client cannot be set through this command. The handler's `sendMes…
osrsreboxed-db says: No DB contract applies to password validation, login, or command access.
Impact: Players can change to credentials the first-party client rejects and become unable to log in normally; client-valid maximum-length credentials are also unexpectedly rejected by the command.
Suggested fix direction (do NOT implement): Align command-side password length rules with the client's authoritative 8–20 policy and avoid echoing the chosen secret in a message.

### [NEW-COMMAND-002] Owner attack-range command permits an unbounded synchronous scan
Severity: Medium
Status: Open
Category: 21. Server-specific issues
Location: `Typescript-RSPS/server/plugins/commands/AdminCommands.plugin.js:1341-1370`; `server/src/main/typescript/elvarg/net/packet/impl/ChatPacketListener.ts:26-30`; `CommandPacketListener.ts:6-33`; command rights `server/src/main/typescript/elvarg/plugins/PluginManager.ts:1632-1645,1698-1721`; range metric `server/src/main/typescript/elvarg/game/model/Location.ts:160-173`.
DB Reference: Not data-driven; no READ-ONLY-DB source defines this owner debug command or server scheduling behavior.
Description: The owner-only `::attackrange`/`::atkrange` command accepts an arbitrary parsed distance and synchronously scans a square whose side grows linearly with that value, without a bound.
Evidence:
Code currently does: Chat command dispatch routes the input to `PluginManager.emitCommand`; both aliases register `attackRangeFn` with OWNER rights. When an argument parses, the handler constructs `start` and `end` at player coordinates ±(`distance + 5`), then runs nested inclusive X/Y loops over every tile in that square before filtering to tiles at the requested distance and sending graphics. There is no clamp or iteration budget. A distance `d` therefore causes `(2d + 11)^2` loop iterations in one synchronous command handler, even though only perimeter tiles emit graphics. Rights gating limits ordinary player access but does not bound work for an authorized owner/developer.
osrsreboxed-db says: No DB contract applies to administrative command behavior or event-loop work.
Impact: A sufficiently large argument from an authorized operator can monopolize the Node.js event loop for an impractical duration, pausing server processing and delaying all connected players.
Suggested fix direction (do NOT implement): Clamp the diagnostic range to a small documented maximum and/or use a bounded tile traversal that rejects excessive work before entering the scan.

### [NEW-AGILITY-001] Gnome Stronghold obstacle XP differs from the documented course rewards
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/agility/courses/GnomeStronghold.js:20-100`; `server/plugins/skills/Agility.plugin.js:48-68,160-166,219-227`.
DB Reference: `READ-ONLY-DB/docs/objects-summary.json` keys `23145` (Log balance), `23134`/`23135` (Obstacle net), `23559`/`23560` (Tree branch), `23557` (Balancing rope), and `23138`/`23139` (Obstacle pipe). These verify active obstacle identities only; course XP rules are not encoded in the DB. OSRS Wiki: https://oldschool.runescape.wiki/w/Gnome_Stronghold_Agility_Course.
Description: The active Gnome Stronghold course awards several obstacle XP values below the documented values, then compensates with an oversized completion bonus so total lap XP stays 110.5.
Evidence:
Code currently does: `GnomeStronghold.js` configures indexes 1–7 at XP `7.5, 7.5, 5, 7.5, 5, 7.5, 7.5`, respectively. `Agility.plugin.js:48-59` records the maximum XP for each index (the two pipe variants both share index 7), and lines 61–68 derive `lapBonus` as `course.lapXp - obstacleXp total`, rounded to a tenth. These configured obstacle values total 47.5 XP, so the completion bonus is 63 XP; the reproduced sum is still 110.5 XP per lap.
osrsreboxed-db says: The cited object keys identify the corresponding Gnome course obstacle types, but the DB does not provide Agility XP mechanics. The current OSRS Wiki course table specifies obstacle XP of `10, 10, 6.5, 10, 6.5, 10, 7.5` and a 50 XP completion bonus (110.5 total). The obstacle IDs in the active TSPS course map match the keyed DB identities.
Impact: Total XP per completed course lap remains 110.5, but XP is redistributed: the first six obstacles award less than the documented amounts and completion awards 63 instead of 50, changing when XP is earned during a lap.
Suggested fix direction (do NOT implement): Match each obstacle's XP to the documented course table and set the completion bonus to 50 while preserving the 110.5 lap total.

### [NEW-AGILITY-002] Mark of Grace rolls use incorrect timing/rates and omit Gnome Stronghold
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Agility.plugin.js:15-21,184-217`; active course list `server/plugins/skills/agility/courses/index.js:1-22`; Gnome course definition `server/plugins/skills/agility/courses/GnomeStronghold.js:20-100`.
DB Reference: `READ-ONLY-DB/docs/items-json/11849.json` key `11849` identifies Mark of Grace; `docs/objects-summary.json` keys `23145`, `23134`/`23135`, `23559`/`23560`, `23557`, and `23138`/`23139` identify the Gnome course obstacles. These DB records establish item/object identities, not spawn mechanics. OSRS Wiki: https://oldschool.runescape.wiki/w/Mark_of_grace and https://oldschool.runescape.wiki/w/Gnome_Stronghold_Agility_Course.
Description: The active system rolls Marks of Grace at the first obstacle with a fixed rate and over-level adjustment, lacks the documented per-course cooldown/rate rules, and gives the registered Gnome Stronghold course no mark locations.
Evidence:
Code currently does: `advanceCourse` calls `rollMarkOfGrace` when obstacle index 1 starts lap progress (`Agility.plugin.js:188-196`). `rollMarkOfGrace` returns if `course.marks` is absent, otherwise uses one `1/4` chance; at 20+ levels over the configured course requirement it multiplies that chance by `0.75` (`206-217`). No elapsed-time/cooldown state is checked. The active registry includes Gnome Stronghold (`courses/index.js:2-4`), but its course definition has no `marks` property, so its mark roll always returns without spawning. The Wiki says marks spawn on lap completion after a three-minute cooldown for most courses, at course-specific rates (most rooftops `2/6`, Canifis/Ardougne `2/3`, Rellekka `2/5`), and the over-level penalty reduces the applicabl…
osrsreboxed-db says: Item key `11849` confirms Mark of Grace identity; the listed object keys verify the active Gnome obstacle identities. The DB contains no spawn timing, eligibility, or probability rule; the OSRS Wiki sources above provide those mechanics.
Impact: Eligible players may receive marks at the wrong point in a lap and without the global cooldown, with incorrect rates/over-level reductions; Gnome Stronghold players cannot receive marks despite the documented course eligibility.
Suggested fix direction (do NOT implement): Roll at completed laps only after the appropriate cooldown, apply each course's verified base/diary/over-level rules, and configure Gnome Stronghold's documented mark location.

### [NEW-FIRE-001] Firemaking rejects every colored-log item
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Firemaking.plugin.js:46-70,653-688,689-732,735-767,940-956`.
DB Reference: `READ-ONLY-DB/docs/items-json/7404.json` -> Red logs; `7405.json` -> Green logs; `7406.json` -> Blue logs; `10328.json` -> White logs; `10329.json` -> Purple logs. These records verify the five item identities; OSRS Wiki item pages establish that they are burned with a tinderbox, award 50 Firemaking XP and light successfully without the ordinary failure roll (https://oldschool.runescape.wiki/w/Red_logs, `/w/Green_logs`, `/w/Blue_logs`, `/w/White_logs`, `/w/Purple_logs`).
Description: The active Firemaking item lookup excludes all five colored logs, so inventory and ground lighting actions cannot begin for them.
Evidence:
Code currently does: `LIGHTABLE_LOGS` contains standard log types only; `LIGHTABLE_LOGS_BY_ID` is consulted by inventory item-on-item, inventory-on-ground-item and ground-item second-click handlers. Each route returns without starting the action when no map entry exists. Registration derives the supported ground second-click IDs from that same list.
osrsreboxed-db says: The keyed records identify Red/Green/Blue/White/Purple logs as distinct existing item IDs. They do not encode the Firemaking action; the cited Wiki pages specify the 50 XP and guaranteed-light behavior.
Impact: Players cannot burn any of these five documented colored logs through the active Firemaking handlers.
Suggested fix direction (do NOT implement): Add the colored-log action behavior with the documented XP and guaranteed success, without routing them through ordinary log failure logic.

### [NEW-RUNE-001] Mind Altar grants excess Runecrafting XP
Severity: Low
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Runecrafting.plugin.js:104-107,342-391`; `server/src/main/typescript/elvarg/util/ObjectIdentifiers.ts:18508-18510`.
DB Reference: `READ-ONLY-DB/docs/objects-summary.json` key `34761` -> Altar; `docs/items-summary.json` key `558` -> Mind rune and `1436` -> Rune essence. These verify altar/input/output identities. OSRS Wiki Mind Altar page specifies level 2 and 5.5 XP per essence: https://oldschool.runescape.wiki/w/Mind_altar.
Description: Crafting Mind runes at object ID 34761 awards 6 XP per essence instead of the documented 5.5.
Evidence:
Code currently does: `RUNES_BY_ALTAR_ID` maps `ALTAR_34` (34761) to Mind rune, level 2, `xp: 6`; `handleCraftRunes` grants `craftedEssence * runeData.xp`.
osrsreboxed-db says: Key 34761 is an Altar, item 558 is Mind rune, and 1436 is Rune essence. The DB does not encode XP; the cited Wiki entry gives 5.5 XP per essence for both rune and pure essence.
Impact: Each essence crafted at the Mind Altar awards 0.5 excess Runecrafting XP.
Suggested fix direction (do NOT implement): Set the altar's XP reward to the verified 5.5 XP per essence.

### [NEW-RUNE-002] Blood altar variants share incorrect level, essence and XP rules
Severity: High
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features, 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Runecrafting.plugin.js:117-119,342-391,532-534`; `server/src/main/typescript/elvarg/util/ObjectIdentifiers.ts:14503-14505,21971-21973`.
DB Reference: `READ-ONLY-DB/docs/objects-summary.json` key `27978` -> Blood Altar (Kourend) and `43479` -> Altar (true Blood Altar); `docs/items-summary.json` keys `565` -> Blood rune, `7936` -> Pure essence and `7938` -> Dark essence fragments. DB confirms identities only. OSRS Wiki specifies the Kourend altar needs level 77, Dark essence fragments and awards 23.8 XP; true Blood Altar needs level 77, Pure essence, Sins of the Father and awards 10.5 XP: https://oldschool.runescape.wiki/w/Blood_Altar_(Kourend), https://oldschool.runescape.wiki/w/Blood_Altar.
Description: The Kourend and true Blood Altar objects are aliased to one recipe record that allows level 75 and assigns pure essence/27 XP to both.
Evidence:
Code currently does: `RUNES_BY_ALTAR_ID` maps `BLOOD_ALTAR` (27978) to Blood rune, level 75, pure essence only, 27 XP, then assigns the same record to `ALTAR_83` (43479). `handleCraftRunes` checks only that shared level and essence rule before granting XP. The active `Blood Altar` `Bind` interaction reaches this handler; no Sins of the Father check is present in the path.
osrsreboxed-db says: Object keys distinguish ID 27978 (Blood Altar) from ID 43479 (Altar); item keys identify Blood rune, Pure essence and Dark essence fragments. OSRS Wiki clarifies that 27978 is Kourend's altar while 43479 is the true altar and supplies their distinct inputs, levels, XP and quest gate.
Impact: Level 75 players can craft Blood runes at either altar; the Kourend altar accepts the wrong essence and grants the wrong XP, and true altar crafting is not gated by Sins of the Father and grants excess XP.
Suggested fix direction (do NOT implement): Keep separate verified crafting rules for the two altar IDs, including the Kourend fragment input, both level/XP values and true-altar quest requirement.

### [NEW-RUNE-003] Essence pouches never degrade on filling
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Runecrafting.plugin.js:159-171,210-238,241-279,291-340,535-540`.
DB Reference: `READ-ONLY-DB/docs/items-summary.json` keys `5509` -> Small pouch, `5510-5511` -> Medium pouch, `5512-5513` -> Large pouch, `5514-5515` -> Giant pouch, `1436` -> Rune essence, `7936` -> Pure essence. These verify item identities only; OSRS Wiki Essence pouch documents per-essence degradation of medium, large and giant pouches on filling, capacity loss/destruction thresholds, and Dark Mage repair: https://oldschool.runescape.wiki/w/Essence_pouch#Degrading.
Description: Repeated fills leave medium, large and giant pouches at full initial capacity indefinitely; the active Runecrafting handlers also register no repair action.
Evidence:
Code currently does: Tier metadata lists fixed capacities and `decayChance`, but `storePouch` only tests the fixed capacity and transfers essence; it never updates degradation state or reduces capacity. `ensurePouchArray` persists only essence amounts and recreates the tier metadata. Registration exposes only Fill, Check and Empty actions for these pouches; no repair callback is registered in this plugin.
osrsreboxed-db says: The keyed records identify the four pouch sizes (including degraded item forms) and essence items; the DB does not encode pouch use/degradation mechanics. The cited Wiki documents degradation per essence filled for medium/large/giant, plus repair to prevent eventual destruction; small pouches do not degrade.
Impact: Pouches retain their maximum capacity permanently and cannot be lost through the documented degradation lifecycle on this active path.
Suggested fix direction (do NOT implement): Persist degradation/capacity state per pouch and expose the documented repair route without degrading small pouches.
### [NEW-SMITH-001] Direct iron-ore smelting resolves to the steel recipe
Severity: High
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:126-160,381-386,849-860`.
DB Reference: `READ-ONLY-DB/docs/items-json/440.json` key 440 -> Iron ore; `453.json` key 453 -> Coal; `2351.json` key 2351 -> Iron bar; `2353.json` key 2353 -> Steel bar.
Description: The ingredient-to-recipe map is keyed only by an ingredient item ID, so the later Steel recipe overwrites the Iron recipe for the shared Iron ore key; direct item-on-furnace dispatch therefore selects Steel.
Evidence:
Code currently does: `SMELTING_RECIPES` defines Iron bar with one iron ore, then Steel bar with iron ore plus two coal. The loop inserts every ingredient into `SMELT_RECIPES_BY_INGREDIENT`; setting the Steel recipe overwrites the prior Iron recipe under the same ore ID. The item-on-object handler resolves by the used `itemId` alone and immediately performs that mapped recipe. The separate menu route selects by recipe index, not this map.
osrsreboxed-db says: The exact records establish the identities of iron ore, coal and resulting iron/steel bars. OSRS Wiki Smithing says direct use of ore on a furnace smelts that ore's desired metal, with iron as its own recipe and steel requiring iron ore plus two coal.
Impact: Using iron ore directly on a furnace cannot use the normal iron-smelting route: without two coal the selected steel recipe rejects it; with two coal it consumes both coal and ore to make steel. This defect is specific to direct item-on-object use; the menu path is separate.
Suggested fix direction (do NOT implement): Resolve direct furnace input using an explicit recipe/input decision that disambiguates shared ingredients rather than a single-value ingredient-ID map.

### [NEW-SMITH-002] Ring of forging does not guarantee furnace iron smelts
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:138-144,465-496`.
DB Reference: `READ-ONLY-DB/docs/items-json/440.json` key 440 -> Iron ore; `2351.json` key 2351 -> Iron bar; `2568.json` key 2568 -> Ring of forging.
Description: Furnace iron smelting always uses the recipe's 50% success chance, without checking for an equipped ring of forging.
Evidence:
Code currently does: Iron recipe sets `successChance: 0.5`; `performSmeltAction` consumes the ore before rolling against that static chance and has no equipment check. The route applies to the normal furnace/menu smelt action in this plugin.
osrsreboxed-db says: These keyed records verify the item identities; mechanics are not encoded in item JSON. OSRS Wiki Ring of forging states the worn ring guarantees 100% iron smelting success; ordinary furnace iron has a 50% success rate and failed ore is lost.
Impact: Players wearing the ring can still lose iron ore on a failed roll in this Smithing path.
Suggested fix direction (do NOT implement): Include ring-of-forging state in the iron-smelt success decision and keep its charge consumption/lifecycle consistent with the mechanic.

### [NEW-SMITH-003] Blurite and Lovakite smelting are absent from the active plugin
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:97-193,849-869,896-900`; object identifier `Typescript-RSPS/server/src/main/typescript/elvarg/util/ObjectIdentifiers.ts:15006`.
DB Reference: `READ-ONLY-DB/docs/items-json/668.json` key 668 -> Blurite ore; `9467.json` key 9467 -> Blurite bar; `13356.json` key 13356 -> Lovakite ore; `13354.json` key 13354 -> Lovakite bar; `READ-ONLY-DB/docs/objects-summary.json` key 28562 -> Lovakite furnace.
Description: The active recipe catalog and interaction routes omit Blurite and Lovakite bars, including the special Lovakite furnace route.
Evidence:
Code currently does: `SMELTING_RECIPES` contains eight recipes and neither bar. Direct item-on-object routes accept only object names Furnace or Small furnace, while object 28562 has its own Lovakite furnace identifier/name. No Lovakite recipe or handler is present in the reviewed active plugin.
osrsreboxed-db says: Exact keyed JSON records identify both ore/bar pairs and object 28562 as Lovakite furnace. OSRS Wiki Smithing lists Blurite at level 13, 8 XP, requiring The Knight's Sword completion. OSRS Wiki Lovakite bar documents level 45, one Lovakite ore plus two coal, 20 XP, and that it cannot be smelted in a normal furnace.
Impact: These active Smithing routes cannot produce Blurite or Lovakite bars; specifically Lovakite ore on its dedicated furnace is not dispatched.
Suggested fix direction (do NOT implement): Add exact recipe and quest/facility-aware routes for these two bars, keeping Lovakite confined to the documented special furnace unless using Superheat Item.

### [NEW-SMITH-004] Smithable product catalog omits crossbow limbs
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:34-42,201-342,345-379,782-813`.
DB Reference: `READ-ONLY-DB/docs/items-json/9420.json` key 9420 -> Bronze limbs; `9422.json` -> Blurite limbs; `9423.json` -> Iron limbs; `9425.json` -> Steel limbs; `9427.json` -> Mithril limbs; `9429.json` -> Adamantite limbs; `9431.json` -> Runite limbs.
Description: No crossbow-limbs product is available through the active anvil product catalog.
Evidence:
Code currently does: `SMITHING_COMPONENT_BY_PRODUCT` has no Limbs entry; `SMITHABLE_EQUIPMENT_DATA` maps the available products across its six metal tiers but contains no limbs. The product map and button allowlist are built from this catalog.
osrsreboxed-db says: Exact keyed item records identify the seven corresponding limb items, including Bronze, Blurite, Iron, Steel, Mithril, Adamantite and Runite limbs. OSRS Wiki Smithing tables list limbs as Smithing products; e.g. bronze at level 6, one bar, 12.5 XP; iron at 23/one bar/25 XP; steel at 36/one bar/37.5 XP; mithril 56/50 XP; adamantite 76/62.5 XP; runite 91/75 XP. DB establishes item identities, not recipe mechanics.
Impact: Players cannot smith the listed crossbow limb products through this active anvil interface.
Suggested fix direction (do NOT implement): Add the missing limb product rows and interface mapping with per-tier bars, levels, outputs and XP from the authoritative Smithing tables.

### [NEW-SMITH-005] Anvil actions award a flat 10 Smithing XP
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 16. Hardcoded values vs DB-driven data and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:201-342,498-527`.
DB Reference: `READ-ONLY-DB/docs/items-json/1205.json` key 1205 -> Bronze dagger; `2.json` key 2 -> Steel cannonball.
Description: Every anvil action grants 10 Smithing XP, independent of product, bars consumed, or special recipe.
Evidence:
Code currently does: Smithable rows include bar cost and output but no XP consumed by `performSmithAction`; after each action the handler always calls `addExperiences(Skill.SMITHING, 10)`. Examples in the catalog include one-bar Bronze dagger and four steel cannonballs for one steel bar.
osrsreboxed-db says: The exact records identify Bronze dagger and Steel cannonball; the DB does not contain recipe XP. OSRS Wiki Smithing tables give 12.5 XP for a Bronze dagger and 25.6 XP per steel-cannonball bar/action, not 10.
Impact: The anvil route under-awards Smithing XP for both verified examples and does not reflect the product-dependent reward system; other rows also receive the same hardcoded amount.
Suggested fix direction (do NOT implement): Store and award the verified XP per smithing action/product, including the cannonball-specific exception.

### [NEW-SMITH-006] Quest-gated Smithing products lack quest checks
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:201-343,498-527,600-638,782-813`.
DB Reference: `READ-ONLY-DB/docs/items-json/2.json` key 2 -> Steel cannonball; `3095.json` -> Bronze claws; `3096.json` -> Iron claws; `3097.json` -> Steel claws.
Description: The active product catalog's reachable claws action has no quest-state requirement, despite the documented Death Plateau prerequisite. The steel-cannonball row is separately unreachable through the current interface dispatch (NEW-SMITH-012), so this finding does not claim players can presently smith that row.
Evidence:
Code currently does: Smithable product rows encode requirements such as level and bar count only. Session start validates hammer, level and bars; each `performSmithAction` validates hammer, level and bars again, with no quest-state condition.
osrsreboxed-db says: The keyed records identify exact product items but do not encode quest gates. OSRS Wiki states that steel cannonballs require Dwarf Cannon completion and claws require Death Plateau.
Impact: A player meeting Smithing level and materials can create the listed claws without Death Plateau. The steel-cannonball prerequisite is not an active bypass while its row remains undispatchable.
Suggested fix direction (do NOT implement): Attach explicit quest prerequisites to gated product rows and validate them at selection and execution.

### [NEW-SMITH-007] Anvil session timing ignores Smiths' Uniform bonuses
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:90-94,625-638,759-780`.
DB Reference: `READ-ONLY-DB/docs/items-json/27023.json` key 27023 -> Smiths tunic; `27025.json` -> Smiths trousers; `27027.json` -> Smiths boots; `27029.json` -> Smiths gloves.
Description: Smithing session intervals never test Smiths' Uniform pieces, so the documented chance to shorten anvil actions is absent.
Evidence:
Code currently does: ordinary smithing sessions always use `SMITHING_INTERVAL_TICKS = 5`; cannonballs use a separate fixed 8-tick interval. The reviewed session execution path contains no outfit-based interval roll.
osrsreboxed-db says: Exact item records identify the outfit pieces. OSRS Wiki Smiths' Uniform says each piece adds a 20% chance to reduce anvil action time from 5 ticks to 4, with a full set guaranteeing the reduction.
Impact: Players wearing any or all Smiths' Uniform pieces receive no timing benefit in this anvil session.
Suggested fix direction (do NOT implement): Apply the per-piece anvil action-speed roll to the ordinary smithing session and verify cannonball-specific scope separately.

### [NEW-SMITH-008] Anvil accepts only a normal inventory hammer
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 1. Items & Equipment and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:498-503,600-609`.
DB Reference: `READ-ONLY-DB/docs/items-json/2347.json` key 2347 -> Hammer; `25644.json` -> Imcando hammer; `29775.json` -> Imcando hammer (off-hand).
Description: The active anvil route requires item 2347 in inventory and does not recognize the usable Imcando hammer variants.
Evidence:
Code currently does: Both the per-action handler and session-start check call `inventory.contains(ItemIds.HAMMER)` and fail otherwise; neither checks equipment nor alternate tool IDs.
osrsreboxed-db says: Exact keyed records identify the normal hammer and both Imcando variants. OSRS Wiki states the Imcando hammer functions as a normal hammer while equipped or unequipped; its off-hand variant functions identically.
Impact: A player holding either Imcando variant, but no normal inventory hammer, cannot smith through the active anvil path.
Suggested fix direction (do NOT implement): Use a shared hammer predicate that checks the documented valid inventory and equipped variants, including the off-hand item.

### [AUD-057] Kandarin medium diary's Seers maple XP bonus is not applied

Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Woodcutting.plugin.js:332-348,650-662,1039-1055,1144-1157`; diary reward definition `Typescript-RSPS/server/data/definitions/achievement-diaries.json:1755-1760,1864-1886,1990-2000`; reward-state mutation `Typescript-RSPS/server/plugins/diaries/DiaryRewards.js:35-38`, `DiaryProgress.js:109-113`.
DB Reference: `READ-ONLY-DB/docs/objects-summary.json` keys `10832`, `36681`, `36682`, `40754`, `40755` identify Maple tree objects; `docs/items-json/1517.json` identifies Maple logs; `docs/items-json/13138.json` identifies Kandarin headgear 2. The vendored Kandarin medium diary reward grants headgear 2 and states Seers maples provide 10% more XP. Current OSRS Wiki Kandarin Diary and Maple tree pages confirm the 10% experience benefit at Seers Village, stacking with Lumberjack outfit; base Maple reward is 100 XP.
Description: The maple-chopping award path never checks the claimed Kandarin medium reward or Seers Village location, so it omits the 10% XP bonus.
Evidence:
Code currently does: Maple configuration uses level 45, 100 base XP and Maple logs. A successful maple roll awards `state.tree.xpReward * lumberjackXpMultiplier(player)`. The multiplier inspects only worn Lumberjack outfit pieces. Diary claim persists the tier under `diary.kandarin.rewards` and awards item 13138, but Woodcutting contains no diary-state/location check. DB object keys confirm several maple object IDs; Maple logs and Kandarin headgear identity match the corresponding item records.
osrsreboxed-db says: It identifies the object/log/reward item; the actual 10% benefit is a live game rule, confirmed by the current OSRS Wiki rather than a DB field. A qualifying player at Seers Village should receive 110 XP before outfit bonus/world multiplier, but TSPS supplies the base 100 (before those independent modifiers).
Impact: Claiming Kandarin medium does not grant the stated 10% Woodcutting XP benefit for Seers Village maples.
Suggested fix direction (do NOT implement): Apply the claimed diary benefit to the maple XP reward only when both diary tier and Seers Village location qualify, retaining the independent Lumberjack multiplier.

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
### [AUD-062] Escape closes the trade modal only on the client

Severity: Medium
Status: Open
Category: 12. Inventory / Banking / Containers (also 13. Client ↔ Server Protocol / Packets, 15. Interfaces / UI, 21. Server-specific issues)
Location: `Typescript-RSPS/client/game/widgets/input/widgetKeyboardInput.ts:164-172,246-263`; `client/rs/cs2/Cs2Vm.ts:1305-1323`; `client/game/OsrsClient.ts:1651-1654,6869-6903`; `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:679-704,1065-1072`; `server/src/main/typescript/elvarg/game/entity/impl/player/Player.ts:599-608`; `server/src/main/typescript/elvarg/game/content/Trading.ts:133-190,200-233,448-461`; `server/src/main/typescript/elvarg/net/packet/PacketSender.ts:638-722`.
DB Reference: No relevant `osrsreboxed-db` item/NPC record; this is a client/server protocol-state defect. Official OSRS Wiki [Trading — First trade window](https://oldschool.runescape.wiki/w/Trading#First_trade_window) states that declining closes the trade window; this is used only to establish expected close/decline semantics, not DB content.
Description: Escape closes the trade modal and resets generic player interface/status state, but does not abort the trade controller or return its escrowed offers; the two clients and server trade states diverge.
Evidence:
Code currently does: `closeOpenModal()` sends the zero-payload IF_CLOSE and defers client-side removal of type-0/type-3 parents. `Cs2Vm.performIfCloseNow()` closes those local parents regardless of server response. Server `NetworkBuilder` receives IF_CLOSE and calls `PacketSender.closeInterruptibleInterfaces()` directly; that generic close resets `PlayerStatus` to NONE and `interfaceId` to -1, then closes tracked modals. It does not call `Trading.closeTrade()`, reset the `Trading` controller state/interact, return escrowed items, or send the trade-close payload. `Player.closeInterruptibleInterfaces()` excludes TRADING, but this explicit packet path bypasses that guard. Thus server-side `Trading.state` remains TRADE_SCREEN/CONFIRM_SCREEN and its offered-item …
osrsreboxed-db says: The DB has no trade UI state or close semantics; item records are unrelated. Protocol and state facts above are verified in TSPS source. OSRS trade documentation says decline closes the window.
Impact: Escape strands the initiating player's server trade controller with escrowed offers and leaves their client state open; the counterparty remains actively locked in trade. Neither side can complete or accept a new trade through the normal path; logout is a recovery path that aborts and returns offered items.
Suggested fix direction (do NOT implement): Route IF_CLOSE for active trading through the same abort/decline lifecycle as the trade widget rather than generic interface cleanup.

### [AUD-063] Herblore cleaning levels and XP mismatch for configured herbs

Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Herblore.plugin.js:11-23,59-82`; item ID constants `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:198-219,248-269`; first-action dispatch `.../net/packet/impl/ItemActionPacketListener.ts:39-51,64-100`; plugin registration `.../plugins/PluginManager.ts:3406-3427`; stored XP arithmetic `.../game/content/skill/SkillManager.ts:162-165`.
DB Reference: `READ-ONLY-DB/docs/items-json/{199,201,203,205,207,209,211,213,215,217}.json` and `{249,251,253,255,257,259,261,263,265,267}.json`, keyed by the respective IDs; records verify grimy inputs and clean outputs by name. Cleaning level/XP are not fields in these item records; current values are checked against OSRS Wiki [Herblore — Cleaning herbs](https://oldschool.runescape.wiki/w/Herblore#Cleaning_herbs_%26_unfinished_potions).
Description: Nine of the ten configured grimy herbs from Guam through dwarf weed have a wrong cleaning XP reward; Guam also has a wrong Herblore level gate. Tarromin matches. This finding excludes torstol (AUD-060) and does not claim completeness for herbs absent from the map.
Evidence:
Code currently does: `CLEANABLE_HERBS` maps grimy IDs to clean IDs and configured `{level,xp}` values; the live first-item handler checks the configured level, deletes one grimy item, adds its clean counterpart, and awards that XP. Inventory click type 1 reaches the handler through `ItemActionPacketListener` and `PluginManager` first-action registration. DB item keys confirm each input/output pair: 199→249 Guam, 201→251 Marrentill, 203→253 Tarromin, 205→255 Harralander, 207→257 Ranarr, 209→259 Irit, 211→261 Avantoe, 213→263 Kwuarm, 215→265 Cadantine, 217→267 Dwarf weed.
osrsreboxed-db says: Those records say only that the listed IDs correspond to the matching grimy/clean item names; they encode no cleaning XP or level. OSRS Wiki's cleaning table gives level/XP respectively: Guam 3/2.5, Marrentill 5/3.8, Tarromin 11/5, Harralander 20/6.3, Ranarr 25/7.5, Irit 40/8.8, Avantoe 48/10, Kwuarm 54/11.3, Cadantine 65/12.5, Dwarf weed 70/13.8. TSPS configures Guam 1/2, Marrentill 5/4, Tarromin 11/5, Harralander 20/6, Ranarr 25/7, Irit 40/10, Avantoe 48/12, Kwuarm 54/13, Cadantine 65/14, Dwarf weed 70/18. Thus all but Tarromin differ in XP; Guam also permits cleaning two levels early. The skill manager stores the configured XP as a number without flooring (`SkillManager.ts:162-165`), so fractional XP awards are retained.
Impact: Cleaning any configured herb except tarromin awards the wrong Herblore XP; Guam additionally bypasses the level-3 cleaning requirement. Resulting XP progression differs per cleaned herb.
Suggested fix direction (do NOT implement): Align the nine affected map entries to the verified OSRS cleaning level/XP table and validate every remaining Herblore activity separately.

### [AUD-064] Hill Giants drop looting bags outside the Wilderness

Severity: Medium
Status: Open
Category: 3. Drop Tables (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/npcs/NpcDrops.plugin.js:404-432,437-455,463-489`; live drop data `Typescript-RSPS/server/data/definitions/npc-drops.json:100046-100061,217221-217229`; live spawns `Typescript-RSPS/server/data/definitions/npc-spawns.json:2807-2816`; override `Typescript-RSPS/server/data/definitions/npc-drop-overrides.json:41` (used for ID 7261, not ordinary IDs 2098–2103).
DB Reference: `READ-ONLY-DB/docs/drops-json/npc-drops.json` `tables.hill_giant.tertiary` item 11941 and `npcs[2098]` through `npcs[2103]` → `hill_giant`; `READ-ONLY-DB/docs/items-json/11941.json` key 11941 -> Looting bag.
Description: The generic tertiary roller awards Hill Giant looting bags at the configured 1/5 rate without applying the DB's Wilderness-only condition. TSPS has reachable Hill Giant spawns outside its configured Wilderness zones, so those kills can produce the restricted item.
Impact: A non-Wilderness Hill Giant kill can yield a Looting bag, bypassing its Wilderness-only drop rule and granting a trade-restricted storage item from ordinary areas.
Suggested fix direction (do NOT implement): Apply the location condition for the looting-bag tertiary row during rolling; avoid making a broad text-note parser the only semantic mechanism for drop restrictions.

### [AUD-065] Four potion recipes over-award fractional Herblore XP
Severity: Low
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Herblore.plugin.js:39-49,119-140`; numeric XP storage `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/skill/SkillManager.ts:162-165`; inventory item-on-item route `Typescript-RSPS/server/src/main/typescript/elvarg/net/NetworkBuilder.ts:358-366`, `.../net/packet/impl/UseItemPacketListener.ts:12-38`, `.../plugins/PluginManager.ts:1496-1500`.
DB Reference: `READ-ONLY-DB/docs/items-json/93.json` -> Marrentill potion (unf); `235.json` -> Unicorn horn dust; `175.json` -> Antipoison(3). `97.json` -> Harralander potion (unf); `223.json` -> Red spiders' eggs; `127.json` -> Restore potion(3). `99.json` -> Ranarr potion (unf); `231.json` -> Snape grass; `139.json` -> Prayer potion(3). `109.json` -> Dwarf weed potion (unf); `245.json` -> Wine of Zamorak; `169.json` -> Ranging potion(3). DB records verify exact item identities only; recipe XP is checked against current OSRS Wiki rules.
Description: The reachable Antipoison, Restore, Prayer, and Ranging potion recipes award 38, 63, 88, and 163 XP instead of 37.5, 62.5, 87.5, and 162.5 respectively.
Evidence:
Code currently does: `FINISHED_POTIONS` configures those XP values at lines 41, 43–45, and 48. The item-use handler accepts both ingredient orders, consumes inputs, creates configured output, and passes `finished.xp` directly to `addExperiences`. SkillManager adds the numeric XP value without integer rounding.
osrsreboxed-db says: The keyed records above confirm all four configured input pairs and output IDs. They contain no recipe XP field. Current OSRS Wiki recipe pages ([Antipoison](https://oldschool.runescape.wiki/w/Antipoison), [Restore potion](https://oldschool.runescape.wiki/w/Restore_potion), [Prayer potion](https://oldschool.runescape.wiki/w/Prayer_potion), [Ranging potion](https://oldschool.runescape.wiki/w/Ranging_potion)) specify the respective fractional awards. Because the handler and skill store preserve numbers, the configured integer awards are each 0.5 XP too high.
Impact: Each successful mix of these four recipes over-awards 0.5 Herblore XP, causing cumulative XP progression drift.
Suggested fix direction (do NOT implement): Store and award the exact fractional XP for these recipes; check every remaining recipe's XP separately.

### [AUD-066] Standard Defence potion recipe is not handled
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Herblore.plugin.js:39-49,119-124`.
DB Reference: `READ-ONLY-DB/docs/items-json/99.json` -> Ranarr potion (unf); `239.json` -> White berries; `133.json` -> Defence potion(3).
Description: The finished-potion map lacks the standard Ranarr potion (unf) + white berries recipe, so this pair reaches no Herblore action and produces no Defence potion.
Evidence:
Code currently does: The only Ranarr finished recipe in the configured table is the Snape grass Prayer potion at line 44. Any unmatched pair returns at lines 121–124 without setting the event handled; therefore Ranarr unfinished + White berries has no craft result. The inventory-use packet reaches this hook through NetworkBuilder, UseItemPacketListener, and PluginManager.
osrsreboxed-db says: Keys 99, 239, and 133 identify the expected Ranarr potion (unf), White berries, and Defence potion(3). These records verify IDs, not recipe rules. The current OSRS Wiki [Defence potion](https://oldschool.runescape.wiki/w/Defence_potion) states that using white berries on Ranarr potion (unf) at Herblore 30 yields Defence potion(3) and 75 XP.
Impact: Players cannot make the standard Defence potion through its normal inventory recipe; the separate Super Defence recipe does not substitute for it.
Suggested fix direction (do NOT implement): Add the verified recipe to the active finished-potion recipe data and ensure it is exercised by item-on-item dispatch.

### [AUD-067] Herblore mixing ignores worn dose and secondary-saving equipment
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features, 19. Data consistency bugs, 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Herblore.plugin.js:119-140`; modifier item IDs `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts` (`AMULET_OF_CHEMISTRY=21163`, `PRESCRIPTION_GOGGLES=29974`, alchemist's amulet variants 29988/29990).
DB Reference: `READ-ONLY-DB/docs/items-json/21163.json` -> Amulet of chemistry; `29988.json`/`29990.json` -> Alchemist's amulet variants; `29974.json`/`29976.json` -> Prescription goggles. Example 3-/4-dose output identities: Restore potion 127/2430, Prayer potion 139/2434, Ranging potion 169/2444. DB keys verify item identities and dose forms, not proc rules.
Description: The reachable potion-mixing handler always creates the fixed 3-dose table result and consumes exactly one secondary, without applying relevant worn potion-making equipment effects.
Evidence:
Code currently does: For each matched pair, after level validation, lines 134–139 animate, delete one of each input, add one fixed `finished.potion`, and award the configured XP. There is no equipment check, variable output-dose selection, secondary-save branch, or charge consumption in the handler. Server search for these item identifiers found declarations but no active mix implementation.
osrsreboxed-db says: The keyed item records identify the relevant equipment and item variants. The current OSRS Wiki [Amulet of chemistry](https://oldschool.runescape.wiki/w/Amulet_of_chemistry) and [Alchemist's amulet](https://oldschool.runescape.wiki/w/Amulet_of_chemistry#Alchemist's_amulet) specify 5% and 15% extra-dose effects while equipped for eligible (<4-dose) potion creation; [Prescription goggles](https://oldschool.runescape.wiki/w/Prescription_goggles) specifies a 10% secondary-save chance for most potion mixes. These Wiki mechanics, not DB fields, establish behavior.
Impact: Eligible potion mixes with the relevant equipment never receive their expected extra-dose yield or secondary savings; the effect is limited to recipes and dose forms where OSRS mechanics apply.
Suggested fix direction (do NOT implement): Apply equipment modifiers only to eligible recipes/dose states, respecting amulet charges, no-extra-XP rules, and the exact secondary-save behavior.

### [AUD-068] Banker Talk-to opens the bank instead of its transcript
Severity: Medium
Status: Open
Category: 5. NPC Interactions / Right-click options (also 6. Dialogues)
Location: `Typescript-RSPS/server/plugins/objects/BankBooths.plugin.js:123-126`; `Typescript-RSPS/server/src/main/typescript/elvarg/plugins/PluginManager.ts:924-939,2693`; `Typescript-RSPS/server/plugins/npcs/NpcDialogues.plugin.js:729-739`; `Typescript-RSPS/server/src/main/typescript/elvarg/net/packet/impl/NPCOptionPacketListener.ts:63-98`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json` -> NPC 1613, option slots 1=`Talk-to`, 3=`Bank`, 4=`Collect`; `READ-ONLY-DB/docs/dialogues/f7d8a82b4ae37cc7.json` -> Banker `standard-dialogue`; `Typescript-RSPS/server/data/definitions/npc-dialogue-index.json` -> NPC 1613 transcript entry.
Description: Banker op1 Talk-to is intercepted by the name-specific bank handler and opens the bank, bypassing the indexed dialogue transcript.
Evidence:
Code currently does: NPC operate dispatch emits native interaction hooks then plugin interaction hooks. `PluginManager` traverses name/ID hooks before generic any-NPC hooks, stopping when handled. BankBooths registers both Banker `Talk-to` and `Bank` to `openBankFromNpc`; this handles Talk-to before generic dialogue dispatch.
osrsreboxed-db says: NPC 1613 distinguishes Talk-to slot 1 from Bank slot 3 and Collect slot 4. The dialogue transcript has separate choices for Bank, Bank PIN, GE collection, and bank-slot purchase.
Impact: Normal Banker Talk-to skips its dialogue choices and opens the bank directly.
Suggested fix direction (do NOT implement): Keep direct bank opening on the DB's Bank option; allow Talk-to to reach the transcript.

### [AUD-069] Barrows repair prompt is registered on Talk-to instead of Repair
Severity: Medium
Status: Open
Category: 5. NPC Interactions / Right-click options (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/items/BarrowsEquipment.plugin.js:166-176,273-276`; `Typescript-RSPS/server/src/main/typescript/elvarg/net/packet/impl/NPCOptionPacketListener.ts:24-25,63-98`; `Typescript-RSPS/server/src/main/typescript/elvarg/plugins/PluginManager.ts:924-939`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json` -> NPC 9157 Aneirin has Repair at slot 4; NPC 4105 Dunstan has only Talk-to; NPC 1358 Tindel Marchant has Talk-to at slot 1 and Give-Sword at slot 3. Both have active dialogue-index entries.
Description: Barrows repair is attached to ordinary Talk-to for Dunstan and Tindel, though neither exposes a Repair option in the authoritative menu; Aneirin's Repair binding is valid.
Evidence:
Code currently does: `repairEquipment` opens and claims the repair prompt. BarrowsEquipment registers `Repair` for Bob and Aneirin but `Talk-to` for Dunstan and Tindel. NPC click dispatch maps click type through `definition.getActions()[clickType - 1]`, so Talk-to invokes repair and expected NPC dialogue is intercepted.
osrsreboxed-db says: Aneirin 9157 exposes Repair slot 4. Dunstan 4105 exposes Talk-to only; Tindel Merchant 1358 exposes Talk-to and Give-Sword, not Repair.
Impact: Talking to Dunstan or Tindel opens a repair prompt instead of their dialogue; no correctly labeled Repair option is available there.
Suggested fix direction (do NOT implement): Bind repair only to verified Repair menu options after confirming which NPC cache records expose it.

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

### [AUD-071] Cooking ignores source-specific burn reductions and Cook's Assistant gate
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Cooking.plugin.js:16-25,65-115,126-144,157-230,238-307`.
DB Reference: `READ-ONLY-DB/docs/items-json/317.json` key 317 -> Raw shrimps; `docs/items-json/315.json` key 315 -> Shrimps; `docs/objects-summary.json` key 114 -> Cooking range. These verify data identities only; burn mechanics are from OSRS Wiki.
Description: Cooking burn outcomes ignore source-specific burn rules, and the special Lumbridge Castle range is usable without its Cook's Assistant quest gate.
Evidence:
Code currently does: Shrimp's COOKABLES row uses `stopBurn: 33`. `startCooking` records the source object for animation/session continuity, but `isSuccess(player, cookable)` has no source-object parameter and uses one constant burn bonus and one stop-burn threshold. The task emits the burn event and applies the result regardless of whether the source is a fire or a range. `handleCook` accepts objects by generic name and no Cook's Assistant completion check is present for object 114.
osrsreboxed-db says: Keys 317 and 315 identify raw/cooked shrimp; object-summary key 114 identifies `Cooking range`. These DB records do not define burn mechanics. OSRS Wiki [Cooking/Burn level](https://oldschool.runescape.wiki/w/Cooking/Burn_level) lists shrimp stop-burn levels 34 on fire, 34 on normal range, and 31 on the Lumbridge Castle range. The [Lumbridge Castle range](https://oldschool.runescape.wiki/w/Cooking_range_(Lumbridge_Castle)) page states Cook's Assistant completion is required to use that range. TSPS uses one stop-burn threshold of 33 for all sources and does not check quest completion.
Impact: Source-specific burn chances and the range's documented quest restriction are bypassed; shrimp succeeds at level 33 on all cooking sources rather than following their distinct OSRS rules.
Suggested fix direction (do NOT implement): Pass the actual cooking source and relevant quest state into the burn calculation; implement each source's verified burn table and gate the special range use.

### [AUD-072] Gem cutting always succeeds and omits failure XP
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Crafting.plugin.js:8-61`.
DB Reference: `READ-ONLY-DB/docs/items-json/1625.json` key 1625 -> Uncut opal; `1609.json` key 1609 -> Opal; `1627.json`/`1611.json` -> uncut/cut jade; `1629.json`/`1613.json` -> uncut/cut red topaz; `1633.json` -> Crushed gem; `1755.json` -> Chisel. These records verify item identities only; cutting rules are from OSRS Wiki.
Description: Reachable semi-precious gem cutting always produces a cut gem and full success XP, with no chance to produce the crushed-gem failure result or award reduced failure XP.
Evidence:
Code currently does: `cutGem` recognizes a chisel plus any gem in the `GEMS` map, checks Crafting level and input inventory, then unconditionally consumes one uncut gem, creates `gem.cut`, and grants full `gem.xp`. No success roll or failure branch exists.
osrsreboxed-db says: The keyed records verify the relevant raw/cut gem, chisel, and crushed gem IDs. The DB does not encode cutting mechanics. OSRS Wiki pages for [uncut opal](https://oldschool.runescape.wiki/w/Uncut_opal), [uncut jade](https://oldschool.runescape.wiki/w/Uncut_jade), and [uncut red topaz](https://oldschool.runescape.wiki/w/Uncut_red_topaz) specify level-dependent failure chance, crushed gem output, and failure XP (3.7/5/6.3 for the three gems). At the configured minimum levels, their charts show success probabilities of 50.39%, 46.48%, and 44.53%, respectively. The source assigns 100% success and 15/20/25 XP.
Impact: Opal, jade, and red-topaz cuts cannot fail in TSPS; failure products are unavailable and experience is over-awarded for cuts that should fail.
Suggested fix direction (do NOT implement): Implement the verified per-gem, per-level success rolls and both success/failure output and XP outcomes.

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


### [AUD-061] Bank custom Withdraw-X quantity is lost on relog
Severity: Medium
Status: Open
Category: 12. Inventory / Banking / Containers (also 15. Interfaces / UI and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/entity/impl/player/Player.ts:156-164,998-1028`; `.../game/model/container/impl/Bank.ts:549-553,594-600,924-933`; persistence `.../game/entity/impl/player/persistence/PlayerSave.ts:113-153,537-634,635-685`; JSON adapter `Typescript-RSPS/server/plugins/persistence/JsonPlayerPersistence.plugin.js:124-134`; SQLite adapter `SqlitePlayerPersistence.plugin.js:177-194`.
DB Reference: `READ-ONLY-DB/docs/items-json/4151.json` key 4151 -> Abyssal whip, non-stackable and noteable, linked noted ID 4152. This verifies the item example only; Withdraw-X retention is specified by OSRS Wiki Bank withdrawals and the archived 2013 Bank update.
Description: The bank's custom Withdraw-X quantity exists only in live Player fields, so relog resets it to zero.
Evidence:
Code currently does: The bank widget handler stores a typed quantity in `Player.bankCustomQuantity`, sends varbit 3960, and passes the field to `Bank.actionAmount`. The field initializes to 0. `PlayerSave` has no matching field, does not copy it in `fromPlayer`, and does not restore it in `applyToPlayer`; JSON and SQLite backends serialize `PlayerSave.fromPlayer`. On next login `Bank.open` publishes the reset value.
osrsreboxed-db says: Item 4151 is an Abyssal whip with `noteable: true` and `linked_id_noted: 4152`; the DB does not encode bank settings. OSRS Bank documentation states that the entered Withdraw-X amount is remembered for subsequent withdrawals.
Impact: Players must re-enter their custom quantity after each login; subsequent use of Withdraw-X no longer uses their remembered amount.
Suggested fix direction (do NOT implement): Include custom Withdraw-X quantity in player-save state and restore a validated default for older saves.
### [AUD-060] Cleaning grimy torstol awards excess Herblore XP
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Herblore.plugin.js:11-23,59-82`; item IDs sourced from `Typescript-RSPS/server/src/main/typescript/elvarg/util/IdEnums.ts` (grimy torstol 219; torstol 269).
DB Reference: `READ-ONLY-DB/docs/items-json/219.json` -> Grimy torstol ID 219; `docs/items-json/269.json` -> Torstol ID 269. The DB confirms identities; cleaning XP and level requirement are live rules confirmed by https://oldschool.runescape.wiki/w/Grimy_torstol.
Description: The reachable Clean action awards 21 Herblore XP for a torstol, 6 more than the current OSRS rule.
Evidence:
Code currently does: `CLEANABLE_HERBS` maps `ItemIds.GRIMY_TORSTOL` to clean item `ItemIds.TORSTOL`, Herblore level 75 and `xp: 21`. The registered first-item-action checks the level, deletes one grimy item, creates the clean item, and calls `addExperiences(Skill.HERBLORE, herb.xp)`, so every successful clean yields 21 XP.
osrsreboxed-db says: DB keys 219 and 269 verify the input/output identities and names, but contain no action XP. The current OSRS Wiki states that cleaning grimy torstol requires Herblore 75 and gives 15 XP; input, output and level are correct in TSPS, but the XP value is 21.
Impact: Each cleaned torstol over-awards 6 Herblore XP, accelerating progression and changing expected XP totals for players cleaning the herb.
Suggested fix direction (do NOT implement): Correct the configured cleaning reward; audit the remaining Herblore actions separately.

### [AUD-078] Thieving silk, tea, and fur stalls return the wrong rewards
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Thieving.plugin.js:10-16,31-61,64-74`; runtime IDs in `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts` (`SILK`, `GREY_WOLF_FUR`, `CUP_OF_TEA`, `COINS`).
DB Reference: `READ-ONLY-DB/docs/objects-summary.json` keys 629 (Silk stall), 632 (Fur stall), 635 (Tea stall), plus 11729/11732 for corresponding Silk/Fur variants; `READ-ONLY-DB/docs/items-json/950.json` Silk, `958.json` Grey wolf fur, `712.json` Cup of tea, and `1978.json` obtainable Cup of tea.
Description: Three reachable stalls award coins where current OSRS stall rules award a specific item. Fur stall also grants obsolete Thieving XP.
Evidence:
Code currently does: The registered common handler checks configured level/inventory and adds a configured random reward and XP. Silk stall is configured as 24 XP and coins up to 60; Tea stall as 16 XP and coins up to 20; Fur stall as level 35, 36 XP, and coins up to 100. The shared reward path returns 1..max amount of the configured item on a successful action. Active object click dispatch reaches these named handlers.
osrsreboxed-db says: Object summary keys identify the three stall objects and item keys identify their candidate outputs; the DB does not encode stall reward/XP rules. Current OSRS Wiki pages for [Silk stall](https://oldschool.runescape.wiki/w/Silk_stall), [Tea stall](https://oldschool.runescape.wiki/w/Tea_stall), and [Fur stall](https://oldschool.runescape.wiki/w/Fur_stall) document one Silk from Silk stall, Cup of tea from Tea stall, and Grey wolf fur from Fur stall. Fur stall requires level 35; its XP increased from 36 to 45 on 8 May 2024. Runtime item 712 is explicitly marked untradeable/unobtainable while 1978 is the obtainable Cup of tea; finding only asserts that handler returns coins, not which of these two IDs the Tea stall should use.
Impact: Successful Silk/Tea/Fur stall actions return coins instead of their respective documented item rewards. Fur stall additionally under-awards 9 Thieving XP per success against current rules.
Suggested fix direction (do NOT implement): Correct the stall reward IDs/quantities and update Fur stall XP against current rule data; verify the Tea stall's intended cache item ID before assigning its replacement.

### [AUD-079] Safari cache manifest treats retained dat2 parts as missing cache data
Severity: Medium
Status: Open
Category: 20. Client-specific issues (also 13. Client ↔ Server Protocol / Packets and 15. Interfaces / UI)
Location: `Typescript-RSPS/client/common/utils/CacheManifest.ts:84-120`; `client/game/Caches.ts:17-19,120-156,281-298`; `client/rs/cache/CacheFiles.ts:509-549,750-809,939-985`; `client/game/OsrsClientApp.tsx:272-290,393-401`.
DB Reference: None. The READ-ONLY-DB has no browser CacheStorage/manifest contract; this is an internal TSPS client persistence-path finding, not a reference-database mismatch.
Description: On Safari's legacy full-cache path, the app persists resumable dat2 parts but omits the assembled dat2 CacheStorage object. The next startup's manifest checker fails to recognize the part manifest as coverage for dat2 and deletes those retained parts before loading.
Evidence:
Code currently does: `Caches.shouldSkipDat2MainCacheWrite()` returns the Safari flag and passes it to `CacheFiles.fetchDat2()`. Its `fetchCachedFile()` skips the final full-file write but keeps incremental `/main_file_cache.dat2/part/` chunks and writes `/part/manifest`; the returned assembled file is still included in `CacheFiles.getFileNames()`. `isCacheManifestComplete()` adds basenames for cached requests and specially maps only `/main_file_cache.dat2/range/manifest` to expected `main_file_cache.dat2`; the retained `/part/manifest` contributes only basename `manifest`. `OsrsClientApp` interprets incomplete as invalid, removes the manifest and deletes the entire cache before `loadCacheFilesAuto()`.
osrsreboxed-db says: No DB record or schema covers CacheStorage. This finding is supported by TSPS source only. Existing `cache-manifest-sparse.test.ts:4-17` exercises range/manifest and a full dat2 entry but not the retained Safari part-manifest case.
Impact: When Safari uses the legacy dat2 download path, subsequent app startup discards resumable chunks and can require the large dat2 file to be downloaded again.
Suggested fix direction (do NOT implement): Treat the retained-part manifest as a valid expected dat2 representation, or avoid recording dat2 as fully persisted when only resumable fragments exist; preserve an explicit cache-state invariant.


### [NEW-CRYSTALBOW-001] Charged crystal-bow bonuses differ from authoritative item values
Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 9. Combat Formulas, 10. Equipment Bonus Calculation, 19. Data consistency bugs, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/ranged/CrystalBow.ts:3-17,75-82`; `.../game/model/equipment/BonusManager.ts:60-72`; ranged accuracy consumer `.../game/content/combat/formula/AccuracyFormulasDpsCalc.ts:499-510`; max-hit consumer `.../game/content/combat/formula/DamageFormulas.ts:281-288`.
DB Reference: `READ-ONLY-DB/docs/items-json/4214.json`–`4223.json` (normal charged stages) and `11749.json`–`11758.json` (imbued stages), equipment fields `attack_ranged` / `ranged_strength`.
Description: The active bonus override for both normal and imbued legacy crystal-bow charge stages diverges from authoritative item records.
Evidence:
Code currently does: `CRYSTAL_BOW_STAGE_ORDER` maps ordinary and imbued items to shared indices; attack overrides are `[100,100,96,92,88,84,80,76,72,68]`, strength overrides `[78,78,76,74,72,70,68,66,64,62]`. `BonusManager` adjusts the equipped item's definition bonus to these override values; ranged accuracy and ranged max-hit calculations consume them.
osrsreboxed-db says: Normal IDs 4214–4223 have attack `[100,96,92,88,84,80,76,72,68,64]` and strength `[70,68,66,64,62,60,58,56,54,52]`. Imbued IDs 11749–11758 each have attack 100 and strength 70. Thus every normal and imbued stage has inflated strength; normal 9/10–1/10 attack is 4 high; imbued 8/10–1/10 attack is below the DB value. The exact fields are `items-json/<id>.json:38,45`.
Impact: Equipping these mapped stages changes real ranged accuracy and damage rolls relative to the corresponding authoritative item stats; the override inflates strength on all stages and yields attack discrepancies on reduced-charge stages.
Suggested fix direction (do NOT implement): Align both stage tables with the appropriate normal and imbued item records while preserving the stage-to-ID mapping and charge progression.

### [NEW-SMITH-009] Javelin-tip products are missing from the anvil catalog
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:34-42,201-342,344-379,814-835,927-931`.
DB Reference: `READ-ONLY-DB/docs/items-json/19570.json` Bronze javelin tips; `19572.json` Iron; `19574.json` Steel; `19576.json` Mithril; `19578.json` Adamant; `19580.json` Rune. Each exact record identifies a distinct, stackable javelin-tip item.
Description: The active anvil catalog has no javelin-tip product for the six metal tiers that OSRS lists as smithable.
Evidence:
Code currently does: `SMITHING_COMPONENT_BY_PRODUCT` has no javelin-tip component; `SMITHABLE_EQUIPMENT_DATA` has no such product rows. The anvil product handler derives supported buttons and outputs only from those structures, so these outputs have no active anvil action.
osrsreboxed-db says: The keyed item records identify the six matching output items. The OSRS Wiki [Javelin tip Smithing table](https://oldschool.runescape.wiki/w/Javelin_tip#Smithing_table) lists bronze, iron, steel, mithril, adamant and rune tips as Smithing products, five tips per bar, with levels 6/21/36/56/76/91 and XP 12.5/25/37.5/50/62.5/75 per bar. Dragon tips are drop-only and are not asserted as a missing recipe.
Impact: Players cannot use the active anvil catalog to smith any of the six documented metal javelin-tip products.
Suggested fix direction (do NOT implement): Add the verified tip outputs, quantities, levels and XP to the anvil data and route them through the product interface.

### [NEW-SMITH-010] Sailing-era lead and cupronickel bars are absent from smelting
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:126-199,381-393,420-444,849-869,896-919`.
DB Reference: `READ-ONLY-DB/docs/items-json/31716.json` Lead ore; `31719.json` Nickel ore; `436.json` Copper ore; `32889.json` Lead bar; `32892.json` Cupronickel bar.
Description: The active furnace recipe list omits both Sailing-era metal bars and their ore inputs.
Evidence:
Code currently does: `SMELTING_RECIPES` contains eight bar recipes and no Lead or Cupronickel recipe. The furnace menu, skill-multi dispatch and bot smelting exports are derived from that array; direct ore-on-furnace lookup is derived from the same recipe set. The server plugin search found no alternate Lead/Cupronickel smelting handler.
osrsreboxed-db says: The keyed records confirm the lead ore, nickel ore, copper ore and two corresponding bar identities. OSRS Wiki [Lead bar](https://oldschool.runescape.wiki/w/Lead_bar) specifies Smithing 25, two lead ore and 15.5 XP; [Cupronickel bar](https://oldschool.runescape.wiki/w/Cupronickel_bar) specifies level 74, two copper ore plus one nickel ore and 42 XP.
Impact: The active Smithing furnace routes cannot produce either bar from its corresponding ores, blocking the ordinary smelting step for these Sailing materials.
Suggested fix direction (do NOT implement): Add the verified ore recipes and preserve their requirements/rewards in the menu and direct-use routes.

### [NEW-SMITH-011] Sailing cannonball products and upgrades have no crafting route
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:201-342,344-385,498-529,814-869,927-934`; server-wide plugin search for Sailing cannonball item IDs/names.
DB Reference: `READ-ONLY-DB/docs/items-json/31906.json` Bronze cannonball; `31908.json` Iron; `31910.json` Mithril; `31912.json` Adamant; `31914.json` Rune; `31918.json` Bronze chainshot; `31932.json` Bronze incendiary. Corresponding tier-family IDs are 31906–31914 (even IDs) and 31918–31930 / 31932–31942 (even IDs).
Description: The active Smithing and item-crafting plugin paths do not implement the Sailing cannonball families recorded in the item DB; the only cannonball row in the core anvil list is the legacy Steel cannonball.
Evidence:
Code currently does: The core anvil catalog has one `Cannon ball` row for item ID 2; it has no recipe rows or active plugin handlers referencing the Sailing cannonball IDs, chainshot, or incendiary variants. A server-plugin search for those output IDs/names found no crafting implementation outside that legacy row. The separate DB item records identify the Sailing products.
osrsreboxed-db says: The cited records identify the new Bronze/Iron/Mithril/Adamant/Rune, chainshot and incendiary output items. The current OSRS Wiki [Cannonball](https://oldschool.runescape.wiki/w/Cannonball) states Smithing of the new cannonball tiers requires Dwarf Cannon; chainshot is made two at a time from two cannonballs and a chain, and incendiary balls two at a time from two cannonballs and ten rubium splinters. Dragon cannonballs are drop-only, so their absence is not claimed as a recipe gap.
Impact: Players cannot craft the documented Sailing cannonball types or their chainshot/incendiary upgrades through the active server plugin paths; those DB-defined items require another source such as drops/shops.
Suggested fix direction (do NOT implement): Implement the documented tiered cannonball and upgrade recipes with their quest, material, output-quantity and timing conditions; keep dragon cannonballs drop-only.

### [NEW-SMITH-012] Steel cannonball anvil row has no button dispatch mapping
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:34-49,271-272,344-368,814-835,927-931`.
DB Reference: `READ-ONLY-DB/docs/items-json/2.json` key 2 -> Steel cannonball.
Description: The steel cannonball row is stored in the catalog but its product name has no component entry, so its interface button is excluded from the registered dispatch set.
Evidence:
Code currently does: The steel row is named `Cannon ball`, while `SMITHING_COMPONENT_BY_PRODUCT` has no `Cannon ball` key or component 28. `SMITHING_BUTTON_IDS` is generated only from that component map, and `handleSmithingInterfaceAction` resolves clicked components through the inverse map before finding a catalog entry. Therefore a click on the cache product component cannot reach `startSmithingSession` for this row.
osrsreboxed-db says: Item key 2 identifies the Steel cannonball output. The OSRS Wiki [Cannonball](https://oldschool.runescape.wiki/w/Cannonball) Smithing table lists steel cannonballs at Smithing 35, subject to the Dwarf Cannon quest requirement.
Impact: The steel cannonball entry is not craftable through this active anvil interface despite its presence in the per-bar catalog; the currently missing quest check for that row is not an active bypass until dispatch is repaired.
Suggested fix direction (do NOT implement): Add the correct cache component mapping for the product name and exercise the resulting action through the interface dispatch.
### [NEW-SMITH-013] Legends' Quest gold bowl fabrication skips its anvil success/failure rules
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/quests/quests/LegendsQuest.Quest.js:601-620,1222-1231`.
DB Reference: `READ-ONLY-DB/docs/items-json/720.json` -> Sketch; `2357.json` -> Gold bar; `721.json` -> Gold bowl.
Description: Gold-bowl fabrication is implemented as Sketch + gold bar, rather than the documented use-on-anvil interaction, and every accepted attempt succeeds.
Evidence:
Code currently does: `handleItemOnItem` intercepts Sketch + Gold bar and calls `smithGoldenBowl`. It requires the Sketch, level 50 Smithing, a hammer, and two gold bars; then always consumes both bars and grants one bowl. The handler does not use an anvil or implement the documented roll/failure outcomes.
osrsreboxed-db says: Item keys 720, 2357 and 721 identify Sketch, Gold bar and Gold bowl; item JSON does not contain recipe mechanics. OSRS Wiki [Gold bowl](https://oldschool.runescape.wiki/w/Gold_bowl) says to use two bars on an anvil while holding the sketch, with partial Legends' Quest completion and level 50 Smithing. Success grants 30 XP; failure consumes one bar and grants no XP, with a 135/256 chance to consume a second. After quest completion, the sketch is optional and making a bowl without it can fail.
Impact: The only audited fabrication route does not match the documented action or failure/material-loss behavior, and always consumes two bars to produce a bowl.
Suggested fix direction (do NOT implement): Route bowl fabrication through the documented anvil interaction and implement quest-stage, sketch, success/failure, material-loss, and XP rules.

### [NEW-SMITH-014] Barbarian spear and hasta recipes are absent from the active routes
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:201-342,498-529,849-869,927-933`; `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:1172-1183,9955-9965`.
DB Reference: `READ-ONLY-DB/docs/items-json/1237.json` Bronze spear; `1239.json` Iron; `1241.json` Steel; `1243.json` Mithril; `1245.json` Adamant; `1247.json` Rune; `11367.json` Bronze hasta; `11369.json` Iron; `11371.json` Steel; `11373.json` Mithril; `11375.json` Adamant; `11377.json` Rune.
Description: The standard anvil catalog does not contain spear/hasta outputs, and the server plugin search found no Barbarian Smithing crafting route.
Evidence:
Code currently does: Supported anvil buttons and smithable products are derived from `SMITHING_COMPONENT_BY_PRODUCT` and `SMITHABLE_EQUIPMENT_DATA`; neither includes Spear or Hasta. The anvil item-on-object handler routes bar IDs present in the standard smithable map. Server-wide plugin search found quest spear usage for Tai Bwo Wannai Trio, but no handler consuming corresponding bars/logs and producing spear/hasta items.
osrsreboxed-db says: The cited item records identify the six metal spear and six hasta output items. OSRS Wiki [Barbarian Training/Smithing](https://oldschool.runescape.wiki/w/Barbarian_Training#Smithing) documents making these on the Barbarian anvil with a metal bar, corresponding logs, hammer, level 5 Smithing and Tai Bwo Wannai Trio. It gives 25/50/75/100/125/150 XP and levels 5/20/35/55/75/90 for bronze through rune. Spear creation also requires Barbarian Smithing completion.
Impact: The active routes do not let players craft any documented metal spear or hasta using the Barbarian Smithing method.
Suggested fix direction (do NOT implement): Add the separate Barbarian anvil route with appropriate logs, bars, levels, XP, quest/miniquest gates, and outputs.

### [NEW-SMITH-015] Standard anvil catalog omits regular keel parts
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:34-42,201-342,498-529,814-835,927-931`; `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:29666-29686`.
DB Reference: `READ-ONLY-DB/docs/items-json/31999.json` Bronze keel parts; `32002.json` Iron; `32005.json` Steel; `32008.json` Mithril; `32011.json` Adamant; `32014.json` Rune; `32017.json` Dragon keel parts.
Description: The standard anvil catalog omits all regular keel-parts products despite keyed outputs and documented anvil recipes.
Evidence:
Code currently does: The product-name/button map and `SMITHABLE_EQUIPMENT_DATA` contain no Keel parts entry. Interface actions resolve only mapped product names present in the per-bar smithable rows. A server-wide plugin search found no active keel-parts crafting route.
osrsreboxed-db says: The cited records identify regular bronze through dragon keel parts. OSRS Wiki [Keel parts](https://oldschool.runescape.wiki/w/Keel_parts) documents regular keel parts made at any anvil using five corresponding bars (bronze through rune, levels 10/22/38/56/74/86); Dragon keel parts use two dragon metal sheets at level 94. Making them requires Pandemonium completion. This finding covers regular keel parts only.
Impact: The active routes cannot produce the documented regular Sailing keel components from their recipe materials.
Suggested fix direction (do NOT implement): Add the documented per-tier recipes and quest/material conditions, including the distinct Dragon metal-sheet input.

### [NEW-SMITH-016] Large keel parts have no assembly route
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:34-42,201-342,498-529,849-869,927-933`; server-wide active-plugin search for large keel output IDs.
DB Reference: `READ-ONLY-DB/docs/items-json/32020.json` Large bronze keel parts; `32023.json` Large iron; `32026.json` Large steel; `32029.json` Large mithril; `32032.json` Large adamant; `32035.json` Large rune; `32038.json` Large dragon keel parts.
Description: No active crafting handler assembles the DB-defined large keel parts from their corresponding regular keel parts.
Evidence:
Code currently does: The standard smithing product list has no large-keel outputs; a server-wide plugin search found no active crafting handler referencing these output IDs. Existing crafting handlers reviewed are the furnace and mapped anvil routes, neither of which handles the conversion.
osrsreboxed-db says: The cited keys identify the large keel part outputs. OSRS Wiki [Keel parts](https://oldschool.runescape.wiki/w/Keel_parts) states large keel parts are created using five corresponding regular keel parts and are used for Sloop construction.
Impact: Players cannot create the documented large keel parts from regular parts through an active server crafting route.
Suggested fix direction (do NOT implement): Add the five-to-one conversion route for each matching tier and output ID.

### [NEW-SMITH-017] Smithing action XP is product-independent
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 16. Hardcoded values vs DB-driven data and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:498-527`.
DB Reference: `READ-ONLY-DB/docs/items-json/31999.json` Bronze keel parts; `32002.json` Iron keel parts; `32005.json` Steel keel parts; `32017.json` Dragon keel parts.
Description: The common anvil success method awards a fixed 10 Smithing XP independent of product and material count; if keel products are routed through it unchanged, this will not encode their product-specific reward.
Evidence:
Code currently does: `performSmithAction` calls `addExperiences(Skill.SMITHING, 10)` for every smithable product, without reading barsRequired or itemId.
osrsreboxed-db says: The keyed records identify distinct Sailing outputs, but item JSON does not store recipe XP. OSRS Wiki [Smithing](https://oldschool.runescape.wiki/w/Smithing) states Smithing XP is generally computed from XP per bar multiplied by bars used, with exceptions; the [Keel parts](https://oldschool.runescape.wiki/w/Keel_parts) article lists their distinct multi-bar recipes. Exact XP values for each keel recipe were not established in this bounded check. NEW-SMITH-005 independently documents current catalog XP under-awarding against verified products.
Impact: Any keel recipe added to the existing action path without a reward-specific rule would receive the same flat 10 XP; current keel recipe absence is documented separately in NEW-SMITH-015/016.
Suggested fix direction (do NOT implement): Represent and award verified recipe XP per smithable product; establish exact keel XP before adding the recipes.

### [NEW-SMITH-018] Bronze wire is missing from the anvil catalog
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:34-42,201-342,814-835,927-931`.
DB Reference: `READ-ONLY-DB/docs/items-json/1794.json` -> Bronze wire.
Description: The active anvil catalog omits Bronze wire, a Smithing product.
Evidence:
Code currently does: Neither `SMITHING_COMPONENT_BY_PRODUCT` nor `SMITHABLE_EQUIPMENT_DATA` includes Wire; the interface button set and handler derive supported actions from these maps.
osrsreboxed-db says: Item key 1794 identifies Bronze wire. OSRS Wiki [Smithing](https://oldschool.runescape.wiki/w/Smithing) lists Bronze wire at Smithing 4, one bar, 12.5 XP. No omission for other metal wire recipes is claimed.
Impact: Players cannot smith Bronze wire through the active anvil interface.
Suggested fix direction (do NOT implement): Add the verified Bronze wire product and its cache-interface mapping.

### [NEW-SMITH-019] Gold bowl creation awards no Smithing XP
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/quests/quests/LegendsQuest.Quest.js:601-620`.
DB Reference: `READ-ONLY-DB/docs/items-json/721.json` -> Gold bowl; `2357.json` -> Gold bar; `720.json` -> Sketch.
Description: A successful Gold bowl creation grants no Smithing XP, despite the documented 30-XP success reward.
Evidence:
Code currently does: `smithGoldenBowl` consumes two bars and grants a bowl/message, with no Smithing XP call.
osrsreboxed-db says: The keys identify bowl, bar and sketch; recipe XP is not part of item JSON. OSRS Wiki [Gold bowl](https://oldschool.runescape.wiki/w/Gold_bowl) specifies 30 Smithing XP for success and no XP for failure.
Impact: Each successful bowl creation gives zero instead of the documented 30 Smithing XP; the interaction/failure behavior is recorded separately in NEW-SMITH-013.
Suggested fix direction (do NOT implement): Award the documented Smithing XP only on success and keep failure XP at zero.
### [NEW-SMITH-020] Blast Furnace ore types are missing for Sailing bars
Severity: High
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features, 19. Data consistency bugs, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/minigames/BlastFurnace.plugin.js:84-114,329-358,373-393`; source recipe catalog `Typescript-RSPS/server/plugins/skills/Smithing.plugin.js:126-199`.
DB Reference: `READ-ONLY-DB/docs/items-json/31716.json` -> Lead ore (31716); `31719.json` -> Nickel ore (31719); `32889.json` -> Lead bar (32889); `32892.json` -> Cupronickel bar (32892). Server identifiers: `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:29392-29397,30554-30559`.
Description: The Blast Furnace accepts neither Lead nor Nickel ore despite both having Blast Furnace Wiki products, and its standard recipe-derived product list does not include Cupronickel. The ordinary-furnace absence of Lead/Cupronickel is already documented in NEW-SMITH-010; this finding is limited to Blast Furnace-specific support.
Evidence:
Code currently does: `BlastFurnace.init` defines `ORES` for Coal, Tin, Copper, Iron, Silver, Gold, Mithril, Adamantite, and Runite, omitting Lead and Nickel. `BARS` is derived only from `SMELTING_RECIPES`, which contains eight standard recipes and neither Lead nor Cupronickel, then filtered through a `barVarbits` map that also contains only those eight standard products. Thus the Blast Furnace cannot accept the two Sailing ores or produce either Sailing bar. The same plugin does implement the minigame conveyor, furnace, and dispenser flow for its mapped ores/products.
osrsreboxed-db says: The keyed records identify Lead ore, Nickel ore, Lead bar, and Cupronickel bar; item JSON does not encode furnace recipes. OSRS Wiki [Lead bar](https://oldschool.runescape.wiki/w/Lead_bar) lists Lead bar creation at level 25 from two Lead ore and includes Blast Furnace as a supported facility. [Cupronickel bar](https://oldschool.runescape.wiki/w/Cupronickel_bar) lists level 74, two Copper ore plus one Nickel ore, and includes Blast Furnace as a supported facility. The Wiki's Blast Furnace documentation states half coal is used; these recipes require no coal, so that rule does not change their inputs. OSRS Wiki mechanics, not DB fields, establish these facility rules.
Impact: Players cannot smelt Lead or Cupronickel bars at TSPS's active Blast Furnace despite the documented facility support, independently of the missing standard-furnace recipes noted in NEW-SMITH-010.
Suggested fix direction (do NOT implement): Extend the Blast Furnace ore/bar/varbit mapping and compatible recipe flow for only the documented supported products, preserving per-ore limits, level checks, XP, and dispenser output.

### [NEW-COOKING-001] Raw bear meat has no cooking action
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features, 19. Data consistency bugs, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/skills/Cooking.plugin.js:16-63,238-280,291-308`; item identifier `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:2049-2060`.
DB Reference: `READ-ONLY-DB/docs/items-json/2136.json` key 2136 -> Raw bear meat; `docs/items-json/2142.json` key 2142 -> Cooked meat; `docs/items-json/2146.json` key 2146 -> Burnt meat. These are item identities; the DB does not encode Cooking recipes.
Description: Raw bear meat is absent from the active Cooking input map, so neither item-on-cooking-object nor range cooking can process it.
Evidence:
Code currently does: `COOKABLES` contains raw beef (2132) and raw rat meat (2134), both yielding cooked meat (2142), but has no row for raw bear meat (2136). `COOKABLE_BY_RAW` is built only from that table; `handleCook` returns when the raw ID has no map entry, and `handleRangeCook` selects only inventory items whose IDs are in the same map. A server-plugin search found no other active raw-bear cooking handler; the Druidic Ritual route handles it only as quest meat for enchanting.
osrsreboxed-db says: Keys 2136, 2142, and 2146 identify Raw bear meat, Cooked meat, and Burnt meat. The DB does not define recipe rules. The OSRS Wiki [Raw bear meat](https://oldschool.runescape.wiki/w/Raw_bear_meat) states that it cooks at level 1 for 30 Cooking XP on success and produces cooked meat (or burnt meat on failure).
Impact: Players cannot cook raw bear meat or obtain its cooked/burnt outcomes through the active Cooking plugin.
Suggested fix direction (do NOT implement): Add the verified raw-to-cooked/burnt entry and cooking parameters to the shared Cooking table, preserving source-specific burn handling.

### [NEW-SKILL-XP-001] Skill XP gain ceiling exceeds OSRS per-skill maximum
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/skill/SkillManager.ts:29,111-119,150-165`; client clamp `client/rs/skill/skills.ts:88-90,111-119`.
DB Reference: Not encoded in the inspected DB schema; this is an OSRS XP rule. Official sources: [Experience](https://oldschool.runescape.wiki/w/Experience), [200 million experience](https://oldschool.runescape.wiki/w/200_million_experience).
Description: Shared SkillManager gain/set sanitization permits one billion XP per skill, five times the OSRS cap of 200 million.
Evidence:
Code currently does: `MAX_EXPERIENCE` is 1,000,000,000. `sanitizeExperienceValue` clamps only at that value, and `addExperience` applies the same ceiling, so shared active XP award paths can store XP above 200m. The client skill XP helper independently clamps virtual-level calculations to 200,000,000.
osrsreboxed-db says: The database records inspected do not define XP caps. Official OSRS Experience/200 million experience rules set the per-skill maximum to 200,000,000; virtual level 126 is 188,884,740 XP.
Impact: Skills can exceed the OSRS XP cap and server-visible XP diverges from the client’s XP/virtual-level handling.
Suggested fix direction (do NOT implement): Align the shared server XP ceiling and every XP-loading/set path with the verified per-skill cap.

### [NEW-SKILL-XP-002] Hitpoints baseline starts 30 XP above OSRS level 10
Severity: Low
Status: Open
Category: 11. Skills & Experience (also 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/skill/SkillManager.ts:32,66-67,351-383`; invocation `.../game/entity/impl/player/Player.ts:580-582`; defaults `server/plugins/persistence/JsonPlayerPersistence.plugin.js:324-334` and `SqlitePlayerPersistence.plugin.js:462-472`.
DB Reference: Not defined by the inspected DB; official OSRS source: [Hitpoints](https://oldschool.runescape.wiki/w/Hitpoints) and level XP threshold (1,154 XP).
Description: New characters and baseline repair use 1,184 Hitpoints XP, not the OSRS level-10 threshold of 1,154.
Evidence:
Code currently does: The SkillManager constructor sets Hitpoints level 10 and XP 1,184. `ensureCombatBaseline` takes the level-10 threshold, then raises it to at least 1,184 and applies it; Player setup/login invokes this baseline path. JSON and SQLite new-save defaults also use 1,184.
osrsreboxed-db says: No XP baseline is specified in the inspected DB. Official OSRS Hitpoints/Experience sources identify 1,154 XP as level 10 and the starting Hitpoints XP.
Impact: Fresh or repaired player saves receive 30 extra Hitpoints XP above the OSRS starting baseline.
Suggested fix direction (do NOT implement): Use the authoritative 1,154-XP level-10 baseline consistently in construction, save defaults and baseline repair.

### [NEW-SKILL-XP-003] Skills packet sends real base level as virtual level
Severity: Low
Status: Open
Category: 13. Client ↔ Server Protocol / Packets (also 11. Skills & Experience)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/net/packet/PacketSender.ts:1107-1118`; encoder `server/src/main/typescript/elvarg/net/protocol/ClientProtocol.ts:1460-1475`; client XP virtual-level logic `client/rs/skill/skills.ts:88-120`.
DB Reference: Not represented in the inspected DB. Official virtual-level rule: [Experience — Virtual levels](https://oldschool.runescape.wiki/w/Experience#Virtual_levels).
Description: Server skills packet serializes the real base level in both `baseLevel` and `virtualLevel`, even when XP qualifies for a virtual level above 99.
Evidence:
Code currently does: `PacketSender.skillView` sets `baseLevel = manager.getMaxLevel(skill)` and then assigns `virtualLevel: baseLevel`. `ClientProtocol.encodeSkills` writes those as distinct fields; the client sanitizer preserves the received virtual level. At 188,884,740 XP (virtual level 126), the sent virtual-level field remains 99.
osrsreboxed-db says: No virtual-level field/rule exists in the inspected DB. Official OSRS Experience documents virtual levels through 126 at 188,884,740 XP. The client also has a separate XP-derived helper capped at 126.
Impact: Packet consumers receive a virtual level equal to the real level rather than the XP-derived virtual level; current rendered UI impact was not established.
Suggested fix direction (do NOT implement): Compute the virtual field from authoritative XP thresholds while retaining the separate real base-level field.

### [NEW-ITEM-002] Hallowfell gameplay definition omits DB bonuses, requirement and two-handed flag
Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:27096`; loader `server/plugins/items/ItemDefinitionLoader.plugin.js:126-163`; runtime item cache hydration `server/src/main/typescript/elvarg/game/definition/ItemDefinition.ts:96-117`; consumers `server/src/main/typescript/elvarg/net/packet/impl/EquipPacketListener.ts:119-168` and `server/src/main/typescript/elvarg/game/model/equipment/BonusManager.ts:39-50`.
DB Reference: `READ-ONLY-DB/docs/items-json/34027.json` -> Hallowfell, equipment lines 33-55: slash attack +117, crush attack +25, melee strength +110, prayer +4, slot 2h, Attack requirement 75, attack speed 6, weapon type 2h_sword.
Description: Active Hallowfell gameplay row defines a two-handed-sword interface and animations but omits its combat bonuses, Attack 75 requirement, and two-handed equipment flag.
Evidence:
Code currently does: The active row at ID 34027 supplies name, weapon equipment type, interface and animations only. `ItemDefinitionLoader` applies optional fields only when present; cache hydration supplies identity, value, weight, attack speed and equipment slot but not DB equipment bonuses or requirements. `BonusManager` sums definition bonuses; equip checks requirements only when present and removes a shield only when `doubleHanded` is true.
osrsreboxed-db says: Key 34027 identifies Hallowfell, a 2h sword with the listed attack/strength/prayer bonuses and Attack 75 requirement. The DB does not specify the server’s `doubleHanded` boolean; the two-handed weapon type/slot establish the equipment behavior expected here.
Impact: Hallowfell contributes no listed bonuses, can be equipped without Attack 75, and does not trigger the two-handed shield-removal branch in the inspected definition path.
Suggested fix direction (do NOT implement): Add the keyed equipment bonuses and requirement to the active gameplay definition and ensure the item's two-handed equipment behavior is represented in the runtime definition.

### [NEW-HERBLORE-001] Huasca cleaning and unfinished-potion routes are absent
Severity: Medium
Status: Open
Category: 11. Skills & Experience (also 18. Missing modern OSRS features and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/plugins/skills/Herblore.plugin.js:11-37,59-82,85-115`; item constants `server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:27910-27918`.
DB Reference: `READ-ONLY-DB/docs/items-json/30094.json` -> Grimy huasca; `30097.json` -> Huasca; `30100.json` -> Huasca potion (unf); item 227 -> vial of water.
Description: The active Herblore plugin has no grimy-huasca cleaning row and no huasca-to-unfinished-potion row.
Evidence:
Code currently does: The `CLEANABLE_HERBS` map drives the item-first-action handler and contains no ID 30094. The `UNFINISHED_POTIONS` map drives the vial-of-water item-on-item handler and contains no ID 30097. These handlers return without processing an absent map entry; no alternate Herblore transition was found in the bounded repository search.
osrsreboxed-db says: The keyed records confirm IDs 30094/30097/30100 are Grimy huasca, Huasca and Huasca potion (unf); item records establish identities, not action mechanics. OSRS Wiki [Huasca](https://oldschool.runescape.wiki/w/Huasca) documents cleaning at level 58 for 11.8 XP and making its unfinished potion at level 58 using a vial of water.
Impact: Players cannot clean Grimy huasca or create Huasca potion (unf) through the active Herblore handlers.
Suggested fix direction (do NOT implement): Add both verified transitions to the active maps with the documented level, XP and ingredient behavior.

### [NEW-WEAPON-STYLE-001] Bulwark Block is configured as an accurate Crush attack
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 1. Items & Equipment and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-combat-styles.json:152-153`; style selection `server/src/main/typescript/elvarg/game/content/combat/WeaponInterfaceManager.ts:22-32`; XP consumer `server/src/main/typescript/elvarg/game/content/combat/FightStyle.ts:4-8`; accuracy consumer `server/src/main/typescript/elvarg/game/content/combat/formula/AccuracyFormulasDpsCalc.ts:331-337`.
DB Reference: `READ-ONLY-DB/docs/items-json/21015.json` -> Dinh's bulwark; `28682.json` -> Dinh's blazing bulwark. Both keyed weapon stance records give Pummel active crush/accurate/Attack/+3, but Block has null attack type/style/XP/boost values; shared source `READ-ONLY-DB/data/items/weapon-stances.json:78+` agrees.
Description: Runtime gives the visible Bulwark Block child slot the same accurate Crush attack configuration as Pummel instead of the authoritative non-attacking Block stance.
Evidence:
Code currently does: `BULWARK_BLOCK` child 3 has `style: ACCURATE` and `attackType: CRUSH`; the style button selects this FightType, melee Accurate awards Attack XP, and the combat formula applies the accurate-style attack bonus. DB rows for both Bulwark variants leave Block's combat fields null; official OSRS Wiki Dinh's bulwark page states Block disables attacking.
osrsreboxed-db says: The cited keyed records identify the variants, five-tick weapon speed, and Pummel/Block stance fields. DB Block has null attack type/style/experience/boosts; the explicit loss-of-attack behavior is confirmed by https://oldschool.runescape.wiki/w/Dinh%27s_bulwark.
Impact: Selecting Block leaves the player with an active accurate Crush attack and Attack XP path instead of disabling attacks.
Suggested fix direction (do NOT implement): Represent the Block slot as non-attacking and verify selection, attack eligibility, XP and passive behavior together.

### [NEW-COMBAT-003] Magic shortbow (i) Snapshot drains regular-bow special energy
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 1. Items & Equipment and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/plugins/combat/specials/MagicShortbow.SpecialAttack.js:5,22-25,41-50`.
DB Reference: `READ-ONLY-DB/docs/items-json/861.json` -> regular Magic shortbow; `12788.json` -> Magic shortbow (i); `20558.json` -> duplicate regular Magic shortbow. The records confirm exact item identities and equipment values; cost is a game rule from OSRS Wiki.
Description: All three shortbow IDs share a 55% special-energy drain, although the imbued shortbow's Snapshot costs 50%.
Evidence:
Code currently does: `DRAIN = 55` is passed to `CombatSpecial.drain` for the registered attack; one registration covers IDs 861, 12788 and 20558 without item-specific cost. The handler itself comments that the (i) variant drains 50%.
osrsreboxed-db says: The keyed item records identify the three variants (imbued ID 12788 has +75 Ranged attack; regular IDs 861/20558 have +69). DB does not encode special costs. OSRS Wiki [Magic shortbow (i) special attack](https://oldschool.runescape.wiki/w/Magic_shortbow_(i)#Special_attack) specifies 50%, while the regular bow's [Snapshot](https://oldschool.runescape.wiki/w/Magic_shortbow#Special_attack) costs 55%.
Impact: Snapshot with the imbued bow consumes five percentage points more special energy than the documented cost.
Suggested fix direction (do NOT implement): Apply the documented energy cost per registered bow variant.

### [NEW-COMBAT-004] Snapshot uses generic maximum-hit formula instead of its standalone formula
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features)
Location: `Typescript-RSPS/server/plugins/combat/specials/MagicShortbow.SpecialAttack.js:38-41,42-57`; ranged calculation `server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:165-260` and `server/src/main/typescript/elvarg/game/content/combat/formula/DamageFormulas.ts:229-293`.
DB Reference: `READ-ONLY-DB/docs/items-json/861.json`, `12788.json`, `20558.json` identify the regular and imbued weapon records. The DB does not encode special-attack maximum-hit mechanics.
Description: Registered Snapshot supplies hit-count, accuracy and damage multipliers but omits its documented standalone maximum-hit override.
Evidence:
Code currently does: The special handler's TODO says the max-hit formula is unimplemented. Registration contains hitCount 2, accuracyMultiplier and damageMultiplier 1, with no custom maximum-hit trait; CombatFactory routes through generic ranged damage calculation. OSRS Wiki Snapshot uses a separate formula based on visible Ranged level and ammunition Ranged Strength, excluding equipment Ranged Strength and offensive prayer boosts.
osrsreboxed-db says: Exact item rows identify the registered bow variants but contain no special-attack max-hit rule; mechanics are sourced from [Magic shortbow Snapshot](https://oldschool.runescape.wiki/w/Magic_shortbow#Special_attack) and [imbued Snapshot](https://oldschool.runescape.wiki/w/Magic_shortbow_(i)#Special_attack).
Impact: Special hits are calculated using the ordinary ranged maximum-hit path rather than the documented Snapshot formula.
Suggested fix direction (do NOT implement): Add a focused max-hit override for Snapshot that uses its documented inputs while leaving its accuracy calculation on the appropriate attack-roll path.

### [NEW-PROTOCOL-001] Exported path request has no server response route
Severity: Low (conditional on use of exported API)
Status: Open
Category: 13. Client ↔ Server Protocol / Packets (also 14. World / Region / Pathfinding / Collision)
Location: `Typescript-RSPS/client/network/serverConnection/outgoing/path.ts:4-43`; exports `client/network/serverConnection/index.ts:1-29` and `client/network/ServerConnection.ts:1-4`; encoder `client/network/packet/ClientBinaryEncoder.ts:253-268,539-584`; decoder `server/src/main/typescript/elvarg/net/protocol/ClientProtocol.ts:714-718`; dispatch `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:759-762`; expected client response `client/network/packet/ServerBinaryDecoder.ts:1578-1600` and `client/network/serverConnection/handlers/inboundSync.ts:88-100`.
DB Reference: Not data-comparable; protocol/API transport has no DB domain.
Description: Public `requestPath()` creates a pending request but the server route only starts walking and never emits the response consumed by the client promise.
Evidence:
Code currently does: Client stores the callback by request ID, sends `pathfind`, and times out after 3 seconds by default. Server decoder retains the request ID but `NetworkBuilder` calls `walk(toX,toY,0)` and discards it; repository search found a client PATH_RESPONSE decoder but no server producer/encoder.
osrsreboxed-db says: No DB mapping for transport request/response behavior.
Impact: Invocations of the exported request API resolve only by timeout; no in-repository caller was found, so ordinary gameplay impact is not established.
Suggested fix direction (do NOT implement): Either implement the matching server response contract or remove the unsupported exported request API and its pending callback behavior.

### [NEW-PROTOCOL-002] Exported bank and Smithing send helpers have no binary encoder route
Severity: Low (conditional on invoking helpers)
Status: Open
Category: 13. Client ↔ Server Protocol / Packets (also 12. Inventory / Banking / Containers and 11. Skills & Experience)
Location: `Typescript-RSPS/client/network/serverConnection/outgoing/bank.ts:23-42`; `outgoing/misc.ts:4-17`; exports `client/network/serverConnection/index.ts:1-29`; `client/network/packet/ClientBinaryEncoder.ts:539-683`.
DB Reference: Not data-comparable; these helper message types are transport APIs, not DB-driven behavior.
Description: Three exported helpers send message types that have no matching `encodeClientMessage` cases or server packet routes.
Evidence:
Code currently does: `sendBankDepositItem` sends `bank_deposit_item`; `sendSmithingMake` and `sendSmithingSetMode` send `smithing_make` and `smithing_mode`. None has a switch case in the binary encoder, so the default throws `Unknown client message type` before bytes are emitted. No matching server packet ID/decoder route exists. Repository search found no in-repository callers; other bank operations use distinct supported routes.
osrsreboxed-db says: No DB mapping for these transport APIs.
Impact: Each helper fails before network transmission if called; current player UI impact is unestablished.
Suggested fix direction (do NOT implement): Add supported encoder/decoder/dispatch paths or remove these unsupported exported helpers and migrate callers.

### [NEW-PROTOCOL-003] Projectile debug request is encoded and discarded by server
Severity: Low (conditional on use of development helper)
Status: Open
Category: 13. Client ↔ Server Protocol / Packets
Location: `Typescript-RSPS/client/network/serverConnection/outgoing/misc.ts:20-25`; encoder `client/network/packet/ClientBinaryEncoder.ts:526-529,677-678`; packet table `client/common/packets/ClientPacketId.ts:58-60,132`; server fallback/dispatch `server/src/main/typescript/elvarg/net/protocol/ClientProtocol.ts:880` and `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:793-794`.
DB Reference: Not data-comparable; this debug transport has no DB mapping.
Description: Exported projectile-debug helper emits opcode 255, which the server decodes as raw and unconditionally discards.
Evidence:
Code currently does: `requestProjectileDebugSnapshot` sends `debug` kind `projectiles_request`; encoder serializes JSON to opcode 255. Server has a packet length but no opcode-255 case, so it returns `raw`, and NetworkBuilder continues without handling it. No in-repo caller or server response producer was found.
osrsreboxed-db says: No DB mapping for debug packet behavior.
Impact: The exported helper cannot request a projectile snapshot from the server; normal player path not established.
Suggested fix direction (do NOT implement): Add the intended debug request handler/response, or remove the unsupported helper and opcode.

### [NEW-DROP-001] Clue-drop box metadata is ignored after X Marks the Spot
Severity: Medium
Status: Open
Category: 3. Drop Tables (also 18. Missing modern OSRS features and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/plugins/npcs/NpcDrops.plugin.js:323-339,417-431,447-488`; active drop source `server/data/definitions/npc-drops.json:214-230`; NPC mapping loader `server/plugins/npcs/NpcDrops.plugin.js:200-217`.
DB Reference: `READ-ONLY-DB/docs/drops-json/npc-drops.json` -> table `aberrant_spectre`, tertiary row item 2722 with `clue_scroll_box: true` and X Marks the Spot note (lines 215-230); NPC map keys 2–7 -> Aberrant spectre -> `aberrant_spectre`; `docs/items-json/2722.json` -> Clue scroll (hard); `docs/items-json/24364.json` -> Scroll box (hard).
Description: Generic NPC drop materialization ignores the authoritative `clue_scroll_box` condition and always drops item 2722, including for players who completed X Marks the Spot.
Evidence:
Code currently does: `resolveEntry` copies only the entry's `item_id`, quantity and `noted` flag into the rolled result. The tertiary loop tests eligibility/rate but not `clue_scroll_box` or quest state. `dropFor` constructs the same result item ID and registers it in the ground-item manager; no scroll-to-box conversion occurs in that flow. The NPC mapping applies this table to NPC IDs 2, 3, 4, 5, 6 and 7. A bounded search found other clue-producing subsystems (e.g. Hunter and Thieving) that explicitly choose scroll boxes based on quest completion, but the generic NPC-drop handler has no equivalent.
osrsreboxed-db says: The authoritative aberrant-spectre hard-clue row has item ID 2722, `clue_scroll_box: true`, and the note that clue scrolls drop as scroll boxes after X Marks the Spot. The keyed item records identify item 2722 as Clue scroll (hard) and 24364 as Scroll box (hard). DB metadata supplies the conditional replacement; OSRS Wiki [X Marks the Spot](https://oldschool.runescape.wiki/w/X_Marks_the_Spot) documents quest completion as the trigger.
Impact: Completed-quest players receive hard clue scrolls rather than the documented stackable scroll boxes from this NPC drop; the metadata flag is ignored for the mapped Aberrant spectre IDs.
Suggested fix direction (do NOT implement): Carry the row's box-conversion metadata through roll resolution and materialize the tier-matched scroll box when the killer has completed X Marks the Spot; verify all clue tiers and drop sources that carry this metadata.

### [NEW-DROP-002] Ankou location-conditioned drops and F2P table are not selected
Severity: Medium
Status: Open
Category: 3. Drop Tables (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/npcs/NpcDrops.plugin.js:200-217,276-283,404-434,447-457`; live tables `server/data/definitions/npc-drops.json:8415-8553` and Moss Giant rows 130642-130665; active spawn evidence includes NPCs 2514-2516 and Moss Giant 2091 at `npc-spawns.json:23308`.
DB Reference: `READ-ONLY-DB/docs/drops-json/npc-drops.json` → NPC 2514 references `ankou` and `ankou_2`; `tables.ankou` and `tables.ankou_2` (`main_max_roll` 140 and 124); location-conditioned bait/essence rows. The same source's `tables.moss_giant` contains Mossy key 22374 at 1/150 with a note increasing it to 1/100 for off-task Wilderness kills; exact item identity is `docs/items-json/22374.json`. Ankou identity is `docs/monsters-json/2514.json`; item records `7936`, `1436`, `11940`, `313` verify Ankou row identities/membership.
Description: The generic drop runtime does not evaluate location- or task-conditioned table notes. For Ankou it selects only the first mapped table, not the authoritative F2P variant, and does not distinguish location-conditioned rows. For Moss Giants it retains the base 1/150 Mossy key rate rather than applying the documented off-task Wilderness 1/100 rate. These are corroborating examples of conditional semantics not being represented by executable predicates, not separate root-cause findings.
Evidence:
Code currently does: `loadDrops()` resolves every NPC table reference in order into `tablesByNpc` (lines 200-217), but `tableForNpc()` returns `tables[0]` without world or kill-location inputs (437-445). `dropFor()` obtains that table and rolls it (447-455); `rollTable()` uses configured `out_of` and weight for tertiary rows (404-434), with only a specific clue-scroll/Ring of Wealth Wilderness rule (427-430). The `npc-drops:roll` event runs after `rollTable()` has already selected rows (447-457), so it cannot alter the probability of Moss key before roll without a separate reroll/removal. The live Ankou mapping for 2514 has `ankou` first and `ankou_2` second. Live Ankou spawns 2514-2516 occur at coordinates 2315-2361, 5197-5245; deployment world zones determine land/Wilderness classification. Active Moss Giant NPC 2091 is spawned at Wilderness tile 3139,3818; the Mossy key table row is read as 1/150 and its free-text off-task modifier is not read.
osrsreboxed-db says: The authoritative mapping for Ankou 2514 lists both `ankou` (Members' worlds drops, denominator 140) and `ankou_2` (Free-to-play table, denominator 124). The F2P table contains Rune essence (1436) and Fishing bait (313); the members table instead contains Pure essence (7936) and Dark fishing bait (11940). The DB notes Dark fishing bait is only dropped in the Forgotten Cemetery and F2P Fishing bait only by Ankous found in the Wilderness. For Moss Giants, the DB's shared `moss_giant` table sets Mossy key 22374 to 1/150 and explicitly says it rises to 1/100 when killed off-task in the Wilderness. The authoritative note is not encoded in the numeric drop fields. Item records establish identities/membership only.
-Impact: In an F2P world, Ankou kills use members-table odds and cannot produce the F2P table's Rune-essence/Fishing-bait distribution; generic rolls can also award Ankou table rows whose DB notes restrict them by location. For Moss Giants, eligible off-task Wilderness kills do not receive the documented higher Mossy key rate. This finding is bounded to these verified table cases; the Ankou spawn world-zone classification was not independently resolved, and no census of conditional table notes is claimed.
Suggested fix direction (do NOT implement): Pass explicit world/location context into drop-table selection and row eligibility; select the proper membership variant and enforce location-specific notes/conditions rather than relying on item-membership filtering.

### [NEW-DROP-003] Scurrius public-group drops are not allocated by MVP participation
Severity: Medium
Status: Open
Category: 3. Drop Tables (also 18. Missing modern OSRS features, 19. Data consistency bugs, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/npcs/NpcDrops.plugin.js:437-455,515-529`; `server/src/main/typescript/elvarg/game/task/impl/NPCDeathTask.ts:17-20,34-60`; `server/src/main/typescript/elvarg/game/content/combat/Combat.ts:481-493`; live table mapping `server/data/definitions/npc-drops.json:153116-153165,153461-153515,228805-228823`; Scurrius plugin `server/plugins/bosses/Scurrius.plugin.js` (no loot/MVP handlers).
DB Reference: `READ-ONLY-DB/docs/drops-json/npc-drops.json` -> `npcs["7221"]` maps public/group Scurrius to `scurrius_2`; `npcs["7222"]` maps solo Scurrius to `scurrius` then `scurrius_2`. `tables.scurrius` is labeled `Drops (MVP/Solo)` (`main_max_roll: 100`); `tables.scurrius_2` is `Drops (non-MVP)` (`main_max_roll: 33`). `docs/monsters-json/7221.json` and `7222.json` identify group and solo NPC variants. OSRS Wiki [Scurrius](https://oldschool.runescape.wiki/w/Scurrius) defines MVP/Solo versus non-MVP participant eligibility.
Description: Public Scurrius drops are rolled once for the single greatest-damage killer, using the first mapped table. The highest-damage participant therefore receives the non-MVP table for public NPC 7221, while other participants receive no individual non-MVP reward rolls.
Evidence:
Code currently does: `Combat.getKiller(true)` returns only the registered player with greatest cached damage (481-493); `NPCDeathTask` emits a single death event with that killer (48-60). `NpcDrops` invokes `dropFor` once for that event's killer (515-529), and `dropFor` selects `tables[0]` and rolls once (437-455). The Scurrius plugin has no drop or MVP allocation handler. Vendored mapping for 7221 contains only `scurrius_2`; the generic runtime therefore gives the top-damage killer the non-MVP table. The solo 7222 mapping starts with the MVP/Solo table, but that does not add participant rewards to a public group kill.
osrsreboxed-db says: The authoritative mapping distinguishes public ID 7221 from solo ID 7222 and supplies separate MVP/Solo and non-MVP tables. The Wiki explicitly says the MVP/Solo table is rolled by the highest-damage player and the non-MVP table by other players participating in a group kill. The data source's table identity/ordering alone does not implement this per-participant assignment.
Impact: In public Scurrius kills, the MVP gets non-MVP rewards and other participants receive no Scurrius table roll through this generic death path; distinct intended personal reward allocation is lost.
Suggested fix direction (do NOT implement): Add a Scurrius encounter reward allocator that identifies eligible contributors, rolls the MVP/Solo table for the greatest-damage player, and rolls the non-MVP table for other eligible participants; preserve solo handling and one-player unique-drop restrictions.

### [NEW-EQUIP-001] Corrupted Tumeken's Shadow omits its passive bonus multiplier
Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 9. Combat Formulas, 10. Equipment Bonus Calculation, 18. Missing modern OSRS features, 19. Data consistency bugs, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/items/TumekensShadow.plugin.js:63-67,179-190,262-274`; runtime consumers `server/src/main/typescript/elvarg/game/model/equipment/BonusManager.ts:39-74`, `server/src/main/typescript/elvarg/game/content/combat/formula/AccuracyFormulasDpsCalc.ts:594-606`, and `server/src/main/typescript/elvarg/game/content/combat/formula/DamageFormulas.ts:325-340`.
DB Reference: `READ-ONLY-DB/docs/items-json/28547.json` -> charged Corrupted tumeken's shadow; `docs/items-json/28549.json` -> uncharged variant. Both records identify equippable two-handed powered staffs with +35 Magic attack, +20 Magic defence, +1 Prayer, and 0% base Magic damage. `ItemIdentifiers.ts:26454-26457` maps charged/uncharged and noted IDs.
Description: The registered Shadow bonus provider recognizes only ordinary Tumeken's Shadow IDs. Equipping either corrupted variant therefore bypasses the corrupted weapon's documented 2x worn Magic-attack and Magic-damage passive (3x in Tombs of Amascut).
Evidence:
Code currently does: `wieldsShadow()` matches only `TUMEKENS_SHADOW` and, when permitted, `TUMEKENS_SHADOW_UNCHARGED_` (63-67). `shadowBonuses()` requires `wieldsShadow(player, true)` then applies the ordinary Shadow's x3/x4 multiplier (184-190); the plugin registers this provider (262-274). `BonusManager.update()` invokes providers after summing equipment bonuses (39-74), and combat accuracy/damage formulas consume the resulting magic attack/damage values.
osrsreboxed-db says: Item records 28547 and 28549 identify the corrupted Shadow variants as equippable powered staffs; their equipment fields give the base bonuses above. The DB has no passive multiplier field. OSRS Wiki [Corrupted tumeken's shadow](https://oldschool.runescape.wiki/w/Corrupted_tumeken%27s_shadow) specifies the corrupted version doubles worn magic attack and damage bonuses, or triples them in Tombs of Amascut, rather than ordinary Shadow's tripling/quadrupling.
Impact: Corrupted Shadow users receive none of the documented scaling to worn Magic attack and damage bonuses.
Suggested fix direction (do NOT implement): Extend the provider for the corrupted charged and uncharged IDs with their 2x/3x factors while preserving ordinary Shadow behavior; separately verify attack-method and charge handling for these variants.

### [NEW-EQUIP-002] Ava's assembler is omitted from ammunition recovery provider
Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation, 18. Missing modern OSRS features, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/items/AvasAccumulator.plugin.js:11-24`; runtime consumer `server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:1473-1495`; provider dispatch `server/src/main/typescript/elvarg/plugins/PluginManager.ts:4123-4139`; item identifier `server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:20391-20392`.
DB Reference: `READ-ONLY-DB/docs/items-json/22109.json` -> item 22109, Ava's assembler; the record marks it player-equipable and gives its equipment slot as `cape`. `ItemIdentifiers.ts:20391` maps `AVAS_ASSEMBLER` to 22109. OSRS Wiki [Ava's device — Effectiveness](https://oldschool.runescape.wiki/w/Ava%27s_device#Effectiveness) documents 80% recovery for the assembler; its item JSON does not encode that mechanic.
Description: The active Ava recovery provider handles Ava's attractor and accumulator only; wearing Ava's assembler yields zero ammunition recovery through the ordinary ranged-ammunition decrement path.
Evidence:
Code currently does: `recoveryFor()` returns 60 for `AVAS_ATTRACTOR`, 72 for `AVAS_ACCUMULATOR`, and null for every other cape (11-15); the plugin registers this callback (18-24). `CombatFactory` uses the returned rate to compute the floor-drop share on normal ammunition decrement (1473-1495); `PluginManager.rangedAmmoRecovery()` ignores null and returns 0 when no provider matches (4123-4139). The assembler ID 22109 is absent from the provider branches.
osrsreboxed-db says: Key 22109 is an equippable, cape-slot Ava's assembler. The item record verifies identity/equipability, not recovery percentage. OSRS Wiki identifies the device and its 80% ammunition recovery rate (20% breakage, no ammunition left on the ground), whereas the unmatched runtime provider returns 0% recovery and keeps its ordinary 20% break/60% floor-drop split.
Impact: Players wearing Ava's assembler lose the documented 80% automatic recovery benefit for ammunition fired through this ordinary ranged-ammo path; those items instead follow the core's break/drop distribution.
Suggested fix direction (do NOT implement): Include the assembler's verified recovery share in the provider and keep separate eligibility/metal-interference behavior bounded to their own checks.



### [NEW-GE-SET-001] Barrows armour sets cannot be opened or exchanged
Severity: Medium
Status: Open
Category: 15. Interfaces / UI (also 1. Items & Equipment, 18. Missing modern OSRS features, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/net/packet/impl/ItemActionPacketListener.ts:119-163`; `server/plugins/interface/GrandExchange.plugin.js:497-533`.
DB Reference: `READ-ONLY-DB/docs/items-json/12873.json` Guthan's armour set; `12875.json` Verac's; `12877.json` Dharok's; `12879.json` Torag's; `12881.json` Ahrim's; `12883.json` Karil's. `docs/npcs-interactions.json` -> NPC IDs 2148–2151, Grand Exchange Clerk, option 5 `Sets`.
Description: The six sampled Barrows armour-set items have no item action, and the Grand Exchange clerk's DB-defined Sets action is not registered. No item-set interface or component-to-set exchange route was found in the active server paths.
Evidence:
Code currently does: First item action checks plugins and equipment, then the switch cases for all six Barrows set IDs (12873, 12875, 12877, 12881, 12883, 12879) have empty bodies and return unhandled. The GrandExchange plugin registers only `Exchange` for `Grand Exchange Clerk`; repository search found no item-set exchange interface/handler. The current click-slot-5 dispatch limitation is separately recorded as NEW-SHOP-001; this finding is about the absent item-set exchange path, not a duplicate of that general click-slot defect.
osrsreboxed-db says: The six keyed records identify the Barrows armour-set items and their component descriptions. The four clerk records expose a `Sets` option at slot 5. DB item records do not describe conversion mechanics. The OSRS Wiki [Item set](https://oldschool.runescape.wiki/w/Item_set) states the clerk's Sets option opens the Item sets interface and is the only way to exchange set and component items; Barrows sets must use undamaged equipment.
Impact: Players cannot exchange the sampled Barrows set items with their components through the documented clerk/interface flow; clicking a set's first item action also does not process it.
Suggested fix direction (do NOT implement): Implement the item-set interface and validated component/set exchanges, then route the clerk's Sets option and Barrows set item actions through it; verify noted, damaged, inventory-capacity, and rollback cases.

### [NEW-COMBAT-005] Burning Claws special attack drains stale 30% energy
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features, 19. Data consistency bugs, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/BurningClaws.SpecialAttack.js:5,13,24-28`; registration `server/plugins/combat/SpecialAttacks.plugin.js:24-26`.
DB Reference: `READ-ONLY-DB/docs/items-json/29577.json` -> item 29577, Burning claws (identity/equipment data; DB has no special-attack energy field).
Description: Burning Barrage is configured to drain 30% special energy, but the current OSRS cost is 35%.
Evidence:
Code currently does: The active registered special sets `DRAIN = 30`, uses it for `CombatSpecial.drain`, and publishes it as `drainAmount` for Burning Claws item 29577.
osrsreboxed-db says: Key 29577 identifies the equipable Burning claws weapon; the DB does not encode special-attack cost. The OSRS Wiki [Burning claws](https://oldschool.runescape.wiki/w/Burning_claws#Special_attack) says Burning Barrage drains 35%; its change table records the increase from 30% on 22 July 2026.
Impact: Each use consumes five percentage points less special energy than documented, allowing earlier repeat use.
Suggested fix direction (do NOT implement): Update the registered drain to the current 35% rule and verify all callers use the same value.

### [NEW-COMBAT-006] Burning Claws special attack never applies its burn effect
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/BurningClaws.SpecialAttack.js:11-22,30-40`; resolution hooks `server/src/main/typescript/elvarg/game/content/combat/hit/PendingHit.ts:330-373` and `server/src/main/typescript/elvarg/game/content/combat/CombatFactory.ts:841-846`.
DB Reference: `READ-ONLY-DB/docs/items-json/29577.json` -> Burning claws, item 29577; item DB establishes identity but not the special-attack burn mechanic.
Description: The special attack resolves its three damage branches but never applies the documented delayed burn to the target.
Evidence:
Code currently does: `BurningClawsCombatMethod` has no `handleAfterHitEffects` override; its comment explicitly says the burn proc needs the first-successful-accuracy-roll index and a shared delayed-damage scheduler. The registration supplies damage ranges only. `PendingHit.resolveFirstSuccessfulRanges` returns the hits without publishing that branch index, and `CombatFactory` invokes the inherited empty post-hit hook.
osrsreboxed-db says: Key 29577 identifies Burning claws, with no field for the special effect. The OSRS Wiki [Burning claws](https://oldschool.runescape.wiki/w/Burning_claws#Special_attack) documents a chance per hitsplat to inflict a delayed burn, with proc chances of 15%, 30%, or 45% depending on the first successful accuracy roll.
Impact: Successful special attacks never inflict the weapon's burn damage; the entire documented damage-over-time effect is absent.
Suggested fix direction (do NOT implement): Expose the resolved accuracy branch and implement the documented per-hit burn chance, delayed damage, stacking cap and exclusions for all-miss damage.

### [NEW-LUNAR-001] Lunar spell option callbacks subtract the zero-based selection twice
Severity: Medium
Status: Open
Category: 15. Interfaces / UI (also 6. Dialogues and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/net/NetworkBuilder.ts:620-621`; `server/src/main/typescript/elvarg/game/model/dialogues/DialogueOption.ts:1-6`; `server/src/main/typescript/elvarg/game/content/combat/magic/LunarSpells.ts:369-390`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json` -> NPCs 6797 Nieve, 8623 Konar quo Maten, 13620 Mazchna and 13622 Duradel; `docs/npc-dialogue-index.json` keys 8623/13620/13622 expose their current Astral Contact transcript variants. DB identifies NPCs/dialogue but does not define the internal option enum.
Description: Both active Lunar menu callbacks subtract one from an option that `NetworkBuilder` has already converted to a zero-based `DialogueOption`.
Evidence:
Code currently does: `NetworkBuilder` passes `buttonNum - 1`; enum values start at `FIRST_OPTION = 0`. The Astral Contact and spellbook-swap callbacks then index their arrays with `(option as number) - 1`. The first displayed option therefore yields index -1 and performs no selection; later choices shift to the previous array entry. On Spellbook Swap, Arceuus cannot be selected; on NPC Contact, Mazchna cannot be selected.
osrsreboxed-db says: The keyed interaction/dialogue records confirm the selectable Slayer-master identities and provide Astral Contact transcript variants for Duradel, Konar and Mazchna; DB has no enum/index semantics. The specific zero-based contract is established by TSPS `DialogueOption` and the active network dispatch.
Impact: The first menu choice is ignored, later choices select the wrong NPC/book, and the final choice in each menu is unreachable.
Suggested fix direction (do NOT implement): Index both arrays directly with the zero-based enum and verify every visible choice maps to the same-position entry.

### [NEW-LUNAR-002] Astral Contact selection does not contact the selected NPC
Severity: Medium
Status: Open
Category: 6. Dialogues (also 15. Interfaces / UI and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/magic/LunarSpells.ts:369-378`; NPC transcript entry point `server/plugins/npcs/NpcDialogues.plugin.js:713-727`.
DB Reference: `READ-ONLY-DB/docs/npc-dialogue-index.json` -> IDs 8623 Konar, 13620 Mazchna, 13622 Duradel include `via-the-astral-contact-spell`; transcript files `docs/dialogues/5399597010872bc7.json:443-480`, `524b74d2e89a09dd.json:342-380`, `6b102e04b389b310.json:405-443` contain the contact conversations. `docs/npcs-interactions.json` keys 6797, 8623, 13620, 13622 identify the four menu names.
Description: Choosing a name in the active Astral Contact menu closes the option interface and sends a status message; it never opens that NPC's dialogue or invokes the NPC contact behavior.
Evidence:
Code currently does: The callback resolves a string from `contacts`, removes the interface, and calls `sendMessage("You contact ...")`. It does not emit `npc-dialogue:start` or start a dialogue. The existing NPC dialogue plugin supports named transcript starts through that event.
osrsreboxed-db says: DB includes named Astral Contact transcript variants for Duradel, Konar and Mazchna and confirms their NPC identities/options; this establishes the available conversation data, not the spell mechanic. The OSRS Wiki [Astral Contact](https://oldschool.runescape.wiki/w/Astral_Contact) says selecting a character contacts that NPC and opens the conversation.
Impact: The spell's NPC selection has no gameplay effect beyond a message; players cannot reach the selected NPC's contact dialogue from this spell.
Suggested fix direction (do NOT implement): Map each selected contact to its NPC ID and transcript variant, then launch the existing named dialogue flow and test selection/nearby behavior.

### [NEW-LUNAR-003] Astral Contact charges two Astral runes and a Law rune instead of its required runes
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features, 19. Data consistency bugs, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/content/combat/magic/LunarSpells.ts:140-154`; rune validation/consumption `server/src/main/typescript/elvarg/game/content/combat/magic/Spell.ts:100-112,125-150`.
DB Reference: `READ-ONLY-DB/docs/items-json/556.json` -> Air rune; `9075.json` -> Astral rune; `564.json` -> Cosmic rune; `563.json` -> Law rune. Item records verify identities; spell costs are not in the item DB.
Description: Astral Contact's active rune recipe is two Astral runes, one Cosmic rune and one Law rune, rather than two Air runes, one Astral rune and one Cosmic rune.
Evidence:
Code currently does: The `npc contact` definition requires `rune(9075, 2)`, `rune(564)` and `rune(563)`; `Spell.canCast` validates and consumes those configured IDs.
osrsreboxed-db says: The keyed item records identify 556 as Air, 9075 as Astral, 564 as Cosmic and 563 as Law; they do not define this spell's recipe. The OSRS Wiki [Astral Contact](https://oldschool.runescape.wiki/w/Astral_Contact#Cost) specifies two Air, one Astral and one Cosmic rune.
Impact: Players are charged one extra Astral and one Law rune, while the two required Air runes are not consumed.
Suggested fix direction (do NOT implement): Align the spell definition with the documented rune recipe and verify inventory/rune-source consumption.



### [NEW-SHOP-001] Imported slot-five Trade owner is not registered
Severity: Medium
Status: Open
Category: 4. Shops (also 5. NPC Interactions / Right-click options and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/scripts/import-osrs-shops.mjs:88-103,122-135`; `server/plugins/npcs/Shopkeepers.plugin.js:6,75-89,106-110`; `server/src/main/typescript/elvarg/game/definition/NpcInteractionDefinition.ts:10-15,37-50`; `server/src/main/typescript/elvarg/game/definition/loader/impl/NpcInteractionDefinitionLoader.ts:9-25,51-88`; plugin registration `server/src/main/typescript/elvarg/plugins/PluginManager.ts:2076-2106,2162-2166`; runtime dispatch `server/src/main/typescript/elvarg/game/entity/impl/npc/NpcInteractionManager.ts:81-100`; packet path `server/src/main/typescript/elvarg/net/packet/impl/NPCOptionPacketListener.ts:15,24-25,63-98`.
DB Reference: `READ-ONLY-DB/docs/npcs-interactions.json` -> NPC 1501 Aleck options 1 `Talk-to`, 5 `Trade`; `docs/shops-by-npc.json` -> NPC 1501 shop owner slot 5; `docs/shops-items-by-shop.json` -> Aleck's Hunter Emporium owner NPC 1501, `option_slot: 5`, `option_source: "click"`, and 12 stock rows; `data/schemas/schema-shops-items-by-shop.json:73-85` explicitly permits click slots 1–5.
Description: The importer preserves Aleck's valid fifth-slot Trade mapping and shop data, but runtime shop registration accepts only slots 1–4 and NPC interaction definitions cannot dispatch a fifth click, so Aleck's imported shop is unreachable through its DB-defined Trade option.
Evidence:
Code currently does: `npcInteractions()` imports every positive click `option_slot` without an upper-bound filter and `main()` emits the shop row. The runtime smoke invocation of `Shopkeepers.register()` against vendored `shops.json` produced no registration call for NPC 1501, while an adjacent slot-3 owner (NPC 1502 Leon) did register. The cause is explicit: `CLICK_FIELDS` ends at `fourthClick`, `shopkeepers()` rejects slots greater than 4, and the interaction model/loader/plugin registration API only defines and merges first through fourth click actions. Although `NPCOptionPacketListener` accepts click types through 5 and the NPC cache definition exposes Aleck's slot-5 Trade, `NpcInteractionManager.handle()` gets no action for click type 5 and returns fals…
osrsreboxed-db says: Aleck (NPC 1501) has Trade at option slot 5; the named shop has an active click-source owner at that slot and the documented schema allows max slot 5. This is a source-code dispatch gap, not a missing or malformed DB mapping.
Impact: Clicking Aleck's valid Trade option reaches no shop action; the user gets the generic unhandled-interaction response instead of Aleck's Hunter Emporium.
Suggested fix direction (do NOT implement): Extend the active NPC click-action definition, loader, plugin-registration, and dispatch path consistently through click slot 5, then verify imported shop bindings and existing slots 1–4.
### [NEW-COMBAT-007] Ancient Godsword Blood Sacrifice ignores NPC max Hitpoints
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 19. Data consistency bugs and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/AncientGodsword.SpecialAttack.js:10-13,52-72,79-91`; NPC max HP `server/src/main/typescript/elvarg/game/entity/impl/npc/NPC.ts:341-355`; registration `server/plugins/combat/SpecialAttacks.plugin.js:5-18`.
DB Reference: `READ-ONLY-DB/docs/items-json/26233.json` -> item 26233 Ancient godsword, equipable weapon; `docs/monsters-json/1.json` -> NPC 1 Molanisk, 52 Hitpoints. Active runtime `server/data/definitions/monsters-complete.json` key 1 also identifies Molanisk with 52 Hitpoints; `server/src/main/typescript/elvarg/util/NpcIdentifiers.ts:1-5` maps ID 1.
Description: Against NPC targets, the delayed Blood Sacrifice effect heals the attacker a fixed 25 HP instead of 15% of the target's max Hitpoints, capped at 25.
Evidence:
Code currently does: At lines 58-67, the NPC max-HP calculation is an explicit TODO. `heal` remains 25 unless `target.isPlayer()`; the NPC path never reads `target.getMaxHitpoints()`. `NPC.getMaxHitpoints()` exposes scaled NPC maximum HP at `NPC.ts:352-355`. For Molanisk (DB ID 1, 52 max HP), 15% floored is 7. The queued 25-damage sacrifice is independently clamped to the target's current HP by `Mobile.decrementHealth()` (`server/src/main/typescript/elvarg/game/entity/impl/Mobile.ts:606-616`), but that applied damage is not used to cap the heal.
osrsreboxed-db says: The keyed records establish item/NPC identities and Molanisk's 52 Hitpoints, not the special mechanic. OSRS Wiki [Ancient godsword special attack](https://oldschool.runescape.wiki/w/Ancient_godsword#Special_attack) documents 15% of target maximum HP, capped at 25 for NPCs and 15 for players; the sacrifice hit must deal damage for the full heal.
Impact: Against NPCs below 167 max Hitpoints, healing exceeds the documented percentage cap. In the verified 52-max-HP Molanisk case, the special grants 25 instead of at most 7; with current HP below 25, it can also heal more than the sacrifice damage actually dealt.
Suggested fix direction (do NOT implement): Calculate the NPC branch from `target.getMaxHitpoints()`, apply the documented NPC cap and bound healing by actual sacrifice damage; verify target-scaled HP and sacrifice damage interactions.
### [NEW-PROTOCOL-004] Exported widget-open helper has no server open route
Severity: Low (conditional on an external caller invoking the exported API)
Status: Open
Category: 13. Client ↔ Server Protocol / Packets
Location: `Typescript-RSPS/client/network/serverConnection/outgoing/widgets.ts:5-11`; exports `client/network/serverConnection/index.ts:16`, `client/network/ServerConnection.ts:4`; encoder `client/network/packet/ClientBinaryEncoder.ts:381-387,539-540`; server decoder `server/src/main/typescript/elvarg/net/protocol/ClientProtocol.ts:809-812`; dispatch `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:645-647`.
DB Reference: Not data-comparable; UI transport API has no DB mapping.
Description: The public `sendWidgetOpen()` helper encodes an `open` action and reaches server decoding, but the server's `widget` dispatch handles only `close`.
Evidence:
Code currently does: `sendWidgetOpen()` sends `{type:"widget", payload:{action:"open", groupId, modal}}`. `encodeClientMessage` encodes `widget` to opcode 250; the server decodes its action and group ID. `NetworkBuilder` handles the message only when `packet.action === "close"`, then consumes all widget messages. Repository search found no in-repository caller, so ordinary gameplay impact is not established.
osrsreboxed-db says: No DB mapping for UI transport or server interface-open requests.
Impact: Invoking this exported API does not open a server-authoritative interface; current in-repository user-visible failure is unproven.
Suggested fix direction (do NOT implement): Remove or explicitly constrain the unsupported public helper, or define and authorize a specific server-side open request before routing it.

### [NEW-UI-001] Barrows puzzle closure leaves a stale Escape-close target
Severity: Low
Status: Open
Category: 15. Interfaces / UI (also 13. Client ↔ Server Protocol / Packets and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/minigames/Barrows.plugin.js:37,493-517,632-638`; `server/src/main/typescript/elvarg/net/packet/PacketSender.ts:724-739`; `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:679-698`; `client/game/widgets/input/widgetKeyboardInput.ts:164-172,246-263`.
DB Reference: Not data-comparable; this is an internal UI-state/close-packet lifecycle defect, not a game-data mismatch.
Description: Solving/answering the Barrows puzzle or having it invalidated by movement closes puzzle interface 25 but leaves the shared close-on-Escape marker set to 25. The next Escape is consumed trying to close that already-closed puzzle rather than closing the currently open modal.
Evidence:
Code currently does: `showPuzzle()` sets `interface:close-on-interface-close` to `PUZZLE_ID` 25 and mounts that subinterface. `answerPuzzle()` always clears pending puzzle state and closes 25; movement invalidation does the same. Neither path clears the close marker. `PacketSender.closeInterface(25)` removes the tracked subinterface mapping but does not clear the marker. On the next `IF_CLOSE`, NetworkBuilder reads and clears the stale marker, calls `closeInterface(25)`, and immediately continues without closing other interruptible interfaces. The client sends `IF_CLOSE` on Escape whenever a modal parent exists. Thus a puzzle answered or invalidated, followed by opening another modal and pressing Escape, consumes the first close request; a second Escape is n…
osrsreboxed-db says: No DB mapping for interface-parent or Escape-close state.
Impact: After these specific Barrows puzzle-close transitions, the first Escape on a later modal does not close that modal. This is confined to stale-marker lifecycle; no broader UI-close regression is asserted.
Suggested fix direction (do NOT implement): Clear the shared close marker when its associated subinterface is explicitly closed, and verify both answer and movement-invalidation transitions.




### [NEW-WORLD-001] Dynamic object removal clears projectile clipping it did not add
Severity: Medium
Status: Open
Category: 14. World / Region / Pathfinding / Collision (also 9. Combat Formulas and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/game/collision/RegionManager.ts:82-180,181-280,282-305,316-397,551-583`; object flags `server/src/main/typescript/elvarg/game/definition/ObjectDefinition.ts:20-39,95-98`; lifecycle `server/src/main/typescript/elvarg/game/entity/impl/object/MapObjects.ts:115-156` and `ObjectManager.ts:183-232`.
DB Reference: No exact object ID asserted. The READ-ONLY-DB cache directories contain no cache object-definition records; `docs/objects-summary.json` supplies IDs/names, not `clipType` or projectile-blocking flags, so this cache-flag mismatch is not verifiable against an authoritative per-object DB record.
Description: Despawning/replacing a solid dynamic object that does not block projectiles passes different projectile-blocking flags to clipping removal than to clipping addition. The remove path can clear projectile bits owned by an overlapping blocker, allowing ranged/magic line-of-sight through it.
Evidence:
Code currently does: `ObjectDefinition.isSolid()` tests `clipType !== 0`, while `isImpenetrable()` returns the independent cache `blocksProjectile` flag. `addObjectClipping()` calls add helpers with `isImpenetrable()` for wall types and variable walls; those helpers add projectile-specific bits only when the flag is true. `removeObjectClipping()` instead calls removal helpers with `isSolid()` for both types. The projectile removal helpers then clear projectile-direction bits when that boolean is true. `MapObjects.remove()` reaches this path, and `ObjectManager.perform(DESPAWN)` calls it for registered runtime objects. Region clipping is bitwise, not per-source reference-counted; `canProjectileAttack()` uses the resulting collision grid. Thus, if a solid-but-…
osrsreboxed-db says: `docs/objects-summary.json` does not expose the cache flags needed to identify an authoritative concrete object example; READ-ONLY-DB cache indexes/dumps were not available for this property comparison. No item/NPC/object-ID mismatch is claimed.
Impact: In overlapping dynamic-object scenes, despawn or replacement may incorrectly make a projectile path traversable; affected ranged/magic attacks then see a false clear line. Exact affected object IDs and an active scene instance were not established from available cache data.
Suggested fix direction (do NOT implement): Pass the same projectile-blocking property used at registration into removal and verify overlapping blockers across spawn/despawn and replacement.
### [NEW-HARDCODED-ITEM-001] Duplicate Blurberry special hits the wilderness-warning switch
Severity: Medium
Status: Open
Category: 16. Hardcoded values vs DB-driven data (also 1. Items & Equipment, 11. Skills & Experience, and 21. Server-specific issues)
Location: `Typescript-RSPS/server/src/main/typescript/elvarg/net/packet/impl/ItemActionPacketListener.ts:91-126`; item ID alias `server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:8269-8270`; first-action consumers `server/plugins/items/Potions.plugin.js:1071-1075,1210-1213` and `Food.plugin.js:158-163`.
DB Reference: `READ-ONLY-DB/docs/items-json/9520.json` -> duplicate Blurberry special, key 9520 (`duplicate: true`, noted ID 9521); `docs/items-json/2064.json` -> canonical Blurberry special, key 2064 (duplicate false). Wiki [Blurberry special](https://oldschool.runescape.wiki/w/Blurberry_special) documents Drink as an item option and its consumption effects.
Description: First-click Drink on duplicate item ID 9520 falls through food/potion handlers to a hard-coded switch case that always says the item cannot be used in the Wilderness; it never consumes the cocktail, even outside the Wilderness.
Evidence:
Code currently does: The listener emits item-first-action hooks before its switch. Potion lookup and food lookup both return unhandled for ID 9520. The switch then matches literal `case 9520`, sends the unconditional wilderness warning and breaks; the listener returns false without consuming the item. The active item identifier names 9520 `BLURBERRY_SPECIAL_3`.
osrsreboxed-db says: Key 9520 identifies a duplicate Blurberry special and supplies noted ID 9521; canonical key 2064 is the separate nonduplicate Blurberry special. The DB verifies the duplicate identity/ID distinction, not action semantics. The OSRS Wiki item page lists Drink and documents healing 7 HP, boosting Strength and reducing Attack.
Impact: Players with the valid duplicate cocktail cannot drink it; they receive an unrelated wilderness warning and retain the item. Canonical item 2064 is a separate ID and this report does not claim its behavior is broken.
Suggested fix direction (do NOT implement): Route duplicate cocktail variants to the same Drink behavior as the canonical item and remove the unrelated unconditional ID case; verify all dose/duplicate item variants.
### [NEW-CLIENT-002] Editor item search truncates sparse object-archive IDs
Severity: Low
Status: Open
Category: 20. Client-specific issues (also 17. Duplication / Dead code / Unused definitions)
Location: `Typescript-RSPS/client/rs/config/TypeLoader.ts:90-105`; active factory path `client/rs/cache/loader/Dat2CacheLoaderFactory.ts:94-100,151-168`; editor consumer `client/game/plugins/editmode/install.ts:162-179,181-204,1594-1608`, `EditorUi.ts:222-228,548-563`, and `EditorPalette.ts:47-71,193-247`; opt-in editor route `client/game/OsrsClient.ts:456-463,1199-1205`. Server comparator: `server/src/main/typescript/elvarg/game/cache/codec/rs/config/TypeLoader.ts:96-106`.
DB Reference: No item ID or data mismatch claimed. `READ-ONLY-DB/data/cache/osrs-cache` and `data/cache/osrs-flatcache` contain no cache archive artifacts or index metadata to identify specific tail IDs; exported item JSON does not expose cache archive lastFileId/fileCount.
Description: The client archive-backed object loader reports `archive.fileCount` as its count. The opt-in editor uses that count as an exclusive upper bound while building its item-name index, so valid item definition IDs beyond the number of files in a sparse archive are omitted from editor search/inspection.
Evidence:
Code currently does: Client `ArchiveTypeLoader.getCount()` returns `this.archive.fileCount`. The active OSRS cache factory selects the archive-backed ObjType loader. The editor's name-index builder iterates IDs from zero up to, but excluding, `getCount()` and uses that index for item search/inspection. The parallel server implementation documents that item IDs have gaps and returns `archive.lastFileId + 1`, avoiding the count/range mismatch. This comparison verifies the extent convention; no concrete archived item ID was available from the empty DB cache artifacts.
osrsreboxed-db says: Its JSON item records identify item definitions but do not include archive `fileCount` or `lastFileId`; its cache artifact directories are empty. No DB-level item discrepancy is asserted.
Impact: When the item-definition archive has gaps, editor search and inspection omit definitions whose IDs are at or above `fileCount` but no greater than `lastFileId`. This is limited to the opt-in editor and does not establish gameplay loader failure.
Suggested fix direction (do NOT implement): Make the client count API represent the exclusive ID upper bound, consistent with sparse archive IDs, then verify editor search includes the archive's final valid ID.
### [NEW-COMBAT-008] Keris partisan of corruption omits its raid gate and vulnerability effect
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/KerisPartisanOfCorruption.SpecialAttack.js:11-18,22-37`; registration `server/plugins/combat/SpecialAttacks.plugin.js:58-59`; active attack processing `server/src/main/typescript/elvarg/game/content/combat/Combat.ts:624-647`.
DB Reference: `READ-ONLY-DB/docs/items-json/27287.json` -> item 27287, Keris partisan of corruption (identity only; special mechanics are not encoded in this record).
Description: Registered Wrath of Amascut special for item IDs 27287/27288 has no Tombs of Amascut activation restriction and never applies the target's documented 25%-increased-damage vulnerability for 10 ticks after a successful hit.
Evidence:
Code currently does: The special drains 75%, applies 2x accuracy and 1.25x damage and starts its melee method. Source TODOs explicitly name both omitted mechanics and state required zone/damage-taken hooks are unavailable. The module is required by the active special-attack registry. Wiki [Keris partisan of corruption](https://oldschool.runescape.wiki/w/Keris_partisan_of_corruption#Special_attack) says the special is usable only in ToA and a successful hit marks its target for 25% increased damage for 10 ticks.
osrsreboxed-db says: Key 27287 identifies the item as Keris partisan of corruption; this DB item record contains no special-attack rules, so the mechanic comparison relies on the linked OSRS Wiki.
Impact: The special can be activated outside its permitted raid, and teams receive no vulnerability benefit from a successful special hit.
Suggested fix direction (do NOT implement): Gate activation to ToA and apply the documented timed target modifier only on a successful hit.

### [NEW-COMBAT-009] Noxious halberd Virulence loses the cured damage amount
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/NoxiousHalberd.SpecialAttack.js:8-10,13-29,32-44`; registration `server/plugins/combat/SpecialAttacks.plugin.js:64`; utility activation `server/src/main/typescript/elvarg/game/content/combat/CombatSpecial.ts:245-263`; hit preparation `server/src/main/typescript/elvarg/game/content/combat/hit/PendingHit.ts:147-153`.
DB Reference: `READ-ONLY-DB/docs/items-json/29796.json` -> item 29796, Noxious halberd (identity only; special mechanics are not encoded in this record).
Description: Virulence cures poison/venom without preserving the damage prevented, so the next accurate Noxious halberd attack lacks the mechanic's minimum-hit increase.
Evidence:
Code currently does: The special rejects use when poison damage is nonpositive, drains 50%, clears poison and venom, and is registered with `skipAttack: true`; its `hits()` returns null and it stores no pending damage state. `CombatSpecial.activateUtility()` invokes its `start()` immediately, while pending-hit handling skips attack generation for this utility trait. Wiki [Noxious halberd](https://oldschool.runescape.wiki/w/Noxious_halberd#Special_attack) states the next accurate halberd attack minimum hit increases by the damage the cured affliction would have dealt, and the effect is lost on weapon switch or logout.
osrsreboxed-db says: Key 29796 identifies the item as Noxious halberd; the DB item record has no Virulence effect specification. The special mechanics are confirmed by the linked Wiki source.
Impact: The player loses poison/venom damage but receives no compensating minimum on the next accurate halberd hit.
Suggested fix direction (do NOT implement): Capture the prevented damage as weapon-bound, logout-cleared state and apply it as the next accurate halberd hit's minimum.

### [NEW-COMBAT-010] Dinh's bulwark Shield Bash omits area hits and target-specific accuracy
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/DinhsBulwark.SpecialAttack.js:15-36,38-63`; registration `server/plugins/combat/SpecialAttacks.plugin.js:30`; area hit scheduling `server/src/main/typescript/elvarg/game/content/combat/Combat.ts:635-647`; hit-count handling `server/src/main/typescript/elvarg/game/content/combat/hit/PendingHit.ts:155-160`.
DB Reference: `READ-ONLY-DB/docs/items-json/21015.json` -> item 21015, Dinh's bulwark (identity only; special mechanics are not encoded in this record).
Description: Shield Bash is registered as a fixed two-hit, 1.2-accuracy special without area targeting; it never hits nearby enemies and does not vary accuracy for defensive NPC targets.
Evidence:
Code currently does: The registration declares `hitCount: 2` and a fixed 1.2 accuracy multiplier but no `targeting` trait. Combat schedules secondary targets only when active targeting is present. The source TODO acknowledges hit count should vary between player/NPC targets and accuracy should be 0.8 versus defensive NPCs, but only the static PvM default is registered. Wiki [Dinh's bulwark](https://oldschool.runescape.wiki/w/Dinh%27s_bulwark#Special_attack) says Shield Bash hits up to 10 enemies in an 11×11 area in multicombat, hits its primary target twice and others once, and uses a 20% accuracy increase; the DB confirms the identity only.
osrsreboxed-db says: Key 21015 identifies Dinh's bulwark; the DB item record does not encode its special-attack targeting or accuracy rules. These are compared against the linked Wiki source and TODO evidence.
Impact: Nearby targets receive no special hit; non-player targets do not receive the documented single hit, and the fixed accuracy differs from the code's acknowledged defensive-NPC rule.
Suggested fix direction (do NOT implement): Select target count and accuracy at roll time, and register the 11×11 area targeting behavior only in multicombat areas.

### [NEW-COMBAT-011] Soulflame horn Entice drains energy without granting its accuracy effect
Severity: Medium
Status: Open
Category: 9. Combat Formulas (also 18. Missing modern OSRS features and 21. Server-specific issues)
Location: `Typescript-RSPS/server/plugins/combat/specials/SoulflameHorn.SpecialAttack.js:10-43`; registration `server/plugins/combat/SpecialAttacks.plugin.js:75`; utility activation `server/src/main/typescript/elvarg/game/content/combat/CombatSpecial.ts:245-263`.
DB Reference: `READ-ONLY-DB/docs/items-json/30759.json` -> item 30759, Soulflame horn (identity only; special mechanics are not encoded in this record).
Description: Entice consumes 25% energy and plays activation effects, but does not grant the user or nearby players the documented next-melee accuracy effect.
Evidence:
Code currently does: The registered `skipAttack` utility special drains 25%, plays animation and graphic, and declares no accuracy-effect state or nearby-player processing. Utility activation invokes this method immediately. The source TODO notes the missing buff hook. Wiki [Soulflame horn](https://oldschool.runescape.wiki/w/Soulflame_horn#Special_attack) specifies that Entice buffs the user's next melee hit and up to three other players within three tiles; the user effect has no additional cost and each other player costs 25% energy. The DB record confirms item identity only.
osrsreboxed-db says: Key 30759 identifies Soulflame horn; its item record lacks special-attack mechanics. Mechanics are confirmed by the linked Wiki.
Impact: The user pays special energy and receives only activation effects; no user or ally receives the core next-melee accuracy benefit.
Suggested fix direction (do NOT implement): Resolve eligible nearby recipients, apply the effect to the user and configured allies, and debit energy according to the documented per-recipient costs.
### [NEW-ITEM-003] Adamant javelin definitions overstate ranged strength
Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:831,837`; live ammunition definitions `server/src/main/typescript/elvarg/game/content/combat/ranged/RangedData.ts:297,300,542`.
DB Reference: `READ-ONLY-DB/docs/items-json/829.json` -> item 829 Adamant javelin; `docs/items-json/835.json` -> item 835 Adamant javelin(p). Both records specify `equipment.ranged_strength=102`.
Description: The two active item-gameplay rows assign +107 ranged strength to adamant javelins instead of the authoritative +102; the active ballista ammunition definitions independently repeat 107 for item 829.
Evidence:
Code currently does: `BonusManager.update()` sums the equipped item's definition bonuses, and `DamageFormulas.maximumRangeHitDpsCalc()` uses the resulting ranged-strength slot in the ranged max-hit formula. The gameplay definitions for IDs 829 and 835 set bonus index 11 to 107. `RangedData.ADAMANT_JAVELIN` separately declares strength 107 and the ballista accepts that ammo definition, so ballista damage uses the same overstated amount.
osrsreboxed-db says: Exact keyed equipment records 829 and 835 both identify the Adamant javelin variants and specify ranged strength 102; adjacent Mithril (828/834) and Rune (830/836) rows match the authoritative 85 and 124 respectively, confirming this is a tier-specific value mismatch rather than a shifted bonus column.
Impact: Wielded/used adamant javelins contribute five excess ranged-strength points to the max-hit calculation, including when fired from a ballista; poisoned and unpoisoned forms are affected.
Suggested fix direction (do NOT implement): Align both item definitions and the ballista ammunition strength with the two authoritative 102 values, then recheck the complete javelin tier and poison-variant mapping.

### [NEW-ITEM-004] Dragonhide armour defensive bonuses exceed the item records
Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:1067,1101,1137,2489-2505,7376-7386,12329-12335,12383-12389`; ingestion `server/plugins/items/ItemDefinitionLoader.plugin.js:126-164`; aggregation `server/src/main/typescript/elvarg/game/model/equipment/BonusManager.ts:39-87`.
DB Reference: `READ-ONLY-DB/docs/items-json/1065.json`, `1099.json`, `1135.json`; base Blue/Red/Black IDs `2487,2489,2491,2493,2495,2497,2499,2501,2503`; Blue trim IDs `7374,7376,7382,7384`; Red trim IDs `12327,12329,12331,12333`; Black trim IDs `12381,12383,12385,12387`. Each exact keyed `equipment` object supplies the compared values.
Description: Active gameplay definitions overstate selected defence bonuses for Green, Blue, Red, and Black dragonhide armour and its checked body/chaps trim variants. The Red d'hide body and its two checked trim variants also understate ranged attack by 1.
Evidence:
Code currently does: `ItemDefinitionLoader.loadItemDefinitions()` copies supplied `bonuses` arrays into runtime definitions after name matching. `BonusManager.update()` sums those arrays from equipped item definitions into attack/defence bonuses (array indexes 0–4 attack, 5–9 defence). For Green IDs 1065/1099/1135, defence-stab/crush, stab/slash/crush/ranged, and stab/slash/crush/ranged respectively are TS +3/+4 vs DB +1/+2; +22/+16/+24/+22 vs +12/+15/+18/+17; and +40/+32/+45/+40 vs +18/+27/+24/+35.
The same keyed comparison found these TS → DB defence arrays (stab/slash/crush/magic/ranged): Blue vambraces 2487 `[4,3,5,4,0]` → `[2,3,3,4,0]`; Red vambraces 2489 `[5,4,6,6,0]` → `[3,4,4,6,0]`; Black vambraces 2491 `[6,5,7,8,0]` → `[4,5,5,8,0]`; Blue chaps 2493 `[25,19,27,14,25]` → `[13,16,20,14,20]`; Red chaps 2495 `[28,22,30,20,28]` → `[15,18,22,18,20]`; Black chaps 2497 `[31,25,33,28,31]` → `[18,20,26,23,26]`; Blue body 2499 `[45,37,50,30,45]` → `[23,30,30,28,40]`; Red body 2501 `[50,42,55,40,50]` → `[26,34,36,36,45]`; Black body 2503 `[55,47,60,50,55]` → `[30,38,45,45,50]`. The 12 listed base-ID-matched trim rows carry the corresponding same bonus arrays and their exact DB equipment values match those base item values. The base Red body ID 2501 and trim…
osrsreboxed-db says: These exact item records specify the lower defensive values and ranged attack 25 for the red body variants. Checked non-defensive bonuses and non-null requirements for the nine base items match, so their discrepancies are isolated to the listed bonus fields. Trim-row requirements are absent from the TS gameplay definitions; no requirement mismatch is claimed for them.
Impact: Equipping these items contributes inflated defensive bonuses to the corresponding rolls; the Red body variants additionally contribute one fewer ranged-attack point than their DB records. This finding covers only the enumerated base/trim IDs, not every dragonhide variant.
Suggested fix direction (do NOT implement): Align the enumerated active bonus arrays with their keyed item records, correct the Red body ranged-attack entries, and independently continue parity checks for other variants, including unverified beta forms.

### [NEW-ITEM-006] Gilded armour definitions overstate their Defence requirement

Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:3483,3485,3487-3490`; loader `server/plugins/items/ItemDefinitionLoader.plugin.js:126-164`; enforcement `server/src/main/typescript/elvarg/net/packet/impl/EquipPacketListener.ts:119-133`.
DB Reference: `READ-ONLY-DB/docs/items-json/3481.json` -> item 3481 gilded platebody; `3483.json` -> 3483 gilded platelegs; `3485.json` -> 3485 gilded plateskirt; `3486.json` -> 3486 gilded full helm; `3488.json` -> 3488 gilded kiteshield. Each exact `equipment.requirements` object specifies Defence 40.
Description: The five active gilded armour definitions require Defence 50, ten levels above the authoritative item records, preventing otherwise eligible level-40–49 players from equipping them through the ordinary equip route.
Evidence:
Code currently does: Active `item-gameplay.json` rows 3481, 3483, 3485, 3486, and 3488 each set requirement-array index 1 to 50. `Skill` order maps index 1 to Defence. `ItemDefinitionLoader.loadItemDefinitions()` loads each matching row's `requirements` into the runtime item definition, and `EquipPacketListener.equip()` compares that value with the player's maximum Defence level before equipping.
osrsreboxed-db says: The exact records for all five corresponding equipable gilded items specify `equipment.requirements.defence = 40`. Their bonuses match the corresponding active definitions; this finding is limited to the Defence threshold mismatch.
Impact: Players with Defence levels 40–49 are incorrectly denied the five gilded items through the ordinary equipment packet path.
Suggested fix direction (do NOT implement): Align each listed active requirement with its keyed item record and check other independently configured armour tiers for the same requirement drift.

### [NEW-ITEM-007] Base skillcape and hood definitions omit their level-99 requirements

Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:9751-9757,9760,9763,9766-9814,9950-9952,13342-13343`; loader `server/plugins/items/ItemDefinitionLoader.plugin.js:126-164`; requirement enforcement `server/src/main/typescript/elvarg/net/packet/impl/EquipPacketListener.ts:119-133`.
DB Reference: `READ-ONLY-DB/docs/items-json/<id>.json` -> base skillcape/hood IDs 9749, 9752-9755, 9758, 9761, 9764-9767, 9770-9812, 9948-9950, and 13340-13341; each cited exact equipment record specifies its associated skill requirement at level 99. Representative keys 9749 (Attack hood), 9753 (Defence cape), 9765 (Runecraft cape), 9948 (Hunter cape), and 13340 (Agility cape).
Description: Fifty-nine active base skillcapes and matching hoods omit the exact keyed level-99 skill requirement. With `requirements` absent, the standard equipment gate does not run for those items.
Evidence:
Code currently does: The listed active rows contain equipment slots and bonuses but omit `requirements`; the active item loader only applies that array when the source field exists. `EquipPacketListener.equip()` encloses its level checks in `if (requirements != null)`, so these rows bypass all equipment skill checks. The omissions affect the named base skillcape/hood IDs above, including Defence cape(s), Runecraft/Agility and other base skillcapes, plus the corresponding hoods. This finding excludes IDs covered by AUD-025 (Max capes/hoods) and all other item classes.
osrsreboxed-db says: The exact keyed item JSON equipment records specify the level-99 requirement for the associated skill on each of the 59 listed base items; sampled records 9749, 9753, 9765, 9948 and 13340 show `attack: 99`, `defence: 99`, `runecraft: 99`, `hunter: 99`, and `agility: 99` respectively. No other positive requirement is asserted for these sampled base items.
Impact: Players below the associated skill level 99 can equip these base capes/hoods through the standard equip route, contrary to the exact item requirements. Any separate acquisition or ownership gates were not audited.
Suggested fix direction (do NOT implement): Add the keyed skill requirement to each listed runtime item definition and verify adjacent variants in a separate bounded pass.

### [NEW-ITEM-008] Elite Void top and robe omit their equipment requirements

Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:13074-13075`; item IDs `Typescript-RSPS/server/src/main/typescript/elvarg/util/ItemIdentifiers.ts:11536-11537`; loader `server/plugins/items/ItemDefinitionLoader.plugin.js:126-164`; equip enforcement `server/src/main/typescript/elvarg/net/packet/impl/EquipPacketListener.ts:119-133`.
DB Reference: `READ-ONLY-DB/docs/items-json/13072.json:49-57` -> Elite void top (item 13072); `13073.json:49-57` -> Elite void robe (item 13073). Each exact equipment record specifies Attack, Strength, Hitpoints, Ranged, Magic, and Defence 42 plus Prayer 22.
Description: The two active elite Void equipment definitions omit all six skill-level requirements and the Prayer 22 gate present in their exact item records.
Evidence:
Code currently does: Active rows 13072 and 13073 define body/legs equipment and bonuses but no `requirements`; `ItemDefinitionLoader.loadItemDefinitions()` only assigns `requirements` when the row has that property. `EquipPacketListener.equip()` performs the skill check only when the retrieved requirements are non-null, so these items pass this ordinary equip gate without any of their listed requirements. The Void combat provider recognizes the elite top/robe IDs for elite set effects, and the Pest Control shop offers both items, confirming active runtime reachability. Their checked bonuses match the corresponding DB equipment values.
osrsreboxed-db says: The exact keyed records for items 13072 and 13073 both list `attack: 42`, `strength: 42`, `hitpoints: 42`, `ranged: 42`, `magic: 42`, `defence: 42`, and `prayer: 22`. The separate non-elite Void tops/robes/gloves and Void helms IDs 8839/8840/8842/11663/11664/11665 already define all these requirements in active TS rows, and their keyed DB records match; those are not included in this finding. A report duplicate scan found no existing issue for elite Void IDs/root cause; NEW-ITEM-007 is limited to the 59 skillcape/hood rows and AUD-025 to Max cape/hood.
Impact: Through the standard equip packet path, players who do not meet the elite Void items' exact combat and Prayer requirements can equip them, including after purchase through the active commendation shop. Set bonuses are separate from the missing equip gate.
Suggested fix direction (do NOT implement): Apply the keyed requirements to the active elite Void top and robe definitions, and verify only the intended equip path and any explicitly defined Void upgrades/variants.



### [NEW-ITEM-009] 3rd Age mage armour overstates its Defence requirement

Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
- Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:10340,10342,10344,10346` (items 10338, 10340, 10342, 10344); loader `server/plugins/items/ItemDefinitionLoader.plugin.js:157-164`; ordinary equip enforcement `server/src/main/typescript/elvarg/net/packet/impl/EquipPacketListener.ts:119-133`; skill indices `server/src/main/typescript/elvarg/game/model/Skill.ts:33-58`.
- DB Reference: `READ-ONLY-DB/docs/items-json/{10338,10340,10342,10344}.json:33-52`; each record requires Magic 65 and Defence 30. Item 10344 is the player-equipable 3rd Age amulet in the neck slot.
- Description: The active gameplay definitions require Defence 65 for the three 3rd Age mage armour pieces and the 3rd Age amulet, while their keyed DB records require Defence 30; Magic 65 matches for all four.
Evidence:
- Code currently does: The active rows for IDs 10338, 10340, 10342, and 10344 have positional requirements with Defence index 1 set to 65 and Magic index 6 set to 65. `ItemDefinitionLoader` copies those arrays to the runtime definition, and `EquipPacketListener` rejects equipment when any listed level exceeds the player's maximum level.
- osrsreboxed-db says: Each exact equipment record lists `magic: 65` and `defence: 30` for its corresponding item ID. The amulet record additionally confirms neck slot, Magic attack +15, and Magic defence +10. The requirement discrepancy for amulet 10344 is the same root cause as the three armour pieces already covered here, not a separate finding.
- Impact: Players with Defence 30–64 who meet Magic 65 are incorrectly denied the three armour pieces and amulet through the standard equip path.
- Suggested fix direction (do NOT implement): Align the four Defence requirement entries with their exact keyed records and continue parity checks on other item families independently.

### [NEW-ITEM-010] 3rd Age mage armour omits its Magic damage bonuses

Severity: Medium
Status: Open
Category: 1. Items & Equipment (also 10. Equipment Bonus Calculation and 19. Data consistency bugs)
Location: `Typescript-RSPS/server/data/definitions/item-gameplay.json:10340,10342,10344` (item IDs 10338, 10340, 10342); loader `server/plugins/items/ItemDefinitionLoader.plugin.js:157-164`; aggregation `server/src/main/typescript/elvarg/game/model/equipment/BonusManager.ts:7-8,29-33,43-50,76-85`; magic-damage consumer `server/src/main/typescript/elvarg/game/content/combat/formula/DamageFormulas.ts:325-340`.
DB Reference: `READ-ONLY-DB/docs/items-json/10338.json:46-47` (3rd age robe top), `10340.json:46-47` (3rd age robe), and `10342.json:46-47` (3rd age mage hat); each exact equipment record specifies `magic_damage: 1.0`.
Description: The active bonus arrays for the 3rd Age robe top, robe, and mage hat each set the Magic-damage bonus slot to 0, omitting the 1.0% bonus in the corresponding keyed records.
Evidence:
Code currently does: Each active row's 14-element `bonuses` array has index 12 set to 0. `BonusManager` aggregates that index into `otherBonus[MAGIC_STRENGTH]`; `DamageFormulas.applyMagicDamageBonus()` converts the resulting value to permille and applies it to player magic max hits. The item loader copies the active arrays and does not hydrate the DB's keyed equipment bonus data.
osrsreboxed-db says: The exact records for all three IDs carry `magic_damage: 1.0`, with their separate attack/defence fields represented in the active arrays. Duplicate scan found no existing finding for these item IDs or this bonus mismatch.
Impact: Each equipped piece contributes none of its recorded 1% Magic damage bonus to the inspected player magic-damage calculation; wearing all three omits the three piece bonuses together.
Suggested fix direction (do NOT implement): Represent the three 1.0% bonuses in the active runtime item definitions using the existing Magic-damage bonus slot and verify adjacent magic gear separately.



