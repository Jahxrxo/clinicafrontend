
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { backendUrl } from "../../services/api";

const Register = ({ hideTitle = false }) => { 
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [emailValid, setEmailValid] = useState(true);
    const [password, setPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rol, setRol] = useState("");
    const [sucursal, setSucursal] = useState("");
    const [telefono, setTelefono] = useState("");
    const [foto, setFoto] = useState(null);
    const [message, setMessage] = useState("");
    const [rolesOptions, setRolesOptions] = useState([]);
    const [sucursalesOptions, setSucursalesOptions] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const res = await axios.get(`${backendUrl}/roles`);
                setRolesOptions(res.data);
                // Intenta seleccionar el primer rol, o el rol de 'paciente' si existe un identificador conocido
                const pacienteRol = res.data.find(r => r.nombre.toLowerCase() === 'paciente') || res.data[0];
                if (pacienteRol) setRol(pacienteRol.id);

            } catch (err) { console.error(err); }
        };
        const fetchSucursales = async () => {
            try {
                const res = await axios.get(`${backendUrl}/sucursales`);
                setSucursalesOptions(res.data);
                if (res.data.length > 0) setSucursal(res.data[0].id);
            } catch (err) { console.error(err); }
        };
        fetchRoles();
        fetchSucursales();
    }, []);

    useEffect(() => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(regex.test(email) || email === "");
    }, [email]);

    useEffect(() => {
        if (password.length === 0) setPasswordStrength("");
        else if (password.length < 6) setPasswordStrength("Muy corta (mínimo 6)");
        else if (password.length < 10) setPasswordStrength("Débil");
        else if (password.length < 14) setPasswordStrength("Media");
        else setPasswordStrength("Fuerte");
    }, [password]);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!emailValid) return setMessage("Correo inválido");
        if (password.length < 6) return setMessage("Contraseña mínima 6 caracteres");
        if (!rol || !sucursal) return setMessage("Selecciona rol y sucursal"); 

        try {
            const formData = new FormData();
            formData.append("nombre", nombre);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("telefono", telefono);
            formData.append("rol_id", rol);
            formData.append("sucursal_id", sucursal);
            if (foto) formData.append("foto", foto);

            const res = await axios.post(`${backendUrl}/usuarios`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(res.data.message || "Usuario registrado exitosamente. Por favor, inicia sesión.");
            // Limpieza de campos
            setNombre(""); setEmail(""); setPassword(""); setTelefono("");
            setRol(rolesOptions.length > 0 ? rolesOptions[0].id : "");
            setSucursal(sucursalesOptions.length > 0 ? sucursalesOptions[0].id : "");
            setFoto(null); setPasswordStrength("");
        } catch (err) {
            setMessage(err.response?.data?.error || err.message);
        }
    };

    return (
        
        <div className="register-form-content"> 
            
            <h2 className="text-center fw-bold mb-4" style={{ color: "var(--clr-secondary)" }}>
                Registrarse
            </h2>
            
            <form onSubmit={handleRegister}>
                {/* Nombre */}
                <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "var(--clr-dark)" }}>Nombre completo</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={nombre} 
                        onChange={(e) => setNombre(e.target.value)} 
                        required 
                        style={{ borderRadius: '8px', padding: '10px' }}
                    />
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "var(--clr-dark)" }}>Correo electrónico</label>
                    <input
                        type="email"
                        className={`form-control ${!emailValid && "is-invalid"}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ borderRadius: '8px', padding: '10px' }}
                    />
                    {!emailValid && <div className="invalid-feedback">Correo inválido</div>}
                </div>

                {/* Contraseña */}
                <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "var(--clr-dark)" }}>Contraseña</label>
                    <div className="input-group">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            className="form-control" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            style={{ borderRight: 'none', borderRadius: '8px 0 0 8px', padding: '10px' }}
                        />
                        <span 
                            className="input-group-text" 
                            style={{ 
                                cursor: "pointer", 
                                borderRadius: '0 8px 8px 0',
                                backgroundColor: 'var(--clr-light)', 
                                borderColor: '#ced4da',
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                        </span>
                    </div>
                    {passwordStrength && <small className="text-muted">Contraseña: {passwordStrength}</small>}
                </div>


                <div className="d-flex gap-3">
                    <div className="mb-3 flex-grow-1">
                        <label className="form-label fw-bold" style={{ color: "var(--clr-dark)" }}>Rol</label>
                        <select 
                            className="form-select" 
                            value={rol} 
                            onChange={(e) => setRol(e.target.value)} 
                            required
                            style={{ borderRadius: '8px', padding: '10px' }}
                        >
                            {rolesOptions.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
                        </select>
                    </div>
                    <div className="mb-3 flex-grow-1">
                        <label className="form-label fw-bold" style={{ color: "var(--clr-dark)" }}>Sucursal</label>
                        <select 
                            className="form-select" 
                            value={sucursal} 
                            onChange={(e) => setSucursal(e.target.value)} 
                            required
                            style={{ borderRadius: '8px', padding: '10px' }}
                        >
                            {sucursalesOptions.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                        </select>
                    </div>
                </div>

                {/* Teléfono */}
                <div className="mb-3">
                    <label className="form-label fw-bold" style={{ color: "var(--clr-dark)" }}>Teléfono</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={telefono} 
                        onChange={(e) => setTelefono(e.target.value)} 
                        style={{ borderRadius: '8px', padding: '10px' }}
                    />
                </div>

                {/* Foto */}
                <div className="mb-4">
                    <label className="form-label fw-bold" style={{ color: "var(--clr-dark)" }}>Foto de Perfil</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        onChange={(e) => setFoto(e.target.files[0])} 
                        accept="image/*"
                        style={{ borderRadius: '8px', padding: '10px' }}
                    />
                </div>

                {message && <p className="mt-3 text-center text-danger">{message}</p>}

                <button 
                    type="submit" 
                    className="btn btn-success w-100 fw-bold" 
                    style={{ padding: '10px', borderRadius: '8px', marginTop: '15px' }}
                >
                    Registrarse
                </button>
            </form>
        
            <div style={{ paddingBottom: '1px' }}></div>
        </div>
    );
};

export default Register;