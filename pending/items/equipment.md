# Pending — items/equipment

> **Candidates** (26) — need verification before promotion. Each is a **CAND**; triple-verify active + exact DB key + Wiki before filing. One root per entry.

- **Gloves of silence Hunter gate (ID 10075):** Active item row omits exact DB Hunter 54 requirement; ordinary equip checks no level when requirements are absent. Its pickpocket +5% and 62-failure wear-out are implemented. Candidate-only.

---

- **Cave horrors use melee rather than Magic defence for magical-melee accuracy (NPC IDs 1047–1051):** Active `monsters-complete.json:510-514` and exact DB records `READ-ONLY-DB/docs/monsters-json/{1047,1048,1049,1050,1051}.json:12-15` agree on `attack_type:["melee","magic"]`; active spawns include these IDs (`npc-spawns.json:1800-1815,7115-7149,21219-21252`). `NpcDefinitionLoader.resolveAttackType():122-129` prioritizes melee and stores one type; no Cave horror override was found. Default NPC selection (`NPC.ts:685-696`; `CombatFactory.ts:154-168`) therefore uses `MeleeCombatMethod`, whose inherited `accuracyDefenceType()` returns melee (`CombatMethod.ts:53-60`). `PendingHit.ts:279-283` passes that defence category to accuracy; `AccuracyFormulasDpsCalc.ts:414-449` uses melee defence bonuses. Current official [Magical melee](https://oldschool.runescape.wiki/w/Magical_melee) rules require Magic defensive bonuses while Protect from Melee fully protects; TSPS correctly maps this method's protection to Protect from Melee, but its accuracy defence is wrong. Candidate limited to magical-melee accuracy routing for IDs 1047–1051; special-attack effects were not audited. Duplicate-screened against AUD-001/AUD-002, NEW-COMBAT-002, and pending mixed-style/prayer candidates; no same Cave horror accuracy finding.

---

- **Mithril platebody 1121 ranged attack -10 vs DB/Wiki -15 post-2021 rebalance (active item-gameplay bonuses -30,-10 vs DB -30,-15); level/bars/xp unchanged:** Active item-gameplay 1123 item 1121 PLATEBODY bonuses [0,0,0,-30,-10,46,44,38,-6,44] vs DB items-json 1121 bonuses attack -30/-15 stab/slash cost5200 low2080 high3120 last_updated 2024-10-01 weight8.618 Defence20; Loader ItemDefinitionLoader + BonusManager consumes active array, Wiki Mithril platebody 2021-04-21 ranged -10->-15 rebalance, client correct; distinct from CAND-018 smelting interval 5 vs 4 ticks and flat-XP 10 candidate which remain separate roots. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Guthix blessed d'hide bracers 10376 alchemy drift 2400/1600 vs DB 3600/2400 (vs body 10378 7800/5200 chaps 10380 3600/2400 coif 10382 1200/800 exact):** Active item-gameplay 10376 GLOVES bonuses [-10,11,6,5,7,8,0,1] req40/70 high2400 low1600 vs DB items-json 10376 cost6000 low2400 high3600 slot hands req70/40 identical bonuses/slot/req but alchemy 33% low; Body 10378 PLATEBODY 7800/5200 + chaps 10380 3600/2400 + coif 10382 1200/800 each identical to DB 10378/10380/10382 cost13000/6000/2000; Loader ItemDefinitionLoader copies highAlch/lowAlch, MagicOnItem gates isHighAlch>0; 1-piece alchemy mismatch only, dup-screen 0 Guthix hits. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Adamant platebody 1123 attack ranged -10 vs DB -15 (defence Ranged matches) + weight 11 vs 11.339 (Smithing flat +10 XP already CAND-106, Mithril -10/-15 CAND-117 separate):** Active item-gameplay 1125 1123 PLATEBODY bonuses [0,0,0,-30,-10,65,63,55,-6,63] weight11 value9635 dropValue16640 high9984 low6656 Defence30 vs DB items-json 1123 cost16640 low6656 high9984 weight11.339 slot body Defence30 bonuses 0,0,0,-30,-15 /65,63,55,-6,63 - attack ranged -10 diverges -5 vs DB -15 defence Ranged 63 matches; Loader copies bonuses weight truncated; BonusManager consumes; Smithing SMITHABLE plate body 2361->1123 lvl88 bars5 varbit3216 correct per Wiki but flat +10 XP is existing CAND-106 generic not re-filed; separate from CAND-117 mithril. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Bronze med helm 1139 bonuses attack_ranged -1 vs DB 0 defence_ranged 4 vs DB 3 (Green dhide body 1135 already separate - see 805 audit) + item uses 1139 as helm conflated with green dhide body ask:** Active item-gameplay 1139 MED_HELMET bonuses [0,0,0,-3,-1,3,4,2,-1,4] equipmentType MED_HELMET vs DB items-json 1139 Bronze med helm members false slot head requirements null bonuses attack -3/-1? actually defence_ranged 3 vs 4 and attack_ranged 0 vs -1 two drifts vs DB 1139; Loader copies bonuses via ItemDefinitionLoader; 1139 was conflated with Green dhide body 1135 (which is distinct ID 1135 Green dhide body already covered by prior audit NEW-ITEM-004? but not in registry, distinct root); prior claim 05/FULL 1576 that 1139 clean contradicted; 1139 has no findings/pending entry; 1135 task conflation noted. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Volcanic whip 12773 + Frozen whip 12774 identical to 4151 in DB (82 slash 82 strength 4 speed Attack70 whip) but NO active item-gameplay row — therefore 0 bonuses/0 gate/no WHIP interface/no Energy Drain special + 4178 duplicate Abyssal whip divergent meta (stand 1832 vs 808 drop 6 vs 120k):** DB items-json 4151 82/82 Attack70 speed4 whip 0/0/0 + 12773 Volcanic 82/82 +12774 Frozen 82/82 identical equipment tradeable false + skill-requirements 4151:70 vs Active item-gameplay 4153 row 4151 bonuses [0,82,0,82] WHIP req70 equipSound2249 vs 4178 duplicate Abyssal whip same bonuses but stand1832 vs808 drop6 vs120001 note-1 + missing rows 12773/12774 so BonusManager 0 attack/strength via ItemDefinition no bonuses when absent loader only when present -> whip interface not gated; No registry volcanic whips pending. — triage via scout read-only audit (see 05_Audit_Log.md for full file:line and DB keys).

---

- **Rune full helm 1163 bonuses -2 vs DB -3 + platebody 1127 -10 vs -15 + platelegs 1079 -7 vs -11 attack_ranged only divergent (requirements Defence40 + alchemy 21120/39000/38400 clean, textual/value drift not filed):** DB items-json 1163 Rune full helm slot head req Defence40 bonuses attack -6/-3 defence30/32/27 vs active 1163 FULL_HELMET -6/-2 30/32/27 req40 + 1127 Rune platebody slot body req40 bonuses -30/-15 /82/80/72 vs active -30/-10 +1079 Rune platelegs -21/-11 /51/49/47 vs active -21/-7 - all attack_ranged 1 less negative (active less negative than DB) vs loaders BonusManager consumes active array; Weight truncated etc not filed; No duplicate registry hit 0; Stale completed FULL 1573 clean contradicted. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 1163, 1127, 1079, -2, -3, -10, -15, -7).

