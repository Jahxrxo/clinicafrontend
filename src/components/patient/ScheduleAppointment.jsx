import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
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
  const [excepciones, setExcepciones] = useState([]);
  const [message, setMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  const backendUrl = "http://localhost:8000";

  const formatFecha = (fechaIso) => {
    const [y, m, d] = fechaIso.split("-");
    return `${d}/${m}/${y}`;
  };

  const parseFecha = (fechaIso) => {
    if (!fechaIso) return null;
    const [y, m, d] = fechaIso.split("-").map(Number);
    return new Date(y, m - 1, d, 12, 0, 0);
  };

  const toFechaIso = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const getFechaRegreso = (fechaFinIso) => {
    const [y, m, d] = fechaFinIso.split("-").map(Number);
    const regreso = new Date(y, m - 1, d + 1, 12, 0, 0);
    return formatFecha(
      `${regreso.getFullYear()}-${String(regreso.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(regreso.getDate()).padStart(2, "0")}`
    );
  };

  const getExcepcionParaFecha = (fechaIso) => {
    if (!fechaIso) return null;
    const objetivo = new Date(`${fechaIso}T12:00:00`);
    return (
      excepciones.find((exc) => {
        if (!exc?.fecha_inicio || !exc?.fecha_fin) return false;
        const inicio = new Date(`${exc.fecha_inicio}T12:00:00`);
        const fin = new Date(`${exc.fecha_fin}T12:00:00`);
        return objetivo >= inicio && objetivo <= fin;
      }) || null
    );
  };

  const buildNoDisponibleMsg = (exc) => {
    const rango =
      exc.fecha_inicio === exc.fecha_fin
        ? `el ${formatFecha(exc.fecha_inicio)}`
        : `del ${formatFecha(exc.fecha_inicio)} al ${formatFecha(
            exc.fecha_fin
          )}`;
    const motivo = exc.motivo ? ` Motivo: ${exc.motivo}.` : "";
    return `El médico no está disponible ${rango}.${motivo} Regresa a partir del ${getFechaRegreso(
      exc.fecha_fin
    )}.`;
  };

  const fechasDisponibles = sucursal
    ? [
        ...new Set(
          disponibilidad
            .filter((d) => String(d.sucursal_id) === String(sucursal))
            .map((d) => d.fecha)
            .filter((fechaDisponible) => !getExcepcionParaFecha(fechaDisponible))
        ),
      ].sort()
    : [];

  const fechasDisponiblesDate = fechasDisponibles.map(parseFecha).filter(Boolean);

  // Cargar médicos
  useEffect(() => {
    axios.get(`${backendUrl}/medicos`)
      .then(res => setMedicos(res.data))
      .catch(err => console.error("Error al cargar médicos:", err));
  }, []);

  // Al cambiar médico, cargar disponibilidad, sucursales y excepciones
  useEffect(() => {
    if (!medico) {
      setDisponibilidad([]);
      setSucursales([]);
      setExcepciones([]);
      setSucursal("");
      setFecha("");
      setHora("");
      setWarningMessage("");
      return;
    }

    // Cargar disponibilidad
    axios.get(`${backendUrl}/medicos/${medico}/disponibilidad`)
      .then(res => {
        setDisponibilidad(res.data);

        const sucursalesUnicas = res.data
          .map(d => ({ id: d.sucursal_id, sucursal_nombre: d.sucursal_nombre }))
          .filter((value, index, self) =>
            index === self.findIndex(v => v.id === value.id)
          );

        setSucursales(sucursalesUnicas);
      })
      .catch(err => console.error("Error al cargar disponibilidad:", err));

    // Cargar excepciones del médico
    axios.get(`${backendUrl}/medicos/${medico}/excepciones`)
      .then(res => {
        setExcepciones(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error("Error al cargar excepciones:", err);
        setExcepciones([]);
      });
  }, [medico]);

  // Verificar excepción cuando cambia la fecha
  useEffect(() => {
    if (fecha && medico) {
      const excepcion = getExcepcionParaFecha(fecha);
      
      if (excepcion) {
        setWarningMessage(buildNoDisponibleMsg(excepcion));
        setHora("");
      } else {
        setWarningMessage("");
      }
    } else {
      setWarningMessage("");
    }
  }, [fecha, medico, excepciones]);

  useEffect(() => {
    if (!sucursal) {
      setFecha("");
      setHora("");
      return;
    }

    if (fecha && !fechasDisponibles.includes(fecha)) {
      setFecha("");
      setHora("");
      setMessage("No hay disponibilidad para la fecha seleccionada en esa sucursal.");
    }
  }, [sucursal, fecha, fechasDisponibles]);

  // Filtrar horas disponibles según fecha y sucursal
  const horasDisponibles = fecha && sucursal && !getExcepcionParaFecha(fecha)
    ? disponibilidad
        .filter(d => d.fecha === fecha && String(d.sucursal_id) === String(sucursal))
        .flatMap(d => d.horas_disponibles)
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!medico || !sucursal || !fecha || !hora) {
      setMessage("Debes completar todos los campos");
      return;
    }

    // Validar que la fecha no sea una excepción
    const excepcion = getExcepcionParaFecha(fecha);
    if (excepcion) {
      setMessage("No puedes agendar una cita en una fecha donde el médico no está disponible");
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
      setExcepciones([]);
      setWarningMessage("");
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
            onChange={(e) => {
              setSucursal(e.target.value);
              setMessage("");
            }}
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
          <DatePicker
            selected={parseFecha(fecha)}
            onChange={(date) => {
              const fechaSeleccionada = toFechaIso(date);

              if (fechaSeleccionada && !fechasDisponibles.includes(fechaSeleccionada)) {
                setFecha("");
                setHora("");
                setMessage("No hay disponibilidad para la fecha seleccionada en esa sucursal.");
                return;
              }

              setFecha(fechaSeleccionada);
              setHora("");
              setMessage("");
            }}
            includeDates={fechasDisponiblesDate}
            dateFormat="dd/MM/yyyy"
            placeholderText={
              !sucursal
                ? "Selecciona una sucursal primero"
                : fechasDisponibles.length === 0
                ? "No hay fechas disponibles para esta sucursal"
                : "Selecciona una fecha"
            }
            disabled={!sucursal || fechasDisponibles.length === 0}
            className="form-control"
            minDate={new Date()}
            autoComplete="off"
          />
          {sucursal && fechasDisponibles.length === 0 && (
            <div className="alert alert-warning mt-2" role="alert">
              No hay disponibilidad de fechas para la sucursal seleccionada.
            </div>
          )}
          {warningMessage && (
            <div className="alert alert-warning mt-2" role="alert">
              ⚠️ {warningMessage}
            </div>
          )}
        </div>

        {/* Hora */}
        <div className="mb-3">
          <label>Hora</label>
          <select
            className="form-control"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
            disabled={!!warningMessage}
          >
            <option value="">Selecciona una hora</option>
            {horasDisponibles.length > 0
              ? horasDisponibles.map((h, i) => <option key={i} value={h}>{h}</option>)
              : <option disabled>No hay horas disponibles en esta fecha y sucursal</option>
            }
          </select>
        </div>

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={!!warningMessage}
        >
          Agendar
        </button>
      </form>

      {message && <p className="mt-3 text-danger">{message}</p>}
    </div>
  );
};

export default ScheduleAppointment;
