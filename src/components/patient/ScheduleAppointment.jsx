import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const ScheduleAppointment = () => {
  const { user } = useContext(AuthContext);
  const [medicos, setMedicos] = useState([]);
  const [medico, setMedico] = useState("");
  const [sucursales, setSucursales] = useState([]);
  const [sucursal, setSucursal] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [message, setMessage] = useState("");

  const backendUrl = "http://localhost:8000";

  // Cargar médicos
  useEffect(() => {
    axios.get(`${backendUrl}/medicos`)
      .then(res => setMedicos(res.data))
      .catch(err => console.error("Error al cargar médicos:", err));
  }, []);

  // Al cambiar médico, cargar disponibilidad y sucursales
  useEffect(() => {
    if (!medico) {
      setDisponibilidad([]);
      setSucursales([]);
      setSucursal("");
      setFecha("");
      setHora("");
      return;
    }

    axios.get(`${backendUrl}/medicos/${medico}/disponibilidad`)
      .then(res => {
        setDisponibilidad(res.data);

        const sucursalesUnicas = res.data
          .map(d => ({ id: d.sucursal_id, sucursal_nombre: d.sucursal_nombre }))
          .filter((value, index, self) =>
            index === self.findIndex(v => v.id === value.id)
          );

        setSucursales(sucursalesUnicas);

        if (!sucursalesUnicas.some(s => s.id === sucursal)) {
          setSucursal("");
        }

        setFecha("");
        setHora("");
      })
      .catch(err => console.error("Error al cargar disponibilidad:", err));
  }, [medico]);

  // Filtrar horas disponibles según fecha y sucursal
  const horasDisponibles = fecha && sucursal
    ? disponibilidad
        .filter(d => d.fecha === fecha && d.sucursal_id === sucursal)
        .flatMap(d => d.horas_disponibles)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!medico || !sucursal || !fecha || !hora) {
      setMessage("Debes completar todos los campos");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("paciente_id", user.id);
      formData.append("medico_id", medico);
      formData.append("sucursal_id", sucursal);
      formData.append("fecha", fecha);
      formData.append("hora", hora);
      formData.append("estado", "pendiente");

      const res = await axios.post(`${backendUrl}/citas`, formData);
      setMessage("Cita agendada correctamente!");
      setMedico("");
      setSucursal("");
      setFecha("");
      setHora("");
      setDisponibilidad([]);
      setSucursales([]);
    } catch (err) {
      const errorMsg = err.response?.data?.error;
      if (errorMsg?.includes("no está disponible")) {
        setMessage("El médico ya tiene una cita pendiente en esa fecha, hora y sucursal seleccionadas");
      } else {
        setMessage(errorMsg || "Error al agendar cita");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Agendar Cita</h2>
      <form onSubmit={handleSubmit}>
        {/* Médico */}
        <div className="mb-3">
          <label>Médico</label>
          <select
            className="form-control"
            value={medico}
            onChange={(e) => setMedico(e.target.value)}
            required
          >
            <option value="">Selecciona un médico</option>
            {medicos.map(m => (
              <option key={m.id} value={m.id}>{m.nombre}</option>
            ))}
          </select>
        </div>

        {/* Sucursal */}
        <div className="mb-3">
          <label>Sucursal</label>
          <select
            className="form-control"
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
            required
          >
            <option value="">Selecciona una sucursal</option>
            {sucursales.map(s => (
              <option key={s.id} value={s.id}>{s.sucursal_nombre}</option>
            ))}
          </select>
        </div>

        {/* Fecha */}
        <div className="mb-3">
          <label>Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label>Hora</label>
          <select
            className="form-control"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
          >
            <option value="">Selecciona una hora</option>
            {horasDisponibles.length > 0
              ? horasDisponibles.map((h, i) => <option key={i} value={h}>{h}</option>)
              : <option disabled>No hay horas disponibles en esta fecha y sucursal</option>
            }
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Agendar</button>
      </form>

      {message && <p className="mt-3 text-danger">{message}</p>}
    </div>
  );
};

export default ScheduleAppointment;