---

- **Dharok platelegs 4722 attack_ranged -7 vs DB -11 (3/4 Dharok pieces match) + Guthan helm 4724 tradeable false vs DB true in same range 4716-4726; weight 9.071 vs 9 etc diverged; Dharok set wiring correct:** DB items-json 4716 helm -3/-1 45/48/44/51 Def70 vs active match + 4718 greataxe 103/95/-4 105 vs match +4720 platebody 122/120/107 vs match +4722 platelegs 85/82/83 -21/-11 Def70 cost275k vs active -21/-7 platelegs -7 divergent -4 vs -11 + 4724 Guthan helm tradeable flag flips active false vs DB true in range 4716-4726; Weights all diverge; ItemDefinitionLoader overlay + Barrows dharoks set 4716/4720/4722/4718 + DharoksArmour hit modifier 1+missing*max/10000 + BarrowsEquipment degrade 90 ticks 1000 durability REPAIR_COSTS; dup 0 hits for Dharok/4716. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 4716, 4718, 4720, 4722, 4724, -7, -11, 70).

---

- **Dharok set additional divergences 4716 helm MED vs DB FULL + staged-100 4880 tradeable flag + Amulet of damned 12851/12853 definitions absent despite Barrows.ts constant (separate from 4722 -7 vs -11 CAND-149):** Barrows BASE_ITEMS SETS.dharoks [4716,4720,4722,4718] baseItemId 4856+index*6+stage isBroken hasFullSet/hasDamnedSet vs DharoksArmour meleeHit 1+missing*max/10000 + BarrowsEquipment degradation 90 ticks 1000 durability + DB items-json 4716 helm -3/-1 45/48/44/51 Def70 vs active MED vs DB FULL diverged staged helm100 4880 tradeable + amulet 12851 full tradeable +12853 used untradeable +10 atk +3 def +6 melee DB defines but TS item-gameplay 0 hits absent despite constant; Extends CAND-149 platelegs -7 vs -11 gap with 3 more fields. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 4716, 4720, 4722, 4718, 4880, 12851, 12853, 484).

