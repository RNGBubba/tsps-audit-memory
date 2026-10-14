# Daily Audit Summary

> **Agentic entry point is [00_INDEX.md](00_INDEX.md) + [registry.json](registry.json).** This file is the human working view - current priorities, quick wins, and what's next. Detail lives in `findings/`+`pending/`+`completed/` + `registry.json`. Tree lives in `00_INDEX.md`. Reorg v1.2 2026-10-14 (updated through Wave 62): 40/240/253.

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

## Latest — Waves 22-62 (2174+ scouts, through Wave 62 exhaustive 64 HOLD/HOLD DUP re-verification (Wave 62: 63 HOLD/HOLD DUP + 1 new CAND-240 Halberd 3196-3204 Strength 5/10/15/20/30 omit + 1 stream-fail re-verified offline as CAND-240)
---
*Teams: fix from `findings/<domain>.md` + registry Open+High/Med first; investigate via `pending/<domain>/<sub>.md`. Full tables in `00_INDEX.md`.