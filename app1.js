/* ============================================================================
   DANISH HEALTH CARE (P) LTD. — DPYMS v2
   Pure JavaScript (NO JSX, NO BABEL NEEDED)
   React.createElement used throughout. Works on all browsers directly.
============================================================================ */
var R = React.createElement;
var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useCallback = React.useCallback, Fragment = React.Fragment;

var C = {
  navy: "#0E2A5E", navy2: "#153E82", blue: "#2F6FE0", skyBlue: "#5FA8E0",
  paleBg: "#F4F7FC", panelBg: "#FFFFFF", ink: "#101826", sub: "#5B6B7F",
  line: "#DCE4F0", white: "#FFFFFF",
  ok: "#1E7B34", okBg: "#E3F5E6", warn: "#9C6500", warnBg: "#FFF3D6",
  bad: "#B00020", badBg: "#FDE3E3",
};
var FONT_DISPLAY = "'Segoe UI Semibold', 'Segoe UI', Arial, sans-serif";
var FONT_BODY = "'Segoe UI', Arial, sans-serif";
var FONT_MONO = "'Consolas', 'Courier New', monospace";

var supabaseUrl = 'https://jkwgyxzlalurbmbchanc.supabase.co';
var supabaseKey = 'sb_publishable_9XDW3gGrlrJJXKm4KjkLwQ_bwJp8U_G';
var supabase = null;
try {
  if (window.supabase && window.supabase.createClient) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
  }
} catch(e) {
  console.warn('Supabase init skipped:', e);
}

var CLOUD_SYNC_BASE = 'https://kvdb.io/DPYMS_v2_DanishPharm_2026_Prod';

var DEFAULT_LOGO = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 460 120' width='460' height='120'><rect width='100%' height='100%' fill='none'/><circle cx='50' cy='60' r='36' fill='%230E2A5E' stroke='%232F6FE0' stroke-width='3'/><path d='M50 32 V88 M36 46 H64 M36 74 H64' stroke='%235FA8E0' stroke-width='4' stroke-linecap='round'/><circle cx='50' cy='60' r='10' fill='%23FFFFFF'/><text x='100' y='55' font-family='Segoe UI,Arial,sans-serif' font-weight='800' font-size='28' fill='%230E2A5E'>DANISH</text><text x='100' y='82' font-family='Segoe UI,Arial,sans-serif' font-weight='600' font-size='16' fill='%232F6FE0'>HEALTH CARE (P) LTD.</text></svg>";
var DEFAULT_TAB  = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' rx='20' fill='%230E2A5E'/><rect x='40' y='40' width='220' height='220' rx='16' fill='%23FFFFFF' stroke='%235FA8E0' stroke-width='3'/><circle cx='90' cy='90' r='28' fill='%232F6FE0'/><circle cx='150' cy='90' r='28' fill='%232F6FE0'/><circle cx='210' cy='90' r='28' fill='%232F6FE0'/><circle cx='90' cy='150' r='28' fill='%232F6FE0'/><circle cx='150' cy='150' r='28' fill='%232F6FE0'/><circle cx='210' cy='150' r='28' fill='%232F6FE0'/><circle cx='90' cy='210' r='28' fill='%232F6FE0'/><circle cx='150' cy='210' r='28' fill='%232F6FE0'/><circle cx='210' cy='210' r='28' fill='%232F6FE0'/><text x='150' y='275' font-family='Segoe UI,Arial,sans-serif' font-weight='700' font-size='14' fill='%23FFFFFF' text-anchor='middle'>TABLETS</text></svg>";
var DEFAULT_CAP  = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' rx='20' fill='%23153E82'/><rect x='40' y='40' width='220' height='220' rx='16' fill='%23F4F7FC' stroke='%232F6FE0' stroke-width='3'/><text x='150' y='165' font-family='Segoe UI,Arial,sans-serif' font-weight='700' font-size='14' fill='%23FFFFFF' text-anchor='middle'>CAPSULES</text></svg>";
var DEFAULT_ORS  = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' rx='20' fill='%230E2A5E'/><text x='150' y='165' font-family='Segoe UI,Arial,sans-serif' font-weight='700' font-size='14' fill='%23FFFFFF' text-anchor='middle'>ORS SACHETS</text></svg>";
var DEFAULT_OINT = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><rect width='300' height='300' rx='20' fill='%23153E82'/><text x='150' y='165' font-family='Segoe UI,Arial,sans-serif' font-weight='700' font-size='14' fill='%23FFFFFF' text-anchor='middle'>OINTMENT</text></svg>";

var BRAND_LOGO = window.LOGO_B64 || 'danish_logo.jpg';
var IMG_TAB    = window.TAB_B64  || 'tablet_product.jpg';
var IMG_CAP    = window.CAP_B64  || 'capsule_product.jpg';
var IMG_ORS    = window.ORS_B64  || 'ors_product.jpg';
var IMG_OINT   = window.OINT_B64 || 'ointment_product.jpg';

// ---------- Sample Data ----------
var SAMPLE_MOTHER_BATCHES = [
  { id:"MB-TB-002", dept:"tablet", date:"2026-07-24", genericName:"Aceclofenac (100 mg) and Paracetamol (325 mg) Tablets", productGroup:"ALDONIX / ACLONAC GROUP", avgUnitWt:"630", plannedLakhUnits:"10.00", plannedBatchWt:"630.0", rrGran:"0", granOutput:"627.0", compOutput:"626.4", coated:"Y", coreAvgWt:"630", coatWtGainPct:"1.5", actualCoatedWt:"639.45", coatOutput:"635.8", remarks:"Progressive yield verified.", loggedBy:"Production/QA Officer", qaStatus:"QA Approved" },
  { id:"MB-CP-001", dept:"capsule", date:"2026-07-23", genericName:"OMEPRAZOLE CAPSULES BP 20 MG", productGroup:"OMEDAN GROUP", avgUnitWt:"326", fillWtMg:"250", shellWtMg:"76", plannedLakhUnits:"5.00", plannedBatchWt:"125.0", granOutput:"124.2", compOutput:"123.8", remarks:"Fill weight within BP spec.", loggedBy:"Production/QA Officer", qaStatus:"QA Approved" },
  { id:"MB-OR-001", dept:"ors", date:"2026-07-22", genericName:"ORS POWDER (WHO FORMULA)", productGroup:"DANISH ORS SACHETS", plannedQty:"250000", mixOutputKg:"5250", fillOutputQty:"248500", remarks:"Moisture 0.8%, Electrolyte verified.", loggedBy:"Production/QA Officer", qaStatus:"QA Approved" }
];
var SAMPLE_COMMERCIAL_BATCHES = [
  { id:"CB-TB-001", dept:"tablet", mbId:"MB-TB-002", date:"2026-07-24", productName:"ALDONIX-P", batchNumber:"LPX26001", unitsReceived:"400000", packedQty:"397600", dispatchQty:"396000", rejectedUnits:"1600", rrGeneratedUnits:"800", loggedBy:"Packaging Officer" },
  { id:"CB-TB-002", dept:"tablet", mbId:"MB-TB-002", date:"2026-07-24", productName:"ACLONAC-P", batchNumber:"APC26003", unitsReceived:"600000", packedQty:"597600", dispatchQty:"595200", rejectedUnits:"1800", rrGeneratedUnits:"600", loggedBy:"Packaging Officer" },
  { id:"CB-CP-001", dept:"capsule", mbId:"MB-CP-001", date:"2026-07-25", productName:"OMEDAN 20 CAPSULES", batchNumber:"CMA26001", unitsReceived:"500000", packedQty:"497000", dispatchQty:"496000", rejectedUnits:"2000", rrGeneratedUnits:"1000", loggedBy:"Packaging Officer" }
];

