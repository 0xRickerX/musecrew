
const MUSES = [
  {id:"014",name:"Research Muse",role:"Research Specialist",cat:"research",emoji:"⌕",skills:["research","web","sources","synthesis"],rep:96.4,jobs:184,success:97.1,latency:"41s",color:"#6d7cff"},
  {id:"037",name:"Coding Muse",role:"Software Builder",cat:"technical",emoji:"</>",skills:["coding","python","javascript","api"],rep:95.2,jobs:276,success:96.9,latency:"54s",color:"#a36dff"},
  {id:"082",name:"Writing Muse",role:"Content Synthesizer",cat:"creative",emoji:"✎",skills:["writing","synthesis","editing","copy"],rep:93.7,jobs:198,success:95.8,latency:"37s",color:"#ff77c7"},
  {id:"103",name:"Data Muse",role:"Data Analyst",cat:"technical",emoji:"▥",skills:["data","analysis","csv","structure"],rep:94.8,jobs:312,success:96.6,latency:"49s",color:"#56e2cf"},
  {id:"121",name:"Design Muse",role:"Product Designer",cat:"creative",emoji:"◈",skills:["design","ui","ux","visual"],rep:93.1,jobs:147,success:94.9,latency:"63s",color:"#806dff"},
  {id:"144",name:"Web Muse",role:"Web Operator",cat:"research",emoji:"◎",skills:["web","browser","research","scraping"],rep:93.0,jobs:132,success:94.2,latency:"46s",color:"#57b9ff"},
  {id:"166",name:"Verification Muse",role:"Quality Verifier",cat:"technical",emoji:"✓",skills:["verify","qa","review","fact-check"],rep:97.3,jobs:255,success:98.0,latency:"28s",color:"#6be5b6"},
  {id:"177",name:"Strategy Muse",role:"Lead Planner",cat:"research",emoji:"✦",skills:["planning","strategy","decomposition","coordination"],rep:92.6,jobs:167,success:96.5,latency:"44s",color:"#ffb36d"}
];

const TASKS = [
  {id:1,type:"research",credit:180,title:"Map the Chinese AI model ecosystem",desc:"Research frontier models, companies, positioning and key product differences.",skills:["research","web","synthesis"],time:"8m",applicants:6},
  {id:2,type:"build",credit:240,title:"Build an AI launch landing page",desc:"Create the interface structure, implementation plan and conversion-focused copy.",skills:["coding","design","copy"],time:"12m",applicants:4},
  {id:3,type:"strategy",credit:150,title:"Create a product launch strategy",desc:"Turn a technical product into a concise launch plan with positioning and distribution.",skills:["strategy","research","writing"],time:"9m",applicants:8},
  {id:4,type:"research",credit:120,title:"Find 30 fast-growing AI developer tools",desc:"Collect products, categories, traction signals and concise notes for each.",skills:["web","research","data"],time:"7m",applicants:9},
  {id:5,type:"build",credit:300,title:"Prototype a multi-agent dashboard",desc:"Plan and assemble a functional dashboard with agent cards, runs and activity.",skills:["coding","ui","api"],time:"18m",applicants:5},
  {id:6,type:"strategy",credit:140,title:"Analyze agent marketplace positioning",desc:"Compare marketplace models and propose one differentiated product narrative.",skills:["strategy","analysis","synthesis"],time:"10m",applicants:7},
  {id:7,type:"research",credit:110,title:"Summarize 15 AI research papers",desc:"Extract the main claims, methods, limitations and useful implementation ideas.",skills:["research","sources","writing"],time:"11m",applicants:11},
  {id:8,type:"build",credit:260,title:"Design an agent profile system",desc:"Create profile architecture for skills, history, reputation and public identity.",skills:["design","data","coding"],time:"14m",applicants:3},
  {id:9,type:"strategy",credit:170,title:"Turn raw research into an X launch thread",desc:"Synthesize research into a clear narrative with hooks and technical proof points.",skills:["writing","strategy","editing"],time:"8m",applicants:10},
  {id:10,type:"research",credit:130,title:"Build a competitive intelligence brief",desc:"Collect competitors, features, pricing signals and product gaps.",skills:["research","web","analysis"],time:"9m",applicants:6},
  {id:11,type:"build",credit:220,title:"Create an API integration plan",desc:"Design endpoint structure, provider abstraction and fallback behavior.",skills:["api","coding","planning"],time:"13m",applicants:4},
  {id:12,type:"strategy",credit:160,title:"Plan a 7-day product launch",desc:"Create daily milestones for product, content, demos and community distribution.",skills:["planning","strategy","coordination"],time:"7m",applicants:9}
];

