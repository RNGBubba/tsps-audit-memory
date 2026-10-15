# Daily Audit Summary

> **Agentic entry point is [00_INDEX.md](00_INDEX.md) + [registry.json](registry.json).** This file is the human working view - current priorities, quick wins, and what's next. Detail lives in `findings/`+`pending/`+`completed/` + `registry.json`. Tree lives in `00_INDEX.md`. Reorg v1.2 2026-10-15 (updated through Wave 85): 40/275/253.

## Quick Wins — Top 10 to fix first

| # | ID | One-liner | File |
|---|---|---|---|
| 1 | AUD-015 | Shop pricing/lerp discarded (sells_at/buys_at/change_per) | findings/shops-npcs.md |
| 2 | AUD-065 | Prayer mix 114xx vs 87.5 XP drift (88 vs 87.5) | findings/skills.md |
| 3 | AUD-001 | Elemental weakness dropped (NpcDefinitionLoader) | findings/combat.md |
| 4 | AUD-002 | Ranged defence light/standard/heavy → single | findings/combat.md |
| 5 | AUD-019 | Bank search discards text | findings/inventory-bank.md |
| 6 | AUD-028 | Trade escrow / withdrawal order | findings/inventory-bank.md |
| 7 | AUD-014 | Talk-to opens wrong shop | findings/shops-npcs.md |
| 8 | AUD-007 | PacketSender.write is no-op | findings/protocol.md |
| 9 | AUD-077 | Abyssal Sire pet handling | findings/drops.md |
| 10| AUD-021 | Prayer Deadeye/Mystic Vigour engine | findings/prayer-slayer.md |

## Candidates - top families (sample 10, full list in pending/)

| Family | File | Count | Sample |
| Equipment bonus/requirement | pending/items/equipment.md | 76 | CAND-216 Bronze scim 1321 / CAND-217 Warhammer 1335-1347 / CAND-218 Leaf-bladed 20727 + … + CAND-239 Corrupted AGS 28537 / CAND-241 Dragonfire 11284 / CAND-242 Crystal 4212 / CAND-243 Elysian 12817 / CAND-244 defenders / CAND-245 Hydra 23073 / CAND-249 Twisted buckler 21000 / CAND-250 Dinh 21015 / CAND-251 Inquisitor helm 24419 / CAND-252 3rdAge 10338 / CAND-253 Eternal 13235 / CAND-254 Zenyte 19547 / CAND-255 Skull 9013 / CAND-256 Guam 91 / CAND-257 Toxic staff 12902 / CAND-258 Thammaron 22552 / CAND-259 Nightmare 24422 / CAND-260 Bow Faerdhinen 25865 / CAND-261 Saeldor 25870 / CAND-262 Crystal halberd 23987 / CAND-263 Crystal armour 23971 / CAND-264 Gauntlet attuned 23902 / CAND-265 Steel kiteshield 1193 / CAND-266 Blue dhide 2499 / CAND-267 Ranger gloves 19994 / CAND-268 Seers 6731 / CAND-269 Crystal shield 23991 / CAND-270 Torva 26382 / CAND-271 Inquisitor 24420 / CAND-272 Ava accumulator 10499ystal 4212 + CAND-243 Elysian 12817 + CAND-244 Serpentine 12931 + CAND-245 defenders 8846-8849 + CAND-246 Hydra 23073/23075 + CAND-249 Twisted buckler 21000 + CAND-250 Dinh bulwark 21015 + CAND-251 Inquisitor helm 24419 + CAND-252 3rdAge 10338-10344 + CAND-253 Eternal 13235 + CAND-254 Zenyte 19547/19553 + CAND-255 Skull 9013 |
| NPCs/Options | pending/world/npcs.md | 21 | Disciple 7670 slot-5 Check |
| Packets/Protocol | pending/protocol/packets.md | 20 | WIDGET_ACTION 219, OPNPC 50 |
| Shops | pending/shops/general-stores.md | 15 | Lumbridge/Varrock 1102/1362 |
| Bosses | pending/combat/bosses.md | 13 | Hydra 22973, KQ 963 |
| Crafting | pending/skills/crafting.md | 14 | Dragonstone 1631 138 vs 137.5 + Zenyte 19496 200vs50 |
| Herblore | pending/skills/herblore.md | 16 | Prayer 139 88 vs 87.5 + Bastion 22461/Battlemage 22449 no route + Sanguinesti 22323/22481 Magic75 vs 82 + Guam unf 91 lvl1 vs 3 |
| Prayers | pending/prayer/prayers.md | 11 | Rapid Heal 10 3.0vs3.3, Smite 24 32vs40, Rigour 5451 |
| World/General | pending/world/general.md | 34 | Drew bucket 6771, Prim boots |
## How to use (reorg v1.2)

