import { useState, useEffect, useCallback } from "react";

// ── FONTS ──────────────────────────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;1,400&display=swap";
    l.rel = "stylesheet";
    document.head.appendChild(l);
    const style = document.createElement("style");
    style.textContent = `
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Outfit',sans-serif;background:#f0f6ff;}
      ::-webkit-scrollbar{width:6px;}
      ::-webkit-scrollbar-track{background:#f0f6ff;}
      ::-webkit-scrollbar-thumb{background:#b8d4ee;border-radius:3px;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
      @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
      @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg)}}
      @keyframes slideIn{from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}}
      @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(16,130,82,0.3);}50%{box-shadow:0 0 20px rgba(16,130,82,0.6);}}
      .fadeUp{animation:fadeUp 0.45s ease forwards;}
      .fadeUp1{animation:fadeUp 0.45s 0.08s ease both;}
      .fadeUp2{animation:fadeUp 0.45s 0.16s ease both;}
      .fadeUp3{animation:fadeUp 0.45s 0.24s ease both;}
      .fadeUp4{animation:fadeUp 0.45s 0.32s ease both;}
      .card-hover{transition:transform 0.2s,box-shadow 0.2s;}
      .card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(10,80,160,0.12)!important;}
      .btn-press:active{transform:scale(0.97);}
      input:focus{outline:none;}
      button{font-family:'Outfit',sans-serif;}
    `;
    document.head.appendChild(style);
  }, []);
  return null;
};

// ── DESIGN SYSTEM ──────────────────────────────────────────────────────────────
const C = {
  p900:"#0a3d6b", p800:"#0d5299", p700:"#0f67b8", p600:"#1278d4", p500:"#2190f0",
  p400:"#60b3f8", p300:"#a8d5fc", p200:"#d4ebfe", p100:"#eaf4ff", p50:"#f5faff",
  g900:"#0a3d22", g800:"#0d5230", g700:"#108242", g600:"#14a854", g500:"#18c965",
  g400:"#52dB8c", g300:"#97ecb8", g200:"#c8f5d8", g100:"#e8faf0", g50:"#f4fdf7",
  r500:"#e8344a", r100:"#fde8eb", r50:"#fff5f6",
  o500:"#f0831a", o100:"#fef0e0", o50:"#fffaf4",
  y500:"#f5c800", y100:"#fef9d9",
  dark:"#0d1f35", mid:"#3a5570", muted:"#7a9bb5", border:"#cde2f5",
  bg:"#f0f6ff", white:"#ffffff", card:"rgba(255,255,255,0.95)",
};

// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const PATIENTS = [
  {id:1,name:"Almaz Tadesse",age:54,gender:"F",type:"Type 2",risk:"high",glucose:312,hba1c:9.2,lastVisit:"2025-04-10",nextVisit:"2025-04-24",adherence:42,phone:"+251-911-234567",sub:"standard",weight:72,city:"Gondar",alerts:["Glucose >300","Missed 2 visits"]},
  {id:2,name:"Bekele Haile",age:62,gender:"M",type:"Type 2",risk:"high",glucose:287,hba1c:8.8,lastVisit:"2025-04-22",nextVisit:"2025-05-06",adherence:58,phone:"+251-921-345678",sub:"basic",weight:80,city:"Gondar",alerts:["Glucose >250"]},
  {id:3,name:"Tigist Worku",age:41,gender:"F",type:"Type 1",risk:"medium",glucose:168,hba1c:7.4,lastVisit:"2025-05-01",nextVisit:"2025-06-01",adherence:78,phone:"+251-931-456789",sub:"premium",weight:58,city:"Debark",alerts:[]},
  {id:4,name:"Dawit Mengiste",age:48,gender:"M",type:"Type 2",risk:"low",glucose:126,hba1c:6.8,lastVisit:"2025-05-10",nextVisit:"2025-06-10",adherence:91,phone:"+251-941-567890",sub:"premium",weight:75,city:"Gondar",alerts:[]},
  {id:5,name:"Selamawit Girma",age:37,gender:"F",type:"Type 2",risk:"medium",glucose:194,hba1c:7.9,lastVisit:"2025-04-15",nextVisit:"2025-05-29",adherence:65,phone:"+251-951-678901",sub:"standard",weight:64,city:"Maksegnit",alerts:["Adherence <70%"]},
  {id:6,name:"Yohannes Assefa",age:71,gender:"M",type:"Type 2",risk:"high",glucose:341,hba1c:10.1,lastVisit:"2025-03-20",nextVisit:"2025-04-20",adherence:31,phone:"+251-911-789012",sub:"basic",weight:68,city:"Gondar",alerts:["Glucose >300","HbA1c >10","Missed 3 visits","Adherence <40%"]},
];

const WEEK = [
  {d:"M",f:142,r:198},{d:"T",f:156,r:221},{d:"W",f:138,r:187},
  {d:"T",f:163,r:234},{d:"F",f:147,r:205},{d:"S",f:129,r:176},{d:"S",f:134,r:189},
];

const EDUCATION = [
  {id:1,icon:"💉",cat:"Basics",title:"Understanding Blood Sugar",time:"5 min",color:C.p600},
  {id:2,icon:"🦶",cat:"Prevention",title:"Daily Foot Care Guide",time:"4 min",color:C.g600},
  {id:3,icon:"🥗",cat:"Nutrition",title:"Eating Well in Ethiopia",time:"7 min",color:C.o500},
  {id:4,icon:"🚶",cat:"Lifestyle",title:"Exercise & Glucose Control",time:"6 min",color:C.p700},
  {id:5,icon:"💊",cat:"Medication",title:"Why Adherence Matters",time:"3 min",color:C.g700},
  {id:6,icon:"🧠",cat:"Mental Health",title:"Stress & Blood Sugar",time:"5 min",color:C.r500},
];

const PLANS = [
  {name:"Basic",price:3,color:C.mid,accent:C.border,
   inc:["Glucose logging","Medication reminders","Basic education","Monthly check-in"],
   exc:["Teleconsultation","Complication screening","Product delivery","Home visit"]},
  {name:"Standard",price:7,color:C.p600,accent:C.p200,popular:true,
   inc:["Everything in Basic","Teleconsultation ×2/mo","Complication screening","Dietitian access"],
   exc:["Product delivery","Home visit"]},
  {name:"Premium",price:12,color:C.g700,accent:C.g200,
   inc:["Everything in Standard","Unlimited teleconsultation","Product delivery","Home visit ×1/mo","Priority support"],
   exc:[]},
];

// ── HELPERS ────────────────────────────────────────────────────────────────────
const gStatus = v => {
  if(v<70) return {label:"LOW",c:C.r500,bg:C.r100,icon:"🔴",advice:"Eat something sweet immediately and call the clinic."};
  if(v<=140) return {label:"NORMAL",c:C.g600,bg:C.g100,icon:"🟢",advice:"Great control! Keep following your care plan."};
  if(v<=200) return {label:"ELEVATED",c:C.o500,bg:C.o100,icon:"🟡",advice:"Avoid sugary foods. Monitor closely today."};
  return {label:"HIGH",c:C.r500,bg:C.r100,icon:"🔴",advice:"Dangerously high. Contact Mizan clinic immediately."};
};
const riskC = r => r==="high"?C.r500:r==="medium"?C.o500:C.g600;
const riskBg = r => r==="high"?C.r100:r==="medium"?C.o100:C.g100;
const aiRec = p => {
  if(p.glucose>300) return {msg:"Urgent consultation needed. Consider insulin adjustment or emergency referral.",lvl:"danger"};
  if(p.adherence<50) return {msg:"Poor adherence detected. Send education reminder and schedule counseling session.",lvl:"warn"};
  if(new Date(p.nextVisit)<new Date()) return {msg:"Overdue follow-up. Call patient to reschedule as soon as possible.",lvl:"warn"};
  return {msg:"Patient is on track. Continue current care plan. Next review on schedule.",lvl:"ok"};
};

// ── SHARED UI ──────────────────────────────────────────────────────────────────
const Toast = ({msg,type,onClose}) => (
  <div style={{position:"fixed",top:20,right:20,zIndex:9999,animation:"slideIn 0.3s ease",
    background:type==="error"?C.r500:type==="warn"?C.o500:C.g700,
    color:"#fff",padding:"14px 20px",borderRadius:14,fontWeight:600,fontSize:14,
    boxShadow:"0 8px 32px rgba(0,0,0,0.2)",maxWidth:320,display:"flex",gap:12,alignItems:"center"}}>
    <span style={{fontSize:18}}>{type==="error"?"❌":type==="warn"?"⚠️":"✅"}</span>
    <span style={{flex:1}}>{msg}</span>
    <button onClick={onClose} style={{background:"none",border:"none",color:"rgba(255,255,255,0.8)",cursor:"pointer",fontSize:18,padding:0}}>×</button>
  </div>
);

const Modal = ({children,onClose}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(13,31,53,0.7)",zIndex:900,display:"flex",alignItems:"center",justifyContent:"center",padding:16,backdropFilter:"blur(4px)"}} onClick={onClose}>
    <div onClick={e=>e.stopPropagation()} style={{background:C.white,borderRadius:24,padding:28,width:"100%",maxWidth:400,boxShadow:"0 24px 80px rgba(0,0,0,0.3)",animation:"fadeUp 0.3s ease"}}>
      {children}
    </div>
  </div>
);

