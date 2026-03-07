import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../services/api";

const MedicoExcepciones = ({ medicoId }) => {
  const [excepciones, setExcepciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const [showForm, setShowForm] = useState(false);

  const hoy = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    fecha_inicio: hoy,
    fecha_fin: hoy,
    motivo: "",
  });

  // ── Cargar excepciones 
  const fetchExcepciones = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/medicos/${medicoId}/excepciones`);
      setExcepciones(res.data || []);
    } catch (err) {
      setError("No se pudieron cargar las excepciones.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (medicoId) fetchExcepciones();
  }, [medicoId]);

  // ── Helpers de feedback 
  const mostrarExito = (msg) => {
    setExito(msg);
    setError("");
    setTimeout(() => setExito(""), 3500);
  };

  const mostrarError = (msg) => {
    setError(msg);
    setExito("");
    setTimeout(() => setError(""), 4000);
  };

  // ── Crear excepción 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);

    if (form.fecha_fin < form.fecha_inicio) {
      mostrarError("La fecha de fin no puede ser anterior a la de inicio.");
      setGuardando(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("fecha_inicio", form.fecha_inicio);
      fd.append("fecha_fin", form.fecha_fin);
      fd.append("motivo", form.motivo);

      await axios.post(`${backendUrl}/medicos/${medicoId}/excepciones`, fd);
      mostrarExito("Excepción creada correctamente.");
      setForm({ fecha_inicio: hoy, fecha_fin: hoy, motivo: "" });
      setShowForm(false);
      fetchExcepciones();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        (err.response?.data?.conflictos
          ? `Solapa con: ${err.response.data.conflictos.join(", ")}`
          : "No se pudo crear la excepción.");
      mostrarError(msg);
    } finally {
      setGuardando(false);
    }
  };

  // ── Eliminar excepción 
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta excepción de disponibilidad?")) return;
    try {
      await axios.delete(`${backendUrl}/medicos/excepciones/${id}`);
      mostrarExito("Excepción eliminada.");
      setExcepciones((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      mostrarError("No se pudo eliminar la excepción.");
    }
  };

  // ── Helpers de formato 
  const formatFecha = (fechaStr) => {
    const [y, m, d] = fechaStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const esActiva = (fi, ff) => {
    const hoyDate = new Date(hoy);
    return new Date(ff) >= hoyDate && new Date(fi) <= hoyDate;
  };

  const esFutura = (fi) => new Date(fi) > new Date(hoy);

  // ── Render 
  return (
    <div>
      {/* ── Cabecera  */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-0" style={{ color: "var(--clr-secondary)" }}>
            Excepciones de Disponibilidad
          </h4>
          <p className="text-muted small mb-0 mt-1">
            Bloquea rangos de fechas en los que no estarás disponible.
          </p>
        </div>
        <button
          className="btn btn-pill px-4"
          style={{
            background: showForm ? "#e74c3c" : "var(--clr-primary)",
            border: "none",
            color: "#fff",
            borderRadius: 50,
            fontWeight: 600,
            transition: "background .3s",
          }}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "✕ Cancelar" : "+ Nueva excepción"}
        </button>
      </div>

      {/* ── Alertas  */}
      {exito && (
        <div
          className="alert alert-success py-2 px-3 rounded-3 mb-3"
          style={{ fontSize: ".9rem" }}
        >
          ✓ {exito}
        </div>
      )}
      {error && (
        <div
          className="alert alert-danger py-2 px-3 rounded-3 mb-3"
          style={{ fontSize: ".9rem" }}
        >
          ✗ {error}
        </div>
      )}

      {/* ── Formulario  */}
      {showForm && (
        <div
          className="p-4 rounded-4 mb-4"
          style={{
            background: "var(--clr-light)",
            border: "1.5px solid #d4f0f0",
            boxShadow: "0 2px 12px rgba(10,164,164,.08)",
          }}
        >
          <h6 className="fw-bold mb-3" style={{ color: "var(--clr-secondary)" }}>
            Nueva Excepción
          </h6>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-sm-6">
                <label className="form-label fw-semibold small">Fecha inicio</label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  value={form.fecha_inicio}
                  min={hoy}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fecha_inicio: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-sm-6">
                <label className="form-label fw-semibold small">Fecha fin</label>
                <input
                  type="date"
                  className="form-control rounded-3"
                  value={form.fecha_fin}
                  min={form.fecha_inicio || hoy}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fecha_fin: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold small">
                  Motivo{" "}
                  <span className="text-muted fw-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-3"
                  placeholder="Ej: Vacaciones, Congreso médico..."
                  value={form.motivo}
                  maxLength={200}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, motivo: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button
                type="submit"
                className="btn px-4"
                disabled={guardando}
                style={{
                  background: "var(--clr-primary)",
                  color: "#fff",
                  borderRadius: 50,
                  fontWeight: 600,
                  border: "none",
                }}
              >
                {guardando ? "Guardando..." : "Guardar excepción"}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                style={{ borderRadius: 50 }}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Lista de excepciones  */}
      {loading ? (
        <div className="text-center py-5 text-muted">
          <div className="spinner-border spinner-border-sm me-2" />
          Cargando excepciones...
        </div>
      ) : excepciones.length === 0 ? (
        <div
          className="text-center py-5 rounded-4"
          style={{
            background: "var(--clr-light)",
            border: "1.5px dashed #b2e0e0",
            color: "#7a9e9e",
          }}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>📅</div>
          <p className="mb-0 fw-semibold">Sin excepciones registradas</p>
          <p className="small mb-0">
            Haz clic en "+ Nueva excepción" para bloquear fechas.
          </p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {excepciones.map((exc) => {
            const activa = esActiva(exc.fecha_inicio, exc.fecha_fin);
            const futura = esFutura(exc.fecha_inicio);
            const pasada = !activa && !futura;

            let badgeColor = "#6c757d"; // pasada
            let badgeLabel = "Pasada";
            let cardBorder = "#dee2e6";
            let cardBg = "#f8f9fa";

            if (activa) {
              badgeColor = "#e67e22";
              badgeLabel = "Activa ahora";
              cardBorder = "#f0c080";
              cardBg = "#fffbf2";
            } else if (futura) {
              badgeColor = "#0aa4a4";
              badgeLabel = "Futura";
              cardBorder = "#b2e0e0";
              cardBg = "#f4fdfd";
            }

            return (
              <div
                key={exc.id}
                className="d-flex justify-content-between align-items-center px-4 py-3 rounded-4"
                style={{
                  background: cardBg,
                  border: `1.5px solid ${cardBorder}`,
                  boxShadow: "0 1px 6px rgba(0,0,0,.04)",
                }}
              >
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  {/* Ícono de calendario */}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: badgeColor + "22",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      flexShrink: 0,
                    }}
                  >
                    
                  </div>

                  <div>
                    <div className="fw-bold" style={{ color: "var(--clr-dark)", lineHeight: 1.3 }}>
                      {formatFecha(exc.fecha_inicio)} → {formatFecha(exc.fecha_fin)}
                    </div>
                    {exc.motivo && (
                      <div className="small text-muted mt-1">{exc.motivo}</div>
                    )}
                  </div>

                  <span
                    className="badge ms-1"
                    style={{
                      background: badgeColor + "22",
                      color: badgeColor,
                      border: `1px solid ${badgeColor}44`,
                      fontWeight: 600,
                      fontSize: ".75rem",
                      padding: "4px 10px",
                      borderRadius: 50,
                    }}
                  >
                    {badgeLabel}
                  </span>
                </div>

                {/* Botón eliminar */}
                {!pasada && (
                  <button
                    className="btn btn-sm"
                    style={{
                      borderRadius: 50,
                      border: "1.5px solid #e74c3c44",
                      color: "#e74c3c",
                      background: "#fff",
                      fontWeight: 600,
                      padding: "4px 14px",
                      flexShrink: 0,
                    }}
                    onClick={() => handleEliminar(exc.id)}
                  >
                    Eliminar
                  </button>
                )}
                {pasada && (
                  <span
                    className="small"
                    style={{ color: "#aaa", fontSize: ".78rem" }}
                  >
                    Solo lectura
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MedicoExcepciones;