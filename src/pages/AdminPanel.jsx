import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminCitas from "../components/admin/AdminAppointments";
import AdminPacientes from "../components/admin/AdminPatients";
import AdminMedicos from "../components/admin/AdminMedicos";
import AdminRoles from "../components/admin/AdminRoles";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import axios from "axios";
import { backendUrl } from "../services/api";
import {
  CalendarDays, Users, Stethoscope, LogOut,
  LayoutDashboard, ShieldCheck, ChevronRight,
  Clock, Activity, CheckCircle, XCircle,
  AlertCircle, Menu, X, UserCog, ClipboardList, UserCheck
} from "lucide-react";

const MOCK_PROXIMAS_CITAS = [
  { id:1, paciente:"Pedro González",  hora:"08:30", medico:"Dr. Juan López",    tipo:"Consulta general", estado:"confirmada" },
  { id:2, paciente:"Ana Martínez",    hora:"09:15", medico:"Dra. María Torres", tipo:"Pediatría",        estado:"confirmada" },
  { id:3, paciente:"Carlos Pérez",    hora:"10:00", medico:"Dr. Juan López",    tipo:"Cardiología",      estado:"pendiente"  },
  { id:4, paciente:"María Rodríguez", hora:"11:30", medico:"Dra. María Torres", tipo:"Control",          estado:"confirmada" },
  { id:5, paciente:"José Alvarado",   hora:"12:00", medico:"Dr. Juan López",    tipo:"Urgencia",         estado:"cancelada"  },
];

const MOCK_ACTIVIDAD = [
  { id:1, tipo:"cita",      msg:"Nueva cita agendada para Pedro González",       tiempo:"Hace 5 min",  icon:"calendar", color:"#0aa4a4" },
  { id:2, tipo:"usuario",   msg:"Dr. Andrés Portillo aprobado como médico",      tiempo:"Hace 18 min", icon:"user",     color:"#2dc48e" },
  { id:3, tipo:"cancelada", msg:"Cita de José Alvarado cancelada",                tiempo:"Hace 32 min", icon:"x",        color:"#e05252" },
  { id:4, tipo:"paciente",  msg:"Nuevo paciente registrado: María Rodríguez",    tiempo:"Hace 1h",     icon:"plus",     color:"#ffae00" },
  { id:5, tipo:"cita",      msg:"Cita de Carlos Pérez reprogramada",             tiempo:"Hace 1h 20m", icon:"clock",    color:"#036b6b" },
  { id:6, tipo:"usuario",   msg:"Sofía Aguilar rechazada como secretaria",       tiempo:"Hace 2h",     icon:"shield",   color:"#e05252" },
];

const MOCK_SOLICITUDES_INIT = [
  { id: 1, nombre: "Dra. Laura Méndez",  email: "lmendez@clinic.hn", rolSolicitado: "doctor",     estado: "pendiente" },
  { id: 2, nombre: "Carlos Reyes",        email: "creyes@clinic.hn",  rolSolicitado: "secretaria", estado: "pendiente" },
  { id: 3, nombre: "Dr. Andrés Portillo", email: "aportillo@med.hn",  rolSolicitado: "doctor",     estado: "aprobado"  },
  { id: 4, nombre: "Sofía Aguilar",       email: "saguilar@clinic.hn",rolSolicitado: "secretaria", estado: "rechazado" },
];

const MOCK_DOCTORES = [
  { id: 1, nombre: "Dr. Juan López",      especialidad: "Cardiología", estado: "activo",   pacientesAsig: 32 },
  { id: 2, nombre: "Dra. María Torres",   especialidad: "Pediatría",   estado: "activo",   pacientesAsig: 28 },
  { id: 3, nombre: "Dr. Roberto Sánchez", especialidad: "Neurología",  estado: "inactivo", pacientesAsig: 0  },
];

const MOCK_PACIENTES = [
  { id: 1, nombre: "Pedro González", medico: "Dr. Juan López",    proxCita: "04 Mar 2026" },
  { id: 2, nombre: "Ana Martínez",   medico: "Dra. María Torres", proxCita: "06 Mar 2026" },
  { id: 3, nombre: "Luis Hernández", medico: "Sin asignar",        proxCita: "—"           },
];

const ROL_LABELS = { doctor: "Doctor", secretaria: "Secretaria" };
const ROL_COLORS = {
  doctor:     { bg: "rgba(10,164,164,.15)", color: "#0aa4a4" },
  secretaria: { bg: "rgba(255,174,0,.15)",  color: "#ffae00" },
};
const ESTADO_CONFIG = {
  pendiente: { icon: <AlertCircle size={14}/>, color: "#e69d00", label: "Pendiente" },
  aprobado:  { icon: <CheckCircle  size={14}/>, color: "#2dc48e", label: "Aprobado"  },
  rechazado: { icon: <XCircle      size={14}/>, color: "#e05252", label: "Rechazado" },
};

