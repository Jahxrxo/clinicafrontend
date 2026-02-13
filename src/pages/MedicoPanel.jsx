import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MedicoUpcomingAppointments from "../components/medico/MedicoUpcomingAppointments";
import MedicoHistoryAppointments from "../components/medico/MedicoHistoryAppointments";
import { useNavigate } from "react-router-dom";

const MedicoPanel = () => {
    const { user, logout } = useContext(AuthContext);
    const [vista, setVista] = useState("pendientes");
    const navigate = useNavigate();

    // Redirige al login si no hay usuario
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

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
                .app-card {
                    background: #fff;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    padding: 1.5rem;
                }
                .btn-pill {
                    border-radius: 50px !important;
                    transition: all .3s ease;
                }

                .btn-primary-custom {
                    background-color: var(--clr-primary) !important;
                    border-color: var(--clr-primary) !important;
                    color: white;
                }
                .btn-outline-primary-custom {
                    color: var(--clr-primary) !important;
                    border-color: var(--clr-primary) !important;
                }
                .btn-primary-custom:hover {
                    background-color: var(--clr-secondary) !important;
                    border-color: var(--clr-secondary) !important;
                }
                .btn-outline-primary-custom:hover {
                    background-color: var(--clr-primary) !important;
                    color: white !important;
                }

                .btn-secondary-custom {
                    background-color: var(--clr-secondary) !important;
                    border-color: var(--clr-secondary) !important;
                    color: white;
                }
                .btn-outline-secondary-custom {
                    color: var(--clr-secondary) !important;
                    border-color: var(--clr-secondary) !important;
                }
                .btn-secondary-custom:hover {
                    background-color: #014c4c !important; 
                    border-color: #014c4c !important;
                }
                .btn-outline-secondary-custom:hover {
                    background-color: var(--clr-secondary) !important;
                    color: white !important;
                }
            `}</style>
            

            <div className="container app-card">

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
                    <h2 className="mb-2 mb-md-0 fw-bold" style={{ color: "var(--clr-secondary)" }}>
                        Bienvenido, Dr. {user?.nombre}
                    </h2>
                    <button 
                        className="btn btn-pill btn-outline-danger" 
                        onClick={handleLogout}
                    >
                        Cerrar Sesión
                    </button>
                </div>

                <div className="mb-4 d-flex flex-wrap gap-3">
                    <button
                        className={`btn btn-pill px-4 ${
                            vista === "pendientes" ? "btn-primary-custom" : "btn-outline-primary-custom"
                        }`}
                        onClick={() => setVista("pendientes")}
                    >
                        Citas Pendientes
                    </button>
                    <button
                        className={`btn btn-pill px-4 ${
                            vista === "historial" ? "btn-secondary-custom" : "btn-outline-secondary-custom"
                        }`}
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
                </div>
            </div>
        </div>
    );
};

export default MedicoPanel;