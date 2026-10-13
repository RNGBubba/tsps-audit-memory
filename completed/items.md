# Completed — items

> **Verified clean** (19) — bounded no-mismatch checks. Skip re-auditing unless scope changes.

- **Granite footwear/trident exact-key review (IDs 21643/21649):** Active `Typescript-RSPS/server/data/definitions/item-gameplay.json:21645,21651` matches exact player-equipable DB records `READ-ONLY-DB/docs/items-json/21643.json` and `21649.json` for item identity, slot (Granite boots feet; Merfolk trident two-handed weapon), all 14 bonuses, requirements (Defence 50 for boots; none for trident), and numeric high/low alchemy. `21645` is a Granite boots placeholder with no active equipment slot and no exact DB key; `21647` is a noted Granite longsword variant with no active equipment slot and no exact DB key. The supplied IDs therefore are not a single four-piece Granite wearable set. `ItemDefinitionLoader.plugin.js:147-164`, `EquipPacketListener.ts:119-145`, `BonusManager.ts:39-50`, and `MagicOnItemPacketListener.ts:191-225` consume the checked active fields. Granite boots 21643 was already documented as matching in the prior Granite armour review at `05_Audit_Log.md:45`, so no additional mismatch or duplicate completion count is recorded for that item. Static comparison only; no runtime actions/tests/builds or TSPS/DB edits.

---

- **Trident of the Seas / Swamp charged vs uncharged equipment parity and charge gate (IDs 11907/11908/12899/12900):** Active `server/data/definitions/item-gameplay.json` entries `11907` (Trident of the Seas, `POWERED_STAFF`, `bonuses [0,0,0,15,0,2,3,1,15,0,0,0,0,0]`, `requirements [0×6,75]`) and `11908` (Uncharged trident, same bonuses/75), plus `12899` (Trident of the Swamp, `bonuses [0,0,0,25,0,2,3,1,15,0,0,0,0,0]`, `requirements [0×6,78]`) and `12900` (Uncharged toxic same), match exact `READ-ONLY-DB/docs/items-json/{11907,11908,12899,12900}.json` (`equipable:true, noted:false, slot weapon, attack_magic 15/25, defence_magic 15, magic_damage 0.0, Magic 75` for Seas/uncharged and `78` for Swamp/uncharged). Charged gating via `CombatSpells.TridentSpell.canCast` (`CombatSpells.ts: TridentSpell with TRIDENT_CHARGE_META_KEY/trident-charges, chargedWeaponId/unChargedWeaponId 11907/11908 and 12899/12900, checks `getMetaValue(TRIDENT_CHARGE_META_KEY)` >0 else `Your trident has run out of charges.` and resets combat, consumes `charges-1` on `del` and swaps id to uncharged when `remaining<=0`) and charging interaction `plugins/items/Trident.plugin.js` (`RECIPES` with `UNCHARGED→CHARGED + DEATH/CHAOS/5×FIRE + 10×COINS or 1×scales per charge, `TRIDENT_MAX_CHARGES 2500`, `refreshTridentState` id swap) were traced; no separate poison-immune bypass was verified for this slice (DB `immune_poison`/`immune_venom` fields exist but TridentSpell has no venom branch, and no venom-application failure on immune targets was demonstrated, so no candidate filed here). Bounded equipment-parity + charge-gate check only; no live cast damage test/builds; no TSPS/DB edits. Related `CHK-005` (Merfolk trident 21649) is distinct equipment family and not reused.

---

- **Obsidian helm 21298 / platebody 21301 / platelegs 21304 bonuses/slot/defence60 cache-retained + set effect wiring vs exact DB 21298/21301/21304 clean (3-piece, noted/placeholder linkage intact):** Active item-gameplay 21298 HAT [25,23,26,0,24,3] 21301 BODY [55,78,56,-15,60,3] 21304 LEGS [46,43,41,-10,40,1] each linked noted/placeholder + tradeability vs DB items-json 21298/21301/21304 equipable slot/requirements defence60 equipment bonuses/cost/alch/weight/linked IDs identical; ItemDefinitionLoader 126-164 retains cache defence60 when JSON requirements absent, EquipPacketListener 119-145 enforces, BonusManager consumes, ObsidianArmour HEAD/BODY/LEG + 6 TzHaar weapons + berserker 6/5 set effect wiring verified; weight integer truncation informational only; dup-screen 0 hits. — bounded clean check; files and DB keys as scouted. Verified no mismatch for sampled scope; no live build/test or TSPS/DB edits. Sample IDs 21298, 21301, 21304, 5573.

