import { useState } from "react";
import { Stethoscope, Plus, X } from "lucide-react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { backendUrl } from "../../services/api";
import AdminCardList from "./AdminCardList";

const AdminMedicos = ({ showAddButton = true }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [refresh, setRefresh] = useState(0);

    const [formData, setFormData] = useState({
        nombre: "",
        email: "",
        password: "",
        telefono: "",
        sucursal_id: "",
        foto: null
    });

    const [sucursales, setSucursales] = useState([]);
    const MEDICO_ROLE_ID = "5770e7d5-c449-4094-bbe1-fd52ee6fe75f";

    // Cargar sucursales cuando se abre el modal
    const handleShowModal = async () => {
        setShowModal(true);
        setError("");
        setSuccess("");
        try {
            const res = await axios.get(`${backendUrl}/sucursales`);
            setSucursales(res.data);
            if (res.data.length > 0) {
                setFormData(prev => ({ ...prev, sucursal_id: res.data[0].id }));
            }
        } catch (err) {
            console.error("Error al cargar sucursales:", err);
            setError("No se pudieron cargar las sucursales");
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setFormData({
            nombre: "",
            email: "",
            password: "",
            telefono: "",
            sucursal_id: "",
            foto: null
        });
        setError("");
        setSuccess("");
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "foto") {
            setFormData({ ...formData, foto: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const data = new FormData();
            data.append("nombre", formData.nombre);
            data.append("email", formData.email);
            data.append("password", formData.password);
            data.append("telefono", formData.telefono);
            data.append("rol_id", MEDICO_ROLE_ID);
            data.append("sucursal_id", formData.sucursal_id);
            if (formData.foto) {
                data.append("foto", formData.foto);
            }

            await axios.post(`${backendUrl}/usuarios`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setSuccess("Médico agregado correctamente");
            setTimeout(() => {
                handleCloseModal();
                setRefresh(prev => prev + 1); // Forzar actualización de la lista
            }, 1500);
        } catch (err) {
            console.error("Error al crear médico:", err);
            setError(err.response?.data?.error || "Error al crear el médico");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Botón para agregar médico */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-info fw-bold mb-0 d-flex align-items-center gap-2">
                    <Stethoscope size={22} />
                    Médicos
                </h4>
                {showAddButton && (
                    <Button
                        variant="primary"
                        className="d-flex align-items-center gap-2"
                        onClick={handleShowModal}
                        style={{ borderRadius: '50px', background: '#035556', borderColor: '#035556' }}
                    >
                        <Plus size={18} />
                        Agregar Médico
                    </Button>
                )}
            </div>

            {/* Lista de médicos con key para forzar actualización */}
            <AdminCardList
                key={refresh}
                title=""
                icon={null}
                endpoint="/medicos"
                colorClass="text-info"
            />

            {/* Modal para agregar médico */}
            {showAddButton && (
                <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
                    <Modal.Header closeButton className="border-0 pb-0">
                        <Modal.Title className="d-flex align-items-center gap-2">
                            <Stethoscope size={24} className="text-info" />
                            Agregar Nuevo Médico
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Nombre Completo *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    placeholder="Dr. Juan Pérez"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Correo Electrónico *</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="doctor@clinica.com"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Contraseña *</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                    placeholder="Mínimo 6 caracteres"
                                    style={{ borderRadius: '8px' }}
                                />
                                <Form.Text className="text-muted">
                                    Mínimo 6 caracteres
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Teléfono</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    placeholder="9999-9999"
                                    style={{ borderRadius: '8px' }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Sucursal *</Form.Label>
                                <Form.Select
                                    name="sucursal_id"
                                    value={formData.sucursal_id}
                                    onChange={handleChange}
                                    required
                                    style={{ borderRadius: '8px' }}
                                >
                                    <option value="">Selecciona una sucursal</option>
                                    {sucursales.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            {/*         
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold">Foto de Perfil</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="foto"
                                    onChange={handleChange}
                                    accept="image/*"
                                    style={{ borderRadius: '8px' }}
                                />
                                <Form.Text className="text-muted">
                                    Opcional - Formatos: JPG, PNG, GIF
                                </Form.Text>
                            </Form.Group>*/}

                            <div className="d-flex gap-2 justify-content-end">
                                <Button
                                    variant="secondary"
                                    onClick={handleCloseModal}
                                    disabled={loading}
                                    style={{ borderRadius: '50px', paddingInline: '24px' }}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    style={{ borderRadius: '50px', paddingInline: '24px' }}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" />
                                            Guardando...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={18} className="me-1" />
                                            Agregar Médico
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
};

export default AdminMedicos;
