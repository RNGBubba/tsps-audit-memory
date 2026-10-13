# findings/skills.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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

---

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
