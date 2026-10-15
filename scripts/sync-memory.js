#!/usr/bin/env node
// sync-memory.js — regenerate 00_INDEX.md Status snapshot + README.md Progress + 04 header from registry.json
// B+ infra: eliminates manual touch of README/00_INDEX/04 per wave. Integrator still does pending/completed markdown + registry bump + 05 line.
// Usage: node scripts/sync-memory.js --wave 81 --scouts 64 --new "CAND-273 ..." (or --wave 81 for HOLD)
//   Updates registry.json generated -> "Wave81", bumps status snapshots, rewrites Progress table, 04 header.
const fs=require('fs'),path=require('path');
const mem = path.resolve(__dirname,'..');
const regPath=path.join(mem,'registry.json');
const j=JSON.parse(fs.readFileSync(regPath,'utf8'));
const args=Object.fromEntries(process.argv.slice(2).reduce((a,v,i,arr)=>{
  if(v.startsWith('--')){ const k=v.slice(2); const nxt=arr[i+1]; if(nxt && !nxt.startsWith('--')){a.push([k,nxt]);} else {a.push([k,true]);}}
  return a;
},[]));
const wave = parseInt(args.wave|| (j.generated.match(/Wave(\d+)/)?.[1]||'80'),10);
const scouts = parseInt(args.scouts||'0',10);
const newNote = args.new || args.note || '';
// derive counts
const pending=j.stats.pending_candidates_total;
const completed=j.stats.completed_checks_total;
const findings=j.stats.findings_total;
const total = findings+pending+completed;
const done = findings+completed;
// per-category buckets mirroring README logic
function catOfPending(e){
  const d=e.domain||''; const f=e.file||'';
  if(d.startsWith('items/')) return 'Items / Equipment';
  if(d.startsWith('skills/')) return 'Skills';
  if(d.startsWith('combat/')) return 'Combat';
  if(d.startsWith('protocol/')) return 'Protocol / Packets';
  if(d.startsWith('prayer/')) return 'Prayer / Slayer';
  if(d.startsWith('shops/')) return 'Shops / NPCs';
  if(d.startsWith('world/')){
    if(f==='pending/world/npcs.md') return 'Shops / NPCs';
    return 'World';
  }
  if(d.startsWith('bank/')) return 'Bank / Inventory';
  return 'Other';
}
function catOfCompleted(e){
  const f=e.file||'';
  if(f.startsWith('completed/world')) return 'World';
  if(f.startsWith('completed/shops')) return 'Shops / NPCs';
  if(f.startsWith('completed/skills')) return 'Skills';
  if(f.startsWith('completed/combat')) return 'Combat';
  if(f.startsWith('completed/items')) return 'Items / Equipment';
  if(f.startsWith('completed/protocol')) return 'Protocol / Packets';
  if(f.startsWith('completed/bank')) return 'Bank / Inventory';
  return 'Other';
}
function catOfFinding(e){
  const d=e.domain||'';
  if(d==='items-equipment') return 'Items / Equipment';
  if(d==='combat') return 'Combat';
  if(d==='protocol') return 'Protocol / Packets';
  if(d==='prayer-slayer') return 'Prayer / Slayer';
  if(d==='shops-npcs') return 'Shops / NPCs';
  if(d==='skills') return 'Skills';
  if(d==='inventory-bank') return 'Bank / Inventory';
  if(d==='drops') return 'Drops';
  if(d.startsWith('skills')) return 'Skills';
  return 'Other';
}
const pendCat={}, compCat={}, findCat={};
for(const e of j.pending_candidates) pendCat[catOfPending(e)]=(pendCat[catOfPending(e)]||0)+1;
for(const e of j.completed_checks) compCat[catOfCompleted(e)]=(compCat[catOfCompleted(e)]||0)+1;
for(const e of j.findings) findCat[catOfFinding(e)]=(findCat[catOfFinding(e)]||0)+1;
const cats=["Prayer / Slayer","Items / Equipment","Skills","Protocol / Packets","Combat","World","Shops / NPCs","Bank / Inventory","Drops"];
// build progress table lines sorted by % worst->best for README
const rows=cats.map(cat=>{
  const doneC=(findCat[cat]||0)+(compCat[cat]||0);
  const pend=pendCat[cat]||0;
  const tot=doneC+pend;
  const pct=tot? (doneC/tot*100):100;
  const eta = pend? `~${(pend/64).toFixed(1)} waves` : 'done';
  return {cat,doneC,tot,pct,pend,eta};
}).sort((a,b)=>a.pct-b.pct);
let totalPend = rows.reduce((s,r)=>s+r.pend,0);
let totalDone = rows.reduce((s,r)=>s+r.doneC,0);
let overallPct = total? (totalDone/total*100):0;
// Wave tracking: cumulative scouts = 3326 + (wave-80)*64 (Wave80 baseline 3326); but actual scouts may vary; use registry wave if no scouts arg
let cumScoutsNote = 3326 + (wave-80)*64;
let scoutsStr = `${cumScoutsNote}+`;
// Update registry generated
j.generated = j.generated.replace(/Wave\d+/, `Wave${wave}`);
fs.writeFileSync(regPath, JSON.stringify(j,null,2)+'\n','utf8');
console.log(`registry.json -> generated Wave${wave} (${findings}/${pending}/${completed}) cum ${cumScoutsNote}+`);

