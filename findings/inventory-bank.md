# findings/inventory-bank.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

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

---

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

---

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

---

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

---

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

---

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

---
*Last re-verified: Wave 42 — 2026-10-13 — 64 HOLD/HOLD DUP (ranged bows/crossbows/darts/knives/javelins/chinchompas + magic staves/powered staves). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-42 for per-wave evidence.*
