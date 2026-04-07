import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../services/api";

const normalizeList = (data) => {
  if (Array.isArray(data)) return data;
  if (!data || typeof data !== "object") return [];

  const firstArray = Object.values(data).find((value) => Array.isArray(value));
  return Array.isArray(firstArray) ? firstArray : [];
};

const getDoctorInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "DR";

const resolveDoctorName = (doctor) =>
  doctor.nombre || doctor.name || doctor.nombre_completo || "Médico sin nombre";

const resolveDoctorSpecialty = (doctor) =>
  doctor.especialidad ||
  doctor.specialty ||
  doctor.especializacion ||
  "";

const resolveDoctorPhone = (doctor) => doctor.telefono || doctor.phone || "";
const resolveDoctorEmail = (doctor) => doctor.email || "";

export default function AvailableDoctors() {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");
        const medicosRes = await axios.get(`${backendUrl}/medicos`);
        const medicosData = normalizeList(medicosRes.data);

        setMedicos(medicosData);
      } catch (err) {
        console.error("Error al cargar médicos:", err);
        setError("No se pudo cargar la lista de médicos disponibles.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "56px 24px", color: "#5b777a" }}>
        Cargando médicos disponibles...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          background: "#fff4f4",
          border: "1px solid #ffd6d6",
          color: "#c94c4c",
          borderRadius: 14,
          padding: 18,
        }}
      >
        {error}
      </div>
    );
  }

  if (medicos.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          boxShadow: "0 6px 18px rgba(0,0,0,.06)",
          textAlign: "center",
          color: "#5b777a",
        }}
      >
        No hay médicos disponibles por el momento.
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(135deg,#ffffff,#eef9f9)",
          border: "1px solid #dff1f1",
          borderRadius: 16,
          padding: "22px 24px",
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 700, color: "#0aa4a4", marginBottom: 6 }}>
          DIRECTORIO MEDICO
        </div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#022c30", marginBottom: 6 }}>
          Médicos disponibles
        </div>
        <div style={{ fontSize: 13, color: "#5b777a" }}>
          Consulta quiénes atienden actualmente antes de agendar tu próxima cita.
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        {medicos.map((doctor) => {
          const doctorName = resolveDoctorName(doctor);
          const doctorSpecialty = resolveDoctorSpecialty(doctor);
          const doctorPhone = resolveDoctorPhone(doctor);
          const doctorEmail = resolveDoctorEmail(doctor);

          return (
            <div
              key={doctor.id || doctorName}
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: 20,
                boxShadow: "0 8px 24px rgba(0,0,0,.07)",
                border: "1px solid #e7f3f3",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: "linear-gradient(135deg,#0aa4a4,#036b6b)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {getDoctorInitials(doctorName)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#022c30" }}>{doctorName}</div>
                  <div style={{ fontSize: 12, color: "#0aa4a4", fontWeight: 700 }}>{doctorSpecialty}</div>
                </div>
              </div>

              <div style={{ display: "grid", gap: 10 }}>
                {doctorPhone && (
                  <div style={{ background: "#f6fbfb", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#7a9496", marginBottom: 2 }}>Teléfono</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#022c30" }}>{doctorPhone}</div>
                  </div>
                )}

                {doctorEmail && (
                  <div style={{ background: "#f6fbfb", borderRadius: 12, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, color: "#7a9496", marginBottom: 2 }}>Correo</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#022c30", wordBreak: "break-word" }}>
                      {doctorEmail}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
