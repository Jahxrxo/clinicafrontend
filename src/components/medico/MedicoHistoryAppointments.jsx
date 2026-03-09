import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicoAppointmentCard from "./MedicoAppointmentCard";
import { backendUrl } from "../../services/api";

const MedicoHistoryAppointments = ({ medicoId }) => {
  const [historial, setHistorial] = useState([]);
  const [filtro, setFiltro] = useState("todas");


  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get(`${backendUrl}/citas/medico/${medicoId}`);
        setHistorial(res.data.filter(c => c.estado !== "pendiente"));
      } catch (err) {
        console.error("Error al obtener historial:", err);
      }
    };
    fetchHistorial();
  }, [medicoId]);

  const historialFiltrado = historial.filter(cita => {
    if (filtro === "todas") return true;
    return cita.estado === filtro;
  });

  return (
    <div>
      <h4>Historial de Citas</h4>
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
        <p className="text-muted">No hay citas en esta categoría.</p>
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
