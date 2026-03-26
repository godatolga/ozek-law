import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600;1,700&family=Noto+Sans+Arabic:wght@300;400;600;700&family=Noto+Sans+SC:wght@300;400;700&display=swap');
`;

const C = {
  bg0:"#080F1E", bg1:"#0D1628", bg2:"#111D33", bg3:"rgba(255,255,255,0.96)", bgCard:"rgba(255,255,255,0.07)",
  gold:"#C9A84C", goldHi:"#E8C96A", goldDim:"#9A7A2E", goldGlow:"rgba(201,168,76,0.22)", goldPale:"rgba(201,168,76,0.10)", goldBorder:"rgba(201,168,76,0.28)",
  hi:"#FFFFFF", md:"rgba(255,255,255,0.65)", lo:"rgba(255,255,255,0.32)", ink:"#0F1923", inkMd:"#3D4A5C", inkLo:"#8492A6",
  green:"#30D158", greenBg:"rgba(48,209,88,0.12)", red:"#FF453A", redBg:"rgba(255,69,58,0.12)", blue:"#0A84FF", blueBg:"rgba(10,132,255,0.12)",
  amber:"#FFD60A", amberBg:"rgba(255,214,10,0.10)", purple:"#BF5AF2", purpleBg:"rgba(191,90,242,0.10)",
  lineHi:"rgba(255,255,255,0.14)", lineLo:"rgba(255,255,255,0.06)", inkLine:"rgba(0,0,0,0.07)",
};

const css = `
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
html,body{height:100%;width:100%;overflow:hidden}
body{font-family:'Inter',system-ui,sans-serif;color:#FFF;background:#080F1E;overscroll-behavior:none;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{display:none}
input,textarea,button,select{font-family:inherit}
button{cursor:pointer;border:none;background:none}
select{appearance:none;-webkit-appearance:none}
a{-webkit-user-select:none;user-select:none}
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
@keyframes popIn{0%{opacity:0;transform:scale(0.85) translateY(12px)}100%{opacity:1;transform:scale(1) translateY(0)}}
.page-enter{animation:fadeUp 0.38s cubic-bezier(0.22,1,0.36,1) both}
.tab-bar{background:rgba(8,15,30,0.88);backdrop-filter:blur(40px) saturate(200%);-webkit-backdrop-filter:blur(40px) saturate(200%);border-top:1px solid rgba(255,255,255,0.09)}
.tap{transition:transform 0.13s cubic-bezier(0.34,1.2,0.64,1)}.tap:active{transform:scale(0.95)}
.modal-enter{animation:slideUp 0.32s cubic-bezier(0.22,1,0.36,1) both}
.pop-in{animation:popIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both}
.field{width:100%;background:rgba(255,255,255,0.07);border:1.5px solid rgba(255,255,255,0.10);border-radius:16px;padding:14px 16px;color:#FFF;font-size:15px;outline:none;transition:border-color 0.2s}
.field::placeholder{color:rgba(255,255,255,0.32)}.field:focus{border-color:rgba(201,168,76,0.45)}
[dir="rtl"]{font-family:'Noto Sans Arabic','Inter',sans-serif}
.lang-zh{font-family:'Noto Sans SC','Inter',sans-serif}
@keyframes fogIn{0%{opacity:0;filter:blur(40px);transform:scale(1.15)}60%{opacity:1;filter:blur(6px);transform:scale(1.02)}100%{opacity:1;filter:blur(0px);transform:scale(1)}}
@keyframes fogOut{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.98)}}
@keyframes ringExpand{0%{transform:scale(0.4);opacity:0.9}100%{transform:scale(2.8);opacity:0}}
@keyframes particleDrift{0%{transform:translateY(0) translateX(0);opacity:0}20%{opacity:0.7}80%{opacity:0.2}100%{transform:translateY(-100px) translateX(var(--dx,0px));opacity:0}}
@keyframes glowPulse{0%,100%{opacity:0.15}50%{opacity:0.4}}
`;

const LANGS={en:{code:"en",label:"EN",name:"English",dir:"ltr"},tr:{code:"tr",label:"TR",name:"Türkçe",dir:"ltr"},ar:{code:"ar",label:"عر",name:"العربية",dir:"rtl"},es:{code:"es",label:"ES",name:"Español",dir:"ltr"},ru:{code:"ru",label:"РУ",name:"Русский",dir:"ltr"},zh:{code:"zh",label:"中文",name:"中文",dir:"ltr"}};

const EN={
  tagline:"Immigration · Business · Litigation",heroTitle:"Your Path to",heroEm:"Legal Clarity",
  heroSub:"Immigration, business law, litigation, and corporate counsel — a full-service firm guiding individuals and companies through every legal challenge.",
  clientLogin:"Client Login",scheduleNow:"Schedule Now",consultation:"Consultation",
  practiceAreas:"Practice Areas",latestUpdates:"Latest Insights",seeAll:"See all →",
  home:"Home",news:"News",uscis:"USCIS",rules:"Rules",portal:"Portal",
  dash:"Home",tasks:"Tasks",docs:"Docs",forms:"Forms",ask:"Ask",bills:"Bills",team:"Team",
  newsTitle:"News & Updates",newsSub:"Immigration, business law & litigation insights",
  newsletter:"Weekly Newsletter",newsletterSub:"Policy updates & case law alerts",
  emailPlaceholder:"your@email.com",joinBtn:"Join",subscribed:"✓ Subscribed!",
  articles:"Articles",visaBulletin:"Visa Bulletin",visaBulletinSub:"Monthly DOS visa availability updates",
  uscisTitle:"USCIS Case Status",uscisSub:"Track your immigration case in real time",
  receiptNumber:"Receipt Number",receiptPlaceholder:"e.g. WAC2315151234",
  checkStatus:"Check Status",checking:"Checking…",orVisit:"Or visit",statusFound:"Status Found",receiptGuide:"Receipt Prefix Guide",
  processingTimesTitle:"Processing Times",selectForm:"Select Form",viewTimes:"View Official Times ↗",
  regsTitle:"Business & Regulations",regsSub:"Resources for entrepreneurs & businesses",
  clientAlerts:"Client Alerts",practiceAreasTitle:"Practice Area Articles",
  portalTitle:"Client Portal",portalSub:"Secure access via Docketwise",clientIdLabel:"Client ID",clientIdPlaceholder:"e.g. OZ001",
  passwordLabel:"Password",passwordPlaceholder:"••••••••",signIn:"Sign In → Docketwise",signingIn:"Opening portal…",incorrectCreds:"Incorrect ID or password",
  goodMorning:"Good morning,",nextAction:"Next Action",openTasks:"Open Tasks",amountDue:"Amount Due",matters:"Matters",newDocs:"New Docs",
  quickActions:"Quick Actions",upload:"Upload",askAtty:"Ask Atty",formsLabel:"Forms",docketwise:"Docketwise",
  yourMatters:"Your Matters",syncedWith:"Synced with Docketwise",syncedSub:"Tasks & deadlines update live.",open:"Open ↗",activeMatter:"Active",
  myTasks:"My Tasks",syncedFrom:"Synced from Docketwise",live:"Live",
  documents:"Documents",docsSub:"Upload and manage your case files",uploadFile:"Upload",pdfTypes:"PDF · JPG · PNG",scanDoc:"Scan",useCamera:"Use camera",scanning:"Scanning…",allFiles:"All Files",
  legalForms:"Legal Forms",formsSub:"Immigration, business & litigation forms",submitToAtty:"Submit to Attorney",submitted:"Submitted!",submittedSub:"Your form has been sent to your attorney for review.",submitAnother:"Submit Another",back:"Back",
  askAttorney:"Ask Atty. Tolga Ozek",askSub:"Messages sent directly via WhatsApp",askPlaceholder:"Type your legal question…",sendBtn:"Send",whatsappSent:"Opening WhatsApp for Atty. Tolga Ozek…",
  billing:"Billing",billingSub:"Account summary & invoices",paymentRequired:"Payment Required",payNow:"Pay Now",invoices:"Invoices",signOut:"Sign Out",
  quickQ:["How long does I-485 take?","How do I form an LLC?","How does litigation work?","What is breach of contract?"],
  practiceList:[{icon:"🛂",title:"Immigration",sub:"Visas & Green Cards"},{icon:"⚖️",title:"Litigation",sub:"Courts & Disputes"},{icon:"🏢",title:"Business Law",sub:"Formation & Compliance"},{icon:"📑",title:"Corporate",sub:"Contracts & Transactions"},{icon:"🛡️",title:"Removal Defense",sub:"Appeals & Hearings"},{icon:"🤝",title:"Asylum",sub:"Humanitarian Relief"}],
  statLabels:{Done:"Done",Pending:"Pending",Progress:"In Progress",Scheduled:"Scheduled"},
};
const I18N={
  en:EN,
  ar:Object.assign({},EN,{tagline:"هجرة · أعمال · تقاضٍ",heroTitle:"طريقك إلى",heroEm:"الوضوح القانوني",heroSub:"هجرة، قانون أعمال، تقاضٍ — مكتب متكامل.",clientLogin:"بوابة العملاء",scheduleNow:"احجز الآن",home:"الرئيسية",news:"الأخبار",portal:"البوابة",dash:"الرئيسية",tasks:"المهام",docs:"المستندات",forms:"النماذج",ask:"اسأل",bills:"الفواتير",signOut:"خروج",goodMorning:"صباح الخير،",signIn:"تسجيل الدخول",back:"رجوع",billing:"الفواتير",practiceList:[{icon:"🛂",title:"الهجرة",sub:"تأشيرات"},{icon:"⚖️",title:"التقاضي",sub:"المحاكم"},{icon:"🏢",title:"قانون الأعمال",sub:"التأسيس"},{icon:"📑",title:"الشركات",sub:"العقود"},{icon:"🛡️",title:"الدفاع",sub:"الاستئنافات"},{icon:"🤝",title:"اللجوء",sub:"إنساني"}],statLabels:{Done:"مكتمل",Pending:"معلّق",Progress:"قيد التنفيذ",Scheduled:"مجدول"}}),
  tr:Object.assign({},EN,{tagline:"Göçmenlik · İş · Dava",heroTitle:"Hukuki Netliğe",heroEm:"Giden Yolunuz",home:"Ana",news:"Haberler",portal:"Portal",dash:"Ana",tasks:"Görevler",docs:"Belgeler",forms:"Formlar",ask:"Sor",bills:"Faturalar",signOut:"Çıkış",team:"Ekibimiz",goodMorning:"Günaydın,",signIn:"Giriş Yap",back:"Geri",billing:"Faturalar",practiceList:[{icon:"🛂",title:"Göçmenlik",sub:"Vize"},{icon:"⚖️",title:"Dava",sub:"Mahkemeler"},{icon:"🏢",title:"Şirketler Hukuku",sub:"Kuruluş ve Uyum"},{icon:"📑",title:"Kurumsal",sub:"Sözleşmeler"},{icon:"🛡️",title:"Sınır Dışı Etme Savunması",sub:"İtirazlar"},{icon:"🤝",title:"İltica",sub:"İnsani Yardım"}],statLabels:{Done:"Tamamlandı",Pending:"Bekliyor",Progress:"Devam Ediyor",Scheduled:"Planlandı"}}),
  es:Object.assign({},EN,{tagline:"Inmigración · Negocios · Litigios",heroTitle:"Su Camino hacia la",heroEm:"Claridad Legal",home:"Inicio",news:"Noticias",portal:"Portal",dash:"Inicio",tasks:"Tareas",docs:"Docs",forms:"Formularios",ask:"Preguntar",bills:"Facturas",signOut:"Salir",goodMorning:"Buenos días,",signIn:"Iniciar Sesión",back:"Volver",billing:"Facturación",practiceList:[{icon:"🛂",title:"Inmigración",sub:"Visas"},{icon:"⚖️",title:"Litigios",sub:"Tribunales"},{icon:"🏢",title:"Empresarial",sub:"Constitución"},{icon:"📑",title:"Corporativo",sub:"Contratos"},{icon:"🛡️",title:"Deportación",sub:"Apelaciones"},{icon:"🤝",title:"Asilo",sub:"Humanitario"}],statLabels:{Done:"Completado",Pending:"Pendiente",Progress:"En Progreso",Scheduled:"Programado"}}),
  ru:Object.assign({},EN,{tagline:"Иммиграция · Бизнес · Суд",heroTitle:"Ваш путь к",heroEm:"правовой ясности",home:"Главная",news:"Новости",portal:"Портал",dash:"Главная",tasks:"Задачи",docs:"Документы",forms:"Формы",ask:"Вопрос",bills:"Счета",signOut:"Выйти",goodMorning:"Доброе утро,",signIn:"Войти",back:"Назад",billing:"Счета",practiceList:[{icon:"🛂",title:"Иммиграция",sub:"Визы"},{icon:"⚖️",title:"Суд",sub:"Споры"},{icon:"🏢",title:"Корпоративное",sub:"Регистрация"},{icon:"📑",title:"Контракты",sub:"Сделки"},{icon:"🛡️",title:"Депортация",sub:"Защита"},{icon:"🤝",title:"Убежище",sub:"Гуманитарное"}],statLabels:{Done:"Завершено",Pending:"Ожидает",Progress:"В процессе",Scheduled:"Запланировано"}}),
  zh:Object.assign({},EN,{tagline:"移民 · 商业 · 诉讼",heroTitle:"通往",heroEm:"法律清晰之路",home:"首页",news:"新闻",portal:"门户",dash:"首页",tasks:"任务",docs:"文件",forms:"表格",ask:"提问",bills:"账单",signOut:"退出",goodMorning:"早上好，",signIn:"登录",back:"返回",billing:"账单",practiceList:[{icon:"🛂",title:"移民",sub:"签证"},{icon:"⚖️",title:"诉讼",sub:"法院"},{icon:"🏢",title:"商业法",sub:"成立"},{icon:"📑",title:"企业",sub:"合同"},{icon:"🛡️",title:"驱逐辩护",sub:"上诉"},{icon:"🤝",title:"庇护",sub:"人道"}],statLabels:{Done:"已完成",Pending:"待处理",Progress:"进行中",Scheduled:"已安排"}}),
};

const USCIS_FORMS=["I-90","I-130","I-131","I-140","I-485","I-526","I-539","I-589","I-601A","I-751","I-765","I-821","I-821D","N-400","N-565","N-600"];
const CLIENTS=[
  {id:"OZ001",name:"Maria Garcia",pass:"garcia2024",caseNum:"WAC2315151234",matters:["Family-Based I-130","I-485 Adjustment"],atty:"Tolga Ozek",avatar:"MG",next:"Apr 10 – Submit I-485 Docs"},
  {id:"OZ002",name:"James Chen",pass:"chen2024",caseNum:"EAC2309874321",matters:["EB-2 NIW","I-140 Petition"],atty:"Tolga Ozek",avatar:"JC",next:"Apr 5 – Medical Exam"},
  {id:"OZ003",name:"Priya Patel",pass:"patel2024",caseNum:"SRC2312345678",matters:["H-1B Extension","H-4 Dependent"],atty:"Tolga Ozek",avatar:"PP",next:"Apr 20 – Biometrics"},
  {id:"OZ004",name:"Nexus Corp LLC",pass:"nexus2024",caseNum:"BIZ2316001234",matters:["Commercial Litigation","Contract Review"],atty:"Tolga Ozek",avatar:"NC",next:"Apr 12 – Deposition Prep"},
];
const TASKS=[
  {id:1,title:"Submit I-485 Supporting Documents",due:"Apr 10, 2026",status:"Pending",pri:"High"},
  {id:2,title:"Medical Exam (Form I-693)",due:"Apr 5, 2026",status:"Progress",pri:"High"},
  {id:3,title:"Sign Retainer Agreement",due:"Mar 28, 2026",status:"Done",pri:"Low"},
  {id:4,title:"Provide Birth Certificate",due:"Apr 15, 2026",status:"Pending",pri:"Med"},
  {id:5,title:"Biometrics Appointment",due:"Apr 20, 2026",status:"Scheduled",pri:"Med"},
];
const BILLS=[
  {id:"INV-089",date:"Mar 1",desc:"Legal Services – Feb 2026",amt:2800,status:"Paid"},
  {id:"INV-090",date:"Mar 15",desc:"USCIS Filing Fees – I-485",amt:1440,status:"Due"},
  {id:"INV-091",date:"Apr 1",desc:"Legal Services – Mar 2026",amt:2800,status:"Soon"},
];
const ARTICLES_META=[{emoji:"📋",cat:"Immigration",read:"3 min"},{emoji:"🏢",cat:"Work Visas",read:"5 min"},{emoji:"⚖️",cat:"Litigation",read:"5 min"},{emoji:"📊",cat:"Business Law",read:"4 min"},{emoji:"🛡️",cat:"Policy",read:"4 min"},{emoji:"📑",cat:"Corporate",read:"6 min"}];
const ARTICLE_TITLES={en:["New USCIS Fee Schedule 2026","H-1B Cap Season: Full Breakdown","Commercial Litigation: What to Expect","LLC vs S-Corp: Which Is Right?","DACA: Recent Court Decisions","Contract Disputes & Breach"],tr:["USCIS Tarifesi","H-1B Sezonu","Ticari Dava","LLC mi S-Corp mi?","DACA","Sözleşme"],ar:["جدول رسوم USCIS","موسم H-1B","التقاضي التجاري","LLC مقابل S-Corp","DACA","نزاعات العقود"],es:["Arancel USCIS 2026","Temporada H-1B","Litigio Comercial","LLC vs S-Corp","DACA","Disputas"],ru:["Тариф USCIS 2026","Сезон H-1B","Коммерческий спор","LLC или S-Corp","DACA","Нарушение договора"],zh:["USCIS新费用","H-1B配额季","商业诉讼","LLC还是S-Corp","DACA裁决","合同纠纷"]};
const CLIENT_ALERTS=[
  {emoji:"⚠️",tag:"ALERT",color:C.red,tagBg:C.redBg,date:"Mar 2026",title:"Corporate Transparency Act – BOI Deadline",body:"FinCEN BOI reporting now required for most LLCs and corporations."},
  {emoji:"🏛️",tag:"UPDATE",color:C.blue,tagBg:C.blueBg,date:"Mar 2026",title:"USCIS Fee Increases – April 1, 2026",body:"New fees for I-485, I-130, I-140. Review your case timeline."},
  {emoji:"📑",tag:"ALERT",color:C.amber,tagBg:C.amberBg,date:"Feb 2026",title:"New Employment Contract Rules – CA, NY, IL",body:"Non-compete and arbitration clause changes now in effect."},
  {emoji:"🛡️",tag:"POLICY",color:C.purple,tagBg:C.purpleBg,date:"Feb 2026",title:"H-1B Cap Registration Window: Mar 7–21",body:"Employers must register during the designated window."},
];
const PRACTICE_ARTICLES=[
  {emoji:"🛂",cat:"Immigration",title:"Complete Guide to the I-485 Adjustment of Status Process"},
  {emoji:"🏢",cat:"Business Law",title:"LLC vs S-Corp: Choosing the Right Entity for Your Business"},
  {emoji:"⚖️",cat:"Litigation",title:"What to Expect in Commercial Litigation: Step-by-Step"},
  {emoji:"📑",cat:"Corporate",title:"Essential Clauses Every Business Contract Must Include"},
  {emoji:"🛡️",cat:"Removal Defense",title:"Cancellation of Removal: Eligibility and Strategy"},
  {emoji:"🤝",cat:"Asylum",title:"Asylum Application Process: Timeline, Evidence & Tips"},
];
const TIMELINE=[
  {step:"Retainer Signed",date:"Mar 1",icon:"✍️",done:true},
  {step:"Documents Collected",date:"Mar 10",icon:"📄",done:true},
  {step:"Petition Filed",date:"Mar 20",icon:"📬",done:true},
  {step:"USCIS Receipt",date:"Mar 25",icon:"📋",done:false,active:true},
  {step:"Biometrics",date:"Apr 20",icon:"👆",done:false},
  {step:"Interview",date:"May 15",icon:"🏛️",done:false},
  {step:"Decision",date:"Jun 2026",icon:"⚖️",done:false},
];
const TEAM=[
  {name:"Tolga Ozek",role:"Managing Attorney",wa:"+12023047872",photo:"https://ozeklaw.com/wp-content/uploads/2026/03/ChatGPT-Image-Mar-15-2026-at-01_53_25-PM-e1773597506924.png"},
  {name:"Gizem Ersahin",role:"Attorney",wa:"+12027534306",photo:"https://ozeklaw.com/wp-content/uploads/2026/03/ChatGPT-Image-Mar-15-2026-at-01_54_00-PM-e1773597532429.png"},
  {name:"Ecem Mistikoglu",role:"Legal Associate",wa:"+12402344444",photo:"https://ozeklaw.com/wp-content/uploads/2026/03/ChatGPT-Image-Mar-15-2026-at-01_22_04-PM.png"},
  {name:"Ofeliya Ahmadzada",role:"Legal Associate",wa:"+12028711621",photo:"https://ozeklaw.com/wp-content/uploads/2026/03/ChatGPT-Image-Mar-15-2026-at-01_20_59-PM.png"},
];

const priColor=p=>({High:{bg:C.redBg,c:C.red},Med:{bg:C.amberBg,c:"#B8860B"},Low:{bg:C.greenBg,c:C.green}}[p]||{bg:"rgba(255,255,255,0.08)",c:C.md});
const statColor=s=>({Done:{bg:C.greenBg,c:C.green},Pending:{bg:C.amberBg,c:"#B8860B"},Progress:{bg:C.blueBg,c:C.blue},Scheduled:{bg:C.purpleBg,c:C.purple}}[s]||{bg:"rgba(255,255,255,0.08)",c:C.md});

function Badge({children,color,bg,small}){return <span style={{display:"inline-flex",alignItems:"center",background:bg||"rgba(255,255,255,0.10)",color:color||C.md,fontSize:small?9:10,fontWeight:600,padding:small?"2px 7px":"3px 10px",borderRadius:99,letterSpacing:0.3,whiteSpace:"nowrap"}}>{children}</span>;}
function Divider({light}){return <div style={{height:"1px",background:light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}}/>;}
function Avatar({initials,size=40,gold=false}){return <div style={{width:size,height:size,borderRadius:size/2,flexShrink:0,background:gold?C.gold:"rgba(201,168,76,0.16)",border:gold?"none":"1px solid rgba(201,168,76,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.33,fontWeight:700,color:gold?"#0F1923":C.gold}}>{initials}</div>;}

function GoldBtn({children,onPress,full,sm,outline,style={}}){
  const[p,setP]=useState(false);
  return <button onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)} onTouchStart={()=>setP(true)} onTouchEnd={()=>setP(false)} onClick={onPress} style={{background:outline?"rgba(201,168,76,0.12)":C.gold,border:outline?"1.5px solid rgba(201,168,76,0.40)":"none",color:outline?C.gold:"#0F1923",borderRadius:sm?12:16,padding:sm?"9px 18px":"15px 24px",fontSize:sm?13:15,fontWeight:700,width:full?"100%":"auto",transform:p?"scale(0.97)":"scale(1)",transition:"all 0.14s",display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:outline?"none":`0 4px 18px ${C.goldGlow}`,letterSpacing:0.2,...style}}>{children}</button>;
}

function BookingModal({onClose}){
  const[selDay,setSelDay]=useState(null);
  const[selTime,setSelTime]=useState(null);
  const[done,setDone]=useState(false);
  const today=new Date();
  const days=useMemo(()=>Array.from({length:18},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()+i+1);const wd=d.getDay();return{date:d,label:d.toLocaleDateString("en-US",{weekday:"short"}),num:d.getDate(),month:d.toLocaleDateString("en-US",{month:"short"}),disabled:wd===0||wd===6};}).filter(d=>!d.disabled),[]);
  const slots=["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"];
  const confirm=()=>{
    if(!selDay||!selTime)return;
    window.open("https://outlook.office.com/book/OzeklawTolgaOzekConsultations@NETORGFT7968746.onmicrosoft.com/?ismsaljsauthenabled","_blank");
    setDone(true);
  };
  return(
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column"}}>
      <div className="modal-enter" style={{position:"relative",background:"#0D1628",flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 22px 8px"}}>
          <img src="https://ozeklaw.com/wp-content/uploads/2024/12/Ozek-Law-Firm-Logo-white-transparent.png" alt="Ozek Law" style={{height:28,objectFit:"contain"}}/>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:99,background:"rgba(255,255,255,0.12)",border:"none",color:"#FFF",fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div style={{overflow:"auto",padding:"4px 22px 28px"}}>
          {done?(
            <div style={{textAlign:"center",padding:"32px 0 16px"}}>
              <div style={{fontSize:52,marginBottom:16}}>✅</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#FFF",marginBottom:8}}>Booking Requested</h3>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6,marginBottom:24}}>{days.find(d=>d.num+d.month===selDay)?.date.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} at {selTime}</p>
              <button onClick={onClose} style={{background:"rgba(255,255,255,0.10)",color:"#FFF",border:"1px solid rgba(255,255,255,0.14)",borderRadius:14,padding:"13px 32px",fontSize:14,fontWeight:600,cursor:"pointer"}}>Done</button>
            </div>
          ):(
            <>
              <div style={{marginBottom:20}}>
                <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:"#C9A84C",fontWeight:600,marginBottom:8}}>SCHEDULE</div>
                <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#FFF",letterSpacing:-0.4}}>Consultation</h2>
                <p style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:4}}>Choose a date and time · Atty. Tolga Ozek</p>
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:10}}>Select Date</div>
              <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4,marginBottom:20}}>
                {days.map((d,i)=>{const key=d.num+d.month;const sel=selDay===key;return(
                  <button key={i} onClick={()=>setSelDay(key)} style={{flexShrink:0,width:54,padding:"10px 0",borderRadius:16,background:sel?"#C9A84C":"rgba(255,255,255,0.06)",border:sel?"none":"1px solid rgba(255,255,255,0.09)",cursor:"pointer",textAlign:"center",transition:"all 0.18s",transform:sel?"scale(1.08)":"scale(1)"}}>
                    <div style={{fontSize:9,color:sel?"rgba(15,25,35,0.7)":"rgba(255,255,255,0.4)",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>{d.label}</div>
                    <div style={{fontSize:18,fontWeight:800,color:sel?"#0F1923":"#FFF",fontFamily:"'Playfair Display',serif"}}>{d.num}</div>
                    <div style={{fontSize:9,color:sel?"rgba(15,25,35,0.6)":"rgba(255,255,255,0.3)",marginTop:2}}>{d.month}</div>
                  </button>
                );})}
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:10}}>Select Time</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:22}}>
                {slots.map(s=>{const sel=selTime===s;return(
                  <button key={s} onClick={()=>setSelTime(s)} style={{padding:"12px 0",borderRadius:14,background:sel?"#C9A84C":"rgba(255,255,255,0.06)",border:sel?"none":"1px solid rgba(255,255,255,0.09)",color:sel?"#0F1923":"#FFF",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.18s",transform:sel?"scale(1.04)":"scale(1)"}}>{s}</button>
                );})}
              </div>
              <button onClick={confirm} disabled={!selDay||!selTime} style={{width:"100%",background:selDay&&selTime?"#C9A84C":"rgba(255,255,255,0.08)",color:selDay&&selTime?"#0F1923":"rgba(255,255,255,0.3)",border:"none",borderRadius:16,padding:"16px",fontSize:15,fontWeight:700,cursor:selDay&&selTime?"pointer":"not-allowed",transition:"all 0.2s"}}>
                {selDay&&selTime?"Confirm Booking ↗":"Select date & time"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CaseTimeline({client}){
  const[expanded,setExpanded]=useState(false);
  const done=TIMELINE.filter(s=>s.done).length;
  const pct=Math.round((done/TIMELINE.length)*100);
  const r=44,circum=2*Math.PI*r,dash=circum-(pct/100)*circum;
  return(
    <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",border:"1px solid rgba(0,0,0,0.05)",boxShadow:"0 1px 12px rgba(0,0,0,0.06)",marginBottom:14}}>
      <div style={{display:"flex",gap:14,alignItems:"center",cursor:"pointer"}} onClick={()=>setExpanded(e=>!e)}>
        <div style={{position:"relative",flexShrink:0,width:90,height:90}}>
          <svg width={90} height={90} style={{transform:"rotate(-90deg)"}}>
            <circle cx={45} cy={45} r={r} fill="none" stroke="rgba(0,0,0,0.07)" strokeWidth={6}/>
            <circle cx={45} cy={45} r={r} fill="none" stroke="#C9A84C" strokeWidth={6} strokeDasharray={circum} strokeDashoffset={dash} strokeLinecap="round"/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:"#C9A84C",fontFamily:"'Playfair Display',serif",lineHeight:1}}>{pct}%</div>
            <div style={{fontSize:8,color:"#8492A6",marginTop:2}}>DONE</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#C9A84C",fontWeight:600,marginBottom:4}}>CASE PROGRESS</div>
          <div style={{fontSize:13,fontWeight:700,color:"#0F1923",marginBottom:3}}>{client.matters[0]}</div>
          <div style={{fontSize:11,color:"#8492A6",marginBottom:6}}>{done} of {TIMELINE.length} milestones</div>
          <div style={{background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.22)",borderRadius:10,padding:"5px 10px",fontSize:10,color:"#9A7A2E",fontWeight:600,display:"inline-block"}}>Next: USCIS Receipt</div>
        </div>
        <div style={{color:"#C9A84C",fontSize:12,transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",flexShrink:0}}>▾</div>
      </div>
      {expanded&&(
        <div className="pop-in">
          <div style={{height:1,background:"rgba(0,0,0,0.06)",margin:"14px 0"}}/>
          {TIMELINE.map((s,i)=>(
            <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:i<TIMELINE.length-1?14:0}}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:s.done?"#C9A84C":s.active?"rgba(201,168,76,0.15)":"rgba(0,0,0,0.05)",border:s.active?"2px solid #C9A84C":"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>
                {s.done?"✓":s.icon}
              </div>
              <div style={{paddingTop:3}}>
                <div style={{fontSize:12,fontWeight:s.active||s.done?700:500,color:s.done?"#0F1923":s.active?"#9A7A2E":"#8492A6"}}>{s.step}</div>
                <div style={{fontSize:10,color:"#8492A6"}}>{s.date}</div>
                {s.active&&<span style={{background:"rgba(201,168,76,0.12)",color:"#9A7A2E",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99,marginTop:4,display:"inline-block"}}>IN PROGRESS</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BillingDonut({paid,due,soon}){
  const total=(paid+due+soon)||1,r=52,cx=72,cy=72,circum=2*Math.PI*r;
  const paidD=paid/total*circum,dueD=due/total*circum,soonD=soon/total*circum,gap=3;
  return(
    <div style={{display:"flex",alignItems:"center",gap:16}}>
      <svg width={144} height={144} style={{flexShrink:0,transform:"rotate(-90deg)"}}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth={12}/>
        {paid>0&&<circle cx={cx} cy={cy} r={r} fill="none" stroke="#30D158" strokeWidth={12} strokeDasharray={(paidD-gap)+" "+(circum-paidD+gap)} strokeDashoffset={0} strokeLinecap="round"/>}
        {due>0&&<circle cx={cx} cy={cy} r={r} fill="none" stroke="#FF453A" strokeWidth={12} strokeDasharray={(dueD-gap)+" "+(circum-dueD+gap)} strokeDashoffset={-(paidD)} strokeLinecap="round"/>}
        {soon>0&&<circle cx={cx} cy={cy} r={r} fill="none" stroke="#0A84FF" strokeWidth={12} strokeDasharray={(soonD-gap)+" "+(circum-soonD+gap)} strokeDashoffset={-(paidD+dueD)} strokeLinecap="round"/>}
      </svg>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[["#30D158","Paid",paid],["#FF453A","Due",due],["#0A84FF","Upcoming",soon]].map(([color,label,amt])=>(
          <div key={label} style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{width:8,height:8,borderRadius:2,background:color,flexShrink:0}}/>
            <div><div style={{fontSize:10,color:"#8492A6"}}>{label}</div><div style={{fontSize:15,fontWeight:800,color:"#0F1923",fontFamily:"'Playfair Display',serif"}}>${amt.toLocaleString()}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LangSwitcher({lang,setLang}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{position:"relative",zIndex:200}}>
      <button onClick={()=>setOpen(o=>!o)} style={{background:"rgba(201,168,76,0.15)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(201,168,76,0.30)",borderRadius:99,padding:"5px 13px",fontSize:11,fontWeight:700,color:C.gold,display:"flex",alignItems:"center",gap:5}}>
        {LANGS[lang].label}<span style={{fontSize:8,opacity:0.7}}>▾</span>
      </button>
      {open&&(
        <div style={{position:"fixed",top:64,right:16,background:"rgba(10,18,35,0.97)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:18,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",minWidth:160,zIndex:99999}}>
          {Object.values(LANGS).map(l=>(
            <button key={l.code} onClick={()=>{setLang(l.code);setOpen(false);}} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"11px 16px",background:l.code===lang?"rgba(201,168,76,0.14)":"transparent",borderBottom:"1px solid rgba(255,255,255,0.06)",textAlign:"left"}}>
              <span style={{fontSize:11,fontWeight:700,color:C.gold,minWidth:28}}>{l.label}</span>
              <span style={{fontSize:12,color:l.code===lang?C.hi:C.md}}>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TopBar({lang,setLang,client,setClient,setTab,t}){
  return(
    <div id="top-bar" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 20px",background:"rgba(8,15,30,0.0)",borderBottom:"none",flexShrink:0,position:"fixed",top:0,left:0,right:0,zIndex:1000,willChange:"transform",transition:"transform 0.22s cubic-bezier(0.4,0,0.2,1)"}}>
      <div style={{width:60,display:"flex",justifyContent:"flex-start"}}>
        {client&&<button onClick={()=>{setClient(null);setTab("home");}} style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontWeight:500,background:"rgba(0,0,0,0.3)",border:"1px solid rgba(255,255,255,0.15)",borderRadius:99,padding:"5px 10px"}}>{t.signOut}</button>}
      </div>
      <img src="https://ozeklaw.com/wp-content/uploads/2026/03/Ozek-Law-Firm-Logo-white-transparent.png" alt="Ozek Law" style={{height:44,objectFit:"contain",width:"auto",maxWidth:180}}/>
      <div style={{width:60,display:"flex",justifyContent:"flex-end"}}>
        <LangSwitcher lang={lang} setLang={setLang}/>
      </div>
    </div>
  );
}

function BottomNav({tab,setTab,isClient,t}){
  const pub=[{id:"home",icon:"⚖️",label:t.home},{id:"news",icon:"📰",label:t.news},{id:"team",icon:"👥",label:t.team||"Team"},{id:"uscis",icon:"🛠️",label:"Tools"},{id:"portal",icon:"🔐",label:t.portal}];
  const cli=[{id:"dash",icon:"🏠",label:t.dash},{id:"tasks",icon:"✅",label:t.tasks},{id:"docs",icon:"📁",label:t.docs},{id:"forms",icon:"📋",label:t.formsLabel},{id:"chat",icon:"💬",label:t.ask},{id:"billing",icon:"💳",label:t.bills}];
  const tabs=isClient?cli:pub;
  return(
    <nav className="tab-bar" style={{display:"flex",padding:"10px 0 12px",flexShrink:0}}>
      {tabs.map(tb=>{
        const active=tab===tb.id;
        return(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"2px 0"}}>
            <div style={{width:36,height:28,borderRadius:10,background:active?"rgba(201,168,76,0.18)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",transform:active?"scale(1.08)":"scale(1)"}}>
              <span style={{fontSize:18,opacity:active?1:0.3}}>{tb.icon}</span>
            </div>
            <span style={{fontSize:9,fontWeight:active?700:400,color:active?C.gold:"#FFFFFF",transition:"all 0.2s"}}>{tb.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function PublicHome({setTab,t,lang}){
  const[showBooking,setShowBooking]=useState(false);
  const dir=LANGS[lang].dir;
  return(
    <>
    <div dir={dir}>
      <div style={{position:"relative",overflow:"hidden",minHeight:"52vh",display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"url(https://ozeklaw.com/wp-content/uploads/2026/03/Untitled-design-copy.png)",backgroundSize:"cover",backgroundPosition:"center"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(6,12,26,0.35) 0%,rgba(8,15,30,0.75) 70%,rgba(8,15,30,1) 100%)"}}/>
        {[[320,320,-60,-100,0.08],[200,200,30,-60,0.05]].map(([w,h,tt,r,o],i)=>(
          <div key={i} style={{position:"absolute",width:w,height:h,top:tt,right:r,borderRadius:"50%",border:`1px solid rgba(201,168,76,${o})`,pointerEvents:"none"}}/>
        ))}
        <div style={{position:"relative",padding:"28px 22px 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
            <div style={{fontSize:9,color:C.lo,letterSpacing:2,textTransform:"uppercase"}}>{t.tagline}</div>
            <button onClick={()=>setTab("portal")} style={{background:C.gold,color:"#0F1923",border:"none",borderRadius:12,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0}}>{t.clientLogin}</button>
          </div>
          <div style={{marginBottom:24}}>
            <div style={{width:32,height:2.5,background:C.gold,borderRadius:2,marginBottom:16}}/>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:34,lineHeight:1.15,color:C.hi,marginBottom:14,fontWeight:700,letterSpacing:-0.8}}>
              {t.heroTitle}<br/><span style={{color:C.gold,fontStyle:"italic"}}>{t.heroEm}</span>
            </h1>
            <p style={{fontSize:13,color:C.md,lineHeight:1.72,fontWeight:300,maxWidth:340}}>{t.heroSub}</p>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:32}}>
            <button onClick={()=>window.open("https://outlook.office.com/book/OzeklawTolgaOzekConsultations@NETORGFT7968746.onmicrosoft.com/?ismsaljsauthenabled","_blank")} style={{flex:3,background:C.gold,color:"#0F1923",border:"none",borderRadius:14,padding:"14px 0",fontSize:14,fontWeight:700,cursor:"pointer"}}>{t.scheduleNow} ↗</button>
            <button onClick={()=>setShowBooking(true)} style={{flex:2,background:"rgba(255,255,255,0.12)",backdropFilter:"blur(20px) saturate(180%)",WebkitBackdropFilter:"blur(20px) saturate(180%)",color:"rgba(255,255,255,0.90)",border:"1px solid rgba(255,255,255,0.22)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.14),0 4px 16px rgba(0,0,0,0.15)",borderRadius:14,padding:"14px 0",fontSize:12,fontWeight:500,cursor:"pointer"}}>📅 Book Slot</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"rgba(255,255,255,0.08)",backdropFilter:"blur(28px) saturate(180%)",WebkitBackdropFilter:"blur(28px) saturate(180%)",borderTop:"1px solid rgba(255,255,255,0.18)",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.12)",padding:"14px 0"}}>
          {[["98%","Approval"],["15+","Years"],["20+","Areas"],["42","Countries"]].map(([n,l],i)=>(
            <div key={l} style={{textAlign:"center",borderRight:i<3?"1px solid rgba(255,255,255,0.07)":"none"}}>
              <div style={{fontSize:20,fontWeight:800,color:C.gold,fontFamily:"'Playfair Display',serif",lineHeight:1}}>{n}</div>
              <div style={{fontSize:9,color:C.lo,marginTop:3,letterSpacing:0.5,textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"28px 22px 28px",background:"#FFFFFF"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
          <div>
            <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:5}}>EXPERTISE</div>
            <h2 style={{fontSize:20,fontWeight:700,color:C.ink,fontFamily:"'Playfair Display',serif",letterSpacing:-0.3}}>{t.practiceAreas}</h2>
          </div>
          <button onClick={()=>window.open("https://ozeklaw.com/practiceareas/","_blank")} style={{fontSize:12,color:C.gold,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>{t.seeAll}</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:0}}>
          {t.practiceList.map((p,i)=>(
            <div key={p.title} onClick={()=>window.open("https://ozeklaw.com/practiceareas/","_blank")} style={{background:i%2===0?"#F7F5F2":"rgba(201,168,76,0.08)",border:i%2===0?"1px solid rgba(0,0,0,0.06)":"1px solid rgba(201,168,76,0.20)",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",borderRadius:22,padding:"18px 16px 16px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-12,right:-12,width:56,height:56,borderRadius:"50%",background:"rgba(201,168,76,0.06)"}}/>
              <div style={{fontSize:26,marginBottom:11}}>{p.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>{p.title}</div>
              <div style={{fontSize:11,color:C.inkMd}}>{p.sub}</div>
              <div style={{position:"absolute",bottom:12,right:14,color:C.gold,fontSize:15,opacity:0.7}}>›</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"0 22px",background:"#FFFFFF"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
          <div>
            <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:5}}>INSIGHTS</div>
            <h2 style={{fontSize:20,fontWeight:700,color:C.ink,fontFamily:"'Playfair Display',serif",letterSpacing:-0.3}}>{t.latestUpdates}</h2>
          </div>
          <button onClick={()=>setTab("news")} style={{fontSize:12,color:C.gold,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>{t.seeAll}</button>
        </div>
        {ARTICLES_META.slice(0,3).map((a,i)=>(
          <div key={i} onClick={()=>window.open("https://ozeklaw.com/newsletter/","_blank")} style={{display:"flex",gap:14,alignItems:"center",padding:"14px 0",borderBottom:"1px solid rgba(0,0,0,0.07)",cursor:"pointer"}}>
            <div style={{width:48,height:48,borderRadius:14,flexShrink:0,background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{a.emoji}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,marginBottom:5}}><Badge bg={C.goldPale} color={C.goldDim}>{a.cat}</Badge><span style={{fontSize:10,color:C.inkLo}}>{a.read}</span></div>
              <div style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.35}}>{(ARTICLE_TITLES[lang]||ARTICLE_TITLES.en)[i]}</div>
            </div>
            <span style={{color:C.gold,fontSize:18,opacity:0.7}}>›</span>
          </div>
        ))}
      </div>

      <div style={{padding:"28px 22px 28px",background:"#FFFFFF"}}>
        <div style={{background:"rgba(201,168,76,0.13)",border:"1px solid rgba(201,168,76,0.32)",boxShadow:"inset 0 1px 0 rgba(255,220,100,0.20)",borderRadius:24,padding:"24px 22px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-24,right:-24,width:100,height:100,borderRadius:"50%",background:"rgba(201,168,76,0.10)"}}/>
          <div style={{position:"relative"}}>
            <div style={{fontSize:28,marginBottom:10}}>📞</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.ink,marginBottom:8}}>{t.consultation}</h3>
            <p style={{fontSize:13,color:C.inkMd,marginBottom:18,lineHeight:1.6,fontWeight:300}}>{t.heroSub.slice(0,90)}…</p>
            <button onClick={()=>window.open("https://outlook.office.com/book/OzeklawTolgaOzekConsultations@NETORGFT7968746.onmicrosoft.com/?ismsaljsauthenabled","_blank")} style={{width:"100%",background:C.gold,color:"#0F1923",border:"none",borderRadius:14,padding:"15px",fontSize:14,fontWeight:700,cursor:"pointer"}}>{t.scheduleNow} ↗</button>
          </div>
        </div>
      </div>
    </div>
    {showBooking&&<BookingModal onClose={()=>setShowBooking(false)}/>}
    </>
  );
}

function NewsPage({t,lang}){
  const[sub,setSub]=useState("");const[done,setDone]=useState(false);
  const[newsTab,setNewsTab]=useState("news");
  const dir=LANGS[lang].dir;
  if(newsTab==="regs") return <RegsPage t={t} lang={lang} onBack={()=>setNewsTab("news")}/>;
  const VB_FAM=[
    {cat:"F1",desc:"Unmarried Adult Children of USCs",final:"01JUL18",file:"01JAN19"},
    {cat:"F2A",desc:"Spouses & Minor Children of PRs",final:"Current",file:"Current"},
    {cat:"F2B",desc:"Unmarried Adult Children of PRs",final:"01MAR18",file:"01AUG18"},
    {cat:"F3",desc:"Married Sons/Daughters of USCs",final:"01MAR13",file:"01AUG13"},
    {cat:"F4",desc:"Brothers/Sisters of USCs",final:"01MAY09",file:"01NOV09"},
  ];
  const VB_EMP=[
    {cat:"EB-1",desc:"Priority Workers (China/India: 01APR23)",final:"01APR23*",file:"01DEC23*"},
    {cat:"EB-2",desc:"Adv. Degree (India: 15JUL14, China: 01SEP21)",final:"Current*",file:"Current*"},
    {cat:"EB-3",desc:"Skilled Workers (India: 15NOV13, China: 15JUN21)",final:"01JUN24*",file:"Current*"},
    {cat:"EB-4",desc:"Special Immigrants",final:"01OCT19",file:"01OCT19"},
    {cat:"EB-5",desc:"Investor Visas (China: 01SEP16)",final:"Current*",file:"Current*"},
  ];
  const VBRow=({r})=>(
    <div style={{background:"#FFFFFF",borderRadius:14,padding:"12px 14px",marginBottom:6,border:"1px solid rgba(0,0,0,0.05)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <span style={{background:"#0A1628",color:"#FFF",padding:"3px 9px",borderRadius:8,fontSize:10,fontWeight:700}}>{r.cat}</span>
        <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.inkLo}}>FINAL ACTION</div><div style={{fontSize:11,fontWeight:700,color:r.final==="Current"?C.green:C.ink}}>{r.final}</div></div>
      </div>
      <div style={{fontSize:11,color:C.inkMd,marginBottom:4}}>{r.desc}</div>
      <div style={{display:"flex",justifyContent:"space-between"}}><div style={{fontSize:9,color:C.inkLo}}>FILE DATE</div><div style={{fontSize:11,fontWeight:600,color:r.file==="Current"?C.green:C.goldDim}}>{r.file}</div></div>
    </div>
  );
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 0",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 80% 20%,rgba(201,168,76,0.10),transparent)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>UPDATES</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:C.hi,letterSpacing:-0.5,marginBottom:12}}>{t.newsTitle}</h1>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:16,scrollbarWidth:"none"}}>
            {[["news","📰","News"],["visa","📅","Visa Bulletin"],["instagram","📸","Instagram"],["linkedin","💼","LinkedIn"],["regs","🏛️","Rules & Regs"]].map(([id,icon,label])=>(
              <button key={id} onClick={()=>setNewsTab(id)} style={{padding:"7px 14px",borderRadius:99,fontSize:11,fontWeight:600,cursor:"pointer",border:"none",background:newsTab===id?C.gold:"rgba(255,255,255,0.12)",color:newsTab===id?"#0F1923":"rgba(255,255,255,0.75)",transition:"all 0.2s",flexShrink:0,whiteSpace:"nowrap"}}>{icon} {label}</button>
            ))}
          </div>
        </div>
      </div>
      {newsTab==="news"&&(
        <div style={{padding:"20px 18px 100px"}}>
          <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:18,border:"1px solid rgba(0,0,0,0.05)"}}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:12}}>
              <div style={{width:38,height:38,borderRadius:12,background:"rgba(201,168,76,0.12)",border:"1px solid rgba(201,168,76,0.20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📬</div>
              <div><div style={{fontSize:13,fontWeight:700,color:C.ink}}>{t.newsletter}</div><div style={{fontSize:11,color:C.inkMd,marginTop:2}}>{t.newsletterSub}</div></div>
            </div>
            {done?<div style={{background:"rgba(48,209,88,0.10)",borderRadius:12,padding:"11px 14px",color:C.green,fontSize:13,fontWeight:600}}>{t.subscribed}</div>:(
              <div style={{display:"flex",gap:8}}>
                <input value={sub} onChange={e=>setSub(e.target.value)} placeholder={t.emailPlaceholder} style={{flex:1,background:"rgba(0,0,0,0.04)",border:"1.5px solid rgba(0,0,0,0.07)",borderRadius:12,padding:"11px 14px",fontSize:13,color:C.ink,outline:"none"}}/>
                <GoldBtn onPress={()=>sub&&setDone(true)} sm style={{color:"#FFF"}}>{t.joinBtn}</GoldBtn>
              </div>
            )}
          </div>
          <div style={{fontSize:14,fontWeight:700,color:C.ink,marginBottom:12}}>{t.articles}</div>
          {ARTICLES_META.map((a,i)=>(
            <div key={i} onClick={()=>window.open("https://ozeklaw.com/newsletter/","_blank")} style={{display:"flex",gap:12,alignItems:"center",background:"#FFFFFF",borderRadius:18,padding:"14px",marginBottom:9,border:"1px solid rgba(0,0,0,0.05)",cursor:"pointer"}}>
              <div style={{width:44,height:44,borderRadius:12,background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.emoji}</div>
              <div style={{flex:1}}><div style={{display:"flex",gap:6,marginBottom:4}}><Badge bg="rgba(201,168,76,0.12)" color={C.goldDim}>{a.cat}</Badge><span style={{fontSize:10,color:C.inkLo}}>{a.read}</span></div><div style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.3}}>{(ARTICLE_TITLES[lang]||ARTICLE_TITLES.en)[i]}</div></div>
              <span style={{color:C.gold,fontSize:16,opacity:0.7}}>›</span>
            </div>
          ))}
        </div>
      )}
      {newsTab==="visa"&&(
        <div style={{padding:"20px 18px 100px"}}>
          <div style={{background:"linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))",border:"1px solid rgba(201,168,76,0.30)",borderRadius:20,padding:"16px",marginBottom:18}}>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
              <div style={{width:36,height:36,borderRadius:10,background:"rgba(201,168,76,0.20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📅</div>
              <div><div style={{fontSize:13,fontWeight:700,color:C.ink}}>April 2026 Visa Bulletin</div><div style={{fontSize:11,color:C.inkLo}}>Dates for Filing Chart (USCIS authorized)</div></div>
            </div>
            <div style={{fontSize:11,color:C.inkMd,lineHeight:1.5}}>Priority dates show when you can file. <strong style={{color:C.goldDim}}>"Current"</strong> = file now.</div>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>Family-Sponsored</div>
          {VB_FAM.map(r=><VBRow key={r.cat} r={r}/>)}
          <div style={{fontSize:13,fontWeight:700,color:C.ink,margin:"16px 0 10px"}}>Employment-Based</div>
          {VB_EMP.map(r=><VBRow key={r.cat} r={r}/>)}
          <div style={{background:"rgba(10,132,255,0.08)",border:"1px solid rgba(10,132,255,0.20)",borderRadius:16,padding:"14px",marginTop:12}}>
            <div style={{fontSize:11,color:C.inkLo,marginBottom:10}}>* Dates vary by country. China & India have earlier cutoffs. See USCIS for country-specific dates.</div>
            <div style={{fontSize:12,fontWeight:700,color:C.blue,marginBottom:6}}>📌 When to File</div>
            <div style={{fontSize:11,color:C.inkMd,lineHeight:1.6,marginBottom:10}}>File your I-485 when your priority date is earlier than the "File Date" above. Contact Ozek Law to confirm eligibility.</div>
            <div style={{display:"flex",gap:8}}>
              <a href="https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/when-to-file-your-adjustment-of-status-application-for-family-sponsored-or-employment-based-123" target="_blank" rel="noreferrer" style={{flex:1,textDecoration:"none"}}><div style={{background:"rgba(10,132,255,0.12)",borderRadius:10,padding:"9px",fontSize:10,fontWeight:600,color:C.blue,textAlign:"center"}}>Family Chart ↗</div></a>
              <a href="https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/when-to-file-your-adjustment-of-status-application-for-family-sponsored-or-employment-based-122" target="_blank" rel="noreferrer" style={{flex:1,textDecoration:"none"}}><div style={{background:"rgba(10,132,255,0.12)",borderRadius:10,padding:"9px",fontSize:10,fontWeight:600,color:C.blue,textAlign:"center"}}>Employment Chart ↗</div></a>
            </div>
          </div>
        </div>
      )}
      {newsTab==="instagram"&&(
        <div style={{padding:"20px 18px 100px"}}>
          <div style={{background:"linear-gradient(135deg,#E1306C,#833AB4,#F77737)",borderRadius:20,padding:"20px",marginBottom:18,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>📸</div>
            <div style={{fontSize:16,fontWeight:700,color:"#FFF",marginBottom:4}}>@ozeklaw</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.8)",marginBottom:14}}>Follow for immigration tips, legal news & firm updates</div>
            <a href="https://www.instagram.com/ozeklaw/" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><div style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:12,padding:"11px 24px",fontSize:13,fontWeight:700,color:"#FFF",display:"inline-block"}}>Open Instagram ↗</div></a>
          </div>
          {[["⚖️","Policy & Case Law Updates","Latest immigration law changes"],["🏢","Business Law Tips","LLC formation, contracts & compliance"],["📋","Form Guides","Common immigration form walkthroughs"],["🌍","Client Success Stories","Real cases and results"],["💡","Know Your Rights","Understand your legal options"]].map(([e,title,desc],i)=>(
            <a key={i} href="https://www.instagram.com/ozeklaw/" target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:10}}>
              <div style={{background:"#FFFFFF",borderRadius:18,padding:"14px 16px",display:"flex",gap:14,alignItems:"center",border:"1px solid rgba(0,0,0,0.05)"}}>
                <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,rgba(225,48,108,0.15),rgba(131,58,180,0.15))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{e}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.ink,marginBottom:2}}>{title}</div><div style={{fontSize:11,color:C.inkLo}}>{desc}</div></div>
                <span style={{fontSize:14,opacity:0.4}}>›</span>
              </div>
            </a>
          ))}
        </div>
      )}
      {newsTab==="linkedin"&&(
        <div style={{padding:"20px 18px 100px"}}>
          <div style={{background:"linear-gradient(135deg,#0077B5,#00A0DC)",borderRadius:20,padding:"20px",marginBottom:18,textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:8}}>💼</div>
            <div style={{fontSize:16,fontWeight:700,color:"#FFF",marginBottom:4}}>Ozek Law Firm</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,0.85)",marginBottom:14}}>Professional updates, legal insights & firm news</div>
            <a href="https://www.linkedin.com/company/ozek-law-firm" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><div style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.4)",borderRadius:12,padding:"11px 24px",fontSize:13,fontWeight:700,color:"#FFF",display:"inline-block"}}>View on LinkedIn ↗</div></a>
          </div>
          {[["📰","Legal News & Analysis","Immigration & business law analysis"],["🏆","Case Results","Successful outcomes for our clients"],["🎤","Speaking Engagements","Atty. Tolga Ozek at conferences"],["📊","Industry Insights","Trends in immigration & business law"],["🤝","Community & Pro Bono","Our commitment to the community"]].map(([e,title,desc],i)=>(
            <a key={i} href="https://www.linkedin.com/company/ozek-law-firm" target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:10}}>
              <div style={{background:"#FFFFFF",borderRadius:18,padding:"14px 16px",display:"flex",gap:14,alignItems:"center",border:"1px solid rgba(0,0,0,0.05)"}}>
                <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,rgba(0,119,181,0.12),rgba(0,160,220,0.12))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{e}</div>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.ink,marginBottom:2}}>{title}</div><div style={{fontSize:11,color:C.inkLo}}>{desc}</div></div>
                <span style={{fontSize:14,opacity:0.4}}>›</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}


function USCISPage({t,lang}){
  const[num,setNum]=useState("");const[res,setRes]=useState(null);const[loading,setLoading]=useState(false);
  const[selForm,setSelForm]=useState("I-485");const[uscisTab,setUscisTab]=useState("tools");const[selState,setSelState]=useState(null);
  const dir=LANGS[lang].dir;
  const check=()=>{if(!num.trim())return;setLoading(true);setRes(null);setTimeout(()=>{setRes({status:"Case Was Received and A Receipt Notice Was Emailed",updated:"March 18, 2026",form:"I-485",center:"Nebraska Service Center"});setLoading(false);},1400);};
  const TOOL_GROUPS=[
    {label:"Case & Account",icon:"🗂️",items:[
      {icon:"🔐",title:"USCIS Online Account",sub:"Manage your case online",url:"https://myaccount.uscis.gov/sign-in",color:"rgba(10,132,255,0.10)",border:"rgba(10,132,255,0.25)"},
      {icon:"📮",title:"USCIS Service Request",sub:"Submit a case inquiry",url:"https://egov.uscis.gov/e-request",color:"rgba(10,132,255,0.07)",border:"rgba(10,132,255,0.18)"},
      {icon:"📍",title:"Address Change (AR-11)",sub:"Update your address on file",url:"https://www.uscis.gov/ar-11",color:"rgba(255,69,58,0.08)",border:"rgba(255,69,58,0.22)"},
    ]},
    {label:"Travel & Entry",icon:"✈️",items:[
      {icon:"✈️",title:"Travel History (I-94)",sub:"View entry & exit records",url:"https://i94.cbp.dhs.gov/search/history-search",color:"rgba(48,209,88,0.08)",border:"rgba(48,209,88,0.22)"},
      {icon:"📋",title:"I-94 Latest Entry",sub:"Most recent arrival info",url:"https://i94.cbp.dhs.gov/search/recent-search",color:"rgba(48,209,88,0.08)",border:"rgba(48,209,88,0.22)"},
    ]},
    {label:"Green Card",icon:"💚",items:[
      {icon:"📅",title:"Visa Bulletin",sub:"Monthly priority date charts",url:"https://www.uscis.gov/green-card/green-card-processes-and-procedures/visa-availability-priority-dates/adjustment-of-status-filing-charts-from-the-visa-bulletin",color:"rgba(201,168,76,0.10)",border:"rgba(201,168,76,0.28)"},
      {icon:"🏥",title:"Find a Civil Surgeon",sub:"USCIS-accredited doctors",url:"https://www.uscis.gov/tools/find-a-civil-surgeon",color:"rgba(48,209,88,0.10)",border:"rgba(48,209,88,0.28)"},
    ]},
    {label:"Processing & Work",icon:"⏱️",items:[
      {icon:"⏱️",title:"USCIS Processing Times",sub:"Current form timelines",url:"https://egov.uscis.gov/processing-times/",color:"rgba(191,90,242,0.08)",border:"rgba(191,90,242,0.22)"},
      {icon:"💼",title:"Dept. of Labor Processing",sub:"PERM & wage timelines",url:"https://flag.dol.gov/processingtimes",color:"rgba(191,90,242,0.08)",border:"rgba(191,90,242,0.22)"},
    ]},
  ];
  const STATE_NAMES={"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming","DC":"Washington D.C."};
  const STATE_OFFICES={"CA":{uscis:"Los Angeles Field Office\n1 World Way, Los Angeles CA 90045",court:"LA Immigration Court\n606 S Olive St, Los Angeles CA 90014"},"NY":{uscis:"New York Field Office\n26 Federal Plaza, New York NY 10278",court:"NY Immigration Court\n26 Federal Plaza, New York NY 10278"},"TX":{uscis:"Houston Field Office\n126 Northpoint Dr, Houston TX 77060",court:"Houston Immigration Court\n126 Northpoint Dr, Houston TX 77060"},"FL":{uscis:"Miami Field Office\n8801 NW 7th Ave, Miami FL 33150",court:"Miami Immigration Court\n333 S Miami Ave, Miami FL 33130"},"IL":{uscis:"Chicago Field Office\n101 W Congress Pkwy, Chicago IL 60605",court:"Chicago Immigration Court\n55 E Monroe St, Chicago IL 60603"},"VA":{uscis:"Arlington Field Office\n2306 Mt. Vernon Ave, Alexandria VA 22301",court:"Arlington Immigration Court\n1901 S Bell St, Arlington VA 22202"},"MD":{uscis:"Baltimore Field Office\n31 Hopkins Plaza, Baltimore MD 21201",court:"Baltimore Immigration Court\n31 Hopkins Plaza, Baltimore MD 21201"},"NJ":{uscis:"Newark Field Office\n970 Broad St, Newark NJ 07102",court:"Newark Immigration Court\n970 Broad St, Newark NJ 07102"},"MA":{uscis:"Boston Field Office\n15 New Sudbury St, Boston MA 02203",court:"Boston Immigration Court\n15 New Sudbury St, Boston MA 02203"},"WA":{uscis:"Seattle Field Office\n12500 Tukwila Intl Blvd, Seattle WA 98168",court:"Seattle Immigration Court\n1000 2nd Ave, Seattle WA 98104"},"DC":{uscis:"DC Field Office\n2675 Prosperity Ave, Fairfax VA 22031",court:"Arlington Immigration Court\n1901 S Bell St, Arlington VA 22202"}};
  const DEF_OFFICE={uscis:"USCIS: 1-800-375-5283 (Mon–Fri 8am–8pm)\negov.uscis.gov — Find your local office",court:"EOIR: 1-800-898-7180\nwww.justice.gov/eoir — Find your local court"};
  const STATES=Object.keys(STATE_NAMES);
  const FEDERAL=[
    {icon:"📜",title:"USCIS Policy Manual",sub:"Federal immigration policy",url:"https://www.uscis.gov/policy-manual"},
    {icon:"⚖️",title:"Immigration Court (EOIR)",sub:"Case info & hearing locations",url:"https://www.justice.gov/eoir"},
    {icon:"🛂",title:"CBP Border Information",sub:"Ports of entry & travel",url:"https://www.cbp.gov"},
    {icon:"🌐",title:"State Dept. Visa Info",sub:"Nonimmigrant & immigrant visas",url:"https://travel.state.gov"},
  ];
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 0"}}>
        <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>IMMIGRATION</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:C.hi,letterSpacing:-0.5,marginBottom:12}}>Useful Tools</h1>
        <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:16,scrollbarWidth:"none"}}>
          {[["tools","🛠️","Tools"],["forms","📝","Forms"],["case","📋","Case Status"],["map","🗺️","Find Offices"]].map(([id,icon,label])=>(
            <button key={id} onClick={()=>setUscisTab(id)} style={{padding:"7px 16px",borderRadius:99,fontSize:12,fontWeight:600,cursor:"pointer",border:"none",background:uscisTab===id?C.gold:"rgba(255,255,255,0.12)",color:uscisTab===id?"#0F1923":"rgba(255,255,255,0.75)",transition:"all 0.2s",flexShrink:0}}>{icon} {label}</button>
          ))}
        </div>
      </div>
      {uscisTab==="forms"&&(
        <div style={{padding:"20px 18px 100px"}}>
          <div style={{background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:18,padding:"14px 16px",marginBottom:20}}>
            <div style={{fontSize:12,fontWeight:700,color:C.goldDim,marginBottom:4}}>📋 Immigration Intake Forms</div>
            <div style={{fontSize:11,color:C.inkLo,lineHeight:1.5}}>Click a form below to start your application. Your information will be reviewed by Ozek Law attorneys.</div>
          </div>
          {[
            {
              icon:"🏢",
              cat:"H-1B / H-2B",
              title:"H-1B Information Collection Form 2026",
              sub:"Specialty Occupation Work Visa",
              label:"Fill out form",
              color:"rgba(10,132,255,0.10)",
              border:"rgba(10,132,255,0.25)",
              iconBg:"rgba(10,132,255,0.15)",
              url:"https://ozeklaw.com/h1b-intake",
            },
            {
              icon:"⭐",
              cat:"O-1",
              title:"O-1 Visa Eligibility Screening Form",
              sub:"Extraordinary Ability / Achievement",
              label:"Fill out form",
              color:"rgba(191,90,242,0.10)",
              border:"rgba(191,90,242,0.25)",
              iconBg:"rgba(191,90,242,0.15)",
              url:"https://ozeklaw.com/o1-screening",
            },
            {
              icon:"💼",
              cat:"E-1 / E-2",
              title:"E-2 / E-1 Investor Visa Information Form",
              sub:"E2/E1 Yatırımcı Vizesi Bilgi Toplama Formu",
              label:"Fill out form",
              color:"rgba(48,209,88,0.10)",
              border:"rgba(48,209,88,0.25)",
              iconBg:"rgba(48,209,88,0.15)",
              url:"https://ozeklaw.com/e1e2-intake",
            },
            {
              icon:"🌿",
              cat:"EB-2 / EB-3",
              title:"EB-2 / EB-3 Information Collection Form",
              sub:"EB2/EB3 Bilgi Toplama Formu",
              label:"Fill out form",
              color:"rgba(201,168,76,0.10)",
              border:"rgba(201,168,76,0.28)",
              iconBg:"rgba(201,168,76,0.18)",
              url:"https://ozeklaw.com/eb2eb3-intake",
            },
          ].map(f=>(
            <a key={f.cat} href={f.url} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:12}}>
              <div style={{background:f.color,border:`1px solid ${f.border}`,borderRadius:20,padding:"16px",display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:48,height:48,borderRadius:14,background:f.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{f.icon}</div>
                <div style={{flex:1}}>
                  <Badge bg={f.iconBg} color={C.ink} small>{f.cat}</Badge>
                  <div style={{fontSize:13,fontWeight:700,color:C.ink,margin:"5px 0 2px",lineHeight:1.3}}>{f.title}</div>
                  <div style={{fontSize:11,color:C.inkLo,lineHeight:1.4}}>{f.sub}</div>
                </div>
                <div style={{flexShrink:0,background:C.gold,borderRadius:10,padding:"8px 12px",fontSize:11,fontWeight:700,color:"#0F1923",whiteSpace:"nowrap"}}>{f.label} →</div>
              </div>
            </a>
          ))}
          <div style={{background:"linear-gradient(135deg,#0A1628,#0D1E3A)",borderRadius:18,padding:"16px",border:"1px solid rgba(201,168,76,0.20)",marginTop:8}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <div style={{fontSize:22,flexShrink:0}}>💬</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:C.hi,marginBottom:2}}>Not sure which form?</div>
                <div style={{fontSize:11,color:C.md}}>Contact Ozek Law for a free consultation</div>
              </div>
              <a href="https://wa.me/12023047872?text=Hello%2C+I+need+help+choosing+the+right+immigration+form." target="_blank" rel="noreferrer" style={{textDecoration:"none",flexShrink:0}}>
                <div style={{background:"#25D366",borderRadius:10,padding:"8px 12px",fontSize:11,fontWeight:700,color:"#FFF"}}>WhatsApp</div>
              </a>
            </div>
          </div>
        </div>
      )}

            {uscisTab==="tools"&&(
        <div style={{padding:"20px 18px 100px"}}>
          {TOOL_GROUPS.map(g=>(
            <div key={g.label} style={{marginBottom:22}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}><span style={{fontSize:15}}>{g.icon}</span><div style={{fontSize:13,fontWeight:700,color:C.ink}}>{g.label}</div></div>
              {g.items.map(r=>(
                <a key={r.title} href={r.url} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:8}}>
                  <div style={{background:r.color,border:`1px solid ${r.border}`,borderRadius:16,padding:"14px 16px",display:"flex",gap:14,alignItems:"center"}}>
                    <div style={{width:40,height:40,borderRadius:12,background:"rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{r.icon}</div>
                    <div style={{flex:1}}><div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:2}}>{r.title}</div><div style={{fontSize:11,color:C.inkLo}}>{r.sub}</div></div>
                    <span style={{color:C.gold,fontSize:16,opacity:0.8}}>↗</span>
                  </div>
                </a>
              ))}
            </div>
          ))}
        </div>
      )}
      {uscisTab==="case"&&(
        <div style={{padding:"20px 18px 100px"}}>
          <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:14,border:"1px solid rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:10,color:C.inkLo,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Receipt Number</div>
            <input value={num} onChange={e=>setNum(e.target.value.toUpperCase())} placeholder="e.g. WAC2315151234" style={{width:"100%",background:"rgba(0,0,0,0.04)",border:"1.5px solid rgba(0,0,0,0.08)",borderRadius:13,padding:"13px 16px",color:C.ink,fontSize:15,outline:"none",letterSpacing:1.5,marginBottom:12,fontFamily:"monospace"}}/>
            <GoldBtn full onPress={check} style={{color:"#0F1923"}}>{loading?"Checking…":"Check Status"}</GoldBtn>
            <div style={{textAlign:"center",marginTop:10,fontSize:11,color:C.inkLo}}>Or visit <a href="https://egov.uscis.gov/casestatus/landing.do" target="_blank" rel="noreferrer" style={{color:C.goldDim,fontWeight:600}}>USCIS.gov ↗</a></div>
          </div>
          {loading&&<div style={{textAlign:"center",padding:20}}><div style={{width:28,height:28,borderRadius:14,border:`3px solid ${C.gold}`,borderTopColor:"transparent",margin:"0 auto",animation:"spin 0.8s linear infinite"}}/></div>}
          {res&&!loading&&(
            <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:14,border:"1.5px solid rgba(201,168,76,0.25)"}}>
              <Badge bg={C.greenBg} color={C.green}>● Status Found</Badge>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:C.ink,lineHeight:1.55,margin:"12px 0 14px"}}>{res.status}</div>
              <Divider light/>
              {[["Receipt",num],["Form",res.form],["Center",res.center],["Updated",res.updated]].map(([l,v])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:11,color:C.inkLo}}>{l}</span><span style={{fontSize:11,fontWeight:600,color:C.ink}}>{v}</span></div>
              ))}
            </div>
          )}
          <div style={{background:"rgba(201,168,76,0.09)",borderRadius:20,padding:"18px",marginBottom:20,border:"1px solid rgba(201,168,76,0.22)"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>Processing Times</div>
            <div style={{position:"relative",marginBottom:12}}>
              <select value={selForm} onChange={e=>setSelForm(e.target.value)} style={{width:"100%",background:"#FFF",border:"1.5px solid rgba(201,168,76,0.30)",borderRadius:13,padding:"12px 36px 12px 14px",color:C.ink,fontSize:14,outline:"none",cursor:"pointer"}}>
                {USCIS_FORMS.map(f=><option key={f} value={f}>{f}</option>)}
              </select>
              <span style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",color:C.gold,pointerEvents:"none",fontSize:12}}>▾</span>
            </div>
            <GoldBtn full onPress={()=>window.open("https://egov.uscis.gov/processing-times/","_blank")} style={{color:"#0F1923"}}>View Official Times ↗</GoldBtn>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:12}}>Receipt Prefix Guide</div>
          {[["EAC","Vermont SC"],["LIN","Nebraska SC"],["SRC","Texas SC"],["WAC","California SC"],["NBC","National Benefits Center"],["IOE","Online / Electronic"]].map(([code,name])=>(
            <div key={code} style={{display:"flex",gap:12,alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
              <span style={{background:"#0A1628",color:"#FFF",padding:"5px 10px",borderRadius:8,fontSize:10,fontWeight:700,fontFamily:"monospace"}}>{code}</span>
              <span style={{fontSize:13,color:C.ink}}>{name}</span>
            </div>
          ))}
        </div>
      )}
      {uscisTab==="map"&&(
        <div style={{padding:"20px 18px 100px"}}>
          {/* Interactive US Map */}
          <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",borderRadius:20,padding:"14px 10px 10px",marginBottom:14,border:"1px solid rgba(201,168,76,0.20)"}}>
            <div style={{fontSize:11,fontWeight:600,color:C.gold,marginBottom:8,textAlign:"center",letterSpacing:1}}>TAP A STATE</div>
            <svg viewBox="100 30 780 520" style={{width:"100%",height:"auto"}} xmlns="http://www.w3.org/2000/svg">
              {[
                ["AL","M 636,300 L 648,300 L 656,320 L 648,390 L 636,390 L 628,340 Z"],
                ["AK","M 70,460 L 165,460 L 182,480 L 175,530 L 140,545 L 95,530 L 68,500 Z"],
                ["AZ","M 178,288 L 264,303 L 272,400 L 216,400 L 180,390 Z"],
                ["AR","M 580,288 L 640,288 L 640,340 L 578,340 Z"],
                ["CA","M 108,195 L 168,175 L 178,288 L 145,375 L 108,355 Z"],
                ["CO","M 310,248 L 430,248 L 428,308 L 308,308 Z"],
                ["CT","M 826,152 L 852,148 L 852,168 L 826,170 Z"],
                ["DE","M 832,183 L 848,180 L 852,200 L 832,202 Z"],
                ["FL","M 650,388 L 720,388 L 740,430 L 728,480 L 706,502 L 680,480 L 658,435 Z"],
                ["GA","M 648,300 L 710,300 L 718,388 L 650,388 L 640,355 Z"],
                ["HI","M 230,530 L 330,530 L 330,570 L 230,570 Z"],
                ["ID","M 186,80 L 268,70 L 272,190 L 232,210 L 186,195 Z"],
                ["IL","M 580,188 L 620,185 L 622,268 L 578,270 Z"],
                ["IN","M 620,185 L 658,183 L 660,258 L 618,260 Z"],
                ["IA","M 520,160 L 586,158 L 580,218 L 518,220 Z"],
                ["KS","M 430,248 L 558,248 L 554,308 L 428,308 Z"],
                ["KY","M 648,230 L 754,225 L 758,260 L 646,265 Z"],
                ["LA","M 560,360 L 640,355 L 645,400 L 608,418 L 565,408 Z"],
                ["ME","M 880,58 L 916,50 L 928,80 L 908,110 L 875,100 Z"],
                ["MD","M 776,195 L 830,188 L 835,215 L 780,218 Z"],
                ["MA","M 832,135 L 888,128 L 892,152 L 828,158 Z"],
                ["MI","M 638,100 L 698,88 L 704,148 L 668,158 L 636,145 Z"],
                ["MN","M 516,65 L 596,58 L 598,158 L 514,160 Z"],
                ["MS","M 596,295 L 640,295 L 636,390 L 594,390 Z"],
                ["MO","M 546,220 L 650,215 L 652,288 L 544,290 Z"],
                ["MT","M 200,65 L 420,55 L 422,148 L 198,152 Z"],
                ["NE","M 424,190 L 552,185 L 550,248 L 422,250 Z"],
                ["NV","M 142,158 L 206,148 L 215,268 L 178,290 L 140,260 Z"],
                ["NH","M 858,85 L 878,80 L 882,128 L 854,132 Z"],
                ["NJ","M 824,168 L 842,163 L 845,200 L 822,202 Z"],
                ["NM","M 284,308 L 408,308 L 408,398 L 280,400 Z"],
                ["NY","M 748,110 L 828,98 L 832,138 L 824,170 L 776,175 L 750,155 Z"],
                ["NC","M 716,255 L 826,245 L 828,278 L 712,280 Z"],
                ["ND","M 388,65 L 516,58 L 516,125 L 386,128 Z"],
                ["OH","M 658,165 L 720,160 L 724,230 L 656,235 Z"],
                ["OK","M 390,308 L 555,305 L 556,360 L 388,362 Z"],
                ["OR","M 107,112 L 215,100 L 210,185 L 106,192 Z"],
                ["PA","M 726,148 L 826,138 L 828,180 L 724,185 Z"],
                ["RI","M 868,148 L 884,145 L 886,165 L 868,167 Z"],
                ["SC","M 714,280 L 770,275 L 768,315 L 712,318 Z"],
                ["SD","M 386,128 L 516,122 L 514,190 L 384,192 Z"],
                ["TN","M 610,260 L 754,255 L 752,288 L 608,292 Z"],
                ["TX","M 388,362 L 558,360 L 565,410 L 538,480 L 452,500 L 380,455 Z"],
                ["UT","M 228,210 L 310,205 L 314,308 L 226,310 Z"],
                ["VT","M 840,80 L 858,78 L 858,128 L 838,130 Z"],
                ["VA","M 748,218 L 832,212 L 832,248 L 746,252 Z"],
                ["WA","M 106,60 L 215,55 L 215,105 L 106,112 Z"],
                ["WV","M 716,195 L 774,190 L 776,228 L 714,232 Z"],
                ["WI","M 565,95 L 640,88 L 645,165 L 562,168 Z"],
                ["WY","M 270,152 L 420,145 L 422,248 L 268,250 Z"],
                ["DC","M 806,212 L 816,210 L 816,222 L 806,222 Z"],
              ].map(([abbr,path])=>{
                const sel=selState===abbr;
                const hasOffice=!!STATE_OFFICES[abbr];
                return(
                  <g key={abbr} onClick={()=>setSelState(sel?null:abbr)} style={{cursor:"pointer"}}>
                    <path d={path}
                      fill={sel?"#C9A84C":hasOffice?"rgba(201,168,76,0.20)":"rgba(255,255,255,0.07)"}
                      stroke={sel?"#E8C96A":"rgba(201,168,76,0.35)"}
                      strokeWidth={sel?"2":"0.8"}
                      style={{transition:"all 0.15s"}}
                    />
                    {["TX","CA","MT","WY","CO","NM","AZ","NV","OR","WA","ID","UT","MN","ND","SD","NE","KS","OK","MO","AR","IA","IL","WI","MI","IN","OH","PA","NY","VA","NC","GA","FL","TN","AL","MS","LA","KY","WV","MD","SC"].includes(abbr)&&(
                      <text
                        x={{"TX":468,"CA":138,"MT":308,"WY":342,"CO":368,"NM":340,"AZ":224,"NV":172,"OR":158,"WA":158,"ID":228,"UT":268,"MN":555,"ND":450,"SD":448,"NE":486,"KS":490,"OK":470,"MO":596,"AR":608,"IA":550,"IL":598,"WI":602,"MI":668,"IN":638,"OH":688,"PA":774,"NY":784,"VA":786,"NC":766,"GA":678,"FL":690,"TN":680,"AL":640,"MS":616,"LA":600,"KY":700,"WV":742,"MD":802,"SC":738}[abbr]||0}
                        y={{"TX":425,"CA":270,"MT":100,"WY":200,"CO":278,"NM":354,"AZ":344,"NV":218,"OR":148,"WA":82,"ID":138,"UT":258,"MN":108,"ND":95,"SD":158,"NE":220,"KS":278,"OK":334,"MO":252,"AR":315,"IA":188,"IL":228,"WI":128,"MI":122,"IN":222,"OH":198,"PA":163,"NY":138,"VA":235,"NC":265,"GA":345,"FL":438,"TN":275,"AL":345,"MS":342,"LA":386,"KY":248,"WV":212,"MD":202,"SC":298}[abbr]||0}
                        textAnchor="middle" fontSize={sel?"11":"9"}
                        fill={sel?"#0F1923":"rgba(255,255,255,0.85)"}
                        fontWeight={sel?"700":"500"}
                        style={{pointerEvents:"none"}}
                      >{abbr}</text>
                    )}
                  </g>
                );
              })}
              {/* AK & HI labels */}
              <text x="118" y="495" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)" style={{pointerEvents:"none"}}>AK</text>
              <text x="280" y="552" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)" style={{pointerEvents:"none"}}>HI</text>
            </svg>
            {selState&&<div style={{textAlign:"center",fontSize:11,color:C.gold,fontWeight:600,marginTop:2,paddingBottom:4}}>{STATE_NAMES[selState]||selState} selected ✓</div>}
          </div>

          <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:14,border:"1px solid rgba(0,0,0,0.05)"}}>
            <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4}}>Or search by state</div>
            <div style={{position:"relative"}}>
              <select value={selState||""} onChange={e=>setSelState(e.target.value||null)} style={{width:"100%",background:"#FFF",border:"1.5px solid rgba(201,168,76,0.30)",borderRadius:13,padding:"13px 36px 13px 14px",color:selState?C.ink:C.inkLo,fontSize:14,outline:"none",cursor:"pointer"}}>
                <option value="">— Choose a state —</option>
                {STATES.map(s=><option key={s} value={s}>{STATE_NAMES[s]}</option>)}
              </select>
              <span style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",color:C.gold,pointerEvents:"none",fontSize:12}}>▾</span>
            </div>
          </div>
          {!selState&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:16}}>
              {["CA","NY","TX","FL","IL","VA","MD","NJ","MA","WA"].map(s=>(
                <button key={s} onClick={()=>setSelState(s)} style={{padding:"10px 4px",borderRadius:12,background:"linear-gradient(135deg,#0A1628,#0D1E3A)",border:"1px solid rgba(201,168,76,0.20)",color:C.gold,fontSize:11,fontWeight:700,cursor:"pointer"}}>{s}</button>
              ))}
            </div>
          )}
          {selState&&(()=>{
            const o=STATE_OFFICES[selState]||DEF_OFFICE;
            return(
              <div className="pop-in">
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:16,fontWeight:700,color:C.ink}}>{STATE_NAMES[selState]||selState}</div>
                  <button onClick={()=>setSelState(null)} style={{fontSize:12,color:C.goldDim,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>← Change</button>
                </div>
                <div style={{background:"rgba(10,132,255,0.08)",border:"1px solid rgba(10,132,255,0.22)",borderRadius:18,padding:"16px",marginBottom:12}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"rgba(10,132,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏛️</div>
                    <div><div style={{fontSize:13,fontWeight:700,color:C.ink}}>USCIS Field Office</div><div style={{fontSize:11,color:C.inkLo}}>Local immigration services</div></div>
                  </div>
                  <div style={{fontSize:12,color:C.inkMd,lineHeight:1.7,whiteSpace:"pre-line",marginBottom:8}}>{o.uscis}</div>
                  <a href="https://www.uscis.gov/about-us/find-a-uscis-office/field-offices" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><div style={{fontSize:11,color:C.blue,fontWeight:600}}>Find all USCIS offices ↗</div></a>
                </div>
                <div style={{background:"rgba(191,90,242,0.08)",border:"1px solid rgba(191,90,242,0.22)",borderRadius:18,padding:"16px",marginBottom:12}}>
                  <div style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                    <div style={{width:36,height:36,borderRadius:10,background:"rgba(191,90,242,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>⚖️</div>
                    <div><div style={{fontSize:13,fontWeight:700,color:C.ink}}>Immigration Court (EOIR)</div><div style={{fontSize:11,color:C.inkLo}}>Hearings & removal proceedings</div></div>
                  </div>
                  <div style={{fontSize:12,color:C.inkMd,lineHeight:1.7,whiteSpace:"pre-line",marginBottom:8}}>{o.court}</div>
                  <a href="https://www.justice.gov/eoir/eoir-immigration-court-listing" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><div style={{fontSize:11,color:C.purple,fontWeight:600}}>Find all immigration courts ↗</div></a>
                </div>
                <div style={{fontSize:13,fontWeight:700,color:C.ink,margin:"16px 0 10px"}}>Federal Resources</div>
                {FEDERAL.map(r=>(
                  <a key={r.title} href={r.url} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:8}}>
                    <div style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,0.06)",borderRadius:14,padding:"13px 14px",display:"flex",gap:12,alignItems:"center"}}>
                      <div style={{fontSize:20,flexShrink:0}}>{r.icon}</div>
                      <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.ink}}>{r.title}</div><div style={{fontSize:11,color:C.inkLo}}>{r.sub}</div></div>
                      <span style={{color:C.gold,fontSize:14,opacity:0.7}}>↗</span>
                    </div>
                  </a>
                ))}
              </div>
            );
          })()}
        </div>
      )}
      {uscisTab==="forms"&&(
        <div style={{padding:"20px 18px 100px"}}>
          <div style={{background:"rgba(201,168,76,0.09)",border:"1px solid rgba(201,168,76,0.22)",borderRadius:18,padding:"14px 16px",marginBottom:18}}>
            <div style={{fontSize:12,fontWeight:700,color:C.goldDim,marginBottom:3}}>📋 Ozek Law Intake Forms</div>
            <div style={{fontSize:11,color:C.inkLo,lineHeight:1.5}}>Click any form below to begin filling out your eligibility or intake information. Your responses go directly to our attorneys.</div>
          </div>
          {[
            {icon:"🛂",cat:"Work Visa",title:"H-1B / H-2B Information Collection",subtitle:"H1B Information Collection Form 2026",color:"rgba(10,132,255,0.10)",border:"rgba(10,132,255,0.25)",url:"https://forms.office.com/Pages/ResponsePage.aspx?id=mXlhsannUkKIpbtUrWr3Is1VPcvPntZGo6DpXwlpdRVUM05HMU4yMUpLWkYyTTQyQzVMV1c2UTZONCQlQCN0PWcu"},
            {icon:"🌟",cat:"Extraordinary Ability",title:"O-1 Visa Eligibility Screening",subtitle:"O-1 Visa Eligibility Screening Form",color:"rgba(191,90,242,0.10)",border:"rgba(191,90,242,0.28)",url:"https://forms.office.com/Pages/ResponsePage.aspx?id=mXlhsannUkKIpbtUrWr3Is1VPcvPntZGo6DpXwlpdRVUNjhLQ1VJNllDMllDUTRWNlYyRjBFUkhJUCQlQCN0PWcu"},
            {icon:"💼",cat:"Investor Visa",title:"E-1 / E-2 Investor Visa Information",subtitle:"E2/E1 Yatırımcı Vizesi Bilgi Toplama Formu",color:"rgba(48,209,88,0.10)",border:"rgba(48,209,88,0.28)",url:"https://forms.office.com/Pages/ResponsePage.aspx?id=mXlhsannUkKIpbtUrWr3Is1VPcvPntZGo6DpXwlpdRVUOEJNVFZaS0M2TERQNTdVOFlaUVZKSjA2NCQlQCN0PWcu"},
            {icon:"🏆",cat:"Exceptional Ability",title:"EB-1 Eligibility Review",subtitle:"EB1 Uygunluk İnceleme Formu",color:"rgba(255,214,10,0.10)",border:"rgba(255,214,10,0.30)",url:"https://forms.office.com/Pages/ResponsePage.aspx?id=mXlhsannUkKIpbtUrWr3Is1VPcvPntZGo6DpXwlpdRVUQVZGMEpFNlRMNFpLWVhGRTVYUjVBNkJQRSQlQCN0PWcu"},
            {icon:"🎓",cat:"National Interest Waiver",title:"EB-2 NIW Eligibility Review",subtitle:"EB2 NIW Uygunluk İnceleme Formu",color:"rgba(255,214,10,0.10)",border:"rgba(255,214,10,0.30)",url:"https://forms.office.com/Pages/ResponsePage.aspx?id=mXlhsannUkKIpbtUrWr3Is1VPcvPntZGo6DpXwlpdRVUMkZLRFMyMUJKVUwwRjM0TDE2VlFNNVpHNyQlQCN0PWcu"},
            {icon:"📋",cat:"Employment Green Card",title:"EB-2 / EB-3 PERM Information",subtitle:"EB2/EB3 Information Collection Form | Bilgi Toplama Formu",color:"rgba(10,132,255,0.08)",border:"rgba(10,132,255,0.22)",url:"https://forms.office.com/r/4vx12CKV02"},
          ].map((f,i)=>(
            <a key={i} href={f.url} target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginBottom:12}}>
              <div style={{background:f.color,border:`1px solid ${f.border}`,borderRadius:18,padding:"16px",display:"flex",gap:14,alignItems:"center"}}>
                <div style={{width:46,height:46,borderRadius:13,background:"rgba(255,255,255,0.85)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{f.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:9,letterSpacing:1.5,textTransform:"uppercase",color:C.goldDim,fontWeight:600,marginBottom:3}}>{f.cat}</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:2}}>{f.title}</div>
                  <div style={{fontSize:10,color:C.inkLo}}>{f.subtitle}</div>
                </div>
                <div style={{flexShrink:0,background:C.gold,borderRadius:10,padding:"7px 12px",fontSize:11,fontWeight:700,color:"#0F1923"}}>Fill Out ↗</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}


function RegsPage({t,lang,onBack}){
  const dir=LANGS[lang].dir;
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px"}}>
        <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>BUSINESS</div>
        {onBack&&<button onClick={onBack} style={{display:"flex",alignItems:"center",gap:6,color:C.gold,fontSize:13,marginBottom:12,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>‹ Back to News</button>}
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:C.hi,letterSpacing:-0.5,marginBottom:4}}>{t.regsTitle}</h1>
        <p style={{fontSize:12,color:C.md,fontWeight:300}}>{t.regsSub}</p>
      </div>
      <div style={{padding:"20px 18px 100px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{t.clientAlerts}</div>
          <Badge bg={C.redBg} color={C.red}>Urgent</Badge>
        </div>
        {CLIENT_ALERTS.map((a,i)=>(
          <div key={i} style={{background:"#FFFFFF",borderRadius:18,padding:"14px 16px",marginBottom:10,border:"1px solid rgba(0,0,0,0.05)",borderLeft:`3px solid ${a.color}`}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
              <span style={{fontSize:16}}>{a.emoji}</span>
              <Badge bg={a.tagBg} color={a.color} small>{a.tag}</Badge>
              <span style={{fontSize:10,color:C.inkLo,marginLeft:"auto"}}>{a.date}</span>
            </div>
            <div style={{fontSize:12,fontWeight:700,color:C.ink,marginBottom:5}}>{a.title}</div>
            <div style={{fontSize:11,color:C.inkMd,lineHeight:1.55}}>{a.body}</div>
          </div>
        ))}
        <div style={{fontSize:14,fontWeight:700,color:C.ink,margin:"22px 0 12px"}}>{t.practiceAreasTitle||"Practice Area Articles"}</div>
        {PRACTICE_ARTICLES.map((a,i)=>(
          <div key={i} onClick={()=>window.open("https://ozeklaw.com/practiceareas/","_blank")} style={{display:"flex",gap:12,alignItems:"center",background:"#FFFFFF",borderRadius:16,padding:"13px 14px",marginBottom:8,border:"1px solid rgba(0,0,0,0.05)",cursor:"pointer"}}>
            <div style={{width:40,height:40,borderRadius:11,background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{a.emoji}</div>
            <div style={{flex:1}}><Badge bg="rgba(201,168,76,0.10)" color={C.goldDim}>{a.cat}</Badge><div style={{fontSize:12,fontWeight:600,color:C.ink,marginTop:5,lineHeight:1.3}}>{a.title}</div></div>
            <span style={{color:C.gold,fontSize:16,opacity:0.7}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamPage({lang}){
  const dir=LANGS[lang].dir;
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 80% 20%,rgba(201,168,76,0.10),transparent)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>OUR FIRM</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:C.hi,letterSpacing:-0.5,marginBottom:4}}>Our Team</h1>
          <p style={{fontSize:12,color:C.md,fontWeight:300}}>Reach out directly via WhatsApp</p>
        </div>
      </div>
      <div style={{padding:"20px 18px 100px"}}>
        {TEAM.map(m=>(
          <div key={m.name} style={{background:"#FFFFFF",borderRadius:22,marginBottom:14,border:"1px solid rgba(0,0,0,0.06)",boxShadow:"0 2px 16px rgba(0,0,0,0.07)",overflow:"hidden"}}>
            <div style={{width:"100%",height:200,overflow:"hidden",position:"relative",background:"#E8E4DE"}}>
              <img src={m.photo} alt={m.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}
                onError={e=>{e.target.parentNode.style.background="rgba(201,168,76,0.12)";e.target.style.display="none";}}/>
            </div>
            <div style={{padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
              <div>
                <div style={{fontSize:15,fontWeight:700,color:C.ink,marginBottom:2}}>{m.name}</div>
                <div style={{fontSize:11,color:C.inkLo}}>{m.role}</div>
              </div>
              <button onClick={()=>window.open("https://wa.me/"+m.wa.replace(/[^0-9]/g,"")+"?text=Hello%2C+I+would+like+to+speak+with+"+encodeURIComponent(m.name),"_blank")}
                style={{display:"flex",alignItems:"center",gap:7,background:"#25D366",border:"none",borderRadius:12,padding:"10px 18px",fontSize:13,fontWeight:700,color:"#FFF",cursor:"pointer",boxShadow:"0 3px 12px rgba(37,211,102,0.35)",flexShrink:0}}>
                <span style={{fontSize:16}}>💬</span> WhatsApp
              </button>
            </div>
          </div>
        ))}
        <a href="https://ozeklaw.com/our-team/" target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginTop:8}}>
          <div style={{background:"linear-gradient(135deg,#0A1628,#0D1E3A)",borderRadius:18,padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:13,fontWeight:600,color:C.hi}}>Full Team & Bio</div>
            <span style={{color:C.gold,fontSize:16}}>↗</span>
          </div>
        </a>
      </div>
    </div>
  );
}

function ClientLogin({setClient,setTab,t,lang}){
  const[id,setId]=useState("");const[pw,setPw]=useState("");const[err,setErr]=useState("");const[loading,setLoading]=useState(false);
  const dir=LANGS[lang].dir;
  const login=()=>{
    if(!id.trim()){setErr(t.incorrectCreds);return;}
    setLoading(true);setErr("");
    setTimeout(()=>{
      const c=CLIENTS.find(c=>c.id.toLowerCase()===id.toLowerCase()||c.name.toLowerCase().includes(id.toLowerCase().trim()));
      if(c){setClient(c);setTab("dash");}
      window.open("https://client.docketwise.com","_blank");
      setLoading(false);
    },700);
  };
  return(
    <div dir={dir} style={{minHeight:"100%",background:"linear-gradient(160deg,#080F1E 0%,#0D1628 60%,#111D33 100%)"}}>
      <div style={{padding:"40px 24px 100px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:68,height:68,borderRadius:22,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
            <span style={{fontSize:22,fontWeight:800,color:"#0F1923",fontFamily:"'Playfair Display',serif"}}>OL</span>
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:C.hi,marginBottom:6}}>{t.portalTitle}</h2>
          <p style={{fontSize:13,color:C.md,fontWeight:300}}>{t.portalSub}</p>
        </div>
        <div style={{background:C.blueBg,border:"1px solid rgba(10,132,255,0.20)",borderRadius:16,padding:"13px 16px",marginBottom:22}}>
          <div style={{fontSize:11,fontWeight:700,color:C.blue,marginBottom:4}}>🔗 Powered by Docketwise</div>
          <div style={{fontSize:11,color:"rgba(10,132,255,0.7)",lineHeight:1.5}}>Sign in to access tasks, documents, invoices, and live case updates.</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:18}}>
          <div>
            <div style={{fontSize:10,color:C.lo,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>{t.clientIdLabel}</div>
            <input value={id} onChange={e=>setId(e.target.value)} placeholder={t.clientIdPlaceholder} className="field" style={{fontSize:15}}/>
          </div>
          <div>
            <div style={{fontSize:10,color:C.lo,letterSpacing:1.2,textTransform:"uppercase",marginBottom:8}}>{t.passwordLabel}</div>
            <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder={t.passwordPlaceholder} onKeyDown={e=>e.key==="Enter"&&login()} className="field" style={{fontSize:15}}/>
          </div>
          {err&&<div style={{background:C.redBg,color:C.red,borderRadius:12,padding:"11px 14px",fontSize:12}}>{err}</div>}
          <GoldBtn full onPress={login} style={{padding:"16px",fontSize:15,borderRadius:16,color:"#0F1923"}}>{loading?t.signingIn:t.signIn}</GoldBtn>
        </div>
        <div style={{textAlign:"center",marginBottom:12,fontSize:11,color:C.lo}}>Try: OZ001 · OZ002 · OZ003 · OZ004</div>
        <div style={{textAlign:"center"}}>
          <a href="https://client.docketwise.com" target="_blank" rel="noreferrer" style={{fontSize:12,color:C.gold,fontWeight:600,textDecoration:"none",opacity:0.8}}>→ Go directly to Docketwise ↗</a>
        </div>
      </div>
    </div>
  );
}

function ClientDash({client,setTab,t,lang}){
  const[showBooking,setShowBooking]=useState(false);
  const pending=TASKS.filter(t=>t.status!=="Done").length;
  const due=BILLS.filter(b=>b.status==="Due").reduce((a,b)=>a+b.amt,0);
  const dir=LANGS[lang].dir;
  return(
    <>
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"20px 22px 26px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 80% 10%,rgba(201,168,76,0.10),transparent)"}}/>
        <div style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
          <div>
            <div style={{fontSize:12,color:C.lo,marginBottom:2,fontWeight:300}}>{t.goodMorning}</div>
            <div style={{fontSize:22,fontWeight:700,color:C.hi}}>{client.name.split(" ")[0]} 👋</div>
          </div>
          <Avatar initials={client.avatar} size={46} gold/>
        </div>
        <div style={{background:"rgba(255,255,255,0.08)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.14)",borderRadius:16,padding:"14px 16px"}}>
          <div style={{fontSize:9,color:C.gold,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5}}>{t.nextAction}</div>
          <div style={{fontSize:13,fontWeight:600,color:C.hi}}>{client.next}</div>
          <div style={{fontSize:11,color:C.lo,marginTop:3}}>{client.caseNum} · {client.atty}</div>
        </div>
      </div>
      <div style={{padding:"18px 18px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {[{label:t.openTasks,val:pending,color:C.gold,icon:"✅",tab:"tasks"},{label:t.amountDue,val:`$${due.toLocaleString()}`,color:C.red,icon:"💳",tab:"billing"},{label:t.matters,val:client.matters.length,color:C.blue,icon:"⚖️",tab:null},{label:t.newDocs,val:"3",color:C.green,icon:"📁",tab:"docs"}].map(s=>(
            <div key={s.label} onClick={s.tab?()=>setTab(s.tab):undefined} style={{background:"#FFFFFF",borderRadius:20,padding:"16px",border:"1px solid rgba(0,0,0,0.05)",cursor:s.tab?"pointer":"default",borderTop:`3px solid ${s.color}`}}>
              <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
              <div style={{fontSize:10,color:C.inkLo,marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"'Playfair Display',serif"}}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>{t.quickActions}</div>
        <div style={{display:"flex",gap:8,marginBottom:22}}>
          {[["📤",t.upload,()=>setTab("docs")],["💬",t.askAtty,()=>setTab("chat")],["📋",t.formsLabel,()=>setTab("forms")],["🔗",t.docketwise,()=>window.open("https://client.docketwise.com","_blank")]].map(([icon,label,fn])=>(
            <button key={label} onClick={fn} className="tap" style={{flex:1,background:"#FFFFFF",border:"1px solid rgba(0,0,0,0.06)",borderRadius:16,padding:"13px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,cursor:"pointer"}}>
              <span style={{fontSize:20}}>{icon}</span>
              <span style={{fontSize:9,fontWeight:600,color:C.inkLo}}>{label}</span>
            </button>
          ))}
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>{t.yourMatters}</div>
        {client.matters.map(m=>(
          <div key={m} style={{display:"flex",gap:12,alignItems:"center",background:"#FFFFFF",borderRadius:16,padding:"13px 14px",marginBottom:9,border:"1px solid rgba(0,0,0,0.05)"}}>
            <div style={{width:38,height:38,borderRadius:11,background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>⚖️</div>
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.ink}}>{m}</div><div style={{fontSize:11,color:C.inkLo,marginTop:1}}>{client.atty}</div></div>
            <Badge bg={C.greenBg} color={C.green}>{t.activeMatter}</Badge>
          </div>
        ))}
        <CaseTimeline client={client}/>
        <button onClick={()=>setShowBooking(true)} style={{width:"100%",display:"flex",gap:12,alignItems:"center",background:"linear-gradient(135deg,#0A1628,#0D1E3A)",borderRadius:18,padding:"14px 16px",border:"1px solid rgba(201,168,76,0.20)",marginBottom:14,cursor:"pointer"}}>
          <div style={{width:38,height:38,borderRadius:11,background:"rgba(201,168,76,0.18)",border:"1px solid rgba(201,168,76,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📅</div>
          <div style={{flex:1,textAlign:"left"}}><div style={{fontSize:13,fontWeight:700,color:"#FFF",marginBottom:1}}>Schedule a Consultation</div><div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>Book directly with Atty. Tolga Ozek</div></div>
          <span style={{color:"#C9A84C",fontSize:16,opacity:0.7}}>›</span>
        </button>
        <div style={{background:"rgba(201,168,76,0.09)",borderRadius:18,padding:"14px 16px",border:"1px solid rgba(201,168,76,0.20)"}}>
          <div style={{display:"flex",gap:12,alignItems:"center"}}>
            <div style={{fontSize:22}}>🔗</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.ink,marginBottom:1}}>{t.syncedWith}</div><div style={{fontSize:11,color:C.inkLo}}>{t.syncedSub}</div></div>
            <a href="https://client.docketwise.com" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <GoldBtn sm outline style={{borderRadius:10}}>{t.open}</GoldBtn>
            </a>
          </div>
        </div>
      </div>
    </div>
    {showBooking&&<BookingModal onClose={()=>setShowBooking(false)}/>}
    </>
  );
}

function TasksPage({t,lang}){
  const dir=LANGS[lang].dir;
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div><div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>CASE MANAGEMENT</div><h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.hi,letterSpacing:-0.4}}>{t.myTasks}</h1></div>
          <Badge bg={C.greenBg} color={C.green}>● {t.live}</Badge>
        </div>
      </div>
      <div style={{padding:"18px 18px 100px"}}>
        {TASKS.map(task=>{
          const sc=statColor(task.status),pc=priColor(task.pri),sl=t.statLabels[task.status]||task.status;
          return(
            <div key={task.id} className="tap" style={{background:"#FFFFFF",borderRadius:20,padding:"16px",marginBottom:10,border:"1px solid rgba(0,0,0,0.05)",opacity:task.status==="Done"?0.5:1}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:36,height:36,borderRadius:11,background:sc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                  {task.status==="Done"?"✓":task.status==="Progress"?"⏳":task.status==="Scheduled"?"📅":"○"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.ink,textDecoration:task.status==="Done"?"line-through":"none",marginBottom:4}}>{task.title}</div>
                  <div style={{fontSize:11,color:C.inkLo,marginBottom:8}}>Due {task.due}</div>
                  <div style={{display:"flex",gap:6}}><Badge bg={sc.bg} color={sc.c}>{sl}</Badge><Badge bg={pc.bg} color={pc.c}>{task.pri}</Badge></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DocsPage({t,lang}){
  const[uploaded,setUploaded]=useState([]);const fileRef=useRef();
  const dir=LANGS[lang].dir;
  const existing=[{name:"Passport_Copy.pdf",size:"1.2MB",date:"Mar 1",status:"Verified"},{name:"Birth_Certificate_EN.pdf",size:"456KB",date:"Feb 28",status:"Verified"},{name:"I-94_Record.pdf",size:"89KB",date:"Feb 20",status:"Pending"}];
  const stC=s=>({Verified:{bg:C.greenBg,c:C.green},Uploaded:{bg:C.blueBg,c:C.blue},Pending:{bg:C.amberBg,c:"#B8860B"},Scanned:{bg:C.blueBg,c:C.blue}}[s]||{bg:"rgba(0,0,0,0.05)",c:C.inkLo});
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"78px 22px 28px"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.hi,letterSpacing:-0.4}}>{t.documents}</h1>
        <p style={{fontSize:12,color:C.md,fontWeight:300,marginTop:4}}>{t.docsSub}</p>
      </div>
      <div style={{padding:"18px 18px 100px"}}>
        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.png" style={{display:"none"}} onChange={e=>Array.from(e.target.files).forEach(f=>setUploaded(p=>[...p,{name:f.name,size:(f.size/1024).toFixed(0)+"KB",date:"Today",status:"Uploaded"}]))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <button onClick={()=>fileRef.current.click()} style={{background:"#FFFFFF",border:"2px dashed rgba(201,168,76,0.40)",borderRadius:18,padding:"20px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}}>
            <span style={{fontSize:26}}>📤</span><span style={{fontSize:12,fontWeight:600,color:C.ink}}>{t.uploadFile}</span><span style={{fontSize:10,color:C.inkLo}}>{t.pdfTypes}</span>
          </button>
          <button style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,0.07)",borderRadius:18,padding:"20px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}}>
            <span style={{fontSize:26}}>📷</span><span style={{fontSize:12,fontWeight:600,color:C.ink}}>{t.scanDoc}</span>
            <span style={{fontSize:10,color:C.inkLo}}>{t.useCamera}</span>
          </button>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>{t.allFiles}</div>
        {[{name:"Passport_Copy.pdf",size:"1.2MB",date:"Mar 1",status:"Verified"},{name:"Birth_Certificate_EN.pdf",size:"456KB",date:"Feb 28",status:"Verified"},{name:"I-94_Record.pdf",size:"89KB",date:"Feb 20",status:"Pending"},...uploaded].map((d,i)=>{const sc=stC(d.status);return(
          <div key={i} style={{display:"flex",gap:12,alignItems:"center",background:"#FFFFFF",borderRadius:16,padding:"13px 14px",marginBottom:8,border:"1px solid rgba(0,0,0,0.05)"}}>
            <div style={{width:36,height:36,borderRadius:10,background:"rgba(0,0,0,0.04)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17}}>📄</div>
            <div style={{flex:1}}><div style={{fontSize:12,fontWeight:600,color:C.ink,marginBottom:2}}>{d.name}</div><div style={{fontSize:10,color:C.inkLo}}>{d.size} · {d.date}</div></div>
            <Badge bg={sc.bg} color={sc.c}>{d.status}</Badge>
          </div>
        );})}
      </div>
    </div>
  );
}

function FormsPage({t,lang}){
  const[sel,setSel]=useState(null);const[data,setData]=useState({});const[done,setDone]=useState(false);
  const dir=LANGS[lang].dir;
  const forms=[
    {id:"i485",title:"Form I-485",sub:"Adjustment of Status",fields:["Full Legal Name","Date of Birth","Country of Birth","A-Number","Current Address","Date of Last Entry"]},
    {id:"i131",title:"Form I-131",sub:"Travel Document",fields:["Full Legal Name","Date of Birth","Reason for Travel","Departure Date","Return Date"]},
    {id:"biz01",title:"Business Intake",sub:"New Business Client",fields:["Business Name","Entity Type","State of Formation","Primary Contact","Nature of Matter"]},
    {id:"lit01",title:"Litigation Intake",sub:"Civil Dispute",fields:["Full Legal Name","Opposing Party","Court / Jurisdiction","Brief Description","Desired Outcome"]},
  ];
  if(done)return(<div dir={dir} style={{padding:"70px 24px",textAlign:"center",background:"#F7F5F2",minHeight:"100%"}}><div style={{fontSize:56,marginBottom:16}}>✅</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:C.ink,marginBottom:8}}>{t.submitted}</h2><p style={{fontSize:14,color:C.inkMd,marginBottom:28,lineHeight:1.6}}>{t.submittedSub}</p><GoldBtn onPress={()=>{setDone(false);setSel(null);setData({})}} style={{color:"#0F1923"}}>{t.submitAnother}</GoldBtn></div>);
  if(sel)return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"78px 22px 28px"}}>
        <button onClick={()=>{setSel(null);setData({})}} style={{display:"flex",alignItems:"center",gap:8,color:C.gold,fontSize:14,marginBottom:16,fontWeight:700,background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.25)",borderRadius:10,padding:"8px 14px",cursor:"pointer"}}>‹ {t.back}</button>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:C.hi}}>{sel.title}</h2>
        <p style={{fontSize:12,color:C.md,marginTop:4}}>{sel.sub}</p>
      </div>
      <div style={{padding:"20px 18px 100px"}}>
        {sel.fields.map(f=>(
          <div key={f} style={{marginBottom:14}}>
            <div style={{fontSize:10,color:C.inkLo,letterSpacing:1,textTransform:"uppercase",marginBottom:7}}>{f}</div>
            <input value={data[f]||""} onChange={e=>setData(p=>({...p,[f]:e.target.value}))} style={{width:"100%",background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,0.08)",borderRadius:14,padding:"13px 16px",color:C.ink,fontSize:14,outline:"none"}}/>
          </div>
        ))}
        <GoldBtn full onPress={()=>setDone(true)} style={{marginTop:8,color:"#0F1923"}}>{t.submitToAtty}</GoldBtn>
      </div>
    </div>
  );
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"78px 22px 28px"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.hi,letterSpacing:-0.4}}>{t.legalForms}</h1>
        <p style={{fontSize:12,color:C.md,marginTop:4}}>{t.formsSub}</p>
      </div>
      <div style={{padding:"18px 18px 100px"}}>
        {forms.map(f=>(
          <div key={f.id} onClick={()=>setSel(f)} style={{display:"flex",gap:12,alignItems:"center",background:"#FFFFFF",borderRadius:18,padding:"16px",marginBottom:10,border:"1px solid rgba(0,0,0,0.05)",cursor:"pointer"}}>
            <div style={{width:44,height:44,borderRadius:13,background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.20)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📋</div>
            <div style={{flex:1}}><div style={{fontSize:14,fontWeight:700,color:C.ink,marginBottom:2}}>{f.title}</div><div style={{fontSize:11,color:C.inkLo}}>{f.sub}</div></div>
            <span style={{color:C.gold,fontSize:18,opacity:0.7}}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatPage({client,t,lang}){
  const[msgs,setMsgs]=useState([{role:"assistant",content:`Hello ${client.name.split(" ")[0]}! I'm connected to Atty. Tolga Ozek's WhatsApp. Type your question below.`}]);
  const[input,setInput]=useState("");const[sent,setSent]=useState(false);
  const bottomRef=useRef();const dir=LANGS[lang].dir;
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=useCallback(()=>{
    if(!input.trim())return;
    setMsgs(p=>[...p,{role:"user",content:input}]);
    const wa=encodeURIComponent(`Message from ${client.name} (${client.caseNum}):

