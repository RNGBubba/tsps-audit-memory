# TSPS Audit — Memory Bank Index

> **Machine-readable source of truth:** [`registry.json`](registry.json) — one JSON object with every finding, candidate, and completed check. Agents: read this first.

## Status snapshot (auto-synced to `registry.json` v1.2 - 2026-10-14 Waves 22-78 3198+ scouts (62 HOLD/HOLD DUP + 2 new CAND-216/217 in Wave 41 + 64 HOLD/HOLD DUP in Wave 42 + 64 HOLD/HOLD DUP in Wave 43 + 64 HOLD/HOLD DUP in Wave 44 + 64 HOLD/HOLD DUP in Wave 45 + 64 HOLD/HOLD DUP in Wave 46 + 64 HOLD/HOLD DUP in Wave 47 herblore/smithing/fletching/cooking/farming + 64 HOLD/HOLD DUP in Wave 48 construction/planks + mining/woodcutting/fishing/cooking + herblore unf/grimy + 64 HOLD/HOLD DUP in Wave 49 hunter/runecraft/thieving/slayer/construction + 64 HOLD/HOLD DUP in Wave 50 agility/farming/mining + remaining parity + 5 stream-fail re-verified offline as HOLD DUP + 64 HOLD/HOLD DUP in Wave 51 2h/claws/halberds/spears/pickaxes/axes/maces/longswords/battleaxes/daggers/whip/godswords/barrows + 8 billing/stream-fail re-verified offline HOLD DUP + 64 HOLD/HOLD DUP in Wave52 axes/scim/warhammer/leaf/sabre/hasta/inquisitor/ghrazi/dart/crossbow/bow/scythe/dhcb/thrownaxe/amethyst/zenyte/prayers/shops/bank/world + 64 HOLD/HOLD DUP in Wave53 darts/crossbows/twisted/scythe/dhcb/thrownaxe/amethyst/zenyte/prayers/world + 64 HOLD/HOLD DUP in Wave54 claws/spears/axes/maces/longswords/battleaxes/daggers/whip/godswords/blowpipe/inquisitor/ghrazi + 64 HOLD/HOLD DUP in Wave55 high-ID ornamental/shaman/godswords + 64 HOLD/HOLD DUP in Wave56 exhaustive 1300-1350/mystic/Graceful/starters + 64 HOLD/HOLD DUP in Waves57-73 exhaustive beyond CAND-248 2h/scim/dagger/battleaxe/claws/elder/bludgeon/defender/shield/spirit/bow/ballista/knife/javelin/trident/kodai/capecape/serp/bandos/armadyl/potion/slayer/agility/farming/shop/npc/KQ/protocol + 64 scouts in Wave74 exhaustive ancestral/torva/anguish/buckler/bulwark/justiciar/inquisitor/ghrazi/ballista/boots/3rdAge/graceful/void/cape/salve/occult/fury/lance/sceptre/tentacle/chinchompa/bow/crossbow/cannonball/herblore unf/cooking/slayer/prayer/farming/agility/world/shop/bank/protocol/boss/drops/woodcutting/mining/fletching/crafting/smithing 56 HOLD/HOLD DUP + 8 new CAND-249 Twisted buckler 21000 + CAND-250 Dinh bulwark 21015 + CAND-251 Inquisitor helm 24419 + CAND-252 3rdAge mage 10338-10344 + CAND-253 Eternal boots 13235 + CAND-254 Zenyte necklaces 19547/19553 + CAND-255 Skull sceptre 9013 + CAND-256 Guam unf 91))

| Bucket | Count | Where |
|---|---|---|
| **Accepted findings** (bugs that are verified broken) | **40** - 2 High, 34 Medium, 4 Low | [`findings/`](findings/) + `findings[]` in `registry.json` |
| **Candidates** (need verification before promotion) | **264** | [`pending/`](pending/))) + `pending_candidates[]` (`CAND-001...CAND-264`) |
| **Verified clean** (bounded no-mismatch) | **253** | [`completed/`](completed/) + `completed_checks[]` (`CHK-001`...`CHK-253`) |
| **No duplicate IDs** | 0 duplicated AUD/CAND/CHK IDs | See deduplication report below |

## Document tree — find anything without opening files

Each `registry.json` entry carries `file` + `domain` so you can locate issues by folder without reading every markdown.

