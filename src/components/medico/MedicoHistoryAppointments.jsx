import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicoAppointmentCard from "./MedicoAppointmentCard";
import { backendUrl } from "../../services/api";

const ESTADOS_ACTIVOS = ["pendiente", "confirmada"];

const MedicoHistoryAppointments = ({ medicoId }) => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");


  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get(`${backendUrl}/citas/medico/${medicoId}`);
        setHistorial(res.data.filter(c => !ESTADOS_ACTIVOS.includes(c.estado)));
      } catch (err) {
        console.error("Error al obtener historial:", err);
      }
    };
    fetchHistorial();
  }, [medicoId]);

  const historialFiltrado = historial.filter(cita => {
    const coincideEstado = filtro === "todas" ? true : cita.estado === filtro;
    const coincideBusqueda = (cita.paciente_nombre || "")
      .toLowerCase()
      .includes(busqueda.trim().toLowerCase());

    return coincideEstado && coincideBusqueda;
  });

  return (
    <div>
      <h4>Historial de Citas</h4>
      <div style={{ marginBottom: 16 }}>
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
      <div className="mb-3">
        <button
          className={`btn me-2 ${filtro === "todas" ? "btn-dark" : "btn-outline-dark"}`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
        <button
          className={`btn me-2 ${filtro === "completada" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => setFiltro("completada")}
        >
          Completadas
        </button>
        <button
          className={`btn ${filtro === "cancelada" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => setFiltro("cancelada")}
        >
          Canceladas
        </button>
      </div>

      {historialFiltrado.length === 0 ? (
        <p className="text-muted">
          {busqueda.trim() ? "No se encontraron pacientes con ese nombre." : "No hay citas en esta categoría."}
        </p>
      ) : (
        historialFiltrado.map(cita => (
          <MedicoAppointmentCard
            key={cita.id}
            cita={{ ...cita, paciente: cita.paciente_nombre }}
          />
        ))
      )}
    </div>
  );
};

export default MedicoHistoryAppointments;