// ---------- Helpers ----------
function toSnakeCase(obj) {
  const n = {};
  for (let k in obj) {
    if (k === 'splitCount' || k === 'splitNames') continue;
    if (k === 'compRR') { n['comp_rr'] = obj[k]; continue; }
    n[k.replace(/[A-Z]/g, l => '_' + l.toLowerCase())] = obj[k];
  }
  return n;
}
function toCamelCase(obj) {
  const n = {};
  for (let k in obj) {
    if (k === 'comp_rr') { n['compRR'] = obj[k]; continue; }
    n[k.replace(/_([a-z])/g, (m, l) => l.toUpperCase())] = obj[k];
  }
  return n;
}
async function hashPassword(pwd) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
var ROLE_PASSWORDS = { production:'production123', qa:'qa123', packaging:'packaging123', manager:'manager123' };
var ROLE_HASHES = {
  production:'97f08b12c985e818cb86cd3d6f7c4dec65a586d95874ce54db426d20d383ab2a',
  qa:'c1b474e2d4e78873f848037146522c069b14798b0451cfbf5894101e4a193631',
  packaging:'e97af628deabddcc642d00c9b0fa3c488e54fe9bbe557975e5f45e5c9f04ea82',
  manager:'240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9'
};
var DEPARTMENTS = {
  tablet:   { key:"tablet",   label:"Tablets",  unit:"Lakh Tabs",    icon:"??", imgSrc:IMG_TAB,  stages:["gran","comp","coat"] },
  capsule:  { key:"capsule",  label:"Capsules", unit:"Lakh Caps",    icon:"?", imgSrc:IMG_CAP,  stages:["gran","comp"] },
  ors:      { key:"ors",      label:"ORS",      unit:"Lakh Sachets", icon:"??", imgSrc:IMG_ORS,  stages:["mix","fill"] },
  ointment: { key:"ointment", label:"Ointment", unit:"Lakh Tubes",   icon:"??", imgSrc:IMG_OINT, stages:["mix","fill"] },
};
var DEPT_LIST = Object.values(DEPARTMENTS);

