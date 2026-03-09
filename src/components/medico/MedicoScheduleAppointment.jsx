import React, { useState, useEffect } from "react";

const MedicoScheduleAppointment = ({ medicoId }) => {

    const [citas, setCitas] = useState([]);
    const [citaSeleccionada, setCitaSeleccionada] = useState("");
    const [fecha, setFecha] = useState("");
    const [hora, setHora] = useState("");

    useEffect(() => {

        fetch(`http://localhost:8000/citas/medico/${medicoId}`)
            .then(res => res.json())
            .then(data => setCitas(data))
            .catch(error => console.error("Error cargando citas:", error));

    }, [medicoId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const citaActualizada = {
            cita_id: citaSeleccionada,
            nueva_fecha: fecha,
            nueva_hora: hora
        };

        console.log("Cita reagendada:", citaActualizada);

        alert("Cita reagendada correctamente");
    };

    return (

        <div className="card mt-4 p-4 shadow">

            <h4 className="mb-3">Reagendar Cita</h4>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">Seleccionar Cita</label>

                    <select
                        className="form-control"
                        value={citaSeleccionada}
                        onChange={(e) => setCitaSeleccionada(e.target.value)}
                        required
                    >

                        <option value="">Seleccione una cita</option>

                        {citas.map((cita) => (

                            <option key={cita.id} value={cita.id}>
                                {cita.paciente} - {cita.fecha} - {cita.hora}
                            </option>

                        ))}

                    </select>

                </div>

                <div className="mb-3">

                    <label className="form-label">Nueva Fecha</label>

                    <input
                        type="date"
                        className="form-control"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />

                </div>

                <div className="mb-3">

                    <label className="form-label">Nueva Hora</label>

                    <input
                        type="time"
                        className="form-control"
                        value={hora}
                        onChange={(e) => setHora(e.target.value)}
                        required
                    />

                </div>

                <button className="btn btn-success">
                    Guardar Cambios
                </button>

            </form>

        </div>

    );
};

export default MedicoScheduleAppointment;