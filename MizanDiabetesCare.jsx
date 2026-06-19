import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const tokens = {
  primary: "#0A6EBD",
  primaryDark: "#084F8C",
  primaryLight: "#E8F4FD",
  accent: "#2ECC71",
  accentDark: "#27AE60",
  accentLight: "#E8F8F0",
  danger: "#E74C3C",
  dangerLight: "#FDEDEC",
  warning: "#F39C12",
  warningLight: "#FEF9E7",
  dark: "#1A2B3C",
  mid: "#4A6175",
  muted: "#8FA3B4",
  border: "#D8E8F2",
  bg: "#F4F8FC",
  white: "#FFFFFF",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const mockPatients = [
  { id: 1, name: "Almaz Tadesse", age: 54, type: "Type 2", risk: "high", glucose: 312, lastVisit: "2025-04-10", nextVisit: "2025-05-28", adherence: 42, phone: "+251-911-234567", subscription: "standard" },
  { id: 2, name: "Bekele Haile", age: 62, type: "Type 2", risk: "high", glucose: 287, lastVisit: "2025-04-22", nextVisit: "2025-05-27", adherence: 58, phone: "+251-921-345678", subscription: "basic" },
  { id: 3, name: "Tigist Worku", age: 41, type: "Type 1", risk: "medium", glucose: 168, lastVisit: "2025-05-01", nextVisit: "2025-06-01", adherence: 78, phone: "+251-931-456789", subscription: "premium" },
  { id: 4, name: "Dawit Mengiste", age: 48, type: "Type 2", risk: "low", glucose: 126, lastVisit: "2025-05-10", nextVisit: "2025-06-10", adherence: 91, phone: "+251-941-567890", subscription: "premium" },
  { id: 5, name: "Selamawit Girma", age: 37, type: "Type 2", risk: "medium", glucose: 194, lastVisit: "2025-04-15", nextVisit: "2025-05-29", adherence: 65, phone: "+251-951-678901", subscription: "standard" },
  { id: 6, name: "Yohannes Assefa", age: 71, type: "Type 2", risk: "high", glucose: 341, lastVisit: "2025-03-20", nextVisit: "2025-04-20", adherence: 31, phone: "+251-911-789012", subscription: "basic" },
];

const glucoseTrend = [
  { day: "Mon", fasting: 142, random: 198 },
  { day: "Tue", fasting: 156, random: 221 },
  { day: "Wed", fasting: 138, random: 187 },
  { day: "Thu", fasting: 163, random: 234 },
  { day: "Fri", fasting: 147, random: 205 },
  { day: "Sat", fasting: 129, random: 176 },
  { day: "Sun", fasting: 134, random: 189 },
];

const educationContent = [
  { id: 1, title: "Understanding Blood Sugar", category: "Basics", icon: "💉", duration: "5 min", description: "Learn what blood sugar means and why it matters for your health every day." },
  { id: 2, title: "Foot Care for Diabetics", category: "Prevention", icon: "🦶", duration: "4 min", description: "Daily foot inspection and care routines that prevent serious complications." },
  { id: 3, title: "Eating Well with Diabetes", category: "Nutrition", icon: "🥗", duration: "7 min", description: "Traditional Ethiopian foods and how to balance your meals for better control." },
  { id: 4, title: "Exercise & Blood Sugar", category: "Lifestyle", icon: "🚶", duration: "6 min", description: "Simple exercises you can do at home or in your neighborhood to improve control." },
  { id: 5, title: "Medication Adherence", category: "Medication", icon: "💊", duration: "3 min", description: "Why taking your medication on time every day is critical for your health." },
  { id: 6, title: "Recognizing Complications", category: "Safety", icon: "⚠️", duration: "5 min", description: "Warning signs of serious complications and when to seek urgent care." },
];

const subscriptionPlans = [
  {
    name: "Basic", price: 3, color: tokens.muted, bg: "#F8FAFC",
    features: ["Glucose logging", "Medication reminders", "Basic education content", "Monthly check-in"],
    notIncluded: ["Teleconsultation", "Complication screening", "Product delivery"],
  },
  {
    name: "Standard", price: 7, color: tokens.primary, bg: tokens.primaryLight,
    features: ["Everything in Basic", "Teleconsultation (2x/month)", "Complication screening", "Dietitian access"],
    notIncluded: ["Product delivery"],
    popular: true,
  },
  {
    name: "Premium", price: 12, color: tokens.accentDark, bg: tokens.accentLight,
    features: ["Everything in Standard", "Unlimited teleconsultation", "Product delivery", "Priority support", "Home visit (1x/month)"],
    notIncluded: [],
  },
];

// ─── UTILITY ──────────────────────────────────────────────────────────────────
const glucoseStatus = (v) => {
  if (v < 70) return { label: "Low", color: tokens.danger, bg: tokens.dangerLight, advice: "Eat something sweet immediately and contact the clinic." };
  if (v <= 140) return { label: "Normal", color: tokens.accentDark, bg: tokens.accentLight, advice: "Your glucose is well controlled. Keep it up!" };
  if (v <= 200) return { label: "Elevated", color: tokens.warning, bg: tokens.warningLight, advice: "Monitor closely. Avoid sugary foods and follow your meal plan." };
  return { label: "High", color: tokens.danger, bg: tokens.dangerLight, advice: "Your glucose is dangerously high. Contact the clinic immediately." };
};

const riskColor = (r) => r === "high" ? tokens.danger : r === "medium" ? tokens.warning : tokens.accentDark;
const riskBg = (r) => r === "high" ? tokens.dangerLight : r === "medium" ? tokens.warningLight : tokens.accentLight;

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const Card = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: tokens.white, borderRadius: 16, border: `1px solid ${tokens.border}`,
    padding: "20px", boxShadow: "0 2px 12px rgba(10,110,189,0.06)",
    cursor: onClick ? "pointer" : "default",
    transition: "box-shadow 0.2s, transform 0.2s",
    ...style,
  }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 6px 24px rgba(10,110,189,0.14)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
    onMouseLeave={e => { if (onClick) { e.currentTarget.style.boxShadow = "0 2px 12px rgba(10,110,189,0.06)"; e.currentTarget.style.transform = "translateY(0)"; } }}
  >{children}</div>
);

