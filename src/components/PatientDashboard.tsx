import { useState, useEffect } from "react";
import { getPatientAppointments, type AppointmentDashboardResponse } from "../services/appointmentService";
import {useNavigate} from "react-router-dom";

function PatientDashboard() {
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
            {/* 3. Updated Header to include the "Find a Doctor" button */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Appointments</h1>
                    <p className="text-muted-foreground mt-1">Manage and view your upcoming consultations.</p>
                </div>
                <button
                    onClick={() => navigate('/marketplace')}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
                >
                    Find a Doctor
                </button>
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
        </div>
    );
}

export default PatientDashboard;