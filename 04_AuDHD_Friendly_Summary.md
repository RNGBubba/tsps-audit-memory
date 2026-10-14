# Daily Audit Summary

> **Agentic entry point is [00_INDEX.md](00_INDEX.md) + [registry.json](registry.json).** This file is the human working view — current priorities, quick wins, and what's next. Detail lives in `findings/`+`pending/`+`completed/` + `registry.json`. Tree lives in `00_INDEX.md`. Reorg v1.2 2026-10-13 (updated through Wave 51): 40/217/253.

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

## Candidates — top families (sample 10, full list in pending/)

| Family | File | Count | Sample |
|---|---|---|---|
| Equipment bonus/requirement | pending/items/equipment.md | 28 | CAND-216 Bronze scim 1321 / CAND-217 Warhammer 1335-1347 |
| NPCs/Options | pending/world/npcs.md | 21 | Disciple 7670 slot-5 Check |
| Packets/Protocol | pending/protocol/packets.md | 20 | WIDGET_ACTION 219, OPNPC 50 |
| Shops | pending/shops/general-stores.md | 15 | Lumbridge/Varrock 1102/1362 |
| Bosses | pending/combat/bosses.md | 13 | Hydra 22973, KQ 963 |
| Crafting | pending/skills/crafting.md | 13 | Dragonstone 1631 138 vs 137.5 |
| Herblore | pending/skills/herblore.md | 13 | Prayer 139 88 vs 87.5 |
| Prayers | pending/prayer/prayers.md | 9 | Rigour 5451, Augury 38.5 |
| World/General | pending/world/general.md | 34 | Drew bucket 6771, Prim boots |

## How to use (reorg v1.2)

- **Need equipment issue?** → `pending/items/equipment.md` or `findings/skills.md`; filter `registry.json` by `"domain":"items/equipment"`.
- **Need attack/skill?** → `pending/skills/herblore.md`, `/farming.md`, `/agility.md`…; filter by `"domain":"skills/herblore"`.
- **Need Zulrah/KQ/Cerberus?** → `pending/combat/bosses.md` + `completed/combat.md`; filter by `"domain":"combat/bosses"`.
- **Need shop?** → `pending/shops/general-stores.md` + `completed/shops.md`.
- Tree + counts: 00_INDEX.md → document tree section.

## Latest — Waves 22-51 (1406+ scouts, through 2h/claws/halberds/spears/pickaxes/axes/maces/longswords/battleaxes/daggers/whip/godswords/barrows)

1406+ scouts drained offline since Wave 22 (62 HOLD/HOLD DUP + 2 new CAND-216/217 in Wave 41; 64 HOLD/HOLD DUP in Wave 42; 64 HOLD/HOLD DUP in Wave 43 — arrows/bolts/ammo + jewellery + capes/gloves/boots; 64 HOLD/HOLD DUP in Wave 44 — shields/kites + helms + legs/body; 64 HOLD/HOLD DUP in Wave 45 — dhides/mystic/infinity/barrows; 64 HOLD/HOLD DUP in Wave 46 — void/fighter/obsidian/dragon special weapons + ornament kits + jewellery; 64 HOLD/HOLD DUP in Wave 47 — herblore potions + smithing bars + fletching bows + cooking/fishing + farming seeds; 64 HOLD/HOLD DUP in Wave 48 — construction planks + mining ores + woodcutting logs + fishing/cooking + herblore secondaries/unf/grimy; 64 HOLD/HOLD DUP in Wave 49 — hunter + runecraft altars/runes/pouches + thieving/pickpocket/slayer/construction; 64 HOLD/HOLD DUP in Wave 50 — agility tickets/capes/courses + farming patches/mining + tanning/spinning/pottery/furnace/anvil/range/bank/altar/POH objects + world objectsickpocket + slayer helms + construction tools/tables). Waves 36-46 covered sapling/seed, Herblore, farming tree, melee weapons, ranged bows/staves, ammo/jewellery/capes, shields/helms/legs/body, dhide/mystic/barrows, and now void/fighter/obsidian/dragon specials. 2 earlier stream failures (W43 Adamant arrow 890 + Seers ring 6731 re-verified HOLD DUP offline). New in Wave 41: **CAND-216 Bronze scimitar 1321 defence_slash 0 vs 1** + **CAND-217 Iron/Steel/Black/Mithril/Adamant/Rune warhammer family 1335-1347 melee_strength drift 9/16/19/20/31/48 vs 11/18/22/27/39/62 (bronze 1337 clean)**. Registry 40/217/253. Reorg v1.2: findings/pending/completed per-domain with `file`+`domain` in registry. Legacy 01/02/03 frozen as provenance. See 05_Audit_Log.md for per-wave evidence and 00_INDEX.md for tree.
---
*Teams: fix from `findings/<domain>.md` + registry Open+High/Med first; investigate via `pending/<domain>/<sub>.md`. Full tables in `00_INDEX.md`.