---

- **Mystic hat (dusk) 23047 equipment FULL_HELMET vs DB head slot + Mystic 4089 base + 4091/4093/4095/4097 trade false zero alch weight0 vs DB trade true cost15000 + 26531 or absent + 20562 duplicate Null drift (dark/light 4099/4109 clean offsets):** Active item-gameplay 4089 Mystic hat Unknown weight0 value0 high0 low0 trade false HAT vs DB 4089 cost15000 low6000 high9000 weight0.453 trade true GE true +4099 dark A dark magical hat 9000/6000 weight0.4 clean +4109 light 9000/6000 clean; 23047 dusk A dusky weight0.453 FULL_HELMET vs DB head slot requirements Magic40 Defence20 bonuses 4/4; 20562 duplicate true cost10 Null vs active NONE weight0 UNKNOWN; 26531/26532 Mystic hat or absent beyond file; DB cache tradeability for base contradicts RSPS false sellable; no duplicate promotion, existing CAND for base alchemy remains candidate-only. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 4089, 4099, 4109, 23047, 20562, 26531, 14153, 15000).

---

- **Guthan chainskirt 4730 attack_ranged -7 vs DB -11 (distinct from Dharok 4722/4724 CAND-149 and CAND-153 Dharok helm MED; helm/warspear/platebody clean: 4724 trade false already CAND-149, 4726 75/75/75 clean, 4728 -30/-10 clean, 4732 Karil coif clean):** Active 4730 chainskirt -7 vs DB chainskirt -11/+82/75/72/73 bonus index 4 ranged vs DB -11; loader ItemDefinitionLoader + BonusManager index4; helm 4724 trade false vs true already CAND-149; warspear 4726 75/75/75 clean, platebody 4728 -30/-10 122/120/107 clean, Karil coif 4732 -1 clean; prior bounded Guthan candidate-only in 05_Audit_Log but absent from registry pending thus new CAND per integrator hold. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 4730, 4724, 4726, 4728, 4732, -7, -11).

---

- **Verac plateskirt 4759 attack_ranged -7 vs DB -11 (helm 4753 / flail 4755 / brassard 4757 clean; plateskirt leg -7 vs -11 pattern matches Torag/Dharok/Guthan legs index4):** Active 4759 LEGS -21/-7 vs DB -21/-11 + helm 4753 -6/-2 55/58/54 prayer3 clean + flail 4755 68/-2/82 warfare 72 doubleHanded + brassard 4757 -6/-2 81/95/85 clean + noted 4754/4756/4758/4760 NONE vs Loader EquipmentSounds 2240/2246/2241/2242 + BonusManager index4 + NpcIdentifiers Verac 1677. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 4759, 4753, 4755, 4757, -7, -11, 70, 132).

---

- **Dragon med helm 1149 attack_ranged -1 vs DB 0 (Defence60 head MED_HELMET -3 magic vs DB 0 ranged, Rune 1163 -2 vs -3 already CAND-146 full helm 11335 correct dragon full helm not 1163):** Active 1149 MED_HELMET -3/-1 vs DB -3/0 head Defence60 33/35/32/-1/34 cost100000 via Loader BonusManager index4 vs DB 1149 cost100000 weight1.36 + full helm 11335 -6/-3 Def60 correct distinct from 1163 Rune -6/-3 Def40 already CAND-146 + FULL_AUDIT stale clean contradicted. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 1149, 11335, 1163, -1, 0, 60).

---

- **Mithril helms 1143/1159 attack_ranged -1 vs DB 0 (med -3/-1 vs -3/0 and full -6/-2 vs -6/-3) Defence 20 correct + family 1145/1147/1149/1151/1153/1155/1157 same 1-point drift vs stale completed 1143 clean claim contradicted:** Active item-gameplay 1143 MED_HELMET -3/-1 and 1159 FULL_HELMET -6/-2 vs DB items-json 1143 -3/0 and 1159 -6/-3 both Defence20; same 1-point attack_ranged drift affects family 1145 Adamant med/1147 Rune med/1149 Dragon med/1151 Black med/1153 Iron full/1155 Bronze full/1157 Steel full like recent 1139/1149 candidates but distinct IDs. Loader ItemDefinitionLoader bonus copy via BonusManager index4; Equip gate Def20 (and null for 1153/1155) passes. Stale FULL_AUDIT_REPORT:1578 claim 1143/1109/1181 agree on every bonus is contradicted by exact -1 vs 0 comparison. Wiki Mithril med helm supports DB value when silent. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 1143, 1159, 1145, 1147, 1149, 1151, 1153, 1155, 1157, -1, 0, 20).