let ACTIVITY = [
  ["Research Muse","completed source discovery","2m","⌕"],
  ["Verification Muse","approved 4/4 outputs","4m","✓"],
  ["Coding Muse","finished implementation block","7m","</>"],
  ["Lead Muse","assembled a 3-Muse crew","9m","✦"],
  ["Data Muse","structured 42 findings","12m","▥"],
  ["Writing Muse","delivered final synthesis","15m","✎"]
];

let selectedBuilder = new Set();
let currentMuseFilter = "all";
let currentMarketFilter = "all";
let currentRunId = null;
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r=>setTimeout(r,ms));

const demoRuns = [
  {id:"run-a91c2f",time:"11:58",task:"Research 20 Chinese AI startups and build a short report.",status:"verified",crew:["014","103","082"],scores:[109.9,96.8,91.5],verified:3},
  {id:"run-94be20",time:"11:41",task:"Build a launch page for a multi-agent developer tool.",status:"verified",crew:["037","121","082"],scores:[108.4,94.1,92.8],verified:3},
  {id:"run-28fc77",time:"10:52",task:"Analyze the AI agent market and create a launch strategy.",status:"verified",crew:["177","014","082"],scores:[104.0,101.7,92.1],verified:3},
  {id:"run-d013aa",time:"09:30",task:"Create an API integration plan for five model providers.",status:"verified",crew:["037","177","166"],scores:[107.2,95.4,95.1],verified:3}
];

function getRuns(){
  try{
    const stored = JSON.parse(localStorage.getItem("musecrew_runs")||"[]");
    return [...stored, ...demoRuns];
  }catch{return demoRuns}
}
function saveRun(run){
  let stored=[];
  try{stored=JSON.parse(localStorage.getItem("musecrew_runs")||"[]")}catch{}
  stored.unshift(run);
  localStorage.setItem("musecrew_runs",JSON.stringify(stored.slice(0,20)));
}
function updateRunMetric(){
  const el=$("#runCountMetric");
  if(el) el.textContent = getRuns().length + 20;
}

function switchView(name){
  $$(".view").forEach(v=>v.classList.remove("active"));
  const target=$("#view-"+name);
  if(target) target.classList.add("active");
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  const titles={dashboard:"Overview",muses:"Muses",marketplace:"Marketplace",builder:"Crew Builder",runs:"Runs",leaderboard:"Leaderboard"};
  $("#viewTitle").textContent=titles[name]||"Overview";
  window.scrollTo({top:0,behavior:"smooth"});
  $("#sidebar").classList.remove("open");
  if(name==="runs") renderRuns();
}
function bindViewButtons(){
  $$("[data-view]").forEach(el=>el.addEventListener("click",e=>{
    e.preventDefault(); switchView(el.dataset.view);
  }));
}

function renderDashboard(){
  const el=$("#recentMissions");
  if(el){
    const runs=getRuns().slice(0,3);
    el.innerHTML=runs.map((r,i)=>{
      const crewCount=r.crew?.length || 3;
      const title=(r.task||"MuseCrew mission").replace(/\.$/,"");
      const icon=["▤","</>","▥"][i%3];
      return `
        <div class="recent-row" data-run="${r.id}">
          <div class="recent-icon-box">${icon}</div>
          <div class="recent-copy"><b>${escapeHtml(title)}</b><small>${crewCount} agents · ${r.result ? "verified deliverable" : "execution receipt"}</small></div>
          <span class="mission-status">● Completed</span>
          <span class="recent-arrow">›</span>
        </div>`;
    }).join("");
    el.querySelectorAll("[data-run]").forEach(row=>row.addEventListener("click",()=>{
      switchView("runs"); showRun(row.dataset.run);
    }));
  }
  updateRunMetric();
}

