import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import MedicoUpcomingAppointments from "../components/medico/MedicoUpcomingAppointments";
import MedicoHistoryAppointments from "../components/medico/MedicoHistoryAppointments";
import MedicoExcepciones from "../components/medico/MedicoExcepciones";
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

    const navItems = [
        { key: "pendientes", label: "Citas Pendientes",  colorVar: "primary"   },
        { key: "historial",  label: "Historial de Citas", colorVar: "secondary" },
        { key: "excepciones",label: "Excepciones",        colorVar: "accent"    },
    ];

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
                .btn-pill { border-radius: 50px !important; transition: all .3s ease; }

                /* Primary */
                .btn-primary-custom   { background-color: var(--clr-primary) !important; border-color: var(--clr-primary) !important; color: #fff; }
                .btn-primary-custom:hover { background-color: var(--clr-secondary) !important; border-color: var(--clr-secondary) !important; }
                .btn-outline-primary-custom { color: var(--clr-primary) !important; border-color: var(--clr-primary) !important; background: transparent; }
                .btn-outline-primary-custom:hover { background-color: var(--clr-primary) !important; color: #fff !important; }

                /* Secondary */
                .btn-secondary-custom { background-color: var(--clr-secondary) !important; border-color: var(--clr-secondary) !important; color: #fff; }
                .btn-secondary-custom:hover { background-color: #014c4c !important; border-color: #014c4c !important; }
                .btn-outline-secondary-custom { color: var(--clr-secondary) !important; border-color: var(--clr-secondary) !important; background: transparent; }
                .btn-outline-secondary-custom:hover { background-color: var(--clr-secondary) !important; color: #fff !important; }

                /* Accent (excepciones) */
                .btn-accent-custom { background-color: var(--clr-accent) !important; border-color: var(--clr-accent) !important; color: var(--clr-dark); font-weight: 600; }
                .btn-accent-custom:hover { background-color: #e69d00 !important; border-color: #e69d00 !important; }
                .btn-outline-accent-custom { color: var(--clr-accent) !important; border-color: var(--clr-accent) !important; background: transparent; font-weight: 600; }
                .btn-outline-accent-custom:hover { background-color: var(--clr-accent) !important; color: var(--clr-dark) !important; }
            `}</style>

            {/* ── Barra superior ─────────────────────────────────────── */}
            <div className="container app-card mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                    {/* Saludo */}
                    <h2 className="mb-0 fw-bold" style={{ color: "var(--clr-secondary)" }}>
                        Bienvenido, Dr. {user?.nombre}
                    </h2>

                    {/* Navegación + logout */}
                    <div className="d-flex flex-wrap gap-2 align-items-center justify-content-center">
                        {navItems.map(({ key, label, colorVar }) => {
                            const active = vista === key;
                            return (
                                <button
                                    key={key}
                                    className={`btn btn-pill px-4 btn-${active ? "" : "outline-"}${colorVar}-custom`}
                                    onClick={() => setVista(key)}
                                >
                                    {label}
                                </button>
                            );
                        })}

                        <button
                            className="btn btn-pill btn-outline-danger px-4"
                            onClick={handleLogout}
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Contenido ──────────────────────────────────────────── */}
            <div className="container app-card">
                {vista === "pendientes" && user && (
                    <MedicoUpcomingAppointments medicoId={user.id} />
                )}
                {vista === "historial" && user && (
                    <MedicoHistoryAppointments medicoId={user.id} />
                )}
                {vista === "excepciones" && user && (
                    <MedicoExcepciones medicoId={user.id} />
                )}
            </div>
        </div>
    );
};

export default MedicoPanel;