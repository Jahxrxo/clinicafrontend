import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MedicoUpcomingAppointments from "../components/medico/MedicoUpcomingAppointments";
import MedicoHistoryAppointments from "../components/medico/MedicoHistoryAppointments";
import MedicoScheduleAppointment from "../components/medico/MedicoScheduleAppointment";
import { useNavigate } from "react-router-dom";

const MedicoPanel = () => {

    const { user, logout } = useContext(AuthContext);
    const [vista, setVista] = useState("pendientes");
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleReagendarCita = () => {
        setVista("reagendar");
    };

    return (
        <div
            className="min-vh-100 p-4"
            style={{
                background: "linear-gradient(135deg, #0aa4a4 0%, #036b6b 100%)",
                fontFamily: "Inter, sans-serif",
            }}
        >

            <div className="container bg-white rounded p-4 shadow">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">

                    <h2 className="fw-bold text-dark">
                        Bienvenido, Dr. {user?.nombre}
                    </h2>

                    <div className="d-flex gap-2">

                        <button
                            className="btn btn-warning"
                            onClick={handleReagendarCita}
                        >
                            Reagendar Cita
                        </button>

                        <button
                            className="btn btn-outline-danger"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>

                    </div>

                </div>

                <div className="mb-4 d-flex gap-3">

                    <button
                        className="btn btn-primary"
                        onClick={() => setVista("pendientes")}
                    >
                        Citas Pendientes
                    </button>

                    <button
                        className="btn btn-secondary"
                        onClick={() => setVista("historial")}
                    >
                        Historial de Citas
                    </button>

                </div>

                <div>

                    {vista === "pendientes" && user && (
                        <MedicoUpcomingAppointments medicoId={user.id} />
                    )}

                    {vista === "historial" && user && (
                        <MedicoHistoryAppointments medicoId={user.id} />
                    )}

                    {vista === "reagendar" && user && (
                        <MedicoScheduleAppointment medicoId={user.id} />
                    )}

                </div>

            </div>

        </div>
    );
};

export default MedicoPanel;