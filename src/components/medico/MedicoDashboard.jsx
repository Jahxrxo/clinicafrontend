import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import CitasPendientes from "./MedicoUpcomingAppointments";
import HistorialCitas from "./MedicoHistoryAppointments";

const MedicoDashboard = () => {
  const { user } = useContext(AuthContext);
  const [vista, setVista] = useState("");

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Bienvenido, Dr. {user.nombre}</h2>

      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={() => setVista("pendientes")}>
          Ver Citas Pendientes
        </button>
        <button className="btn btn-secondary" onClick={() => setVista("historial")}>
          Historial de Citas
        </button>
      </div>

      {vista === "pendientes" && <CitasPendientes medicoId={user.id} />}
      {vista === "historial" && <HistorialCitas medicoId={user.id} />}
    </div>
  );
};

export default MedicoDashboard;
