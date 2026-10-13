# Memory Bank — Agent Protocol

> **Read `registry.json` before doing anything.** This folder is the project's memory bank for *what is wrong* and *what still needs looking into*.

## TL;DR for agents

1. `read registry.json` — one JSON with every bug, candidate, and clean check.
2. Search it (case-insensitive) before filing anything — **no duplicates**.
3. `read 00_INDEX.md` for the human summary + runbook.
4. `read 03_Found_Bugs_and_Issues.md#AUD-XXX` for full evidence on the bug you are fixing.
5. `read 02_Pending_Audits.md#CAND-XXX` for the candidate you are verifying.
6. When you verify / promote / fix: update the owning markdown **and** `registry.json`.
7. Never edit `FULL_AUDIT_REPORT.md` (frozen) or anything under `Typescript-RSPS/` / `READ-ONLY-DB/`.

## Files

| File | What it is | Edit? |
|---|---|---|
| `registry.json` | Canonical machine index: `findings[]` (40), `pending_candidates[]` (86), `completed_checks[]` (31). `deduplication_report` + `agent_instructions`. | ✅ keep in sync |
| `00_INDEX.md` | Human index + status table + agentic runbook + dedup report. | ✅ (counts/status only) |
| `03_Found_Bugs_and_Issues.md` | Accepted findings — full evidence blocks. | ✅ (add/promote/close `AUD-*`) |
| `02_Pending_Audits.md` | Candidates — not yet accepted. Scope + location + DB ref for each. | ✅ (verify/promote/close `CAND-*`) |
| `01_Completed_Audits.md` | Bounded no-mismatch checks — skip unless scope changes. | ✅ (add `CHK-*`) |
| `04_AuDHD_Friendly_Summary.md` | Human working view / quick wins. | ✅ |
| `05_Audit_Log.md` | Chronological log — append-only. | ✅ append |
| `FULL_AUDIT_REPORT.md` | Frozen legacy snapshot (same 40 blocks as `03`). | ❌ never |
| `HANDOFF.md` | Pause/resume context for `/goal resume`. | ✅ on handoff |
| `AGENT.md` | This file. | ✅ |

## IDs

- `AUD-001` … `AUD-079` — accepted findings (IDs are sparse; not contiguous — do not renumber).
- `CAND-001` … `CAND-086` — candidates pending verification.
- `CHK-001` … `CHK-031` — completed clean checks.

## Rules

- Candidates are **not** accepted findings. Promote only after: active runtime path + exact `READ-ONLY-DB` key + current OSRS Wiki rule.
- No claim `Fixed`/`Won't Fix` without a verified re-check against the same `location`/`db_reference`.
- One root cause per entry. If two entries share a root, extend the existing one.
- Before any write to `Memory/`, `read` the file you are editing — stale snapshot = re-read.
- `FULL_AUDIT_REPORT.md` integrity hold: it is structurally incomplete; do not use it to promote counts.

## registry.json schema (abridged)

```json
{
  "version": "1.1",
  "findings": [{ "id": "AUD-001", "title": "...", "severity": "Medium|High|Low", "status": "Open", "category": "...", "location": "...", "db_reference": "...", "description": "..." }],
  "pending_candidates": [{ "candidate_id": "CAND-001", "title": "...", "summary": "...", "ids_mentioned": ["8615"], "status": "candidate", "needs_verification": true, "slug": "..." }],
  "completed_checks": [{ "check_id": "CHK-001", "title": "...", "summary": "...", "status": "verified_no_mismatch", "slug": "..." }],
  "deduplication_report": { "...": "..." },
  "agent_instructions": { "read_order": [...], "rules": [...], "how_to_pick_work": [...] }
}
```