${input}`);
    window.open(`https://wa.me/12028548545?text=${wa}`,"_blank");
    setSent(true);
    setTimeout(()=>{setMsgs(p=>[...p,{role:"assistant",content:`${t.whatsappSent}

Atty. Tolga Ozek will reply on WhatsApp shortly.`}]);setSent(false);},900);
    setInput("");
  },[input,client,t]);
  return(
    <div dir={dir} style={{display:"flex",flexDirection:"column",height:"calc(100vh - 60px)",background:"#F7F5F2"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"78px 22px 20px",flexShrink:0}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.hi,marginBottom:2}}>{t.askAttorney}</h1>
        <p style={{fontSize:11,color:C.md,fontWeight:300}}>{t.askSub}</p>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"80%",padding:"11px 15px",borderRadius:18,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",background:m.role==="user"?C.gold:"#FFFFFF",color:m.role==="user"?"#0F1923":C.ink,boxShadow:m.role==="user"?`0 4px 16px ${C.goldGlow}`:"0 1px 8px rgba(0,0,0,0.07)"}}>{m.content}</div>
          </div>
        ))}
        {sent&&<div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:C.gold,padding:"8px 14px",borderRadius:16,fontSize:12,color:"#0F1923",opacity:0.6}}>Sending…</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{padding:"10px 16px 14px",background:"#F7F5F2",borderTop:"1px solid rgba(0,0,0,0.07)",flexShrink:0}}>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:8}}>
          {t.quickQ.map(q=><button key={q} onClick={()=>setInput(q)} style={{flexShrink:0,background:"#FFFFFF",border:"1px solid rgba(0,0,0,0.08)",borderRadius:99,padding:"7px 13px",fontSize:10,color:C.inkMd,cursor:"pointer",whiteSpace:"nowrap"}}>{q}</button>)}
        </div>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={t.askPlaceholder} style={{flex:1,background:"#FFFFFF",border:"1.5px solid rgba(0,0,0,0.09)",borderRadius:16,padding:"13px 16px",color:C.ink,fontSize:13,outline:"none"}}/>
          <button onClick={send} style={{width:46,height:46,borderRadius:14,background:C.gold,color:"#0F1923",border:"none",cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>↑</button>
        </div>
      </div>
    </div>
  );
}