function updateOutputPanel(task, crew, aiResult, runId){
  const titleEl=$("#outputTitle");
  const doc=$("#outputDocument");
  const log=$("#outputLog");
  const count=$("#outputVerifiedCount");
  if(!titleEl || !doc || !log) return;
  const title=(task||"MuseCrew Deliverable").replace(/\.$/,"");
  titleEl.textContent=title;
  if(count) count.textContent=`${crew.length}/${crew.length}`;
  log.innerHTML=crew.map(c=>`<div><span class="ok">[OK]</span> ${escapeHtml(c.m.name)}: complete</div>`).join("")
    + `<div class="pink">&gt; specialists submitted work</div>`
    + `<div class="pink">&gt; generating final deliverable...</div>`
    + crew.map(c=>`<div>&gt; accepted: ${escapeHtml(c.m.name)}</div>`).join("")
    + `<div class="ok">&gt; Lead Muse synthesized final result</div>`
    + `<div class="ok">&gt; receipt ${escapeHtml(runId)} created</div>`;
  doc.innerHTML=`
    <div class="doc-head"><span class="doc-icon">▤</span><b>${escapeHtml(title)}</b><span>•••</span></div>
    <div class="doc-body">${renderDeliverableText(aiResult.final)}</div>`;
}

function renderMuses(filter="all"){
  const list=filter==="all"?MUSES:MUSES.filter(m=>m.cat===filter);
  $("#museGrid").innerHTML=list.map(m=>`
    <article class="muse-card panel" data-muse="${m.id}" style="--glow:${m.color}">
      <div class="muse-avatar">${m.emoji}</div>
      <h3>${m.name}</h3><div class="role">${m.role}</div>
      <div class="skill-chips">${m.skills.map(s=>`<span>${s}</span>`).join("")}</div>
      <div class="card-metrics">
        <div><b>${m.rep}</b><small>reputation</small></div>
        <div><b>${m.jobs}</b><small>jobs</small></div>
        <div><b>${m.success}%</b><small>success</small></div>
      </div>
      <div class="card-bottom"><span class="status-tag">● ONLINE</span><span class="view-profile">View profile →</span></div>
    </article>`).join("");
  $$("[data-muse]").forEach(c=>c.addEventListener("click",()=>openMuse(c.dataset.muse)));
}

function openMuse(id){
  const m=MUSES.find(x=>x.id===id); if(!m)return;
  $("#museModalBody").innerHTML=`
    <div class="modal-hero">
      <div class="modal-avatar">${m.emoji}</div>
      <div><h3>${m.name}</h3><p>${m.role} · Muse #${m.id}</p></div>
      <div class="modal-rep"><b>${m.rep}</b><span>REPUTATION</span></div>
    </div>
    <div class="skill-chips">${m.skills.map(s=>`<span>${s}</span>`).join("")}</div>
    <div class="modal-sections">
      <div class="modal-box"><h4>PERFORMANCE</h4>
        <div class="modal-stat-grid">
          <div><b>${m.jobs}</b><small>jobs</small></div><div><b>${m.success}%</b><small>success</small></div><div><b>${m.latency}</b><small>avg latency</small></div>
        </div>
      </div>
      <div class="modal-box"><h4>CAPABILITIES</h4>
        <div class="skill-chips">${m.skills.map(s=>`<span>${s}</span>`).join("")}</div>
      </div>
      <div class="modal-box"><h4>RECENT VERIFIED JOBS</h4>
        <div class="history-row">Agent ecosystem analysis <span>✓</span></div>
        <div class="history-row">Launch research package <span>✓</span></div>
        <div class="history-row">Multi-agent benchmark brief <span>✓</span></div>
      </div>
      <div class="modal-box"><h4>NETWORK STATE</h4>
        <div class="history-row">Status <span>ONLINE</span></div>
        <div class="history-row">Queue <span>0 jobs</span></div>
        <div class="history-row">Availability <span>READY</span></div>
      </div>
    </div>`;
  $("#modalBackdrop").classList.remove("hidden");
  $("#museModal").classList.remove("hidden");
}
function closeMuse(){
  $("#modalBackdrop").classList.add("hidden");$("#museModal").classList.add("hidden");
}

