import React from "react";
import axios from "axios";

const AppointmentCard = ({ cita, onCancel }) => {
  const backendUrl = "http://localhost:8000";

  const handleCancel = async () => {
    if (!window.confirm("¿Seguro que deseas cancelar esta cita?")) return;

    try {
      await axios.patch(`${backendUrl}/citas/${cita.id}/cancelar`);
      onCancel(cita.id);
    } catch (err) {
      console.error("Error al cancelar cita:", err);
      alert("No se pudo cancelar la cita. Intenta de nuevo.");
    }
  };

  return (
    <div className="card mb-3 shadow-sm p-3">
      <h5 className="mb-2">
        {cita.fecha_formateada} ({cita.dia}) - {cita.hora}
      </h5>
      <p><strong>Médico:</strong> {cita.medico}</p>
      <p><strong>Sucursal:</strong> {cita.sucursal}</p>
      
      <p>
        <strong>Estado: </strong>
        <span
          className={`badge ${
            cita.estado === "pendiente"
              ? "bg-warning text-dark"
              : cita.estado === "cancelada"
              ? "bg-danger"
              : "bg-success"
          }`}
        >
          {cita.estado}
        </span>
      </p>

      {cita.comentarios && (
        <p><strong>Comentarios:</strong> {cita.comentarios}</p>
      )}

      {/* Botón solo si está pendiente */}
      {cita.estado === "pendiente" && (
        <button className="btn btn-danger mt-2" onClick={handleCancel}>
          Cancelar Cita
        </button>
      )}
    </div>
  );
};

export default AppointmentCard;
