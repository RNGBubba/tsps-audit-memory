# Goal — Resume Exhaustive TSPS vs READ-ONLY-DB Audit

**Command:** `/goal resume`

**Objective:** Continue the exhaustive read-only audit of TSPS vs READ-ONLY-DB.

**Steps on resume:**
1. Read `Memory/HANDOFF.md`, `Memory/00_INDEX.md`, and `Memory/registry.json` (counts: 40 findings / 199 pending / 238 completed at pause).
2. Drain any still-running Wave 18 scouts: `read proc://` then `wait()` loop; treat late deliveries as unverified leads until dup-screened.
3. Dup-screen Wave 18 returns (case-insensitive `registry.json` search, triple-verify active+DB+Wiki, one root per entry). Promote `ScoutMonsterBloodveldBatch2` Bloodveld 484 byte-identical clean → `CHK-239` in `01_Completed_Audits.md` + `registry.json`; update `05_Audit_Log.md` and `00_INDEX.md` (→ 40/199/239). All other Wave 18 returns are HOLD DUP — no registry count change.
4. Only the main agent may edit `Memory/`; never modify `Typescript-RSPS/` or `READ-ONLY-DB/` or `FULL_AUDIT_REPORT.md` (frozen legacy, integrity hold).
5. Continue systematic coverage of open domains listed in `02_Pending_Audits.md` and `00_INDEX.md`. Do not claim audit complete while pending/candidate coverage remains open. Do not promote partial leads without full evidence + dup-screen.

**Constraints:** READ-ONLY scouts only; integrator writes after dup-screen; preserve integrity hold; one root per entry.

**Handoff:** `Memory/HANDOFF.md`
