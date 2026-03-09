import React, { useState, useEffect } from "react";
import { Card, Modal, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { Users, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { backendUrl } from "../../services/api";


const AdminCardList = ({ title, icon, endpoint, colorClass }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);



    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch(`${backendUrl}${endpoint}`);
                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.detail || data.error || "Error al obtener datos");
                }
                const data = await response.json();
                
                setItems(Array.isArray(data) ? data : data[Object.keys(data)[0]] || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, [endpoint]);

    const handleShowModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" variant={colorClass === "text-success" ? "success" : "info"} />
                <p className="mt-2">Cargando {title.toLowerCase()}...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-4 text-center">
                <strong>Error:</strong> {error}
            </Alert>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h4 className={`${colorClass} fw-bold mb-4 d-flex align-items-center gap-2`}>
                {icon} {title}
            </h4>

            {items.length === 0 ? (
                <p className="text-muted text-center">No hay {title.toLowerCase()} registrados.</p>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {items.map((item, index) => (
                        <Col key={index}>
                            <Card
                                className="shadow-sm border-0 rounded-4 h-100"
                                onClick={() => handleShowModal(item)}
                                style={{ cursor: "pointer" }}
                            >
                                <Card.Body>
                                    <Card.Title>{item.nombre}</Card.Title>
                                    <Card.Text className="mb-1 text-muted d-flex align-items-center">
                                        <Mail size={16} className="me-2" /> {item.email || item.correo}
                                    </Card.Text>
                                    <Card.Text className="text-muted d-flex align-items-center">
                                        <Phone size={16} className="me-2" /> {item.telefono}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {selectedItem && (
                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalles de {title.slice(0, -1)}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center mb-3">
                            {selectedItem.foto_url ? (
                                <img
                                    src={selectedItem.foto_url}
                                    alt={selectedItem.nombre}
                                    className="rounded-circle shadow"
                                    width="180"
                                    height="180"
                                />
                            ) : (
                                <div
                                    className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center shadow"
                                    style={{ width: 180, height: 180 }}
                                >
                                    <Users size={70} className="text-secondary" />
                                </div>
                            )}
                        </div>
                        <h5 className="text-center mb-3">{selectedItem.nombre}</h5>
                        <p><strong>Email:</strong> {selectedItem.email || selectedItem.correo}</p>
                        <p><strong>Teléfono:</strong> {selectedItem.telefono}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cerrar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </motion.div>
    );
};

export default AdminCardList;
