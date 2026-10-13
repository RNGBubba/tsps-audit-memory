# findings/prayer-slayer.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

### [AUD-020] Preserve extends boosted-stat drain before its activation delay

Severity: Medium
Status: Open
Category: 8. Prayer
Location: `server/src/main/typescript/elvarg/game/entity/impl/player/Player.ts:447-493`; activation state `server/src/main/typescript/elvarg/game/content/PrayerHandler.ts:200-205,493,507`.
DB Reference: `READ-ONLY-DB/docs/prayers-json/25.json` → prayer 25 Preserve: boosted stats last 50% longer, Prayer requirement 55, drain 3.0/min. DB record/schema does not specify the activation delay.
Description: The server switches boosted-stat decay to 90 seconds as soon as Preserve is active, without checking its 15-second continuous activation requirement.
Evidence:
Code currently does: Both the boosted-stat decay threshold and timer restart at `Player.ts:448,476,491-492` select 90 seconds solely from `PrayerHandler.isActivated(PRESERVE)`. The activation path marks the prayer active; the inspected consumer has no age/eligibility check. The DB supports the extended-decay effect, while the OSRS Wiki Preserve page states it only takes effect after the prayer has been active for at least 15 seconds.
osrsreboxed-db says: Prayer 25 says boosted stats last 50% longer and drain 3.0 Prayer points per minute; it neither records nor contradicts the 15-second delay.
Impact: Activating Preserve shortly before a scheduled stat drain grants the 90-second interval immediately, including a benefit from flicking that OSRS rules disallow.
Suggested fix direction (do NOT implement): Track continuous Preserve activation time and apply the extended interval only after the required warm-up; keep the DB finding scoped to the effect/rate it actually records.

---
*Last re-verified: Wave 41 — 2026-10-13 — 62 HOLD/HOLD DUP + 2 new CAND (Bronze scim 1321 defence_slash 0 vs 1 + Warhammer family 1335/1339/1341/1343/1345/1347 melee_strength 9/16/19/20/31/48 vs 11/18/22/27/39/62). Registry 40/217/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-41 for per-wave evidence.*