---

- **Ornament kit 20065 duplicate Map key collision — 6918 infinity hat ->12457 Dark vs 6918->12419 Light both map to key 20065|6918; loadKits overwrite drops one result (Dark infinity 12457 missing):** Active ornament-kits.json has 23 entries, 7 in 12538-20072; 23 total. Key 20065 appears with bases 6918->12457 Dark infinity hat and 6918->12419 Light infinity hat; loadKits() builds Map key kit|base so second overwrites first, dropping Dark infinity kit mapping. ApplyKit deletes kit and swaps base->result; noted filtered. Downstream stat gaps for resulting items (full helm -2 vs -3 etc.) are separate already-pending item candidates. Adjacent out-of-range missing kit 12536 noted as context. DB items-json 20065 Occult ornament kit presence only; 6918/12419/12457 are infinity hats. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 20065, 6918, 12457, 12419, 12538, 23).

---

- **Moons of Peril moon armour family sparse item-gameplay coverage — present 28988 spear/29000 atlatl + truncated 29016/29035/29045 equipSound-only vs absent 29004/29007/29010/29013/29019/29022/29025/29028 and broken 29049-29073 variants rely on cache, monsters 13011-13013 byte-identical but 13485-13487 Enraged absent:** Active monsters-complete 13011 Blood Moon/13012 Eclipse/13013 Blue Moon byte-identical to DB 3400-3430 but 13485-13487 Enraged variants missing (gap 13484->13488). Item-gameplay sparse: present 28988/29000/29849 full bonuses/requirements but 29016/29035/29045 truncated equipSound-only rows and absent 29004/29007/29010+ rely on cache via ItemDefinitionLoader name-match gate. ItemIdentifiers declares full 28988-29047 family runtime IDs exist; Wiki when DB silent for equip slots. No prior moon candidate filed. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 28988, 29000, 29004, 29007, 29010, 29013, 29019, 29022, 13011, 13013, 13485).

---

- **Steel platebody 1119 ranged attack -10 vs DB/Wiki -15 post-2021 rebalance (active item-gameplay -30,-10 vs DB -30,-15) + family platelegs/plateskirt -7 vs -11 helm/shield -2 vs -3 drifts:** DB items-json 1119 Steel platebody cost2000 hg1200 lw800 defence 32/31/24/-6/31 slot body Def5 attack -30/-15 active item-gameplay 1119 PLATEBODY bonuses -30/-10 via ItemDefinitionLoader onto BonusManager index4; same 1-point platelegs/plateskirt -7 vs -11 (1069/1083) and helm -2 vs -3 (1157/1193) family drift starches but platebody -10 vs -15 is the distinct post-2021 rebalance root shared with mithril 1121 (CAND-117) adamant 1123 (CAND-128) rune 1127 (CAND-146) yet distinct ID. Stale FULL 1570 clean claim contradicted. Wiki supports -15. — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 1119, 1120, 1121, 1123, 1127, -10, -15, 1069, 1083, 1157).

---

- **Bronze platebody 1117 PLATEBODY -10 vs DB -15 attack_ranged drift (distinct from CHK-185 chain 1113 and CAND-117/128/199 plate family):** Active `item-gameplay.json:1119` Bronze platebody 1117 PLATEBODY `[0,0,0,-30,-10,15,14,9,-6,14]` weight9.5 high96 low64 vs DB `items-json/1117.json:40` cost160 low64 high96 weight9.979 slot body attack -15 defence 15/14/9/-6/14 req null. Loader copies bonuses verbatim; BonusManager index4 `ATTACK_RANGE` sums -10 vs -15. Chainbody 1113 `BODY -15/0` CHK-185 distinct. Wiki Mithril 1121 rebalance -10->-15 post-2021 applies. Bounded candidate; distinct ID 1117 vs 1113/1119.

---

- **Iron platebody 1115 PLATEBODY -10 vs DB -15 attack_ranged drift (distinct from Bronze 1117 and Rune 1127 CAND-146):** Active `1115` PLATEBODY `[-30,-10,21,20,12,-6,20]` vs DB `1115.json` cost560 low224 high336 attack -30/-15 defence 21/20/12/-6/20 slot body req null. Loader/BonusManager index4 drift -10 vs -15. Wiki rebalance applies. Distinct ID 1115 not in registry; CAND-146 is Rune 1127. Bounded candidate.

---