const Pill = ({label,c,bg,size=12}) => (
  <span style={{background:bg,color:c,borderRadius:20,padding:`${size===12?"3px 9px":"4px 12px"}`,fontSize:size,fontWeight:700,letterSpacing:0.2,whiteSpace:"nowrap"}}>{label}</span>
);

const Btn = ({children,onClick,v="primary",sz="md",full,disabled,style={}}) => {
  const vs = {
    primary:{background:`linear-gradient(135deg,${C.p600},${C.p900})`,color:"#fff",border:"none",boxShadow:`0 4px 16px ${C.p300}`},
    green:{background:`linear-gradient(135deg,${C.g600},${C.g900})`,color:"#fff",border:"none",boxShadow:`0 4px 16px ${C.g300}`},
    outline:{background:"transparent",color:C.p600,border:`2px solid ${C.p600}`},
    ghost:{background:C.p100,color:C.p700,border:"none"},
    danger:{background:C.r100,color:C.r500,border:"none"},
    muted:{background:C.bg,color:C.muted,border:`1.5px solid ${C.border}`},
  };
  const ss = {sm:{padding:"8px 16px",fontSize:13,borderRadius:10},md:{padding:"12px 24px",fontSize:15,borderRadius:12},lg:{padding:"16px 28px",fontSize:17,borderRadius:14}};
  return (
    <button className="btn-press" onClick={onClick} disabled={disabled} style={{...vs[v],...ss[sz],fontWeight:700,cursor:disabled?"not-allowed":"pointer",
      width:full?"100%":"auto",opacity:disabled?0.6:1,transition:"all 0.2s",letterSpacing:0.2,...style}}>
      {children}
    </button>
  );
};

const Field = ({label,type="text",value,onChange,placeholder,icon,hint}) => (
  <div style={{marginBottom:16}}>
    {label&&<label style={{display:"block",marginBottom:6,fontSize:13,fontWeight:700,color:C.dark,letterSpacing:0.3}}>{label}</label>}
    <div style={{position:"relative"}}>
      {icon&&<span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:16,userSelect:"none"}}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{width:"100%",padding:icon?"13px 14px 13px 42px":"13px 16px",
          borderRadius:12,border:`1.5px solid ${C.border}`,fontSize:15,color:C.dark,
          background:C.bg,transition:"border 0.2s",boxSizing:"border-box",fontFamily:"'Outfit',sans-serif"}}
        onFocus={e=>{e.target.style.border=`1.5px solid ${C.p600}`;e.target.style.background=C.white;}}
        onBlur={e=>{e.target.style.border=`1.5px solid ${C.border}`;e.target.style.background=C.bg;}}/>
    </div>
    {hint&&<p style={{margin:"5px 0 0",fontSize:12,color:C.muted}}>{hint}</p>}
  </div>
);