```
Memory/
├── 00_INDEX.md              ← you are here (tree + tables)
├── registry.json            ← v1.2, every entry has file + domain
├── 05_Audit_Log.md          ← append-only wave log (Waves 22-35 HOLD)
├── 04_AuDHD_Friendly_Summary.md  ← Top 10 + next steps (trimmed)
├── findings/                ← 40 AUD (8 files)
│   ├── skills.md            12  — XP, herblore, smithing, etc.
│   ├── shops-npcs.md         8  — shop pricing, dialogue → shop
│   ├── combat.md             7  — elemental weakness, ranged defence
│   ├── inventory-bank.md     6  — bank search, trade, containers
│   ├── drops.md              3  — hydra, drop tables
│   ├── protocol.md           2  — PacketSender, opcode 50
│   ├── prayer-slayer.md      1
│   └── items-equipment.md    1
├── pending/                 <- 264 CAND (21 files)
│   ├── world/
│   │   ├── general.md       34  - Zeah shops, diaries, teleports, misc
│   │   ├── npcs.md          21  - Talk-to slots, NPC handlers
│   │   └── objects.md        3  - altars, ladders, portals
│   ├── items/
│   │   └── equipment.md     68  - platebody/chain/kite/helm/scimitar/warhammer/bonus + high-ID ornamental 20000-20047 + shaman mask 21838 + godswords 26233/28537 + dragonfire 11284 + crystal 4212 + Elysian 12817 + Serpentine 12931 + defenders 8846-8849 + Hydra 23073/23075 + Twisted buckler 21000 + Dinh bulwark 21015 + Inquisitor 24419 + 3rdAge 10338-10344 + Eternal 13235 + Zenyte 19547/19553 + Skull 9013 + Toxic staff 12902 + Thammaron 22552 + Nightmare 24422-24425 + Bow Faerdhinen 25865 + Blade Saeldor 25870 + Crystal halberd 23987 + Crystal armour 23971 + Gauntlet attuned bow 23902
│   ├── protocol/
│   │   └── packets.md       20  - WIDGET_ACTION, OPNPC, Trade, run modifier
│   ├── shops/
│   │   └── general-stores.md 15  — Lumbridge/Varrock/Edgeville/Falador…
│   ├── skills/
│   │   ├── herblore.md      16  — super atk/str/def, potion XP + Bastion/Battlemage + Sanguinesti + Guam unf 91
│   │   ├── crafting.md      13  — dragonstone, leather, jewellery
│   │   ├── smithing.md       8  — mithril bar, cannonball, coal bag
│   │   ├── cooking.md        8  — shark/manta/karambwan, cake
│   │   ├── fletching.md      6  — bow/arrow/dart XP
│   │   ├── farming.md        4  — seed patches, compost
│   │   ├── agility.md        4  — werewolf, gnome, shortcuts
│   │   ├── fishing.md        3  — contest trophy
│   │   ├── woodcutting.md    1
│   │   └── mining.md         1
│   ├── combat/
│   │   ├── bosses.md        13  — Hydra/Zulrah/Vorkath/Cerberus/KQ…
│   │   ├── slayer.md         7  — konar/task selection/streaks
│   │   └── monsters.md       4  — Kurask/Basilisk/facemask
│   ├── prayer/
│   │   └── prayers.md        9  — Rigour/Augury/Piety/Chivalry drain
│   └── bank/
│       └── bank.md           2  — placeholder, deposit-all
├── completed/               ← 253 CHK (7 files)
│   ├── world.md             88  — Grace, Ordan, Pyromancer, Lumberjack
│   ├── shops.md             48  — General Stores, Ordan, Gem stall
│   ├── skills.md            48  — Herblore, Agility, Cooking, Smithing
│   ├── combat.md            26  — KQ 963, Zulrah, Vorkath, Sire 5886
│   ├── items.md             19  — Dragon platebody 21892, Godsword
│   ├── protocol.md          17  — WIDGET_ACTION 219, Trade
│   └── bank.md               7  — placeholder 3755, insert 3959
├── 01_Completed_Audits.md   ← legacy frozen (mirrored to completed/)
├── 02_Pending_Audits.md     ← legacy frozen (mirrored to pending/)
├── 03_Found_Bugs_and_Issues.md ← legacy frozen (mirrored to findings/)
├── GOAL_RESUME.md           ← gitignored, local resume cursor
└── HANDOFF.md               ← gitignored, local handoff
```