- **Black platebody 1125 PLATEBODY -10 vs DB -15 attack_ranged drift (med helm 1151 already CAND-189 distinct):** Active `1125` PLATEBODY `[-30,-10,41,40,30,-6,40]` Defence10 vs DB `1125.json` attack -30/-15 defence 41/40/30/-6/40 cost3840 low1536 high2304. Loader index4 drift. Med helm 1151 `MED_HELMET -1 vs 0` already CAND-189 family; this plate 1125 is distinct body slot. Bounded candidate.

---

- **Iron med helm 1137 MED_HELMET -1 vs DB 0 attack_ranged drift (distinct from Iron full 1153 CAND-189 and Bronze med 1139 CAND-133):** Active `1137` MED_HELMET `[-3,-1,4,5,3,-1,4]` vs DB `1137.json` -3/0 defence 4/5/3/-1/4 slot head req null. Loader BonusManager index4 MED drift -1 vs 0. Full helm 1153 `FULL_HELMET -2 vs -3` already CAND-189 hold; Bronze med 1139 already CAND-133. This MED 1137 is distinct ID not in registry. Bounded candidate.

---

- **Iron/Steel/Mithril/Adamant platelegs 1067/1069/1071/1073 all -7 vs DB -11 attack_ranged drift family (distinct from platebody -10/-15 family):** Active `1067` Iron LEGS `[-21,-7,11,10,10,-4,10]` no req vs DB `1067.json` -21/-11; `1069` Steel LEGS `[-21,-7,17,16,15,-4,16]` vs DB -11; `1071` Mithril LEGS `[-21,-7,24,22,20,-4,22]` vs DB -11; `1073` Adamant LEGS `[-21,-7,33,31,29,-4,31]` vs DB -11. All BonusManager index4 LEGS tier -7 vs -11 systematic. Distinct from platebody -10/-15 and Rune legs 1079 CAND-146 -7 vs -11 but that is Rune tier; this family is Iron-Steel-Mithril-Adamant legs. One root cause four IDs. Bounded candidate.

---

- **Dragon sq shield 1187 attack_ranged -2 vs DB 0 drift — pre-2021 stale (WA21-04-21 rebalance), all other 13 bonuses/slot/Def60 clean:** Active `item-gameplay.json:1189` Dragon sq shield 1187 SHIELD bonuses `[0,0,0,-6,-2,50,52,48,0,50]` Def60 vs DB `items-json/1187.json` equipment `attack_ranged 0` defence 50/52/48/0/50 slot shield Def60 cost500k. All other 13 bonuses + slot + req Def60 + alch byte-identical. Loader copies bonuses verbatim; BonusManager index4 `ATTACK_RANGE -2 vs 0`. Wiki Changes 2021-04-21 `ranged -2->0` confirms stale. No prior 1187 candidate; FULL_AUDIT_REPORT:1581 false clean contradicted. Bounded candidate.

---

- **Bronze kiteshield 1189 SHIELD -2 vs DB -3 attack_ranged drift (1-point less negative, WA21-04-21 rebalance family, gilded 12213/12223 clean control):** Active `item-gameplay.json:1191` Bronze kiteshield 1189 SHIELD `[0,0,0,-8,-2,5,7,6,-1,6]` vs DB `items-json/1189.json` `attack_ranged -3` defence 5/7/6/-1/6 slot shield req null byte-identical except index4 -2 vs -3. Loader copies verbatim onto BonusManager ATTACK_RANGE=4. Wiki Changes 2021-04-21 `ranged -2->-3`. No prior 1189 entry; gilded bronze 12213/12223 match control. Bounded candidate.

---

- **Iron kiteshield 1191 SHIELD -2 vs DB -3 attack_ranged drift (WA21-04-21 rebalance, same family as Bronze 1189):** Active `item-gameplay.json:1193` Iron kiteshield 1191 SHIELD `[0,0,0,-8,-2,8,10,9,-1,9]` vs DB `items-json/1191.json` `attack_ranged -3` defence 8/10/9/-1/9 slot shield req null. Same 1-point -2 vs -3 drift as Bronze 1189; Adamant 1199 variant same family but filed separately; steel/mithril pending family CAND-199 distinct. Loader BonusManager index4. Wiki -2->-3 rebalance. No prior 1191 entry. Bounded candidate.
- Continue the broad item, skill, combat, world/object, packet, dialogue, NPC option/service, shop, prayer, drop, and container audits using exact active data, runtime consumers, exact DB keys, current official mechanics where needed, and duplicate screening. See `00_INDEX.md` and `04_AuDHD_Friendly_Summary.md` for current navigation/status.
