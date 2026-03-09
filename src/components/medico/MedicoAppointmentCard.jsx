import React from "react";
import axios from "axios";
import { backendUrl } from "../../services/api";
const MedicoAppointmentCard = ({ cita, onUpdate }) => {


    const handleCancel = async () => {
        if (!window.confirm("¿Seguro que deseas cancelar esta cita?")) return;
        try {
            await axios.patch(`${backendUrl}/citas/${cita.id}/cancelar`);
            onUpdate(cita.id, "cancelada");
        } catch (err) {
            console.error("Error al cancelar cita:", err);
            alert("No se pudo cancelar la cita. Intenta de nuevo.");
        }
    };

    const handleComplete = async () => {
        if (!window.confirm("¿Marcar esta cita como completada?")) return;
        try {
            await axios.patch(`${backendUrl}/citas/${cita.id}/completar`);
            onUpdate(cita.id, "completada");
        } catch (err) {
            console.error("Error al completar cita:", err);
            alert("No se pudo completar la cita. Intenta de nuevo.");
        }
    };

    return (
        <div className="card mb-3 shadow-sm p-3">
            <h5 className="mb-2">
                {cita.fecha_formateada} ({cita.dia}) - {cita.hora}
            </h5>
            <p><strong>Paciente:</strong> {cita.paciente}</p>
            <p><strong>Sucursal:</strong> {cita.sucursal}</p>

            <p>
                <strong>Estado: </strong>
                <span
                    className={`badge ${cita.estado === "pendiente"
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

            {cita.estado === "pendiente" && (
                <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-danger" onClick={handleCancel}>
                        Cancelar
                    </button>
                    <button className="btn btn-success" onClick={handleComplete}>
                        Marcar como Completada
                    </button>
                </div>
            )}
        </div>
    );
};

export default MedicoAppointmentCard;