---

- **Dragon chainbody 3140 body Defence60 bonuses -15/81/93/98/-3/82 slot PLATEBODY trade true note3141 cost250k high150k low100k weight6.8 ornament 12534->12414 vs DB 3140 cost250k vs active value GE but bonuses/req/alchemy identical clean:** DB items-json 3140 Dragon chainbody slot body Defence60 bonuses -15,81,93,98,-3,82 cost250k low100k high150k weight6.803 buy70 placeholder14099 vs Active item-gameplay 3142 bonuses[0,0,0,-15,0,81,93,98,-3,82] requirements[0,60...] high150k low100k drop250k value639274 GE slot PLATEBODY note3141 weight6 + skill-requirements Defence60 + buy limits 70 + ornament 12534 kit + base3140->12414 gilded vs dup 2513 20428 28065 distinct; Loader copies bonuses/req/highAlch/dropValue + Equip Type hydrate PLATEBODY->body; value vs cost GE overlay weight truncation integer only divergences. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 3140, 3141, 14099, 12534, 12414, 60.

---

- **Torag set 4745 helm/4747 hammers/4749 platebody/4751 platelegs + Verac 4757/4759 brassard/plateskirt vs DB items 4745-4752/4757-4760 trade/members/noted/sellable/slot/req/bonuses parity clean (4756 noted, 4761-4764 Null not items, value/weight drift cache-ignored):** Active item-gameplay 4745 helm FULL_HELMET -6/-2 55/58/54 Def70 +4747 hammers WARHAMMER Attack70 +4749 platebody -30/-10 122/120/107 +4751 platelegs -21/-7 plate +Loader Barrows staging vs DB items cost/bonuses/req + Verac 4757/4759 brassard/plateskirt -6/-2 55/58 clean + value drift 1061263 vs 275000 same class as Torag price weight cache trunc inert. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4745, 4747, 4749, 4751, 4757, 4759, 70, 132.

---

- **Guthan set 4724 helm trade false vs true already CAND-149/160 but bonuses/slot/req clean + 4726 warspear 75/75/75 spear Atk70 vs DB identical clean + 4728 platebody -30/-10 122/120/107 Def70 vs DB identical clean + 4730 chainskirt -7 vs -11 already CAND-160:** Active 4724 helm FULL_HELMET -6/-2 55/58/54 Def70 trade false vs DB true already CAND-149 but slot/req/bonuses clean + 4726 spear 75/75/75 Atk70 weapon speed5 2h clean + 4728 platebody -30/-10 body 122/120/107 Def70 clean + 4730 chainskirt -7 vs -11 already CAND-160 index4 via BonusManager 4; loader ItemDefinitionLoader + EquipmentType correct. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4724, 4726, 4728, 4730, 70, -30.

---

- **Rune chainbody 1113 BODY -15/0 63/72/78 Defence40 vs DB -15/0 63/72/78 identical clean (Dragon duplicate 2513 NONE trade false inert vs 3140 chain 3140 clean, distinct from CAND-146 plate -10/-7 family index4 drift):** Active 1113 BODY -15/0 vs DB -15/0 63/72/78 Defence40 cost50k high30k low20k identical + Dragon dup 2513 NONE inert via ItemDefinitionLoader name-guarded vs DB duplicate true null vs CAND-146 1163/1127/1079 -2/-10/-7 vs -3/-15/-11 index4 drift distinct family. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1113, 2513, 1127, 1163, 1079, -15.

---

- **Dharok set 4718 greataxe -4/103 Atk70 Str70 2h vs DB 4718 identical + 4720 platebody -30/-10 body Def70 vs DB 4720 identical clean split (4716 helm MED already CAND-153 + 4722 legs -7 vs -11 already CAND-149 distinct):** Active 4718 greataxe -4/0/103/95/-4/-1 105 Atk70 Str70 axe 13 vs DB 4718 3.175 identical + 4720 platebody -30/-10 body 122/120/107 Def70 vs DB 9.979 identical clean vs 4716 helm MED vs DB FULL CAND-153 + 4722 platelegs -21/-7 vs -11 CAND-149 index4 vs BonusManager/Barrows base. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 4718, 4720, 4716, 4722, 103, -30.