const Badge = ({ label, color, bg }) => (
  <span style={{ background: bg, color, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", full = false, disabled = false }) => {
  const styles = {
    primary: { background: `linear-gradient(135deg, ${tokens.primary}, ${tokens.primaryDark})`, color: "#fff", border: "none" },
    accent: { background: `linear-gradient(135deg, ${tokens.accent}, ${tokens.accentDark})`, color: "#fff", border: "none" },
    outline: { background: "transparent", color: tokens.primary, border: `2px solid ${tokens.primary}` },
    ghost: { background: tokens.primaryLight, color: tokens.primary, border: "none" },
    danger: { background: tokens.dangerLight, color: tokens.danger, border: "none" },
  };
  const sizes = { sm: { padding: "7px 14px", fontSize: 13 }, md: { padding: "11px 22px", fontSize: 15 }, lg: { padding: "15px 32px", fontSize: 17 } };
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...styles[variant], ...sizes[size],
      borderRadius: 10, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      width: full ? "100%" : "auto", opacity: disabled ? 0.6 : 1,
      fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", letterSpacing: 0.3,
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.opacity = "0.88"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.opacity = "1"; }}
    >{children}</button>
  );
};

const Input = ({ label, type = "text", value, onChange, placeholder, icon }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 600, color: tokens.dark, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 18 }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
        width: "100%", padding: icon ? "12px 12px 12px 40px" : "12px 14px",
        borderRadius: 10, border: `1.5px solid ${tokens.border}`, fontSize: 15,
        fontFamily: "'DM Sans', sans-serif", color: tokens.dark, background: tokens.bg,
        outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
      }}
        onFocus={e => e.target.style.borderColor = tokens.primary}
        onBlur={e => e.target.style.borderColor = tokens.border}
      />
    </div>
  </div>
);