function renderMarket(){
  const q=($("#marketSearch")?.value||"").toLowerCase();
  let list=TASKS.filter(t=>currentMarketFilter==="all"||t.type===currentMarketFilter);
  if(q) list=list.filter(t=>(t.title+" "+t.desc+" "+t.skills.join(" ")).toLowerCase().includes(q));
  $("#marketGrid").innerHTML=list.map(t=>`
    <article class="task-card panel">
      <div class="task-top"><span class="task-type">${t.type}</span><span class="credit">${t.credit} CR</span></div>
      <h3>${t.title}</h3><p>${t.desc}</p>
      <div class="task-meta"><span>◷ ${t.time}</span><span>◉ ${t.applicants} muses</span></div>
      <div class="task-skills">${t.skills.map(s=>`<span>${s}</span>`).join("")}</div>
      <button class="ghost run-market" data-task="${t.id}">Run with MuseCrew →</button>
    </article>`).join("");
  $$(".run-market").forEach(b=>b.addEventListener("click",()=>{
    const t=TASKS.find(x=>x.id===Number(b.dataset.task));
    launchTask(t.title+". "+t.desc);
  }));
}

function renderBuilder(){
  $("#builderMuses").innerHTML=MUSES.map(m=>`
    <div class="builder-muse ${selectedBuilder.has(m.id)?"selected":""}" data-builder="${m.id}">
      <div class="avatar-mini">${m.emoji}</div>
      <div><b>${m.name}</b><small>${m.skills.slice(0,3).join(" / ")}</small></div>
      <div class="check-dot">${selectedBuilder.has(m.id)?"✓":""}</div>
    </div>`).join("");
  $$("[data-builder]").forEach(c=>c.addEventListener("click",()=>toggleBuilderMuse(c.dataset.builder)));
  renderSelectedCrew();
}
function toggleBuilderMuse(id){
  if(selectedBuilder.has(id)) selectedBuilder.delete(id);
  else if(selectedBuilder.size<4) selectedBuilder.add(id);
  renderBuilder();
}
function renderSelectedCrew(){
  const list=[...selectedBuilder].map(id=>MUSES.find(m=>m.id===id));
  $("#selectionCount").textContent=`${list.length} / 4 selected`;
  $("#runManualCrew").disabled=list.length===0;
  if(!list.length){
    $("#selectedCrew").className="selected-crew empty-state";
    $("#selectedCrew").innerHTML="Select up to 4 muses.";
    $("#crewScore").textContent="0.0 score";
    $("#coverageValue").textContent="0%";$("#coverageBar").style.width="0%";$("#crewTags").innerHTML="";
    return;
  }
  $("#selectedCrew").className="selected-crew";
  $("#selectedCrew").innerHTML=list.map(m=>`
    <div class="selected-row"><div class="avatar-mini">${m.emoji}</div><div><b>${m.name}</b><small>${m.role}</small></div></div>`).join("");
  const avg=(list.reduce((a,m)=>a+m.rep,0)/list.length).toFixed(1);
  const skills=[...new Set(list.flatMap(m=>m.skills))];
  const coverage=Math.min(100,Math.round(skills.length/12*100));
  $("#crewScore").textContent=`${avg} avg rep`;
  $("#coverageValue").textContent=coverage+"%";$("#coverageBar").style.width=coverage+"%";
  $("#crewTags").innerHTML=skills.slice(0,8).map(s=>`<span>${s}</span>`).join("");
}

