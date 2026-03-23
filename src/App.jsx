import { useState, useEffect, useRef, useCallback } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');`;


const T = {
  bg:"#FFFFFF", bgCard:"#F9F7F4", bgCard2:"#F2EFE9", surface:"#EDE8DF",
  gold:"#B8841F", goldDim:"#8A6215", goldGlow:"rgba(184,132,31,0.12)", goldPale:"#FDF5E4",
  white:"#FFFFFF", text:"#1C1A17", textSub:"#5C5346", textMuted:"#9C9080",
  border:"rgba(0,0,0,0.08)", borderGold:"rgba(184,132,31,0.3)",
  green:"#16803C", greenBg:"rgba(22,128,60,0.09)",
  red:"#C0392B", redBg:"rgba(192,57,43,0.08)",
  blue:"#1D4ED8", blueBg:"rgba(29,78,216,0.08)",
  navy:"#0D1B3E",
};

const css = `
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body,#root{height:100%;background:#DDD9D0}
body{font-family:'Sora',sans-serif;color:${T.text};overscroll-behavior:none}
::-webkit-scrollbar{display:none}
input,textarea,button{font-family:'Sora',sans-serif}
button{cursor:pointer;border:none;background:none}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes bounce2{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes scaleIn{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
.fade-in{animation:fadeIn 0.22s ease both}
.scale-in{animation:scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both}
`;

const CLIENTS = [
  { id:"OZ001", name:"Maria Garcia",    pass:"garcia2024", caseNum:"WAC2315151234", matters:["Family-Based I-130","I-485 Adjustment"],          atty:"Atty. James Ozek", avatar:"MG", next:"Apr 10 – Submit I-485 Docs"        },
  { id:"OZ002", name:"James Chen",      pass:"chen2024",   caseNum:"EAC2309874321", matters:["EB-2 NIW","I-140 Petition"],                       atty:"Atty. Sara Ozek",  avatar:"JC", next:"Apr 5 – Medical Exam"              },
  { id:"OZ003", name:"Priya Patel",     pass:"patel2024",  caseNum:"SRC2312345678", matters:["H-1B Extension","H-4 Dependent"],                   atty:"Atty. James Ozek", avatar:"PP", next:"Apr 20 – Biometrics"               },
  { id:"OZ004", name:"Nexus Corp LLC",  pass:"nexus2024",  caseNum:"BIZ2316001234", matters:["Commercial Litigation","Vendor Contract Review"],    atty:"Atty. Sara Ozek",  avatar:"NC", next:"Apr 12 – Deposition Prep Session" },
  { id:"OZ005", name:"David Osei",      pass:"osei2024",   caseNum:"BIZ2314887612", matters:["LLC Formation","Employment Agreement"],              atty:"Atty. James Ozek", avatar:"DO", next:"Apr 8 – Review Operating Agreement"},
];
const TASKS = [
  { id:1, title:"Submit I-485 Supporting Documents", due:"Apr 10, 2026", status:"Pending",   pri:"High" },
  { id:2, title:"Medical Exam (Form I-693)",          due:"Apr 5, 2026",  status:"Progress",  pri:"High" },
  { id:3, title:"Sign Retainer Agreement",            due:"Mar 28, 2026", status:"Done",      pri:"Low"  },
  { id:4, title:"Provide Birth Certificate",          due:"Apr 15, 2026", status:"Pending",   pri:"Med"  },
  { id:5, title:"Biometrics Appointment",             due:"Apr 20, 2026", status:"Scheduled", pri:"Med"  },
];
const BILLS = [
  { id:"INV-089", date:"Mar 1",  desc:"Legal Services – Feb 2026", amt:2800, status:"Paid" },
  { id:"INV-090", date:"Mar 15", desc:"USCIS Filing Fees – I-485", amt:1440, status:"Due"  },
  { id:"INV-091", date:"Apr 1",  desc:"Legal Services – Mar 2026", amt:2800, status:"Soon" },
];
const ARTICLES = [
  { id:1, title:"New USCIS Fee Schedule 2026",          date:"Mar 10", cat:"Immigration", emoji:"📋", read:"3 min" },
  { id:2, title:"H-1B Cap Season: Full Breakdown",       date:"Feb 28", cat:"Work Visas",  emoji:"🏢", read:"5 min" },
  { id:3, title:"Commercial Litigation: What to Expect", date:"Feb 20", cat:"Litigation",  emoji:"⚖️", read:"5 min" },
  { id:4, title:"LLC vs S-Corp: Which Is Right for You?",date:"Feb 15", cat:"Business Law",emoji:"📊", read:"4 min" },
  { id:5, title:"DACA: Recent Court Decisions",          date:"Feb 5",  cat:"Policy",      emoji:"🛡️", read:"4 min" },
  { id:6, title:"Contract Disputes & Breach of Contract",date:"Jan 30", cat:"Corporate",   emoji:"📑", read:"6 min" },
];
const REELS = [
  { id:1, title:"H-1B 2026: 5 Things to Know",           views:"12.4K", dur:"0:58" },
  { id:2, title:"LLC vs S-Corp: What's Better for You?", views:"18.7K", dur:"1:05" },
  { id:3, title:"EB-5 Investor Visa in 60 Seconds",      views:"15.2K", dur:"1:00" },
  { id:4, title:"When Should You Hire a Litigator?",     views:"9.3K",  dur:"1:10" },
  { id:5, title:"DACA: Your Rights Today",               views:"22.1K", dur:"0:55" },
  { id:6, title:"Business Contracts: 5 Red Flags",       views:"14.6K", dur:"1:08" },
];

const priColor  = p => ({High:{bg:T.redBg,c:T.red},Med:{bg:"rgba(234,179,8,0.12)",c:"#92700A"},Low:{bg:T.greenBg,c:T.green}}[p]  || {bg:T.surface,c:T.textSub});
const statColor = s => ({Done:{bg:T.greenBg,c:T.green},Pending:{bg:"rgba(234,179,8,0.12)",c:"#92700A"},Progress:{bg:T.blueBg,c:T.blue},Scheduled:{bg:"rgba(139,92,246,0.1)",c:"#6D28D9"}}[s] || {bg:T.surface,c:T.textSub});
const statLabel = s => ({Done:"Done",Pending:"Pending",Progress:"In Progress",Scheduled:"Scheduled"}[s] || s);

