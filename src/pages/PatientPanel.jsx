import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import ScheduleAppointment from "../components/patient/ScheduleAppointment";
import UpcomingAppointments from "../components/patient/UpcomingAppointments";
import AvailableDoctors from "../components/patient/AvailableDoctors";

const NAV = [
  { key: "dashboard", label: "Inicio",         emoji: "🏠" },
  { key: "doctors",   label: "Médicos",        emoji: "🩺" },
  { key: "schedule",  label: "Agendar Cita",   emoji: "📅" },
  { key: "history",   label: "Próximas Citas",  emoji: "🗓️" },
];

const TITLES = {
  dashboard: "Panel del Paciente",
  doctors:   "Médicos Disponibles",
  schedule:  "Agendar Nueva Cita",
  history:   "Próximas Citas",
};

const Dashboard = ({ user, setView }) => (
  <div>
    <div style={{
      background: "linear-gradient(135deg,#0aa4a4,#036b6b)", borderRadius: 16,
      padding: "28px 32px", marginBottom: 20,
      boxShadow: "0 8px 24px rgba(10,164,164,.3)", color: "#fff"
    }}>
      <div style={{ fontSize: 13, opacity: .8, marginBottom: 4 }}>Bienvenido de vuelta</div>
      <div style={{ fontWeight: 800, fontSize: 26, lineHeight: 1.2 }}>¡Hola, {user?.nombre}! 👋</div>
      <div style={{ fontSize: 13, opacity: .75, marginTop: 6 }}>¿Qué deseas hacer hoy?</div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      {[ 
        { key: "doctors",   label: "Ver Médicos Disponibles", desc: "Explora el directorio médico de la clínica", emoji: "🩺", color: "#036b6b", bg: "#036b6b15" },
        { key: "schedule", label: "Agendar Nueva Cita", desc: "Reserva tu próxima consulta médica", emoji: "📅", color: "#ffae00", bg: "#ffae0015" },
        { key: "history",  label: "Ver Próximas Citas",  desc: "Consulta tus citas programadas",     emoji: "🗓️", color: "#0aa4a4", bg: "#0aa4a415" },
      ].map(item => (
        <div key={item.key} onClick={() => setView(item.key)}
          style={{
            background: "#fff", borderRadius: 14, padding: "24px 22px", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,.07)", border: "1px solid #edf8f8", transition: "all .2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)";    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.07)"; }}>
          <div style={{
            width: 54, height: 54, borderRadius: 14, background: item.bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, marginBottom: 14
          }}>{item.emoji}</div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#022c30", marginBottom: 4 }}>{item.label}</div>
          <div style={{ fontSize: 12, color: "#aaa" }}>{item.desc}</div>
          <div style={{ marginTop: 14, fontSize: 12, fontWeight: 600, color: item.color }}>Ir ahora →</div>
        </div>
      ))}
    </div>
  </div>
);

export default function PatientPanel() {
  const { user, logout } = useContext(AuthContext);
  const [view, setView]  = useState("dashboard");
  const [sb, setSb]      = useState(true);
  const navigate         = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderView = () => {
    switch (view) {
      case "doctors":  return <AvailableDoctors />;
      case "schedule": return <ScheduleAppointment />;
      case "history":  return <UpcomingAppointments />;
      default:         return <Dashboard user={user} setView={setView} />;
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI',system-ui,sans-serif", overflow: "hidden" }}>
      <style>{`
        .nav-p {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 11px; border-radius: 11px; cursor: pointer;
          color: rgba(255,255,255,.6); transition: all .17s;
          white-space: nowrap; overflow: hidden;
          margin-bottom: 3px; font-size: 14px;
        }
        .nav-p:hover  { background: rgba(255,255,255,.08); color: #fff; }
        .nav-p.active { background: #0aa4a4; color: #fff; box-shadow: 0 4px 14px rgba(10,164,164,.4); font-weight: 600; }
        .btn-back:hover { background: #0aa4a4 !important; color: #fff !important; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <div style={{
        width: sb ? 232 : 64,
        background: "linear-gradient(168deg,#022c30 0%,#036b6b 100%)",
        display: "flex", flexDirection: "column", padding: "18px 10px",
        flexShrink: 0, overflow: "hidden", height: "100vh",
        position: "sticky", top: 0, transition: "width .28s ease"
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "2px 4px 22px" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11, background: "#0aa4a4", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            boxShadow: "0 4px 14px rgba(10,164,164,.5)"
          }}>🏥</div>
          {sb && (
            <span style={{ fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-.5px", whiteSpace: "nowrap" }}>
              Buena<span style={{ color: "#ffae00" }}>Salud</span>
            </span>
          )}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", marginBottom: 12 }} />

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {NAV.map(item => (
            <div key={item.key}
              className={`nav-p ${view === item.key ? "active" : ""}`}
              onClick={() => setView(item.key)}
              title={!sb ? item.label : undefined}>
              <span style={{ flexShrink: 0, fontSize: 17 }}>{item.emoji}</span>
              {sb && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", marginTop: 10, marginBottom: 10 }} />

        <div className="nav-p" onClick={handleLogout} title={!sb ? "Cerrar sesión" : undefined}>
          <span style={{ flexShrink: 0, fontSize: 17 }}>🚪</span>
          {sb && <span>Cerrar sesión</span>}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#f0fafa", minWidth: 0 }}>

        {/* Topbar */}
        <div style={{
          background: "#fff", padding: "0 22px", height: 62,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          boxShadow: "0 1px 0 #e8f8f8,0 2px 10px rgba(0,0,0,.04)", flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Toggle sidebar */}
            <button onClick={() => setSb(p => !p)}
              style={{
                background: "#f0fafa", border: "1px solid #e4f5f5", borderRadius: 9,
                padding: "7px 13px", cursor: "pointer", fontSize: 18, lineHeight: 1, color: "#036b6b"
              }}>
              {sb ? "‹" : "☰"}
            </button>

            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "#022c30", lineHeight: 1.2 }}>{TITLES[view]}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>Panel del Paciente</div>
            </div>
          </div>

          {/* Botón Volver — solo visible fuera del dashboard */}
          {view !== "dashboard" && (
            <button
              className="btn-back"
              onClick={() => setView("dashboard")}
              style={{
                background: "transparent", border: "1.5px solid #0aa4a4", borderRadius: 9,
                padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
                color: "#0aa4a4", transition: "all .2s"
              }}>
              ← Volver al Panel
            </button>
          )}

          {/* User avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg,#0aa4a4,#036b6b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 15,
              boxShadow: "0 3px 10px rgba(10,164,164,.35)"
            }}>
              {user?.nombre?.charAt(0) ?? "P"}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#022c30", lineHeight: 1.2 }}>{user?.nombre}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>Paciente</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {renderView()}
        </div>
      </div>
    </div>
  );
}
