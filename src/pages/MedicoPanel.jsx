import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import MedicoUpcomingAppointments from "../components/medico/MedicoUpcomingAppointments";
import MedicoHistoryAppointments from "../components/medico/MedicoHistoryAppointments";
import MedicoExcepciones from "../components/medico/MedicoExcepciones";
import MedicoReagendar from "../components/medico/MedicoReagendar";

const NAV = [
  { key: "pendientes", label: "Citas Pendientes", emoji: "📋" },
  { key: "reagendar", label: "Reagendar Citas", emoji: "📅" },
  { key: "historial", label: "Historial de Citas", emoji: "🗂️" },
  { key: "excepciones", label: "Excepciones", emoji: "⚙️" },
];

const TITLES = {
  pendientes: "Citas Pendientes",
  reagendar: "Reagendar Citas",
  historial: "Historial de Citas",
  excepciones: "Excepciones",
};

export default function MedicoPanel() {
  const { user, logout } = useContext(AuthContext);
  const [vista, setVista] = useState("pendientes");
  const [sb, setSb] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderVista = () => {
    if (!user) return null;
    switch (vista) {
      case "pendientes": return <MedicoUpcomingAppointments medicoId={user.id} />;
      case "reagendar": return <MedicoReagendar medicoId={user.id} />;
      case "historial": return <MedicoHistoryAppointments medicoId={user.id} />;
      case "excepciones": return <MedicoExcepciones medicoId={user.id} />;
      default: return null;
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
              Clinic<span style={{ color: "#ffae00" }}>Hub</span>
            </span>
          )}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", marginBottom: 12 }} />

        <nav style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {NAV.map(item => (
            <div key={item.key}
              className={`nav-p ${vista === item.key ? "active" : ""}`}
              onClick={() => setVista(item.key)}
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
              <div style={{ fontWeight: 700, fontSize: 15, color: "#022c30", lineHeight: 1.2 }}>{TITLES[vista]}</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>Panel del Médico</div>
            </div>
          </div>

          {/* User avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: "50%",
              background: "linear-gradient(135deg,#0aa4a4,#036b6b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontWeight: 700, fontSize: 15,
              boxShadow: "0 3px 10px rgba(10,164,164,.35)"
            }}>
              {user?.nombre?.charAt(0) ?? "M"}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#022c30", lineHeight: 1.2 }}>
                Dr. {user?.nombre}
              </div>
              <div style={{ fontSize: 11, color: "#aaa" }}>Médico</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 22 }}>
          {renderVista()}
        </div>
      </div>
    </div>
  );
}
