var R = React.createElement;
var useState = React.useState, useEffect = React.useEffect, useMemo = React.useMemo, useCallback = React.useCallback, Fragment = React.Fragment;

// ====== PACKAGING SCREEN ======
function PackagingScreen(props) {
  const dept = props.dept, motherBatches = props.motherBatches, commercialBatches = props.commercialBatches;
  const d = (dept && DEPARTMENTS[dept]) || { label:"Plant-Wide", unit:"Units", imgSrc:DEFAULT_LOGO };
  const deptMBs = dept ? motherBatches.filter(function(m){ return m.dept===dept && !m.isDeleted; }) : motherBatches.filter(function(m){ return !m.isDeleted; });
  const [mbId, setMbId] = useState(deptMBs[0] ? deptMBs[0].id : "");
  useEffect(function(){ if (!mbId && deptMBs[0]) setMbId(deptMBs[0].id); }, [deptMBs]); // eslint-disable-line
  const selectedMB = motherBatches.find(function(m){ return m.id===mbId; });
  const selectedMBCalc = selectedMB ? computeMB(selectedMB, commercialBatches) : null;
  const totalMotherUnits = selectedMBCalc ? (parseFloat(selectedMBCalc.plannedLakh)*100000||0) : 0;
  const [splitCount, setSplitCount] = useState(1);
  const [splitRows, setSplitRows] = useState([{ productName:"", batchNumber:"" }]);
  const [showSplitSetup, setShowSplitSetup] = useState(true);
  const [editingCbId, setEditingCbId] = useState(null);
  const detailBlank = { unitsReceived:"", packedQty:"", dispatchQty:"", rejectedUnits:"0", rrGeneratedUnits:"0", remarks:"" };
  const [details, setDetails] = useState({});
  const [toast, setToast] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  function applySplitCount(n) {
    const count = Math.max(1, Math.min(20, parseInt(n,10)||1));
    setSplitCount(count);
    setSplitRows(function(prev){ const next=[...prev]; while(next.length<count) next.push({productName:"",batchNumber:""}); return next.slice(0,count); });
  }
  function startDetailEntry() {
    if (splitRows.some(function(r){ return !r.productName||!r.batchNumber; })){ setToast("Please name every commercial batch before continuing"); return; }
    const init = {};
    splitRows.forEach(function(r,i){ init[i]=Object.assign({},detailBlank); });
    setDetails(init); setShowSplitSetup(false);
  }
  function setDetail(i,k){ return function(e){ setDetails(function(prev){ return Object.assign({},prev,{[i]:Object.assign({},prev[i],{[k]:e.target.value})}); }); } }
  const saveAll = async function() {
    if (!mbId){ setToast("Select a Mother Batch first"); return; }
    const requestedTotal = splitRows.reduce(function(sum,_,i){ return sum+(parseFloat(details[i]?details[i].unitsReceived:null)||0); }, 0);
    const existingOtherAllocated = commercialBatches.filter(function(c){ return c.mbId===mbId&&c.id!==editingCbId; }).reduce(function(sum,c){ return sum+(parseFloat(c.unitsReceived)||0); }, 0);
    if (totalMotherUnits>0 && existingOtherAllocated+requestedTotal>totalMotherUnits) {
      const available = Math.max(0, totalMotherUnits-existingOtherAllocated);
      setToast("Over-allocation blocked! Remaining: "+lakhFromUnits(available)+" Lacs ("+available+" units)"); return;
    }
    let running = [...commercialBatches]; const finalRecords = [];
    splitRows.forEach(function(r,i){
      const id = editingCbId||genCBId(running,dept);
      const rec = Object.assign({ id,dept,mbId,date,loggedBy:props.userName||"Packaging Officer",productName:r.productName,batchNumber:r.batchNumber,createdAt:Date.now() }, details[i]);
      finalRecords.push(rec); running=[rec,...running.filter(function(c){ return c.id!==id; })];
    });
    const updated = sortNewestFirst([...finalRecords,...commercialBatches.filter(function(c){ return !finalRecords.some(function(f){ return f.id===c.id; }); })]);
    props.setCommercialBatches(updated); await saveShared("dpyms_commercial_batches", updated);
    setToast("Commercial batch saved & synced to all devices!");
    setSplitCount(1); setSplitRows([{productName:"",batchNumber:""}]); setDetails({}); setEditingCbId(null); setShowSplitSetup(true);
  };
  function editCB(cb){ setEditingCbId(cb.id); setMbId(cb.mbId); setDate(cb.date); setSplitCount(1); setSplitRows([{productName:cb.productName,batchNumber:cb.batchNumber}]); setDetails({0:{unitsReceived:cb.unitsReceived,packedQty:cb.packedQty,dispatchQty:cb.dispatchQty,rejectedUnits:cb.rejectedUnits,rrGeneratedUnits:cb.rrGeneratedUnits||"0"}}); setShowSplitSetup(false); window.scrollTo({top:0,behavior:"smooth"}); }
  const deleteCB = async function(cbId){ if(!window.confirm("Delete Commercial Batch "+cbId+"?"))return; const updatedCBs=commercialBatches.map(function(c){return c.id===cbId?{...c,isDeleted:true}:c;}); props.setCommercialBatches(updatedCBs); await saveShared("dpyms_commercial_batches",updatedCBs); setToast("Commercial Batch "+cbId+" deleted"); };
  const deptCBs = commercialBatches.filter(function(c){ return c.dept===dept && !c.isDeleted; });
  return R('div', { style:{ maxWidth:820, margin:"0 auto", padding:"20px 16px 60px" } },
    R(SectionHeading, { eyebrow:"Packaging · "+d.label, title:"Log Commercial Batches & Packaging Yields", sub:"Track Units Received, Packed, Dispatched & Yields (Syncs live across devices)." }),
    R(UniversalActionBar, { onSave:saveAll, onBack:function(){ setShowSplitSetup(true); setEditingCbId(null); } }),
    R(Card, { style:{ padding:20, marginBottom:24 } },
      R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 } },
        R(Field, { label:"Date" }, R(TextInput, { type:"date", value:date, onChange:function(e){ setDate(e.target.value); } })),
        R(Field, { label:"Packaging Officer Name" }, R(TextInput, { placeholder:"Officer Name", value:props.userName, onChange:function(e){ props.setUserName(e.target.value); } }))
      ),
      R(Field, { label:"Mother Batch ID (Parent Batch)", hint:selectedMB?"Generic: "+selectedMB.genericName+" ("+(selectedMBCalc?selectedMBCalc.plannedLakh:"?")+" Lacs)":"" },
        R(SelectInput, { value:mbId, onChange:function(e){ setMbId(e.target.value); } },
          deptMBs.map(function(mb){ return R('option', { key:mb.id, value:mb.id }, mb.id+" — "+(mb.genericName||"Untitled")); })
        )
      ),
      showSplitSetup ? R(Fragment, null,
        R(Field, { label:"Number of Brand Splits" }, R(TextInput, { type:"number", min:"1", max:"20", value:splitCount, onChange:function(e){ applySplitCount(e.target.value); } })),
        splitRows.map(function(row,i){
          return R('div', { key:i, style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, background:C.paleBg, padding:12, borderRadius:10, marginBottom:12 } },
            R(Field, { label:"Split "+(i+1)+" — Brand Name" }, R(TextInput, { placeholder:"e.g. ALDONIX-P", value:row.productName, onChange:function(e){ setSplitRows(function(prev){ return prev.map(function(r,j){ return j===i?Object.assign({},r,{productName:e.target.value}):r; }); }); } })),
            R(Field, { label:"Split "+(i+1)+" — Batch Number" }, R(TextInput, { placeholder:"e.g. LPX26001", value:row.batchNumber, onChange:function(e){ setSplitRows(function(prev){ return prev.map(function(r,j){ return j===i?Object.assign({},r,{batchNumber:e.target.value}):r; }); }); } }))
          );
        }),
        R(PrimaryButton, { onClick:startDetailEntry }, "Continue to Yield Entry ?")
      ) : R(Fragment, null,
        splitRows.map(function(row,i){
          const det = details[i]||{};
          return R(Card, { key:i, style:{ padding:16, background:C.paleBg, marginBottom:14 } },
            R('div', { style:{ fontSize:11, fontWeight:700, color:C.blue, textTransform:"uppercase", marginBottom:6 } }, "Belongs to Mother Batch: "+mbId),
            R('div', { style:{ fontWeight:700, fontSize:14, color:C.navy, marginBottom:12 } }, "Brand Name: "+row.productName, R('span', { style:{ color:C.sub, fontWeight:400 } }, " · Batch #"+row.batchNumber)),
            R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 } },
              R(Field, { label:"Units Received (Batch Size)" }, R(TextInput, { type:"number", placeholder:"e.g. 400000", value:det.unitsReceived||"", onChange:setDetail(i,"unitsReceived") })),
              R(Field, { label:"Units Packed" }, R(TextInput, { type:"number", placeholder:"e.g. 397600", value:det.packedQty||"", onChange:setDetail(i,"packedQty") }))
            ),
            R('div', { style:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 } },
              R(Field, { label:"Units Dispatched" }, R(TextInput, { type:"number", placeholder:"e.g. 396000", value:det.dispatchQty||"", onChange:setDetail(i,"dispatchQty") })),
              R(Field, { label:"Rejected Units" }, R(TextInput, { type:"number", value:det.rejectedUnits||"0", onChange:setDetail(i,"rejectedUnits") }))
            ),
            R(Field, { label:"RR Generated / Retained for Future Batches (Units)", hint:"Good loose tablets saved for reuse — NOT counted as loss!" }, R(TextInput, { type:"number", placeholder:"e.g. 800", value:det.rrGeneratedUnits||"0", onChange:setDetail(i,"rrGeneratedUnits") }))
          );
        }),
        R('div', { style:{ display:"flex", gap:10 } },
          R(SecondaryButton, { onClick:function(){ setShowSplitSetup(true); }, style:{ flex:1 } }, "? Back"),
          R(PrimaryButton, { onClick:saveAll, style:{ flex:2 } }, editingCbId?"Update Commercial Record":"Save Packaging Records")
        )
      )
    ),
    R(SectionHeading, { title:"Commercial Batch Register", small:true }),
    R('div', { style:{ display:"flex", flexDirection:"column", gap:10 } },
      deptCBs.map(function(cb){
        const calc = computeCB(cb, motherBatches);
        return R(Card, { key:cb.id, style:{ padding:14 } },
          R('div', { style:{ display:"flex", justifyContent:"space-between", alignItems:"center" } },
            R('div', null,
              R('div', { style:{ fontWeight:700, fontSize:14 } }, cb.id+" · "+cb.productName, R('span', { style:{ color:C.sub } }, " (MB: "+cb.mbId+")")),
              R('div', { style:{ fontSize:12, color:C.sub, marginTop:2 } }, "Batch #"+cb.batchNumber+" · Recv: "+cb.unitsReceived+" ("+calc.recvLakh+" Lacs) · Packed: "+cb.packedQty+" ("+calc.packedLakh+" Lacs) · RR Retained: ", R('b', null, calc.rrGen+" units"))
            ),
            R('div', { style:{ display:"flex", alignItems:"center", gap:8 } },
              R(YieldBadge, { value:calc.pkgYield }),
              R('button', { type:"button", className:"btn-nav btn-edit", style:{ padding:"4px 8px", fontSize:11 }, onClick:function(){ editCB(cb); } }, "?? Edit"),
              R('button', { type:"button", className:"btn-nav btn-delete", style:{ padding:"4px 8px", fontSize:11 }, onClick:function(){ deleteCB(cb.id); } }, "??? Delete")
            )
          )
        );
      })
    ),
    toast ? R(Toast, { message:toast, onDone:function(){ setToast(""); } }) : null
  );
}

