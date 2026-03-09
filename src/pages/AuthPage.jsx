
import React, { useState, useRef, useEffect } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const AuthPage = () => {
    const [activeTab, setActiveTab] = useState("login");
    const formContainerRef = useRef(null);

    useEffect(() => {
        if (!formContainerRef.current) return;

        const currentHeight = formContainerRef.current.scrollHeight;
        formContainerRef.current.style.height = `${currentHeight}px`;
    }, [activeTab]);

    return (
        <div 
            className="auth-page"
            style={{ 
                background: "linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-secondary) 100%)",
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px 10px",
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
                    --shadow: 0 8px 20px rgba(0,0,0,.15);
                }
                
                html, body {
                    overflow-x: hidden; 
                    /* Opcional: Esto evita que el padding de 20px 10px en auth-page genere un scrollbar al sumar el ancho */
                    width: 100%; 
                }

                .auth-page {
                            }

                .auth-container {
                    max-width: 450px;
                    width: 100%;
                }
                
                .auth-buttons-wrapper {
                    display: flex;
                    justify-content: center;
                    margin-bottom: -30px; 
                    position: relative;
                    z-index: 10;
                }
                .auth-buttons {
                    display: inline-flex;
                    gap: 10px;
                    background: #fff;
                    padding: 8px; 
                    border-radius: 50px; 
                    box-shadow: 0 2px 4px rgba(0,0,0,.05);
                }
                .btn-pill {
                    border-radius: 50px !important;
                    transition: all .3s ease;
                    font-weight: 600;
                    padding: .6rem 1.5rem;
                }
                .auth-form-card {
                    background: #fff;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    padding: 40px 30px 30px 30px; 
                    position: relative;
                    padding-top: 60px; 
                }
                .auth-form-container {
                    transition: height 0.4s ease-in-out;
                    overflow-y: hidden; 
                    padding: 0; 
                }
                .login-form-hack .btn-primary {
                    background-color: var(--clr-primary) !important;
                    border-color: var(--clr-primary) !important;
                    transition: background-color 0.3s;
                }
                .login-form-hack .btn-primary:hover {
                    background-color: var(--clr-secondary) !important;
                    border-color: var(--clr-secondary) !important;
                }

                .register-form-hack .btn-success {
                    background-color: var(--clr-accent) !important;
                    border-color: var(--clr-accent) !important;
                    color: var(--clr-dark); 
                    transition: background-color 0.3s;
                }
                .register-form-hack .btn-success:hover {
                    background-color: #e69d00 !important; 
                    border-color: #e69d00 !important;
                    color: var(--clr-dark);
                }
                .btn-primary-custom { background-color: var(--clr-primary) !important; border-color: var(--clr-primary) !important; color: white; }
                .btn-outline-primary-custom { color: var(--clr-primary) !important; border-color: var(--clr-primary) !important; background: #fff; }
                .btn-primary-custom:hover { background-color: var(--clr-secondary) !important; border-color: var(--clr-secondary) !important; }
                .btn-outline-primary-custom:hover { background-color: var(--clr-primary) !important; color: white !important; }

                .btn-accent-custom { background-color: var(--clr-accent) !important; border-color: var(--clr-accent) !important; color: var(--clr-dark); }
                .btn-outline-accent-custom { color: var(--clr-accent) !important; border-color: var(--clr-accent) !important; background: #fff; }
                .btn-accent-custom:hover { background-color: #e69d00 !important; border-color: #e69d00 !important; }
                .btn-outline-accent-custom:hover { background-color: var(--clr-accent) !important; color: var(--clr-dark) !important; }
            `}</style>
            
            <div className="auth-container">
                <div className="auth-buttons-wrapper">
                    <div className="auth-buttons">
                        <button
                            className={`btn btn-pill ${activeTab === "login" ? "btn-primary-custom" : "btn-outline-primary-custom"}`}
                            onClick={() => setActiveTab("login")}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            className={`btn btn-pill ${activeTab === "register" ? "btn-accent-custom" : "btn-outline-accent-custom"}`}
                            onClick={() => setActiveTab("register")}
                        >
                            Registrarse
                        </button>
                    </div>
                </div>

                <div 
                    className={`auth-form-card ${activeTab === "login" ? "login-form-hack" : "register-form-hack"}`}
                >
                    <div className="auth-form-container" ref={formContainerRef}>
                        {activeTab === "login" && <Login />} 
                        {activeTab === "register" && <Register />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;