// ---------- Cloud Persistence ----------
async function loadShared(key, fallback) {
  const cloudKey = key === 'dpyms_mother_batches' ? 'mother_batches' : 'commercial_batches';
  let localData = [];
  try { const r = localStorage.getItem(key); if (r) { const p = JSON.parse(r); if (Array.isArray(p)) localData = p; } } catch(e) {}
  let cloudData = [];
  try {
    const res = await fetch(supabaseUrl+'/rest/v1/'+cloudKey+'?select=*&limit=5000&order=created_at.desc', { headers:{'apikey':supabaseKey} });
    if (res.ok) { const d = await res.json(); if (Array.isArray(d) && d.length) cloudData = d.map(toCamelCase); }
  } catch(e) { console.warn("Supabase fetch warning:", e); }
  try {
    const res = await fetch(CLOUD_SYNC_BASE+'/'+cloudKey+'?nocache='+Date.now());
    if (res.ok) { const j = await res.json(); if (Array.isArray(j) && j.length) { const m = new Map(); cloudData.forEach(i => m.set(i.id,i)); j.forEach(i => m.set(i.id,i)); cloudData = Array.from(m.values()); } }
  } catch(e) {}
  const itemMap = new Map();
  if (Array.isArray(fallback)) fallback.forEach(i => itemMap.set(i.id, i));
  localData.forEach(i => itemMap.set(i.id, i));
  cloudData.forEach(i => itemMap.set(i.id, i));
  const merged = Array.from(itemMap.values());
  try { localStorage.setItem(key, JSON.stringify(merged)); } catch(e) {}
  if (merged.length > cloudData.length) saveShared(key, merged);
  return merged;
}
async function saveShared(key, value) {
  const cloudKey = key === 'dpyms_mother_batches' ? 'mother_batches' : 'commercial_batches';
  try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) {}
  try {
    await fetch(supabaseUrl+'/rest/v1/'+cloudKey, { method:'POST', headers:{'apikey':supabaseKey,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates'}, body:JSON.stringify(value.map(toSnakeCase)) });
  } catch(e) {}
  try { await fetch(CLOUD_SYNC_BASE+'/'+cloudKey, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(value) }); } catch(e) {}
  return { ok:true };
}
async function deleteSharedRow(table, id) {
  const key = table === "mother_batches" ? "dpyms_mother_batches" : "dpyms_commercial_batches";
  try { const r = localStorage.getItem(key); if (r) { const l = JSON.parse(r); await saveShared(key, l.filter(i => i.id !== id)); } } catch(e) {}
  try { if (supabase) await supabase.from(table).delete().eq('id', id); } catch(e) {}
}

// ---------- CSV Export ----------
function toCSV(data, headers) {
  if (!data || !data.length) return '';
  const keys = headers ? headers.map(h => h.key) : Object.keys(data[0]);
  const labels = headers ? headers.map(h => h.label) : Object.keys(data[0]);
  const esc = v => { if (v === null || v === undefined) return '""'; return '"' + String(v).replace(/"/g,'""') + '"'; };
  return [labels.map(esc).join(','), ...data.map(row => keys.map(k => esc(row[k])).join(','))].join('\r\n');
}
function downloadCSV(filename, csv) {
  const blob = new Blob(['\uFEFF'+csv], {type:'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ---------- Math ----------
var round2 = n => (isFinite(n) && n !== "" && n !== null ? Math.round(n*100)/100 : "");
function lakhUnitsFromKg(kg, mg) { if (!kg || !mg) return ""; return round2((kg*1000000)/mg/100000); }
function pct(num, den) { if (!num && num !== 0) return ""; if (!den) return ""; return round2((num/den)*100); }
function lakhFromUnits(u) { if (!u && u !== 0) return ""; return round2(u/100000); }

// ---------- Yield Calculations ----------
function computeMB_Tablet(mb, cbs) {
  const wt = parseFloat(mb.avgUnitWt), rr = parseFloat(mb.rrGran)||0;
  let batchWt = parseFloat(mb.plannedBatchWt);
  const plannedLakhInput = parseFloat(mb.plannedLakhUnits);
  if (isFinite(plannedLakhInput) && wt && !batchWt) batchWt = Math.max(0, (plannedLakhInput*100000*wt/1000000)-rr);
  const totalBatchKg = isFinite(batchWt) ? round2(batchWt+rr) : "";
  const plannedLakh = isFinite(plannedLakhInput) ? plannedLakhInput : (totalBatchKg !== "" ? lakhUnitsFromKg(totalBatchKg, wt) : "");
  const gran = parseFloat(mb.granOutput), granLakh = isFinite(gran)&&wt ? lakhUnitsFromKg(gran,wt) : "", granYield = isFinite(gran)&&totalBatchKg!=="" ? pct(gran,totalBatchKg) : "";
  const comp = parseFloat(mb.compOutput), compLakh = isFinite(comp)&&wt ? lakhUnitsFromKg(comp,wt) : "", compYield = isFinite(comp)&&totalBatchKg!=="" ? pct(comp,totalBatchKg) : "";
  const coated = mb.coated==="Y", coreWt = parseFloat(mb.coreAvgWt)||wt, coatGainPct = parseFloat(mb.coatWtGainPct)||0;
  const expectedCoatedWt = isFinite(coreWt) ? round2(coreWt*(1+coatGainPct/100)) : "";
  const actualCoatedWt = parseFloat(mb.actualCoatedWt)||expectedCoatedWt;
  let coat = parseFloat(mb.coatOutput);
  if (!coat && coated && isFinite(comp) && coatGainPct) coat = round2(comp*(1+coatGainPct/100));
  const effWt = actualCoatedWt||wt;
  const coatLakh = coated&&isFinite(coat)&&effWt ? lakhUnitsFromKg(coat,effWt) : "";
  const coatYield = !coated ? "NA" : (isFinite(coat)&&isFinite(comp) ? pct(comp,totalBatchKg) : "");
  const linked = cbs.filter(c => c.mbId === mb.id);
  const packedLakhTotal = round2(linked.reduce((s,c)=>s+(isFinite(parseFloat(c.packedQty))?parseFloat(c.packedQty)/100000:0),0));
  const packedUnitsTotal = linked.reduce((s,c)=>s+(parseFloat(c.packedQty)||0),0);
  const dispatchLakhTotal = round2(linked.reduce((s,c)=>s+(isFinite(parseFloat(c.dispatchQty))?parseFloat(c.dispatchQty)/100000:0),0));
  const dispatchUnitsTotal = linked.reduce((s,c)=>s+(parseFloat(c.dispatchQty)||0),0);
  const totalInputUnits = plannedLakh*100000;
  const finalYield = totalInputUnits>0&&dispatchUnitsTotal>0 ? pct(dispatchUnitsTotal,totalInputUnits) : "";
  return { totalBatchKg, plannedLakh, gran, granLakh, granYield, comp, compLakh, compYield, coated, coreWt, coatGainPct, expectedCoatedWt, actualCoatedWt, coat:coated?coat:"NA", coatLakh:coated?coatLakh:"NA", coatYield, packedLakhTotal, packedUnitsTotal, dispatchLakhTotal, dispatchUnitsTotal, finalYield, linkedCount:linked.length, linked, qaStatus:mb.qaStatus||"Pending" };
}
function computeMB_Capsule(mb, cbs) {
  const fillWt = parseFloat(mb.fillWtMg), shellWt = parseFloat(mb.shellWtMg);
  const avgFilledCapWt = isFinite(fillWt)&&isFinite(shellWt) ? round2(fillWt+shellWt) : parseFloat(mb.avgUnitWt);
  let batchWt = parseFloat(mb.plannedBatchWt);
  const plannedLakhInput = parseFloat(mb.plannedLakhUnits);
  if (isFinite(plannedLakhInput)&&fillWt&&!batchWt) batchWt = (plannedLakhInput*100000*fillWt)/1000000;
  const totalBatchKg = isFinite(batchWt) ? round2(batchWt) : "";
  const plannedLakh = isFinite(plannedLakhInput) ? plannedLakhInput : (totalBatchKg!==""&&fillWt ? lakhUnitsFromKg(totalBatchKg,fillWt) : "");
  const gran = parseFloat(mb.granOutput), granLakh = isFinite(gran)&&fillWt ? lakhUnitsFromKg(gran,fillWt) : "", granYield = isFinite(gran)&&totalBatchKg!=="" ? pct(gran,totalBatchKg) : "";
  const comp = parseFloat(mb.compOutput), compLakh = isFinite(comp)&&avgFilledCapWt ? lakhUnitsFromKg(comp,avgFilledCapWt) : "", compYield = isFinite(comp)&&totalBatchKg!=="" ? pct(comp,totalBatchKg) : "";
  const linked = cbs.filter(c => c.mbId === mb.id);
  const packedLakhTotal = round2(linked.reduce((s,c)=>s+(parseFloat(c.packedQty)||0)/100000,0));
  const dispatchLakhTotal = round2(linked.reduce((s,c)=>s+(parseFloat(c.dispatchQty)||0)/100000,0));
  const dispatchUnitsTotal = linked.reduce((s,c)=>s+(parseFloat(c.dispatchQty)||0),0);
  const finalYield = plannedLakh*100000>0&&dispatchUnitsTotal>0 ? pct(dispatchUnitsTotal,plannedLakh*100000) : "";
  return { fillWt, shellWt, avgFilledCapWt, totalBatchKg, plannedLakh, gran, granLakh, granYield, comp, compLakh, compYield, coat:"NA", coatYield:"NA", packedLakhTotal, dispatchLakhTotal, dispatchUnitsTotal, finalYield, linkedCount:linked.length, linked, qaStatus:mb.qaStatus||"Pending" };
}
function computeMB_OrsOintment(mb, cbs) {
  const plannedQty = parseFloat(mb.plannedQty), plannedLakh = isFinite(plannedQty) ? lakhFromUnits(plannedQty) : "";
  const mixOutputKg = parseFloat(mb.mixOutputKg), fillQty = parseFloat(mb.fillOutputQty);
  const fillLakh = isFinite(fillQty) ? lakhFromUnits(fillQty) : "", fillYield = isFinite(fillQty)&&plannedQty ? pct(fillQty,plannedQty) : "";
  const linked = cbs.filter(c => c.mbId === mb.id);
  const packedLakhTotal = round2(linked.reduce((s,c)=>s+(parseFloat(c.packedQty)||0)/100000,0));
  const dispatchLakhTotal = round2(linked.reduce((s,c)=>s+(parseFloat(c.dispatchQty)||0)/100000,0));
  const dispatchUnitsTotal = linked.reduce((s,c)=>s+(parseFloat(c.dispatchQty)||0),0);
  const finalYield = plannedQty>0&&dispatchUnitsTotal>0 ? pct(dispatchUnitsTotal,plannedQty) : "";
  return { plannedQty, plannedLakh, mixOutputKg, totalBatchKg:mixOutputKg, gran:mixOutputKg, granYield:100, comp:fillQty, compYield:fillYield, coat:"NA", coatYield:"NA", fillQty, fillLakh, fillYield, packedLakhTotal, dispatchLakhTotal, dispatchUnitsTotal, finalYield, linkedCount:linked.length, linked, qaStatus:mb.qaStatus||"Pending" };
}
function computeMB(mb, cbs) {
  if (mb.dept === "capsule") return computeMB_Capsule(mb, cbs);
  if (mb.dept === "ors" || mb.dept === "ointment") return computeMB_OrsOintment(mb, cbs);
  return computeMB_Tablet(mb, cbs);
}
function computeCB(cb, mbs) {
  const unitsRecv = parseFloat(cb.unitsReceived)||0, packed = parseFloat(cb.packedQty)||0, dispatch = parseFloat(cb.dispatchQty)||0, rejected = parseFloat(cb.rejectedUnits)||0, rrGen = parseFloat(cb.rrGeneratedUnits)||0;
  const pkgYield = unitsRecv>0 ? pct(packed+rrGen,unitsRecv) : "", dispatchYield = packed>0 ? pct(dispatch,packed) : "", finalYield = unitsRecv>0 ? pct(dispatch,unitsRecv) : "";
  return { mb:mbs.find(m=>m.id===cb.mbId), unitsRecv, recvLakh:lakhFromUnits(unitsRecv), packed, packedLakh:lakhFromUnits(packed), dispatch, dispatchLakh:lakhFromUnits(dispatch), rejected, rrGen, rrGenLakh:lakhFromUnits(rrGen), effectiveLossUnits:Math.max(0,unitsRecv-(packed+rrGen)), pkgYield, dispatchYield, finalYield };
}

var DEPT_PREFIX = { tablet:"TB", capsule:"CP", ors:"OR", ointment:"OT" };
var genMBId = (existing, dept) => { const p = "MB-"+DEPT_PREFIX[dept], nums = existing.filter(m=>m.dept===dept).map(m=>parseInt((m.id||"").split("-").pop(),10)).filter(n=>!isNaN(n)); return p+"-"+String((nums.length?Math.max(...nums):0)+1).padStart(3,"0"); };
var genCBId = (existing, dept) => { const p = "CB-"+DEPT_PREFIX[dept], nums = existing.filter(c=>c.dept===dept).map(c=>parseInt((c.id||"").split("-").pop(),10)).filter(n=>!isNaN(n)); return p+"-"+String((nums.length?Math.max(...nums):0)+1).padStart(3,"0"); };
var sortNewestFirst = arr => [...arr].sort((a,b)=>{ const da=new Date(a.date||0).getTime(),db=new Date(b.date||0).getTime(); return db!==da?db-da:(b.createdAt||0)-(a.createdAt||0); });
function fmtDate(d) { if (!d) return "—"; try { return new Date(d).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); } catch(e){return d;} }
function fmtNum(n) { if (n===""||n===undefined||n===null) return "—"; return Number(n).toLocaleString("en-IN"); }

// ---------- onError handler for images ----------
function logoOnError(e) {
  const step = parseInt(e.target.dataset.step||"0",10);
  if (step===0){e.target.dataset.step="1";e.target.src="danish_logo.png";}
  else if(step===1){e.target.dataset.step="2";e.target.src="assets/danish_logo.jpg";}
  else{e.target.onerror=null;e.target.src=DEFAULT_LOGO;}
}
function deptImgOnError(key){
  return function(e){
    const step=parseInt(e.target.dataset.step||"0",10);
    if(step===0){e.target.dataset.step="1";e.target.src=key+".jpg";}
    else if(step===1){e.target.dataset.step="2";e.target.src=key+"_product.png";}
    else if(step===2){e.target.dataset.step="3";e.target.src="assets/"+key+"_product.jpg";}
    else{e.target.onerror=null;if(key==="tablet")e.target.src=DEFAULT_TAB;else if(key==="capsule")e.target.src=DEFAULT_CAP;else if(key==="ors")e.target.src=DEFAULT_ORS;else e.target.src=DEFAULT_OINT;}
  };
}

// ====== UI COMPONENTS ======
var inputStyle = { width:"100%", padding:"11px 12px", fontSize:15, border:"1.5px solid "+C.line, borderRadius:9, outline:"none", fontFamily:FONT_BODY, color:C.ink, background:C.white, boxSizing:"border-box" };

function TextInput(props) {
  return R('input', Object.assign({}, props, { style: Object.assign({}, inputStyle, props.style||{}) }));
}
function SelectInput(props) {
  const { children } = props;
  const rest = Object.assign({}, props, { style: Object.assign({}, inputStyle, props.style||{}) });
  delete rest.children;
  return R('select', rest, children);
}
function Card(props) {
  return R('div', { style: Object.assign({ background:C.panelBg, borderRadius:16, border:"1px solid "+C.line, boxShadow:"0 1px 3px rgba(14,42,94,0.06)" }, props.style||{}) }, props.children);
}
function PrimaryButton(props) {
  const { children } = props;
  const rest = Object.assign({}, props, { style: Object.assign({ background:C.navy, color:C.white, border:"none", borderRadius:10, padding:"13px 18px", fontSize:14.5, fontWeight:700, cursor:"pointer", width:"100%" }, props.style||{}) });
  delete rest.children;
  return R('button', rest, children);
}
function SecondaryButton(props) {
  const { children } = props;
  const rest = Object.assign({}, props, { style: Object.assign({ background:C.white, color:C.navy, border:"1.5px solid "+C.navy, borderRadius:10, padding:"11px 16px", fontSize:13.5, fontWeight:700, cursor:"pointer" }, props.style||{}) });
  delete rest.children;
  return R('button', rest, children);
}
function Field(props) {
  return R('label', { style:{ display:"block", marginBottom:14 } },
    R('div', { style:{ fontSize:12, fontWeight:700, color:C.navy, marginBottom:5, textTransform:"uppercase", letterSpacing:0.4 } }, props.label),
    props.children,
    props.hint ? R('div', { style:{ fontSize:11, color:C.sub, marginTop:3 } }, props.hint) : null
  );
}
function Stat(props) {
  return R('div', null,
    R('div', { style:{ color:C.sub, fontSize:10.5, textTransform:"uppercase" } }, props.label),
    R('div', { style:{ fontWeight:700, marginTop:2 } }, props.value)
  );
}
function Toast(props) {
  useEffect(function(){ const t = setTimeout(props.onDone, 2400); return function(){ clearTimeout(t); }; }, [props.onDone]);
  return R('div', { style:{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:C.navy, color:C.white, padding:"12px 22px", borderRadius:999, fontSize:13.5, boxShadow:"0 6px 20px rgba(0,0,0,0.25)", zIndex:100, display:"flex", alignItems:"center", gap:8, maxWidth:"90vw", textAlign:"center" } },
    R('span', { style:{ color:C.skyBlue } }, "?"), " ", props.message
  );
}
function StatusPill(props) {
  let bg = C.line, fg = C.sub;
  if (props.status==="QA Approved"||props.status==="Approved"){bg=C.okBg;fg=C.ok;}
  else if(props.status==="Pending"||props.status==="On Hold"){bg=C.warnBg;fg=C.warn;}
  else if(props.status==="QA Rejected"||props.status==="Rejected"){bg=C.badBg;fg=C.bad;}
  if (!props.status) return R('span', { style:{color:C.sub, fontSize:12} }, "—");
  return R('span', { style:{ background:bg, color:fg, fontSize:11.5, fontWeight:700, padding:"4px 10px", borderRadius:999, whiteSpace:"nowrap" } }, props.status);
}
function YieldBadge(props) {
  const v = props.value;
  if (v===""||v===undefined||v===null) return R('span',{style:{color:C.sub}},"—");
  if (v==="NA") return R('span',{style:{color:C.sub}},"NA");
  let color = C.ok;
  if (v < 90) color = C.bad; else if (v < 97) color = C.warn;
  return R('span',{style:{color, fontWeight:700, fontFamily:FONT_MONO}}, v+"%");
}
function FilterChip(props) {
  return R('button', { onClick:props.onClick, style:{ background:props.active?C.navy:C.white, color:props.active?C.white:C.ink, border:"1.5px solid "+(props.active?C.navy:C.line), borderRadius:999, padding:"7px 14px", fontSize:12.5, fontWeight:600, cursor:"pointer" } }, props.label);
}
function SectionHeading(props) {
  return R('div', { style:{ marginBottom:props.small?12:18, marginTop:props.small?26:0, display:"flex", justifyContent:"space-between", alignItems:"flex-end", flexWrap:"wrap", gap:10 } },
    R('div', null,
      props.eyebrow ? R('div', { style:{ fontSize:11, fontWeight:700, color:C.blue, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 } }, props.eyebrow) : null,
      R('div', { style:{ fontFamily:FONT_DISPLAY, fontSize:props.small?18:22, fontWeight:700, color:C.navy } }, props.title),
      props.sub ? R('div', { style:{ color:C.sub, fontSize:13, marginTop:4 } }, props.sub) : null
    ),
    props.right || null
  );
}
function EmptyNote(props) {
  return R('div', { style:{ textAlign:"center", padding:"28px 16px", color:C.sub, fontSize:14 } }, props.text);
}
function BrandHeader(props) {
  return R('div', { style:{ textAlign:"center", marginBottom:props.small?20:32 } },
    R('img', { src:BRAND_LOGO, onError:logoOnError, alt:"Danish Healthcare Logo", className:"brand-header-logo", style:{ marginBottom:14, maxHeight:props.small?48:72, maxWidth:"320px", width:"auto", objectFit:"contain", background:"#FFFFFF", padding:"8px 20px", borderRadius:12, boxShadow:"0 4px 18px rgba(0,0,0,0.25)" } }),
    R('div', { style:{ color:"rgba(255,255,255,0.9)", fontSize:12.5, letterSpacing:1.5, textTransform:"uppercase", fontWeight:700 } }, "DANISH HEALTH CARE (P) LTD. · UJJAIN"),
    R('div', { style:{ color:"rgba(255,255,255,0.65)", fontSize:12, marginTop:4 } }, "Digital Production Yield Management System (DPYMS v2)")
  );
}
function UniversalActionBar(props) {
  const isEditing = props.isEditing || false;
  return R('div', { className:"nav-action-bar no-print" },
    props.onBack ? R('button', { type:"button", className:"btn-nav btn-back", onClick:props.onBack }, "? Back") : null,
    !isEditing && props.onSave ? R('button', { type:"button", className:"btn-nav btn-save", onClick:props.onSave }, "?? Save") : null,
    !isEditing && props.onEdit ? R('button', { type:"button", className:"btn-nav btn-edit", onClick:props.onEdit }, "?? Edit") : null,
    isEditing && props.onUpdate ? R('button', { type:"button", className:"btn-nav btn-update", onClick:props.onUpdate }, "?? Update Record") : null,
    props.onDelete ? R('button', { type:"button", className:"btn-nav btn-delete", onClick:props.onDelete }, "??? Delete Batch") : null
  );
}

// ====== ROLE PICKER ======
function RolePicker(props) {
  const roles = [
    { key:"production", label:"Production", desc:"Log & Edit Mother Batches — Granulation, Compression, Coating", icon:"?" },
    { key:"qa", label:"Quality Assurance (QA)", desc:"Inspection, Assay, QC Approvals & Status Updates", icon:"??" },
    { key:"packaging", label:"Packaging", desc:"Commercial Batches — Packing, Rejections, Dispatch & Yields", icon:"??" },
    { key:"manager", label:"Manager Dashboard", desc:"Full plant view — unified stage tracking & GMP reports", icon:"?" },
  ];
  const [selectedRole, setSelectedRole] = useState(null);
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePick = async function(e) {
    e.preventDefault();
    const inputPwd = password.trim().toLowerCase();
    if (inputPwd === ROLE_PASSWORDS[selectedRole] || await hashPassword(password) === ROLE_HASHES[selectedRole]) {
      props.onPick(selectedRole);
    } else {
      setErrorMsg("Incorrect password. Please try again.");
    }
  };

  if (selectedRole) {
    const roleObj = roles.find(r => r.key === selectedRole);
    return R('div', { style:{ minHeight:"100vh", background:"linear-gradient(160deg,"+C.navy+" 0%,"+C.navy2+" 55%,"+C.blue+" 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:FONT_BODY } },
      R(BrandHeader, null),
      R(Card, { style:{ padding:24, width:"100%", maxWidth:380, textAlign:"center" } },
        R('h2', { style:{ margin:"0 0 8px", fontSize:18, color:C.navy, fontFamily:FONT_DISPLAY } }, "Enter Password"),
        R('p', { style:{ margin:"0 0 18px", fontSize:13, color:C.sub } }, "Role: ", R('strong', null, roleObj.label)),
        R('form', { onSubmit:handlePick },
          R('input', { type:"password", value:password, onChange:function(e){setPassword(e.target.value);}, placeholder:"Enter Password", autoFocus:true, style:{ width:"100%", padding:"12px", borderRadius:8, border:"1px solid "+C.line, marginBottom:14, fontSize:15, boxSizing:"border-box" } }),
          errorMsg ? R('div', { style:{ color:C.bad, fontSize:12.5, marginBottom:14, fontWeight:600 } }, errorMsg) : null,
          R('div', { style:{ display:"flex", gap:10 } },
            R('button', { type:"button", onClick:function(){ setSelectedRole(null); setErrorMsg(""); setPassword(""); }, style:{ flex:1, padding:"12px", borderRadius:8, background:C.white, border:"1px solid "+C.line, color:C.sub, cursor:"pointer", fontWeight:"bold" } }, "Back"),
            R('button', { type:"submit", style:{ flex:1, padding:"12px", borderRadius:8, background:C.navy, color:C.white, border:"none", cursor:"pointer", fontWeight:"bold" } }, "Login ?")
          )
        )
      )
    );
  }

  return R('div', { style:{ minHeight:"100vh", background:"linear-gradient(160deg,"+C.navy+" 0%,"+C.navy2+" 55%,"+C.blue+" 100%)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:FONT_BODY } },
    R(BrandHeader, null),
    R('div', { style:{ display:"flex", flexDirection:"column", gap:14, width:"100%", maxWidth:440 } },
      roles.map(function(r) {
        return R('button', { key:r.key, onClick:function(){ setSelectedRole(r.key); }, style:{ background:C.white, border:"none", borderRadius:14, padding:"18px 20px", display:"flex", alignItems:"center", gap:16, cursor:"pointer", textAlign:"left", boxShadow:"0 4px 18px rgba(0,0,0,0.25)" } },
          R('div', { style:{ width:46, height:46, minWidth:46, borderRadius:10, background:C.paleBg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 } }, r.icon),
          R('div', null,
            R('div', { style:{ fontWeight:700, fontSize:16, color:C.ink } }, r.label),
            R('div', { style:{ fontSize:12.5, color:C.sub, marginTop:2 } }, r.desc)
          )
        );
      })
    ),
    R('div', { style:{ color:"rgba(255,255,255,0.45)", fontSize:11, marginTop:36 } }, "Pick your department role to log in")
  );
}

// ====== DEPARTMENT PICKER ======
function DepartmentPicker(props) {
  return R('div', { style:{ minHeight:"100vh", background:C.paleBg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:FONT_BODY } },
    R('img', { src:BRAND_LOGO, onError:logoOnError, alt:"Danish Healthcare", style:{ maxHeight:64, maxWidth:"300px", width:"auto", objectFit:"contain", marginBottom:20, background:"#FFFFFF", padding:"6px 16px", borderRadius:10, boxShadow:"0 2px 8px rgba(14,42,94,0.08)" } }),
    R('div', { style:{ textAlign:"center", marginBottom:28 } },
      R('div', { style:{ fontFamily:FONT_DISPLAY, fontSize:20, fontWeight:700, color:C.navy } }, "Select Product Line"),
      R('div', { style:{ fontSize:12.5, color:C.sub, marginTop:4 } }, "Choose manufacturing section for yield logging")
    ),
    R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, width:"100%", maxWidth:480 } },
      DEPT_LIST.map(function(d) {
        return R('button', { key:d.key, onClick:function(){ props.onPick(d.key); }, style:{ background:C.white, border:"1.5px solid "+C.line, borderRadius:16, padding:"20px 16px", cursor:"pointer", textAlign:"center", boxShadow:"0 4px 14px rgba(14,42,94,0.06)", display:"flex", flexDirection:"column", alignItems:"center", gap:12 } },
          R('img', { src:d.imgSrc, onError:deptImgOnError(d.key), alt:d.label, className:"product-card-img" }),
          R('div', null,
            R('div', { style:{ fontWeight:700, fontSize:15, color:C.ink } }, d.label),
            R('div', { style:{ fontSize:11.5, color:C.sub, marginTop:2 } }, d.unit)
          )
        );
      })
    ),
    R('button', { onClick:props.onBack, style:{ background:"none", border:"none", color:C.sub, fontSize:12.5, marginTop:28, cursor:"pointer", fontWeight:600 } }, "? Back to Roles")
  );
}

// ====== TOP BAR ======
function TopBar(props) {
  return R('div', { style:{ background:C.navy, color:C.white, padding:"10px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:20, boxShadow:"0 2px 8px rgba(0,0,0,0.15)", flexWrap:"wrap", gap:8 }, className:"no-print" },
    R('div', { style:{ display:"flex", alignItems:"center", gap:12 } },
      R('img', { src:BRAND_LOGO, onError:function(e){e.target.onerror=null;e.target.src=DEFAULT_LOGO;}, alt:"Logo", style:{ height:32, borderRadius:4 } }),
      R('div', null,
        R('div', { style:{ fontWeight:700, fontSize:13.5, fontFamily:FONT_DISPLAY, display:"flex", alignItems:"center", gap:8 } },
          "DPYMS v2 · Danish Healthcare",
          R('span', { style:{ fontSize:10, background:props.isSyncing?C.warnBg:C.okBg, color:props.isSyncing?C.warn:C.ok, padding:"2px 8px", borderRadius:999, fontWeight:700 } }, props.isSyncing?"?? Syncing...":"? Multi-Device Live")
        ),
        R('div', { style:{ fontSize:10, color:C.skyBlue, letterSpacing:0.5 } }, props.roleLabel+(props.deptLabel?" · "+props.deptLabel:"")+(props.userName?" · "+props.userName:""))
      )
    ),
    R('div', { style:{ display:"flex", gap:8, flexWrap:"wrap" } },
      R('button', { onClick:props.onForcePush, title:"Push all batches to Cloud", style:{ background:C.okBg, border:"1px solid "+C.ok, color:C.ok, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:700 } }, "?? Push Data to Cloud"),
      R('button', { onClick:props.onManualSync, title:"Fetch latest from Cloud", style:{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.35)", color:C.white, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer", fontWeight:700 } }, "?? Sync Cloud Data"),
      props.showDeptChange ? R('button', { onClick:props.onChangeDept, style:{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.28)", color:C.white, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" } }, "? Change Department") : null,
      R('button', { onClick:props.onSwitchRole, style:{ background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.28)", color:C.white, borderRadius:8, padding:"6px 12px", fontSize:12, cursor:"pointer" } }, "? Switch Role")
    )
  );
}

// ====== PRODUCTION SCREEN ======
function ProductionScreen(props) {
  const dept = props.dept, motherBatches = props.motherBatches, commercialBatches = props.commercialBatches;
  const d = (dept && DEPARTMENTS[dept]) || { label:"Plant-Wide", unit:"Units", imgSrc:DEFAULT_LOGO };
  const isTablet = dept==="tablet", isCapsule=dept==="capsule", isOrsOintment=dept==="ors"||dept==="ointment";
  const [viewAllDepts, setViewAllDepts] = useState(false);
  const deptBatches = viewAllDepts ? motherBatches : motherBatches.filter(function(m){ return m.dept===dept; });
  const blank = { id:"", dept, date:new Date().toISOString().slice(0,10), genericName:"", productGroup:"", avgUnitWt:"", plannedLakhUnits:"", plannedBatchWt:"", rrGran:"0", granOutput:"", compOutput:"", compRR:"0", coated:"N", coreAvgWt:"", coatWtGainPct:"", actualCoatedWt:"", coatOutput:"", fillWtMg:"", shellWtMg:"", plannedQty:"", mixOutputKg:"", fillOutputQty:"", remarks:"", loggedBy:props.userName||"", qaStatus:"Pending" };
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState("");
  useEffect(function(){ setForm(blank); setEditingId(null); }, [dept]); // eslint-disable-line
  function set(k){ return function(e){ setForm(function(f){ const next = Object.assign({},f,{[k]:e.target.value}); if(k==="coatWtGainPct"||k==="compOutput"||k==="actualCoatedWt"){ const comp=parseFloat(next.compOutput),gain=parseFloat(next.coatWtGainPct); if(isFinite(comp)&&isFinite(gain)) next.coatOutput=round2(comp*(1+gain/100)); } return next; }); }; }
  const previewLakhs = form.plannedLakhUnits ? parseFloat(form.plannedLakhUnits) : "";
  const previewAvgWt = isCapsule ? (parseFloat(form.fillWtMg)||parseFloat(form.avgUnitWt)) : parseFloat(form.avgUnitWt);
  const rrVal = parseFloat(form.rrGran)||0;
  const rawReqKg = previewLakhs&&previewAvgWt ? round2((previewLakhs*100000*previewAvgWt)/1000000) : "";
  const calculatedReqKg = rawReqKg!=="" ? Math.max(0,round2(rawReqKg-rrVal)) : "";
  const saveRecord = async function(isUpdate) {
    if (!form.genericName){ setToast("Please enter Generic Product Name"); return; }
    let recordId = form.id;
    if (!recordId) recordId = genMBId(motherBatches, dept);
    const updatedForm = Object.assign({}, form, { id:recordId, createdAt:form.createdAt||Date.now() });
    let updatedList;
    if (isUpdate && editingId) updatedList = motherBatches.map(function(m){ return m.id===editingId?updatedForm:m; });
    else updatedList = [updatedForm, ...motherBatches.filter(function(m){ return m.id!==recordId; })];
    const sorted = sortNewestFirst(updatedList);
    props.setMotherBatches(sorted);
    await saveShared("dpyms_mother_batches", sorted);
    setToast("Mother Batch "+recordId+" "+(isUpdate?"updated":"saved")+" & synced to all devices!");
    if (isUpdate) setEditingId(null);
    setForm(Object.assign({}, blank, { date:new Date().toISOString().slice(0,10) }));
  };
  const deleteBatch = async function(mbId) {
    if (!window.confirm("Are you sure you want to delete Mother Batch "+mbId+"?")) return;
    const updatedMBs = motherBatches.filter(function(m){ return m.id!==mbId; });
    const updatedCBs = commercialBatches.filter(function(c){ return c.mbId!==mbId; });
    props.setMotherBatches(updatedMBs); props.setCommercialBatches(updatedCBs);
    deleteSharedRow("mother_batches", mbId);
    await saveShared("dpyms_mother_batches", updatedMBs);
    await saveShared("dpyms_commercial_batches", updatedCBs);
    if (form.id===mbId||editingId===mbId){ setForm(blank); setEditingId(null); }
    setToast("Mother Batch "+mbId+" deleted");
  };
  const editBatch = function(mb){ setForm(mb); setEditingId(mb.id); window.scrollTo({top:0,behavior:"smooth"}); };

  return R('div', { style:{ maxWidth:820, margin:"0 auto", padding:"20px 16px 60px" } },
    R(SectionHeading, { eyebrow:"Production · "+d.label, title:(editingId?"Edit":"Log")+" "+d.label+" Mother Batch", sub:"Progressive multi-stage record (Syncs live across all devices)." }),
    R(UniversalActionBar, { onSave:function(){ saveRecord(false); }, onEdit:editingId?null:function(){ if(deptBatches[0]) editBatch(deptBatches[0]); }, onUpdate:function(){ saveRecord(true); }, onDelete:editingId?function(){ deleteBatch(editingId); }:null, onBack:function(){ setForm(blank); setEditingId(null); }, isEditing:!!editingId }),
    R(Card, { style:{ padding:22, marginBottom:24 } },
      editingId ? R('div', { style:{ background:C.warnBg, color:C.warn, padding:"8px 14px", borderRadius:8, fontSize:12.5, fontWeight:700, marginBottom:16, display:"flex", justifyContent:"space-between", alignItems:"center" } },
        R('span', null, "?? Editing Active Batch: "+editingId),
        R('button', { type:"button", className:"btn-nav btn-delete", style:{ padding:"4px 8px", fontSize:11 }, onClick:function(){ deleteBatch(editingId); } }, "??? Delete Batch")
      ) : null,
      R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
        R(Field, { label:"Date" }, R(TextInput, { type:"date", value:form.date, onChange:set("date") })),
        R(Field, { label:"Production/QA Officer Name" }, R(TextInput, { placeholder:"Officer Name", value:form.loggedBy, onChange:set("loggedBy") }))
      ),
      R(Field, { label:"Generic Name of Product" }, R(TextInput, { placeholder:isTablet?"e.g. Aceclofenac (100 mg) Tablets":"e.g. OMEPRAZOLE CAPSULES BP 20 MG", value:form.genericName, onChange:set("genericName") })),
      R(Field, { label:"Product Group / Brand Family" }, R(TextInput, { placeholder:"e.g. ALDONIX / ACLONAC GROUP", value:form.productGroup, onChange:set("productGroup") })),
      // Tablet fields
      isTablet ? R(Fragment, null,
        R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
          R(Field, { label:"Planned Tablets (in Lakhs)" }, R(TextInput, { type:"number", step:"0.01", placeholder:"e.g. 10.00", value:form.plannedLakhUnits, onChange:set("plannedLakhUnits") })),
          R(Field, { label:"Avg Tablet Wt (mg)" }, R(TextInput, { type:"number", placeholder:"e.g. 630", value:form.avgUnitWt, onChange:set("avgUnitWt") }))
        ),
        R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
          R(Field, { label:"RR Added — Granulation (kg)", hint:"Reusable RR from previous runs" }, R(TextInput, { type:"number", value:form.rrGran, onChange:set("rrGran") })),
          R(Field, { label:"Planned Batch Wt (kg)", hint:calculatedReqKg!==""?"Auto Req (reduced by RR): "+calculatedReqKg+" kg":"Batch size in kg" }, R(TextInput, { type:"number", placeholder:calculatedReqKg||"e.g. 630.0", value:form.plannedBatchWt||calculatedReqKg, onChange:set("plannedBatchWt") }))
        ),
        R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
          R(Field, { label:"Granulation Output (kg)" }, R(TextInput, { type:"number", value:form.granOutput, onChange:set("granOutput") })),
          R(Field, { label:"Compression Output (kg)" }, R(TextInput, { type:"number", value:form.compOutput, onChange:set("compOutput") }))
        ),
        R('div', { style:{ borderTop:"1px solid "+C.line, paddingTop:16, marginTop:8, marginBottom:14 } },
          R('div', { style:{ fontSize:13, fontWeight:700, color:C.navy, marginBottom:12 } }, "Coating Section Details"),
          R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
            R(Field, { label:"Coated Tablet?" },
              R(SelectInput, { value:form.coated, onChange:set("coated") },
                R('option', { value:"N" }, "No — Uncoated"),
                R('option', { value:"Y" }, "Yes — Coated")
              )
            ),
            form.coated==="Y" ? R(Field, { label:"Percent Weight Gain (%)", hint:"Triggers auto coating output" }, R(TextInput, { type:"number", placeholder:"e.g. 1.5", value:form.coatWtGainPct, onChange:set("coatWtGainPct") })) : null
          ),
          form.coated==="Y" ? R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
            R(Field, { label:"Actual Coated Tablet Wt (mg)" }, R(TextInput, { type:"number", placeholder:"e.g. 639.45", value:form.actualCoatedWt, onChange:set("actualCoatedWt") })),
            R(Field, { label:"Coating Output (kg)", hint:"Calculated automatically" }, R(TextInput, { type:"number", value:form.coatOutput, onChange:set("coatOutput") }))
          ) : null
        )
      ) : null,
      // Capsule fields
      isCapsule ? R(Fragment, null,
        R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
          R(Field, { label:"Planned Capsules (in Lakhs)" }, R(TextInput, { type:"number", placeholder:"e.g. 5.00", value:form.plannedLakhUnits, onChange:set("plannedLakhUnits") })),
          R(Field, { label:"Avg Fill Weight (mg)" }, R(TextInput, { type:"number", placeholder:"e.g. 250", value:form.fillWtMg, onChange:set("fillWtMg") }))
        ),
        R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
          R(Field, { label:"Avg Shell Weight (mg)" }, R(TextInput, { type:"number", placeholder:"e.g. 76", value:form.shellWtMg, onChange:set("shellWtMg") })),
          R(Field, { label:"Granulation Output (kg)" }, R(TextInput, { type:"number", value:form.granOutput, onChange:set("granOutput") }))
        ),
        R(Field, { label:"Filling Output (kg)" }, R(TextInput, { type:"number", value:form.compOutput, onChange:set("compOutput") }))
      ) : null,
      // ORS/Ointment fields
      isOrsOintment ? R(Fragment, null,
        R(Field, { label:"Planned Quantity ("+(dept==="ors"?"sachets":"tubes")+")" }, R(TextInput, { type:"number", placeholder:"e.g. 250000", value:form.plannedQty, onChange:set("plannedQty") })),
        R(Field, { label:"Mix Output (kg)" }, R(TextInput, { type:"number", value:form.mixOutputKg, onChange:set("mixOutputKg") })),
        R(Field, { label:"Fill Output ("+(dept==="ors"?"sachets":"tubes")+" filled)" }, R(TextInput, { type:"number", value:form.fillOutputQty, onChange:set("fillOutputQty") }))
      ) : null,
      R(Field, { label:"Remarks / Observations" }, R(TextInput, { value:form.remarks, onChange:set("remarks") }))
    ),
    R(SectionHeading, { title:viewAllDepts?"All Plant Mother Batches ("+motherBatches.length+")":"Recent "+d.label+" Mother Batches ("+deptBatches.length+")", small:true }),
    R('div', { style:{ display:"flex", gap:10, marginBottom:14 } },
      R(FilterChip, { active:!viewAllDepts, onClick:function(){ setViewAllDepts(false); }, label:"Current Section ("+d.label+")" }),
      R(FilterChip, { active:viewAllDepts, onClick:function(){ setViewAllDepts(true); }, label:"?? View All Plant Lines ("+motherBatches.length+" Batches)" })
    ),
    R('div', { style:{ display:"flex", flexDirection:"column", gap:12 } },
      deptBatches.map(function(mb) {
        const calc = computeMB(mb, commercialBatches);
        return R(Card, { key:mb.id, style:{ padding:16 } },
          R('div', { style:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" } },
            R('div', null,
              R('div', { style:{ fontWeight:700, fontSize:14, color:C.ink } }, mb.id+" · "+(mb.genericName||"Untitled")),
              R('div', { style:{ fontSize:12, color:C.sub, marginTop:2 } }, fmtDate(mb.date)+(mb.loggedBy?" · Officer: "+mb.loggedBy:"")+" · Planned: ", R('b', null, calc.plannedLakh?calc.plannedLakh+" Lacs":"—"), " ("+(calc.totalBatchKg?calc.totalBatchKg+" kg":"—")+")")
            ),
            R('div', { style:{ display:"flex", alignItems:"center", gap:8 } },
              R(StatusPill, { status:mb.qaStatus||"Pending" }),
              R('button', { type:"button", className:"btn-nav btn-edit", style:{ padding:"5px 10px", fontSize:12 }, onClick:function(){ editBatch(mb); } }, "?? Edit"),
              R('button', { type:"button", className:"btn-nav btn-delete", style:{ padding:"5px 10px", fontSize:12 }, onClick:function(){ deleteBatch(mb.id); } }, "??? Delete")
            )
          )
        );
      })
    ),
    toast ? R(Toast, { message:toast, onDone:function(){ setToast(""); } }) : null
  );
}

// ====== QA SCREEN ======
function QaScreen(props) {
  const dept = props.dept, motherBatches = props.motherBatches, commercialBatches = props.commercialBatches;
  const d = (dept && DEPARTMENTS[dept]) || { label:"Plant-Wide", unit:"Units", imgSrc:DEFAULT_LOGO };
  const [viewAllDepts, setViewAllDepts] = useState(false);
  const deptMBs = viewAllDepts ? motherBatches : motherBatches.filter(function(m){ return m.dept===dept; });
  const [selectedMbId, setSelectedMbId] = useState(deptMBs[0] ? deptMBs[0].id : "");
  const [qaStatus, setQaStatus] = useState("QA Approved");
  const [qaAssay, setQaAssay] = useState("99.8");
  const [qaRemarks, setQaRemarks] = useState("");
  const [toast, setToast] = useState("");
  const selectedMB = motherBatches.find(function(m){ return m.id===selectedMbId; });
  const calc = selectedMB ? computeMB(selectedMB, commercialBatches) : null;
  const saveQaApproval = async function() {
    if (!selectedMB) return;
    const updatedMBs = motherBatches.map(function(m){ return m.id===selectedMbId ? Object.assign({},m,{qaStatus,qaAssay,qaRemarks,qaInspector:props.userName||"Production/QA Officer"}) : m; });
    props.setMotherBatches(updatedMBs);
    await saveShared("dpyms_mother_batches", updatedMBs);
    setToast("QA decision for "+selectedMbId+" saved as "+qaStatus+" & synced!");
  };
  return R('div', { style:{ maxWidth:820, margin:"0 auto", padding:"20px 16px 60px" } },
    R(SectionHeading, { eyebrow:"Quality Assurance · "+d.label, title:"QA Inspection & Quality Clearance", sub:"Review yield statistics and sign off on batch quality." }),
    R(UniversalActionBar, { onSave:saveQaApproval, onUpdate:saveQaApproval }),
    R(Card, { style:{ padding:20, marginBottom:24 } },
      R('div', { style:{ display:"flex", gap:10, marginBottom:14 } },
        R(FilterChip, { active:!viewAllDepts, onClick:function(){ setViewAllDepts(false); }, label:"Current Section ("+d.label+")" }),
        R(FilterChip, { active:viewAllDepts, onClick:function(){ setViewAllDepts(true); }, label:"?? View All Plant Batches ("+motherBatches.length+")" })
      ),
      R(Field, { label:"Select Mother Batch for QA Clearance" },
        R(SelectInput, { value:selectedMbId, onChange:function(e){ setSelectedMbId(e.target.value); } },
          deptMBs.map(function(m){ return R('option', { key:m.id, value:m.id }, m.id+" — "+m.genericName+" (Status: "+(m.qaStatus||"Pending")+")"); })
        )
      ),
      selectedMB && calc ? R('div', { style:{ background:C.paleBg, borderRadius:12, padding:16, marginBottom:18 } },
        R('div', { style:{ fontWeight:700, fontSize:15, color:C.navy, marginBottom:10 } }, "Batch Yield Summary — "+selectedMB.id),
        R('div', { style:{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:12, fontSize:13 } },
          R('div', null, R('b', null, "Planned:"), " "+calc.plannedLakh+" Lacs ("+calc.totalBatchKg+" kg)"),
          R('div', null, R('b', null, "Gran Yield:"), " ", R(YieldBadge, { value:calc.granYield })),
          R('div', null, R('b', null, "Comp Yield:"), " ", R(YieldBadge, { value:calc.compYield })),
          R('div', null, R('b', null, "Coat Yield:"), " ", R(YieldBadge, { value:calc.coatYield }))
        )
      ) : null,
      R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
        R(Field, { label:"QA Decision Status" },
          R(SelectInput, { value:qaStatus, onChange:function(e){ setQaStatus(e.target.value); } },
            R('option', { value:"QA Approved" }, "QA Approved"),
            R('option', { value:"Pending" }, "Pending Inspection"),
            R('option', { value:"QA Rejected" }, "QA Rejected"),
            R('option', { value:"On Hold" }, "On Hold")
          )
        ),
        R(Field, { label:"Assay / Potency (%)" }, R(TextInput, { value:qaAssay, onChange:function(e){ setQaAssay(e.target.value); } }))
      ),
      R(Field, { label:"QA Inspection Remarks" }, R(TextInput, { value:qaRemarks, onChange:function(e){ setQaRemarks(e.target.value); } })),
      R(PrimaryButton, { onClick:saveQaApproval }, "Save QA Clearance")
    ),
    toast ? R(Toast, { message:toast, onDone:function(){ setToast(""); } }) : null
  );
}

