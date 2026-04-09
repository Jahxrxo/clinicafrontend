import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../services/api";

/* HELPERS*/
const ESTADOS_REAGENDABLES = ["pendiente", "confirmada"];
const DIAS_ES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const formatFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const [y, m, d] = fechaStr.split("-");
  const dia = DIAS_ES[new Date(fechaStr).getDay()];
  return `${dia} ${d}/${m}/${y}`;
};

/* MODAL DE REAGENDAR */
const ModalReagendar = ({ cita, medicoId, excepciones, onClose, onSuccess }) => {
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [loadingDisp, setLoadingDisp] = useState(true);
  const [errorDisp, setErrorDisp] = useState("");

  const [fechaSel, setFechaSel] = useState("");
  const [sucursalSel, setSucursalSel] = useState("");
  const [horaSel, setHoraSel] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState("");

  /* Cargar disponibilidad del médico */
  useEffect(() => {
    const fetch = async () => {
      setLoadingDisp(true);
      try {
        const res = await axios.get(`${backendUrl}/medicos/${medicoId}/disponibilidad`);
        setDisponibilidad(res.data || []);
      } catch {
        setErrorDisp("No se pudo cargar la disponibilidad del médico.");
      } finally {
        setLoadingDisp(false);
      }
    };
    fetch();
  }, [medicoId]);

  /* Verifica si una fecha tiene excepción */
  const tieneExcepcion = (fechaStr) => {
    return excepciones.some((e) => fechaStr >= e.fecha_inicio && fechaStr <= e.fecha_fin);
  };

  const excepcionDeFecha = (fechaStr) => {
    return excepciones.find((e) => fechaStr >= e.fecha_inicio && fechaStr <= e.fecha_fin);
  };

  /* Fechas únicas disponibles (sin excepciones) */
  const fechasDisponibles = [...new Set(disponibilidad.map((d) => d.fecha))]
    .sort()
    .filter((f) => !tieneExcepcion(f));

  /* Sucursales del día seleccionado */
  const sucursalesDelDia = disponibilidad.filter((d) => d.fecha === fechaSel);

  /* Horas del día + sucursal */
  const slotActual = disponibilidad.find(
    (d) => d.fecha === fechaSel && String(d.sucursal_id) === String(sucursalSel)
  );
  const horasDisponibles = slotActual?.horas_disponibles || [];

  const handleFechaChange = (f) => {
    setFechaSel(f);
    setHoraSel("");
    const primeraDisp = disponibilidad.find((d) => d.fecha === f);
    if (primeraDisp) setSucursalSel(String(primeraDisp.sucursal_id));
    else setSucursalSel("");
  };

  const handleGuardar = async () => {
    if (!fechaSel || !horaSel || !sucursalSel) {
      setErrorGuardar("Selecciona fecha, sucursal y hora.");
      return;
    }
    setGuardando(true);
    setErrorGuardar("");
    try {
      await axios.patch(`${backendUrl}/citas/${cita.id}/reagendar`, null, {
        params: {
          fecha: fechaSel,
          hora: horaSel,
          sucursal_id: sucursalSel,
          medico_id_param: medicoId,
        },
      });
      onSuccess(cita.id);
    } catch (err) {
      setErrorGuardar(
        err?.response?.data?.error || "No se pudo reagendar. Intenta de nuevo."
      );
    } finally {
      setGuardando(false);
    }
  };

  /* ── Estilos inline (coherentes con MedicoPanel) ── */
  const s = {
    overlay: {
      position: "fixed", inset: 0,
      background: "rgba(2,44,48,.55)",
      backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 20,
    },
    modal: {
      background: "#fff", borderRadius: 20,
      padding: "30px 28px 24px", width: "100%", maxWidth: 480,
      boxShadow: "0 24px 70px rgba(0,0,0,.28)",
      fontFamily: "'Segoe UI',system-ui,sans-serif",
      maxHeight: "90vh", overflowY: "auto",
    },
    header: { marginBottom: 20 },
    title: { fontWeight: 800, fontSize: 19, color: "#022c30", marginBottom: 4 },
    subtitle: { fontSize: 13, color: "#7a9a9a" },
    label: {
      display: "block", fontSize: 12, fontWeight: 700, color: "#022c30",
      textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 6
    },
    select: {
      width: "100%", padding: "10px 13px", borderRadius: 10,
      border: "1.5px solid #d0e8e8", fontSize: 14, color: "#022c30",
      background: "#f7fefe", outline: "none", cursor: "pointer",
    },
    field: { marginBottom: 18 },
    horaGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 },
    btnHora: (activa) => ({
      padding: "9px 4px", borderRadius: 9, fontSize: 13, fontWeight: 600,
      border: `1.5px solid ${activa ? "#0aa4a4" : "#d0e8e8"}`,
      background: activa ? "#0aa4a4" : "#f7fefe",
      color: activa ? "#fff" : "#022c30",
      cursor: "pointer", textAlign: "center", transition: "all .15s",
    }),
    errorBox: {
      background: "#fff5f5", border: "1px solid #f5c6c6",
      borderRadius: 9, padding: "10px 14px",
      color: "#c0392b", fontSize: 13, marginBottom: 16,
    },
    warningBox: {
      background: "#fffbf0", border: "1px solid #f5dfa0",
      borderRadius: 9, padding: "10px 14px",
      color: "#8a6300", fontSize: 13, marginBottom: 16,
      display: "flex", alignItems: "flex-start", gap: 8,
    },
    btnPrimary: (disabled) => ({
      padding: "10px 22px", borderRadius: 10, border: "none",
      background: disabled ? "#a0d4d4" : "#0aa4a4",
      color: "#fff", fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 14, boxShadow: disabled ? "none" : "0 4px 14px rgba(10,164,164,.35)",
      transition: "all .15s",
    }),
    btnSecondary: {
      padding: "10px 22px", borderRadius: 10,
      border: "1.5px solid #d0e8e8", background: "#fff",
      color: "#022c30", fontWeight: 600, cursor: "pointer", fontSize: 14,
    },
  };

  const canSave = fechaSel && horaSel && sucursalSel;

  return (
    <div style={s.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={s.modal}>
        <div style={s.header}>
          <div style={s.title}>📅 Reagendar Cita</div>
          <div style={s.subtitle}>
            <strong>{cita.paciente_nombre}</strong> · Cita original: {formatFecha(cita.fecha)} {cita.hora?.slice(0, 5)}
          </div>
        </div>

        {loadingDisp ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "#6b9a9a" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              border: "3px solid #d0f0f0", borderTop: "3px solid #0aa4a4",
              animation: "spin .8s linear infinite", margin: "0 auto 12px",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Cargando disponibilidad…
          </div>
        ) : errorDisp ? (
          <div style={s.errorBox}>{errorDisp}</div>
        ) : (
          <>
            {/* Aviso si hay excepciones próximas */}
            {excepciones.filter((e) => e.fecha_inicio >= new Date().toISOString().split("T")[0]).length > 0 && (
              <div style={s.warningBox}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span>
                  Tienes <strong>excepciones de disponibilidad</strong> registradas — esas fechas no aparecerán como opciones.
                </span>
              </div>
            )}

            {/* Fecha */}
            <div style={s.field}>
              <label style={s.label}>Nueva Fecha</label>
              <select style={s.select} value={fechaSel} onChange={(e) => handleFechaChange(e.target.value)}>
                <option value="">— Selecciona una fecha —</option>
                {fechasDisponibles.map((f) => (
                  <option key={f} value={f}>{formatFecha(f)}</option>
                ))}
              </select>
              {fechasDisponibles.length === 0 && (
                <p style={{ fontSize: 12, color: "#aaa", marginTop: 6 }}>
                  No hay fechas disponibles en los próximos 14 días.
                </p>
              )}
            </div>

            {/* Sucursal */}
            {fechaSel && sucursalesDelDia.length > 0 && (
              <div style={s.field}>
                <label style={s.label}>Sucursal</label>
                <select
                  style={s.select}
                  value={sucursalSel}
                  onChange={(e) => { setSucursalSel(e.target.value); setHoraSel(""); }}
                >
                  {sucursalesDelDia.map((d) => (
                    <option key={d.sucursal_id} value={String(d.sucursal_id)}>{d.sucursal_nombre}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Horas */}
            {fechaSel && sucursalSel && (
              <div style={s.field}>
                <label style={s.label}>Hora disponible</label>
                {horasDisponibles.length === 0 ? (
                  <p style={{ fontSize: 13, color: "#aaa" }}>Sin horas disponibles para este día y sucursal.</p>
                ) : (
                  <div style={s.horaGrid}>
                    {horasDisponibles.map((h) => (
                      <button key={h} style={s.btnHora(horaSel === h)} onClick={() => setHoraSel(h)}>
                        {h}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {errorGuardar && <div style={s.errorBox}>{errorGuardar}</div>}

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
              <button style={s.btnSecondary} onClick={onClose} disabled={guardando}>
                Cancelar
              </button>
              <button style={s.btnPrimary(!canSave || guardando)} onClick={handleGuardar} disabled={!canSave || guardando}>
                {guardando ? "Reagendando…" : "✓ Confirmar"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* TARJETA DE CITA(en vista Reagendar)*/
const CitaCard = ({ cita, medicoId, excepciones, onReagendada }) => {
  const [showModal, setShowModal] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSuccess = (idOriginal) => {
    setShowModal(false);
    setExito(true);
    setTimeout(() => onReagendada(idOriginal), 1400);
  };

  return (
    <>
      <div style={{
        background: exito ? "#f0fff8" : "#fff",
        border: `1.5px solid ${exito ? "#86e0be" : "#e4f5f5"}`,
        borderRadius: 14, padding: "18px 20px",
        boxShadow: "0 2px 10px rgba(0,0,0,.04)",
        transition: "all .3s", marginBottom: 12,
      }}>
        {exito ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#16a76b", fontWeight: 700 }}>
            <span style={{ fontSize: 24 }}>✅</span>
            Cita reagendada correctamente
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#022c30", marginBottom: 4 }}>
                  {formatFecha(cita.fecha)} · {cita.hora?.slice(0, 5)}
                </div>
                <div style={{ fontSize: 13, color: "#5a8a8a" }}>
                  <span style={{ marginRight: 14 }}>👤 {cita.paciente_nombre}</span>
                  <span>🏥 {cita.sucursal}</span>
                </div>
                {cita.comentarios && (
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 4 }}>
                    💬 {cita.comentarios}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  background: "#fff8e6", color: "#c07800", border: "1px solid #f0d090",
                  borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 700,
                }}>
                  {cita.estado}
                </span>
                <button
                  onClick={() => setShowModal(true)}
                  style={{
                    background: "linear-gradient(135deg,#0aa4a4,#036b6b)",
                    color: "#fff", border: "none", borderRadius: 10,
                    padding: "8px 18px", fontWeight: 700, fontSize: 13,
                    cursor: "pointer", boxShadow: "0 4px 14px rgba(10,164,164,.3)",
                    transition: "opacity .15s",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = ".85"}
                  onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
                >
                  📅 Reagendar
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <ModalReagendar
          cita={cita}
          medicoId={medicoId}
          excepciones={excepciones}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};

/* VISTA PRINCIPAL: MedicoReagendar */
const MedicoReagendar = ({ medicoId }) => {
  const [citas, setCitas] = useState([]);
  const [excepciones, setExcepciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchTodo = async () => {
      setLoading(true);
      try {
        const [citasRes, excRes] = await Promise.all([
          axios.get(`${backendUrl}/citas/medico/${medicoId}`),
          axios.get(`${backendUrl}/medicos/${medicoId}/excepciones`),
        ]);
        setCitas((citasRes.data || []).filter((c) => ESTADOS_REAGENDABLES.includes(c.estado)));
        setExcepciones(excRes.data || []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las citas.");
      } finally {
        setLoading(false);
      }
    };
    fetchTodo();
  }, [medicoId]);

  const handleReagendada = (idOriginal) => {
    setCitas((prev) => prev.filter((c) => c.id !== idOriginal));
  };

  /* Excepciones futuras/activas para el aviso */
  const hoy = new Date().toISOString().split("T")[0];
  const excepcionesVisibles = excepciones
    .filter((e) => e.fecha_fin >= hoy)
    .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));

  const citasFiltradas = citas.filter((cita) =>
    (cita.paciente_nombre || "")
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase())
  );

  return (
    <div>
      <h4 style={{ color: "#022c30", fontWeight: 800, marginBottom: 4 }}>
        Reagendar Citas
      </h4>
      <p style={{ color: "#7a9a9a", fontSize: 13, marginBottom: 22 }}>
        Selecciona una cita pendiente o confirmada y elige un nuevo horario disponible.
      </p>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar paciente"
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "11px 14px",
            borderRadius: 10,
            border: "1px solid #cfe8e8",
            background: "#fff",
            color: "#022c30",
            outline: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,.04)",
          }}
        />
      </div>

      {/* ── Banner de excepciones activas/futuras ── */}
      {excepcionesVisibles.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg,#fffbee,#fff8da)",
          border: "1.5px solid #f0d090",
          borderRadius: 12, padding: "14px 18px", marginBottom: 22,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontWeight: 700, color: "#7a5200", fontSize: 14 }}>
              Tienes {excepcionesVisibles.length === 1 ? "una excepción" : `${excepcionesVisibles.length} excepciones`} de disponibilidad registrada{excepcionesVisibles.length > 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {excepcionesVisibles.map((e) => {
              const esHoy = e.fecha_inicio <= hoy && e.fecha_fin >= hoy;
              return (
                <div key={e.id} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, color: "#6a4800",
                }}>
                  <span style={{
                    background: esHoy ? "#f0c060" : "#e0ddb0",
                    color: esHoy ? "#5a3800" : "#5a5800",
                    borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700,
                  }}>
                    {esHoy ? "ACTIVA" : "PRÓXIMA"}
                  </span>
                  <span>
                    {formatFecha(e.fecha_inicio)}
                    {e.fecha_inicio !== e.fecha_fin && ` → ${formatFecha(e.fecha_fin)}`}
                    {e.motivo && <span style={{ color: "#9a7000" }}> · {e.motivo}</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ fontSize: 12, color: "#9a7000", marginTop: 10 }}>
            Las fechas bloqueadas no aparecerán como opciones al reagendar.
          </div>
        </div>
      )}

      {/* ── Contenido principal ── */}
      {loading ? (
        <div style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "60px 20px", gap: 16,
        }}>
          <div style={{
            width: 48, height: 48,
            border: "4px solid #d0f0f0", borderTop: "4px solid #0aa4a4",
            borderRadius: "50%", animation: "spin .8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ color: "#6b9a9a", fontSize: 14 }}>Cargando citas…</span>
        </div>
      ) : error ? (
        <div style={{
          background: "#fff5f5", border: "1px solid #f5c6c6",
          borderRadius: 12, padding: 20, color: "#c0392b", fontSize: 14,
        }}>
          {error}
        </div>
      ) : citas.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px 20px",
          color: "#aaa", fontSize: 14,
          background: "#f9fefe", borderRadius: 14,
          border: "1.5px dashed #c8e8e8",
        }}>
          <div style={{ fontSize: 42, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 700, color: "#8aabab", marginBottom: 4 }}>Sin citas activas</div>
          No tienes citas disponibles para reagendar.
        </div>
      ) : citasFiltradas.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#7a9a9a", fontSize: 14,
          background: "#f9fefe", borderRadius: 14,
          border: "1.5px dashed #c8e8e8",
        }}>
          No se encontraron pacientes con ese nombre.
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 13, color: "#7a9a9a", marginBottom: 14 }}>
            {citasFiltradas.length} cita{citasFiltradas.length !== 1 ? "s" : ""} activa{citasFiltradas.length !== 1 ? "s" : ""}
          </div>
          {citasFiltradas.map((cita) => (
            <CitaCard
              key={cita.id}
              cita={cita}
              medicoId={medicoId}
              excepciones={excepciones}
              onReagendada={handleReagendada}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicoReagendar;
