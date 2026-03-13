import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle, XCircle, ShieldCheck,
  Stethoscope, UserCheck, X, Users,
  Search, UserCog, Loader
} from "lucide-react";
import axios from "axios";
import { backendUrl } from "../../services/api";

/* ══════════ COLORES POR NOMBRE DE ROL ══════════ */
const ROL_ESTILOS = {
  paciente:   { icon: <Users       size={15}/>, color: "#0aa4a4", bg: "rgba(10,164,164,.15)"  },
  doctor:     { icon: <Stethoscope size={15}/>, color: "#036b6b", bg: "rgba(3,107,107,.15)"   },
  medico:     { icon: <Stethoscope size={15}/>, color: "#036b6b", bg: "rgba(3,107,107,.15)"   },
  secretaria: { icon: <UserCheck   size={15}/>, color: "#ffae00", bg: "rgba(255,174,0,.15)"   },
  admin:      { icon: <ShieldCheck size={15}/>, color: "#9b59b6", bg: "rgba(155,89,182,.15)"  },
  sin_rol:    { icon: <XCircle     size={15}/>, color: "#aaa",    bg: "rgba(170,170,170,.15)" },
};

const getEstilo = (nombreRol) => {
  if (!nombreRol) return ROL_ESTILOS["sin_rol"];
  return ROL_ESTILOS[nombreRol.toLowerCase()] ?? ROL_ESTILOS["sin_rol"];
};

/* ── Badge de rol ── */
const RolBadge = ({ nombreRol }) => {
  const e = getEstilo(nombreRol);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: e.bg, color: e.color,
      borderRadius: 50, padding: "3px 10px", fontSize: 11, fontWeight: 600
    }}>
      {e.icon}{nombreRol ?? "Sin rol"}
    </span>
  );
};

