# findings/shops-npcs.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---
*Last re-verified: Wave 40 — 2026-10-13 — all HOLD/HOLD DUP, 0 new CAND/CHK (700+ scouts Waves 22-40). Registry 40/215/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-40 for per-wave evidence.*
