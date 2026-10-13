# findings/protocol.md

> **Source:** `registry.json` findings + legacy `03_Found_Bugs_and_Issues.md`. Each entry is an **AUD** (verified broken). Fix requires re-verify location + DB key.

### [AUD-007] Legacy server PacketSender calls silently discard packets

Severity: Medium
Status: Open
Category: 13. Client ↔ Server Protocol / Packets (also 21. Server-specific issues)
Location: `server/src/main/typescript/elvarg/net/PlayerSession.ts:98-100,147-150`; callers in `server/src/main/typescript/elvarg/net/packet/PacketSender.ts:145-148,202-205,208-212,335-338`; command consumers `server/plugins/commands/PlayerCommands.plugin.js:127-134` and `server/plugins/commands/AdminCommands.plugin.js:804`.
DB Reference: Not data-comparable; packet transport has no corresponding osrsreboxed-db record.
Description: The legacy `PlayerSession.write(builder)` path is an empty method, but PacketSender and active user-facing callers continue to invoke it for logout, URL, exit and noclip actions.
Evidence:
Code currently does: `write(_builder)` has no body and notes the unported callers remain no-ops. `sendClientPacket` is the active binary egress method, but the cited PacketSender paths use `write` rather than it.
osrsreboxed-db says: No DB mapping for protocol packet behavior; this finding is based on active TypeScript call graph only.
Impact: These calls return without emitting a packet; dependent UX/actions do not reach the client. Verified call sites include store/donate links and administrator-triggered client close.
Suggested fix direction (do NOT implement): Migrate active callers to supported binary packets/handlers or remove obsolete APIs and callers during deliberate clean cutover; do not retain callable silent sends.

---

### [AUD-008] Declared native NPC option-5 opcode 50 has no decoder case

Severity: Low
Status: Open
Category: 13. Client ↔ Server Protocol / Packets
Location: `client/common/network/ClientPacketId.ts:33-42,97-154`; `server/src/main/typescript/elvarg/net/protocol/NativeClientPackets.ts:25-43,98-158`; decoder `server/src/main/typescript/elvarg/net/protocol/ClientProtocol.ts:1-18,638-656`; dispatch `server/src/main/typescript/elvarg/net/NetworkBuilder.ts:793-794`; encoder `client/network/serverConnection/outgoing/interact.ts:54-90`.
DB Reference: Not data-comparable; native packet semantics have no corresponding DB records.
Description: Both client/server native packet tables declare OPNPC5 as opcode 50 with length 3, but server ClientProtocol maps opcode 57 to option 5 and has no case 50. The current browser client uses opcode 57 for its option-5 action, masking the unused declaration for in-repo traffic.
Evidence:
Code currently does: Opcode 50 passes declared packet-size lookup but is decoded as raw and discarded by NetworkBuilder. Client outgoing option 5 encodes as ClientPacket.OPNPC1 (57), which the server maps to click type 5.
osrsreboxed-db says: No DB mapping for native packet IDs or dispatch.
Impact: A sender that emits the declared native OPNPC5 opcode 50 has its interaction silently ignored; current in-repo client option 5 still decodes by opcode 57.
Suggested fix direction (do NOT implement): Align packet declarations, encoder, and decoder on the intended native opcode and migrate callers together; remove obsolete alias if any.

---
*Last re-verified: Wave 40 — 2026-10-13 — all HOLD/HOLD DUP, 0 new CAND/CHK (700+ scouts Waves 22-40). Registry 40/215/253. Reorg v1.2 — this file’s domain entries remain current; see 05_Audit_Log.md Waves 36-40 for per-wave evidence.*