/* ── Card wrapper ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 12, padding: 16,
    boxShadow: "0 4px 12px rgba(0,0,0,.07)", marginBottom: 16, ...style
  }}>
    {children}
  </div>
);

/* ══════════ COMPONENTE PRINCIPAL ══════════ */
export default function AdminRoles() {
  const [usuarios, setUsuarios]     = useState([]);
  const [roles, setRoles]           = useState([]);
  const [busqueda, setBusqueda]     = useState("");
  const [filtroRol, setFiltroRol]   = useState("todos");
  const [modalOpen, setModalOpen]   = useState(false);
  const [editando, setEditando]     = useState(null);
  const [rolSelec, setRolSelec]     = useState(null); 
  const [guardado, setGuardado]     = useState(false);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState(null);

  /* ── Cargar usuarios y roles ── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usuariosRes, rolesRes] = await Promise.all([
          axios.get(`${backendUrl}/roles/usuarios`),
          axios.get(`${backendUrl}/roles/`),
        ]);
        setUsuarios(usuariosRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        setError("Error al cargar los datos. Intenta de nuevo.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* ── Helpers ── */
  
  const getNombreRol = (u) => u?.roles?.nombre ?? null;
  const getRolId     = (u) => u?.rol_id ?? null;

  /* ── Filtrado ── */
  const usuariosFiltrados = usuarios.filter(u => {
    const matchBusqueda = u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
                          u.email?.toLowerCase().includes(busqueda.toLowerCase());
    const nombreRol     = getNombreRol(u)?.toLowerCase();
    const matchRol      = filtroRol === "todos" ||
                          (filtroRol === "sin_rol" ? !nombreRol : nombreRol === filtroRol.toLowerCase());
    return matchBusqueda && matchRol;
  });

  /* ── Conteo por rol ── */
  const conteo = roles.reduce((acc, r) => {
    acc[r.nombre.toLowerCase()] = usuarios.filter(u => getRolId(u) === r.id).length;
    return acc;
  }, { sin_rol: usuarios.filter(u => !getRolId(u)).length });

  /* ── Abrir modal ── */
  const abrirModal = (usuario) => {
    setEditando(usuario);
    setRolSelec(getRolId(usuario));
    setGuardado(false);
    setError(null);
    setModalOpen(true);
  };

  /* ── Guardar rol ── */
  const guardarRol = async () => {
    try {
      setSaving(true);
      await axios.put(`${backendUrl}/roles/usuarios/${editando.id}`, { rol_id: rolSelec });

      // Actualizar estado local
      const rolNuevo = roles.find(r => r.id === rolSelec);
      setUsuarios(prev => prev.map(u =>
        u.id === editando.id
          ? { ...u, rol_id: rolSelec, roles: rolNuevo ? { id: rolNuevo.id, nombre: rolNuevo.nombre } : null }
          : u
      ));

      setGuardado(true);
      setTimeout(() => setModalOpen(false), 900);
    } catch (err) {
      setError("No se pudo actualizar el rol. Intenta de nuevo.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading / Error global ── */
  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 60, gap: 12, color: "#0aa4a4" }}>
      <Loader size={20} style={{ animation: "spin 1s linear infinite" }}/>
      <span style={{ fontSize: 14, fontWeight: 600 }}>Cargando usuarios...</span>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );

  return (
    <div>

      {/* ── Tarjetas resumen por rol ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
        gap: 10, marginBottom: 16
      }}>
        {roles.map(r => {
          const key    = r.nombre.toLowerCase();
          const estilo = getEstilo(key);
          const activo = filtroRol === key;
          return (
            <motion.div key={r.id}
              whileHover={{ y: -3 }}
              onClick={() => setFiltroRol(prev => prev === key ? "todos" : key)}
              style={{
                background: activo ? estilo.color : "#fff",
                borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                boxShadow: activo ? `0 6px 20px ${estilo.color}55` : "0 4px 12px rgba(0,0,0,.07)",
                border: `2px solid ${activo ? estilo.color : "transparent"}`,
                transition: "all .2s"
              }}>
              <div style={{ color: activo ? "#fff" : estilo.color, marginBottom: 6 }}>{estilo.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, color: activo ? "#fff" : "#022c30" }}>
                {conteo[key] ?? 0}
              </div>
              <div style={{ fontSize: 11, color: activo ? "rgba(255,255,255,.8)" : "#888" }}>
                {r.nombre}s
              </div>
            </motion.div>
          );
        })}

        {/* Tarjeta sin rol */}
        <motion.div
          whileHover={{ y: -3 }}
          onClick={() => setFiltroRol(prev => prev === "sin_rol" ? "todos" : "sin_rol")}
          style={{
            background: filtroRol === "sin_rol" ? "#e05252" : "#fff",
            borderRadius: 10, padding: "12px 14px", cursor: "pointer",
            boxShadow: filtroRol === "sin_rol" ? "0 6px 20px #e0525255" : "0 4px 12px rgba(0,0,0,.07)",
            border: `2px solid ${filtroRol === "sin_rol" ? "#e05252" : (conteo["sin_rol"] > 0 ? "#e0525255" : "transparent")}`,
            transition: "all .2s"
          }}>
          <div style={{ color: filtroRol === "sin_rol" ? "#fff" : "#e05252", marginBottom: 6 }}>
            <XCircle size={15}/>
          </div>
          <div style={{ fontWeight: 800, fontSize: 20, color: filtroRol === "sin_rol" ? "#fff" : "#022c30" }}>
            {conteo["sin_rol"] ?? 0}
          </div>
          <div style={{ fontSize: 11, color: filtroRol === "sin_rol" ? "rgba(255,255,255,.8)" : "#888" }}>
            Sin rol
          </div>
        </motion.div>
      </div>

      {/* ── Tabla de usuarios ── */}
      <Card>
        {/* Header + buscador */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 10, marginBottom: 14
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserCog size={17} color="#036b6b"/>
            <span style={{ fontWeight: 700, color: "#022c30" }}>Gestión de roles</span>
            <span style={{
              background: "#036b6b22", color: "#036b6b",
              borderRadius: 50, padding: "1px 8px", fontSize: 12, fontWeight: 600
            }}>
              {usuariosFiltrados.length} usuario{usuariosFiltrados.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ position: "relative" }}>
            <Search size={14} color="#aaa" style={{
              position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)"
            }}/>
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar usuario..."
              style={{
                paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                border: "1.5px solid #e4f5f5", borderRadius: 50, fontSize: 13,
                outline: "none", width: 200, color: "#022c30", background: "#f0fafa"
              }}
            />
          </div>
        </div>

        {/* Filtro activo */}
        {filtroRol !== "todos" && (
          <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#888" }}>Filtrando por:</span>
            <RolBadge nombreRol={filtroRol === "sin_rol" ? "Sin rol" : filtroRol}/>
            <button onClick={() => setFiltroRol("todos")}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 12 }}>
              ✕ Quitar filtro
            </button>
          </div>
        )}

        {/* Error */}
        {error && !modalOpen && (
          <div style={{
            background: "#e0525222", color: "#e05252", borderRadius: 10,
            padding: "10px 14px", marginBottom: 12, fontSize: 13, fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* Tabla */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e4f5f5" }}>
                {["Usuario", "Email", "Rol actual", "Acción"].map(h => (
                  <th key={h} style={{
                    padding: "8px 10px", textAlign: "left",
                    fontWeight: 600, color: "#036b6b", whiteSpace: "nowrap"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: "28px", textAlign: "center", color: "#aaa", fontSize: 13 }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((u, i) => {
                  const nombreRol = getNombreRol(u);
                  return (
                    <motion.tr key={u.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{ borderBottom: "1px solid #f0fafa", transition: "background .15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f8fefe"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>

                      {/* Nombre + avatar */}
                      <td style={{ padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                            background: getEstilo(nombreRol).bg,
                            color: getEstilo(nombreRol).color,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 14
                          }}>
                            {u.nombre?.charAt(0) ?? "?"}
                          </div>
                          <span style={{ fontWeight: 600, color: "#022c30" }}>{u.nombre}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "10px", color: "#888" }}>{u.email}</td>

                      {/* Rol actual */}
                      <td style={{ padding: "10px" }}>
                        <RolBadge nombreRol={nombreRol}/>
                      </td>

                      {/* Acción */}
                      <td style={{ padding: "10px" }}>
                        <button onClick={() => abrirModal(u)} style={{
                          display: "flex", alignItems: "center", gap: 5,
                          background: "#0aa4a422", color: "#0aa4a4",
                          border: "1.5px solid #0aa4a444", borderRadius: 50,
                          padding: "5px 14px", fontSize: 12, fontWeight: 600,
                          cursor: "pointer", whiteSpace: "nowrap"
                        }}>
                          <UserCog size={13}/> Cambiar rol
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ══════════ MODAL ══════════ */}
      <AnimatePresence>
        {modalOpen && editando && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setModalOpen(false)}
            style={{
              position: "fixed", inset: 0, background: "rgba(2,44,48,.5)", zIndex: 1000,
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)"
            }}>
            <motion.div
              initial={{ scale: .88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: .88, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "#fff", borderRadius: 18, padding: 26,
                width: 410, boxShadow: "0 24px 64px rgba(0,0,0,.22)"
              }}>

              {/* Header modal */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, color: "#022c30" }}>
                  <ShieldCheck size={17} color="#0aa4a4"/> Asignar rol
                </div>
                <button onClick={() => setModalOpen(false)} style={{
                  background: "#f0fafa", border: "none", borderRadius: "50%",
                  width: 30, height: 30, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#888"
                }}>
                  <X size={16}/>
                </button>
              </div>

              {/* Info usuario */}
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                background: "#f0fafa", borderRadius: 12, padding: "12px 14px", marginBottom: 18
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
                  background: getEstilo(getNombreRol(editando)).bg,
                  color: getEstilo(getNombreRol(editando)).color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 18
                }}>
                  {editando.nombre?.charAt(0) ?? "?"}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#022c30", fontSize: 14 }}>{editando.nombre}</div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>{editando.email}</div>
                  <RolBadge nombreRol={getNombreRol(editando)}/>
                </div>
              </div>

              {/* Selector de roles desde la BD */}
              <p style={{ fontSize: 11, color: "#888", marginBottom: 10, fontWeight: 700, letterSpacing: ".5px" }}>
                SELECCIONAR NUEVO ROL
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
                {roles.map(r => {
                  const estilo       = getEstilo(r.nombre.toLowerCase());
                  const seleccionado = rolSelec === r.id;
                  const esActual     = getRolId(editando) === r.id;
                  return (
                    <button key={r.id} onClick={() => setRolSelec(r.id)} style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "11px 14px", borderRadius: 10, cursor: "pointer",
                      transition: "all .18s", position: "relative",
                      background: seleccionado ? estilo.color : estilo.bg,
                      color:      seleccionado ? "#fff"        : estilo.color,
                      border:    `2px solid ${seleccionado ? estilo.color : "transparent"}`,
                      fontWeight: 600, fontSize: 13,
                      boxShadow: seleccionado ? `0 4px 14px ${estilo.color}44` : "none",
                    }}>
                      {estilo.icon} {r.nombre}
                      {esActual && (
                        <span style={{
                          position: "absolute", top: -7, right: -7,
                          background: "#2dc48e", color: "#fff",
                          fontSize: 9, fontWeight: 700, borderRadius: 50, padding: "2px 7px"
                        }}>
                          Actual
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Error en modal */}
              {error && (
                <div style={{
                  background: "#e0525222", color: "#e05252", borderRadius: 10,
                  padding: "10px 14px", marginBottom: 14, fontSize: 13, fontWeight: 600
                }}>
                  {error}
                </div>
              )}

              {/* Feedback éxito */}
              <AnimatePresence>
                {guardado && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      background: "#2dc48e22", color: "#2dc48e",
                      borderRadius: 10, padding: "10px 14px", marginBottom: 14,
                      fontWeight: 600, fontSize: 13
                    }}>
                    <CheckCircle size={15}/> Rol actualizado correctamente
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botones */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setModalOpen(false)} disabled={saving} style={{
                  flex: 1, padding: "10px", borderRadius: 50,
                  border: "1.5px solid #e4f5f5", background: "transparent",
                  color: "#888", fontWeight: 600, cursor: "pointer", fontSize: 13
                }}>
                  Cancelar
                </button>
                <button
                  onClick={guardarRol}
                  disabled={rolSelec === getRolId(editando) || saving}
                  style={{
                    flex: 2, padding: "10px", borderRadius: 50, border: "none",
                    background: (rolSelec === getRolId(editando) || saving) ? "#e4f5f5" : "#0aa4a4",
                    color:      (rolSelec === getRolId(editando) || saving) ? "#aaa"    : "#fff",
                    fontWeight: 700, fontSize: 13, transition: "all .2s",
                    cursor: (rolSelec === getRolId(editando) || saving) ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>
                  {saving
                    ? <><Loader size={14} style={{ animation: "spin 1s linear infinite" }}/> Guardando...</>
                    : <><CheckCircle size={14}/>{rolSelec === getRolId(editando) ? "Sin cambios" : `Asignar como ${roles.find(r => r.id === rolSelec)?.nombre ?? ""}`}</>
                  }
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}