# Pending — combat/monsters

> **Candidates** (4) — need verification before promotion. Each is a **CAND**; triple-verify active + exact DB key + Wiki before filing. One root per entry.

- **Nechryael Soft clay noted-drop export omission (NPC 11, item 1761):** Active `Typescript-RSPS/server/data/definitions/npc-drops.json:134626-134631,134837-134848,211042-211050` maps NPC 11 to `nechryael` and marks 25 Soft clay noted (4/116); active spawns include NPC 11 at `npc-spawns.json:9276-9298`. Exact authoritative `READ-ONLY-DB/docs/drops-json/npc-drops.json:133775-133780,133985-133996,209775-209783` maps the same NPC/table and matches item, quantity, weight, out-of, and rarity, but omits noted-output metadata. Current OSRS Wiki [Nechryael](https://oldschool.runescape.wiki/w/Nechryael) says 25 Soft clay are noted. `NpcDrops.plugin.js:177-217,323-339,437-455,463-489` preserves the active note flag and materializes the noted item from its linked definition. Candidate-only as a DB export metadata omission; actual drop behavior matches the current official rule.

---

- **Gargoyle 412/413 hammer smash requirement absent — rock hammer 4162 / granite hammer 21742 / thrownhammer 21754 have identities/bonuses/req clean but no active item-on-NPC Smash handler; Wiki requires hammer at ~9 HP via rock/granite/thrownhammer, active allows kill without hammer:** Active monsters-complete 412/413 + 1543 duplicate Gargoyle stats byte-identical to DB 412/413 (111/105/11 slash slayer75). Items 4162 Rock hammer cost500 and 21742 Granite hammer cost64k bonuses/req clean vs DB items-json same. But plugin grep for gargoyle/GARGOYLE/4162/Smash finds 0 handlers; hammer is item-on-NPC not option, no consumer enforces low-HP hammer smash. Wiki Gargoyle requires Slayer 75 + rock/granite/thrownhammer smash at ~9 HP. Distinct from CAND-069 granite hammer special miss 5 damage candidate (21742-21744 special attack path). — triage via scout read-only audit (see 05_Audit_Log.md for full `file:line` evidence; IDs 412, 413, 1543, 4162, 21742, 21754, 75, 9).

---

- **Nechryael 11 (and 8/7278) death spawns 2x Death spawn 10 never summoned — stats CHK-238 hold but summon handler absent:** DB/TSPS `monsters-complete.json` 11 Nechryael max11 crush slayer80 + 8 normal + 7278 Greater max21 byte-identical via loader. Wiki Nechryael on death spawns 2x Death spawn 10 lvl46 attack. Active grep `death.?spawn|Nechryael` plugins 0 hits; no summon handler. Spawns reachable Slayer Tower 3403,9968. Stats parity HOLD via CHK-238; summon is distinct root not in CAND-011 (1761 noted) or CHK-238. Bounded candidate.

---

- **Cockatrice 419/420 mirror shield damage gate absent — stats byte-identical but no shield check (distinct from Basilisk 417 CAND-207):** DB `monsters-json/419.json` Cockatrice 37hp max1 stab slayer25 vs active `monsters-complete.json:187-188` byte-identical; 422 Rockslug 27hp is not cockatrice (ticket mislabels). Wiki Cockatrice requires mirror shield or stats drained/heavily reduced damage without shield; DB has no shield field; grep `mirror` server 0 handlers; no `CombatFactory` shield check; Mirror shield 4156 slayer25 defence20 stocked via Slayer Equipment 1324. No cockatrice pending exists; Basilisk 417 already CAND-207 distinct. Bounded candidate.