- **Need equipment issue?** → `pending/items/equipment.md` or `findings/skills.md`; filter `registry.json` by `"domain":"items/equipment"`.
- **Need attack/skill?** → `pending/skills/herblore.md`, `/farming.md`, `/agility.md`…; filter by `"domain":"skills/herblore"`.
- **Need Zulrah/KQ/Cerberus?** → `pending/combat/bosses.md` + `completed/combat.md`; filter by `"domain":"combat/bosses"`.
- **Need shop?** → `pending/shops/general-stores.md` + `completed/shops.md`.
- Tree + counts: 00_INDEX.md → document tree section.

## Latest — Waves 22-85 (3646+ scouts, through Wave 85 3 new CAND-273 gilded 3481/3483/3485 / CAND-274 Fremennik shirts 3767-3775 / CAND-275 decorative 4068-4072)
3326+ scouts drained offline since Wave 22 (62 HOLD/HOLD DUP + 2 new CAND-216/217 + 2 new CAND-218/219 + 128 HOLD + 4 new CAND-220/221/222/223 in Wave 41; 64 HOLD/HOLD DUP in Wave 42; 64 HOLD/HOLD DUP in Wave 43 — arrows/bolts/ammo + jewellery + capes/gloves/boots; 64 HOLD/HOLD DUP in Wave 44 — shields/kites + helms + legs/body; 64 HOLD/HOLD DUP in Wave 45 — dhides/mystic/infinity/barrows; 64 HOLD/HOLD DUP in Wave 46 — void/fighter/obsidian/dragon special weapons + ornament kits + jewellery; 64 HOLD/HOLD DUP in Wave 47 — herblore potions + smithing bars + fletching bows + cooking/fishing + farming seeds; 64 HOLD/HOLD DUP in Wave 48 — construction planks + mining ores + woodcutting logs + fishing/cooking + herblore secondaries/unf/grimy; 64 HOLD/HOLD DUP in Wave 49 — hunter/runecraft/thieving/slayer/construction; 64 HOLD/HOLD DUP in Wave 50 — agility/farming/mining + remaining parity; 5 stream-fail re-verified offline as HOLD DUP; 64 HOLD/HOLD DUP in Wave 51 2h/claws/halberds/spears/pickaxes/axes/maces/longswords/battleaxes/daggers/whip/godswords/barrows; 8 billing/stream-fail re-verified offline as HOLD; 64 HOLD/HOLD DUP in Wave 52 exhaustive + 4 new CAND-220/221/222/223; 64 HOLD/HOLD DUP in Wave 53 54 HOLD/HOLD DUP + 10 new CAND-224/225/226/227/228/229/230/231/232/233; 64 HOLD/HOLD DUP in Wave 54 63 HOLD/HOLD DUP + 1 new CAND-234 Claws; 64 HOLD/HOLD DUP in Wave 55 63 HOLD/HOLD DUP + 1 new CAND-235 Ancient mace; 60 HOLD/HOLD DUP in Wave 56 60 HOLD/HOLD DUP + 4 new CAND-236/237/238/239; 64 HOLD/HOLD DUP in Wave 57; 64 HOLD/HOLD DUP in Wave 58; 64 HOLD/HOLD DUP in Wave 59; 64 HOLD/HOLD DUP in Wave 60; 64 HOLD/HOLD DUP in Wave 61; 64 HOLD/HOLD DUP in Wave 62 axes/pickaxes/maces/longswords/battleaxes/daggers/halberds/spears/bolts + 1 new CAND-240 Halberd 3196-3204 Strength omit; 64 HOLD/HOLD DUP in Wave 63 axes/pickaxes/maces/longswords/battleaxes/daggers/halberds/spears/crossbows/bolts + 0 new CAND/CHK; 64 HOLD/HOLD DUP in Wave 64 axes/pickaxes/maces/longswords/battleaxes/daggers/halberds/spears/crossbows/darts/throwingaxes/bolts/salamanders/farming/agility/teleports/shops/bank/protocol/drops + 0 new CAND/CHK (64 ENOSPC re-verified offline); 64 HOLD/HOLD DUP in Wave 65 axes/pickaxes/maces/longswords/battleaxes/daggers/halberds/spears/crossbows/bolts + 0 new CAND/CHK; 64 HOLD/HOLD DUP in Wave 66-72 exhaustive re-verification + 64 HOLD/HOLD DUP in Wave73 56 HOLD/HOLD DUP + 8 new CAND-241/242/243/244/245/246/247/248 + 64 HOLD/HOLD DUP in Wave74 56 HOLD/HOLD DUP + 8 new CAND-249 Twisted buckler 21000 + CAND-250 Dinh bulwark 21015 + CAND-251 Inquisitor helm 24419 + CAND-252 3rdAge mage 10338-10344 + CAND-253 Eternal boots 13235 + CAND-254 Zenyte necklaces 19547/19553 + CAND-255 Skull sceptre 9013 + CAND-256 Guam unf 91. Registry 40/261/253.)
---
*Teams: fix from `findings/<domain>.md` + registry Open+High/Med first; investigate via `pending/<domain>/<sub>.md`. Full tables in `00_INDEX.md`.