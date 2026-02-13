import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import AppointmentCard from "./AppointmentCard";

const UpcomingAppointments = () => {
  const { user } = useContext(AuthContext);
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("todas"); 
  const backendUrl = "http://localhost:8000";

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const res = await axios.get(`${backendUrl}/citas/historial/${user.id}`);
        setCitas(res.data);
      } catch (err) {
        console.error("Error al obtener citas:", err);
      }
    };

    if (user?.id) {
      fetchCitas();
    }
  }, [user?.id]);

  // Cancelar cita
  const handleCancel = async (citaId) => {
    try {
      await axios.put(`${backendUrl}/citas/${citaId}/cancelar`);
      setCitas((prev) =>
        prev.map((c) =>
          c.id === citaId ? { ...c, estado: "cancelada" } : c
        )
      );
    } catch (err) {
      console.error("Error al cancelar la cita:", err);
    }
  };

  // Filtrar según estado
  const citasFiltradas = citas.filter((cita) => {
    if (filtro === "todas") return true;
    return cita.estado === filtro;
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Historial de Citas</h2>

      {/* Botones de filtro */}
      <div className="mb-3">
        <button
          className={`btn me-2 ${filtro === "todas" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setFiltro("todas")}
        >
          Todas
        </button>
        <button
          className={`btn me-2 ${filtro === "pendiente" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => setFiltro("pendiente")}
        >
          Pendientes
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

      {/* Lista de citas */}
      {citasFiltradas.length === 0 ? (
        <p className="text-muted">No hay citas en esta categoría.</p>
      ) : (
        citasFiltradas.map((cita) => (
          <AppointmentCard
            key={cita.id}
            cita={cita}
            onCancel={handleCancel}
          />
        ))
      )}
    </div>
  );
};

export default UpcomingAppointments;