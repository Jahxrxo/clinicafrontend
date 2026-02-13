import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Users, Stethoscope, LogOut } from "lucide-react";
import AdminCitas from "../components/admin/AdminAppointments";
import AdminPacientes from "../components/admin/AdminPatients";
import AdminMedicos from "../components/admin/AdminMedicos";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const AdminPanel = () => {
    const [vista, setVista] = useState("citas");
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    // Redirige al login si no hay sesión
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const renderVista = () => {
        switch (vista) {
            case "citas":
                return <AdminCitas />;
            case "pacientes":
                return <AdminPacientes />;
            case "medicos":
                return <AdminMedicos />;
            default:
                return <AdminCitas />;
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div
            className="min-vh-100 d-flex flex-column"
            style={{
            
                background: "linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-secondary) 100%)", 
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
                .btn-success-custom {
                    background-color: var(--clr-accent) !important;
                    border-color: var(--clr-accent) !important;
                    color: white;
                }
                .btn-outline-success-custom {
                    color: var(--clr-accent) !important;
                    border-color: var(--clr-accent) !important;
                }
                .btn-success-custom:hover {
                    background-color: #e69d00 !important; 
                    border-color: #e69d00 !important;
                }
                .btn-outline-success-custom:hover {
                    background-color: var(--clr-accent) !important;
                    color: var(--clr-dark) !important;
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
                body {
                    background-color: var(--clr-light); /* Esto es solo para el fondo general del HTML si el panel no ocupa 100vh */
                }
            `}</style>
            <motion.div
                className="container app-card p-4 mt-4" 
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        {user && user.foto_url && (
                            <img
                                src={user.foto_url}
                                alt="Perfil"
                                className="rounded-circle"
                                style={{ width: 50, height: 50, objectFit: "cover", border: '2px solid var(--clr-primary)' }}
                            />
                        )}
                        <h2 style={{ color: "var(--clr-secondary)" }} className="fw-bold mb-0">
                            {user ? `Bienvenido, ${user.nombre}` : "Panel de Administración"}
                        </h2>
                    </div>

                    <div className="d-flex align-items-center gap-3 mt-3 mt-md-0 flex-wrap justify-content-center">
                        <div className="btn-group me-2" role="group">
                            <button
                                className={`btn btn-pill px-4 me-2 d-flex align-items-center gap-2 ${
                                    vista === "citas" ? "btn-primary-custom" : "btn-outline-primary-custom"
                                }`}
                                onClick={() => setVista("citas")}
                            >
                                <CalendarDays size={18} />
                                Citas
                            </button>
                            
                            <button
                                className={`btn btn-pill px-4 me-2 d-flex align-items-center gap-2 ${
                                    vista === "pacientes" ? "btn-success-custom text-white" : "btn-outline-success-custom"
                                }`}
                                onClick={() => setVista("pacientes")}
                            >
                                <Users size={18} />
                                Pacientes
                            </button>
                            <button
                                className={`btn btn-pill px-4 d-flex align-items-center gap-2 ${
                                    vista === "medicos" ? "btn-secondary-custom" : "btn-outline-secondary-custom"
                                }`}
                                onClick={() => setVista("medicos")}
                            >
                                <Stethoscope size={18} />
                                Médicos
                            </button>
                        </div>
                        <Button
                            variant="outline-danger"
                            className="btn-pill d-flex align-items-center gap-2"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Cerrar sesión
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Contenido  */}
            <motion.div
                className="container app-card mt-4 mb-5" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {renderVista()}
            </motion.div>
        </div>
    );
};

export default AdminPanel;