// ─── GLUCOSE CHART ────────────────────────────────────────────────────────────
const GlucoseChart = ({ data }) => {
  const maxVal = 350;
  const h = 160;
  const w = 100;
  const pts = (key) => data.map((d, i) => `${(i / (data.length - 1)) * (w - 10) + 5},${h - (d[key] / maxVal) * (h - 20) - 10}`).join(" ");

  return (
    <div style={{ overflowX: "auto" }}>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 180 }} preserveAspectRatio="none">
        <defs>
          <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tokens.primary} stopOpacity="0.3" />
            <stop offset="100%" stopColor={tokens.primary} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="gr" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={tokens.accent} stopOpacity="0.3" />
            <stop offset="100%" stopColor={tokens.accent} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[70, 140, 200, 280].map(v => (
          <line key={v} x1="0" y1={h - (v / maxVal) * (h - 20) - 10} x2={w} y2={h - (v / maxVal) * (h - 20) - 10}
            stroke={tokens.border} strokeWidth="0.5" strokeDasharray="2,2" />
        ))}
        <polyline points={pts("fasting")} fill="none" stroke={tokens.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts("random")} fill="none" stroke={tokens.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={(i / (data.length - 1)) * (w - 10) + 5} cy={h - (d.fasting / maxVal) * (h - 20) - 10} r="2" fill={tokens.primary} />
            <circle cx={(i / (data.length - 1)) * (w - 10) + 5} cy={h - (d.random / maxVal) * (h - 20) - 10} r="2" fill={tokens.accent} />
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: tokens.mid }}>
          <div style={{ width: 16, height: 3, background: tokens.primary, borderRadius: 2 }} /> Fasting
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: tokens.mid }}>
          <div style={{ width: 16, height: 3, background: tokens.accent, borderRadius: 2 }} /> Random
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, padding: "0 4px" }}>
        {data.map((d, i) => (
          <span key={i} style={{ fontSize: 11, color: tokens.muted, fontFamily: "'DM Sans', sans-serif" }}>{d.day}</span>
        ))}
      </div>
    </div>
  );
};

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = () => {
    if (!email || !password) { showToast("Please fill all fields", "error"); return; }
    showToast(`Welcome to Mizan Diabetes Care!`, "success");
    setTimeout(() => onLogin(role), 800);
  };

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${tokens.primaryDark} 0%, ${tokens.primary} 50%, #1a8a4a 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      {/* Decorative circles */}
      {[...Array(3)].map((_, i) => (
        <div key={i} style={{ position: "absolute", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)", width: 300 + i * 200, height: 300 + i * 200, top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      ))}

      {toast && (
        <div style={{ position: "fixed", top: 24, right: 24, background: toast.type === "error" ? tokens.danger : tokens.accentDark, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", fontSize: 14 }}>{toast.msg}</div>
      )}

      <div style={{ width: "100%", maxWidth: 420, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 70, height: 70, borderRadius: 20, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 14px", border: "1px solid rgba(255,255,255,0.25)" }}>⚕️</div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>Mizan Diabetes Care</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", margin: "6px 0 0", fontSize: 15 }}>Balanced Care · Healthier Lives</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 24, padding: 32, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}>
          {/* Role Toggle */}
          <div style={{ display: "flex", background: tokens.bg, borderRadius: 10, padding: 4, marginBottom: 24 }}>
            {["patient", "clinic"].map(r => (
              <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "9px 0", borderRadius: 8, border: "none", background: role === r ? tokens.white : "transparent", color: role === r ? tokens.primary : tokens.muted, fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: role === r ? "0 2px 8px rgba(10,110,189,0.15)" : "none", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                {r === "patient" ? "👤 Patient" : "🏥 Clinic"}
              </button>
            ))}
          </div>

          {/* Mode Tabs */}
          <div style={{ display: "flex", borderBottom: `2px solid ${tokens.border}`, marginBottom: 24 }}>
            {["login", "signup", "forgot"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px 0", border: "none", background: "transparent", color: mode === m ? tokens.primary : tokens.muted, fontWeight: 700, fontSize: 13, cursor: "pointer", borderBottom: mode === m ? `2px solid ${tokens.primary}` : "2px solid transparent", marginBottom: -2, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize" }}>
                {m === "forgot" ? "Reset" : m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {mode === "signup" && <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} placeholder="Almaz Tadesse" icon="👤" />}
          <Input label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" icon="✉️" />
          {mode !== "forgot" && <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" icon="🔒" />}

          <Btn onClick={handleSubmit} variant="primary" size="lg" full>
            {mode === "login" ? "Sign In →" : mode === "signup" ? "Create Account →" : "Send Reset Link →"}
          </Btn>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: tokens.muted }}>
            {role === "patient" ? "For patients in Gondar & surrounding areas" : "For Mizan clinic staff only"}
          </p>

          <div style={{ marginTop: 16, padding: "12px 16px", background: tokens.primaryLight, borderRadius: 10, fontSize: 13, color: tokens.primary, textAlign: "center" }}>
            <strong>Demo:</strong> Click Sign In with any email to explore
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── PATIENT APP ──────────────────────────────────────────────────────────────
const PatientApp = ({ onLogout }) => {
  const [tab, setTab] = useState("dashboard");
  const [glucoseEntries, setGlucoseEntries] = useState(glucoseTrend);
  const [fastingVal, setFastingVal] = useState("");
  const [randomVal, setRandomVal] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("standard");
  const [toast, setToast] = useState(null);
  const [alert, setAlert] = useState(null);

  const todayGlucose = 168;
  const status = glucoseStatus(todayGlucose);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const logGlucose = () => {
    const f = parseInt(fastingVal);
    const r = parseInt(randomVal);
    if (!f && !r) { showToast("Enter at least one value", "error"); return; }
    if (f > 400 || r > 400) {
      setAlert({ msg: "⚠️ CRITICAL ALERT: Your glucose is extremely high. Contact the clinic immediately!", type: "danger" });
    }
    showToast("Glucose logged successfully ✓");
    setFastingVal(""); setRandomVal("");
  };

  const navItems = [
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "glucose", icon: "📊", label: "Glucose" },
    { id: "meds", icon: "💊", label: "Meds" },
    { id: "appointments", icon: "📅", label: "Visits" },
    { id: "education", icon: "📚", label: "Learn" },
    { id: "subscription", icon: "⭐", label: "Plans" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: tokens.bg, fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${tokens.primaryDark}, ${tokens.primary})`, padding: "20px 20px 28px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.75)", margin: 0, fontSize: 13 }}>Good morning 👋</p>
            <h2 style={{ color: "#fff", margin: "2px 0 0", fontSize: 20, fontWeight: 800 }}>Tigist Worku</h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>👤</div>
            <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Exit</button>
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: toast.type === "error" ? tokens.danger : tokens.accentDark, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 999, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.2)", whiteSpace: "nowrap" }}>{toast.msg}</div>
      )}

      {alert && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", zIndex: 998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, maxWidth: 360, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚨</div>
            <h3 style={{ color: tokens.danger, margin: "0 0 12px", fontSize: 18 }}>Critical Alert</h3>
            <p style={{ color: tokens.dark, lineHeight: 1.6, marginBottom: 20 }}>{alert.msg}</p>
            <Btn onClick={() => setAlert(null)} variant="danger" full>Understood — I will contact the clinic</Btn>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "16px 16px 100px" }}>

        {/* DASHBOARD */}
        {tab === "dashboard" && (
          <div>
            {/* Glucose Status Card */}
            <Card style={{ background: `linear-gradient(135deg, ${status.color}15, ${status.color}05)`, border: `1.5px solid ${status.color}30`, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, color: tokens.mid, fontSize: 13, fontWeight: 600 }}>TODAY'S GLUCOSE</p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, margin: "6px 0" }}>
                    <span style={{ fontSize: 48, fontWeight: 800, color: status.color, lineHeight: 1 }}>{todayGlucose}</span>
                    <span style={{ color: tokens.muted, fontSize: 16 }}>mg/dL</span>
                  </div>
                  <Badge label={status.label} color={status.color} bg={status.bg} />
                </div>
                <div style={{ fontSize: 48 }}>
                  {status.label === "Normal" ? "✅" : status.label === "Elevated" ? "⚠️" : "🚨"}
                </div>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 13, color: status.color, fontWeight: 600, lineHeight: 1.5 }}>{status.advice}</p>
            </Card>

            {/* Quick Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Next Visit", value: "May 28", icon: "📅", color: tokens.primary },
                { label: "Adherence", value: "78%", icon: "💊", color: tokens.accentDark },
                { label: "Plan", value: "Standard", icon: "⭐", color: tokens.warning },
                { label: "Streak", value: "12 days", icon: "🔥", color: "#E74C3C" },
              ].map(s => (
                <Card key={s.label} style={{ padding: 16 }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: tokens.muted, fontWeight: 600 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            {/* Today's Reminders */}
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 800, color: tokens.dark }}>Today's Reminders</h3>
              {[
                { time: "07:00", label: "Take Metformin 500mg", done: true, icon: "💊" },
                { time: "07:30", label: "Log fasting glucose", done: true, icon: "📊" },
                { time: "13:00", label: "Take Metformin 500mg", done: false, icon: "💊" },
                { time: "19:30", label: "Log evening glucose", done: false, icon: "📊" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${tokens.border}` : "none" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: r.done ? tokens.accentLight : tokens.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{r.done ? "✅" : r.icon}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: r.done ? tokens.muted : tokens.dark, textDecoration: r.done ? "line-through" : "none" }}>{r.label}</p>
                    <p style={{ margin: 0, fontSize: 12, color: tokens.muted }}>{r.time}</p>
                  </div>
                </div>
              ))}
            </Card>

            {/* Health Tip */}
            <Card style={{ background: `linear-gradient(135deg, ${tokens.accentLight}, #fff)`, border: `1.5px solid ${tokens.accent}30` }}>
              <p style={{ margin: 0, fontSize: 12, color: tokens.accentDark, fontWeight: 700 }}>💡 HEALTH TIP OF THE DAY</p>
              <p style={{ margin: "8px 0 0", fontSize: 14, color: tokens.dark, lineHeight: 1.6 }}>
                Walking for 30 minutes after meals can reduce your blood sugar by up to 22%. Even a short walk around your neighborhood helps.
              </p>
            </Card>
          </div>
        )}

        {/* GLUCOSE */}
        {tab === "glucose" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: tokens.dark, margin: "0 0 16px" }}>Glucose Tracker</h2>
            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: tokens.dark }}>Log Today's Reading</h3>
              <Input label="Fasting Glucose (mg/dL)" type="number" value={fastingVal} onChange={e => setFastingVal(e.target.value)} placeholder="e.g. 126" icon="🌅" />
              <Input label="Random Glucose (mg/dL)" type="number" value={randomVal} onChange={e => setRandomVal(e.target.value)} placeholder="e.g. 180" icon="⏰" />
              <Btn onClick={logGlucose} variant="primary" full>Log Reading</Btn>
              <div style={{ marginTop: 12, padding: "10px 12px", background: tokens.warningLight, borderRadius: 8, fontSize: 13, color: tokens.warning, fontWeight: 600 }}>
                ⚠️ Values above 400 mg/dL trigger an emergency alert
              </div>
            </Card>

            <Card>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: tokens.dark }}>7-Day Trend</h3>
              <GlucoseChart data={glucoseTrend} />
              <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { label: "Avg Fasting", value: "144", unit: "mg/dL", color: tokens.primary },
                  { label: "Avg Random", value: "201", unit: "mg/dL", color: tokens.accent },
                  { label: "In Range", value: "43%", unit: "", color: tokens.warning },
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center", padding: "10px 6px", background: tokens.bg, borderRadius: 10 }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}<span style={{ fontSize: 10, color: tokens.muted }}>{s.unit}</span></div>
                    <div style={{ fontSize: 11, color: tokens.muted, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* MEDICATIONS */}
        {tab === "meds" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: tokens.dark, margin: "0 0 16px" }}>Medications</h2>
            {[
              { name: "Metformin 500mg", type: "Tablet", freq: "Twice daily", time: "07:00 & 13:00", taken: 1, total: 2, color: tokens.primary },
              { name: "Glibenclamide 5mg", type: "Tablet", freq: "Once daily", time: "07:00", taken: 1, total: 1, color: tokens.accentDark },
              { name: "Insulin Glargine", type: "Injection", freq: "Once daily", time: "21:00", taken: 0, total: 1, color: tokens.warning },
            ].map((med, i) => (
              <Card key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: tokens.dark }}>{med.name}</h4>
                    <p style={{ margin: "3px 0 0", fontSize: 13, color: tokens.muted }}>{med.type} · {med.freq}</p>
                  </div>
                  <Badge label={med.taken === med.total ? "Done ✓" : `${med.taken}/${med.total} taken`} color={med.taken === med.total ? tokens.accentDark : tokens.warning} bg={med.taken === med.total ? tokens.accentLight : tokens.warningLight} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 14 }}>⏰</span>
                  <span style={{ fontSize: 14, color: tokens.mid, fontWeight: 600 }}>{med.time}</span>
                </div>
                <div style={{ height: 6, background: tokens.border, borderRadius: 3 }}>
                  <div style={{ height: "100%", width: `${(med.taken / med.total) * 100}%`, background: `linear-gradient(90deg, ${med.color}, ${med.color}cc)`, borderRadius: 3 }} />
                </div>
              </Card>
            ))}
            <Card style={{ background: tokens.primaryLight, border: `1px solid ${tokens.primary}30` }}>
              <p style={{ margin: 0, fontSize: 14, color: tokens.primaryDark, fontWeight: 600, lineHeight: 1.6 }}>
                📱 <strong>Reminder set:</strong> You'll receive notifications for each medication. Contact your doctor before changing any dose.
              </p>
            </Card>
          </div>
        )}

        {/* APPOINTMENTS */}
        {tab === "appointments" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: tokens.dark, margin: "0 0 16px" }}>Appointments</h2>
            <Card style={{ background: `linear-gradient(135deg, ${tokens.primaryLight}, #fff)`, border: `1.5px solid ${tokens.primary}30`, marginBottom: 16 }}>
              <p style={{ margin: "0 0 4px", fontSize: 12, color: tokens.primary, fontWeight: 700 }}>UPCOMING</p>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: tokens.dark }}>Follow-up Consultation</h3>
              <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                <span style={{ fontSize: 14, color: tokens.mid }}>📅 May 28, 2025</span>
                <span style={{ fontSize: 14, color: tokens.mid }}>⏰ 10:00 AM</span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="primary" size="sm">Confirm Visit</Btn>
                <Btn variant="outline" size="sm">Reschedule</Btn>
              </div>
            </Card>

            <Card style={{ marginBottom: 16 }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: tokens.dark }}>Request New Appointment</h3>
              <Input label="Reason for Visit" placeholder="e.g. Glucose review, foot check..." icon="📝" value="" onChange={() => {}} />
              <Input label="Preferred Date" type="date" value="" onChange={() => {}} />
              <Btn onClick={() => showToast("Appointment request sent! The clinic will confirm soon.")} variant="accent" full>Request Appointment</Btn>
            </Card>

            <Card>
              <h3 style={{ margin: "0 0 14px", fontSize: 16, fontWeight: 700, color: tokens.dark }}>Past Visits</h3>
              {[
                { date: "May 1, 2025", type: "Glucose Review", doc: "Dr. Ayenachew", result: "Elevated" },
                { date: "Apr 1, 2025", type: "Complication Screen", doc: "Dr. Samuel", result: "Normal" },
              ].map((v, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < 1 ? `1px solid ${tokens.border}` : "none" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: tokens.dark }}>{v.type}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 12, color: tokens.muted }}>{v.date} · {v.doc}</p>
                  </div>
                  <Badge label={v.result} color={v.result === "Normal" ? tokens.accentDark : tokens.warning} bg={v.result === "Normal" ? tokens.accentLight : tokens.warningLight} />
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* EDUCATION */}
        {tab === "education" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: tokens.dark, margin: "0 0 16px" }}>Learn & Manage</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {educationContent.map(e => (
                <Card key={e.id} onClick={() => showToast(`Opening: ${e.title}`)} style={{ padding: 16 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{e.icon}</div>
                  <Badge label={e.category} color={tokens.primary} bg={tokens.primaryLight} />
                  <h4 style={{ margin: "8px 0 4px", fontSize: 14, fontWeight: 700, color: tokens.dark, lineHeight: 1.4 }}>{e.title}</h4>
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: tokens.muted, lineHeight: 1.5 }}>{e.description}</p>
                  <p style={{ margin: 0, fontSize: 11, color: tokens.accent, fontWeight: 700 }}>▶ {e.duration} read</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SUBSCRIPTION */}
        {tab === "subscription" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: tokens.dark, margin: "0 0 6px" }}>Care Plans</h2>
            <p style={{ fontSize: 14, color: tokens.muted, margin: "0 0 20px" }}>Choose the plan that fits your needs</p>
            {subscriptionPlans.map(plan => (
              <Card key={plan.name} onClick={() => setSelectedPlan(plan.name.toLowerCase())} style={{ marginBottom: 14, border: selectedPlan === plan.name.toLowerCase() ? `2px solid ${plan.color}` : `1.5px solid ${tokens.border}`, position: "relative" }}>
                {plan.popular && <div style={{ position: "absolute", top: -10, right: 16, background: tokens.primary, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>MOST POPULAR</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: plan.color }}>{plan.name}</h3>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 28, fontWeight: 800, color: plan.color }}>${plan.price}</span>
                    <span style={{ fontSize: 13, color: tokens.muted }}>/month</span>
                  </div>
                </div>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{ color: tokens.accentDark, fontSize: 14, fontWeight: 700 }}>✓</span>
                    <span style={{ fontSize: 14, color: tokens.dark }}>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, opacity: 0.4 }}>
                    <span style={{ color: tokens.muted, fontSize: 14 }}>✗</span>
                    <span style={{ fontSize: 14, color: tokens.muted, textDecoration: "line-through" }}>{f}</span>
                  </div>
                ))}
                {selectedPlan === plan.name.toLowerCase() && (
                  <div style={{ marginTop: 12, padding: "8px 12px", background: `${plan.color}15`, borderRadius: 8, fontSize: 13, color: plan.color, fontWeight: 700, textAlign: "center" }}>✓ Current Selection</div>
                )}
              </Card>
            ))}
            <Btn onClick={() => showToast("Subscription updated! The clinic will be notified.")} variant="primary" full size="lg">Confirm Plan</Btn>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: tokens.white, borderTop: `1px solid ${tokens.border}`, display: "flex", zIndex: 100, boxShadow: "0 -4px 20px rgba(10,110,189,0.08)" }}>
        {navItems.map(n => (
          <button key={n.id} onClick={() => setTab(n.id)} style={{ flex: 1, padding: "10px 0 12px", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: 20 }}>{n.icon}</span>
            <span style={{ fontSize: 10, fontWeight: tab === n.id ? 800 : 500, color: tab === n.id ? tokens.primary : tokens.muted, fontFamily: "'DM Sans', sans-serif" }}>{n.label}</span>
            {tab === n.id && <div style={{ width: 20, height: 3, background: tokens.primary, borderRadius: 2 }} />}
          </button>
        ))}
      </div>
    </div>
  );
};