const ESTADO_CITA_CONFIG = {
  confirmada: { color:"#2dc48e", bg:"#2dc48e22", label:"Confirmada" },
  pendiente:  { color:"#e69d00", bg:"#e69d0022", label:"Pendiente"  },
  cancelada:  { color:"#e05252", bg:"#e0525222", label:"Cancelada"  },
};

const ActividadIcon = ({ tipo, color }) => {
  const icons = {
    calendar: <CalendarDays size={14}/>,
    user:     <Users        size={14}/>,
    x:        <XCircle      size={14}/>,
    plus:     <CheckCircle  size={14}/>,
    clock:    <Clock        size={14}/>,
    shield:   <ShieldCheck  size={14}/>,
  };
  return (
    <div style={{ width:30,height:30,borderRadius:"50%",background:color+"22",color,
                   display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
      {icons[tipo]}
    </div>
  );
};

/* ══════════ DASHBOARD ══════════ */
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPacientes: "—",
    totalMedicos:   "—",
    citasHoy:       "—",
    pendientes:     "—",
    canceladas:     "—",
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pacientes, medicos, citasHoy, pendientes, canceladas] = await Promise.all([
          axios.get(`${backendUrl}/usuarios/count/pacientes`),
          axios.get(`${backendUrl}/usuarios/count/medicos`),
          axios.get(`${backendUrl}/citas/count/hoy`),
          axios.get(`${backendUrl}/citas/count/pendientes`),
          axios.get(`${backendUrl}/citas/count/canceladas`),
        ]);
        setStats({
          totalPacientes: pacientes.data.count,
          totalMedicos:   medicos.data.count,
          citasHoy:       citasHoy.data.count,
          pendientes:     pendientes.data.count,
          canceladas:     canceladas.data.count,
        });
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: "Pacientes",        value: stats.totalPacientes, icon: <Users size={20}/>,        color: "#0aa4a4" },
    { label: "Médicos",          value: stats.totalMedicos,   icon: <Stethoscope size={20}/>,  color: "#036b6b" },
    { label: "Citas hoy",        value: stats.citasHoy,       icon: <CalendarDays size={20}/>, color: "#ffae00" },
    { label: "Pendientes",       value: stats.pendientes,     icon: <Clock size={20}/>,        color: "#e05252" },
    { label: "Citas canceladas", value: stats.canceladas,     icon: <XCircle size={20}/>,      color: "#9b59b6" },
  ];

  return (
    <div>
      {/* ── Tarjetas de estadísticas ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
        {statCards.map((s, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.08 }}
            style={{ background:"#fff", borderRadius:12, padding:"14px 16px", boxShadow:"0 4px 12px rgba(0,0,0,.07)",
                     borderLeft:`4px solid ${s.color}`, display:"flex", alignItems:"center", gap:12 }}
          >
            <div style={{ background: s.color+"22", borderRadius:8, padding:"8px 10px", color:s.color, flexShrink:0 }}>{s.icon}</div>
            <div>
              <div style={{ fontWeight:800, fontSize:22, color:"#022c30", lineHeight:1 }}>
                {loadingStats ? (
                  <span style={{ fontSize:14, color:"#aaa", fontWeight:400 }}>...</span>
                ) : s.value}
              </div>
              <div style={{ fontSize:12, color:"#888" }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Fila 1: Médicos + Pacientes recientes ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, marginBottom:16 }}>
        <div style={{ background:"#fff", borderRadius:12, padding:16, boxShadow:"0 4px 12px rgba(0,0,0,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Stethoscope size={17} color="#036b6b"/>
            <span style={{ fontWeight:700, color:"#022c30" }}>Médicos activos</span>
          </div>
          {MOCK_DOCTORES.map(d => (
            <div key={d.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                                      background:"#f0fafa", borderRadius:8, padding:"8px 10px", marginBottom:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:34,height:34,borderRadius:"50%",background:"#0aa4a422",color:"#0aa4a4",
                               display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14 }}>
                  {d.nombre.charAt(4)}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{d.nombre}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{d.especialidad}</div>
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ background: d.estado==="activo"?"#2dc48e22":"#e0525222",
                                color: d.estado==="activo"?"#2dc48e":"#e05252",
                                borderRadius:50, padding:"2px 8px", fontSize:11, fontWeight:600 }}>
                  {d.estado}
                </span>
                <span style={{ fontSize:11, color:"#aaa" }}>{d.pacientesAsig} pac.</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:"#fff", borderRadius:12, padding:16, boxShadow:"0 4px 12px rgba(0,0,0,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <Users size={17} color="#0aa4a4"/>
            <span style={{ fontWeight:700, color:"#022c30" }}>Pacientes recientes</span>
          </div>
          {MOCK_PACIENTES.map(p => (
            <div key={p.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                                      background:"#f0fafa", borderRadius:8, padding:"8px 10px", marginBottom:6 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:34,height:34,borderRadius:"50%",background:"#ffae0022",color:"#ffae00",
                               display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14 }}>
                  {p.nombre.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight:600, fontSize:13 }}>{p.nombre}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{p.medico}</div>
                </div>
              </div>
              <span style={{ fontSize:11, color:"#aaa" }}>{p.proxCita}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Fila 2: Próximas citas del día + Actividad reciente ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:16 }}>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
          style={{ background:"#fff", borderRadius:12, padding:16, boxShadow:"0 4px 12px rgba(0,0,0,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <CalendarDays size={17} color="#ffae00"/>
              <span style={{ fontWeight:700, color:"#022c30" }}>Próximas citas del día</span>
            </div>
            <span style={{ background:"#ffae0022", color:"#ffae00", borderRadius:50, padding:"2px 10px", fontSize:11, fontWeight:700 }}>
              Hoy
            </span>
          </div>
          {MOCK_PROXIMAS_CITAS.map((c, i) => {
            const ec = ESTADO_CITA_CONFIG[c.estado];
            return (
              <motion.div key={c.id}
                initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay: 0.28 + i*0.06 }}
                style={{ display:"flex", alignItems:"center", gap:10,
                          background:"#f0fafa", borderRadius:10, padding:"9px 12px", marginBottom:7,
                          borderLeft:`3px solid ${ec.color}` }}>
                <div style={{ minWidth:38, textAlign:"center" }}>
                  <div style={{ fontWeight:800, fontSize:13, color:"#022c30" }}>{c.hora}</div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:13, color:"#022c30", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.paciente}</div>
                  <div style={{ fontSize:11, color:"#888" }}>{c.medico} · {c.tipo}</div>
                </div>
                <span style={{ background:ec.bg, color:ec.color, borderRadius:50, padding:"2px 8px", fontSize:10, fontWeight:700, whiteSpace:"nowrap" }}>
                  {ec.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          style={{ background:"#fff", borderRadius:12, padding:16, boxShadow:"0 4px 12px rgba(0,0,0,.07)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
            <Activity size={17} color="#036b6b"/>
            <span style={{ fontWeight:700, color:"#022c30" }}>Actividad reciente</span>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:14, top:0, bottom:0, width:2, background:"#e4f5f5", borderRadius:2 }}/>
            {MOCK_ACTIVIDAD.map((a, i) => (
              <motion.div key={a.id}
                initial={{ opacity:0, x:10 }} animate={{ opacity:1, x:0 }} transition={{ delay: 0.32 + i*0.06 }}
                style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12, position:"relative" }}>
                <div style={{ zIndex:1, flexShrink:0 }}>
                  <ActividadIcon tipo={a.icon} color={a.color}/>
                </div>
                <div style={{ flex:1, paddingTop:3 }}>
                  <div style={{ fontSize:12, color:"#022c30", fontWeight:500, lineHeight:1.4 }}>{a.msg}</div>
                  <div style={{ fontSize:11, color:"#aaa", marginTop:2 }}>{a.tiempo}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};


/* ══════════ MAIN ══════════ */
const NAV = [
  { key:"dashboard", label:"Dashboard",  icon:<LayoutDashboard size={18}/> },
  { key:"citas",     label:"Citas",       icon:<CalendarDays    size={18}/> },
  { key:"pacientes", label:"Pacientes",   icon:<Users           size={18}/> },
  { key:"medicos",   label:"Médicos",     icon:<Stethoscope     size={18}/> },
  { key:"roles",     label:"Roles",       icon:<ShieldCheck     size={18}/>, badge:2 },
];
const TITLES = { dashboard:"Dashboard", citas:"Gestión de Citas", pacientes:"Gestión de Pacientes", medicos:"Gestión de Médicos", roles:"Asignación de Roles" };

export default function AdminPanel() {
  const { user,logout } = useContext(AuthContext);  
  const navigate = useNavigate();
  const [vista, setVista]         = useState("dashboard");
  const [sidebarOpen, setSidebar] = useState(true);
  const handleLogout = () => {
  logout();
  navigate("/login");
};
  const renderVista = () => {
    switch(vista) {
      case "dashboard":  return <Dashboard/>;
      case "roles":      return <AdminRoles/>;
      case "citas":      return <AdminCitas/>;
      case "pacientes":  return <AdminPacientes/>;
      case "medicos":    return <AdminMedicos/>;
      default:           return <Dashboard/>;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* SIDEBAR */}
      <aside style={{
        width: sidebarOpen ? 230 : 68,
        minHeight:"100vh",
        background:"linear-gradient(175deg,#022c30 0%,#036b6b 100%)",
        display:"flex", flexDirection:"column",
        padding:"16px 10px",
        transition:"width .3s ease",
        flexShrink:0,
        position:"sticky", top:0, height:"100vh",
        overflow:"hidden"
      }}>
        <div style={{ display:"flex",alignItems:"center",gap:10,padding:"4px 4px 20px",whiteSpace:"nowrap" }}>
          <div style={{ width:36,height:36,borderRadius:10,background:"#0aa4a4",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <Activity size={18} color="#fff"/>
          </div>
          {sidebarOpen && <span style={{ fontWeight:800,fontSize:17,color:"#fff",letterSpacing:"-0.5px" }}>
            Clinic<span style={{color:"#ffae00"}}>Hub</span>
          </span>}
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.12)",marginBottom:10 }}/>

        <nav style={{ flex:1 }}>
          {NAV.map(item => {
            const active = vista===item.key;
            return (
              <div key={item.key} onClick={()=>setVista(item.key)}
                title={!sidebarOpen ? item.label : undefined}
                style={{
                  display:"flex", alignItems:"center", gap:10,
                  padding:"10px 10px", borderRadius:10, cursor:"pointer",
                  color: active ? "#fff" : "rgba(255,255,255,.6)",
                  background: active ? "#0aa4a4" : "transparent",
                  boxShadow: active ? "0 4px 12px rgba(10,164,164,.35)" : "none",
                  marginBottom:4, transition:"all .2s", whiteSpace:"nowrap", position:"relative",
                }}>
                {item.icon}
                {sidebarOpen && <span style={{ fontSize:14,fontWeight:500 }}>{item.label}</span>}
                {sidebarOpen && item.badge > 0 && (
                  <span style={{ marginLeft:"auto",background:"#ffae00",color:"#fff",fontSize:10,fontWeight:700,
                                  borderRadius:50,padding:"1px 7px",lineHeight:"16px" }}>{item.badge}</span>
                )}
                {!sidebarOpen && item.badge > 0 && (
                  <span style={{ position:"absolute",top:6,right:6,width:8,height:8,borderRadius:"50%",background:"#ffae00" }}/>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ borderTop:"1px solid rgba(255,255,255,.12)",marginTop:8,marginBottom:8 }}/>

        <div onClick={handleLogout} title={!sidebarOpen?"Cerrar sesión":undefined}
          style={{ display:"flex",alignItems:"center",gap:10,padding:"10px",borderRadius:10,cursor:"pointer",
                    color:"rgba(255,255,255,.6)",transition:"all .2s",whiteSpace:"nowrap" }}
          onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.08)"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <LogOut size={18}/>
          {sidebarOpen && <span style={{ fontSize:14,fontWeight:500 }}>Cerrar sesión</span>}
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#f0fafa", minWidth:0 }}>
        <div style={{ background:"#fff",padding:"12px 20px",display:"flex",alignItems:"center",
                       justifyContent:"space-between",boxShadow:"0 2px 8px rgba(0,0,0,.05)",
                       position:"sticky",top:0,zIndex:100 }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <button onClick={()=>setSidebar(p=>!p)}
              style={{ background:"#f0fafa",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",display:"flex" }}>
              {sidebarOpen ? <ChevronRight size={18} color="#036b6b"/> : <Menu size={18} color="#036b6b"/>}
            </button>
            <div>
              <div style={{ fontWeight:700,fontSize:15,color:"#022c30" }}>{TITLES[vista]}</div>
              <div style={{ fontSize:11,color:"#aaa" }}>Panel de Administración</div>
            </div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:36,height:36,borderRadius:"50%",background:"#0aa4a422",color:"#0aa4a4",
                           display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700 }}>A</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "#022c30", lineHeight: 1.2 }}>
                Admin {user?.nombre}
              </div>
              <div style={{ fontSize:11,color:"#aaa" }}>Admin</div>
            </div>
          </div>
        </div>

        <div style={{ flex:1,padding:20,overflowY:"auto" }}>
          <AnimatePresence mode="wait">
            <motion.div key={vista}
              initial={{ opacity:0,x:16 }} animate={{ opacity:1,x:0 }} exit={{ opacity:0,x:-16 }}
              transition={{ duration:0.2 }}>
              {renderVista()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}