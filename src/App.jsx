import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PatientPanel from "./pages/PatientPanel"; 
import MedicoPanel from "./pages/MedicoPanel";
import AuthPage from "./pages/AuthPage";
import AdminPanel from "./pages/AdminPanel";
import LandingPage from "./pages/LandingPage";


function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<LandingPage/>} />
        <Route path="/auth" element={<AuthPage />} />

        {/*Rutas privadas para Paciente */}
        <Route
          path="/patient/*"
          element={
            <PrivateRoute allowedRoles={["abc856dd-ba5f-41ae-8dea-27aa29f8ab47"]}>
              <PatientPanel />
            </PrivateRoute>
          }
        />

        {/*Rutas privadas para Médico */}
        <Route
          path="/medico/*"
          element={
            <PrivateRoute allowedRoles={["5770e7d5-c449-4094-bbe1-fd52ee6fe75f"]}>
              <MedicoPanel />
            </PrivateRoute>
          }
        />

        {/*  Rutas privadas para Admin */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={["b20c6894-e11b-41aa-864a-b642b94682c1"]}>
              <AdminPanel />
            </PrivateRoute>
          }
        /> 
      </Routes>
    </Router>
  );
}

export default App;
