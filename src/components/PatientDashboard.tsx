import { useState, useEffect } from "react";
import { getPatientAppointments, type AppointmentDashboardResponse } from "../services/appointmentService";
import {useNavigate} from "react-router-dom";
import {useAuth} from "@/context/AuthContext.tsx";

function PatientDashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState<AppointmentDashboardResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const data = await getPatientAppointments();
                setAppointments(data);
            } catch (err: any) {
                setError("Failed to load appointments. Please ensure you are logged in.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading your appointments...</div>;
    }

    return (
        <div className="container mx-auto p-6 md:p-8">
            {/* The "Find a Doctor" button */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Appointments</h1>
                    <p className="text-muted-foreground mt-1">Manage and view your upcoming consultations.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
                    >
                        Find a Doctor
                    </button>
                    <button
                        onClick={logout}
                        className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                        Log Out
                    </button>
                </div>

            </div>
            {/* conditional rendering for the appointment if error shows red error message thrown by the API */}
            {error ? (
                <div className="rounded-md bg-destructive/15 p-4 text-destructive font-medium">
                    {error}
                </div>
            ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {appointments.map((apt) => (
                        <div
                            key={apt.bookingId}
                            className="flex flex-col rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold tracking-tight">{apt.doctorName}</h3>
                                    <p className="text-sm text-muted-foreground">{apt.specialization}</p>
                                </div>
                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                                    {apt.status}
                                </span>
                            </div>

                            <div className="mt-auto pt-4 border-t border-border/50 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-medium">{apt.appointmentDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Time:</span>
                                    <span className="font-medium">{apt.appointmentTime}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* for empty state */
                <div className="py-16 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-xl bg-card/50">
                    <h3 className="text-lg font-medium text-foreground mb-1">No appointments found</h3>
                    <p className="text-muted-foreground mb-6">You haven't booked any consultations yet.</p>
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Browse Marketplace
                    </button>
                </div>
            )}
            {/* Floating Symptom Analyzer Button */}
            <div className="fixed bottom-8 right-8 z-50">
                <button
                    onClick={() => navigate('/triage')}
                    className="group flex h-14 w-14 items-center justify-start overflow-hidden rounded-full bg-indigo-600 text-white shadow-lg transition-all duration-300 hover:w-56 hover:rounded-3xl"
                >
                    {/* Icon Container - Fixed size so it doesn't move */}
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
                            <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
                        </svg>
                    </div>

                    {/* Text width is expandable */}
                    <span className="max-w-0 overflow-hidden whitespace-nowrap pr-0 text-lg font-medium opacity-0 transition-all duration-300 group-hover:max-w-xs group-hover:pr-6 group-hover:opacity-100">
      Symptom Analyzer
    </span>
    {/* Notification Pulse */}
    <span className="absolute top-0 left-10 flex h-3 w-3">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
    </span>
                </button>
            </div>
        </div>
    );
}

export default PatientDashboard;