// ====== MANAGER SCREEN ======
function ManagerScreen(props) {
  const motherBatches = props.motherBatches, commercialBatches = props.commercialBatches;
  const [activeTab, setActiveTab] = useState("mother");
  const [deptFilter, setDeptFilter] = useState("all");
  const [search, setSearch] = useState("");
  const loadSamplePlantData = async function() { props.setMotherBatches(SAMPLE_MOTHER_BATCHES); props.setCommercialBatches(SAMPLE_COMMERCIAL_BATCHES); await saveShared("dpyms_mother_batches",SAMPLE_MOTHER_BATCHES); await saveShared("dpyms_commercial_batches",SAMPLE_COMMERCIAL_BATCHES); };
  const deleteMB = async function(mbId) { if(!window.confirm("Delete Mother Batch "+mbId+"?"))return; const updatedMBs=motherBatches.map(function(m){return m.id===mbId?{...m,isDeleted:true}:m;}); const updatedCBs=commercialBatches.map(function(c){return c.mbId===mbId?{...c,isDeleted:true}:c;}); props.setMotherBatches(updatedMBs); props.setCommercialBatches(updatedCBs); await saveShared("dpyms_mother_batches",updatedMBs); await saveShared("dpyms_commercial_batches",updatedCBs); };
  const deleteCB = async function(cbId) { if(!window.confirm("Delete Commercial Batch "+cbId+"?"))return; const updatedCBs=commercialBatches.map(function(c){return c.id===cbId?{...c,isDeleted:true}:c;}); props.setCommercialBatches(updatedCBs); await saveShared("dpyms_commercial_batches",updatedCBs); };
  const filteredMBs = deptFilter==="all" ? motherBatches.filter(function(m){return !m.isDeleted;}) : motherBatches.filter(function(m){return m.dept===deptFilter && !m.isDeleted;});
  const filteredCBs = deptFilter==="all" ? commercialBatches.filter(function(c){return !c.isDeleted;}) : commercialBatches.filter(function(c){return c.dept===deptFilter && !c.isDeleted;});
  const mbRows = filteredMBs.map(function(mb){ return {mb,calc:computeMB(mb,commercialBatches),linkedCBs:commercialBatches.filter(function(c){return c.mbId===mb.id;})}; }).filter(function(row){ if(!search) return true; const s=search.toLowerCase(); return row.mb.id.toLowerCase().includes(s)||(row.mb.genericName||"").toLowerCase().includes(s); });
  const cbRows = filteredCBs.map(function(cb){ return {cb,calc:computeCB(cb,motherBatches)}; });
  const totals = useMemo(function() {
    const cbInScope = deptFilter==="all" ? commercialBatches : commercialBatches.filter(function(c){return c.dept===deptFilter;});
    const pendingQA = mbRows.filter(function(r){return r.mb.qaStatus==="Pending"||!r.mb.qaStatus;}).length;
    const approvedQA = mbRows.filter(function(r){return r.mb.qaStatus==="QA Approved";}).length;
    const totalPlannedLakhs = round2(mbRows.reduce(function(s,r){return s+(parseFloat(r.calc.plannedLakh)||0);},0));
    const totalPlannedKg = round2(mbRows.reduce(function(s,r){return s+(parseFloat(r.calc.totalBatchKg)||0);},0));
    const totalDispatchedUnits = cbInScope.reduce(function(s,c){return s+(parseFloat(c.dispatchQty)||0);},0);
    const totalDispatchedLakhs = round2(totalDispatchedUnits/100000);
    return {pendingQA,approvedQA,totalPlannedLakhs,totalPlannedKg,totalDispatchedUnits,totalDispatchedLakhs,batches:filteredMBs.length,splits:cbInScope.length};
  }, [mbRows, commercialBatches, filteredMBs, deptFilter]);
  const byDept = DEPT_LIST.map(function(d){ const mbs=motherBatches.filter(function(m){return m.dept===d.key;}); const cbs=commercialBatches.filter(function(c){return c.dept===d.key;}); const deptLakhs=round2(mbs.reduce(function(s,m){return s+(parseFloat(computeMB(m,commercialBatches).plannedLakh)||0);},0)); const deptKg=round2(mbs.reduce(function(s,m){return s+(parseFloat(computeMB(m,commercialBatches).totalBatchKg)||0);},0)); return Object.assign({},d,{count:mbs.length,splits:cbs.length,deptLakhs,deptKg}); });
  const exportCSVReport = function() {
    let headers, exportData, filename;
    if (activeTab==="mother") {
      filename = "DPYMS_Mother_Batches_Register_"+new Date().toISOString().slice(0,10)+".csv";
      headers = [{key:"date",label:"Date"},{key:"id",label:"MB ID"},{key:"dept",label:"Department"},{key:"genericName",label:"Generic Name"},{key:"plannedKg",label:"Planned Batch (Kg)"},{key:"plannedLakh",label:"Planned Batch (Lacs)"},{key:"granYield",label:"Gran Yield %"},{key:"compYield",label:"Comp Yield %"},{key:"coatYield",label:"Coat Yield %"},{key:"finalYield",label:"Final Yield %"},{key:"qaStatus",label:"QA Status"},{key:"remarks",label:"Remarks"}];
      exportData = mbRows.map(function(r){ return {date:r.mb.date||"",id:r.mb.id||"",dept:(r.mb.dept||"").toUpperCase(),genericName:r.mb.genericName||"",plannedKg:r.calc.totalBatchKg||"",plannedLakh:r.calc.plannedLakh||"",granYield:r.calc.granYield?r.calc.granYield+"%":"N/A",compYield:r.calc.compYield?r.calc.compYield+"%":"N/A",coatYield:r.calc.coatYield?r.calc.coatYield+"%":"N/A",finalYield:r.calc.finalYield?r.calc.finalYield+"%":"N/A",qaStatus:r.mb.qaStatus||"Pending",remarks:r.mb.remarks||""}; });
    } else {
      filename = "DPYMS_Commercial_Batches_Register_"+new Date().toISOString().slice(0,10)+".csv";
      headers = [{key:"date",label:"Date"},{key:"id",label:"CB ID"},{key:"mbId",label:"Linked MB ID"},{key:"productName",label:"Brand Name"},{key:"batchNumber",label:"Commercial Batch #"},{key:"unitsReceived",label:"Units Received"},{key:"packedQty",label:"Packed Units"},{key:"rrGen",label:"RR Retained"},{key:"dispatchQty",label:"Dispatch Units"},{key:"rejectedUnits",label:"Rejected Units"},{key:"pkgYield",label:"Packaging Yield %"},{key:"dispatchYield",label:"Dispatch Yield %"}];
      exportData = cbRows.map(function(r){ return {date:r.cb.date||"",id:r.cb.id||"",mbId:r.cb.mbId||"",productName:r.cb.productName||"",batchNumber:r.cb.batchNumber||"",unitsReceived:r.cb.unitsReceived||"0",packedQty:r.cb.packedQty||"0",rrGen:r.calc.rrGen||"0",dispatchQty:r.cb.dispatchQty||"0",rejectedUnits:r.cb.rejectedUnits||"0",pkgYield:r.calc.pkgYield?r.calc.pkgYield+"%":"N/A",dispatchYield:r.calc.dispatchYield?r.calc.dispatchYield+"%":"N/A"}; });
    }
    downloadCSV(filename, toCSV(exportData, headers));
  };

  const tabBtnStyle = function(isActive) {
    return { flex:1, padding:"14px 20px", borderRadius:12, border:"1.5px solid "+C.navy, background:isActive?C.navy:C.white, color:isActive?C.white:C.navy, fontWeight:700, fontSize:14.5, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, boxShadow:isActive?"0 4px 12px rgba(14,42,94,0.15)":"none" };
  };

  return R('div', { style:{ maxWidth:1140, margin:"0 auto", padding:"20px 16px 60px" } },
    R(SectionHeading, { eyebrow:"MANAGER DASHBOARD", title:"Plant-Wide Manufacturing & Yield Overview", sub:"Mother Batch Multi-stage Analytics & Full Commercial Batch Yield Calculations.",
      right: R('div', { style:{ display:"flex", gap:10 } },
        motherBatches.length===0 ? R(SecondaryButton, { onClick:loadSamplePlantData }, "?? Load Sample Plant Data") : null,
        R(SecondaryButton, { onClick:exportCSVReport }, "? Export CSV Report"),
        R(PrimaryButton, { onClick:function(){ window.print(); }, style:{ width:"auto" } }, "??? Print GMP Report")
      )
    }),
    R('div', { style:{ display:"flex", gap:12, marginBottom:20 }, className:"no-print" },
      R('button', { onClick:function(){ setActiveTab("mother"); }, style:tabBtnStyle(activeTab==="mother") }, "?? Mother Batches Overview ("+filteredMBs.length+")"),
      R('button', { onClick:function(){ setActiveTab("commercial"); }, style:tabBtnStyle(activeTab==="commercial") }, "?? Commercial Batches & Yields ("+filteredCBs.length+")")
    ),
    R('div', { style:{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:20 }, className:"no-print" },
      R(FilterChip, { active:deptFilter==="all", onClick:function(){ setDeptFilter("all"); }, label:"All Product Lines" }),
      DEPT_LIST.map(function(d){ return R(FilterChip, { key:d.key, active:deptFilter===d.key, onClick:function(){ setDeptFilter(d.key); }, label:d.label }); })
    ),
    R('div', { style:{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))", gap:12, marginBottom:22 }, className:"no-print" },
      R(Card, { style:{ padding:"16px" } }, R(Stat, { label:"MOTHER BATCHES", value:totals.batches })),
      R(Card, { style:{ padding:"16px" } }, R(Stat, { label:"TOTAL PLANNED PRODUCTION", value:totals.totalPlannedLakhs+" Lakhs ("+totals.totalPlannedKg+" kg)" })),
      R(Card, { style:{ padding:"16px" } }, R(Stat, { label:"TOTAL DISPATCHED UNITS", value:totals.totalDispatchedLakhs+" Lakhs ("+fmtNum(totals.totalDispatchedUnits)+")" })),
      R(Card, { style:{ padding:"16px" } }, R(Stat, { label:"QA APPROVED BATCHES", value:totals.approvedQA })),
      R(Card, { style:{ padding:"16px" } }, R(Stat, { label:"PENDING QA CLEARANCE", value:totals.pendingQA }))
    ),
    deptFilter==="all" ? R('div', { style:{ marginBottom:26 }, className:"no-print" },
      R(SectionHeading, { title:"Department Production Summaries (Kg & Lakhs)", small:true }),
      R('div', { style:{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))", gap:14 } },
        byDept.map(function(d){
          return R(Card, { key:d.key, style:{ padding:"18px 16px", cursor:"pointer" }, onClick:function(){ setDeptFilter(d.key); } },
            R('div', { style:{ display:"flex", alignItems:"center", gap:12, marginBottom:10 } },
              R('img', { src:d.imgSrc, alt:d.label, style:{ width:48, height:48, borderRadius:10, objectFit:"cover" } }),
              R('div', null,
                R('div', { style:{ fontWeight:700, fontSize:16, color:C.ink } }, d.label),
                R('div', { style:{ fontSize:12, color:C.sub } }, d.count+" mother · "+d.splits+" commercial")
              )
            ),
            R('div', { style:{ background:C.paleBg, padding:"8px 12px", borderRadius:8, fontSize:12.5, fontWeight:700, color:C.navy } }, "Planned: "+(d.deptLakhs?d.deptLakhs+" Lakhs":"0 Lakhs")+(d.deptKg?" ("+d.deptKg+" kg)":"(0 kg)"))
          );
        })
      )
    ) : null,
    R(Card, { style:{ padding:16, marginBottom:20 }, className:"no-print" },
      R(Field, { label:"Search Register / Batches" }, R(TextInput, { placeholder:"Search MB ID, Generic Name, Brand...", value:search, onChange:function(e){ setSearch(e.target.value); } }))
    ),
    activeTab==="deleted" ? R('div', { style:{ padding: 20, background: '#fee2e2', borderRadius: 8 } }, R('h3', {style:{color:'#991b1b'}}, 'Recently Deleted Batches (Soft Delete)'), R('p', null, 'These batches are hidden from production but securely preserved in the cloud database for compliance.')) : activeTab==="mother" ? R('div', { style:{ background:C.white, borderRadius:16, border:"1px solid "+C.line, padding:24, overflowX:"auto" } },
      R('div', { className:"print-header print-only" },
        R('img', { src:BRAND_LOGO, alt:"Danish Healthcare" }),
        R('div', { className:"print-header-title" },
          R('h1', null, "DANISH HEALTH CARE (P) LTD."),
          R('p', null, "INDUSTRIAL AREA, UJJAIN (M.P.) · GMP CERTIFIED MANUFACTURING FACILITY"),
          R('p', null, "OFFICIAL MOTHER BATCHES PROGRESSIVE YIELD REGISTER — Printed: "+new Date().toLocaleDateString("en-IN"))
        )
      ),
      R('div', { style:{ display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"2px solid "+C.navy, paddingBottom:14, marginBottom:16 }, className:"no-print" },
        R('img', { src:BRAND_LOGO, alt:"Danish Healthcare", style:{ height:44 } }),
        R('div', { style:{ textAlign:"right" } },
          R('div', { style:{ fontSize:15, fontWeight:700, color:C.navy, fontFamily:FONT_DISPLAY } }, "DANISH HEALTH CARE (P) LTD."),
          R('div', { style:{ fontSize:11, color:C.blue, fontWeight:700 } }, "UNIFIED PLANT REGISTER & PROGRESSIVE YIELD REPORT")
        )
      ),
      R('table', { style:{ width:"100%", borderCollapse:"collapse", fontSize:12, textAlign:"center" } },
        R('thead', null,
          R('tr', { style:{ background:C.navy, color:C.white, fontSize:11.5 } },
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Date"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "MB ID"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2, minWidth:160 } }, "Generic Name of Product"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Planned"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Gran. Output (%)"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Comp. Output (%)"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Coating Output (%)"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2, minWidth:150 } }, "Mother batches splits into Brand Name"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Batch Size"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Pack. yield"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Dispatch Yield"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 } }, "Final yield"),
            R('th', { style:{ padding:10, border:"1px solid "+C.navy2 }, className:"no-print" }, "Action")
          )
        ),
        R('tbody', null,
          mbRows.length===0 ? R('tr', null, R('td', { colSpan:"13", style:{ padding:30 } }, R(EmptyNote, { text:"No batch records found." }))) : null,
          mbRows.map(function(row) {
            const mb = row.mb, calc = row.calc, linkedCBs = row.linkedCBs;
            const splitRowsCount = Math.max(1, linkedCBs.length);
            return R(Fragment, { key:mb.id },
              splitRowsCount===1 ? R('tr', { style:{ borderBottom:"1px solid "+C.line, background:C.white } },
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, fmtDate(mb.date)),
                R('td', { style:{ padding:10, border:"1px solid "+C.line, fontWeight:700, color:C.navy } }, mb.id),
                R('td', { style:{ padding:10, border:"1px solid "+C.line, textAlign:"left" } }, R('b', null, mb.genericName)),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, R('div', null, R('b', null, mb.plannedBatchWt?mb.plannedBatchWt+" kg":"—")), R('div', null, calc.plannedLakh+" lacs")),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, R('div', null, mb.granOutput?mb.granOutput+" kg":"—"), R('div', null, calc.granLakh+" lacs"), R('div', { style:{color:C.ok,fontWeight:700} }, "("+calc.granYield+"%)")),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, R('div', null, mb.compOutput?mb.compOutput+" kg":"—"), R('div', null, calc.compLakh+" lacs"), R('div', { style:{color:C.ok,fontWeight:700} }, "("+calc.compYield+"%)") ),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, calc.coat==="NA" ? "NA" : R(Fragment, null, R('div', null, mb.coatOutput?mb.coatOutput+" kg":"—"), R('div', null, calc.coatLakh+" lacs"), R('div', { style:{color:C.ok,fontWeight:700} }, "("+calc.coatYield+"%)"))),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, linkedCBs[0]?linkedCBs[0].productName+" ("+linkedCBs[0].batchNumber+")":"—"),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, linkedCBs[0]?lakhFromUnits(linkedCBs[0].unitsReceived)+" LACS":"—"),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, linkedCBs[0]?computeCB(linkedCBs[0],[mb]).pkgYield+"% ("+lakhFromUnits(linkedCBs[0].packedQty)+")":"—"),
                R('td', { style:{ padding:10, border:"1px solid "+C.line } }, linkedCBs[0]?computeCB(linkedCBs[0],[mb]).dispatchYield+"% ("+lakhFromUnits(linkedCBs[0].dispatchQty)+")":"—"),
                R('td', { style:{ padding:10, border:"1px solid "+C.line, fontWeight:700, color:C.ok, fontSize:13 } }, calc.finalYield?calc.finalYield+"%":"—"),
                R('td', { style:{ padding:10, border:"1px solid "+C.line }, className:"no-print" }, R('button', { type:"button", className:"btn-nav btn-delete", style:{padding:"4px 8px",fontSize:11}, onClick:function(){ deleteMB(mb.id); } }, "??? Delete"))
              ) : linkedCBs.map(function(cb, idx) {
                const cbCalc = computeCB(cb, [mb]), isLastSplit = idx===linkedCBs.length-1, brd = "1px solid "+C.line;
                return R('tr', { key:cb.id, style:{ borderBottom:isLastSplit?"2px solid "+C.navy:"1.5px solid "+C.navy, background:idx%2===0?C.white:C.paleBg } },
                  idx===0 ? R(Fragment, null,
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd} }, fmtDate(mb.date)),
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd,fontWeight:700,color:C.navy} }, mb.id),
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd,textAlign:"left"} }, R('b', null, mb.genericName)),
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd} }, R('div', null, R('b', null, mb.plannedBatchWt?mb.plannedBatchWt+" kg":"—")), R('div', null, calc.plannedLakh+" lacs")),
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd} }, R('div', null, mb.granOutput?mb.granOutput+" kg":"—"), R('div', null, calc.granLakh+" lacs"), R('div', {style:{color:C.ok,fontWeight:700}}, "("+calc.granYield+"%)")),
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd} }, R('div', null, mb.compOutput?mb.compOutput+" kg":"—"), R('div', null, calc.compLakh+" lacs"), R('div', {style:{color:C.ok,fontWeight:700}}, "("+calc.compYield+"%)")),
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd} }, calc.coat==="NA"?"NA":R(Fragment, null, R('div', null, mb.coatOutput?mb.coatOutput+" kg":"—"), R('div', null, calc.coatLakh+" lacs"), R('div', {style:{color:C.ok,fontWeight:700}}, "("+calc.coatYield+"%)")))
                  ) : null,
                  R('td', { style:{padding:10,border:brd,fontWeight:700} }, cb.productName+" ("+cb.batchNumber+")"),
                  R('td', { style:{padding:10,border:brd} }, lakhFromUnits(cb.unitsReceived)+" LACS"),
                  R('td', { style:{padding:10,border:brd} }, cbCalc.pkgYield+"% ("+lakhFromUnits(cb.packedQty)+")"),
                  R('td', { style:{padding:10,border:brd} }, cbCalc.dispatchYield+"% ("+lakhFromUnits(cb.dispatchQty)+")"),
                  idx===0 ? R(Fragment, null,
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd,fontWeight:700,color:C.ok,fontSize:13} }, calc.finalYield?calc.finalYield+"%":"—"),
                    R('td', { rowSpan:linkedCBs.length, style:{padding:10,border:brd}, className:"no-print" }, R('button', { type:"button", className:"btn-nav btn-delete", style:{padding:"4px 8px",fontSize:11}, onClick:function(){ deleteMB(mb.id); } }, "??? Delete"))
                  ) : null
                );
              }),
              // Progressive Yield Summary Row
              R('tr', { style:{ background:C.paleBg, fontWeight:700, fontSize:11.5, borderBottom:"2px solid "+C.navy } },
                R('td', { colSpan:"3", style:{padding:8,border:"1px solid "+C.line,textAlign:"right"} }, "Progressive Yield"),
                R('td', { style:{padding:8,border:"1px solid "+C.line,color:C.navy} }, "100%"),
                R('td', { style:{padding:8,border:"1px solid "+C.line,color:C.ok} }, calc.granYield+"%"),
                R('td', { style:{padding:8,border:"1px solid "+C.line,color:C.ok} }, calc.compYield+"%"),
                R('td', { style:{padding:8,border:"1px solid "+C.line,color:C.ok} }, calc.coatYield+"%"),
                R('td', { style:{padding:8,border:"1px solid "+C.line} }, "NA"),
                R('td', { style:{padding:8,border:"1px solid "+C.line} }, "Total "+calc.plannedLakh),
                R('td', { style:{padding:8,border:"1px solid "+C.line} }, "Total "+calc.packedLakhTotal),
                R('td', { style:{padding:8,border:"1px solid "+C.line} }, "Total "+calc.dispatchLakhTotal),
                R('td', { style:{padding:8,border:"1px solid "+C.line,color:C.ok} }, calc.finalYield+"%"),
                R('td', { style:{padding:8,border:"1px solid "+C.line}, className:"no-print" }, "")
              )
            );
          })
        )
      ),
      R('div', { className:"print-footer print-only" },
        R('div', { className:"signature-box" }, R('div', { className:"signature-line" }), R('div', null, "Production Officer Sign & Date")),
        R('div', { className:"signature-box" }, R('div', { className:"signature-line" }), R('div', null, "QA Manager Sign & Date")),
        R('div', { className:"signature-box" }, R('div', { className:"signature-line" }), R('div', null, "Plant Head Sign & Date"))
      )
    ) : R('div', { style:{ display:"flex", flexDirection:"column", gap:14 }, className:"no-print" },
      cbRows.length===0 ? R(EmptyNote, { text:"No commercial batches logged yet in this section." }) : null,
      cbRows.map(function(row) {
        const cb = row.cb, calc = row.calc;
        return R(Card, { key:cb.id, style:{ padding:20 } },
          R('div', { style:{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:10 } },
            R('div', null,
              R('div', { style:{ fontWeight:700, fontSize:16, color:C.navy, display:"flex", alignItems:"center", gap:10 } }, cb.id+" · "+cb.productName, R('span', { style:{ background:C.paleBg, border:"1px solid "+C.line, color:C.sub, fontSize:12, padding:"2px 8px", borderRadius:6 } }, "#"+cb.batchNumber)),
              R('div', { style:{ fontSize:12.5, color:C.sub, marginTop:4 } }, "Linked Mother Batch: ", R('b', null, cb.mbId), " · Date: "+fmtDate(cb.date)+(cb.loggedBy?" · Officer: "+cb.loggedBy:""))
            ),
            R('button', { type:"button", className:"btn-nav btn-delete", style:{padding:"5px 10px",fontSize:12}, onClick:function(){ deleteCB(cb.id); } }, "??? Delete")
          ),
          R('div', { style:{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:12, marginTop:16, fontSize:13 } },
            R(Stat, { label:"Units Received", value:(calc.recvLakh?calc.recvLakh+" Lakhs":"—")+" ("+fmtNum(cb.unitsReceived)+")" }),
            R(Stat, { label:"Units Packed", value:(calc.packedLakh?calc.packedLakh+" Lakhs":"—")+" ("+fmtNum(cb.packedQty)+")" }),
            R(Stat, { label:"Units Dispatched", value:(calc.dispatchLakh?calc.dispatchLakh+" Lakhs":"—")+" ("+fmtNum(cb.dispatchQty)+")" }),
            R(Stat, { label:"Rejected Units", value:fmtNum(cb.rejectedUnits||0) }),
            R(Stat, { label:"RR Retained for Future", value:fmtNum(cb.rrGeneratedUnits||0)+" units" }),
            R(Stat, { label:"Packaging Yield", value:R(YieldBadge, { value:calc.pkgYield }) }),
            R(Stat, { label:"Dispatch Yield", value:R(YieldBadge, { value:calc.dispatchYield }) }),
            R(Stat, { label:"Final Overall Yield", value:R(YieldBadge, { value:calc.finalYield }) })
          )
        );
      })
    )
  );
}

