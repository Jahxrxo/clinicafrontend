import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const PatientDashboard = () => {
  const { user } = useContext(AuthContext); 

  return (
    <div className="container mt-5">
      <h2>¡Bienvenido al Sistema, {user?.nombre}!</h2>
      <p>Selecciona una opción para continuar:</p>

      <div className="d-flex flex-column mt-4">
        <Link to="/patient/schedule" className="btn btn-primary mb-2">
          Agendar Cita
        </Link>
        <Link to="/patient/upcoming" className="btn btn-secondary">
          Ver Historial de Citas
        </Link>
      </div>
    </div>
  );
};

export default PatientDashboard;
