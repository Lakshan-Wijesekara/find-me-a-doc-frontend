import { Button } from "@/components/ui/button";
import Marketplace from '@/pages/Marketplace';
import PatientDashboard from "@/components/PatientDashboard.tsx";
import './App.css';
import {LoginPage} from "@/pages/LoginPage.tsx";
import {DoctorRegisterPage} from "@/pages/DoctorRegisterPage.tsx";
import {PatientRegisterPage} from "@/pages/PatientRegisterPage.tsx";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-slate-900">
          FindMeADoc
        </h1>
        <p className="text-lg text-slate-600">
          Patient & Doctor Appointment System
        </p>

        <Button onClick={() => alert("Booked test!")}>
          Book an Appointment
        </Button>
        <div>
          < Marketplace />
        </div>
        <div>
          <  PatientDashboard/>
        </div>
        <div>
          <  LoginPage/>
        </div>
        <div>
          <  DoctorRegisterPage/>
          < PatientRegisterPage />
        </div>
      </div>
    </div>
  );
}

export default App;