function Chip({children,bg,color}){
  return <span style={{background:bg,color,fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,letterSpacing:0.3,whiteSpace:"nowrap"}}>{children}</span>;
}
function Divider(){return <div style={{height:1,background:T.border}}/>;}

function GoldBtn({children,onPress,full,sm,outline,style={}}){
  const [p,setP]=useState(false);
  return (
    <button onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)} onClick={onPress}
      style={{background:outline?"transparent":T.gold,border:outline?`1.5px solid ${T.gold}`:"none",color:outline?T.gold:"#FFFFFF",borderRadius:sm?10:14,padding:sm?"8px 16px":"14px 24px",fontSize:sm?13:15,fontWeight:600,width:full?"100%":"auto",transform:p?"scale(0.96)":"scale(1)",transition:"transform 0.1s",display:"inline-flex",alignItems:"center",justifyContent:"center",...style}}>
      {children}
    </button>
  );
}

function Card({children,style={},onPress}){
  return <div onClick={onPress} style={{background:T.bgCard,borderRadius:20,border:`1px solid ${T.border}`,padding:"16px",cursor:onPress?"pointer":"default",...style}}>{children}</div>;
}

function Avatar({initials,size=40,gold=false}){
  return <div style={{width:size,height:size,borderRadius:size/2,background:gold?`linear-gradient(135deg,${T.gold},${T.goldDim})`:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.32,fontWeight:700,color:gold?"#FFFFFF":T.gold,flexShrink:0}}>{initials}</div>;
}