---

- **Spindel 11998 (venenatis_singles) monsters-complete + spindel drops main128 vs DB 11998 byte-identical + Venenatis 6610 CHK-157 already control distinct singles 6792 is Ancestral key item not monster clean:** Active monsters-complete 11998 vs DB 11998 302 515 14 weakness 4/25 vs 6610 Venenatis 6610 byte-identical already CHK-157 + drops spindel 128 38 main vs DB spindel identical except noted flags + no spawn instanced singles lair + loader AUD-001/002. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11998, 6610, 6792, 128, 302, 14.

---

- **Dragon platebody 21892 BODY -30 -15 109 107 97 -6 106 Def60 vs DB 21892 body -30 -15 109 107 97 -6 106 Def60 via loader + equip gate byte-identical clean:** Active item-gameplay 21892 BODY slot 14-bonus [-30@3 -15@4 109@5 107@6 97@7 -6@8 106@9] + Def60 + 1.2M/800k alch + BODY_SLOT vs DB items-json 21892 slot body req Def60 attack_magic -30 ranged -15 109/107/97/-6/106 hydrates via ItemDefinitionLoader PLATEBODY->BODY_SLOT and checked by EquipPacketListener Skill DEFENCE 60 + BonusManager sum vs Accuracy/Damage confirms; 3140 chainbody already CHK-132 hold dup. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 21892, 3140, 109, 107, 97, 106, 60.

---

- **Armadyl godsword 11802 GODSWORD 2h [0,132,80,0,0,0,0,0,0,0,132,0,0,8] Attack75 750k/500k + special 50% 1.375x acc2x via SpecialAttack 7644/1211 vs DB 11802 132/80/132/8 Attack75 alch via loader clean:** Active item-gameplay 11802 bonuses [0,132,80,0,0,0,0,0,0,0,132,0,0,8] + req 75 Attack + GODSWORD 2h vs DB items-json 11802 slot2h 132/80 132str 8 prayer speed6 + skill-requirements 75 via ItemDefinitionLoader name-guarded + BonusManager index1/2/10/13 + Equip gate Attack index0 + ArmadylGodsword.SpecialAttack drain50 1.375* acc2 via DamageFormulas scaleSpecial floor vs Wiki 132/80 132 8 Attack75 50% 137.5% acc2 distinct from NEW-COMBAT-001 BGS 11804 and CAND ornate. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11802, 132, 80, 75, 50, 7644, 1211, 1375.

---

- **Berserker helm 3751 + Archer 3749 + Warrior 3753 + Farseer 3755 COIF/MED_HELMET HEAD_SLOT Def45 vs DB 3751 -5/-5 31/29/33/0/30 melee3 vs 3749 6/8/10 etc via loader vs CHK-068 obsidian distinct:** Active item-gameplay 3749/3751/3753/3755 COIF/MED_HELMET via ItemDefinitionLoader onto cache vs DB items-json 3751 Berserker -5/-5 defence 31/29/33/30 melee3 + 3749 Archer 6/8/10/6 + 3753 Warrior 5/0 31/33/29 vs 3755 Farseer -5/6 8/10/12 vs skill-requirements Def45 vs CHK-068 obsidian family 21298 dstinct but familiar fremennik helms via BonusManager + Equip gate Def45. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 3751, 3749, 3753, 3755, 45, 3, 6, 5.

---

- **Helm of Neitiznot 10828 COIF HEAD_SLOT defence 31/29/34/3/30 melee3 prayer3 Def55 vs DB 10828 defence 31/29/34/3/30 Def55 30k/20k via loader vs Fremennik Isles acquisition gate is Wiki not DB equip requirement:** Active item-gameplay 10828 bonuses [0,0,0,0,0,31,29,34,3,30,3,0,0,3] Def55 COIF -> HEAD_SLOT via ItemDefinitionLoader onto cache vs DB items-json 10828 31/29/34/3/30 melee3 prayer3 Def55 via skill-requirements 55 vs Equip gate Def55 Index1 + BonusManager index5-9 31-30 vs wiki Fremennik Isles quest award not DB equip field vs 70? distinct from Berserker family. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 10828, 31, 29, 34, 30, 3, 55, 30.

