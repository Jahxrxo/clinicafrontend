import React, { useEffect, useState } from "react";
import axios from "axios";
import MedicoAppointmentCard from "./MedicoAppointmentCard";
import { backendUrl } from "../../services/api";

const ESTADOS_ACTIVOS = ["pendiente", "confirmada"];

const MedicoUpcomingAppointments = ({ medicoId }) => {
    const [citas, setCitas]     = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitas = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${backendUrl}/citas/medico/${medicoId}`);
                setCitas(res.data.filter(c => ESTADOS_ACTIVOS.includes(c.estado)));
            } catch (err) {
                console.error("Error al obtener citas pendientes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCitas();
    }, [medicoId]);

    const handleUpdate = (id) => {
        setCitas(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div>
            <h4 style={{ color: "#022c30", fontWeight: 700, marginBottom: 20 }}>Citas Activas</h4>

            {loading ? (
                <div style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "60px 20px", gap: 16
                }}>
                    <div style={{
                        width: 48, height: 48,
                        border: "4px solid #d0f0f0",
                        borderTop: "4px solid #0aa4a4",
                        borderRadius: "50%",
                        animation: "spin .8s linear infinite"
                    }} />
                    <span style={{ color: "#6b9a9a", fontSize: 14 }}>Cargando citas activas…</span>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            ) : citas.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "60px 20px",
                    color: "#aaa", fontSize: 14
                }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    No tienes citas activas.
                </div>
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