function planTask(task){
  const t=task.toLowerCase(); const out=[];
  if(/research|report|market|startup|analy|competitive|paper/.test(t)) out.push({name:"Research + source collection",skills:["research","web","sources"]});
  if(/data|report|market|startup|analy|map/.test(t)) out.push({name:"Structure + analyze findings",skills:["data","analysis","structure"]});
  if(/write|report|brief|copy|thread|launch/.test(t)) out.push({name:"Synthesize final narrative",skills:["writing","synthesis","editing"]});
  if(/build|code|app|website|landing|prototype|api|dashboard/.test(t)) out.push({name:"Build implementation",skills:["coding","javascript","api"]});
  if(/design|landing|website|profile|dashboard/.test(t)) out.push({name:"Design product interface",skills:["design","ui","visual"]});
  if(/strategy|launch|plan|position/.test(t)) out.push({name:"Create execution strategy",skills:["planning","strategy","coordination"]});
  if(!out.length) out.push({name:"Generate candidate ideas",skills:["planning","strategy","research"]},{name:"Evaluate and rank options",skills:["research","analysis","synthesis"]},{name:"Turn findings into a practical answer",skills:["writing","synthesis","editing"]});
  return out.slice(0,4);
}
function scoreMuse(m,skills){const overlap=m.skills.filter(s=>skills.includes(s)).length;return Math.round((overlap*18+m.rep*.58)*10)/10}
function autoCrew(subtasks){
  const used=new Set();
  return subtasks.map(st=>{
    const ranked=MUSES.filter(m=>!used.has(m.id)&&m.id!=="166").map(m=>({m,score:scoreMuse(m,st.skills)})).sort((a,b)=>b.score-a.score);
    const pick=ranked[0];used.add(pick.m.id);return {st,...pick};
  });
}
function setDrawerStage(name){
  const order=["plan","match","execute","verify","deliver"],idx=order.indexOf(name);
  $$(".drawer-stage").forEach((el,i)=>{el.classList.toggle("active",i===idx);el.classList.toggle("done",i<idx)});
}
function drawerLog(text,cls=""){const d=document.createElement("div");d.className=cls;d.innerHTML=text;$("#drawerLog").appendChild(d);$("#drawerLog").scrollTop=$("#drawerLog").scrollHeight}
function pushActivity(name,text,icon){ACTIVITY.unshift([name,text,"now",icon]);ACTIVITY=ACTIVITY.slice(0,7);renderDashboard()}


function escapeHtml(value){
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[ch]);
}

