import { Routes, Route, Navigate } from 'react-router-dom';
import Marketplace from '@/pages/Marketplace';
import PatientDashboard from "@/components/PatientDashboard.tsx";
import './App.css';
import {LoginPage} from "@/pages/LoginPage.tsx";
import {DoctorRegisterPage} from "@/pages/DoctorRegisterPage.tsx";
import {PatientRegisterPage} from "@/pages/PatientRegisterPage.tsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.tsx";
import DoctorDashboard from "@/components/DoctorDashboard.tsx";
import TriageChat from "@/components/TriageChat.tsx";

function App() {
  return (
      <Routes>
        {/*Default Route*/}
        <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/triage" element={<TriageChat/>} />

        {/* Public Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/patient" element={<PatientRegisterPage />} />
        <Route path="/register/doctor" element={<DoctorRegisterPage />} />

        <Route path="/marketplace" element={
            <ProtectedRoute>
                <Marketplace />
            </ProtectedRoute>
        } />
        <Route path="/patient-dashboard" element={
            <ProtectedRoute>
                <PatientDashboard />
            </ProtectedRoute>
        } />
          <Route path="/doctor-dashboard" element={
              <ProtectedRoute>
                  <DoctorDashboard />
              </ProtectedRoute>
          } />

      </Routes>
  );
}

export default App;