function BillingPage({t,lang}){
  const due=BILLS.filter(b=>b.status==="Due").reduce((a,b)=>a+b.amt,0);
  const paid=BILLS.filter(b=>b.status==="Paid").reduce((a,b)=>a+b.amt,0);
  const soon=BILLS.filter(b=>b.status==="Soon").reduce((a,b)=>a+b.amt,0);
  const stC={Paid:{bg:C.greenBg,c:C.green},Due:{bg:C.redBg,c:C.red},Soon:{bg:C.blueBg,c:C.blue}};
  const dir=LANGS[lang].dir;
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"78px 22px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 80% 20%,rgba(201,168,76,0.10),transparent)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>ACCOUNT</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.hi,letterSpacing:-0.4}}>{t.billing}</h1>
        </div>
      </div>
      <div style={{padding:"18px 18px 100px"}}>
        <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:14,border:"1px solid rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:C.inkLo,marginBottom:12}}>BILLING OVERVIEW</div>
          <div style={{display:"flex",gap:10,marginBottom:8}}>
            {[["#30D158","Paid",paid],["#FF453A","Due",due],["#0A84FF","Upcoming",soon]].map(([color,label,amt])=>(
              <div key={label} style={{flex:1,background:"rgba(0,0,0,0.03)",borderRadius:14,padding:"12px",borderTop:`3px solid ${color}`}}>
                <div style={{fontSize:10,color:C.inkLo,marginBottom:3}}>{label}</div>
                <div style={{fontSize:18,fontWeight:800,color:C.ink,fontFamily:"'Playfair Display',serif"}}>${amt.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        {due>0&&(
          <div style={{background:C.redBg,border:"1px solid rgba(255,69,58,0.20)",borderRadius:18,padding:"14px 16px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
              <div><div style={{fontSize:13,fontWeight:700,color:C.red,marginBottom:2}}>{t.paymentRequired}</div><div style={{fontSize:11,color:C.inkLo}}>billing@ozeklaw.com</div></div>
              <GoldBtn onPress={()=>window.open("https://wa.me/12028548545?text=I+would+like+to+make+a+payment","_blank")} sm style={{background:C.red,color:"#FFF",borderRadius:12,boxShadow:"none"}}>{t.payNow}</GoldBtn>
            </div>
          </div>
        )}
        <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>{t.invoices}</div>
        {BILLS.map((b,i)=>{const sc=stC[b.status]||{bg:"rgba(0,0,0,0.05)",c:C.inkLo};return(
          <div key={i} style={{background:"#FFFFFF",borderRadius:18,padding:"16px",marginBottom:10,border:"1px solid rgba(0,0,0,0.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:7}}>
              <div><div style={{fontSize:13,fontWeight:700,color:C.ink}}>{b.id}</div><div style={{fontSize:10,color:C.inkLo,marginTop:1}}>{b.date}</div></div>
              <Badge bg={sc.bg} color={sc.c}>{b.status}</Badge>
            </div>
            <div style={{fontSize:12,color:C.inkMd,marginBottom:10}}>{b.desc}</div>
            <div style={{fontSize:20,fontWeight:800,color:b.status==="Due"?C.red:C.ink,fontFamily:"'Playfair Display',serif"}}>${b.amt.toLocaleString()}</div>
          </div>
        );})}
      </div>
    </div>
  );
}


function SplashScreen({onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2800);return()=>clearTimeout(t);},[]);
  const particles=[{l:"38%",t:"45%",dx:"-30px"},{l:"55%",t:"42%",dx:"25px"},{l:"42%",t:"55%",dx:"-15px"},{l:"52%",t:"58%",dx:"20px"},{l:"35%",t:"50%",dx:"-40px"},{l:"62%",t:"48%",dx:"35px"},{l:"46%",t:"38%",dx:"-10px"},{l:"58%",t:"52%",dx:"18px"},{l:"40%",t:"60%",dx:"-22px"},{l:"56%",t:"44%",dx:"28px"},{l:"44%",t:"47%",dx:"-35px"},{l:"60%",t:"55%",dx:"12px"}];
  return(
    <div style={{position:"fixed",inset:0,zIndex:99999,background:"#080F1E",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",animation:"fogOut 0.5s ease 2.3s both"}}>
      {[0,1,2].map(i=>(
        <div key={i} style={{position:"absolute",width:220,height:220,borderRadius:"50%",border:"1px solid rgba(201,168,76,0.3)",animation:`ringExpand ${1.4+i*0.5}s ease-out ${i*0.35}s infinite`}}/>
      ))}
      <div style={{position:"absolute",width:160,height:160,borderRadius:"50%",background:"radial-gradient(circle,rgba(201,168,76,0.18) 0%,transparent 70%)",animation:"glowPulse 2s ease-in-out infinite"}}/>
      {particles.map((p,i)=>(
        <div key={i} style={{position:"absolute",width:3,height:3,borderRadius:"50%",background:`rgba(201,168,76,${0.4+i*0.04})`,left:p.l,top:p.t,"--dx":p.dx,animation:`particleDrift ${1.8+i*0.15}s ease-out ${i*0.08}s both`}}/>
      ))}
      <img src="https://ozeklaw.com/wp-content/uploads/2026/03/Ozek-Law-Firm-Logo-white-transparent.png" alt="Ozek Law"
        style={{height:110,objectFit:"contain",position:"relative",zIndex:1,animation:"fogIn 1.8s cubic-bezier(0.22,1,0.36,1) 0.2s both",filter:"drop-shadow(0 0 24px rgba(201,168,76,0.45))"}}/>
      <div style={{marginTop:14,fontSize:10,letterSpacing:3.5,textTransform:"uppercase",color:"rgba(201,168,76,0.65)",fontWeight:500,position:"relative",zIndex:1,animation:"fogIn 1.8s cubic-bezier(0.22,1,0.36,1) 0.7s both"}}>
        Immigration · Business · Litigation
      </div>
    </div>
  );
}

export default function App(){
  const[splash,setSplash]=useState(true);
  const[tab,setTab]=useState("home");
  const[client,setClient]=useState(null);
  const[lang,setLang]=useState("en");
  const lastScrollY=useRef(0);
  const scrollHidden=useRef(false);
  const t=I18N[lang]||I18N.en;

  useEffect(()=>{
    const el=document.getElementById("main-scroll");
    if(el) el.scrollTop=0;
    lastScrollY.current=0;
    scrollHidden.current=false;
    const bar=document.getElementById("top-bar");
    if(bar) bar.style.transform="translateY(0)";
  },[tab]);

  const isClient=!!client&&["dash","tasks","docs","forms","chat","billing"].includes(tab);
  const dir=LANGS[lang].dir;
  return(
    <>
      <style>{FONTS}{css}</style>
      {splash&&<SplashScreen onDone={()=>setSplash(false)}/>}
      <div dir={dir} className={lang==="zh"?"lang-zh":""} style={{display:"flex",flexDirection:"column",height:"100vh",background:C.bg0,overflow:"hidden"}}>
        <TopBar lang={lang} setLang={setLang} client={client} setClient={setClient} setTab={setTab} t={t}/>
        {client&&isClient&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 20px",background:"rgba(8,15,30,0.75)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <Avatar initials={client.avatar} size={18}/>
              <span style={{fontSize:11,color:C.lo}}>{client.name} · {client.caseNum}</span>
            </div>
            <Badge bg={C.greenBg} color={C.green} small>● {t.live}</Badge>
          </div>
        )}
        <div id="main-scroll" style={{flex:1,overflowY:"auto",overscrollBehavior:"contain",WebkitOverflowScrolling:"touch",transform:"translateZ(0)",paddingTop:56}}
          onScroll={e=>{const y=e.currentTarget.scrollTop;const bar=document.getElementById("top-bar");if(!bar){lastScrollY.current=y;return;}if(y<=2){if(scrollHidden.current){bar.style.transform="translateY(0)";scrollHidden.current=false;}}else if(y>lastScrollY.current&&!scrollHidden.current){bar.style.transform="translateY(-100%)";scrollHidden.current=true;}lastScrollY.current=y;}}>
          <div className="page-enter" key={tab+lang}>
            {!client&&tab==="home"   &&<PublicHome setTab={setTab} t={t} lang={lang}/>}
            {!client&&tab==="news"   &&<NewsPage t={t} lang={lang}/>}
            {!client&&tab==="uscis"  &&<USCISPage t={t} lang={lang}/>}
            {!client&&tab==="team"   &&<TeamPage lang={lang}/>}
            {!client&&tab==="regs"   &&<RegsPage t={t} lang={lang}/>}
            {tab==="portal"&&!client &&<ClientLogin setClient={setClient} setTab={setTab} t={t} lang={lang}/>}
            {client&&tab==="dash"    &&<ClientDash client={client} setTab={setTab} t={t} lang={lang}/>}
            {client&&tab==="tasks"   &&<TasksPage t={t} lang={lang}/>}
            {client&&tab==="docs"    &&<DocsPage t={t} lang={lang}/>}
            {client&&tab==="forms"   &&<FormsPage t={t} lang={lang}/>}
            {client&&tab==="chat"    &&<ChatPage client={client} t={t} lang={lang}/>}
            {client&&tab==="billing" &&<BillingPage t={t} lang={lang}/>}
          </div>
        </div>
        <BottomNav tab={tab} setTab={setTab} isClient={isClient} t={t}/>
      </div>
    </>
  );
}