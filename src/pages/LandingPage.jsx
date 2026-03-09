import React, { useEffect } from "react";
import {
    Stethoscope, LogIn, MapPin, Menu,
    CalendarPlus, History, Syringe, HeartPulse
} from 'lucide-react';
import { backendUrl } from "../services/api";

const LandingPage = () => {

    useEffect(() => {
        const revealElements = document.querySelectorAll(".reveal, .map-wrapper");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) entry.target.classList.add("visible", "show");
                });
            },
            { threshold: 0.1 }
        );
        revealElements.forEach((el) => observer.observe(el));
    }, []);

    const toggleMenu = () => {
        document.getElementById("navbarLinks").classList.toggle("show");
    };

    const services = [
        {
            iconComponent: CalendarPlus,
            title: "Agendar Citas",
            text: "Contamos con un sistema el cual el paciente pueda agendar una cita con el medico que solicite, sucursal, fecha y hora que desee",
        },
        {
            iconComponent: History,
            title: "Ver historial de citas",
            text: "Tu como paciente puedes ver todo tu historial de citas, tanto como pasadas como futuras",
        },
        {
            iconComponent: Syringe,
            title: "Medicos",
            text: "El sistema tambien cuenta con una vista para los medicos, para que puedan ver que citas tienen pendientes y un historial",
        },
        {
            iconComponent: HeartPulse,
            title: "Administrador",
            text: "El Administrador puede reagendar tu cita si lo solicitas, puede ver todos los medicos activos y todos los pacientes registrados",
        },
    ];

    return (
        <>
            <style>{`
        :root {
            --clr-primary: #0aa4a4;
            --clr-secondary: #036b6b;
            --clr-light: #f8fefe;
            --clr-dark: #022c30;
            --clr-accent: #ffae00;
            --radius: .75rem;
            --shadow: 0 6px 16px rgba(0,0,0,.08);
            --transition: .3s ease;
        }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; background: var(--clr-light); color: var(--clr-dark); }

        header.navbar {
        position: sticky; top: 0; z-index: 999;
        display: flex; align-items: center; justify-content: space-between;
        padding: .9rem 1.5rem; background: var(--clr-primary); box-shadow: var(--shadow);
        }
        .navbar__brand { display: flex; align-items: center; gap: .55rem; color: #fff; font-size: 1.3rem; font-weight: 600; }
        .navbar__links { display: flex; gap: 1.1rem; align-items: center; }
        .navbar__links a {
        display: flex; gap: .35rem; align-items: center; color: #fff; text-decoration: none;
        font-weight: 500; padding: .45rem .7rem; border-radius: var(--radius); transition: var(--transition);
        }
        .navbar__links a:hover { background: rgba(255,255,255,.12); }
        .navbar__toggle { display: none; background: transparent; border: none; color: #fff; font-size: 1.5rem; }
        .hero {
        display: grid; place-items: center; text-align: center; padding: 4rem 1rem;
        min-height: 65vh; background: linear-gradient(135deg, var(--clr-primary), var(--clr-secondary));
        color: #fff; position: relative; overflow: hidden;
        }
        .hero h1 { font-size: clamp(2.2rem, 6vw, 3.5rem); font-weight: 700; }
        .hero .accent { color: var(--clr-accent); }
        .hero p { max-width: 650px; margin-inline: auto; }
        .btn-cta {
        display: inline-block; margin-top: 1.5rem; padding: .8rem 1.6rem;
        background: #fff; color: var(--clr-primary); border-radius: 50px;
        text-decoration: none; box-shadow: var(--shadow);
        }
        .btn-cta:hover { transform: translateY(-3px); box-shadow: 0 10px 18px rgba(0,0,0,.12); }

        .grid { max-width: 1200px; margin: 3rem auto; padding: 0 1rem; }
        .grid h2 { text-align: center; margin-bottom: 2rem; color: var(--clr-secondary); }
        .grid .card {
        background: #fff; border-radius: var(--radius); box-shadow: var(--shadow);
        padding: 2rem 1.5rem; text-align: center; transition: var(--transition);
        }
        .grid .card svg { font-size: 2rem; color: var(--clr-primary); margin-bottom: .9rem; width: 2rem; height: 2rem; margin-inline: auto; }
        .grid .card:hover { transform: translateY(-6px); }

        .reveal { opacity: 0; transform: translateY(20px); transition: opacity .6s, transform .6s; }
        .reveal.show { opacity: 1; transform: none; }

        .about, .location { background: var(--clr-light); padding: 3rem 1rem; text-align: center; }
        .about h2, .location h2 { color: var(--clr-secondary); margin-bottom: 1rem; }
        .map-wrapper { max-width: 850px; margin: 2rem auto 0; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); opacity: 0; transform: translateY(20px); transition: .6s; }
        .map-wrapper.show { opacity: 1; transform: none; }
        .map-wrapper iframe { width: 100%; height: 450px; border: 0; }

        .footer { background: var(--clr-secondary); color: #fff; text-align: center; padding: 1rem; }


        @media (max-width: 768px) {
        .navbar__links {
            position: fixed; top: 63px; right: -100%; flex-direction: column;
            background: var(--clr-primary); width: 230px; height: calc(100vh - 63px);
            padding-top: 2rem; transition: right .4s;
        }
        .navbar__links.show { right: 0; }
        .navbar__toggle { display: block; }
        }
    `}</style>
            <header className="navbar">
                <div className="navbar__brand">
                    <Stethoscope size={20} />
                    <span>Buena&nbsp;Salud</span>
                </div>

                <nav className="navbar__links" id="navbarLinks">
                    <a href="/auth">
                        <LogIn size={18} />
                        <span>Iniciar Sesion</span>
                    </a>
                    <a href="#location">
                        <MapPin size={18} />
                        <span>Encuentranos</span>
                    </a>
                </nav>

                <button className="navbar__toggle" onClick={toggleMenu} aria-label="Abrir menú">
                <Menu size={24} />
                </button>
            </header>

            {/* Hero */}
            <section className="hero" id="hero">
                <div className="container">
                    <h1>
                        Farmacia&nbsp;<span className="accent">Buena Salud</span>
                    </h1>
                    <p>
                        Más de 20 años cuidando de ti y tu familia ― siempre cerca, siempre confiables.
                    </p>
                    <a href="#servicios" className="btn-cta">
                        Conoce nuestros servicios
                    </a>
                </div>
            </section>
            <section className="grid" id="servicios">
                <h2>Nuestros Servicios</h2>
                
                <div className="row g-4">
                    {services.map((s, i) => (
                        <div key={i} className="col-md-4 col-lg-3 reveal">
                            <div className="card h-100">
                                {React.createElement(s.iconComponent, { size: 32, className: "text-clr-primary" })}
                                <h3>{s.title}</h3>
                                <p>{s.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="location" id="location">
                <h2>Encuéntranos</h2>
                <p>Estamos donde nacen los grandes ingenieros en Sistemas del pais, donde se forja el caracter, la facultad de ingenieria en el B2</p>
                <div className="map-wrapper">
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2977.961953729865!2d-87.1646150263271!3d14.086679789455093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f6fa34a7bd7df3f%3A0x8e68174348ad328e!2sEdificio%20B2%20Facultad%20De%20Ingenier%C3%ADa!5e1!3m2!1ses-419!2shn!4v1761869313039!5m2!1ses-419!2shn"
                        width="600"
                        height="450"
                        referrerPolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2025 Farmacia Buena Salud · Todos los derechos reservados</p>
            </footer>
        </>
    );
};

export default LandingPage;