// ====== ROOT APP ======
function App() {
  const [step, setStep] = useState("role");
  const [role, setRole] = useState(null);
  const [dept, setDept] = useState(null);
  const [userName, setUserName] = useState("");
  const [motherBatches, setMotherBatches] = useState([]);
  const [commercialBatches, setCommercialBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchLatestCloudData = useCallback(async function(showIndicator) {
    if (showIndicator) setIsSyncing(true);
    try {
      const mb = await loadShared("dpyms_mother_batches", SAMPLE_MOTHER_BATCHES);
      const cb = await loadShared("dpyms_commercial_batches", SAMPLE_COMMERCIAL_BATCHES);
      setMotherBatches(sortNewestFirst(mb));
      setCommercialBatches(sortNewestFirst(cb));
    } catch(e) { console.warn("Auto-sync fetch warning:", e); }
    finally { setLoading(false); if (showIndicator) setTimeout(function(){ setIsSyncing(false); }, 600); }
  }, []);

  const forcePushAllData = async function() {
    setIsSyncing(true);
    try {
      const currentMBs = JSON.parse(localStorage.getItem("dpyms_mother_batches")||"[]");
      const currentCBs = JSON.parse(localStorage.getItem("dpyms_commercial_batches")||"[]");
      const targetMBs = currentMBs.length ? currentMBs : motherBatches;
      const targetCBs = currentCBs.length ? currentCBs : commercialBatches;
      if (targetMBs.length) await saveShared("dpyms_mother_batches", targetMBs);
      if (targetCBs.length) await saveShared("dpyms_commercial_batches", targetCBs);
      alert("Success! Pushed "+targetMBs.length+" Mother Batches & "+targetCBs.length+" Commercial Batches to Cloud. Now open your Phone and click 'Sync Cloud Data'!");
    } catch(e) { alert("Push Warning: "+e.message); }
    finally { setIsSyncing(false); }
  };

  useEffect(function(){ fetchLatestCloudData(false); }, [fetchLatestCloudData]);
  useEffect(function(){
    fetchLatestCloudData(false);
    const interval = setInterval(function(){ fetchLatestCloudData(false); }, 2500);
    const onFocus = function(){ fetchLatestCloudData(false); };
    window.addEventListener("focus", onFocus);
    return function(){ clearInterval(interval); window.removeEventListener("focus", onFocus); };
  }, [fetchLatestCloudData]);

  const pickRole = function(r){ setRole(r); setStep(r==="manager"?"screen":"department"); };
  const pickDept = function(d){ setDept(d); setStep("screen"); };
  const goHome = function(){ setRole(null); setDept(null); setUserName(""); setStep("role"); };

  if (loading) {
    return R('div', { style:{ minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"linear-gradient(160deg,"+C.navy+" 0%,"+C.navy2+" 55%,"+C.blue+" 100%)", fontFamily:FONT_BODY, padding:"24px", color:C.white, textAlign:"center" } },
      R('div', { style:{ position:"relative", width:90, height:90, marginBottom:24, display:"flex", alignItems:"center", justifyContent:"center" } },
        R('div', { className:"loader-pulse-ring" }),
        R('img', { src:BRAND_LOGO, onError:function(e){e.target.onerror=null;e.target.src=DEFAULT_LOGO;}, alt:"Danish Healthcare", style:{ maxHeight:50, maxWidth:70, objectFit:"contain", background:"#FFFFFF", padding:"6px 10px", borderRadius:10, boxShadow:"0 4px 14px rgba(0,0,0,0.3)" } })
      ),
      R('div', { style:{ fontSize:20, fontWeight:800, fontFamily:FONT_DISPLAY, letterSpacing:1 } }, "DANISH HEALTHCARE (P) LTD."),
      R('div', { style:{ fontSize:13, color:"rgba(255,255,255,0.75)", marginTop:6, letterSpacing:1.5, textTransform:"uppercase" } }, "Digital Production Yield Management System (DPYMS v2)"),
      R('div', { style:{ marginTop:24, padding:"8px 20px", borderRadius:999, background:"rgba(255,255,255,0.12)", border:"1px solid rgba(255,255,255,0.2)", fontSize:12.5, fontWeight:600, color:C.skyBlue, display:"flex", alignItems:"center", gap:10 } },
        R('span', { className:"spinner-dot" }), " Initializing Multi-Device Cloud Persistence Engine…"
      )
    );
  }

  if (step==="role") return R(RolePicker, { onPick:pickRole });
  const roleLabels = { production:"Production", qa:"Quality Assurance (QA)", packaging:"Packaging", manager:"Manager Dashboard" };
  const roleLabel = roleLabels[role]||role;
  if (step==="department") return R(DepartmentPicker, { onPick:pickDept, onBack:goHome });
  const deptLabel = dept&&DEPARTMENTS[dept] ? DEPARTMENTS[dept].label : null;

  return R('div', { style:{ minHeight:"100vh", background:C.paleBg, fontFamily:FONT_BODY } },
    R(TopBar, { roleLabel:roleLabel, deptLabel:deptLabel, userName:userName, onSwitchRole:goHome, onChangeDept:function(){ setStep("department"); }, showDeptChange:role!=="manager", onManualSync:function(){ fetchLatestCloudData(true); }, onForcePush:forcePushAllData, isSyncing:isSyncing }),
    role==="manager" ? R(ManagerScreen, { motherBatches:motherBatches, setMotherBatches:setMotherBatches, commercialBatches:commercialBatches, setCommercialBatches:setCommercialBatches }) : null,
    role==="production" ? R(ProductionScreen, { dept:dept, userName:userName, setUserName:setUserName, motherBatches:motherBatches, setMotherBatches:setMotherBatches, commercialBatches:commercialBatches, setCommercialBatches:setCommercialBatches }) : null,
    role==="qa" ? R(QaScreen, { dept:dept, userName:userName, motherBatches:motherBatches, setMotherBatches:setMotherBatches, commercialBatches:commercialBatches }) : null,
    role==="packaging" ? R(PackagingScreen, { dept:dept, userName:userName, setUserName:setUserName, motherBatches:motherBatches, commercialBatches:commercialBatches, setCommercialBatches:setCommercialBatches }) : null,
    R('div', { style:{ textAlign:"center", padding:"18px 16px 30px", fontSize:11, color:C.sub }, className:"no-print" }, "Danish Health Care (P) Ltd. · 76/27-29, Industrial Estate, Maxi Road, Ujjain 456010 · ISO 9001:2015 & WHO GMP Certified")
  );
}