// Update README.md Progress header
const readmePath=path.join(mem,'README.md');
let readme=fs.readFileSync(readmePath,'utf8');
// Progress — Wave N
readme = readme.replace(/^## Progress — Wave \d+.*$/m, `## Progress — Wave ${wave} · ${scoutsStr} scouts · ${new Date().toISOString().slice(0,10)} `);
// > 40 ... — 565 total — X% done
readme = readme.replace(/> \*\*40 Findings.*$/m, `> **${findings} Findings · ${pending} Pending · ${completed} Verified** — ${total} total — **${overallPct.toFixed(1)}% done · ${totalPend} remain**`);
// Overall row
readme = readme.replace(/\*\*Overall — .+? — .+?%[\s\S]*?Pending \| ETA \|/, `**Overall — ${totalDone} / ${total} done — ${overallPct.toFixed(1)}%**\n\n| Category | Done | Total | % Done | Pending | ETA |`);
 // replace the 9-row table
const tableLines = rows.map(r=>`| ${r.cat} | ${r.doneC} | ${r.tot} | ${r.pct.toFixed(1)}% | ${r.pend} | ${r.eta} |`).join('\n');
readme = readme.replace(/\| Prayer \/ Slayer[\s\S]*?\| Drops \|.*$/m, tableLines);
fs.writeFileSync(readmePath, readme,'utf8');
console.log(`README.md Progress -> Wave${wave} ${overallPct.toFixed(1)}%`);

// Update 00_INDEX.md Status snapshot header (same as README status snapshot line)
const idxPath=path.join(mem,'00_INDEX.md');
let idx=fs.readFileSync(idxPath,'utf8');
idx = idx.replace(/^## Status snapshot \(auto-synced.*$/m, `## Status snapshot (auto-synced to \`registry.json\` v1.2 - ${new Date().toISOString().slice(0,10)} Waves 22-${wave} ${scoutsStr} scouts`);
// also bump footer *Waves 22-... if exists
idx = idx.replace(/\*Waves 22-\d+:.*$/m, `*Waves 22-${wave}: ${scoutsStr} scouts drained offline${newNote?` — Wave${wave} ${newNote}`:''}`);
fs.writeFileSync(idxPath, idx,'utf8');
console.log(`00_INDEX.md -> Waves 22-${wave}`);

// Update 04 summary header
const summaryPath=path.join(mem,'04_AuDHD_Friendly_Summary.md');
let sum=fs.readFileSync(summaryPath,'utf8');
sum = sum.replace(/Reorg v1\.2 .*?:.*?40\/.*?\/253.*?\)/, `Reorg v1.2 ${new Date().toISOString().slice(0,10)} (updated through Wave ${wave}): ${findings}/${pending}/${completed}`);
sum = sum.replace(/^## Latest — Waves 22-.*$/m, `## Latest — Waves 22-${wave} (${scoutsStr} scouts, through Wave ${wave}${newNote?` ${newNote}`:''})`);
fs.writeFileSync(summaryPath, sum,'utf8');
console.log(`04_AuDHD_Friendly_Summary.md -> Wave${wave}`);

// Coverage note
const covPath=path.join(mem,'coverage.json');
if(fs.existsSync(covPath)){
  const cov=JSON.parse(fs.readFileSync(covPath,'utf8'));
  cov.generated = `Wave${wave} ${findings}/${pending}/${completed}`;
  fs.writeFileSync(covPath, JSON.stringify(cov,null,2)+'\n','utf8');
  console.log(`coverage.json -> Wave${wave}`);
}
console.log('done sync-memory Wave'+wave);
