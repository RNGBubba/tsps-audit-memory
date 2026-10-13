# TSPS Audit — Memory Bank Index

> **Machine-readable source of truth:** [`registry.json`](registry.json) — one JSON object with every finding, candidate, and completed check. Agents: read this first.

## Status snapshot (auto-synced to `registry.json` v1.1 — 2026-10-13 Wave 20 partial: +3 candidates 211-213, +4 cleans 246-249 — registry 40/213/249)

| Bucket | Count | Where |
|---|---|---|
| **Accepted findings** (bugs that are verified broken) | **40** — 2 High, 34 Medium, 4 Low | [`03_Found_Bugs_and_Issues.md`](03_Found_Bugs_and_Issues.md) + `findings[]` in `registry.json` |
| **Candidates** (need verification before promotion) | **213** | [`02_Pending_Audits.md`](02_Pending_Audits.md) + `pending_candidates[]` (`CAND-001`…`CAND-213`) |
| **Verified clean** (bounded no-mismatch) | **249** | [`01_Completed_Audits.md`](01_Completed_Audits.md) + `completed_checks[]` (`CHK-001`…`CHK-249`) |
| **Legacy snapshot (frozen)** | 40 blocks | [`FULL_AUDIT_REPORT.md`](FULL_AUDIT_REPORT.md) — do not edit |
| **No duplicate IDs** | 0 duplicated AUD/CAND/CHK IDs | See deduplication report below |



## What lives where — and what to edit

| File | Purpose | Agent action |
|---|---|---|
| [`registry.json`](registry.json) | **Single source for automation.** Every finding (`AUD-001`…), candidate (`CAND-001`…), and check (`CHK-001`…) with severity, category, location, and DB ref. | `read` this before any audit/fix. Search it case-insensitively before filing anything new. Keep it in sync when you add/promote/close. |
| [`03_Found_Bugs_and_Issues.md`](03_Found_Bugs_and_Issues.md) | Authoritative evidence for the 40 accepted findings (full Description / Evidence / Impact / DB ref). | Read the block for the AUD you are fixing. Do not renumber IDs. |
| [`02_Pending_Audits.md`](02_Pending_Audits.md) | 143 candidate mismatches + deferred/incomplete scope. **Not yet accepted findings.** | Verify runtime path + authoritative DB key + current Wiki before promoting. One root cause per candidate. |
| [`01_Completed_Audits.md`](01_Completed_Audits.md) | 125 bounded checks that ended with *no new mismatch*. | Skip re-auditing these areas unless scope changes. |
| [`04_AuDHD_Friendly_Summary.md`](04_AuDHD_Friendly_Summary.md) | Human working view: next steps, quick wins, wider coverage. | Start here if you want the human todo list. |
| [`05_Audit_Log.md`](05_Audit_Log.md) | Chronological log of what was checked and when. | Append-only; never rewrite history. |
| [`FULL_AUDIT_REPORT.md`](FULL_AUDIT_REPORT.md) | Frozen legacy report — retained for provenance. | **Do not edit.** Read `03` / `registry.json` instead. |
| [`HANDOFF.md`](HANDOFF.md) | Pause/resume context for `/goal resume`. | Read before resuming audit. |
| [`AGENT.md`](AGENT.md) | Agent protocol — how to use this memory bank. | Read if you are an agent. |

## Agentic runbook (copy-paste for any agent)

**Pick work:**
- Bugs to fix → `registry.json` → `findings[]` where `status == "Open"`, highest `severity` first.
- Things to investigate → `pending_candidates[]` — each has `location` + `db_reference` to chase.
- Things to skip → `completed_checks[]`.

**Before filing anything new:**
1. Search `registry.json` (all three arrays) for the same item/npc/object/shop/prayer ID or title fragment — case-insensitive.
2. If a match exists, extend that entry; do not create a duplicate.
3. Candidates stay candidates until you have re-checked: active runtime consumer **and** exact `READ-ONLY-DB` key **and** current OSRS Wiki rule.

**When you fix or promote:**
- Update the owning markdown file (`03` for findings, `02` for candidates, `01` for checks) **and** `registry.json`.
- Do not claim `Fixed`/`Won't Fix` without a verified re-check against the same `location`/`db_reference`.
- Never edit files under `Typescript-RSPS/` or `READ-ONLY-DB/`.

## Deduplication audit — 2026-10-12

**Method:** normalized line hash + AUD-ID extraction + exact title matching across all 8 Memory files.

- **No duplicate finding IDs within any file.** 40 unique `AUD-*` IDs in `03`; same 40 in `FULL`; 0 in `00`/`01`/`02`/`04`/`05`.
- **No duplicate candidate titles within `02`.** - **No duplicate candidate titles within `02`.** 143 titles, 143 unique lowercased (was 86; +24 in this continuation including Waves 1-2: Bank, Mithril dart, Prayer mix, Lantern, Leather, Ruby, Pest XP, Frost Dragons, Dragonstone, Harmony, Anvil, Clue caskets + Trade escrow, Rigour 5451, Jewellery stringing — see 05_Audit_Log.md).
- **`03` vs `FULL` is intentional duplication, not a bug.** Both contain the same 40 finding blocks. `03` is the live modular register; `FULL` is the frozen legacy snapshot retained for provenance. Fix: keep both, document intention, tell agents to read `03`/`registry.json` not `FULL`. No deletion.
- **No pending-vs-accepted overlap.** Zero `02` candidate titles fuzzy-match `03` titles (≥4 token overlap) — candidates are scoped to different root causes.
- **Incidental ID reuse is not duplication.** Pending item IDs 1047/113/2552 appear in 2 entries each but describe distinct aspects (e.g., accuracy vs venom for 1047) — kept as separate scoped entries.
- **Summary layering is not duplication.** `00` and `04` previously echoed candidate summaries for navigation; this has been collapsed. `00` now holds only counts + routing; `04` remains the working view. Detail of record stays in `02`/`03`/`registry.json`.
- **Result:** no entries removed; one structural dedup (collapse of `00`'s 175 echoed bullets into this table) + new canonical `registry.json`.

## Quick start

1. **Agents fixing bugs:** `read registry.json` → pick a `findings[]` entry → `read 03_Found_Bugs_and_Issues.md` block for that `AUD-*` → fix → re-verify → update `registry.json` + `03`.
2. **Agents investigating:** `read registry.json` → pick a `CAND-*` → `read 02_Pending_Audits.md` entry → verify DB key + runtime → promote or close → sync `registry.json`.
3. **Humans:** start at [`04_AuDHD_Friendly_Summary.md`](04_AuDHD_Friendly_Summary.md) for next steps, or this file for navigation.

## Source of truth and handling

- Full finding descriptions, exact locations, DB references, evidence, impacts, and suggested fixes live in `03_Found_Bugs_and_Issues.md`; `registry.json` mirrors them for machines.
- Candidate-only items stay candidates until independently rechecked and deduplicated.
- Do not renumber existing `AUD-*`/`CAND-*`/`CHK-*` IDs.
- Do not modify files under `Typescript-RSPS/` or `READ-ONLY-DB/` during this audit.
- Integrity hold still applies: `FULL_AUDIT_REPORT.md` is structurally incomplete (starts at `## Findings by Category`, no Executive Summary, Coverage Checklist has only `Item definition loading pipeline`). Do not promote candidates to accepted findings by rewriting `FULL`; use `03` + `registry.json`.