function StatusBar(){
  const [time,setTime]=useState("");
  useEffect(()=>{
    const u=()=>setTime(new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}));
    u(); const t=setInterval(u,30000); return()=>clearInterval(t);
  },[]);
  return (
    <div style={{padding:"10px 22px 4px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:15,fontWeight:700,color:T.text}}>{time}</span>
      <div style={{display:"flex",alignItems:"center",gap:5}}>
        <span style={{fontSize:11,color:T.textSub,letterSpacing:-1}}>●●●</span>
        <span style={{fontSize:12,color:T.textSub}}>WiFi</span>
        <span style={{fontSize:12}}>🔋</span>
      </div>
    </div>
  );
}

function BottomNav({tab,setTab,isClient}){
  const pub=[{id:"home",icon:"⚖️",label:"Home"},{id:"news",icon:"📰",label:"News"},{id:"uscis",icon:"🛂",label:"USCIS"},{id:"regs",icon:"🏛️",label:"Rules"},{id:"portal",icon:"🔐",label:"Portal"}];
  const cli=[{id:"dash",icon:"🏠",label:"Home"},{id:"tasks",icon:"✅",label:"Tasks"},{id:"docs",icon:"📁",label:"Docs"},{id:"forms",icon:"📋",label:"Forms"},{id:"chat",icon:"💬",label:"Ask"},{id:"billing",icon:"💳",label:"Bills"}];
  const tabs=isClient?cli:pub;
  return (
    <nav style={{background:"rgba(255,255,255,0.97)",backdropFilter:"blur(20px)",borderTop:`1px solid ${T.border}`,display:"flex",padding:"10px 0 18px",flexShrink:0}}>
      {tabs.map(t=>(
        <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 0"}}>
          <span style={{fontSize:20,opacity:tab===t.id?1:0.35,transition:"opacity 0.2s"}}>{t.icon}</span>
          <span style={{fontSize:10,fontWeight:tab===t.id?600:400,color:tab===t.id?T.gold:T.textMuted,transition:"color 0.2s"}}>{t.label}</span>
          {tab===t.id&&<div style={{width:4,height:4,borderRadius:2,background:T.gold}}/>}
        </button>
      ))}
    </nav>
  );
}

/* ── PUBLIC HOME ── */
function PublicHome({setTab}){
  return (
    <div>
      {/* Navy hero — brand colour retained */}
      <div style={{background:`linear-gradient(160deg,#0D1B3E 0%,#1D2F5A 100%)`,padding:"22px 16px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:-50,right:-50,width:180,height:180,borderRadius:"50%",background:"radial-gradient(circle,rgba(184,132,31,0.2) 0%,transparent 70%)"}}/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            
            <div>
              <div style={{fontSize:16,fontWeight:700,color:"#FFFFFF"}}>Ozek Law</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",letterSpacing:0.8}}>Immigration & Business</div>
            </div>
          </div>
          <GoldBtn onPress={()=>setTab("portal")} sm style={{borderRadius:20}}>Client Login</GoldBtn>
        </div>
        <div style={{marginBottom:6,fontSize:10,letterSpacing:2.5,color:T.gold,fontWeight:600,textTransform:"uppercase"}}>Trusted Legal Counsel Since 2010</div>
        <h1 style={{fontFamily:"'Libre Baskerville',serif",fontSize:30,lineHeight:1.2,color:"#FFFFFF",marginBottom:12}}>Your Path to<br/><em style={{color:T.gold}}>Legal Clarity</em></h1>
        <p style={{fontSize:14,color:"rgba(255,255,255,0.6)",lineHeight:1.7,marginBottom:22}}>Immigration, business law, litigation, and corporate counsel — a full-service firm guiding individuals and companies through every legal challenge.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
          {[["98%","Approval Rate"],["15+","Years Experience"],["50+","Practice Areas"],["42","Countries Served"]].map(([n,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:14,padding:"12px 6px",textAlign:"center"}}>
              <div style={{fontSize:17,fontWeight:700,color:T.gold,fontFamily:"'Libre Baskerville',serif"}}>{n}</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.55)",marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* White body */}
      <div style={{padding:"20px 16px",background:T.bg}}>
        <div style={{marginBottom:22}}>
          <h2 style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:12}}>Practice Areas</h2>
          <div style={{display:"flex",gap:10,overflowX:"auto",paddingBottom:4}}>
            {[{icon:"🛂",title:"Immigration",sub:"Visas & Green Cards"},{icon:"⚖️",title:"Litigation",sub:"Courts & Disputes"},{icon:"🏢",title:"Business Law",sub:"Formation & Compliance"},{icon:"📑",title:"Corporate",sub:"Contracts & Transactions"},{icon:"🛡️",title:"Removal Defense",sub:"Appeals & Hearings"},{icon:"🤝",title:"Asylum",sub:"Humanitarian Relief"}].map(p=>(
              <div key={p.title} style={{flexShrink:0,width:140,background:T.bgCard,borderRadius:18,padding:"16px 14px",border:`1px solid ${T.border}`}}>
                <div style={{fontSize:26,marginBottom:10}}>{p.icon}</div>
                <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:3}}>{p.title}</div>
                <div style={{fontSize:11,color:T.textSub,lineHeight:1.4}}>{p.sub}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h2 style={{fontSize:17,fontWeight:700,color:T.text}}>Latest Updates</h2>
            <button onClick={()=>setTab("news")} style={{fontSize:13,color:T.gold,fontWeight:600}}>See all →</button>
          </div>
          {ARTICLES.slice(0,2).map(a=>(
            <Card key={a.id} style={{marginBottom:10,display:"flex",gap:14,alignItems:"center"}}>
              <div style={{width:46,height:46,borderRadius:14,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{a.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:5}}><Chip bg={T.goldPale} color={T.gold}>{a.cat}</Chip><Chip bg={T.surface} color={T.textSub}>{a.read}</Chip></div>
                <div style={{fontSize:13,fontWeight:600,color:T.text,lineHeight:1.35}}>{a.title}</div>
                <div style={{fontSize:11,color:T.textMuted,marginTop:3}}>{a.date}</div>
              </div>
            </Card>
          ))}
        </div>

        <Card style={{background:`linear-gradient(135deg,#0D1B3E,#1D2F5A)`,border:"none"}}>
          <div style={{fontSize:22,marginBottom:8}}>📞</div>
          <h3 style={{fontSize:16,fontWeight:700,color:"#FFFFFF",marginBottom:6}}>Consultation</h3>
          <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",marginBottom:16,lineHeight:1.6}}>Speak with an Ozek Law attorney — no obligation.</p>
          <GoldBtn full onPress={()=>window.open("https://wa.me/12028548545?text=Hello%2C%20I%20would%20like%20to%20schedule%20a%20consultation%20with%20Ozek%20Law%20Firm.","_blank")}>Schedule Now ↗</GoldBtn>
        </Card>
      </div>
    </div>
  );
}

/* ── NEWS ── */
function NewsPage(){
  const [sub,setSub]=useState(""); const [done,setDone]=useState(false);
  return (
    <div style={{background:T.bg}}>
      <div style={{padding:"20px 16px 0"}}>
        <h1 style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:4}}>News & Updates</h1>
        <p style={{fontSize:13,color:T.textSub,marginBottom:16}}>Immigration, business law & litigation insights from Ozek Law</p>
      </div>

      {/* Newsletter */}
      <div style={{margin:"0 16px 18px",background:T.goldPale,borderRadius:20,padding:"18px 16px",border:`1px solid ${T.borderGold}`}}>
        <div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:4}}>📬 Weekly Newsletter</div>
        <p style={{fontSize:12,color:T.textSub,marginBottom:12}}>Policy updates & case law alerts</p>
        {done ? <div style={{background:T.greenBg,borderRadius:12,padding:"10px 14px",color:T.green,fontSize:13,fontWeight:600}}>✓ You're subscribed!</div> : (
          <div style={{display:"flex",gap:8}}>
            <input value={sub} onChange={e=>setSub(e.target.value)} placeholder="your@email.com" style={{flex:1,background:"rgba(0,0,0,0.06)",border:`1px solid ${T.border}`,borderRadius:12,padding:"11px 14px",color:T.text,fontSize:13,outline:"none"}}/>
            <GoldBtn onPress={()=>sub&&setDone(true)} sm>Join</GoldBtn>
          </div>
        )}
      </div>

      {/* Reels */}
      <div style={{paddingLeft:16,marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",paddingRight:16,marginBottom:12}}>
          <h2 style={{fontSize:17,fontWeight:700,color:T.text}}>📱 Instagram Reels</h2>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{fontSize:12,color:T.gold,textDecoration:"none",fontWeight:600}}>Follow ↗</a>
        </div>
        <div style={{display:"flex",gap:10,overflowX:"auto",paddingRight:16,paddingBottom:4}}>
          {REELS.map(r=>(
            <div key={r.id} onClick={()=>alert(`▶ Playing: ${r.title}`)} style={{flexShrink:0,width:116,aspectRatio:"9/16",background:`linear-gradient(170deg,#0D1B3E,#1D2F5A)`,borderRadius:18,overflow:"hidden",position:"relative",border:`1px solid ${T.border}`,cursor:"pointer"}}>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:38,height:38,borderRadius:19,background:T.gold,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <span style={{fontSize:13,marginLeft:3,color:"#fff"}}>▶</span>
                </div>
              </div>
              <div style={{position:"absolute",bottom:0,left:0,right:0,background:"linear-gradient(transparent,rgba(0,0,0,0.85))",padding:"24px 8px 8px"}}>
                <p style={{fontSize:10,fontWeight:600,color:"#fff",lineHeight:1.3,marginBottom:3}}>{r.title}</p>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.55)"}}>❤ {r.views}</span>
                  <span style={{fontSize:9,color:"rgba(255,255,255,0.55)"}}>{r.dur}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div style={{padding:"0 16px"}}>
        <h2 style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:12}}>Articles</h2>
        {ARTICLES.map(a=>(
          <Card key={a.id} style={{marginBottom:10}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{width:46,height:46,borderRadius:14,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{a.emoji}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",gap:6,marginBottom:5}}><Chip bg={T.goldPale} color={T.gold}>{a.cat}</Chip><Chip bg={T.surface} color={T.textSub}>{a.read} read</Chip></div>
                <div style={{fontSize:13,fontWeight:600,color:T.text,lineHeight:1.35,marginBottom:3}}>{a.title}</div>
                <div style={{fontSize:11,color:T.textMuted}}>{a.date}</div>
              </div>
            </div>
          </Card>
        ))}
        <h2 style={{fontSize:17,fontWeight:700,color:T.text,margin:"20px 0 12px"}}>Past Newsletters</h2>
        {[{mo:"March 2026",title:"USCIS Updates, Fee Changes & Business Compliance Alerts"},{mo:"February 2026",title:"H-1B Season & Corporate Contract Law Roundup"},{mo:"January 2026",title:"2026 Legal Outlook: Immigration, Litigation & Business Law"}].map(n=>(
          <div key={n.mo} style={{display:"flex",gap:12,alignItems:"center",padding:"12px 0",borderBottom:`1px solid ${T.border}`}}>
            <div style={{width:42,height:42,borderRadius:12,background:T.goldPale,border:`1px solid ${T.borderGold}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontSize:10,fontWeight:700,color:T.gold}}>{n.mo.slice(0,3).toUpperCase()}</span>
            </div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text,lineHeight:1.35}}>{n.title}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{n.mo}</div></div>
            <span style={{color:T.gold,fontSize:18}}>›</span>
          </div>
        ))}
        <div style={{height:80}}/>
      </div>
    </div>
  );
}

/* ── USCIS ── */
function USCISPage(){
  const [num,setNum]=useState(""); const [res,setRes]=useState(null); const [loading,setLoading]=useState(false);
  const check=()=>{if(!num.trim())return;setLoading(true);setRes(null);setTimeout(()=>{setRes({status:"Case Was Received and A Receipt Notice Was Emailed",updated:"March 18, 2026",form:"I-485",center:"Nebraska Service Center"});setLoading(false);},1400);};
  return (
    <div style={{padding:"20px 16px 100px",background:T.bg}}>
      <h1 style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:4}}>USCIS Case Status</h1>
      <p style={{fontSize:13,color:T.textSub,marginBottom:18}}>Check your immigration case in real time</p>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:11,color:T.textSub,letterSpacing:0.6,textTransform:"uppercase",marginBottom:8}}>Receipt Number</div>
        <input value={num} onChange={e=>setNum(e.target.value)} placeholder="e.g. WAC2315151234"
          style={{width:"100%",background:"rgba(0,0,0,0.04)",border:`1.5px solid ${T.border}`,borderRadius:12,padding:"13px 16px",color:T.text,fontSize:15,outline:"none",letterSpacing:2,marginBottom:12,fontFamily:"monospace"}}/>
        <GoldBtn full onPress={check}>{loading?"Checking…":"Check Status →"}</GoldBtn>
        <div style={{textAlign:"center",marginTop:10,fontSize:12,color:T.textMuted}}>Or visit <a href="https://egov.uscis.gov/casestatus/landing.do" target="_blank" rel="noreferrer" style={{color:T.gold}}>USCIS.gov ↗</a></div>
      </Card>
      {loading&&<div style={{textAlign:"center",padding:24}}><div style={{width:32,height:32,borderRadius:16,border:`3px solid ${T.gold}`,borderTopColor:"transparent",margin:"0 auto 8px",animation:"spin 0.8s linear infinite"}}/><span style={{fontSize:13,color:T.textSub}}>Checking…</span></div>}
      {res&&!loading&&(
        <Card style={{border:`1.5px solid ${T.borderGold}`,marginBottom:14}}>
          <Chip bg={T.greenBg} color={T.green}>● Status Found</Chip>
          <div style={{fontFamily:"'Libre Baskerville',serif",fontSize:15,color:T.text,lineHeight:1.5,margin:"12px 0 14px"}}>{res.status}</div>
          <Divider/><div style={{height:12}}/>
          {[["Receipt",num.toUpperCase()],["Form",res.form],["Service Center",res.center],["Updated",res.updated]].map(([l,v])=>(
            <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <span style={{fontSize:12,color:T.textSub}}>{l}</span>
              <span style={{fontSize:12,fontWeight:600,color:T.text,textAlign:"right",maxWidth:"58%"}}>{v}</span>
            </div>
          ))}
        </Card>
      )}
      <h2 style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:12}}>Receipt Number Guide</h2>
      {[["EAC","Vermont SC"],["LIN","Nebraska SC"],["SRC","Texas SC"],["WAC","California SC"],["NBC","National Benefits Center"],["IOE","Online / Electronic"]].map(([c,n])=>(
        <div key={c} style={{display:"flex",gap:12,alignItems:"center",padding:"11px 0",borderBottom:`1px solid ${T.border}`}}>
          <span style={{background:T.navy,color:"#fff",padding:"4px 10px",borderRadius:8,fontSize:11,fontWeight:700,fontFamily:"monospace"}}>{c}</span>
          <span style={{fontSize:13,color:T.text}}>{n}</span>
        </div>
      ))}
    </div>
  );
}

/* ── REGULATIONS ── */
function RegsPage(){
  return (
    <div style={{padding:"20px 16px 100px",background:T.bg}}>
      <h1 style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:4}}>Business & Regulations</h1>
      <p style={{fontSize:13,color:T.textSub,marginBottom:18}}>US regulatory resources for entrepreneurs</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        {[["🏢","LLC & Corp Formation","Entity setup & state guides"],["📜","EIN & Tax Registration","Federal and state IDs"],["🛂","Business Immigration","E-2, L-1, EB-5 visas"],["📊","Annual Compliance","Reporting & state filings"],["🤝","Contracts","Employment, vendor & NDAs"],["🔒","Intellectual Property","Trademarks & copyrights"],["⚖️","Commercial Litigation","Dispute resolution & courts"],["🏛️","Corporate Governance","Board duties & bylaws"]].map(([icon,title,desc])=>(
          <Card key={title} style={{padding:"14px 12px"}}>
            <div style={{fontSize:26,marginBottom:8}}>{icon}</div>
            <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:3}}>{title}</div>
            <div style={{fontSize:11,color:T.textSub}}>{desc}</div>
          </Card>
        ))}
      </div>
      <h2 style={{fontSize:17,fontWeight:700,color:T.text,marginBottom:12}}>Official Resources</h2>
      {[{icon:"🏛️",title:"Federal Register",sub:"Rules, regulations & executive orders",url:"https://www.federalregister.gov"},{icon:"🏦",title:"SBA – Small Business",sub:"Licensing, loans, and startup resources",url:"https://www.sba.gov"},{icon:"🇺🇸",title:"USA.gov – Start a Business",sub:"State-by-state guides",url:"https://www.usa.gov/start-business"},{icon:"💼",title:"IRS – Apply for EIN",sub:"Get your federal tax ID online",url:"https://www.irs.gov"}].map(r=>(
        <a key={r.title} href={r.url} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:10}}>
          <Card style={{display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:44,height:44,borderRadius:14,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{r.icon}</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:600,color:T.text,marginBottom:2}}>{r.title}</div><div style={{fontSize:12,color:T.textSub}}>{r.sub}</div></div>
            <span style={{color:T.gold,fontSize:18}}>↗</span>
          </Card>
        </a>
      ))}
    </div>
  );
}

/* ── CLIENT LOGIN ── */
function ClientLogin({setClient,setTab}){
  const [id,setId]=useState(""); const [pw,setPw]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  const login=()=>{
    setLoading(true);setErr("");
    setTimeout(()=>{
      // Check if matches a known client — if so, show in-app dashboard too
      const c=CLIENTS.find(c=>c.id.toLowerCase()===id.toLowerCase()||c.name.toLowerCase().includes(id.toLowerCase().trim()));
      if(c){setClient(c);setTab("dash");}
      // Always open Docketwise portal
      window.open("https://app.docketwise.com","_blank");
      setLoading(false);
    },700);
  };
  return (
    <div style={{padding:"28px 20px 100px",background:T.bg}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div style={{margin:"0 auto 14px",background:"#0D1B3E",borderRadius:16,padding:"14px 28px",display:"flex",alignItems:"center",justifyContent:"center"}}>
          
        </div>
        <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:24,color:T.text,marginBottom:4}}>Client Portal</h2>
        <p style={{fontSize:13,color:T.textSub}}>Securely access your case via Docketwise</p>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
        <div>
          <div style={{fontSize:11,color:T.textSub,letterSpacing:1,textTransform:"uppercase",marginBottom:7}}>Client ID or Name</div>
          <input value={id} onChange={e=>setId(e.target.value)} placeholder="e.g. OZ001 or your name"
            style={{width:"100%",background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"14px 16px",color:T.text,fontSize:14,outline:"none"}}/>
        </div>
        <div>
          <div style={{fontSize:11,color:T.textSub,letterSpacing:1,textTransform:"uppercase",marginBottom:7}}>Password</div>
          <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••••" onKeyDown={e=>e.key==="Enter"&&login()}
            style={{width:"100%",background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:16,padding:"14px 16px",color:T.text,fontSize:14,outline:"none"}}/>
        </div>
        {err&&<div style={{background:T.redBg,color:T.red,borderRadius:12,padding:"11px 14px",fontSize:13,border:`1px solid rgba(192,57,43,0.2)`}}>{err}</div>}
        <GoldBtn full onPress={login} style={{padding:"15px",fontSize:15,borderRadius:16}}>{loading?"Opening portal…":"Sign In → Docketwise"}</GoldBtn>
      </div>
      <div style={{padding:"14px",background:T.goldPale,borderRadius:16,border:`1px solid ${T.borderGold}`}}>
        <div style={{fontSize:10,color:T.gold,fontWeight:700,letterSpacing:0.8,marginBottom:8,textTransform:"uppercase"}}>Demo Credentials — Click to Fill</div>
        {[["OZ001","garcia2024","Maria Garcia"],["OZ002","chen2024","James Chen"],["OZ003","patel2024","Priya Patel"]].map(([did,dpw,dn])=>(
          <div key={did} onClick={()=>{setId(did);setPw(dpw);}} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:`1px solid ${T.borderGold}`,cursor:"pointer"}}>
            <span style={{fontSize:11,fontFamily:"monospace",color:T.gold,minWidth:50,fontWeight:700}}>{did}</span>
            <span style={{fontSize:11,color:T.textSub}}>{dn} · {dpw}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── CLIENT DASHBOARD ── */
function ClientDash({client,setTab}){
  const pending=TASKS.filter(t=>t.status!=="Done").length;
  const due=BILLS.filter(b=>b.status==="Due").reduce((a,b)=>a+b.amt,0);
  return (
    <div>
      {/* Navy header */}
      <div style={{background:`linear-gradient(160deg,#0D1B3E,#1D2F5A)`,padding:"18px 16px 24px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.55)",marginBottom:3}}>Good morning,</div>
            <div style={{fontSize:22,fontWeight:700,color:"#FFFFFF"}}>{client.name.split(" ")[0]} 👋</div>
          </div>
          <Avatar initials={client.avatar} size={44} gold/>
        </div>
        <div style={{background:"rgba(255,255,255,0.08)",border:"1px solid rgba(255,255,255,0.18)",borderRadius:16,padding:"14px"}}>
          <div style={{fontSize:10,color:T.gold,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>Next Action</div>
          <div style={{fontSize:14,fontWeight:600,color:"#FFFFFF"}}>{client.next}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,0.5)",marginTop:3}}>Case: {client.caseNum}</div>
        </div>
      </div>

      {/* White body */}
      <div style={{padding:"16px",background:T.bg}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
          {[{label:"Open Tasks",val:pending,color:T.gold,icon:"✅",tab:"tasks"},{label:"Amount Due",val:`$${due.toLocaleString()}`,color:T.red,icon:"💳",tab:"billing"},{label:"Matters",val:client.matters.length,color:T.blue,icon:"⚖️",tab:null},{label:"New Docs",val:"3",color:T.green,icon:"📁",tab:"docs"}].map(s=>(
            <Card key={s.label} onPress={s.tab?()=>setTab(s.tab):null} style={{borderLeft:`3px solid ${s.color}`,padding:"14px"}}>
              <div style={{fontSize:20,marginBottom:5}}>{s.icon}</div>
              <div style={{fontSize:11,color:T.textSub,marginBottom:3}}>{s.label}</div>
              <div style={{fontSize:24,fontWeight:700,color:s.color,fontFamily:"'Libre Baskerville',serif"}}>{s.val}</div>
            </Card>
          ))}
        </div>

        <h2 style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:10}}>Quick Actions</h2>
        <div style={{display:"flex",gap:8,marginBottom:18}}>
          {[["📤","Upload",()=>setTab("docs")],["💬","Ask Atty",()=>setTab("chat")],["📋","Forms",()=>setTab("forms")],["🔗","Docketwise",()=>window.open("https://app.docketwise.com","_blank")]].map(([icon,label,fn])=>(
            <button key={label} onClick={fn} style={{flex:1,background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:16,padding:"13px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
              <span style={{fontSize:20}}>{icon}</span>
              <span style={{fontSize:10,fontWeight:600,color:T.textSub}}>{label}</span>
            </button>
          ))}
        </div>

        <h2 style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:10}}>Your Matters</h2>
        {client.matters.map(m=>(
          <Card key={m} style={{marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:12,background:T.goldPale,border:`1px solid ${T.borderGold}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚖️</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text}}>{m}</div><div style={{fontSize:11,color:T.textSub,marginTop:2}}>{client.atty} · Active</div></div>
            <Chip bg={T.greenBg} color={T.green}>Active</Chip>
          </Card>
        ))}

        <Card style={{marginTop:4,background:T.goldPale,border:`1px solid ${T.borderGold}`}}>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{fontSize:26}}>🔗</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>Synced with Docketwise</div><div style={{fontSize:12,color:T.textSub}}>Tasks & deadlines update live.</div></div>
            <a href="https://app.docketwise.com" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><GoldBtn sm outline>Open ↗</GoldBtn></a>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── TASKS ── */
function TasksPage(){
  return (
    <div style={{padding:"20px 16px 100px",background:T.bg}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
        <div><h1 style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:2}}>My Tasks</h1><p style={{fontSize:13,color:T.textSub}}>Synced from Docketwise</p></div>
        <Chip bg={T.greenBg} color={T.green}>● Live</Chip>
      </div>
      {TASKS.map(t=>{
        const sc=statColor(t.status); const pc=priColor(t.pri);
        return (
          <Card key={t.id} style={{marginBottom:12,opacity:t.status==="Done"?0.5:1}}>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:34,height:34,borderRadius:10,background:sc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                {t.status==="Done"?"✓":t.status==="Progress"?"⏳":t.status==="Scheduled"?"📅":"○"}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:600,color:T.text,textDecoration:t.status==="Done"?"line-through":"none",marginBottom:4}}>{t.title}</div>
                <div style={{fontSize:12,color:T.textSub,marginBottom:8}}>Due {t.due}</div>
                <div style={{display:"flex",gap:7}}><Chip bg={sc.bg} color={sc.c}>{statLabel(t.status)}</Chip><Chip bg={pc.bg} color={pc.c}>{t.pri}</Chip></div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ── DOCS ── */
function DocsPage(){
  const [uploaded,setUploaded]=useState([]); const [scanning,setScanning]=useState(false); const fileRef=useRef();
  const existing=[{name:"Passport_Copy.pdf",size:"1.2MB",date:"Mar 1",status:"Verified"},{name:"Birth_Certificate_EN.pdf",size:"456KB",date:"Feb 28",status:"Verified"},{name:"I-94_Record.pdf",size:"89KB",date:"Feb 20",status:"Pending"}];
  const handleFiles=e=>Array.from(e.target.files).forEach(f=>setUploaded(p=>[...p,{name:f.name,size:(f.size/1024).toFixed(0)+"KB",date:"Today",status:"Uploaded"}]));
  const scan=()=>{setScanning(true);setTimeout(()=>{setUploaded(p=>[...p,{name:`Scan_${Date.now()}.pdf`,size:"234KB",date:"Today",status:"Scanned"}]);setScanning(false);},2000);};
  const stC=s=>({Verified:{bg:T.greenBg,c:T.green},Uploaded:{bg:T.blueBg,c:T.blue},Scanned:{bg:T.blueBg,c:T.blue},Pending:{bg:"rgba(234,179,8,0.1)",c:"#92700A"}}[s]||{bg:T.surface,c:T.textSub});
  return (
    <div style={{padding:"20px 16px 100px",background:T.bg}}>
      <h1 style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:4}}>Documents</h1>
      <p style={{fontSize:13,color:T.textSub,marginBottom:18}}>Upload and manage your case files</p>
      <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.png,.doc,.docx" style={{display:"none"}} onChange={handleFiles}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:18}}>
        <button onClick={()=>fileRef.current.click()} style={{background:T.bgCard,border:`2px dashed ${T.borderGold}`,borderRadius:20,padding:"22px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}}>
          <span style={{fontSize:28}}>📤</span><span style={{fontSize:13,fontWeight:600,color:T.text}}>Upload File</span><span style={{fontSize:11,color:T.textSub}}>PDF, JPG, PNG</span>
        </button>
        <button onClick={scan} style={{background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:"22px 12px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}}>
          <span style={{fontSize:28}}>{scanning?"⏳":"📷"}</span>
          <span style={{fontSize:13,fontWeight:600,color:T.text}}>{scanning?"Scanning…":"Scan Doc"}</span>
          {scanning?<div style={{width:"80%",height:3,background:T.surface,borderRadius:3}}><div style={{height:"100%",width:"60%",background:T.gold,borderRadius:3}}/></div>:<span style={{fontSize:11,color:T.textSub}}>Use camera</span>}
        </button>
      </div>
      <h2 style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:12}}>All Files ({existing.length+uploaded.length})</h2>
      {[...existing,...uploaded].map((d,i)=>{
        const sc=stC(d.status);
        return (
          <Card key={i} style={{marginBottom:10,display:"flex",gap:12,alignItems:"center"}}>
            <div style={{width:38,height:38,borderRadius:12,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>📄</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:2}}>{d.name}</div><div style={{fontSize:11,color:T.textSub}}>{d.size} · {d.date}</div></div>
            <Chip bg={sc.bg} color={sc.c}>{d.status}</Chip>
          </Card>
        );
      })}
    </div>
  );
}

/* ── FORMS ── */
function FormsPage(){
  const [sel,setSel]=useState(null); const [data,setData]=useState({}); const [done,setDone]=useState(false);
  const forms=[
    {id:"i485",  title:"Form I-485",          sub:"Adjustment of Status",          fields:["Full Legal Name","Date of Birth","Country of Birth","A-Number","Current Address","Phone Number","Date of Last Entry","Class of Admission"]},
    {id:"i131",  title:"Form I-131",          sub:"Travel Document",               fields:["Full Legal Name","Date of Birth","Reason for Travel","Document Type","Departure Date","Return Date"]},
    {id:"g1145", title:"Form G-1145",         sub:"E-Notification of Acceptance",  fields:["Email Address","Phone Number","Preferred Contact"]},
    {id:"biz01", title:"Business Intake",     sub:"New Business Client Form",      fields:["Business Name","Entity Type","State of Formation","EIN (if existing)","Primary Contact","Business Address","Nature of Legal Matter","Urgency Level"]},
    {id:"lit01", title:"Litigation Intake",   sub:"Civil Dispute Assessment",      fields:["Full Legal Name","Opposing Party","Court / Jurisdiction","Case Number (if any)","Brief Description of Dispute","Desired Outcome","Key Dates","Supporting Documents Available"]},
    {id:"cont01",title:"Contract Review",     sub:"Agreement Review Request",      fields:["Client Name","Contract Type","Counterparty Name","Contract Value","Signing Deadline","Key Concerns","Governing Law State","Attached Contract File Name"]},
  ];
  if(done)return(
    <div style={{padding:"60px 20px",textAlign:"center",background:T.bg}}>
      <div style={{fontSize:52,marginBottom:14}}>✅</div>
      <h2 style={{fontFamily:"'Libre Baskerville',serif",fontSize:22,color:T.text,marginBottom:8}}>Submitted!</h2>
      <p style={{fontSize:14,color:T.textSub,marginBottom:24}}>Your form has been sent to your attorney for review.</p>
      <GoldBtn onPress={()=>{setDone(false);setSel(null);setData({})}}>Submit Another</GoldBtn>
    </div>
  );
  if(sel)return(
    <div style={{padding:"20px 16px 100px",background:T.bg}}>
      <button onClick={()=>{setSel(null);setData({})}} style={{display:"flex",alignItems:"center",gap:5,color:T.gold,fontSize:14,marginBottom:18,fontWeight:600}}>‹ Back</button>
      <h2 style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:2}}>{sel.title}</h2>
      <p style={{fontSize:13,color:T.textSub,marginBottom:20}}>{sel.sub}</p>
      {sel.fields.map(f=>(
        <div key={f} style={{marginBottom:14}}>
          <div style={{fontSize:11,color:T.textSub,letterSpacing:0.5,marginBottom:6,textTransform:"uppercase"}}>{f}</div>
          <input value={data[f]||""} onChange={e=>setData(p=>({...p,[f]:e.target.value}))} style={{width:"100%",background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"13px 16px",color:T.text,fontSize:14,outline:"none"}}/>
        </div>
      ))}
      <GoldBtn full onPress={()=>setDone(true)} style={{marginTop:8}}>Submit to Attorney →</GoldBtn>
    </div>
  );
  return(
    <div style={{padding:"20px 16px 100px",background:T.bg}}>
      <h1 style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:4}}>Legal Forms</h1>
      <p style={{fontSize:13,color:T.textSub,marginBottom:18}}>Immigration, business & litigation intake forms</p>
      {forms.map(f=>(
        <Card key={f.id} onPress={()=>setSel(f)} style={{marginBottom:12,display:"flex",gap:14,alignItems:"center"}}>
          <div style={{width:44,height:44,borderRadius:14,background:T.surface,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📋</div>
          <div style={{flex:1}}><div style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:2}}>{f.title}</div><div style={{fontSize:12,color:T.textSub}}>{f.sub}</div></div>
          <span style={{color:T.gold,fontSize:20}}>›</span>
        </Card>
      ))}
    </div>
  );
}

/* ── ASK ATTORNEY (AI CHAT) ── */
function ChatPage({client}){
  const [msgs,setMsgs]=useState([{role:"assistant",content:`Hello ${client.name.split(" ")[0]}! I'm the Ozek Law AI Assistant. I can answer general immigration questions. For case-specific advice, ${client.atty} is always available. How can I help you?`}]);
  const [input,setInput]=useState(""); const [loading,setLoading]=useState(false); const bottomRef=useRef();
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=useCallback(async()=>{
    if(!input.trim()||loading)return;
    const userMsg={role:"user",content:input}; const history=[...msgs,userMsg];
    setMsgs(history); setInput(""); setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          system:`You are a helpful legal assistant for Ozek Law, a full-service immigration, business law, litigation, and corporate counsel firm. Client: ${client.name}, case ${client.caseNum}, represented by ${client.atty}. Be professional, warm, concise (under 120 words). Never give specific legal advice — refer to their attorney for case specifics. Cover immigration, business formation, contracts, litigation, and corporate matters.`,
          messages:history.map(m=>({role:m.role,content:m.content}))})});
      const d=await res.json();
      setMsgs(p=>[...p,{role:"assistant",content:d.content?.[0]?.text||"Please contact your attorney directly."}]);
    }catch{setMsgs(p=>[...p,{role:"assistant",content:"Connection error. Email info@ozeklaw.com"}]);}
    setLoading(false);
  },[input,loading,msgs,client]);
  const quickQ=["How long does I-485 take?","What's the LLC formation process?","How does litigation work?","What is a breach of contract?"];
  return (
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)",padding:"14px 14px 0",background:T.bg}}>
      <div style={{marginBottom:10}}><h1 style={{fontSize:20,fontWeight:700,color:T.text,marginBottom:1}}>Ask Attorney</h1><p style={{fontSize:11,color:T.textSub}}>AI Assistant · Ozek Law</p></div>
      <div style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",gap:10,paddingBottom:6}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"82%",padding:"11px 14px",borderRadius:18,fontSize:14,lineHeight:1.6,
              background:m.role==="user"?T.gold:T.bgCard,
              color:m.role==="user"?"#FFFFFF":T.text,
              border:m.role==="assistant"?`1px solid ${T.border}`:"none",
              borderBottomRightRadius:m.role==="user"?4:18,
              borderBottomLeftRadius:m.role==="assistant"?4:18,
              fontWeight:m.role==="user"?500:400}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:5,padding:"12px 14px",background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:18,borderBottomLeftRadius:4,width:68}}>{[0,1,2].map(i=><div key={i} style={{width:6,height:6,background:T.textMuted,borderRadius:"50%",animation:`bounce2 1s ${i*0.18}s ease-in-out infinite`}}/>)}</div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{paddingTop:8,paddingBottom:14}}>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8}}>
          {quickQ.map(q=><button key={q} onClick={()=>setInput(q)} style={{flexShrink:0,background:T.bgCard,border:`1px solid ${T.border}`,borderRadius:20,padding:"7px 12px",fontSize:11,color:T.textSub,cursor:"pointer",whiteSpace:"nowrap"}}>{q}</button>)}
        </div>
        <div style={{display:"flex",gap:8}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask a legal question…"
            style={{flex:1,background:T.bgCard,border:`1.5px solid ${T.border}`,borderRadius:14,padding:"12px 16px",color:T.text,fontSize:14,outline:"none"}}/>
          <GoldBtn onPress={send} style={{borderRadius:14,padding:"12px 16px"}}>→</GoldBtn>
        </div>
      </div>
    </div>
  );
}

/* ── BILLING ── */
function BillingPage(){
  const due=BILLS.filter(b=>b.status==="Due").reduce((a,b)=>a+b.amt,0);
  const paid=BILLS.filter(b=>b.status==="Paid").reduce((a,b)=>a+b.amt,0);
  const stC={Paid:{bg:T.greenBg,c:T.green},Due:{bg:T.redBg,c:T.red},Soon:{bg:T.blueBg,c:T.blue}};
  return(
    <div style={{padding:"20px 16px 100px",background:T.bg}}>
      <h1 style={{fontSize:22,fontWeight:700,color:T.text,marginBottom:4}}>Billing</h1>
      <p style={{fontSize:13,color:T.textSub,marginBottom:18}}>Account summary and invoices</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        <Card style={{borderTop:`3px solid ${T.red}`,padding:"14px"}}><div style={{fontSize:11,color:T.textSub,marginBottom:4}}>Amount Due</div><div style={{fontSize:26,fontWeight:700,color:T.red,fontFamily:"'Libre Baskerville',serif"}}>${due.toLocaleString()}</div></Card>
        <Card style={{borderTop:`3px solid ${T.green}`,padding:"14px"}}><div style={{fontSize:11,color:T.textSub,marginBottom:4}}>Paid (2026)</div><div style={{fontSize:26,fontWeight:700,color:T.green,fontFamily:"'Libre Baskerville',serif"}}>${paid.toLocaleString()}</div></Card>
      </div>
      {due>0&&(
        <div style={{background:T.redBg,border:`1px solid rgba(192,57,43,0.2)`,borderRadius:18,padding:"14px",marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
            <div><div style={{fontSize:14,fontWeight:700,color:T.red,marginBottom:3}}>Payment Required</div><div style={{fontSize:12,color:T.textSub}}>billing@ozeklaw.com</div></div>
            <GoldBtn onPress={()=>alert("Call (555) 200-1000 or email billing@ozeklaw.com")} sm style={{background:T.red,color:"#fff",borderRadius:10}}>Pay Now</GoldBtn>
          </div>
        </div>
      )}
      <h2 style={{fontSize:15,fontWeight:700,color:T.text,marginBottom:12}}>Invoices</h2>
      {BILLS.map((b,i)=>{
        const sc=stC[b.status]||{bg:T.surface,c:T.textSub};
        return(
          <Card key={i} style={{marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div><div style={{fontSize:13,fontWeight:700,color:T.text}}>{b.id}</div><div style={{fontSize:11,color:T.textMuted,marginTop:2}}>{b.date}</div></div>
              <Chip bg={sc.bg} color={sc.c}>{b.status}</Chip>
            </div>
            <div style={{fontSize:13,color:T.textSub,marginBottom:10}}>{b.desc}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:20,fontWeight:700,color:b.status==="Due"?T.red:T.text,fontFamily:"'Libre Baskerville',serif"}}>${b.amt.toLocaleString()}</span>
              <GoldBtn sm outline onPress={()=>{}}>View</GoldBtn>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

/* ── APP SHELL ── */
export default function App(){
  const [tab,setTab]=useState("home");
  const [client,setClient]=useState(null);
  const isClient=!!client&&["dash","tasks","docs","forms","chat","billing"].includes(tab);

  return(
    <>
      <style>{FONTS}{css}</style>
      <div style={{minHeight:"100vh",background:"#DDD9D0",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 0 48px"}}>
        {/* Phone frame */}
        <div style={{width:"100%",maxWidth:390,background:T.bg,borderRadius:52,overflow:"hidden",boxShadow:"0 0 0 10px #C8C4BC, 0 0 0 11px #B8B4AC, 0 32px 80px rgba(0,0,0,0.25), 0 8px 24px rgba(0,0,0,0.12)",display:"flex",flexDirection:"column",minHeight:"88vh",position:"relative"}}>

          {/* Dynamic Island notch */}
          <div style={{background:T.bg,display:"flex",justifyContent:"center",padding:"12px 0 2px"}}>
            <div style={{width:120,height:34,background:"#1C1A17",borderRadius:20}}/>
          </div>

          <StatusBar/>

          {/* Signed-in client strip */}
          {client&&isClient&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"4px 16px 0",borderBottom:`1px solid ${T.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <Avatar initials={client.avatar} size={22} gold/>
                <span style={{fontSize:11,color:T.textSub}}>{client.name} · {client.caseNum}</span>
              </div>
              <button onClick={()=>{setClient(null);setTab("home");}} style={{fontSize:11,color:T.textMuted,padding:"4px 0"}}>Sign Out</button>
            </div>
          )}

          {/* Screen content */}
          <div style={{flex:1,overflowY:"auto"}}>
            <div className="fade-in" key={tab}>
              {!client&&tab==="home"   &&<PublicHome setTab={setTab}/>}
              {!client&&tab==="news"   &&<NewsPage/>}
              {!client&&tab==="uscis"  &&<USCISPage/>}
              {!client&&tab==="regs"   &&<RegsPage/>}
              {tab==="portal"&&!client &&<ClientLogin setClient={setClient} setTab={setTab}/>}
              {client&&tab==="dash"    &&<ClientDash client={client} setTab={setTab}/>}
              {client&&tab==="tasks"   &&<TasksPage/>}
              {client&&tab==="docs"    &&<DocsPage/>}
              {client&&tab==="forms"   &&<FormsPage/>}
              {client&&tab==="chat"    &&<ChatPage client={client}/>}
              {client&&tab==="billing" &&<BillingPage/>}
            </div>
          </div>

          <BottomNav tab={tab} setTab={setTab} isClient={isClient}/>

          {/* Home indicator */}
          <div style={{display:"flex",justifyContent:"center",padding:"6px 0 10px",background:T.bg}}>
            <div style={{width:110,height:4,background:"rgba(0,0,0,0.15)",borderRadius:2}}/>
          </div>
        </div>
      </div>
    </>
  );
}