**How to find issues without opening files:**
- `registry.json` → filter by `domain` (e.g. `"domain":"skills/herblore"` or `"skills/agility"`) → read `finding.file` / `candidate.file`.
- Pending by NPC/object: `pending/world/npcs.md` and `pending/world/objects.md`.
- Equipment parity: `pending/items/equipment.md` + `completed/items.md`.
- Shops: `pending/shops/general-stores.md` + `completed/shops.md`.

## Findings at a glance (40 AUD)

| Domain | File | IDs (sample) | Count |
|---|---|---|---|
| skills | `findings/skills.md` | AUD-065, AUD-031, … | 12 |
| shops-npcs | `findings/shops-npcs.md` | AUD-014, AUD-015, … | 8 |
| combat | `findings/combat.md` | AUD-001, AUD-002, AUD-003, … | 7 |
| inventory-bank | `findings/inventory-bank.md` | AUD-019, AUD-028, … | 6 |
| drops | `findings/drops.md` | AUD-077, … | 3 |
| protocol | `findings/protocol.md` | AUD-007, AUD-008 | 2 |
| prayer-slayer | `findings/prayer-slayer.md` | AUD-021 | 1 |
| items-equipment | `findings/items-equipment.md` | AUD-010 | 1 |

## Candidates at a glance (264 CAND) - top files

| File | Candidates | Example IDs |
|---|---|---|
| `pending/world/general.md` | 34 | CAND-004 Dragonstone, CAND-006 Drew bucket… |
| `pending/items/equipment.md` | 68 | CAND-216 Bronze scim 1321 / CAND-217 Warhammer 1335-1347 / CAND-218 Leaf-bladed 20727 / CAND-219 Brine 11037 / CAND-220 Leaf 11902 / CAND-221 Hasta 11371 / CAND-222 Inquisitor / CAND-223 Ghrazi / CAND-224 dart family 806-810 / CAND-225 Mithril crossbow 9181 / CAND-226 Twisted bow 20997 / CAND-227 Scythe 22325 / CAND-228 Dragon hunter 21012 / CAND-229 Throwing axe 802 / CAND-230 Amethyst 11388 / CAND-231 Zenyte / CAND-232 Rapid Heal / CAND-233 Smite / CAND-234 Claws 3097-3101 / CAND-235 Ancient mace 11061 / CAND-236 High-ID ornamental 20000-20047 / CAND-237 Shaman mask 21838 / CAND-238 Ancient godsword 26233 / CAND-239 Corrupted AGS 28537 / CAND-241 Dragonfire 11284 / CAND-242 Crystal 4212 / CAND-243 Elysian 12817 / CAND-244 defenders / CAND-245 Hydra 23073 / CAND-249 Twisted buckler 21000 / CAND-250 Dinh 21015 / CAND-251 Inquisitor helm 24419 / CAND-252 3rdAge 10338 / CAND-253 Eternal 13235 / CAND-254 Zenyte 19547 / CAND-255 Skull 9013 / CAND-256 Guam 91 / CAND-257 Toxic staff 12902 / CAND-258 Thammaron 22552 / CAND-259 Nightmare 24422 / CAND-260 Bow Faerdhinen 25865 / CAND-261 Saeldor 25870 / CAND-262 Crystal halberd 23987 / CAND-263 Crystal armour 23971 / CAND-264 Gauntlet attuned 23902 |
| `pending/world/npcs.md` | 21 | CAND-014 Disciple 7670, CAND-019 Hairdresser… |
| `pending/protocol/packets.md` | 20 | CAND-051 Chat, CAND-028 OPPlayer2… |
| `pending/shops/general-stores.md` | 15 | CAND-110 Varrock, CAND-133 Edgeville… |
| `pending/combat/bosses.md` | 13 | CAND-001 Hydra 22973, CAND-073 KQ prayer… |
| `pending/skills/herblore.md` | 13 | CAND-065 Prayer 139, CAND-044 Ranarr… |
| `pending/skills/crafting.md` | 14 | CAND-057 Gold jewellery 1635… |
| `pending/prayer/prayers.md` | 11 | CAND-109 Rigour 5451, CAND-232 Rapid Heal 10, CAND-233 Smite 24, CAND-147 Rigour 38.5… |

## Verified clean at a glance (253 CHK)

