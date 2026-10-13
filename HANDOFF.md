# Audit Handoff — paused 2026-10-12 (PC restart)

> **Registry now canonical:** `registry.json` (`AUD-*`/`CAND-*`/`CHK-*`) mirrors `03`/`02`/`01`. Agents must read `00_INDEX.md` + `registry.json` first. See deduplication report in `00_INDEX.md` (2026-10-12). `FULL_AUDIT_REPORT.md` is frozen legacy provenance — do not edit.

## Current state

The user paused the exhaustive read-only TSPS vs READ-ONLY-DB audit to restart the PC. Resume later with `/goal resume` (see `GOAL_RESUME.md` / `local://goal-resume.md`). **Do not continue audit work until resumed.** No TSPS/READ-ONLY-DB edits. Integrator-only writes to `Memory/`.

- **Counts at pause (registry.json v1.1 2026-10-12):** 40 findings / 199 pending (CAND-001…CAND-199) / 238 completed (CHK-001…CHK-238)
- **Integrity hold:** `FULL_AUDIT_REPORT.md` remains structurally incomplete (starts at `## Findings by Category`, 1 checklist item). Do not update totals or promote candidates without recovery. One root per entry, case-insensitive `registry.json` search before filing, triple-verify (active runtime + exact DB key + Wiki).

## Wave 18 — dispatched, partially returned (NOT YET INTEGRATED)

**Dispatched:** 49 narrow READ-ONLY scouts (`Wave 18 dispatch`) covering equipment/monsters/shops/prayer/skill/packet/container gaps. Contract: NEVER edit TSPS/READ-ONLY-DB; NEVER edit FULL; search `registry.json` case-insensitive; one root per entry.

**Returned by pause (~40 delivered, ~9 still running at interrupt):**
All returns below are **read-only evidence only** — Memory registers were NOT updated. Dup-screen + integrate after resume.

HOLD DUP verified (no new filing — existing CAND/CHK/AUD already covers root):
- `ScoutEquipSteelChainBatch2` — Steel chainbody 1105 -15/0 clean vs DB 1105 (distinct from CAND-199 platebody 1119 -10 vs -15)
- `ScoutEquipBronzeChainBatch` — Bronze 1103 clean, Steel 1105 clean, 2563 is Ring of dueling noted not bronze
- `ScoutPrayerAuguryBatch2` — CAND-163 Augury 29 drain 38.5 vs 40 HOLD
- `ScoutSkillMiningCoalBatch2` — CHK-145 coal 453 HOLD
- `ScoutMonsterZulrahBatch2` — CHK-209 2042-2046 trio HOLD
- `ScoutEquipRuneChainBatch2` — CHK-185 1113 HOLD vs CAND-146 distinct
- `ScoutPrayerRigourBatch2` — CAND-147 Rigour 28 HOLD
- `ScoutPrayerPietyBatch2` — CAND-115 Piety HOLD
- `ScoutEquipDragonMedChain` — CHK-132 3140 HOLD
- `ScoutPrayerChivalryBatch2` — CAND-130 Chivalry 26 HOLD (38.5 vs 40 vs Wiki 20, gate 60 vs 65)
- `ScoutShopLumbridgeBatch2` — CHK-126 HOLD
- `ScoutShopVarrockBatch2` — CHK-133 HOLD
- `ScoutMonsterNexBatch2` — CHK-140 HOLD
- `ScoutShopEdgevilleBatch2` — CHK-129 HOLD
- `ScoutShopFishingGuildBatch2` — systemic vs AUD-015/024 HOLD
- `ScoutEquipMithrilChainBatch2` — 1109 HOLD vs CAND-189 distinct
- `ScoutSkillFarmingBatch2` — Oak vs CHK-137 pattern HOLD
- `ScoutMonsterCorpBatch2` — CHK-073 HOLD (sigils parity, not Active-vs-DB)
- `ScoutMonsterDagannothBatch2` — CHK-083 2265 HOLD
- `ScoutShopFaladorBatch2` — CHK-163 HOLD
- `ScoutMonsterAbyssalSireBatch2` — AUD-077 vs CHK-127 distinct roots HOLD
- `ScoutPacketIFButtonBatch2` — CHK-035 family (14 incl) HOLD
- `ScoutEquipBarrowsGloves8902` — 7462 Def45 custom HOLD
- `ScoutPacketObjectExamineBatch2` — CHK-225 HOLD
- `ScoutMonsterCerberusBatch3` — CHK-080 HOLD
- `ScoutEquipAdamantChainBatch2` — 1111 HOLD (vs 1097 Studded chaps CAND distinct)
- `ScoutEquipIronChainBatch` — 1101 HOLD
- `ScoutSkillHunterBatch2` — CHK-186 distinct from kebbit HOLD
- `ScoutMonsterJadBatch2` — CHK-175 HOLD
- `ScoutSpellAncientIceBatch2` — CHK-204 HOLD (Smoke part already CAND-157)
- `ScoutMonsterHydraBatch2` — CHK-153 vs CAND-001 distinct HOLD
- `ScoutMonsterVorkathBatch2` — CHK-100 HOLD vs CAND-120 distinct
- `ScoutSpellFireSurgeBatch2` — CHK-177 HOLD
- `ScoutShopCanifisBatch2` — CHK-110 HOLD
- `ScoutMonsterGargoyleBatch2` — CAND-191 HOLD (not duplicate of CAND-069)
- `ScoutMonsterKrakenBatch2` — CHK-046 HOLD (DUP of CHK-123 pet subset)
- `ScoutEquipDragonScimBatch2` — CHK-039 HOLD (vs AUD-023 shop variant)
- `ScoutContainerBankTabsBatch2` — CAND-096 vs CHK-082/166 distinct HOLD
- `ScoutDropTheatreBatch2` — CHK-181 HOLD
- `ScoutObjectPohPortalBatch2` — 33408 HOLD (no duplicate)
- `ScoutSkillSmithSteelBatch2` — HOLD DUP vs CAND-018 systemic interval
- `ScoutMonsterBloodveldBatch2` — **NEW CLEAN candidate: Jelly-relative? Actually Bloodveld 484 CLEAN — byte-identical active vs DB, no registry entry → promote to CHK-239 after resume (bounded clean, not candidate)**
- `ScoutShopTzHaarBatch2` — HOLD vs AUD-023/024 systemic
- `ScoutEquipGraniteBoots21643` — CHK-005 HOLD vs CAND-194 distinct
- `ScoutSkillAgilityBatch2` — CHK-197 HOLD
- `ScoutSkillCraftLeatherBatch2` — CAND-185 Green d'hide HOLD DUP vs CAND-100/159
- `ScoutMonsterJellyBatch2` — 437 CLEAN HOLD (no filing, already clean)
- `ScoutDropZulrahBatch2` — CHK-124 HOLD
(plus ~9 jobs still running at interrupt: `ScoutShopPrifddinasBatch2`, `ScoutDropZulrahBatch2` already done, check `proc://` after resume and drain any late deliveries — treat late results as unverified leads)

