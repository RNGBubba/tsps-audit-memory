# TSPS Audit — Memory Bank

> **Machine-readable source of truth:** [`registry.json`](registry.json) — one JSON object with every finding, candidate, and completed check. Agents: read this first. *This file mirrors [`00_INDEX.md`](00_INDEX.md) for GitHub's front page — see that file for the canonical index.*

## Status snapshot (auto-synced to `registry.json` v1.1 — 2026-10-13 Wave 20 partial: +3 candidates 211-213, +4 cleans 246-249 — registry 40/213/249)

| Bucket | Count | Where |
|---|---|---|
| **Accepted findings** (bugs that are verified broken) | **40** — 2 High, 34 Medium, 4 Low | [`03_Found_Bugs_and_Issues.md`](03_Found_Bugs_and_Issues.md) + `findings[]` in `registry.json` |
| **Candidates** (need verification before promotion) | **213** | [`02_Pending_Audits.md`](02_Pending_Audits.md) + `pending_candidates[]` (`CAND-001`…`CAND-213`) |
| **Verified clean** (bounded no-mismatch) | **249** | [`01_Completed_Audits.md`](01_Completed_Audits.md) + `completed_checks[]` (`CHK-001`…`CHK-249`) |
| **Legacy snapshot (frozen)** | 40 blocks | [`FULL_AUDIT_REPORT.md`](FULL_AUDIT_REPORT.md) — do not edit |
| **No duplicate IDs** | 0 duplicated AUD/CAND/CHK IDs | See deduplication report in [`00_INDEX.md`](00_INDEX.md) |

## What lives where — and what to edit

| File | Purpose | Agent action |
|---|---|---|
| [`registry.json`](registry.json) | **Single source for automation.** Every finding (`AUD-001`…), candidate (`CAND-001`…), and check (`CHK-001`…) with severity, category, location, and DB ref. | `read` this before any audit/fix. Search it case-insensitively before filing anything new. Keep it in sync when you add/promote/close. |
| [`03_Found_Bugs_and_Issues.md`](03_Found_Bugs_and_Issues.md) | Authoritative evidence for the 40 accepted findings (full Description / Evidence / Impact / DB ref). | Read the block for the AUD you are fixing. Do not renumber IDs. |
| [`02_Pending_Audits.md`](02_Pending_Audits.md) | Candidate mismatches + deferred/incomplete scope. **Not yet accepted findings.** | Verify runtime path + authoritative DB key + current Wiki before promoting. One root cause per candidate. |
| [`01_Completed_Audits.md`](01_Completed_Audits.md) | Bounded checks that ended with *no new mismatch*. | Skip re-auditing these areas unless scope changes. |
| [`04_AuDHD_Friendly_Summary.md`](04_AuDHD_Friendly_Summary.md) | Human working view: next steps, quick wins, wider coverage. | Start here if you want the human todo list. |
| [`05_Audit_Log.md`](05_Audit_Log.md) | Chronological log of what was checked and when. | Append-only; never rewrite history. |
| [`FULL_AUDIT_REPORT.md`](FULL_AUDIT_REPORT.md) | Frozen legacy report — retained for provenance. | **Do not edit.** Read `03` / `registry.json` instead. |
| [`HANDOFF.md`](HANDOFF.md) | Pause/resume context for `/goal resume`. | Read before resuming audit. |
| [`AGENT.md`](AGENT.md) | Agent protocol — how to use this memory bank. | Read if you are an agent. |
| [`00_INDEX.md`](00_INDEX.md) | Canonical index (this file mirrors it). | Read for full status + runbook. |

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

---
*Exhaustive read-only audit of `Typescript-RSPS` vs `READ-ONLY-DB`. Generated by the TSPS audit harness. READ-ONLY scouts only; main integrator writes after dup-screen. `FULL_AUDIT_REPORT.md` frozen. Auto-committed on every Memory update (post-commit hook → `origin/main`). Wave 21 (64 scouts) running — see `05_Audit_Log.md`.*

