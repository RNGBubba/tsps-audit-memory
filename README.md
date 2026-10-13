# TSPS Audit — Memory Bank Index

> **Machine-readable source of truth:** [`registry.json`](registry.json) — one JSON object with every finding, candidate, and completed check. Agents: read this first.

## Status snapshot (auto-synced to `registry.json` v1.2 — 2026-10-13 Waves 22-46 fully HOLD re-verified offline — 40/217/253)

| Bucket | Count | Where |
|---|---|---|
| **Accepted findings** (bugs that are verified broken) | **40** — 2 High, 34 Medium, 4 Low | [`findings/`](findings/) + `findings[]` in `registry.json` |
| **Candidates** (need verification before promotion) | **217** | [`pending/`](pending/) + `pending_candidates[]` (`CAND-001…CAND-217`) |
| **Verified clean** (bounded no-mismatch) | **253** | [`completed/`](completed/) + `completed_checks[]` (`CHK-001`…`CHK-253`) |
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
├── pending/                 ← 215 CAND (21 files)
│   ├── world/
│   │   ├── general.md       34  — Zeah shops, diaries, teleports, misc
│   │   ├── npcs.md          21  — Talk-to slots, NPC handlers
│   │   └── objects.md        3  — altars, ladders, portals
│   ├── items/
│   │   └── equipment.md     26  — platebody/chain/kite/helm Defence & bonus
│   ├── protocol/
│   │   └── packets.md       20  — WIDGET_ACTION, OPNPC, Trade, run modifier
│   ├── shops/
│   │   └── general-stores.md 15  — Lumbridge/Varrock/Edgeville/Falador…
│   ├── skills/
│   │   ├── herblore.md      13  — super atk/str/def, potion XP
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

## Candidates at a glance (215 CAND) — top files

| File | Candidates | Example IDs |
|---|---|---|
| `pending/world/general.md` | 34 | CAND-004 Dragonstone, CAND-006 Drew bucket… |
| `pending/items/equipment.md` | 26 | CAND-117 Mithril plate 1121, CAND-199 Steel plate 1119… |
| `pending/world/npcs.md` | 21 | CAND-014 Disciple 7670, CAND-019 Hairdresser… |
| `pending/protocol/packets.md` | 20 | CAND-051 Chat, CAND-028 OPPlayer2… |
| `pending/shops/general-stores.md` | 15 | CAND-110 Varrock, CAND-133 Edgeville… |
| `pending/combat/bosses.md` | 13 | CAND-001 Hydra 22973, CAND-073 KQ prayer… |
| `pending/skills/herblore.md` | 13 | CAND-065 Prayer 139, CAND-044 Ranarr… |
| `pending/skills/crafting.md` | 13 | CAND-057 Gold jewellery 1635… |
| `pending/prayer/prayers.md` | 9 | CAND-109 Rigour 5451, CAND-147 Rigour 38.5… |

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
- **Result:** no entries removed; structural split of 40/217/253 entries into per-domain folders; deduplication still 0 duplicates.

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
*Waves 22-46: 1086+ scouts drained offline (62 HOLD/HOLD DUP + 2 new CAND-216/217 in Wave 41; 64 HOLD/HOLD DUP in Wave 42; 64 HOLD/HOLD DUP in Wave 43; 64 HOLD/HOLD DUP in Wave 44; 64 HOLD/HOLD DUP in Wave 45; 64 HOLD/HOLD DUP in Wave 46; 1 failed-recoverable W45-26 re-verified offline as HOLD DUP 4757 Verac brassard clean). Registry 40/217/253. See `05_Audit_Log.md` for per-wave evidence.*
