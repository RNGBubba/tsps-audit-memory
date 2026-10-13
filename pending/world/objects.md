# Pending — world/objects

> **Candidates** (3) — need verification before promotion. Each is a **CAND**; triple-verify active + exact DB key + Wiki before filing. One root per entry.

- **Camdozaal fish bypass the Preparation Table route (object 41545):** Active `Typescript-RSPS/server/plugins/skills/Cooking.plugin.js:16-61,65-66,238-262,291-308` includes Raw guppy 25652 → Guppy 25654/Ruined guppy 25656, Raw cavefish 25658 → Cavefish 25660/Ruined cavefish 25662, Raw tetra 25664 → Tetra 25666/Ruined tetra 25668, and Raw catfish 25670 → Catfish 25672/Ruined catfish 25674 in generic `COOKABLES`; `handleCook` accepts ordinary cooking ranges/stoves/fires, so each raw fish is cookable there. The module registers item-on-object cooking and a range `Cook` action, but no handler for Preparation Table 41545/its `Prepare-fish` option and no knife requirement. Exact DB item keys confirm identities only; the DB does not encode preparation mechanics. Current official [Camdozaal](https://oldschool.runescape.wiki/w/Camdozaal) mechanics require preparing these fish at the table with a knife. Candidate-only; no active preparation-table/cache exposure or live interaction was verified.

---

- **KBD ladder skips the Lava Maze Dungeon spider/lever transition (object 18987):** Active ladder directly teleports to the lair without the teleblock/eligibility check applied to the return lever. Current official Lava Maze rules require the intermediate transition. Candidate-only; cache reachability bounded as previously recorded.

---

- **Procedural-region collision writes use the process-shared Region grid:** `ProceduralRegionStream.plugin.js:158-197,272-298,644-678` resets `Region.clips` and applies generated object clipping for a region, tracking ownership per player separately; `RegionManager.regions` and each `Region.clips` are shared process-level structures (`RegionManager.ts:33-42`; `Region.ts:7,53-82`). Normal actors without a private-area clip override read the same Region grid (`RegionManager.ts:399-456`), and standard movement/pathing checks consume `getClipping()` (`MovementQueue.ts:132-140`; `RegionManager.ts:491-549`; `RsmodRouteFinding.ts:65,132-135`). This verifies cross-player collision coupling in code, but not a failed movement: movement change requires relevant collision bits to differ after a procedural reset/add. The procedural commands inspected are owner-only (`ProceduralRegionStream.plugin.js:1623-1647,1762-1792`). `READ-ONLY-DB` object summaries only identify object IDs/names (e.g. 11775 Door) and README documents no map/collision contract; no DB parity claim. Duplicate screen clear; distinct from NEW-WORLD-001 projectile-bit removal. Candidate-only with dynamic-state/reachability caveat.

---
*Last re-verified: Wave 40 — 2026-10-13 — all HOLD/HOLD DUP, 0 new CAND/CHK (700+ scouts Waves 22-40). Registry 40/215/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-40 for per-wave evidence.*
