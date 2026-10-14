# Daily Audit Summary

> **Agentic entry point is [00_INDEX.md](00_INDEX.md) + [registry.json](registry.json).** This file is the human working view - current priorities, quick wins, and what's next. Detail lives in `findings/`+`pending/`+`completed/` + `registry.json`. Tree lives in `00_INDEX.md`. Reorg v1.2 2026-10-14 (updated through Wave 60): 40/239/253.

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
|---|---|---|---|
| Equipment bonus/requirement | pending/items/equipment.md | 46 | CAND-216 Bronze scim 1321 / CAND-217 Warhammer 1335-1347 / CAND-218 Leaf-bladed 20727 / CAND-219 Brine 11037 / CAND-220 Leaf 11902 / CAND-221 Hasta 11371 / CAND-222 Inquisitor 24417 / CAND-223 Ghrazi 22324 / CAND-224 dart family 806-810 / CAND-225 Mithril crossbow 9181 / CAND-226 Twisted bow 20997 / CAND-227 Scythe 22325 / CAND-228 Dragon hunter 21012 / CAND-229 throwing axe 802 / CAND-230 Amethyst 11388 / CAND-231 Zenyte / CAND-232 Rapid Heal / CAND-233 Smite / CAND-234 Claws 3097-3101 / CAND-235 Ancient mace 11061 / CAND-236 High-ID ornamental 20000-20047 / CAND-237 Shaman mask 21838 / CAND-238 Ancient godsword 26233 / CAND-239 Corrupted AGS 28537 |
| NPCs/Options | pending/world/npcs.md | 21 | Disciple 7670 slot-5 Check |
| Packets/Protocol | pending/protocol/packets.md | 20 | WIDGET_ACTION 219, OPNPC 50 |
| Shops | pending/shops/general-stores.md | 15 | Lumbridge/Varrock 1102/1362 |
| Bosses | pending/combat/bosses.md | 13 | Hydra 22973, KQ 963 |
| Crafting | pending/skills/crafting.md | 14 | Dragonstone 1631 138 vs 137.5 + Zenyte 19496 200vs50 |
| Herblore | pending/skills/herblore.md | 13 | Prayer 139 88 vs 87.5 |
| Prayers | pending/prayer/prayers.md | 11 | Rapid Heal 10 3.0vs3.3, Smite 24 32vs40, Rigour 5451 |
| World/General | pending/world/general.md | 34 | Drew bucket 6771, Prim boots |
## How to use (reorg v1.2)

- **Need equipment issue?** → `pending/items/equipment.md` or `findings/skills.md`; filter `registry.json` by `"domain":"items/equipment"`.
- **Need attack/skill?** → `pending/skills/herblore.md`, `/farming.md`, `/agility.md`…; filter by `"domain":"skills/herblore"`.
- **Need Zulrah/KQ/Cerberus?** → `pending/combat/bosses.md` + `completed/combat.md`; filter by `"domain":"combat/bosses"`.
- **Need shop?** → `pending/shops/general-stores.md` + `completed/shops.md`.
- Tree + counts: 00_INDEX.md → document tree section.

## Latest — Waves 22-60 (2046+ scouts, through Wave 58 exhaustive 64 HOLD/HOLD DUP re-verification)

2046+ scouts drained offline since Wave 22 (62 HOLD/HOLD DUP + 2 new CAND-216/217 + 2 new CAND-218/219 + 128 HOLD + 4 new CAND-220/221/222/223 in Wave 41; 64 HOLD/HOLD DUP in Wave 42; 64 HOLD/HOLD DUP in Wave 43 — arrows/bolts/ammo + jewellery + capes/gloves/boots; 64 HOLD/HOLD DUP in Wave 44 — shields/kites + helms + legs/body; 64 HOLD/HOLD DUP in Wave 45 — dhides/mystic/infinity/barrows; 64 HOLD/HOLD DUP in Wave 46 — void/fighter/obsidian/dragon special weapons + ornament kits + jewellery; 64 HOLD/HOLD DUP in Wave 47 — herblore potions + smithing bars + fletching bows + cooking/fishing + farming seeds; 64 HOLD/HOLD DUP in Wave 48 — construction planks + mining ores + woodcutting logs + fishing/cooking + herblore secondaries/unf/grimy; 64 HOLD/HOLD DUP in Wave 49 — hunter/runecraft/thieving/slayer/construction; 64 HOLD/HOLD DUP in Wave 50 — agility/farming/mining + remaining parity; 5 stream-fail re-verified offline as HOLD DUP; 64 HOLD/HOLD DUP in Wave 51 2h/claws/halberds/spears/pickaxes/axes/maces/longswords/battleaxes/daggers/whip/godswords/barrows; 8 billing/stream-fail re-verified offline as HOLD; 128 HOLD in Wave 52 (hastas/javelins/knives/darts/throwing axes/blowpipe/leaf/salamander/chinchompa/staves/tumeken/crossbows/broad/bank/world/combat/skills); 64 W53 54 HOLD/HOLD DUP + 10 new CAND-224/225/226/227/228/229/230/231/232/233 + 64 W54 63 HOLD/HOLD DUP + 1 new CAND-234 Claws + 64 W55 63 HOLD/HOLD DUP + 1 new CAND-235 Ancient mace 11061 + 64 W56 60 HOLD/HOLD DUP + 4 new CAND-236/237/238/239 high-ID ornamental + shaman mask + godswords + 64 W57 64 HOLD/HOLD DUP + 64 W58 64 HOLD/HOLD DUP) re-verified offline — 40/239/253.
---
*Teams: fix from `findings/<domain>.md` + registry Open+High/Med first; investigate via `pending/<domain>/<sub>.md`. Full tables in `00_INDEX.md`.