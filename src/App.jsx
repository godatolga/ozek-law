import { useState, useEffect, useRef, useCallback } from "react";

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
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
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
`;

const LANGS={en:{code:"en",label:"EN",name:"English",dir:"ltr"},tr:{code:"tr",label:"TR",name:"Türkçe",dir:"ltr"},ar:{code:"ar",label:"عر",name:"العربية",dir:"rtl"},es:{code:"es",label:"ES",name:"Español",dir:"ltr"},ru:{code:"ru",label:"РУ",name:"Русский",dir:"ltr"},zh:{code:"zh",label:"中文",name:"中文",dir:"ltr"}};

const EN={
  tagline:"Immigration · Business · Litigation",heroTitle:"Your Path to",heroEm:"Legal Clarity",
  heroSub:"Immigration, business law, litigation, and corporate counsel — a full-service firm guiding individuals and companies through every legal challenge.",
  clientLogin:"Client Login",scheduleNow:"Schedule Now",consultation:"Consultation",
  practiceAreas:"Practice Areas",latestUpdates:"Latest Insights",seeAll:"See all →",
  home:"Home",news:"News",uscis:"USCIS",rules:"Rules",portal:"Portal",
  dash:"Home",tasks:"Tasks",docs:"Docs",forms:"Forms",ask:"Ask",bills:"Bills",
  newsTitle:"News & Updates",newsSub:"Immigration, business law & litigation insights",
  newsletter:"Weekly Newsletter",newsletterSub:"Policy updates & case law alerts",
  emailPlaceholder:"your@email.com",joinBtn:"Join",subscribed:"✓ Subscribed!",
  instagramReels:"Instagram Reels",follow:"@ozeklaw ↗",articles:"Articles",
  pastNewsletters:"Past Newsletters",visaBulletin:"Visa Bulletin",visaBulletinSub:"Monthly DOS visa availability updates",
  uscisTitle:"USCIS Case Status",uscisSub:"Track your immigration case in real time",
  receiptNumber:"Receipt Number",receiptPlaceholder:"e.g. WAC2315151234",
  checkStatus:"Check Status",checking:"Checking…",orVisit:"Or visit",statusFound:"Status Found",receiptGuide:"Receipt Prefix Guide",
  processingTimesTitle:"Processing Times",processingTimesSub:"Updated monthly by USCIS",
  selectForm:"Select Form",viewTimes:"View Official Times ↗",processingNote:"Government-announced processing times for your form and office.",
  regsTitle:"Business & Regulations",regsSub:"Resources for entrepreneurs & businesses",officialResources:"Official Resources",
  clientAlerts:"Client Alerts",clientAlertsSub:"Important legal changes",practiceAreasTitle:"Practice Area Articles",practiceAreasSub:"In-depth guides from Ozek Law attorneys",viewAll:"View All ↗",
  portalTitle:"Client Portal",portalSub:"Secure access via Docketwise",clientIdLabel:"Client ID",clientIdPlaceholder:"e.g. OZ001",
  passwordLabel:"Password",passwordPlaceholder:"••••••••",signIn:"Sign In → Docketwise",signingIn:"Opening portal…",incorrectCreds:"Incorrect ID or password",
  goodMorning:"Good morning,",nextAction:"Next Action",openTasks:"Open Tasks",amountDue:"Amount Due",matters:"Matters",newDocs:"New Docs",
  quickActions:"Quick Actions",upload:"Upload",askAtty:"Ask Atty",formsLabel:"Forms",docketwise:"Docketwise",
  yourMatters:"Your Matters",syncedWith:"Synced with Docketwise",syncedSub:"Tasks & deadlines update live.",open:"Open ↗",activeMatter:"Active",
  myTasks:"My Tasks",syncedFrom:"Synced from Docketwise",live:"Live",
  documents:"Documents",docsSub:"Upload and manage your case files",uploadFile:"Upload",pdfTypes:"PDF · JPG · PNG",scanDoc:"Scan",useCamera:"Use camera",scanning:"Scanning…",allFiles:"All Files",
  legalForms:"Legal Forms",formsSub:"Immigration, business & litigation forms",submitToAtty:"Submit to Attorney",saveDraft:"Save",submitted:"Submitted!",submittedSub:"Your form has been sent to your attorney for review.",submitAnother:"Submit Another",back:"Back",
  askAttorney:"Ask Atty. Tolga Ozek",askSub:"Messages sent directly via WhatsApp",askPlaceholder:"Type your legal question…",sendBtn:"Send",whatsappSent:"Opening WhatsApp for Atty. Tolga Ozek…",
  billing:"Billing",billingSub:"Account summary & invoices",amountDueLabel:"Amount Due",paidLabel:"Paid (2026)",paymentRequired:"Payment Required",payNow:"Pay Now",invoices:"Invoices",signOut:"Sign Out",
  quickQ:["How long does I-485 take?","How do I form an LLC?","How does litigation work?","What is breach of contract?"],
  practiceList:[{icon:"🛂",title:"Immigration",sub:"Visas & Green Cards"},{icon:"⚖️",title:"Litigation",sub:"Courts & Disputes"},{icon:"🏢",title:"Business Law",sub:"Formation & Compliance"},{icon:"📑",title:"Corporate",sub:"Contracts & Transactions"},{icon:"🛡️",title:"Removal Defense",sub:"Appeals & Hearings"},{icon:"🤝",title:"Asylum",sub:"Humanitarian Relief"}],
  statLabels:{Done:"Done",Pending:"Pending",Progress:"In Progress",Scheduled:"Scheduled"},
};
const I18N={
  en:EN,
  ar:Object.assign({},EN,{tagline:"هجرة · أعمال · تقاضٍ",heroTitle:"طريقك إلى",heroEm:"الوضوح القانوني",heroSub:"هجرة، قانون أعمال، تقاضٍ — مكتب متكامل.",clientLogin:"بوابة العملاء",scheduleNow:"احجز الآن",home:"الرئيسية",news:"الأخبار",rules:"اللوائح",portal:"البوابة",dash:"الرئيسية",tasks:"المهام",docs:"المستندات",forms:"النماذج",ask:"اسأل",bills:"الفواتير",signOut:"خروج",goodMorning:"صباح الخير،",signIn:"تسجيل الدخول",back:"رجوع",askAttorney:"اسأل المحامي",billing:"الفواتير",practiceList:[{icon:"🛂",title:"الهجرة",sub:"تأشيرات"},{icon:"⚖️",title:"التقاضي",sub:"المحاكم"},{icon:"🏢",title:"قانون الأعمال",sub:"التأسيس"},{icon:"📑",title:"الشركات",sub:"العقود"},{icon:"🛡️",title:"الدفاع",sub:"الاستئنافات"},{icon:"🤝",title:"اللجوء",sub:"إنساني"}],statLabels:{Done:"مكتمل",Pending:"معلّق",Progress:"قيد التنفيذ",Scheduled:"مجدول"}}),
  tr:Object.assign({},EN,{tagline:"Göçmenlik · İş · Dava",heroTitle:"Hukuki Netliğe",heroEm:"Giden Yolunuz",home:"Ana",news:"Haberler",rules:"Kurallar",portal:"Portal",dash:"Ana",tasks:"Görevler",docs:"Belgeler",forms:"Formlar",ask:"Sor",bills:"Faturalar",signOut:"Çıkış",goodMorning:"Günaydın,",signIn:"Giriş Yap",back:"Geri",billing:"Faturalar",practiceList:[{icon:"🛂",title:"Göçmenlik",sub:"Vize"},{icon:"⚖️",title:"Dava",sub:"Mahkemeler"},{icon:"🏢",title:"İş Hukuku",sub:"Kuruluş"},{icon:"📑",title:"Kurumsal",sub:"Sözleşmeler"},{icon:"🛡️",title:"Sınır Dışı",sub:"İtirazlar"},{icon:"🤝",title:"Sığınma",sub:"İnsani"}],statLabels:{Done:"Tamamlandı",Pending:"Bekliyor",Progress:"Devam Ediyor",Scheduled:"Planlandı"}}),
  es:Object.assign({},EN,{tagline:"Inmigración · Negocios · Litigios",heroTitle:"Su Camino hacia la",heroEm:"Claridad Legal",home:"Inicio",news:"Noticias",rules:"Normas",dash:"Inicio",tasks:"Tareas",docs:"Docs",forms:"Formularios",ask:"Preguntar",bills:"Facturas",signOut:"Salir",goodMorning:"Buenos días,",signIn:"Iniciar Sesión",back:"Volver",billing:"Facturación",practiceList:[{icon:"🛂",title:"Inmigración",sub:"Visas"},{icon:"⚖️",title:"Litigios",sub:"Tribunales"},{icon:"🏢",title:"Empresarial",sub:"Constitución"},{icon:"📑",title:"Corporativo",sub:"Contratos"},{icon:"🛡️",title:"Deportación",sub:"Apelaciones"},{icon:"🤝",title:"Asilo",sub:"Humanitario"}],statLabels:{Done:"Completado",Pending:"Pendiente",Progress:"En Progreso",Scheduled:"Programado"}}),
  ru:Object.assign({},EN,{tagline:"Иммиграция · Бизнес · Суд",heroTitle:"Ваш путь к",heroEm:"правовой ясности",home:"Главная",news:"Новости",rules:"Нормы",dash:"Главная",tasks:"Задачи",docs:"Документы",forms:"Формы",ask:"Вопрос",bills:"Счета",signOut:"Выйти",goodMorning:"Доброе утро,",signIn:"Войти",back:"Назад",billing:"Счета",practiceList:[{icon:"🛂",title:"Иммиграция",sub:"Визы"},{icon:"⚖️",title:"Суд",sub:"Споры"},{icon:"🏢",title:"Корпоративное",sub:"Регистрация"},{icon:"📑",title:"Контракты",sub:"Сделки"},{icon:"🛡️",title:"Депортация",sub:"Защита"},{icon:"🤝",title:"Убежище",sub:"Гуманитарное"}],statLabels:{Done:"Завершено",Pending:"Ожидает",Progress:"В процессе",Scheduled:"Запланировано"}}),
  zh:Object.assign({},EN,{tagline:"移民 · 商业 · 诉讼",heroTitle:"通往",heroEm:"法律清晰之路",home:"首页",news:"新闻",rules:"法规",dash:"首页",tasks:"任务",docs:"文件",forms:"表格",ask:"提问",bills:"账单",signOut:"退出",goodMorning:"早上好，",signIn:"登录",back:"返回",billing:"账单",practiceList:[{icon:"🛂",title:"移民",sub:"签证"},{icon:"⚖️",title:"诉讼",sub:"法院"},{icon:"🏢",title:"商业法",sub:"成立"},{icon:"📑",title:"企业",sub:"合同"},{icon:"🛡️",title:"驱逐辩护",sub:"上诉"},{icon:"🤝",title:"庇护",sub:"人道"}],statLabels:{Done:"已完成",Pending:"待处理",Progress:"进行中",Scheduled:"已安排"}}),
};

const USCIS_FORMS=["I-90","I-130","I-131","I-140","I-485","I-526","I-539","I-589","I-601A","I-751","I-765","I-821","I-821D","N-400","N-565","N-600"];
const CLIENTS=[
  {id:"OZ001",name:"Maria Garcia",pass:"garcia2024",caseNum:"WAC2315151234",matters:["Family-Based I-130","I-485 Adjustment"],atty:"Atty. Tolga Ozek",avatar:"MG",next:"Apr 10 – Submit I-485 Docs"},
  {id:"OZ002",name:"James Chen",pass:"chen2024",caseNum:"EAC2309874321",matters:["EB-2 NIW","I-140 Petition"],atty:"Atty. Tolga Ozek",avatar:"JC",next:"Apr 5 – Medical Exam"},
  {id:"OZ003",name:"Priya Patel",pass:"patel2024",caseNum:"SRC2312345678",matters:["H-1B Extension","H-4 Dependent"],atty:"Atty. Tolga Ozek",avatar:"PP",next:"Apr 20 – Biometrics"},
  {id:"OZ004",name:"Nexus Corp LLC",pass:"nexus2024",caseNum:"BIZ2316001234",matters:["Commercial Litigation","Contract Review"],atty:"Atty. Tolga Ozek",avatar:"NC",next:"Apr 12 – Deposition Prep"},
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
const ARTICLE_TITLES={en:["New USCIS Fee Schedule 2026","H-1B Cap Season: Full Breakdown","Commercial Litigation: What to Expect","LLC vs S-Corp: Which Is Right?","DACA: Recent Court Decisions","Contract Disputes & Breach"],ar:["جدول رسوم USCIS","موسم H-1B","التقاضي التجاري","LLC مقابل S-Corp","DACA","نزاعات العقود"],tr:["USCIS Tarifesi","H-1B Sezonu","Ticari Dava","LLC mi S-Corp mi?","DACA","Sözleşme"],es:["Arancel USCIS 2026","Temporada H-1B","Litigio Comercial","LLC vs S-Corp","DACA","Disputas"],ru:["Тариф USCIS 2026","Сезон H-1B","Коммерческий спор","LLC или S-Corp","DACA","Нарушение договора"],zh:["USCIS新费用","H-1B配额季","商业诉讼","LLC还是S-Corp","DACA裁决","合同纠纷"]};
const CLIENT_ALERTS=[
  {emoji:"⚠️",tag:"ALERT",color:C.red,tagBg:C.redBg,date:"Mar 2026",title:"Corporate Transparency Act – BOI Deadline",body:"FinCEN BOI reporting now required for most LLCs and corporations. Non-compliance may result in significant civil and criminal penalties."},
  {emoji:"🏛️",tag:"UPDATE",color:C.blue,tagBg:C.blueBg,date:"Mar 2026",title:"USCIS Fee Increases – April 1, 2026",body:"New fees for I-485, I-130, I-140. Review your case timeline to avoid delays."},
  {emoji:"📑",tag:"ALERT",color:C.amber,tagBg:C.amberBg,date:"Feb 2026",title:"New Employment Contract Rules – CA, NY, IL",body:"Non-compete and arbitration clause changes now in effect. Existing agreements may need review."},
  {emoji:"🛡️",tag:"POLICY",color:C.purple,tagBg:C.purpleBg,date:"Feb 2026",title:"H-1B Cap Registration Window: Mar 7–21",body:"Employers must register during the designated window. Prepare petitions now."},
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

const priColor=p=>({High:{bg:C.redBg,c:C.red},Med:{bg:C.amberBg,c:"#B8860B"},Low:{bg:C.greenBg,c:C.green}}[p]||{bg:"rgba(255,255,255,0.08)",c:C.md});
const statColor=s=>({Done:{bg:C.greenBg,c:C.green},Pending:{bg:C.amberBg,c:"#B8860B"},Progress:{bg:C.blueBg,c:C.blue},Scheduled:{bg:C.purpleBg,c:C.purple}}[s]||{bg:"rgba(255,255,255,0.08)",c:C.md});

function Badge({children,color,bg,small}){return <span style={{display:"inline-flex",alignItems:"center",background:bg||"rgba(255,255,255,0.10)",color:color||C.md,fontSize:small?9:10,fontWeight:600,padding:small?"2px 7px":"3px 10px",borderRadius:99,letterSpacing:0.3,whiteSpace:"nowrap"}}>{children}</span>;}
function Divider({light}){return <div style={{height:"1px",background:light?"rgba(0,0,0,0.07)":"rgba(255,255,255,0.07)"}}/>;}
function Avatar({initials,size=40,gold=false}){return <div style={{width:size,height:size,borderRadius:size/2,flexShrink:0,background:gold?C.gold:"rgba(201,168,76,0.16)",border:gold?"none":"1px solid rgba(201,168,76,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.33,fontWeight:700,color:gold?"#0F1923":C.gold}}>{initials}</div>;}

function GoldBtn({children,onPress,full,sm,outline,style={}}){
  const[p,setP]=useState(false);
  return <button onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} onMouseLeave={()=>setP(false)} onTouchStart={()=>setP(true)} onTouchEnd={()=>setP(false)} onClick={onPress} style={{background:outline?"rgba(201,168,76,0.12)":C.gold,border:outline?"1.5px solid rgba(201,168,76,0.40)":"none",color:outline?C.gold:"#0F1923",borderRadius:sm?12:16,padding:sm?"9px 18px":"15px 24px",fontSize:sm?13:15,fontWeight:700,width:full?"100%":"auto",transform:p?"scale(0.97)":"scale(1)",transition:"all 0.14s cubic-bezier(0.34,1.2,0.64,1)",display:"inline-flex",alignItems:"center",justifyContent:"center",boxShadow:outline?"none":`0 4px 18px ${C.goldGlow}`,letterSpacing:0.2,...style}}>{children}</button>;
}

function BookingModal({onClose}){
  const[selDay,setSelDay]=useState(null);
  const[selTime,setSelTime]=useState(null);
  const[done,setDone]=useState(false);
  const today=new Date();
  const days=Array.from({length:18},(_,i)=>{const d=new Date(today);d.setDate(today.getDate()+i+1);const wd=d.getDay();return{date:d,label:d.toLocaleDateString("en-US",{weekday:"short"}),num:d.getDate(),month:d.toLocaleDateString("en-US",{month:"short"}),disabled:wd===0||wd===6};}).filter(d=>!d.disabled);
  const slots=["9:00 AM","10:00 AM","11:00 AM","2:00 PM","3:00 PM","4:00 PM"];
  const confirm=()=>{
    if(!selDay||!selTime)return;
    const dateStr=selDay.date.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"});
    const msg=encodeURIComponent("Hello, I'd like to schedule a consultation with Ozek Law Firm.\n\nDate: "+dateStr+"\nTime: "+selTime+"\n\nPlease confirm my appointment.");
    window.open("https://wa.me/12028548545?text="+msg,"_blank");
    setDone(true);
  };
  return(
    <div style={{position:"fixed",inset:0,zIndex:500,display:"flex",flexDirection:"column",justifyContent:"flex-end"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.65)",backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)"}}/>
      <div className="modal-enter" style={{position:"relative",background:"#0D1628",borderRadius:"28px 28px 0 0",height:"92vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 -2px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.14)"}}>
        <div style={{display:"flex",justifyContent:"center",padding:"12px 0 4px"}}><div style={{width:36,height:4,borderRadius:2,background:"rgba(255,255,255,0.18)"}}/></div>
        <div style={{overflow:"auto",padding:"4px 22px 28px"}}>
          {done?(
            <div style={{textAlign:"center",padding:"32px 0 16px"}}>
              <div style={{fontSize:52,marginBottom:16}}>✅</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,color:"#FFF",marginBottom:8}}>Booking Requested</h3>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.6)",lineHeight:1.6,marginBottom:24}}>{selDay&&selDay.date.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})} at {selTime}<br/>Atty. Tolga Ozek will confirm via WhatsApp.</p>
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
                {days.map((d,i)=>{const sel=selDay===d;return(
                  <button key={i} onClick={()=>setSelDay(d)} style={{flexShrink:0,width:54,padding:"10px 0",borderRadius:16,background:sel?"#C9A84C":"rgba(255,255,255,0.06)",border:sel?"none":"1px solid rgba(255,255,255,0.09)",cursor:"pointer",textAlign:"center",boxShadow:sel?"0 4px 16px rgba(201,168,76,0.3)":"none",transition:"all 0.18s cubic-bezier(0.34,1.2,0.64,1)",transform:sel?"scale(1.08)":"scale(1)"}}>
                    <div style={{fontSize:9,color:sel?"rgba(15,25,35,0.7)":"rgba(255,255,255,0.4)",marginBottom:3,fontWeight:600,textTransform:"uppercase"}}>{d.label}</div>
                    <div style={{fontSize:18,fontWeight:800,color:sel?"#0F1923":"#FFF",fontFamily:"'Playfair Display',serif"}}>{d.num}</div>
                    <div style={{fontSize:9,color:sel?"rgba(15,25,35,0.6)":"rgba(255,255,255,0.3)",marginTop:2}}>{d.month}</div>
                  </button>
                );})}
              </div>
              <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:1.2,textTransform:"uppercase",marginBottom:10}}>Select Time</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:22}}>
                {slots.map(s=>{const sel=selTime===s;return(
                  <button key={s} onClick={()=>setSelTime(s)} style={{padding:"12px 0",borderRadius:14,background:sel?"#C9A84C":"rgba(255,255,255,0.06)",border:sel?"none":"1px solid rgba(255,255,255,0.09)",color:sel?"#0F1923":"#FFF",fontSize:13,fontWeight:600,cursor:"pointer",transition:"all 0.18s",transform:sel?"scale(1.04)":"scale(1)",boxShadow:sel?"0 4px 14px rgba(201,168,76,0.28)":"none"}}>{s}</button>
                );})}
              </div>
              <button onClick={confirm} disabled={!selDay||!selTime} style={{width:"100%",background:selDay&&selTime?"#C9A84C":"rgba(255,255,255,0.08)",color:selDay&&selTime?"#0F1923":"rgba(255,255,255,0.3)",border:"none",borderRadius:16,padding:"16px",fontSize:15,fontWeight:700,cursor:selDay&&selTime?"pointer":"not-allowed",transition:"all 0.2s",boxShadow:selDay&&selTime?"0 6px 24px rgba(201,168,76,0.28)":"none"}}>
                {selDay&&selTime?"Confirm via WhatsApp ↗":"Select date & time"}
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
            <circle cx={45} cy={45} r={r} fill="none" stroke="#C9A84C" strokeWidth={6} strokeDasharray={circum} strokeDashoffset={dash} strokeLinecap="round" style={{transition:"stroke-dashoffset 1s cubic-bezier(0.22,1,0.36,1)"}}/>
          </svg>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:18,fontWeight:800,color:"#C9A84C",fontFamily:"'Playfair Display',serif",lineHeight:1}}>{pct}%</div>
            <div style={{fontSize:8,color:"#8492A6",marginTop:2,letterSpacing:0.5}}>DONE</div>
          </div>
        </div>
        <div style={{flex:1}}>
          <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:"#C9A84C",fontWeight:600,marginBottom:4}}>CASE PROGRESS</div>
          <div style={{fontSize:13,fontWeight:700,color:"#0F1923",marginBottom:3,lineHeight:1.3}}>{client.matters[0]}</div>
          <div style={{fontSize:11,color:"#8492A6",marginBottom:6}}>{done} of {TIMELINE.length} milestones complete</div>
          {TIMELINE.find(s=>s.active)&&<div style={{background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.22)",borderRadius:10,padding:"5px 10px",fontSize:10,color:"#9A7A2E",fontWeight:600,display:"inline-block"}}>Next: {TIMELINE.find(s=>s.active).step}</div>}
        </div>
        <div style={{color:"#C9A84C",fontSize:12,transform:expanded?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s",flexShrink:0}}>▾</div>
      </div>
      {expanded&&(
        <div className="pop-in">
          <div style={{height:1,background:"rgba(0,0,0,0.06)",margin:"14px 0"}}/>
          <div style={{position:"relative",paddingLeft:4}}>
            <div style={{position:"absolute",left:14,top:0,bottom:0,width:2,background:"rgba(0,0,0,0.06)",borderRadius:1}}/>
            {TIMELINE.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:i<TIMELINE.length-1?14:0,position:"relative"}}>
                <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,background:s.done?"#C9A84C":s.active?"rgba(201,168,76,0.15)":"rgba(0,0,0,0.05)",border:s.active?"2px solid #C9A84C":"2px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,zIndex:1,boxShadow:s.done?"0 2px 8px rgba(201,168,76,0.25)":s.active?"0 0 0 4px rgba(201,168,76,0.12)":"none"}}>
                  {s.done?"✓":s.icon}
                </div>
                <div style={{paddingTop:3}}>
                  <div style={{fontSize:12,fontWeight:s.active||s.done?700:500,color:s.done?"#0F1923":s.active?"#9A7A2E":"#8492A6",marginBottom:1}}>{s.step}</div>
                  <div style={{fontSize:10,color:"#8492A6"}}>{s.date}</div>
                  {s.active&&<span style={{background:"rgba(201,168,76,0.12)",color:"#9A7A2E",fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:99,letterSpacing:0.5,marginTop:4,display:"inline-block"}}>IN PROGRESS</span>}
                </div>
              </div>
            ))}
          </div>
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
        <div style={{position:"absolute",top:"calc(100% + 8px)",right:0,background:"rgba(10,18,35,0.95)",backdropFilter:"blur(32px)",WebkitBackdropFilter:"blur(32px)",border:"1px solid rgba(255,255,255,0.10)",borderRadius:18,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,0.5)",minWidth:140}}>
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
  const[time,setTime]=useState("");
  useEffect(()=>{const u=()=>setTime(new Date().toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"}));u();const id=setInterval(u,30000);return()=>clearInterval(id);},[]);
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 20px 10px",background:"rgba(8,15,30,0.85)",backdropFilter:"blur(40px)",WebkitBackdropFilter:"blur(40px)",borderBottom:"1px solid rgba(255,255,255,0.07)",flexShrink:0,position:"sticky",top:0,zIndex:100}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:C.hi,letterSpacing:-0.3}}>Ozek Law</div>
        {time&&<div style={{fontSize:11,color:C.lo,fontWeight:300}}>{time}</div>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {client&&<button onClick={()=>{setClient(null);setTab("home");}} style={{fontSize:12,color:C.lo,fontWeight:500,background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:99,padding:"5px 12px"}}>{t.signOut}</button>}
        <LangSwitcher lang={lang} setLang={setLang}/>
      </div>
    </div>
  );
}

function BottomNav({tab,setTab,isClient,t}){
  const pub=[{id:"home",icon:"⚖️",label:t.home},{id:"news",icon:"📰",label:t.news},{id:"uscis",icon:"🛂",label:t.uscis},{id:"regs",icon:"🏛️",label:t.rules},{id:"portal",icon:"🔐",label:t.portal}];
  const cli=[{id:"dash",icon:"🏠",label:t.dash},{id:"tasks",icon:"✅",label:t.tasks},{id:"docs",icon:"📁",label:t.docs},{id:"forms",icon:"📋",label:t.formsLabel},{id:"chat",icon:"💬",label:t.ask},{id:"billing",icon:"💳",label:t.bills}];
  const tabs=isClient?cli:pub;
  return(
    <nav className="tab-bar" style={{display:"flex",padding:"10px 0 12px",flexShrink:0}}>
      {tabs.map(tb=>{
        const active=tab===tb.id;
        return(
          <button key={tb.id} onClick={()=>setTab(tb.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"2px 0"}}>
            <div style={{width:36,height:28,borderRadius:10,background:active?"rgba(201,168,76,0.18)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",transform:active?"scale(1.08)":"scale(1)"}}>
              <span style={{fontSize:18,opacity:active?1:0.3,transition:"opacity 0.2s"}}>{tb.icon}</span>
            </div>
            <span style={{fontSize:9,fontWeight:active?700:400,color:active?C.gold:C.lo,transition:"all 0.2s"}}>{tb.label}</span>
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
        <div style={{position:"absolute",inset:0,background:"linear-gradient(145deg,#060C1A 0%,#0A1628 50%,#0D1E3A 100%)"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 80% 60% at 75% 15%,rgba(201,168,76,0.11) 0%,transparent 55%)"}}/>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 60% 50% at 15% 85%,rgba(10,132,255,0.07) 0%,transparent 55%)"}}/>
        {[[320,320,-60,-100,0.08],[200,200,30,-60,0.05],[150,150,-20,100,0.04]].map(([w,h,tt,r,o],i)=>(
          <div key={i} style={{position:"absolute",width:w,height:h,top:tt,right:r,borderRadius:"50%",border:`1px solid rgba(201,168,76,${o})`,pointerEvents:"none"}}/>
        ))}
        <div style={{position:"relative",padding:"28px 22px 32px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:32}}>
            <div style={{fontSize:9,color:C.lo,letterSpacing:2,textTransform:"uppercase"}}>{t.tagline}</div>
            <button onClick={()=>setTab("portal")} style={{background:C.gold,color:"#0F1923",border:"none",borderRadius:12,padding:"9px 18px",fontSize:12,fontWeight:700,cursor:"pointer",boxShadow:`0 4px 20px ${C.goldGlow}`,flexShrink:0}}>{t.clientLogin}</button>
          </div>
          <div style={{marginBottom:24}}>
            <div style={{width:32,height:2.5,background:C.gold,borderRadius:2,marginBottom:16}}/>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:34,lineHeight:1.15,color:C.hi,marginBottom:14,fontWeight:700,letterSpacing:-0.8}}>
              {t.heroTitle}<br/><span style={{color:C.gold,fontStyle:"italic"}}>{t.heroEm}</span>
            </h1>
            <p style={{fontSize:13,color:C.md,lineHeight:1.72,fontWeight:300,maxWidth:340}}>{t.heroSub}</p>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:32}}>
            <button onClick={()=>window.open("https://wa.me/12028548545?text=Hello%2C+I+would+like+to+schedule+a+consultation+with+Ozek+Law+Firm.","_blank")} style={{flex:3,background:C.gold,color:"#0F1923",border:"none",borderRadius:14,padding:"14px 0",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:`0 6px 24px ${C.goldGlow}`}}>{t.scheduleNow} ↗</button>
            <button onClick={()=>setShowBooking(true)} style={{flex:2,background:"rgba(255,255,255,0.07)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",color:C.md,border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,padding:"14px 0",fontSize:12,fontWeight:500,cursor:"pointer"}}>📅 Book Slot</button>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",background:"rgba(255,255,255,0.05)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid rgba(255,255,255,0.08)",padding:"14px 0"}}>
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
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:28}}>
          {t.practiceList.map((p,i)=>(
            <div key={p.title} onClick={()=>window.open("https://ozeklaw.com/practiceareas/","_blank")} style={{background:i%2===0?"#F7F5F2":"rgba(201,168,76,0.08)",border:i%2===0?"1px solid rgba(0,0,0,0.06)":"1px solid rgba(201,168,76,0.20)",boxShadow:"0 2px 10px rgba(0,0,0,0.05)",borderRadius:22,padding:"18px 16px 16px",cursor:"pointer",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:-12,right:-12,width:56,height:56,borderRadius:"50%",background:"rgba(201,168,76,0.06)"}}/>
              <div style={{fontSize:26,marginBottom:11}}>{p.icon}</div>
              <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:4,lineHeight:1.2}}>{p.title}</div>
              <div style={{fontSize:11,color:C.inkMd,lineHeight:1.4}}>{p.sub}</div>
              <div style={{position:"absolute",bottom:12,right:14,color:C.gold,fontSize:15,fontWeight:700,opacity:0.7}}>›</div>
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
            <div style={{width:48,height:48,borderRadius:14,flexShrink:0,background:"rgba(255,255,255,0.07)",border:"1px solid rgba(255,255,255,0.09)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{a.emoji}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:7,marginBottom:5,alignItems:"center"}}>
                <Badge bg={C.goldPale} color={C.gold}>{a.cat}</Badge>
                <span style={{fontSize:10,color:C.lo}}>{a.read}</span>
              </div>
              <div style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.35}}>{(ARTICLE_TITLES[lang]||ARTICLE_TITLES.en)[i]}</div>
            </div>
            <span style={{color:C.gold,fontSize:18,flexShrink:0,opacity:0.7}}>›</span>
          </div>
        ))}
      </div>

      <div style={{margin:"0",padding:"28px 22px 28px",background:"#FFFFFF"}}>
        <div style={{background:"rgba(201,168,76,0.13)",backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",border:"1px solid rgba(201,168,76,0.32)",boxShadow:"inset 0 1px 0 rgba(255,220,100,0.20),0 8px 40px rgba(0,0,0,0.25)",borderRadius:24,padding:"24px 22px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-24,right:-24,width:100,height:100,borderRadius:"50%",background:"rgba(201,168,76,0.10)"}}/>
          <div style={{position:"relative"}}>
            <div style={{fontSize:28,marginBottom:10}}>📞</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:C.ink,marginBottom:8,letterSpacing:-0.3}}>{t.consultation}</h3>
            <p style={{fontSize:13,color:C.inkMd,marginBottom:18,lineHeight:1.6,fontWeight:300}}>{t.heroSub.slice(0,90)}…</p>
            <button onClick={()=>window.open("https://wa.me/12028548545?text=Hello%2C+I+would+like+to+schedule+a+consultation+with+Ozek+Law+Firm.","_blank")} style={{width:"100%",background:C.gold,color:"#0F1923",border:"none",borderRadius:14,padding:"15px",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:`0 6px 24px ${C.goldGlow}`}}>{t.scheduleNow} via WhatsApp ↗</button>
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
  const dir=LANGS[lang].dir;
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 80% 20%,rgba(201,168,76,0.10),transparent)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>UPDATES</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:C.hi,letterSpacing:-0.5,marginBottom:4}}>{t.newsTitle}</h1>
          <p style={{fontSize:12,color:C.md,fontWeight:300}}>{t.newsSub}</p>
        </div>
      </div>
      <div style={{padding:"20px 18px 100px"}}>
        <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:18,boxShadow:"0 1px 12px rgba(0,0,0,0.06)",border:"1px solid rgba(0,0,0,0.05)"}}>
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
          <div key={i} onClick={()=>window.open("https://ozeklaw.com/newsletter/","_blank")} style={{display:"flex",gap:12,alignItems:"center",background:"#FFFFFF",borderRadius:18,padding:"14px",marginBottom:9,boxShadow:"0 1px 8px rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.05)",cursor:"pointer"}}>
            <div style={{width:44,height:44,borderRadius:12,background:"rgba(201,168,76,0.10)",border:"1px solid rgba(201,168,76,0.18)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{a.emoji}</div>
            <div style={{flex:1}}>
              <div style={{display:"flex",gap:6,marginBottom:4}}><Badge bg="rgba(201,168,76,0.12)" color={C.goldDim}>{a.cat}</Badge><span style={{fontSize:10,color:C.inkLo}}>{a.read}</span></div>
              <div style={{fontSize:13,fontWeight:600,color:C.ink,lineHeight:1.3}}>{(ARTICLE_TITLES[lang]||ARTICLE_TITLES.en)[i]}</div>
            </div>
            <span style={{color:C.gold,fontSize:16,opacity:0.7}}>›</span>
          </div>
        ))}
        <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noreferrer" style={{display:"block",textDecoration:"none",marginTop:20}}>
          <div style={{background:"linear-gradient(135deg,#0A1628,#1A2F50)",borderRadius:20,padding:"18px",display:"flex",gap:14,alignItems:"center"}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(201,168,76,0.18)",border:"1px solid rgba(201,168,76,0.30)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:22}}>📅</div>
            <div style={{flex:1}}>
              <div style={{fontSize:13,fontWeight:700,color:C.hi,marginBottom:3}}>{t.visaBulletin}</div>
              <div style={{fontSize:11,color:C.md}}>{t.visaBulletinSub}</div>
              <div style={{fontSize:10,color:C.gold,marginTop:5,fontWeight:600}}>travel.state.gov ↗</div>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

function USCISPage({t,lang}){
  const[num,setNum]=useState("");const[res,setRes]=useState(null);const[loading,setLoading]=useState(false);const[selForm,setSelForm]=useState("I-485");
  const dir=LANGS[lang].dir;
  const check=()=>{if(!num.trim())return;setLoading(true);setRes(null);setTimeout(()=>{setRes({status:"Case Was Received and A Receipt Notice Was Emailed",updated:"March 18, 2026",form:"I-485",center:"Nebraska Service Center"});setLoading(false);},1400);};
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px"}}>
        <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>IMMIGRATION</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:C.hi,letterSpacing:-0.5,marginBottom:4}}>{t.uscisTitle}</h1>
        <p style={{fontSize:12,color:C.md,fontWeight:300}}>{t.uscisSub}</p>
      </div>
      <div style={{padding:"20px 18px 100px"}}>
        <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:14,boxShadow:"0 1px 12px rgba(0,0,0,0.06)",border:"1px solid rgba(0,0,0,0.05)"}}>
          <div style={{fontSize:10,color:C.inkLo,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>{t.receiptNumber}</div>
          <input value={num} onChange={e=>setNum(e.target.value.toUpperCase())} placeholder={t.receiptPlaceholder} style={{width:"100%",background:"rgba(0,0,0,0.04)",border:"1.5px solid rgba(0,0,0,0.08)",borderRadius:13,padding:"13px 16px",color:C.ink,fontSize:15,outline:"none",letterSpacing:1.5,marginBottom:12,fontFamily:"monospace"}}/>
          <GoldBtn full onPress={check} style={{color:"#0F1923"}}>{loading?t.checking:t.checkStatus}</GoldBtn>
          <div style={{textAlign:"center",marginTop:10,fontSize:11,color:C.inkLo}}>{t.orVisit} <a href="https://egov.uscis.gov/casestatus/landing.do" target="_blank" rel="noreferrer" style={{color:C.goldDim,fontWeight:600}}>USCIS.gov ↗</a></div>
        </div>
        {loading&&<div style={{textAlign:"center",padding:20}}><div style={{width:28,height:28,borderRadius:14,border:`3px solid ${C.gold}`,borderTopColor:"transparent",margin:"0 auto 8px",animation:"spin 0.8s linear infinite"}}/></div>}
        {res&&!loading&&(
          <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:14,border:"1.5px solid rgba(201,168,76,0.25)"}}>
            <Badge bg={C.greenBg} color={C.green}>● {t.statusFound}</Badge>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:14,color:C.ink,lineHeight:1.55,margin:"12px 0 14px"}}>{res.status}</div>
            <Divider light/><div style={{height:12}}/>
            {[["Receipt",num],["Form",res.form],["Center",res.center],["Updated",res.updated]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{fontSize:11,color:C.inkLo}}>{l}</span>
                <span style={{fontSize:11,fontWeight:600,color:C.ink,textAlign:"right",maxWidth:"60%"}}>{v}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{background:"rgba(201,168,76,0.09)",borderRadius:20,padding:"18px",marginBottom:20,border:"1px solid rgba(201,168,76,0.22)"}}>
          <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>{t.processingTimesTitle}</div>
          <div style={{position:"relative",marginBottom:12}}>
            <select value={selForm} onChange={e=>setSelForm(e.target.value)} style={{width:"100%",background:"#FFF",border:"1.5px solid rgba(201,168,76,0.30)",borderRadius:13,padding:"12px 36px 12px 14px",color:C.ink,fontSize:14,outline:"none",cursor:"pointer"}}>
              {USCIS_FORMS.map(f=><option key={f} value={f}>{f}</option>)}
            </select>
            <span style={{position:"absolute",right:13,top:"50%",transform:"translateY(-50%)",color:C.gold,pointerEvents:"none",fontSize:12}}>▾</span>
          </div>
          <GoldBtn full onPress={()=>window.open("https://egov.uscis.gov/processing-times/","_blank")} style={{color:"#0F1923"}}>{t.viewTimes}</GoldBtn>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:12}}>{t.receiptGuide}</div>
        {[["EAC","Vermont SC"],["LIN","Nebraska SC"],["SRC","Texas SC"],["WAC","California SC"],["NBC","National Benefits Center"],["IOE","Online / Electronic"]].map(([code,name])=>(
          <div key={code} style={{display:"flex",gap:12,alignItems:"center",padding:"11px 0",borderBottom:"1px solid rgba(0,0,0,0.06)"}}>
            <span style={{background:"#0A1628",color:"#FFF",padding:"5px 10px",borderRadius:8,fontSize:10,fontWeight:700,fontFamily:"monospace"}}>{code}</span>
            <span style={{fontSize:13,color:C.ink}}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegsPage({t,lang}){
  const dir=LANGS[lang].dir;
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px"}}>
        <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>BUSINESS</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:C.hi,letterSpacing:-0.5,marginBottom:4}}>{t.regsTitle}</h1>
        <p style={{fontSize:12,color:C.md,fontWeight:300}}>{t.regsSub}</p>
      </div>
      <div style={{padding:"20px 18px 100px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:14,fontWeight:700,color:C.ink}}>{t.clientAlerts}</div>
          <Badge bg={C.redBg} color={C.red}>Urgent</Badge>
        </div>
        {CLIENT_ALERTS.map((a,i)=>(
          <div key={i} style={{background:"#FFFFFF",borderRadius:18,padding:"14px 16px",marginBottom:10,boxShadow:"0 1px 8px rgba(0,0,0,0.05)",border:"1px solid rgba(0,0,0,0.05)",borderLeft:`3px solid ${a.color}`}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:7}}>
              <span style={{fontSize:16}}>{a.emoji}</span>
              <Badge bg={a.tagBg} color={a.color} small>{a.tag}</Badge>
              <span style={{fontSize:10,color:C.inkLo,marginLeft:"auto"}}>{a.date}</span>
            </div>
            <div style={{fontSize:12,fontWeight:700,color:C.ink,marginBottom:5,lineHeight:1.3}}>{a.title}</div>
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
      <div style={{padding:"40px 24px 100px",position:"relative"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{width:68,height:68,borderRadius:22,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:`0 8px 32px ${C.goldGlow},inset 0 1px 0 rgba(255,255,255,0.3)`}}>
            <span style={{fontSize:22,fontWeight:800,color:"#0F1923",fontFamily:"'Playfair Display',serif"}}>OL</span>
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:C.hi,marginBottom:6,letterSpacing:-0.4}}>{t.portalTitle}</h2>
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
          {err&&<div style={{background:C.redBg,color:C.red,borderRadius:12,padding:"11px 14px",fontSize:12,border:"1px solid rgba(255,69,58,0.20)"}}>{err}</div>}
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
            <div key={s.label} onClick={s.tab?()=>setTab(s.tab):undefined} style={{background:"#FFFFFF",borderRadius:20,padding:"16px",border:"1px solid rgba(0,0,0,0.05)",boxShadow:"0 1px 12px rgba(0,0,0,0.06)",cursor:s.tab?"pointer":"default",borderTop:`3px solid ${s.color}`}}>
              <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
              <div style={{fontSize:10,color:C.inkLo,marginBottom:4}}>{s.label}</div>
              <div style={{fontSize:22,fontWeight:800,color:s.color,fontFamily:"'Playfair Display',serif"}}>{s.val}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>{t.quickActions}</div>
        <div style={{display:"flex",gap:8,marginBottom:22}}>
          {[["📤",t.upload,()=>setTab("docs")],["💬",t.askAtty,()=>setTab("chat")],["📋",t.formsLabel,()=>setTab("forms")],["🔗",t.docketwise,()=>window.open("https://client.docketwise.com","_blank")]].map(([icon,label,fn])=>(
            <button key={label} onClick={fn} className="tap" style={{flex:1,background:"#FFFFFF",border:"1px solid rgba(0,0,0,0.06)",borderRadius:16,padding:"13px 4px",display:"flex",flexDirection:"column",alignItems:"center",gap:5,boxShadow:"0 1px 6px rgba(0,0,0,0.04)",cursor:"pointer"}}>
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
          <div>
            <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>CASE MANAGEMENT</div>
            <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.hi,letterSpacing:-0.4}}>{t.myTasks}</h1>
          </div>
          <Badge bg={C.greenBg} color={C.green}>● {t.live}</Badge>
        </div>
      </div>
      <div style={{padding:"18px 18px 100px"}}>
        {TASKS.map(task=>{
          const sc=statColor(task.status),pc=priColor(task.pri),sl=t.statLabels[task.status]||task.status;
          return(
            <div key={task.id} className="tap" style={{background:"#FFFFFF",borderRadius:20,padding:"16px",marginBottom:10,border:"1px solid rgba(0,0,0,0.05)",boxShadow:"0 1px 10px rgba(0,0,0,0.05)",opacity:task.status==="Done"?0.5:1}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:36,height:36,borderRadius:11,background:sc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                  {task.status==="Done"?"✓":task.status==="Progress"?"⏳":task.status==="Scheduled"?"📅":"○"}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.ink,textDecoration:task.status==="Done"?"line-through":"none",marginBottom:4,lineHeight:1.3}}>{task.title}</div>
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
  const[uploaded,setUploaded]=useState([]);const[scanning,setScanning]=useState(false);const fileRef=useRef();
  const dir=LANGS[lang].dir;
  const existing=[{name:"Passport_Copy.pdf",size:"1.2MB",date:"Mar 1",status:"Verified"},{name:"Birth_Certificate_EN.pdf",size:"456KB",date:"Feb 28",status:"Verified"},{name:"I-94_Record.pdf",size:"89KB",date:"Feb 20",status:"Pending"}];
  const stC=s=>({Verified:{bg:C.greenBg,c:C.green},Uploaded:{bg:C.blueBg,c:C.blue},Scanned:{bg:C.blueBg,c:C.blue},Pending:{bg:C.amberBg,c:"#B8860B"}}[s]||{bg:"rgba(0,0,0,0.05)",c:C.inkLo});
  const scan=()=>{setScanning(true);setTimeout(()=>{setUploaded(p=>[...p,{name:`Scan_${Date.now()}.pdf`,size:"234KB",date:"Today",status:"Scanned"}]);setScanning(false);},2000);};
  return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px"}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.hi,letterSpacing:-0.4}}>{t.documents}</h1>
        <p style={{fontSize:12,color:C.md,fontWeight:300,marginTop:4}}>{t.docsSub}</p>
      </div>
      <div style={{padding:"18px 18px 100px"}}>
        <input ref={fileRef} type="file" multiple accept=".pdf,.jpg,.png" style={{display:"none"}} onChange={e=>Array.from(e.target.files).forEach(f=>setUploaded(p=>[...p,{name:f.name,size:(f.size/1024).toFixed(0)+"KB",date:"Today",status:"Uploaded"}]))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          <button onClick={()=>fileRef.current.click()} style={{background:"#FFFFFF",border:"2px dashed rgba(201,168,76,0.40)",borderRadius:18,padding:"20px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}}>
            <span style={{fontSize:26}}>📤</span><span style={{fontSize:12,fontWeight:600,color:C.ink}}>{t.uploadFile}</span><span style={{fontSize:10,color:C.inkLo}}>{t.pdfTypes}</span>
          </button>
          <button onClick={scan} style={{background:"#FFFFFF",border:"1px solid rgba(0,0,0,0.07)",borderRadius:18,padding:"20px 10px",display:"flex",flexDirection:"column",alignItems:"center",gap:7,cursor:"pointer"}}>
            <span style={{fontSize:26}}>{scanning?"⏳":"📷"}</span><span style={{fontSize:12,fontWeight:600,color:C.ink}}>{scanning?t.scanning:t.scanDoc}</span>
            {scanning?<div style={{width:"70%",height:3,background:"rgba(0,0,0,0.08)",borderRadius:2}}><div style={{height:"100%",width:"60%",background:C.gold,borderRadius:2}}/></div>:<span style={{fontSize:10,color:C.inkLo}}>{t.useCamera}</span>}
          </button>
        </div>
        <div style={{fontSize:13,fontWeight:700,color:C.ink,marginBottom:10}}>{t.allFiles} ({existing.length+uploaded.length})</div>
        {[...existing,...uploaded].map((d,i)=>{const sc=stC(d.status);return(
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
    {id:"i485",title:"Form I-485",sub:"Adjustment of Status",fields:["Full Legal Name","Date of Birth","Country of Birth","A-Number","Current Address","Phone Number","Date of Last Entry","Class of Admission"]},
    {id:"i131",title:"Form I-131",sub:"Travel Document",fields:["Full Legal Name","Date of Birth","Reason for Travel","Document Type","Departure Date","Return Date"]},
    {id:"g1145",title:"Form G-1145",sub:"E-Notification",fields:["Email Address","Phone Number","Preferred Contact"]},
    {id:"biz01",title:"Business Intake",sub:"New Business Client",fields:["Business Name","Entity Type","State of Formation","EIN (if existing)","Primary Contact","Business Address","Nature of Matter","Urgency Level"]},
    {id:"lit01",title:"Litigation Intake",sub:"Civil Dispute",fields:["Full Legal Name","Opposing Party","Court / Jurisdiction","Case Number","Brief Description","Desired Outcome","Key Dates","Documents Available"]},
  ];
  if(done)return(<div dir={dir} style={{padding:"70px 24px",textAlign:"center",background:"#F7F5F2",minHeight:"100%"}}><div style={{fontSize:56,marginBottom:16}}>✅</div><h2 style={{fontFamily:"'Playfair Display',serif",fontSize:24,color:C.ink,marginBottom:8}}>{t.submitted}</h2><p style={{fontSize:14,color:C.inkMd,marginBottom:28,lineHeight:1.6}}>{t.submittedSub}</p><GoldBtn onPress={()=>{setDone(false);setSel(null);setData({})}} style={{color:"#0F1923"}}>{t.submitAnother}</GoldBtn></div>);
  if(sel)return(
    <div dir={dir} style={{background:"#F7F5F2",minHeight:"100%"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px"}}>
        <button onClick={()=>{setSel(null);setData({})}} style={{display:"flex",alignItems:"center",gap:6,color:C.gold,fontSize:13,marginBottom:14,fontWeight:600,background:"none",border:"none",cursor:"pointer"}}>‹ {t.back}</button>
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
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px"}}>
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
  const[msgs,setMsgs]=useState([{role:"assistant",content:`Hello ${client.name.split(" ")[0]}! I'm connected to Atty. Tolga Ozek's WhatsApp. Type your question and it'll be sent directly to him.\n\nCase: ${client.caseNum}`}]);
  const[input,setInput]=useState("");const[sent,setSent]=useState(false);
  const bottomRef=useRef();const dir=LANGS[lang].dir;
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const send=useCallback(()=>{
    if(!input.trim())return;
    setMsgs(p=>[...p,{role:"user",content:input}]);
    const wa=encodeURIComponent(`Message from ${client.name} (${client.caseNum}):\n\n${input}`);
    window.open(`https://wa.me/12028548545?text=${wa}`,"_blank");
    setSent(true);
    setTimeout(()=>{setMsgs(p=>[...p,{role:"assistant",content:`${t.whatsappSent}\n\nAtty. Tolga Ozek will reply on WhatsApp shortly.`}]);setSent(false);},900);
    setInput("");
  },[input,client,t]);
  return(
    <div dir={dir} style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)",background:"#F7F5F2"}}>
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"18px 22px 20px",flexShrink:0}}>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:C.hi,marginBottom:2}}>{t.askAttorney}</h1>
        <p style={{fontSize:11,color:C.md,fontWeight:300}}>{t.askSub}</p>
      </div>
      <div style={{flex:1,overflow:"auto",padding:"14px 16px",display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"80%",padding:"11px 15px",borderRadius:18,fontSize:13,lineHeight:1.6,whiteSpace:"pre-wrap",background:m.role==="user"?C.gold:"#FFFFFF",color:m.role==="user"?"#0F1923":C.ink,boxShadow:m.role==="user"?`0 4px 16px ${C.goldGlow}`:"0 1px 8px rgba(0,0,0,0.07)",borderBottomRightRadius:m.role==="user"?4:18,borderBottomLeftRadius:m.role==="assistant"?4:18}}>{m.content}</div>
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
        <div style={{textAlign:"center",fontSize:10,color:C.inkLo,marginTop:7}}>Messages sent to Atty. Tolga Ozek · WhatsApp +1 (202) 854-8545</div>
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
      <div style={{background:"linear-gradient(145deg,#0A1628,#0D1E3A)",padding:"22px 22px 28px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse 70% 60% at 80% 20%,rgba(201,168,76,0.10),transparent)"}}/>
        <div style={{position:"relative"}}>
          <div style={{fontSize:9,letterSpacing:2.5,textTransform:"uppercase",color:C.gold,fontWeight:600,marginBottom:8}}>ACCOUNT</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:C.hi,letterSpacing:-0.4}}>{t.billing}</h1>
          <p style={{fontSize:12,color:C.md,fontWeight:300,marginTop:4}}>{t.billingSub}</p>
        </div>
      </div>
      <div style={{padding:"18px 18px 100px"}}>
        <div style={{background:"#FFFFFF",borderRadius:20,padding:"18px",marginBottom:14,border:"1px solid rgba(0,0,0,0.05)",boxShadow:"0 1px 12px rgba(0,0,0,0.06)"}}>
          <div style={{fontSize:9,letterSpacing:2,textTransform:"uppercase",color:C.inkLo,marginBottom:12}}>BILLING OVERVIEW</div>
          <BillingDonut paid={paid} due={due} soon={soon}/>
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

export default function App(){
  const[tab,setTab]=useState("home");
  const[client,setClient]=useState(null);
  const[lang,setLang]=useState("en");
  const t=I18N[lang]||I18N.en;
  const isClient=!!client&&["dash","tasks","docs","forms","chat","billing"].includes(tab);
  const dir=LANGS[lang].dir;
  return(
    <>
      <style>{FONTS}{css}</style>
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
        <div style={{flex:1,overflowY:"auto",overscrollBehavior:"contain"}}>
          <div className="page-enter" key={tab+lang}>
            {!client&&tab==="home"   &&<PublicHome setTab={setTab} t={t} lang={lang}/>}
            {!client&&tab==="news"   &&<NewsPage t={t} lang={lang}/>}
            {!client&&tab==="uscis"  &&<USCISPage t={t} lang={lang}/>}
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
