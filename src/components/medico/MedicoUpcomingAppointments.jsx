import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicoAppointmentCard from "./MedicoAppointmentCard";
import { backendUrl } from "../../services/api";

const MedicoUpcomingAppointments = ({ medicoId }) => {
    const [citas, setCitas] = useState([]);

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const res = await axios.get(`${backendUrl}/citas/medico/${medicoId}`);
                setCitas(res.data.filter(c => c.estado === "pendiente"));
            } catch (err) {
                console.error("Error al obtener citas pendientes:", err);
            }
        };
        fetchCitas();
    }, [medicoId]);

    const handleUpdate = (id, nuevoEstado) => {
        setCitas(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div>
            <h4>Citas Pendientes</h4>
            {citas.length === 0 ? (
                <p className="text-muted">No tienes citas pendientes.</p>
            ) : (
                citas.map(cita => (
                    <MedicoAppointmentCard
                        key={cita.id}
                        cita={{ ...cita, paciente: cita.paciente_nombre }}
                        onUpdate={handleUpdate}
                    />
                ))
            )}
        </div>
    );
};

export default MedicoUpcomingAppointments;