| File | Checks | Example |
|---|---|---|
| `completed/world.md` | 88 | CHK-001 Grace 5919, CHK-002 Ordan 1260 |
| `completed/shops.md` | 48 | CHK-129 Edgeville 1102, CHK-133 Varrock 1362 |
| `completed/skills.md` | 48 | CHK-040 Super attack 145, CHK-174 Snapdragon 5300 |
| `completed/combat.md` | 26 | CHK-108 KQ 963, CHK-127 Sire 5886 |
| `completed/items.md` | 19 | CHK-201 Dragon plate 21892, CHK-253 Mithril chain 1109 |
| `completed/protocol.md` | 17 | CHK-035 IF_BUTTON family |
| `completed/bank.md` | 7 | CHK-217 placeholder 3755 |

## What lives where — and what to edit

| File | Purpose | Agent action |
|---|---|---|
| `registry.json` | **Single source for automation.** Every finding (`AUD-001`…), candidate (`CAND-001`…), and check (`CHK-001`…) with `file` + `domain` + severity/category/location/DB ref. | `read` this before any audit/fix. Search it case-insensitively before filing anything new. |
| `findings/*.md` | Authoritative evidence for the 40 accepted findings (per-domain). | Read the file matching `domain` for that `AUD-*`. Do not renumber IDs. |
| `pending/**/*.md` | Candidate mismatches + deferred/incomplete scope, per-domain. **Not yet accepted.** | Verify runtime path + authoritative DB key + current Wiki before promoting. One root cause per candidate. |
| `completed/*.md` | Bounded checks that ended with *no new mismatch*, per-domain. | Skip re-auditing these areas unless scope changes. |
| `04_AuDHD_Friendly_Summary.md` | Human working view: next steps, quick wins, wider coverage. | Start here if you want the human todo list. |
| `05_Audit_Log.md` | Chronological log of what was checked and when. | Append-only; never rewrite history. |

## Agentic runbook (copy-paste for any agent)

**Pick work:**
- Bugs to fix → `registry.json` → `findings[]` where `status == "Open"`, filter by `domain` or `severity` highest first.
- Things to investigate → `pending_candidates[]` — filter by `domain`, each has `location` + `db_reference` + `file` to chase.
- Things to skip → `completed_checks[]` by `domain`.

**Before filing anything new:**
1. Search `registry.json` (all three arrays) for the same item/npc/object/shop/prayer ID or title fragment — case-insensitive.
2. If a match exists, extend that entry; do not create a duplicate.
3. Candidates stay candidates until you have re-checked: active runtime consumer **and** exact `READ-ONLY-DB` key **and** current OSRS Wiki rule.

**When you fix or promote:**
- Update the owning per-domain markdown file (`findings/<domain>.md` / `pending/<domain>/<sub>.md` / `completed/<domain>.md`) **and** `registry.json` (`file` + `domain`).
- Do not claim `Fixed`/`Won't Fix` without a verified re-check against the same `location`/`db_reference`.
- Never edit files under `Typescript-RSPS/` or `READ-ONLY-DB/`; `GOAL_RESUME.md`/`HANDOFF.md` are gitignored local-only.

## Deduplication audit — 2026-10-13

**Method:** normalized line hash + AUD-ID extraction + exact title matching across all Memory files.

- **No duplicate finding IDs within any file.** 40 unique `AUD-*` IDs across `findings/*.md`; 0 in pending/completed/index/log.
- **No duplicate candidate titles.** 215 unique CAND titles across `pending/**/*.md`.
- **No pending-vs-accepted overlap.** Zero CAND titles fuzzy-match AUD titles (≥4 token overlap) — different root causes.
- **Incidental ID reuse is not duplication.** Pending item IDs 1047/113/2552 appear in 2 entries each but describe distinct aspects — kept as separate scoped entries.
- **Summary layering is not duplication.** `00_INDEX.md` now holds only tree + tables; detail lives in `findings/`/`pending/`/`completed/` + `registry.json`.
- **v1.2 reorg:** `findings/`/`pending/`/`completed/` now carry `file` + `domain` in `registry.json` (2026-10-13). Legacy `01`/`02`/`03` frozen as provenance.
- **Result:** no entries removed; structural split of 40/223/253 entries into per-domain folders; deduplication still 0 duplicates.

## Quick start

1. **Agents fixing bugs:** `read registry.json` → filter `findings[]` by `domain` or `severity` → `read findings/<domain>.md` block for that `AUD-*` → fix → re-verify → update `registry.json` + `findings/<domain>.md`.
2. **Agents investigating:** `read registry.json` → filter `pending_candidates[]` by `domain` → `read pending/<domain>/<sub>.md` entry → verify DB key + runtime → promote or close → sync `registry.json`.
3. **Humans:** start at [`04_AuDHD_Friendly_Summary.md`](04_AuDHD_Friendly_Summary.md) for next steps, or this file's document tree + tables for navigation.