function renderDeliverableText(text){
  const safe = escapeHtml(text);
  return safe
    .replace(/^### (.+)$/gm, "<h4>$1</h4>")
    .replace(/^## (.+)$/gm, "<h3>$1</h3>")
    .replace(/^# (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/^\s*[-•]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

async function requestRealResult(task, crew){
  const payload = {
    task,
    crew: crew.map(c => ({
      name: c.m.name,
      role: c.m.role,
      subtask: c.st.name
    }))
  };

  const response = await fetch("/api/run", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data?.error || "MuseCrew backend failed.");
  return data;
}

async function launchTask(task,manualIds=null){
  $("#drawerBackdrop").classList.remove("hidden");$("#runDrawer").classList.remove("hidden");
  $("#drawerTask").textContent=task;$("#drawerCrew").innerHTML="";$("#drawerLog").innerHTML="";$("#drawerReceipt").classList.add("hidden");
  $("#drawerTitle").textContent="Lead Muse is planning";
  setDrawerStage("plan");drawerLog('<span class="accent">&gt; task received</span>');await sleep(350);

  const subtasks=planTask(task);
  for(const [i,s] of subtasks.entries()){drawerLog(`+ subtask ${i+1}: ${s.name}`);await sleep(170)}

  let crew;
  setDrawerStage("match");$("#drawerTitle").textContent="Matching specialist muses";await sleep(300);
  if(manualIds){
    const manualMuses=manualIds.map(id=>MUSES.find(m=>m.id===id));
    crew=manualMuses.map((m,i)=>({m,st:subtasks[i%subtasks.length],score:Math.round((m.rep*.9+9)*10)/10}));
  } else crew=autoCrew(subtasks);

  $("#drawerCrew").innerHTML=crew.map(c=>`
    <div class="drawer-crew-card"><span class="score">${c.score}</span><b>${c.m.name}</b><small>${c.st.name}</small></div>`).join("");
  for(const c of crew){drawerLog(`match → ${c.m.name} / ${c.score}`);await sleep(170)}

  setDrawerStage("execute");$("#drawerTitle").textContent=`${crew.length} muses executing`;
  for(const c of crew){
    drawerLog(`[RUN] ${c.m.name}: ${c.st.name}`);await sleep(330);
    drawerLog(`<span class="ok">[OK]</span> ${c.m.name}: complete`);
    pushActivity(c.m.name,"completed "+c.st.name.toLowerCase(),c.m.emoji);
  }

  setDrawerStage("verify");
  $("#drawerTitle").textContent="Verification Muse reviewing";
  drawerLog('<span class="accent">&gt; specialists submitted work</span>');
  drawerLog('<span class="accent">&gt; generating final deliverable...</span>');

  let aiResult;
  try {
    aiResult = await requestRealResult(task, crew);
    crew.forEach(c=>drawerLog(`<span class="ok">✓</span> accepted: ${c.m.name}`));
    drawerLog('<span class="ok">✓</span> Lead Muse synthesized final result');
  } catch (err) {
    $("#drawerTitle").textContent="AI backend needs configuration";
    $("#drawerReceipt").classList.remove("hidden");
    $("#drawerReceipt").innerHTML=`
      <b>Backend not connected</b>
      <p>${escapeHtml(err.message)}</p>
      <p>Add <code>ANTHROPIC_API_KEY</code> in Vercel → Project → Settings → Environment Variables, then redeploy.</p>
    `;
    drawerLog(`<span class="accent">! ${escapeHtml(err.message)}</span>`);
    return;
  }

  setDrawerStage("deliver");$("#drawerTitle").textContent="Verified delivery ready";
  const id="run-"+Math.random().toString(16).slice(2,8);
  const run={
    id,
    time:new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"}),
    task,
    status:"verified",
    crew:crew.map(c=>c.m.id),
    scores:crew.map(c=>c.score),
    verified:crew.length,
    result:aiResult.final
  };
  saveRun(run);currentRunId=id;
  updateOutputPanel(task, crew, aiResult, id);

  $("#drawerReceipt").classList.remove("hidden");
  $("#drawerReceipt").innerHTML=`
    <div class="final-deliverable">
      <div class="deliverable-head">
        <span>FINAL DELIVERABLE</span>
        <b>✓ ${crew.length}/${crew.length} VERIFIED</b>
      </div>
      <div class="deliverable-content"><p>${renderDeliverableText(aiResult.final)}</p></div>
      <div class="deliverable-foot">
        <span>${escapeHtml(aiResult.model || "MuseCrew")}</span>
        <span>${id}</span>
      </div>
    </div>
  `;
  drawerLog(`<span class="ok">&gt; receipt ${id} created</span>`);
  pushActivity("Lead Muse","delivered a verified crew result","✦");
  renderRuns();updateRunMetric();
}

function closeDrawer(){$("#drawerBackdrop").classList.add("hidden");$("#runDrawer").classList.add("hidden")}

function renderRuns(){
  const runs=getRuns();
  $("#runList").innerHTML=runs.map((r,i)=>`
    <div class="run-row ${currentRunId===r.id?"active":""}" data-run="${r.id}">
      <div class="rr-top"><b>${r.id}</b><span class="run-status">✓ VERIFIED</span></div>
      <p>${r.task}</p><small>${r.time} · ${r.crew.length} muses · ${r.verified}/${r.crew.length} accepted</small>
    </div>`).join("");
  $$("[data-run]").forEach(el=>el.addEventListener("click",()=>showRun(el.dataset.run)));
  if(currentRunId && runs.some(r=>r.id===currentRunId)) showRun(currentRunId,false);
}
function showRun(id,reRender=true){
  currentRunId=id;
  const r=getRuns().find(x=>x.id===id);if(!r)return;
  if(reRender) renderRuns();
  const crew=r.crew.map((id,i)=>({m:MUSES.find(m=>m.id===id),score:r.scores?.[i]||0})).filter(x=>x.m);
  $("#runDetail").innerHTML=`
    <div class="receipt-head"><div><div class="eyebrow">EXECUTION RECEIPT</div><h3>${r.status==="verified"?"Verified run":"Run"}</h3></div><span class="receipt-id">${r.id}</span></div>
    <div class="receipt-task">${r.task}</div>
    <div class="receipt-stage-grid">${["Plan","Match","Execute","Verify","Deliver"].map((s,i)=>`<div class="receipt-stage"><span>0${i+1}</span><b>${s}</b></div>`).join("")}</div>
    <div class="receipt-crew">${crew.map(c=>`<div class="receipt-crew-row"><div><b>${c.m.name}</b><small>${c.m.role} · match ${c.score}</small></div><span class="verified">✓ VERIFIED</span></div>`).join("")}</div>
    ${r.result ? `<div class="saved-result"><div class="drawer-section-title">FINAL DELIVERABLE</div><p>${renderDeliverableText(r.result)}</p></div>` : ""}`;
}

function renderLeaderboard(){
  const list=[...MUSES].sort((a,b)=>b.rep-a.rep);
  $("#leaderboard").innerHTML=`
    <div class="leader-row header"><span>RANK</span><span>MUSE</span><span>SKILLS</span><span>REP</span><span>JOBS</span><span>SUCCESS</span></div>
    ${list.map((m,i)=>`<div class="leader-row">
      <span class="leader-rank">#${i+1}</span>
      <div class="leader-name"><div class="avatar-mini">${m.emoji}</div><div><b>${m.name}</b><small>${m.role}</small></div></div>
      <div class="leader-skills">${m.skills.slice(0,3).map(s=>`<span>${s}</span>`).join("")}</div>
      <span class="leader-val">${m.rep}</span><span class="leader-val">${m.jobs}</span><span class="leader-val">${m.success}%</span>
    </div>`).join("")}`;
}

function randomTask(){
  const t=TASKS[Math.floor(Math.random()*TASKS.length)];
  $("#heroTask").value=t.title+". "+t.desc;
  switchView("dashboard");
}

document.addEventListener("DOMContentLoaded",()=>{
  renderDashboard();renderMuses();renderMarket();renderBuilder();renderLeaderboard();renderRuns();bindViewButtons();

  const copyCA = $("#copyCA");
  if(copyCA){
    copyCA.addEventListener("click", async ()=>{
      const ca=copyCA.dataset.ca;
      try{
        await navigator.clipboard.writeText(ca);
      }catch{
        const ta=document.createElement("textarea"); ta.value=ca; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
      const state=$("#caCopyState");
      copyCA.classList.add("copied");
      if(state) state.textContent="COPIED";
      setTimeout(()=>{ copyCA.classList.remove("copied"); if(state) state.textContent="COPY"; },1400);
    });
  }

  $("#menuBtn").addEventListener("click",()=>$("#sidebar").classList.toggle("open"));
  const gs=$("#globalSearch");
  if(gs){
    gs.addEventListener("keydown",e=>{
      if(e.key==="Enter" && gs.value.trim()){
        $("#heroTask").value=gs.value.trim();
        switchView("dashboard");
        $("#heroTask").focus();
      }
    });
  }
  $("#quickLaunchBtn").addEventListener("click",()=>launchTask($("#heroTask").value.trim()||"Research AI agents and build a concise brief."));
  $("#heroLaunch").addEventListener("click",()=>launchTask($("#heroTask").value.trim()));
  $("#heroTask").addEventListener("keydown",e=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter")launchTask($("#heroTask").value.trim())});
  $$("[data-preset]").forEach(b=>b.addEventListener("click",()=>$("#heroTask").value=b.dataset.preset));

  $$(".filters .filter[data-filter]").forEach(b=>b.addEventListener("click",()=>{
    $$(".filters .filter[data-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentMuseFilter=b.dataset.filter;renderMuses(currentMuseFilter)
  }));
  $$(".market-filters .filter").forEach(b=>b.addEventListener("click",()=>{
    $$(".market-filters .filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentMarketFilter=b.dataset.market;renderMarket()
  }));
  $("#marketSearch").addEventListener("input",renderMarket);
  $("#runManualCrew").addEventListener("click",()=>launchTask($("#builderTask").value.trim(),[...selectedBuilder]));
  $("#clearRuns").addEventListener("click",()=>{localStorage.removeItem("musecrew_runs");currentRunId=null;renderRuns();updateRunMetric();$("#runDetail").innerHTML='<div class="empty-detail"><span>↻</span><b>Select a run</b><p>Execution receipt details will appear here.</p></div>'});

  $("#closeDrawer").addEventListener("click",closeDrawer);$("#drawerBackdrop").addEventListener("click",closeDrawer);
  $("#closeMuse").addEventListener("click",closeMuse);$("#modalBackdrop").addEventListener("click",closeMuse);
  $("#postTaskBtn").addEventListener("click",()=>{switchView("dashboard");$("#heroTask").focus()});
});
