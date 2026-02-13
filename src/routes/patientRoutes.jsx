import React from "react";
import { Routes, Route } from "react-router-dom";
import PatientDashboard from "../components/patient/PatientDashboard";
import ScheduleAppointment from "../components/patient/ScheduleAppointment";
import UpcomingAppointments from "../components/patient/UpcomingAppointments";

const PatientRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PatientDashboard />} />
      <Route path="schedule" element={<ScheduleAppointment />} />
      <Route path="upcoming" element={<UpcomingAppointments />} />
    </Routes>
  );
};

export default PatientRoutes;