**No new CAND promoted:** Wave 18 found 0 new mismatches requiring CAND. One new bounded clean (Bloodveld 484) ready for CHK promotion after dup-screen.

**Still running at pause:** ~9 scouts — do not edit Memory until they are drained or killed. After resume: `read proc://` → `wait()` drain → dup-screen then integrate.

## Earlier completed evidence still awaiting integration (pre-Wave 18)

- Barrows degradation (short-circuit), Food (Tuna potato 7060 20 vs 22, pizza 2289/2291, bite 3t), Fire lifecycle (rejected 5249 vs 26185), Tome of Fire on Fire Surge, Abyssal daggers 13265/13267/13269 Attack70, Halberd Sweep 0.75x, Lantadyme 2485 grimy→2481 6.75 vs 6.55 + Herbl.67, etc. — see prior HANDOFF revision history for full list. All need re-check vs current Memory before any promotion.

## Resume priorities

1. Drain/kill stale Wave 18 jobs, collect any late deliveries, then dup-screen.
2. Integrate only HOLD-verified results: promote Bloodveld 484 → CHK-239 (verified_no_mismatch) + update `01_Completed_Audits.md`, `registry.json`, `05_Audit_Log.md`, `00_INDEX.md`. No other registry count change (stays 40/199/238 unless CHK-239 added → 40/199/239).
3. Re-read `00_INDEX.md`, `registry.json`, `02_Pending_Audits.md` before any edit. Preserve one root per entry, integrity hold.
4. Continue exhaustive coverage — `02_Pending_Audits.md` still broad; item/skill/combat/world/packet/dialogue/shop/prayer/drop/container domains not complete.
5. Do not claim audit complete while pending/candidate coverage remains open.

## Handoff navigation

- Index/status: `Memory/00_INDEX.md` + `Memory/registry.json`
- Pending: `Memory/02_Pending_Audits.md`
- Findings: `Memory/03_Found_Bugs_and_Issues.md`
- Completed: `Memory/01_Completed_Audits.md`
- Log: `Memory/05_Audit_Log.md`
- This handoff: `Memory/HANDOFF.md`
- Goal: `Memory/GOAL_RESUME.md` + `local://goal-resume.md`

## Resume prompt

```text
/goal resume
Continue the exhaustive read-only audit of TSPS vs READ-ONLY-DB. Read Memory/HANDOFF.md, 00_INDEX.md, and registry.json. Drain any pending Wave 18 scouts, dup-screen Wave 18 returns (integrate Bloodveld 484 → CHK-239), then continue auditing. Never modify TSPS or READ-ONLY-DB; only the main agent may update files under Memory. Preserve the legacy report integrity hold and do not promote partial leads.
```