// ─── CLINIC DASHBOARD ─────────────────────────────────────────────────────────
const ClinicDashboard = ({ onLogout }) => {
  const [view, setView] = useState("overview");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [filterRisk, setFilterRisk] = useState("all");
  const [toast, setToast] = useState(null);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const filtered = filterRisk === "all" ? mockPatients : mockPatients.filter(p => p.risk === filterRisk);
  const highRisk = mockPatients.filter(p => p.risk === "high").length;
  const missedFollowup = mockPatients.filter(p => new Date(p.nextVisit) < new Date()).length;

  const aiRecommendation = (p) => {
    if (p.glucose > 300) return { msg: "Urgent: Schedule immediate consultation. Consider insulin adjustment.", level: "danger" };
    if (p.adherence < 50) return { msg: "Poor adherence detected. Send educational reminder and schedule counseling.", level: "warning" };
    if (new Date(p.nextVisit) < new Date()) return { msg: "Overdue follow-up. Contact patient to reschedule appointment.", level: "warning" };
    return { msg: "Patient is on track. Continue current care plan.", level: "success" };
  };

  const navItems = [
    { id: "overview", icon: "📊", label: "Overview" },
    { id: "patients", icon: "👥", label: "Patients" },
    { id: "analytics", icon: "📈", label: "Analytics" },
    { id: "followup", icon: "🔔", label: "Follow-up" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: tokens.bg, fontFamily: "'DM Sans', sans-serif" }}>
      {/* Sidebar + Main Layout */}
      <div style={{ display: "flex", minHeight: "100vh" }}>

        {/* Sidebar */}
        <div style={{ width: 220, background: `linear-gradient(180deg, ${tokens.primaryDark} 0%, #0d3a6e 100%)`, padding: "24px 0", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", flexShrink: 0 }}>
          <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>⚕️</div>
            <h2 style={{ color: "#fff", margin: 0, fontSize: 15, fontWeight: 800, lineHeight: 1.3 }}>Mizan Diabetes Care</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", margin: "4px 0 0", fontSize: 12 }}>Clinic Dashboard</p>
          </div>

          <nav style={{ padding: "20px 12px", flex: 1 }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => { setView(n.id); setSelectedPatient(null); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px", borderRadius: 10, border: "none", background: view === n.id ? "rgba(255,255,255,0.15)" : "transparent", color: view === n.id ? "#fff" : "rgba(255,255,255,0.6)", cursor: "pointer", marginBottom: 4, fontSize: 14, fontWeight: view === n.id ? 700 : 500, fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", textAlign: "left" }}>
                <span>{n.icon}</span>{n.label}
              </button>
            ))}
          </nav>

          <div style={{ padding: "0 12px 20px" }}>
            <div style={{ padding: "12px", background: "rgba(255,255,255,0.08)", borderRadius: 10, marginBottom: 10 }}>
              <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: 11, fontWeight: 600 }}>LOGGED IN AS</p>
              <p style={{ color: "#fff", margin: "4px 0 0", fontSize: 13, fontWeight: 700 }}>Dr. Ayenachew Nigus</p>
              <p style={{ color: "rgba(255,255,255,0.5)", margin: "2px 0 0", fontSize: 11 }}>CEO & Founder</p>
            </div>
            <button onClick={onLogout} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>Sign Out</button>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: 28, overflow: "auto" }}>
          {toast && (
            <div style={{ position: "fixed", top: 20, right: 20, background: tokens.accentDark, color: "#fff", padding: "12px 20px", borderRadius: 10, fontWeight: 600, zIndex: 999, fontSize: 14 }}>{toast}</div>
          )}

          {/* OVERVIEW */}
          {view === "overview" && !selectedPatient && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: tokens.dark, margin: 0 }}>Good morning, Dr. Ayenachew 👋</h1>
                <p style={{ color: tokens.muted, margin: "6px 0 0", fontSize: 15 }}>Monday, May 25, 2025 · Gondar Clinic</p>
              </div>

              {/* KPI Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[
                  { label: "Total Patients", value: mockPatients.length, icon: "👥", color: tokens.primary, bg: tokens.primaryLight, change: "+2 this week" },
                  { label: "Active Subscriptions", value: 5, icon: "⭐", color: tokens.accentDark, bg: tokens.accentLight, change: "+1 this week" },
                  { label: "High Risk", value: highRisk, icon: "🚨", color: tokens.danger, bg: tokens.dangerLight, change: "Needs attention" },
                  { label: "Missed Follow-up", value: missedFollowup, icon: "⏰", color: tokens.warning, bg: tokens.warningLight, change: "Action required" },
                ].map(k => (
                  <Card key={k.label} style={{ padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{k.icon}</div>
                    </div>
                    <div style={{ fontSize: 36, fontWeight: 800, color: k.color, lineHeight: 1 }}>{k.value}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: tokens.dark, margin: "6px 0 4px" }}>{k.label}</div>
                    <div style={{ fontSize: 12, color: tokens.muted }}>{k.change}</div>
                  </Card>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {/* High Risk Patients */}
                <Card>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: tokens.dark }}>🚨 High Risk Patients</h3>
                  {mockPatients.filter(p => p.risk === "high").map((p, i) => {
                    const rec = aiRecommendation(p);
                    return (
                      <div key={p.id} onClick={() => { setSelectedPatient(p); setView("patients"); }} style={{ padding: "12px 0", borderBottom: i < highRisk - 1 ? `1px solid ${tokens.border}` : "none", cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: tokens.dark }}>{p.name}</span>
                          <Badge label={`${p.glucose} mg/dL`} color={tokens.danger} bg={tokens.dangerLight} />
                        </div>
                        <p style={{ margin: 0, fontSize: 12, color: tokens.muted, lineHeight: 1.5 }}>🤖 {rec.msg}</p>
                      </div>
                    );
                  })}
                </Card>

                {/* Missed Follow-up */}
                <Card>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: tokens.dark }}>⏰ Missed Follow-ups</h3>
                  {mockPatients.filter(p => new Date(p.nextVisit) < new Date()).map((p, i, arr) => (
                    <div key={p.id} style={{ padding: "12px 0", borderBottom: i < arr.length - 1 ? `1px solid ${tokens.border}` : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: tokens.dark }}>{p.name}</span>
                        <Badge label="Overdue" color={tokens.warning} bg={tokens.warningLight} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <p style={{ margin: 0, fontSize: 12, color: tokens.muted }}>Was due: {p.nextVisit}</p>
                        <Btn onClick={() => showToast(`Reminder sent to ${p.name}`)} variant="ghost" size="sm">Send SMS</Btn>
                      </div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          )}

          {/* PATIENTS */}
          {view === "patients" && !selectedPatient && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: tokens.dark, margin: 0 }}>Patient List</h1>
                <Btn variant="primary">+ Add Patient</Btn>
              </div>

              {/* Filter */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {["all", "high", "medium", "low"].map(f => (
                  <button key={f} onClick={() => setFilterRisk(f)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: filterRisk === f ? tokens.primary : tokens.white, color: filterRisk === f ? "#fff" : tokens.mid, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", border: filterRisk === f ? "none" : `1.5px solid ${tokens.border}` }}>
                    {f === "all" ? "All Patients" : f.charAt(0).toUpperCase() + f.slice(1) + " Risk"}
                  </button>
                ))}
              </div>

              <Card style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: tokens.bg }}>
                      {["Patient", "Type", "Risk", "Glucose", "Adherence", "Next Visit", "Action"].map(h => (
                        <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: tokens.muted, letterSpacing: 0.5, fontFamily: "'DM Sans', sans-serif" }}>{h.toUpperCase()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p, i) => (
                      <tr key={p.id} style={{ borderTop: `1px solid ${tokens.border}`, cursor: "pointer", transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = tokens.bg}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        onClick={() => setSelectedPatient(p)}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: tokens.dark }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: tokens.muted }}>Age {p.age}</div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 14, color: tokens.mid }}>{p.type}</td>
                        <td style={{ padding: "14px 16px" }}><Badge label={p.risk.toUpperCase()} color={riskColor(p.risk)} bg={riskBg(p.risk)} /></td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{ fontSize: 15, fontWeight: 700, color: glucoseStatus(p.glucose).color }}>{p.glucose}</span>
                          <span style={{ fontSize: 12, color: tokens.muted }}> mg/dL</span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 60, height: 6, background: tokens.border, borderRadius: 3 }}>
                              <div style={{ height: "100%", width: `${p.adherence}%`, background: p.adherence > 70 ? tokens.accent : p.adherence > 50 ? tokens.warning : tokens.danger, borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: tokens.mid }}>{p.adherence}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 13, color: new Date(p.nextVisit) < new Date() ? tokens.danger : tokens.mid }}>{p.nextVisit}</td>
                        <td style={{ padding: "14px 16px" }}>
                          <Btn onClick={(e) => { e.stopPropagation(); setSelectedPatient(p); }} variant="ghost" size="sm">View →</Btn>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* PATIENT DETAIL */}
          {selectedPatient && (
            <div>
              <button onClick={() => setSelectedPatient(null)} style={{ background: "none", border: "none", color: tokens.primary, fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>← Back to Patients</button>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
                {/* Profile */}
                <div>
                  <Card style={{ marginBottom: 16, textAlign: "center", padding: 24 }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: tokens.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 12px" }}>👤</div>
                    <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: tokens.dark }}>{selectedPatient.name}</h2>
                    <p style={{ margin: "4px 0 12px", fontSize: 13, color: tokens.muted }}>Age {selectedPatient.age} · {selectedPatient.type}</p>
                    <Badge label={selectedPatient.risk.toUpperCase() + " RISK"} color={riskColor(selectedPatient.risk)} bg={riskBg(selectedPatient.risk)} />
                    <div style={{ marginTop: 16, textAlign: "left" }}>
                      {[
                        { label: "Phone", value: selectedPatient.phone, icon: "📞" },
                        { label: "Plan", value: selectedPatient.subscription, icon: "⭐" },
                        { label: "Last Visit", value: selectedPatient.lastVisit, icon: "📅" },
                        { label: "Next Visit", value: selectedPatient.nextVisit, icon: "📅" },
                      ].map(f => (
                        <div key={f.label} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: `1px solid ${tokens.border}` }}>
                          <span>{f.icon}</span>
                          <div>
                            <div style={{ fontSize: 11, color: tokens.muted, fontWeight: 600 }}>{f.label}</div>
                            <div style={{ fontSize: 14, color: tokens.dark, fontWeight: 600 }}>{f.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* AI Recommendation */}
                  <Card style={{ background: aiRecommendation(selectedPatient).level === "danger" ? tokens.dangerLight : aiRecommendation(selectedPatient).level === "warning" ? tokens.warningLight : tokens.accentLight, border: "none" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 12, fontWeight: 700, color: tokens.dark }}>🤖 AI RECOMMENDATION</p>
                    <p style={{ margin: 0, fontSize: 14, color: tokens.dark, lineHeight: 1.6 }}>{aiRecommendation(selectedPatient).msg}</p>
                    <div style={{ marginTop: 12 }}>
                      <Btn onClick={() => showToast(`Action taken for ${selectedPatient.name}`)} variant="primary" size="sm" full>Take Action</Btn>
                    </div>
                  </Card>
                </div>

                {/* Details */}
                <div>
                  <Card style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: tokens.dark }}>Glucose History</h3>
                      <Badge label={glucoseStatus(selectedPatient.glucose).label} color={glucoseStatus(selectedPatient.glucose).color} bg={glucoseStatus(selectedPatient.glucose).bg} />
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                      <div style={{ textAlign: "center", padding: "12px 20px", background: tokens.bg, borderRadius: 12, flex: 1 }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: glucoseStatus(selectedPatient.glucose).color }}>{selectedPatient.glucose}</div>
                        <div style={{ fontSize: 12, color: tokens.muted, fontWeight: 600 }}>Latest mg/dL</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "12px 20px", background: tokens.bg, borderRadius: 12, flex: 1 }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: tokens.primary }}>8.2%</div>
                        <div style={{ fontSize: 12, color: tokens.muted, fontWeight: 600 }}>HbA1c Est.</div>
                      </div>
                      <div style={{ textAlign: "center", padding: "12px 20px", background: tokens.bg, borderRadius: 12, flex: 1 }}>
                        <div style={{ fontSize: 32, fontWeight: 800, color: selectedPatient.adherence > 70 ? tokens.accentDark : tokens.warning }}>{selectedPatient.adherence}%</div>
                        <div style={{ fontSize: 12, color: tokens.muted, fontWeight: 600 }}>Adherence</div>
                      </div>
                    </div>
                    <GlucoseChart data={glucoseTrend} />
                  </Card>

                  <Card>
                    <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: tokens.dark }}>Quick Actions</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { label: "📅 Book Appointment", action: () => showToast("Appointment booked") },
                        { label: "📱 Send SMS Reminder", action: () => showToast("SMS sent") },
                        { label: "💊 Update Medications", action: () => showToast("Medication updated") },
                        { label: "📋 Add Clinical Note", action: () => showToast("Note saved") },
                      ].map(a => (
                        <Btn key={a.label} onClick={a.action} variant="ghost" full>{a.label}</Btn>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {view === "analytics" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: tokens.dark, margin: "0 0 24px" }}>Analytics</h1>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <Card>
                  <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: tokens.dark }}>Patient Risk Distribution</h3>
                  {[
                    { label: "High Risk", count: 3, pct: 50, color: tokens.danger },
                    { label: "Medium Risk", count: 2, pct: 33, color: tokens.warning },
                    { label: "Low Risk", count: 1, pct: 17, color: tokens.accent },
                  ].map(r => (
                    <div key={r.label} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: tokens.dark }}>{r.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.count} patients ({r.pct}%)</span>
                      </div>
                      <div style={{ height: 8, background: tokens.border, borderRadius: 4 }}>
                        <div style={{ height: "100%", width: `${r.pct}%`, background: r.color, borderRadius: 4, transition: "width 1s ease" }} />
                      </div>
                    </div>
                  ))}
                </Card>

                <Card>
                  <h3 style={{ margin: "0 0 20px", fontSize: 16, fontWeight: 800, color: tokens.dark }}>Subscription Breakdown</h3>
                  {[
                    { plan: "Premium", count: 2, color: tokens.accentDark },
                    { plan: "Standard", count: 2, color: tokens.primary },
                    { plan: "Basic", count: 2, color: tokens.muted },
                  ].map(s => (
                    <div key={s.plan} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${tokens.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color }} />
                        <span style={{ fontSize: 15, fontWeight: 600, color: tokens.dark }}>{s.plan}</span>
                      </div>
                      <span style={{ fontSize: 15, fontWeight: 700, color: s.color }}>{s.count} patients</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 16, padding: "12px", background: tokens.accentLight, borderRadius: 10 }}>
                    <p style={{ margin: 0, fontSize: 14, color: tokens.accentDark, fontWeight: 700 }}>Monthly Revenue Estimate: <span style={{ fontSize: 18 }}>~$44/month</span></p>
                  </div>
                </Card>

                <Card style={{ gridColumn: "1 / -1" }}>
                  <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 800, color: tokens.dark }}>Monthly Patient Growth</h3>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 140 }}>
                    {[
                      { month: "Jan", patients: 1 }, { month: "Feb", patients: 2 }, { month: "Mar", patients: 3 },
                      { month: "Apr", patients: 4 }, { month: "May", patients: 6 },
                    ].map((m, i) => (
                      <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: tokens.primary }}>{m.patients}</span>
                        <div style={{ width: "100%", height: `${(m.patients / 6) * 110}px`, background: i === 4 ? `linear-gradient(180deg, ${tokens.primary}, ${tokens.primaryDark})` : tokens.primaryLight, borderRadius: "6px 6px 0 0", transition: "height 0.5s" }} />
                        <span style={{ fontSize: 12, color: tokens.muted }}>{m.month}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* FOLLOW-UP */}
          {view === "followup" && (
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: tokens.dark, margin: "0 0 24px" }}>Follow-up Monitoring</h1>
              {mockPatients.map(p => {
                const rec = aiRecommendation(p);
                const isOverdue = new Date(p.nextVisit) < new Date();
                return (
                  <Card key={p.id} style={{ marginBottom: 14, borderLeft: `4px solid ${riskColor(p.risk)}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 16, fontWeight: 800, color: tokens.dark }}>{p.name}</span>
                          <Badge label={p.risk.toUpperCase() + " RISK"} color={riskColor(p.risk)} bg={riskBg(p.risk)} />
                          {isOverdue && <Badge label="OVERDUE" color={tokens.danger} bg={tokens.dangerLight} />}
                        </div>
                        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 10 }}>
                          <span style={{ fontSize: 13, color: tokens.muted }}>Glucose: <strong style={{ color: glucoseStatus(p.glucose).color }}>{p.glucose} mg/dL</strong></span>
                          <span style={{ fontSize: 13, color: tokens.muted }}>Adherence: <strong style={{ color: p.adherence > 70 ? tokens.accentDark : tokens.warning }}>{p.adherence}%</strong></span>
                          <span style={{ fontSize: 13, color: isOverdue ? tokens.danger : tokens.muted }}>Next visit: <strong>{p.nextVisit}</strong></span>
                        </div>
                        <div style={{ padding: "10px 12px", background: rec.level === "danger" ? tokens.dangerLight : rec.level === "warning" ? tokens.warningLight : tokens.accentLight, borderRadius: 8 }}>
                          <p style={{ margin: 0, fontSize: 13, color: tokens.dark, fontWeight: 600 }}>🤖 {rec.msg}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <Btn onClick={() => showToast(`SMS sent to ${p.name}`)} variant="primary" size="sm">Send Reminder</Btn>
                        <Btn onClick={() => { setSelectedPatient(p); setView("patients"); }} variant="outline" size="sm">View Patient</Btn>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("auth");
  const [role, setRole] = useState(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleLogin = (r) => { setRole(r); setScreen("app"); };
  const handleLogout = () => { setScreen("auth"); setRole(null); };

  if (screen === "auth") return <AuthScreen onLogin={handleLogin} />;
  if (role === "patient") return <PatientApp onLogout={handleLogout} />;
  if (role === "clinic") return <ClinicDashboard onLogout={handleLogout} />;
  return null;
}