## Source of truth and handling

- Full finding descriptions, exact locations, DB references, evidence, impacts, and suggested fixes live in `findings/*.md`; `registry.json` mirrors them for machines (with `file` + `domain`).
- Candidate-only items stay candidates until independently rechecked and deduplicated (see `pending/**/*.md`).
- Do not renumber existing `AUD-*`/`CAND-*`/`CHK-*` IDs.
- Do not modify files under `Typescript-RSPS/` or `READ-ONLY-DB/` during this audit; `GOAL_RESUME.md`/`HANDOFF.md` are local-only (gitignored).

---
*Waves 22-78: 3198+ scouts drained offline (62 HOLD/HOLD DUP + 2 new CAND-216/217 in Wave 41 + 64 HOLD/HOLD DUP in Wave 42 + 64 HOLD/HOLD DUP in Wave 43 + 64 HOLD/HOLD DUP in Wave 44 + 64 HOLD/HOLD DUP in Wave 45 + 64 HOLD/HOLD DUP in Wave 46 + 64 HOLD/HOLD DUP in Wave 47 herblore/smithing/fletching/cooking/farming + 64 HOLD/HOLD DUP in Wave 48 construction/planks + mining/woodcutting/fishing/cooking + herblore unf/grimy + 64 HOLD/HOLD DUP in Wave 49 hunter/runecraft/thieving/slayer/construction + 64 HOLD/HOLD DUP in Wave 50 agility/farming/mining + remaining parity + 5 stream-fail re-verified offline as HOLD DUP + 64 HOLD/HOLD DUP in Wave 51 2h/claws/halberds/spears/pickaxes/axes/maces/longswords/battleaxes/daggers/whip/godswords/barrows + 8 billing/stream-fail re-verified offline as HOLD DUP + 64 HOLD/HOLD DUP in Wave52 axes/scimhammer/leaf/sabre/hasta/inquisitor/ghazi/ancestral + CAND-218 Leaf-bladed 20727 + CAND-219 Brine 11037 + 64 HOLD/HOLD DUP in Wave53 52W + 7 new CAND-224 dart family 806-810 + CAND-225 Mithril crossbow 9181 + CAND-226 Twisted bow 20997 + CAND-227 Scythe 22325 + CAND-228 Dragon hunter 21012 + CAND-229 Steel throwing axe 802 + 8 HOLD DUP + 64 HOLD/HOLD DUP in Wave54 + CAND-230 Amethyst 11388 + CAND-231 Zenyte 19547/19553 + 64 HOLD/HOLD DUP in Wave55 + CAND-232 Rapid Heal 10 + CAND-233 Smite 24 + 64 HOLD/HOLD DUP in Wave56 ancestral/torva/anguish/bulwark/justiciar/inquisitor/ghazi/ballista + 64 HOLD/HOLD DUP in Wave57-72 axes/battleaxes/daggers/halberds/spears/crossbows/darts/throwingaxes/bows/scythe/elder maul/dhcb + 64 HOLD/HOLD DUP in Wave73 2h/scim/battleaxe/dagger/whip/godsword/barrows + defenders + 64 HOLD/HOLD DUP in Wave74 ancestral/torva/anguish/bulwark/inquisitor + CAND-249 Twisted buckler 21000 + CAND-250 Dinh bulwark 21015 + CAND-251 Inquisitor helm 24419 + CAND-252 3rdAge mage 10338-10344 + CAND-253 Eternal boots 13235 + CAND-254 Zenyte necklaces 19547/19553 + CAND-255 Skull sceptre 9013 + CAND-256 Guam unf 91 + 64 HOLD/HOLD DUP in Wave75 59 HOLD/HOLD DUP + 5 new CAND-257 Toxic staff 12902 + CAND-258 Thammaron 22552/22555 + CAND-259 Nightmare family 24422-24425 + CAND-260 Bow Faerdhinen 25865/25867 + CAND-261 Saeldor 25870 + 64 HOLD/HOLD DUP in Wave76 63 HOLD/HOLD DUP + 1 new CAND-262 Crystal halberd 23987/23989 Agility50 + 64 HOLD/HOLD DUP in Wave77 63 HOLD/HOLD DUP + 1 new CAND-263 Crystal armour 23971/23975/23979 Agility50).*