// ── GLUCOSE CHART ──────────────────────────────────────────────────────────────
const Chart = ({data=WEEK,compact=false}) => {
  const H = compact?100:160, W = 300, pad = 20, max = 300;
  const x = i => pad + (i/(data.length-1))*(W-pad*2);
  const y = v => H - pad - (v/max)*(H-pad*2);
  const path = key => data.map((d,i)=>`${i===0?"M":"L"}${x(i)},${y(d[key])}`).join(" ");
  return (
    <div style={{overflowX:"auto"}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:compact?100:170}} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.p500} stopOpacity="0.25"/><stop offset="100%" stopColor={C.p500} stopOpacity="0"/></linearGradient>
          <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.g500} stopOpacity="0.25"/><stop offset="100%" stopColor={C.g500} stopOpacity="0"/></linearGradient>
        </defs>
        {[70,140,200].map(v=>(
          <g key={v}><line x1={pad} y1={y(v)} x2={W-pad} y2={y(v)} stroke={C.border} strokeWidth="0.8" strokeDasharray="4,4"/><text x={W-pad+4} y={y(v)+4} fontSize="8" fill={C.muted}>{v}</text></g>
        ))}
        <path d={`${path("fasting")} L${x(data.length-1)},${H-pad} L${x(0)},${H-pad} Z`} fill="url(#gp)" opacity="0.6"/>
        <path d={`${path("random")} L${x(data.length-1)},${H-pad} L${x(0)},${H-pad} Z`} fill="url(#gg)" opacity="0.6"/>
        <path d={path("fasting")} fill="none" stroke={C.p600} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={path("random")} fill="none" stroke={C.g600} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {data.map((d,i)=>(
          <g key={i}>
            <circle cx={x(i)} cy={y(d.f)} r="4" fill={C.white} stroke={C.p600} strokeWidth="2"/>
            <circle cx={x(i)} cy={y(d.r)} r="4" fill={C.white} stroke={C.g600} strokeWidth="2"/>
            {!compact&&<text x={x(i)} y={H-4} textAnchor="middle" fontSize="9" fill={C.muted}>{d.d}</text>}
          </g>
        ))}
      </svg>
      {!compact&&(
        <div style={{display:"flex",gap:20,justifyContent:"center",marginTop:4}}>
          {[{c:C.p600,l:"Fasting"},{c:C.g600,l:"Random"}].map(({c,l})=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.mid}}>
              <div style={{width:20,height:3,borderRadius:2,background:c}}/>{l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── ADHERENCE RING ─────────────────────────────────────────────────────────────
const Ring = ({pct,size=80,color=C.p600}) => {
  const r=30, circ=2*Math.PI*r, offset=circ*(1-pct/100);
  return (
    <svg width={size} height={size} viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={r} fill="none" stroke={C.border} strokeWidth="8"/>
      <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 40 40)" style={{transition:"stroke-dashoffset 1s ease"}}/>
      <text x="40" y="44" textAnchor="middle" fontSize="14" fontWeight="800" fill={color} fontFamily="Outfit">{pct}%</text>
    </svg>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════════════════════
const Auth = ({onLogin}) => {
  const [mode,setMode] = useState("login");
  const [role,setRole] = useState("patient");
  const [email,setEmail] = useState("");
  const [pass,setPass] = useState("");
  const [name,setName] = useState("");
  const [loading,setLoading] = useState(false);
  const [toast,setToast] = useState(null);

  const submit = () => {
    if(!email||(!pass&&mode!=="forgot")){setToast({msg:"Please fill in all fields",type:"error"});return;}
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
      if(mode==="forgot"){setToast({msg:"Reset link sent to "+email,type:"ok"});return;}
      onLogin(role);
    },1200);
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",fontFamily:"'Outfit',sans-serif",position:"relative",overflow:"hidden"}}>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {/* Left panel */}
      <div style={{flex:"0 0 48%",background:`linear-gradient(145deg,${C.p900} 0%,${C.p700} 45%,${C.g700} 100%)`,
        display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",padding:48,position:"relative",overflow:"hidden"}}>
        {/* Decorative */}
        {[240,380,520].map((s,i)=>(
          <div key={i} style={{position:"absolute",width:s,height:s,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.07)",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}/>
        ))}
        <div style={{position:"relative",zIndex:1,textAlign:"center",color:"#fff"}}>
          <div style={{width:88,height:88,borderRadius:28,background:"rgba(255,255,255,0.15)",
            backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.25)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,margin:"0 auto 24px"}}>⚕️</div>
          <h1 style={{fontSize:34,fontWeight:900,letterSpacing:-1,marginBottom:10,fontFamily:"'Lora',serif"}}>Mizan Diabetes Care</h1>
          <p style={{fontSize:16,opacity:0.8,fontStyle:"italic",fontFamily:"'Lora',serif",marginBottom:40}}>Balanced Care · Healthier Lives</p>
          <div style={{background:"rgba(255,255,255,0.1)",backdropFilter:"blur(8px)",borderRadius:16,padding:"20px 24px",textAlign:"left",maxWidth:300}}>
            {["Continuous diabetes follow-up","Early complication detection","Affordable structured care","Digital + onsite hybrid model"].map(f=>(
              <div key={f} style={{display:"flex",alignItems:"center",gap:10,marginBottom:12,fontSize:14,opacity:0.9}}>
                <div style={{width:20,height:20,borderRadius:6,background:C.g500,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>✓</div>
                {f}
              </div>
            ))}
          </div>
          <p style={{marginTop:28,fontSize:12,opacity:0.5}}>Serving Gondar & Peri-Urban Ethiopia</p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:32,background:C.bg}}>
        <div style={{width:"100%",maxWidth:400}} className="fadeUp">
          <h2 style={{fontSize:26,fontWeight:800,color:C.dark,marginBottom:6}}>
            {mode==="login"?"Welcome back":"mode"==="signup"?"Create account":"Reset password"}
            {mode==="login"&&" 👋"}
          </h2>
          <p style={{color:C.muted,fontSize:14,marginBottom:28}}>
            {mode==="login"?"Sign in to your Mizan account":"mode"==="signup"?"Join the Mizan care community":"We'll send a reset link to your email"}
          </p>

          {/* Role toggle */}
          <div style={{display:"flex",background:C.white,borderRadius:12,padding:4,marginBottom:24,border:`1.5px solid ${C.border}`}}>
            {[{id:"patient",label:"👤 Patient"},{id:"clinic",label:"🏥 Clinic Staff"}].map(r=>(
              <button key={r.id} onClick={()=>setRole(r.id)} style={{flex:1,padding:"10px 0",borderRadius:10,border:"none",
                background:role===r.id?`linear-gradient(135deg,${C.p600},${C.p800})`:"transparent",
                color:role===r.id?"#fff":C.muted,fontWeight:700,fontSize:14,cursor:"pointer",
                transition:"all 0.25s",fontFamily:"'Outfit',sans-serif"}}>
                {r.label}
              </button>
            ))}
          </div>

          {/* Tabs */}
          <div style={{display:"flex",gap:0,borderBottom:`2px solid ${C.border}`,marginBottom:24}}>
            {["login","signup","forgot"].map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"10px 0",border:"none",background:"transparent",
                color:mode===m?C.p600:C.muted,fontWeight:700,fontSize:13,cursor:"pointer",
                borderBottom:mode===m?`2px solid ${C.p600}`:"2px solid transparent",marginBottom:-2,
                transition:"all 0.2s",fontFamily:"'Outfit',sans-serif"}}>
                {m==="forgot"?"Reset":m[0].toUpperCase()+m.slice(1)}
              </button>
            ))}
          </div>

          {mode==="signup"&&<Field label="Full Name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your full name" icon="👤"/>}
          <Field label="Email Address" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" icon="✉️"/>
          {mode!=="forgot"&&<Field label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" icon="🔒"/>}

          <Btn onClick={submit} v="primary" sz="lg" full disabled={loading} style={{marginBottom:16}}>
            {loading?"Signing in...":mode==="login"?"Sign In →":mode==="signup"?"Create Account →":"Send Reset Link →"}
          </Btn>

          <div style={{padding:"12px 16px",background:C.p100,borderRadius:12,fontSize:13,color:C.p700,textAlign:"center"}}>
            <strong>Demo mode:</strong> Enter any email & click Sign In
          </div>

          <p style={{textAlign:"center",marginTop:20,fontSize:12,color:C.muted}}>
            {role==="patient"?"For diabetic patients in Gondar & surrounding areas":"Authorised Mizan Diabetes Care clinic staff only"}
          </p>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// PATIENT APP
// ════════════════════════════════════════════════════════════════════════════════
const PatientApp = ({onLogout}) => {
  const [tab,setTab] = useState("home");
  const [fasting,setFasting] = useState("");
  const [random,setRandom] = useState("");
  const [plan,setPlan] = useState("standard");
  const [toast,setToast] = useState(null);
  const [emergModal,setEmergModal] = useState(false);
  const [logModal,setLogModal] = useState(false);
  const todayG = 168;
  const st = gStatus(todayG);

  const notify = (msg,type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const logGlucose = () => {
    const f=parseInt(fasting), r=parseInt(random);
    if(!f&&!r){notify("Enter at least one glucose value","error");return;}
    if((f&&f>400)||(r&&r>400)){setLogModal(false);setEmergModal(true);return;}
    if((f&&f>300)||(r&&r>300)) notify("High glucose logged. Monitor closely and contact clinic if symptoms worsen.","warn");
    else notify("Glucose reading saved successfully ✓");
    setFasting(""); setRandom(""); setLogModal(false);
  };

  const NAV = [
    {id:"home",icon:"🏠",label:"Home"},{id:"glucose",icon:"📊",label:"Glucose"},
    {id:"meds",icon:"💊",label:"Meds"},{id:"visits",icon:"📅",label:"Visits"},
    {id:"learn",icon:"📚",label:"Learn"},{id:"plans",icon:"⭐",label:"Plans"},
  ];

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'Outfit',sans-serif",maxWidth:500,margin:"0 auto",position:"relative"}}>
      <FontLoader/>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {emergModal&&(
        <Modal onClose={()=>setEmergModal(false)}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:56,marginBottom:12,animation:"pulse 1s infinite"}}>🚨</div>
            <h2 style={{color:C.r500,fontSize:22,fontWeight:800,marginBottom:8}}>Critical Glucose Alert</h2>
            <p style={{color:C.dark,lineHeight:1.7,marginBottom:8,fontSize:15}}>
              Your glucose reading is <strong>dangerously high</strong>. This requires immediate medical attention.
            </p>
            <div style={{background:C.r50,border:`1.5px solid ${C.r500}30`,borderRadius:12,padding:16,marginBottom:20,textAlign:"left"}}>
              <p style={{fontWeight:700,color:C.r500,marginBottom:8,fontSize:14}}>Do this NOW:</p>
              {["Call Mizan Clinic: +251-911-000000","Take your emergency medication if prescribed","Do NOT eat sugary food","Go to nearest clinic if symptoms worsen"].map((s,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:6,fontSize:13,color:C.dark}}>
                  <span style={{color:C.r500,fontWeight:700}}>{i+1}.</span>{s}
                </div>
              ))}
            </div>
            <Btn onClick={()=>setEmergModal(false)} v="danger" full>I understand — I will seek help immediately</Btn>
          </div>
        </Modal>
      )}

      {logModal&&(
        <Modal onClose={()=>setLogModal(false)}>
          <h3 style={{fontSize:18,fontWeight:800,color:C.dark,marginBottom:4}}>Log Glucose Reading</h3>
          <p style={{color:C.muted,fontSize:13,marginBottom:20}}>Enter today's glucose values in mg/dL</p>
          <Field label="Fasting Glucose (mg/dL)" type="number" value={fasting} onChange={e=>setFasting(e.target.value)} placeholder="e.g. 126" icon="🌅" hint="Measured before eating, typically in the morning"/>
          <Field label="Random Glucose (mg/dL)" type="number" value={random} onChange={e=>setRandom(e.target.value)} placeholder="e.g. 180" icon="⏰" hint="Measured at any time of day"/>
          <div style={{background:C.o50,border:`1.5px solid ${C.o100}`,borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:C.o500}}>
            ⚠️ Values above 400 mg/dL will trigger an emergency alert
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>setLogModal(false)} v="muted" sz="md" style={{flex:1}}>Cancel</Btn>
            <Btn onClick={logGlucose} v="green" sz="md" style={{flex:2}}>Save Reading →</Btn>
          </div>
        </Modal>
      )}

      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.p900},${C.p700} 60%,${C.g700})`,padding:"22px 20px 32px",position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <p style={{color:"rgba(255,255,255,0.65)",fontSize:13,marginBottom:2}}>Good morning ☀️</p>
            <h2 style={{color:"#fff",fontSize:22,fontWeight:800,letterSpacing:-0.3}}>Tigist Worku</h2>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <div style={{width:46,height:46,borderRadius:"50%",background:"rgba(255,255,255,0.18)",border:"2px solid rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>👤</div>
            <button onClick={onLogout} style={{background:"rgba(255,255,255,0.15)",border:"1px solid rgba(255,255,255,0.25)",color:"#fff",borderRadius:10,padding:"8px 14px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Exit</button>
          </div>
        </div>
      </div>

      <div style={{padding:"16px 16px 96px"}}>

        {/* ── HOME ── */}
        {tab==="home"&&(
          <div>
            {/* Status card */}
            <div className="fadeUp" style={{background:`linear-gradient(135deg,${C.white},${st.bg})`,border:`1.5px solid ${st.c}25`,borderRadius:20,padding:20,marginBottom:14,boxShadow:`0 4px 20px ${st.c}15`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div>
                  <p style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1,marginBottom:6}}>TODAY'S GLUCOSE</p>
                  <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                    <span style={{fontSize:52,fontWeight:900,color:st.c,lineHeight:1,letterSpacing:-2}}>{todayG}</span>
                    <span style={{fontSize:16,color:C.muted,fontWeight:500}}>mg/dL</span>
                  </div>
                </div>
                <div style={{textAlign:"right"}}>
                  <Pill label={st.label} c={st.c} bg={st.bg} size={13}/>
                  <p style={{marginTop:8,fontSize:11,color:C.muted}}>May 25, 2025 · 7:30 AM</p>
                </div>
              </div>
              <div style={{background:`${st.c}12`,borderRadius:10,padding:"10px 14px",fontSize:13,color:st.c,fontWeight:600,lineHeight:1.5}}>
                {st.icon} {st.advice}
              </div>
              <button onClick={()=>setLogModal(true)} style={{width:"100%",marginTop:14,padding:"12px",background:`linear-gradient(135deg,${C.p600},${C.p800})`,border:"none",borderRadius:12,color:"#fff",fontWeight:700,fontSize:15,cursor:"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:`0 4px 14px ${C.p300}`}}>
                + Log Today's Reading
              </button>
            </div>

            {/* Quick stats */}
            <div className="fadeUp1" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              {[
                {label:"Next Visit",value:"May 28",icon:"📅",c:C.p600,bg:C.p100},
                {label:"Adherence",value:"78%",icon:"💊",c:C.g600,bg:C.g100},
                {label:"Active Plan",value:"Standard",icon:"⭐",c:C.o500,bg:C.o100},
                {label:"Log Streak",value:"12 days",icon:"🔥",c:C.r500,bg:C.r100},
              ].map(s=>(
                <div key={s.label} className="card-hover" style={{background:C.white,borderRadius:16,padding:16,border:`1.5px solid ${C.border}`,boxShadow:`0 2px 10px rgba(10,80,160,0.06)`}}>
                  <div style={{width:36,height:36,borderRadius:10,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:10}}>{s.icon}</div>
                  <div style={{fontSize:22,fontWeight:800,color:s.c}}>{s.value}</div>
                  <div style={{fontSize:12,color:C.muted,fontWeight:600,marginTop:2}}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* 7-day chart */}
            <div className="fadeUp2" style={{background:C.white,borderRadius:20,padding:20,marginBottom:14,border:`1.5px solid ${C.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <h3 style={{fontSize:15,fontWeight:800,color:C.dark}}>7-Day Glucose Trend</h3>
                <Pill label="This Week" c={C.p600} bg={C.p100}/>
              </div>
              <Chart/>
            </div>

            {/* Reminders */}
            <div className="fadeUp3" style={{background:C.white,borderRadius:20,padding:20,marginBottom:14,border:`1.5px solid ${C.border}`}}>
              <h3 style={{fontSize:15,fontWeight:800,color:C.dark,marginBottom:14}}>Today's Reminders</h3>
              {[
                {time:"07:00",label:"Metformin 500mg",done:true,icon:"💊"},
                {time:"07:30",label:"Log fasting glucose",done:true,icon:"📊"},
                {time:"13:00",label:"Metformin 500mg",done:false,icon:"💊"},
                {time:"19:30",label:"Log evening glucose",done:false,icon:"📊"},
                {time:"21:00",label:"Insulin Glargine 20 units",done:false,icon:"💉"},
              ].map((r,i,arr)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{width:38,height:38,borderRadius:11,background:r.done?C.g100:C.p100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                    {r.done?"✅":r.icon}
                  </div>
                  <div style={{flex:1}}>
                    <p style={{margin:0,fontSize:14,fontWeight:600,color:r.done?C.muted:C.dark,textDecoration:r.done?"line-through":"none"}}>{r.label}</p>
                    <p style={{margin:0,fontSize:12,color:C.muted}}>{r.time}</p>
                  </div>
                  {!r.done&&<div style={{width:8,height:8,borderRadius:"50%",background:C.p500,animation:"pulse 2s infinite"}}/>}
                </div>
              ))}
            </div>

            {/* Health tip */}
            <div className="fadeUp4" style={{background:`linear-gradient(135deg,${C.g50},${C.p50})`,border:`1.5px solid ${C.g300}`,borderRadius:20,padding:18}}>
              <p style={{fontSize:11,fontWeight:700,color:C.g700,letterSpacing:1,marginBottom:8}}>💡 HEALTH TIP OF THE DAY</p>
              <p style={{fontSize:14,color:C.dark,lineHeight:1.7,margin:0}}>
                Walking for <strong>30 minutes after meals</strong> can reduce blood sugar by up to 22%. A short walk around your neighborhood makes a real difference.
              </p>
            </div>
          </div>
        )}

        {/* ── GLUCOSE ── */}
        {tab==="glucose"&&(
          <div>
            <h2 className="fadeUp" style={{fontSize:24,fontWeight:900,color:C.dark,letterSpacing:-0.5,marginBottom:16}}>Glucose Tracker</h2>
            <div className="fadeUp1" style={{background:C.white,borderRadius:20,padding:20,marginBottom:14,border:`1.5px solid ${C.border}`}}>
              <h3 style={{fontSize:15,fontWeight:800,color:C.dark,marginBottom:16}}>Log a New Reading</h3>
              <Field label="Fasting Glucose (mg/dL)" type="number" value={fasting} onChange={e=>setFasting(e.target.value)} placeholder="e.g. 126" icon="🌅" hint="Before eating, morning"/>
              <Field label="Random Glucose (mg/dL)" type="number" value={random} onChange={e=>setRandom(e.target.value)} placeholder="e.g. 180" icon="⏰" hint="Any time of day"/>
              <Btn onClick={logGlucose} v="green" sz="md" full>Save Reading →</Btn>
            </div>

            <div className="fadeUp2" style={{background:C.white,borderRadius:20,padding:20,marginBottom:14,border:`1.5px solid ${C.border}`}}>
              <h3 style={{fontSize:15,fontWeight:800,color:C.dark,marginBottom:4}}>7-Day Trend</h3>
              <p style={{fontSize:12,color:C.muted,marginBottom:16}}>Target: Fasting &lt;130 · Random &lt;180 mg/dL</p>
              <Chart/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:16}}>
                {[{l:"Avg Fasting",v:"144",u:"mg/dL",c:C.p600},{l:"Avg Random",v:"201",u:"mg/dL",c:C.g600},{l:"In Range",v:"43%",u:"",c:C.o500}].map(s=>(
                  <div key={s.l} style={{textAlign:"center",background:C.bg,borderRadius:12,padding:"12px 8px"}}>
                    <div style={{fontSize:20,fontWeight:800,color:s.c}}>{s.v}<span style={{fontSize:10,color:C.muted,fontWeight:500}}> {s.u}</span></div>
                    <div style={{fontSize:11,color:C.muted,fontWeight:600,marginTop:3}}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fadeUp3" style={{background:C.white,borderRadius:20,padding:20,border:`1.5px solid ${C.border}`}}>
              <h3 style={{fontSize:15,fontWeight:800,color:C.dark,marginBottom:14}}>Recent Readings</h3>
              {[
                {date:"May 25",time:"7:30 AM",type:"Fasting",val:142,note:"Before breakfast"},
                {date:"May 24",time:"1:00 PM",type:"Random",val:198,note:"After lunch"},
                {date:"May 24",time:"7:00 AM",type:"Fasting",val:156,note:"Before breakfast"},
                {date:"May 23",time:"8:00 PM",type:"Random",val:221,note:"Evening"},
              ].map((r,i,arr)=>{
                const s=gStatus(r.val);
                return(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                    <div>
                      <p style={{margin:0,fontSize:14,fontWeight:700,color:C.dark}}>{r.type} · {r.note}</p>
                      <p style={{margin:0,fontSize:12,color:C.muted}}>{r.date} · {r.time}</p>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span style={{fontSize:20,fontWeight:800,color:s.c}}>{r.val}</span>
                      <span style={{fontSize:11,color:C.muted}}> mg/dL</span>
                      <div style={{marginTop:3}}><Pill label={s.label} c={s.c} bg={s.bg}/></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MEDS ── */}
        {tab==="meds"&&(
          <div>
            <h2 className="fadeUp" style={{fontSize:24,fontWeight:900,color:C.dark,letterSpacing:-0.5,marginBottom:16}}>Medications</h2>
            {[
              {name:"Metformin 500mg",cat:"Tablet",freq:"Twice daily",times:["07:00","13:00"],taken:1,total:2,c:C.p600,bg:C.p100,icon:"💊"},
              {name:"Glibenclamide 5mg",cat:"Tablet",freq:"Once daily",times:["07:00"],taken:1,total:1,c:C.g700,bg:C.g100,icon:"💊"},
              {name:"Insulin Glargine 20u",cat:"Injection",freq:"Once nightly",times:["21:00"],taken:0,total:1,c:C.o500,bg:C.o100,icon:"💉"},
            ].map((m,i)=>(
              <div key={i} className={`fadeUp${i+1} card-hover`} style={{background:C.white,borderRadius:20,padding:20,marginBottom:14,border:`1.5px solid ${C.border}`,boxShadow:`0 2px 10px rgba(10,80,160,0.06)`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:48,height:48,borderRadius:14,background:m.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{m.icon}</div>
                    <div>
                      <h4 style={{margin:0,fontSize:16,fontWeight:800,color:C.dark}}>{m.name}</h4>
                      <p style={{margin:"3px 0 0",fontSize:13,color:C.muted}}>{m.cat} · {m.freq}</p>
                    </div>
                  </div>
                  <Pill label={m.taken===m.total?"Done ✓":`${m.taken}/${m.total}`} c={m.taken===m.total?C.g700:C.o500} bg={m.taken===m.total?C.g100:C.o100}/>
                </div>
                <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
                  {m.times.map(t=>(
                    <div key={t} style={{background:C.bg,borderRadius:8,padding:"5px 12px",fontSize:13,color:C.mid,fontWeight:600}}>⏰ {t}</div>
                  ))}
                </div>
                <div style={{height:7,background:C.bg,borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${(m.taken/m.total)*100}%`,background:`linear-gradient(90deg,${m.c},${m.c}cc)`,borderRadius:4,transition:"width 1s"}}/>
                </div>
              </div>
            ))}
            <div style={{background:`${C.p100}`,borderRadius:16,padding:16,border:`1px solid ${C.p200}`,fontSize:14,color:C.p700,lineHeight:1.6}}>
              📱 <strong>Reminders active.</strong> You'll receive notifications before each dose. Always consult Dr. Ayenachew before changing any medication.
            </div>
          </div>
        )}

        {/* ── VISITS ── */}
        {tab==="visits"&&(
          <div>
            <h2 className="fadeUp" style={{fontSize:24,fontWeight:900,color:C.dark,letterSpacing:-0.5,marginBottom:16}}>Appointments</h2>

            <div className="fadeUp1" style={{background:`linear-gradient(135deg,${C.p900},${C.p600})`,borderRadius:20,padding:22,marginBottom:14,color:"#fff"}}>
              <p style={{fontSize:11,fontWeight:700,opacity:0.65,letterSpacing:1,marginBottom:8}}>NEXT APPOINTMENT</p>
              <h3 style={{fontSize:20,fontWeight:800,marginBottom:10}}>Follow-up Consultation</h3>
              <div style={{display:"flex",gap:16,marginBottom:18,flexWrap:"wrap"}}>
                <span style={{fontSize:14,opacity:0.85}}>📅 May 28, 2025</span>
                <span style={{fontSize:14,opacity:0.85}}>⏰ 10:00 AM</span>
                <span style={{fontSize:14,opacity:0.85}}>📍 Mizan Clinic, Gondar</span>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>notify("Appointment confirmed! ✓")} style={{flex:1,padding:"11px",background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>✓ Confirm</button>
                <button onClick={()=>notify("Reschedule request sent to clinic")} style={{flex:1,padding:"11px",background:"transparent",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:12,fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Reschedule</button>
              </div>
            </div>

            <div className="fadeUp2" style={{background:C.white,borderRadius:20,padding:20,marginBottom:14,border:`1.5px solid ${C.border}`}}>
              <h3 style={{fontSize:15,fontWeight:800,color:C.dark,marginBottom:16}}>Request New Appointment</h3>
              <Field label="Reason for Visit" placeholder="e.g. Glucose review, foot check, medication change..." icon="📝" value="" onChange={()=>{}}/>
              <Field label="Preferred Date" type="date" value="" onChange={()=>{}}/>
              <Field label="Preferred Time" placeholder="e.g. Morning, Afternoon" icon="⏰" value="" onChange={()=>{}}/>
              <Btn onClick={()=>notify("Appointment request sent! Clinic will confirm within 24 hours.")} v="primary" sz="md" full>Request Appointment →</Btn>
            </div>

            <div className="fadeUp3" style={{background:C.white,borderRadius:20,padding:20,border:`1.5px solid ${C.border}`}}>
              <h3 style={{fontSize:15,fontWeight:800,color:C.dark,marginBottom:14}}>Past Visits</h3>
              {[
                {date:"May 1, 2025",type:"Glucose Review",doc:"Dr. Ayenachew",result:"Elevated",note:"Metformin dose increased"},
                {date:"Apr 1, 2025",type:"Complication Screen",doc:"Dr. Samuel",result:"Normal",note:"Eye & foot exam — normal"},
                {date:"Mar 3, 2025",type:"Initial Enrollment",doc:"Dr. Ayenachew",result:"Normal",note:"Started care plan"},
              ].map((v,i,arr)=>(
                <div key={i} style={{padding:"13px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div>
                      <p style={{margin:0,fontSize:14,fontWeight:700,color:C.dark}}>{v.type}</p>
                      <p style={{margin:"3px 0",fontSize:12,color:C.muted}}>{v.date} · {v.doc}</p>
                      <p style={{margin:0,fontSize:12,color:C.mid,fontStyle:"italic"}}>📋 {v.note}</p>
                    </div>
                    <Pill label={v.result} c={v.result==="Normal"?C.g700:C.o500} bg={v.result==="Normal"?C.g100:C.o100}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── LEARN ── */}
        {tab==="learn"&&(
          <div>
            <h2 className="fadeUp" style={{fontSize:24,fontWeight:900,color:C.dark,letterSpacing:-0.5,marginBottom:6}}>Learn & Manage</h2>
            <p className="fadeUp1" style={{color:C.muted,fontSize:14,marginBottom:16}}>Education tailored for Ethiopian diabetic patients</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {EDUCATION.map((e,i)=>(
                <div key={e.id} className={`fadeUp${(i%4)+1} card-hover`} onClick={()=>notify(`Opening: ${e.title}`)}
                  style={{background:C.white,borderRadius:18,padding:16,border:`1.5px solid ${C.border}`,cursor:"pointer",boxShadow:`0 2px 10px rgba(10,80,160,0.06)`}}>
                  <div style={{width:44,height:44,borderRadius:12,background:`${e.color}15`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:10}}>{e.icon}</div>
                  <Pill label={e.cat} c={e.color} bg={`${e.color}15`}/>
                  <h4 style={{margin:"8px 0 6px",fontSize:14,fontWeight:700,color:C.dark,lineHeight:1.4}}>{e.title}</h4>
                  <p style={{margin:0,fontSize:12,color:e.color,fontWeight:600}}>▶ {e.time} read</p>
                </div>
              ))}
            </div>
            <div style={{marginTop:16,background:`linear-gradient(135deg,${C.p900},${C.g800})`,borderRadius:20,padding:20,color:"#fff"}}>
              <p style={{fontSize:13,opacity:0.7,marginBottom:6}}>🎙️ AVAILABLE IN AMHARIC</p>
              <h4 style={{fontSize:16,fontWeight:800,marginBottom:8}}>Audio & Video content coming soon</h4>
              <p style={{fontSize:13,opacity:0.8,lineHeight:1.6,margin:0}}>We are recording all education content in Amharic for patients who prefer to listen and watch.</p>
            </div>
          </div>
        )}

        {/* ── PLANS ── */}
        {tab==="plans"&&(
          <div>
            <h2 className="fadeUp" style={{fontSize:24,fontWeight:900,color:C.dark,letterSpacing:-0.5,marginBottom:6}}>Care Plans</h2>
            <p className="fadeUp1" style={{color:C.muted,fontSize:14,marginBottom:20}}>Affordable monthly plans designed for Ethiopian patients</p>
            {PLANS.map((p,i)=>(
              <div key={p.name} className={`fadeUp${i+1} card-hover`} onClick={()=>setPlan(p.name.toLowerCase())}
                style={{background:plan===p.name.toLowerCase()?`linear-gradient(135deg,${p.color}08,${C.white})`:`${C.white}`,
                  borderRadius:20,padding:22,marginBottom:14,cursor:"pointer",position:"relative",
                  border:plan===p.name.toLowerCase()?`2px solid ${p.color}`:`1.5px solid ${C.border}`,
                  boxShadow:plan===p.name.toLowerCase()?`0 8px 28px ${p.color}20`:`0 2px 10px rgba(10,80,160,0.06)`}}>
                {p.popular&&<div style={{position:"absolute",top:-10,right:18,background:`linear-gradient(135deg,${C.p600},${C.p900})`,color:"#fff",fontSize:11,fontWeight:700,padding:"3px 12px",borderRadius:20,boxShadow:`0 2px 8px ${C.p300}`}}>MOST POPULAR</div>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                  <div>
                    <h3 style={{margin:0,fontSize:22,fontWeight:900,color:p.color,letterSpacing:-0.5}}>{p.name}</h3>
                    <p style={{margin:"4px 0 0",fontSize:13,color:C.muted}}>Monthly subscription</p>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <span style={{fontSize:36,fontWeight:900,color:p.color,letterSpacing:-1}}>${p.price}</span>
                    <span style={{fontSize:13,color:C.muted}}>/mo</span>
                  </div>
                </div>
                {p.inc.map((f,j)=>(
                  <div key={j} style={{display:"flex",gap:10,alignItems:"center",marginBottom:7,fontSize:14,color:C.dark}}>
                    <div style={{width:20,height:20,borderRadius:6,background:`${p.color}20`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:p.color,fontWeight:800,flexShrink:0}}>✓</div>
                    {f}
                  </div>
                ))}
                {p.exc.map((f,j)=>(
                  <div key={j} style={{display:"flex",gap:10,alignItems:"center",marginBottom:7,fontSize:14,color:C.border,textDecoration:"line-through"}}>
                    <div style={{width:20,height:20,borderRadius:6,background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:C.border,flexShrink:0}}>✗</div>
                    {f}
                  </div>
                ))}
                {plan===p.name.toLowerCase()&&(
                  <div style={{marginTop:14,background:`${p.color}12`,borderRadius:10,padding:"10px 14px",fontSize:13,color:p.color,fontWeight:700,textAlign:"center"}}>✓ Your current selection</div>
                )}
              </div>
            ))}
            <Btn onClick={()=>notify("Plan updated! The clinic has been notified.")} v="primary" sz="lg" full>Confirm Plan →</Btn>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:500,background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:50,boxShadow:"0 -4px 24px rgba(10,80,160,0.08)"}}>
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,padding:"10px 0 8px",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <span style={{fontSize:20}}>{n.icon}</span>
            <span style={{fontSize:9,fontWeight:tab===n.id?800:500,color:tab===n.id?C.p600:C.muted,fontFamily:"'Outfit',sans-serif",letterSpacing:0.3}}>{n.label}</span>
            {tab===n.id&&<div style={{width:22,height:3,background:`linear-gradient(90deg,${C.p600},${C.g600})`,borderRadius:2}}/>}
          </button>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// CLINIC DASHBOARD
// ════════════════════════════════════════════════════════════════════════════════
const Clinic = ({onLogout}) => {
  const [view,setView] = useState("overview");
  const [patient,setPatient] = useState(null);
  const [filter,setFilter] = useState("all");
  const [toast,setToast] = useState(null);
  const [smsModal,setSmsModal] = useState(null);
  const notify = (msg,type="ok")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const filtered = filter==="all"?PATIENTS:PATIENTS.filter(p=>p.risk===filter);
  const high = PATIENTS.filter(p=>p.risk==="high").length;
  const overdue = PATIENTS.filter(p=>new Date(p.nextVisit)<new Date()).length;
  const totalRev = PATIENTS.reduce((s,p)=>s+(p.sub==="premium"?12:p.sub==="standard"?7:3),0);

  const NAV2 = [
    {id:"overview",icon:"📊",label:"Overview"},
    {id:"patients",icon:"👥",label:"Patients"},
    {id:"analytics",icon:"📈",label:"Analytics"},
    {id:"followup",icon:"🔔",label:"Follow-up"},
  ];

  return (
    <div style={{minHeight:"100vh",fontFamily:"'Outfit',sans-serif",display:"flex",background:C.bg}}>
      <FontLoader/>
      {toast&&<Toast msg={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}

      {smsModal&&(
        <Modal onClose={()=>setSmsModal(null)}>
          <h3 style={{fontSize:18,fontWeight:800,color:C.dark,marginBottom:4}}>Send SMS Reminder</h3>
          <p style={{color:C.muted,fontSize:13,marginBottom:16}}>To: {smsModal.name} · {smsModal.phone}</p>
          <div style={{background:C.bg,borderRadius:12,padding:16,marginBottom:16}}>
            <p style={{margin:0,fontSize:14,color:C.dark,lineHeight:1.6}}>
              "Dear {smsModal.name.split(" ")[0]}, this is a reminder from Mizan Diabetes Care. Your follow-up appointment is overdue. Please call us at +251-911-000000 to reschedule."
            </p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn onClick={()=>setSmsModal(null)} v="muted" sz="md" style={{flex:1}}>Cancel</Btn>
            <Btn onClick={()=>{notify(`SMS sent to ${smsModal.name} ✓`);setSmsModal(null);}} v="primary" sz="md" style={{flex:2}}>Send SMS →</Btn>
          </div>
        </Modal>
      )}

      {/* Sidebar */}
      <div style={{width:230,background:`linear-gradient(180deg,${C.p900} 0%,#071a2e 100%)`,display:"flex",flexDirection:"column",position:"sticky",top:0,height:"100vh",flexShrink:0,overflow:"hidden"}}>
        <div style={{padding:"28px 20px 24px",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
            <span style={{fontSize:26}}>⚕️</span>
            <div>
              <h2 style={{color:"#fff",margin:0,fontSize:14,fontWeight:800,letterSpacing:-0.3}}>Mizan Diabetes</h2>
              <p style={{color:"rgba(255,255,255,0.45)",margin:0,fontSize:11}}>Clinic Dashboard</p>
            </div>
          </div>
        </div>
        <nav style={{padding:"16px 12px",flex:1}}>
          <p style={{color:"rgba(255,255,255,0.3)",fontSize:10,fontWeight:700,letterSpacing:1.5,padding:"0 8px",marginBottom:8}}>NAVIGATION</p>
          {NAV2.map(n=>(
            <button key={n.id} onClick={()=>{setView(n.id);setPatient(null);}}
              style={{width:"100%",display:"flex",alignItems:"center",gap:10,padding:"11px 12px",borderRadius:12,border:"none",
                background:view===n.id?"rgba(255,255,255,0.13)":"transparent",
                color:view===n.id?"#fff":"rgba(255,255,255,0.55)",cursor:"pointer",marginBottom:3,
                fontSize:14,fontWeight:view===n.id?700:500,fontFamily:"'Outfit',sans-serif",
                transition:"all 0.2s",textAlign:"left",borderLeft:view===n.id?`3px solid ${C.g500}`:"3px solid transparent"}}>
              <span style={{fontSize:18}}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>
        <div style={{padding:"0 12px 24px"}}>
          <div style={{background:"rgba(255,255,255,0.07)",borderRadius:14,padding:"14px 16px",marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,marginBottom:8}}>👨‍⚕️</div>
            <p style={{color:"#fff",margin:0,fontSize:14,fontWeight:700}}>Dr. Ayenachew</p>
            <p style={{color:"rgba(255,255,255,0.45)",margin:"2px 0 0",fontSize:11}}>CEO & Founder</p>
          </div>
          <button onClick={onLogout} style={{width:"100%",padding:"10px",borderRadius:12,border:"1px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.6)",cursor:"pointer",fontSize:13,fontFamily:"'Outfit',sans-serif",fontWeight:600}}>← Sign Out</button>
        </div>
      </div>

      {/* Main */}
      <div style={{flex:1,padding:32,overflow:"auto",maxHeight:"100vh"}}>

        {/* ── OVERVIEW ── */}
        {view==="overview"&&!patient&&(
          <div>
            <div className="fadeUp" style={{marginBottom:28}}>
              <h1 style={{fontSize:30,fontWeight:900,color:C.dark,letterSpacing:-1,margin:0}}>Good morning, Dr. Ayenachew 👋</h1>
              <p style={{color:C.muted,margin:"6px 0 0",fontSize:15}}>Monday, May 25, 2025 · Gondar Clinic · {PATIENTS.length} patients enrolled</p>
            </div>

            {/* KPIs */}
            <div className="fadeUp1" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
              {[
                {l:"Total Patients",v:PATIENTS.length,i:"👥",c:C.p600,bg:C.p100,sub:"+2 this month"},
                {l:"Active Subscriptions",v:PATIENTS.length,i:"⭐",c:C.g700,bg:C.g100,sub:"All enrolled"},
                {l:"High Risk Patients",v:high,i:"🚨",c:C.r500,bg:C.r100,sub:"Needs attention"},
                {l:"Monthly Revenue",v:`$${totalRev}`,i:"💰",c:C.o500,bg:C.o100,sub:"Est. subscriptions"},
              ].map(k=>(
                <div key={k.l} className="card-hover" style={{background:C.white,borderRadius:20,padding:22,border:`1.5px solid ${C.border}`,boxShadow:`0 2px 10px rgba(10,80,160,0.06)`}}>
                  <div style={{width:46,height:46,borderRadius:14,background:k.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14}}>{k.i}</div>
                  <div style={{fontSize:38,fontWeight:900,color:k.c,letterSpacing:-1,lineHeight:1}}>{k.v}</div>
                  <div style={{fontSize:13,fontWeight:700,color:C.dark,margin:"6px 0 4px"}}>{k.l}</div>
                  <div style={{fontSize:12,color:C.muted}}>{k.sub}</div>
                </div>
              ))}
            </div>

            <div className="fadeUp2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              {/* High risk */}
              <div style={{background:C.white,borderRadius:20,padding:22,border:`1.5px solid ${C.border}`}}>
                <h3 style={{fontSize:16,fontWeight:800,color:C.dark,margin:"0 0 16px",display:"flex",alignItems:"center",gap:8}}>🚨 High Risk Patients<Pill label={`${high} patients`} c={C.r500} bg={C.r100}/></h3>
                {PATIENTS.filter(p=>p.risk==="high").map((p,i,arr)=>{
                  const rec=aiRec(p);
                  return(
                    <div key={p.id} onClick={()=>{setPatient(p);setView("patients");}} style={{padding:"13px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none",cursor:"pointer"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                        <span style={{fontSize:15,fontWeight:700,color:C.dark}}>{p.name}</span>
                        <Pill label={`${p.glucose} mg/dL`} c={C.r500} bg={C.r100}/>
                      </div>
                      <p style={{margin:0,fontSize:12,color:C.mid,lineHeight:1.5}}>🤖 {rec.msg.substring(0,65)}…</p>
                    </div>
                  );
                })}
              </div>

              {/* Overdue */}
              <div style={{background:C.white,borderRadius:20,padding:22,border:`1.5px solid ${C.border}`}}>
                <h3 style={{fontSize:16,fontWeight:800,color:C.dark,margin:"0 0 16px",display:"flex",alignItems:"center",gap:8}}>⏰ Overdue Follow-ups<Pill label={`${overdue}`} c={C.o500} bg={C.o100}/></h3>
                {PATIENTS.filter(p=>new Date(p.nextVisit)<new Date()).map((p,i,arr)=>(
                  <div key={p.id} style={{padding:"13px 0",borderBottom:i<arr.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                      <span style={{fontSize:15,fontWeight:700,color:C.dark}}>{p.name}</span>
                      <Pill label="OVERDUE" c={C.o500} bg={C.o100}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <p style={{margin:0,fontSize:12,color:C.muted}}>Due: {p.nextVisit}</p>
                      <button onClick={()=>setSmsModal(p)} style={{background:C.p100,border:"none",color:C.p600,borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>Send SMS</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary */}
            <div className="fadeUp3" style={{background:`linear-gradient(135deg,${C.p900},${C.g800})`,borderRadius:20,padding:24,color:"#fff"}}>
              <p style={{fontSize:11,fontWeight:700,opacity:0.6,letterSpacing:1.5,marginBottom:10}}>🤖 AI DAILY SUMMARY</p>
              <h3 style={{fontSize:18,fontWeight:800,margin:"0 0 12px"}}>3 patients require immediate attention today</h3>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                {[
                  {icon:"🚨",label:"Yohannes Assefa",detail:"Glucose 341, 3 missed visits"},
                  {icon:"⚠️",label:"Almaz Tadesse",detail:"Glucose 312, adherence 42%"},
                  {icon:"⚠️",label:"Bekele Haile",detail:"Glucose 287, overdue follow-up"},
                ].map((a,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.1)",borderRadius:12,padding:14}}>
                    <div style={{fontSize:22,marginBottom:6}}>{a.icon}</div>
                    <p style={{margin:0,fontSize:13,fontWeight:700}}>{a.label}</p>
                    <p style={{margin:"4px 0 0",fontSize:12,opacity:0.7}}>{a.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── PATIENTS ── */}
        {view==="patients"&&!patient&&(
          <div>
            <div className="fadeUp" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
              <div>
                <h1 style={{fontSize:28,fontWeight:900,color:C.dark,letterSpacing:-0.5,margin:0}}>Patient Registry</h1>
                <p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>{filtered.length} patients shown</p>
              </div>
              <Btn v="primary" sz="md">+ Enroll Patient</Btn>
            </div>
            <div className="fadeUp1" style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
              {["all","high","medium","low"].map(f=>(
                <button key={f} onClick={()=>setFilter(f)} style={{padding:"8px 18px",borderRadius:20,border:"none",
                  background:filter===f?`linear-gradient(135deg,${C.p600},${C.p900})`:`${C.white}`,
                  color:filter===f?"#fff":C.mid,fontWeight:700,fontSize:13,cursor:"pointer",
                  fontFamily:"'Outfit',sans-serif",boxShadow:filter===f?`0 4px 14px ${C.p300}`:"none",
                  border:filter===f?"none":`1.5px solid ${C.border}`,transition:"all 0.2s"}}>
                  {f==="all"?"All Patients":f[0].toUpperCase()+f.slice(1)+" Risk"}
                </button>
              ))}
            </div>
            <div className="fadeUp2" style={{background:C.white,borderRadius:20,border:`1.5px solid ${C.border}`,overflow:"hidden",boxShadow:`0 2px 10px rgba(10,80,160,0.06)`}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:C.bg}}>
                    {["Patient","Type","Risk","Glucose","Adherence","Next Visit","Plan",""].map(h=>(
                      <th key={h} style={{padding:"14px 18px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,letterSpacing:1}}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p,i)=>(
                    <tr key={p.id} style={{borderTop:`1px solid ${C.border}`,cursor:"pointer",transition:"background 0.15s"}}
                      onMouseEnter={e=>e.currentTarget.style.background=C.bg}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      onClick={()=>setPatient(p)}>
                      <td style={{padding:"14px 18px"}}>
                        <div style={{fontWeight:700,fontSize:14,color:C.dark}}>{p.name}</div>
                        <div style={{fontSize:12,color:C.muted}}>Age {p.age} · {p.gender} · {p.city}</div>
                      </td>
                      <td style={{padding:"14px 18px",fontSize:13,color:C.mid,fontWeight:600}}>{p.type}</td>
                      <td style={{padding:"14px 18px"}}><Pill label={p.risk.toUpperCase()} c={riskC(p.risk)} bg={riskBg(p.risk)}/></td>
                      <td style={{padding:"14px 18px"}}>
                        <span style={{fontSize:17,fontWeight:800,color:gStatus(p.glucose).c}}>{p.glucose}</span>
                        <span style={{fontSize:12,color:C.muted}}> mg/dL</span>
                      </td>
                      <td style={{padding:"14px 18px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:56,height:6,background:C.border,borderRadius:3,flexShrink:0}}>
                            <div style={{height:"100%",width:`${p.adherence}%`,background:p.adherence>70?C.g600:p.adherence>50?C.o500:C.r500,borderRadius:3}}/>
                          </div>
                          <span style={{fontSize:13,fontWeight:700,color:p.adherence>70?C.g700:p.adherence>50?C.o500:C.r500}}>{p.adherence}%</span>
                        </div>
                      </td>
                      <td style={{padding:"14px 18px",fontSize:13,color:new Date(p.nextVisit)<new Date()?C.r500:C.mid,fontWeight:600}}>
                        {new Date(p.nextVisit)<new Date()&&<span style={{marginRight:4}}>⚠️</span>}{p.nextVisit}
                      </td>
                      <td style={{padding:"14px 18px"}}><Pill label={p.sub} c={p.sub==="premium"?C.g700:p.sub==="standard"?C.p600:C.muted} bg={p.sub==="premium"?C.g100:p.sub==="standard"?C.p100:C.bg}/></td>
                      <td style={{padding:"14px 18px"}}><button onClick={e=>{e.stopPropagation();setPatient(p);}} style={{background:C.p100,border:"none",color:C.p600,borderRadius:10,padding:"7px 14px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit',sans-serif"}}>View →</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PATIENT DETAIL ── */}
        {patient&&(
          <div>
            <button onClick={()=>setPatient(null)} style={{background:"none",border:"none",color:C.p600,fontWeight:700,fontSize:15,cursor:"pointer",marginBottom:24,fontFamily:"'Outfit',sans-serif",display:"flex",alignItems:"center",gap:6}}>← Back to Patients</button>
            <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:20}}>
              {/* Left */}
              <div>
                <div className="fadeUp" style={{background:C.white,borderRadius:20,padding:24,border:`1.5px solid ${C.border}`,marginBottom:16,textAlign:"center"}}>
                  <div style={{width:72,height:72,borderRadius:"50%",background:`linear-gradient(135deg,${C.p100},${C.g100})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 14px"}}>👤</div>
                  <h2 style={{fontSize:20,fontWeight:800,color:C.dark,margin:"0 0 4px"}}>{patient.name}</h2>
                  <p style={{fontSize:13,color:C.muted,marginBottom:12}}>{patient.type} · Age {patient.age} · {patient.city}</p>
                  <Pill label={patient.risk.toUpperCase()+" RISK"} c={riskC(patient.risk)} bg={riskBg(patient.risk)} size={13}/>
                  <div style={{marginTop:18,textAlign:"left"}}>
                    {[{l:"Phone",v:patient.phone,i:"📞"},{l:"Plan",v:patient.sub,i:"⭐"},{l:"Last Visit",v:patient.lastVisit,i:"📅"},{l:"Next Visit",v:patient.nextVisit,i:"📅"}].map(f=>(
                      <div key={f.l} style={{display:"flex",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                        <span style={{fontSize:16}}>{f.i}</span>
                        <div>
                          <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:0.3}}>{f.l.toUpperCase()}</div>
                          <div style={{fontSize:14,color:C.dark,fontWeight:600,marginTop:1,textTransform:"capitalize"}}>{f.v}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alerts */}
                {patient.alerts.length>0&&(
                  <div className="fadeUp1" style={{background:C.r50,borderRadius:20,padding:20,border:`1.5px solid ${C.r500}30`,marginBottom:16}}>
                    <h4 style={{color:C.r500,fontSize:14,fontWeight:800,margin:"0 0 12px"}}>🚨 Active Alerts</h4>
                    {patient.alerts.map((a,i)=>(
                      <div key={i} style={{fontSize:13,color:C.dark,padding:"6px 0",borderBottom:i<patient.alerts.length-1?`1px dashed ${C.r100}`:"none"}}>• {a}</div>
                    ))}
                  </div>
                )}

                {/* AI */}
                <div className="fadeUp2" style={{background:aiRec(patient).lvl==="danger"?C.r50:aiRec(patient).lvl==="warn"?C.o50:C.g50,borderRadius:20,padding:20,border:`1.5px solid ${aiRec(patient).lvl==="danger"?C.r500:aiRec(patient).lvl==="warn"?C.o500:C.g500}30`}}>
                  <p style={{fontSize:11,fontWeight:700,letterSpacing:1,marginBottom:8,color:C.mid}}>🤖 AI RECOMMENDATION</p>
                  <p style={{fontSize:14,color:C.dark,lineHeight:1.7,margin:"0 0 14px"}}>{aiRec(patient).msg}</p>
                  <Btn onClick={()=>notify(`Action taken for ${patient.name}`)} v="primary" sz="sm" full>Take Action →</Btn>
                </div>
              </div>

              {/* Right */}
              <div>
                <div className="fadeUp" style={{background:C.white,borderRadius:20,padding:24,border:`1.5px solid ${C.border}`,marginBottom:16}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                    <h3 style={{fontSize:16,fontWeight:800,color:C.dark,margin:0}}>Health Overview</h3>
                    <Pill label={gStatus(patient.glucose).label} c={gStatus(patient.glucose).c} bg={gStatus(patient.glucose).bg} size={13}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
                    {[
                      {l:"Glucose",v:patient.glucose,u:"mg/dL",c:gStatus(patient.glucose).c},
                      {l:"HbA1c",v:`${patient.hba1c}%`,u:"",c:patient.hba1c>8?C.r500:patient.hba1c>7?C.o500:C.g700},
                      {l:"Weight",v:`${patient.weight}kg`,u:"",c:C.p600},
                    ].map(s=>(
                      <div key={s.l} style={{textAlign:"center",background:C.bg,borderRadius:14,padding:"14px 10px"}}>
                        <div style={{fontSize:26,fontWeight:900,color:s.c,letterSpacing:-0.5}}>{s.v}</div>
                        <div style={{fontSize:11,color:C.muted,fontWeight:700,marginTop:4,letterSpacing:0.3}}>{s.l.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:20,marginBottom:16}}>
                    <Ring pct={patient.adherence} size={80} color={patient.adherence>70?C.g600:patient.adherence>50?C.o500:C.r500}/>
                    <div>
                      <p style={{margin:0,fontSize:14,fontWeight:700,color:C.dark}}>Medication Adherence</p>
                      <p style={{margin:"4px 0 0",fontSize:13,color:C.muted,lineHeight:1.5}}>
                        {patient.adherence>70?"Patient is taking medications regularly.":patient.adherence>50?"Moderate adherence — counseling recommended.":"Poor adherence — urgent intervention needed."}
                      </p>
                    </div>
                  </div>
                  <Chart compact={false}/>
                </div>

                <div className="fadeUp1" style={{background:C.white,borderRadius:20,padding:24,border:`1.5px solid ${C.border}`}}>
                  <h3 style={{fontSize:16,fontWeight:800,color:C.dark,margin:"0 0 16px"}}>Quick Actions</h3>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {[
                      {l:"📅 Book Appointment",a:()=>notify("Appointment booked")},
                      {l:"📱 Send SMS Reminder",a:()=>setSmsModal(patient)},
                      {l:"💊 Update Medications",a:()=>notify("Medication updated")},
                      {l:"📋 Add Clinical Note",a:()=>notify("Note saved")},
                      {l:"📊 Request Lab Work",a:()=>notify("Lab request sent")},
                      {l:"🚨 Flag as Emergency",a:()=>notify("Patient flagged — team notified","warn")},
                    ].map(a=>(
                      <button key={a.l} onClick={a.a} style={{padding:"12px 14px",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:12,color:C.dark,fontWeight:600,fontSize:13,cursor:"pointer",fontFamily:"'Outfit',sans-serif",textAlign:"left",transition:"all 0.15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.background=C.p100;e.currentTarget.style.borderColor=C.p300;}}
                        onMouseLeave={e=>{e.currentTarget.style.background=C.bg;e.currentTarget.style.borderColor=C.border;}}>
                        {a.l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {view==="analytics"&&(
          <div>
            <div className="fadeUp" style={{marginBottom:24}}>
              <h1 style={{fontSize:28,fontWeight:900,color:C.dark,letterSpacing:-0.5,margin:0}}>Analytics</h1>
              <p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Clinic performance & patient insights</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
              <div className="fadeUp1" style={{background:C.white,borderRadius:20,padding:24,border:`1.5px solid ${C.border}`}}>
                <h3 style={{fontSize:16,fontWeight:800,color:C.dark,margin:"0 0 20px"}}>Patient Risk Distribution</h3>
                {[{l:"High Risk",n:3,pct:50,c:C.r500},{l:"Medium Risk",n:2,pct:33,c:C.o500},{l:"Low Risk",n:1,pct:17,c:C.g600}].map((r,i)=>(
                  <div key={r.l} style={{marginBottom:16}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                      <span style={{fontSize:14,fontWeight:600,color:C.dark}}>{r.l}</span>
                      <span style={{fontSize:13,fontWeight:700,color:r.c}}>{r.n} patients ({r.pct}%)</span>
                    </div>
                    <div style={{height:8,background:C.bg,borderRadius:4,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${r.pct}%`,background:r.c,borderRadius:4}}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="fadeUp1" style={{background:C.white,borderRadius:20,padding:24,border:`1.5px solid ${C.border}`}}>
                <h3 style={{fontSize:16,fontWeight:800,color:C.dark,margin:"0 0 20px"}}>Subscription Revenue</h3>
                {[{plan:"Premium ($12)",n:2,rev:24,c:C.g700},{plan:"Standard ($7)",n:2,rev:14,c:C.p600},{plan:"Basic ($3)",n:2,rev:6,c:C.muted}].map((s,i)=>(
                  <div key={s.plan} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<2?`1px solid ${C.border}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:12,height:12,borderRadius:"50%",background:s.c}}/>
                      <span style={{fontSize:14,fontWeight:600,color:C.dark}}>{s.plan}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span style={{fontSize:15,fontWeight:800,color:s.c}}>${s.rev}/mo</span>
                      <span style={{fontSize:12,color:C.muted}}> · {s.n} patients</span>
                    </div>
                  </div>
                ))}
                <div style={{marginTop:16,background:`linear-gradient(135deg,${C.g50},${C.p50})`,borderRadius:12,padding:16,textAlign:"center"}}>
                  <p style={{margin:0,fontSize:13,color:C.mid,fontWeight:600}}>Total Monthly Revenue</p>
                  <p style={{margin:"4px 0 0",fontSize:30,fontWeight:900,color:C.g700,letterSpacing:-1}}>${totalRev}<span style={{fontSize:14,color:C.muted,fontWeight:500}}>/mo</span></p>
                </div>
              </div>
            </div>

            <div className="fadeUp2" style={{background:C.white,borderRadius:20,padding:24,border:`1.5px solid ${C.border}`}}>
              <h3 style={{fontSize:16,fontWeight:800,color:C.dark,margin:"0 0 20px"}}>Patient Growth (2025)</h3>
              <div style={{display:"flex",alignItems:"flex-end",gap:16,height:160}}>
                {[{m:"Jan",n:1},{m:"Feb",n:2},{m:"Mar",n:3},{m:"Apr",n:4},{m:"May",n:6}].map((d,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                    <span style={{fontSize:14,fontWeight:800,color:i===4?C.p600:C.muted}}>{d.n}</span>
                    <div style={{width:"100%",height:`${(d.n/6)*130}px`,background:i===4?`linear-gradient(180deg,${C.p500},${C.p800})`:`linear-gradient(180deg,${C.p200},${C.p300})`,borderRadius:"8px 8px 0 0",transition:"height 0.5s"}}/>
                    <span style={{fontSize:13,color:C.muted,fontWeight:600}}>{d.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── FOLLOW-UP ── */}
        {view==="followup"&&(
          <div>
            <div className="fadeUp" style={{marginBottom:24}}>
              <h1 style={{fontSize:28,fontWeight:900,color:C.dark,letterSpacing:-0.5,margin:0}}>Follow-up Monitor</h1>
              <p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>AI-powered patient follow-up management</p>
            </div>
            {PATIENTS.map((p,i)=>{
              const rec=aiRec(p);
              const isOD=new Date(p.nextVisit)<new Date();
              return(
                <div key={p.id} className={`fadeUp${Math.min(i+1,4)}`} style={{background:C.white,borderRadius:20,padding:22,marginBottom:14,
                  border:`1.5px solid ${rec.lvl==="danger"?C.r500:rec.lvl==="warn"?C.o500:C.border}`,
                  borderLeft:`5px solid ${riskC(p.risk)}`,boxShadow:`0 2px 10px rgba(10,80,160,0.06)`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12}}>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,flexWrap:"wrap"}}>
                        <span style={{fontSize:17,fontWeight:800,color:C.dark}}>{p.name}</span>
                        <Pill label={p.risk.toUpperCase()+" RISK"} c={riskC(p.risk)} bg={riskBg(p.risk)}/>
                        {isOD&&<Pill label="OVERDUE" c={C.r500} bg={C.r100}/>}
                        {p.adherence<50&&<Pill label="LOW ADHERENCE" c={C.o500} bg={C.o100}/>}
                      </div>
                      <div style={{display:"flex",gap:20,flexWrap:"wrap",marginBottom:12}}>
                        <span style={{fontSize:13,color:C.muted}}>Glucose: <strong style={{color:gStatus(p.glucose).c}}>{p.glucose} mg/dL</strong></span>
                        <span style={{fontSize:13,color:C.muted}}>HbA1c: <strong style={{color:p.hba1c>8?C.r500:C.g700}}>{p.hba1c}%</strong></span>
                        <span style={{fontSize:13,color:C.muted}}>Adherence: <strong style={{color:p.adherence>70?C.g600:C.r500}}>{p.adherence}%</strong></span>
                        <span style={{fontSize:13,color:isOD?C.r500:C.muted}}>Next visit: <strong>{p.nextVisit}</strong></span>
                      </div>
                      <div style={{background:rec.lvl==="danger"?C.r50:rec.lvl==="warn"?C.o50:C.g50,borderRadius:10,padding:"10px 14px",display:"inline-flex",gap:8,alignItems:"flex-start",maxWidth:"100%"}}>
                        <span style={{fontSize:16,flexShrink:0}}>🤖</span>
                        <p style={{margin:0,fontSize:13,color:C.dark,fontWeight:600,lineHeight:1.5}}>{rec.msg}</p>
                      </div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      <Btn onClick={()=>setSmsModal(p)} v="primary" sz="sm">📱 Send Reminder</Btn>
                      <Btn onClick={()=>{setPatient(p);setView("patients");}} v="outline" sz="sm">View Profile</Btn>
                      <Btn onClick={()=>notify(`Follow-up scheduled for ${p.name}`)} v="ghost" sz="sm">📅 Schedule</Btn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// ROOT
// ════════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [screen,setScreen] = useState("auth");
  const [role,setRole] = useState(null);
  return screen==="auth"
    ? <Auth onLogin={r=>{setRole(r);setScreen("app");}}/>
    : role==="patient"
      ? <PatientApp onLogout={()=>{setScreen("auth");setRole(null);}}/>
      : <Clinic onLogout={()=>{setScreen("auth");setRole(null);}}/>;
}
