import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import ScheduleAppointment from "../components/patient/ScheduleAppointment";
import UpcomingAppointments from "../components/patient/UpcomingAppointments";
import { useNavigate } from "react-router-dom";

const PatientPanel = () => {
    const { user, logout } = useContext(AuthContext);
    const [view, setView] = useState("dashboard");
    const navigate = useNavigate();

    // Redirige al login si no hay usuario
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleBack = () => setView("dashboard");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div 
            className="min-vh-100 p-4" 
            style={{ 
                background: "linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-secondary) 100%)",
                fontFamily: "Inter, sans-serif",
            }}
        >

            <style>{`
                :root {
                    --clr-primary: #0aa4a4;
                    --clr-secondary: #036b6b;
                    --clr-accent: #ffae00;
                    --clr-light: #f8fefe;
                    --clr-dark: #022c30;
                    --radius: .75rem;
                    --shadow: 0 6px 16px rgba(0,0,0,.08);
                }
                /* Tarjeta central (DASHBOARD - MÁX 600PX) */
                .app-card-centered {
                    background: #fff;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    padding: 30px;
                    max-width: 600px; /* Limita el ancho */
                    margin: 40px auto;
                    width: 95%; 
                }

                .app-card-full {
                    background: #fff;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    padding: 30px;
                    margin: 40px auto;
                    width: 100%; 
                }
                .btn-pill {
                    border-radius: 50px !important;
                    transition: all .3s ease;
                }
                .btn-accent-custom {
                    background-color: var(--clr-accent) !important;
                    border-color: var(--clr-accent) !important;
                    color: white;
                }
                .btn-accent-custom:hover {
                    background-color: #e69d00 !important; 
                    border-color: #e69d00 !important;
                }
                .btn-primary-custom {
                    background-color: var(--clr-primary) !important;
                    border-color: var(--clr-primary) !important;
                    color: white;
                }
                .btn-primary-custom:hover {
                    background-color: var(--clr-secondary) !important;
                    border-color: var(--clr-secondary) !important;
                }
                /* Ajuste para el botón Volver */
                .btn-outline-secondary-custom {
                    color: var(--clr-secondary) !important;
                    border-color: var(--clr-secondary) !important;
                }
                .btn-outline-secondary-custom:hover {
                    background-color: var(--clr-secondary) !important;
                    color: white !important;
                }
            `}</style>
            <div className="container d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold" style={{ color: "var(--clr-light)" }}>Panel del Paciente</h4>
                <button 
                    className="btn btn-pill btn-outline-light" 
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
            </div>

            {view === "dashboard" && (
                <div className="app-card-centered">
                    <h2 
                        style={{ color: "var(--clr-secondary)", textAlign: "center", marginBottom: "20px" }} 
                        className="fw-bold"
                    >
                        ¡Bienvenido, {user?.nombre}!
                    </h2>
                    <div className="d-flex flex-column gap-3">
                        <button
                            className="btn btn-pill btn-accent-custom"
                            style={{ width: "100%", padding: "12px", fontSize: "1.1rem" }}
                            onClick={() => setView("schedule")}
                        >
                            Agendar Nueva Cita
                        </button>
                        <button
                            className="btn btn-pill btn-primary-custom"
                            style={{ width: "100%", padding: "12px", fontSize: "1.1rem" }}
                            onClick={() => setView("history")}
                        >
                            Ver Próximas Citas
                        </button>
                    </div>
                </div>
            )}

            {view !== "dashboard" && user && (
                <div className="container app-card-full">
                    <button
                        className="btn btn-pill btn-outline-secondary-custom mb-3"
                        onClick={handleBack}
                    >
                        ← Volver al Panel
                    </button>
                    
                    {view === "schedule" && <ScheduleAppointment />}
                    
                    {view === "history" && <UpcomingAppointments />}
                </div>
            )}
        </div>
    );
};

export default PatientPanel;