---

- **Bandos tassets 11834 LEGS 71/63/66/-4/93 melee2 Def65 + chestplate 11832 98/93/105/133 melee4 via loader vs DB 11834 Legs 2 vs 11832 Chest 4 vs 11836 Boots 0 (ticket 6203/6207 Null not Bandos, ornament 26718/26719 not vs 11832) distinct from wilderness:** Active item-gameplay 11832 chestplate PLATEBODY 98/93/105/-6/133 melee4 vs 11834 tassets LEGS 71/63/66/-4/93 melee2 vs DB items-json 11832 Chest 4 via chest via BonusManager index10 vs equip gate Def65 via ItemDefinitionLoader vs ticket 6203/6207 NONE Null no DB key + ornament (or) 26718 mirror via loader vs DB foot vs CHK-039 melee max vs CHK-109 Graardor chest already. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11834, 11832, 11836, 6203, 6207, 98, 93, 105.

---

- **Bandos boots 11836 BOOTS FEET -5/-3 17/18/19/0/15 prayer1 Def65 via BOOTS FEET slot 10 distinct from PLATEBODY 11832 98/93/105 CHK-109 and LEGS 11834 71/63/66 CHK-231 via loader EquipmentType PLATEBODY vs BOOTS:** Active item-gameplay 11836 boots BOOTS FEET slot10 bonuses [0,0,0,-5,-3,17,18,19,0,15,0,0,0,1] vs DB 11836 feet -5/-3 17/18/19/0/15 prayer1 Def65 via ItemDefinitionLoader onto cache vs CHK-109 chestplate 11832 PLATEBODY BODY slot4 + CHK-231 tassets LEGS 7 via distinct EquipmentType BOOTS 10 vs PLATEBODY 4 vs LEGS 7 with FEET/BODY gate. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 11836, 11832, 11834, -5, -3, 17, 18, 19, 15, 1, 65.

---

- **Bronze chainbody 1103 BODY -15/0 7/11/13 -3/9 clean vs DB 1103 via items-json byte-identical:** Active `item-gameplay.json:1105` Bronze chainbody 1103 BODY `[0,0,0,-15,0,7,11,13,-3,9]` vs DB `items-json/1103.json` `attack -15/0` defence 7/11/13/-3/9 slot body req null byte-identical via loader onto BonusManager index4. Distinct from platebody -10/-15 drift. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1103, -15, 0, 7, 11, 13, -3, 9.

---

- **Steel chainbody 1105 BODY -15/0 17/25/30 -3/19 Def5 byte-identical vs DB 1105 via items-json:** Active `item-gameplay.json:1107` Steel chainbody 1105 BODY `[0,0,0,-15,0,17,25,30,-3,19]` Def5 vs DB `items-json/1105.json` byte-identical 14 bonuses slot body req Def5. Loader BonusManager clean. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1105, -15, 0, 17, 25, 30, -3, 19.

---

- **Black chainbody 1107 BODY 22/32/39 -3/24 Def10 byte-identical vs DB 1107 via items-json:** Active `item-gameplay 1107` BODY `[0,0,0,-15,0,22,32,39,-3,24]` Def10 vs DB `1107.json` byte-identical. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1107, 22, 32, 39, -3, 24, 10.

---

- **Mithril chainbody 1109 BODY 25/35/42 -3/27 Def20 byte-identical vs DB 1109 via items-json:** Active `item-gameplay 1109` BODY `[0,0,0,-15,0,25,35,42,-3,27]` Def20 vs DB `1109.json` byte-identical. Alloys cost1950 low780 high1170. Bounded clean check. — bounded clean check; files and DB keys in 05_Audit_Log.md; IDs 1109, 25, 35, 42, -3, 27, 20.

---
*Last re-verified: Wave 45 — 2026-10-13 — 64 HOLD/HOLD DUP (dhides/mystic/infinity/barrows/proselyte/initiate/rogue/weight-reduction capes + barrows weapons parity; 1 stream-fail recovered). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-45 for per-wave evidence.*
