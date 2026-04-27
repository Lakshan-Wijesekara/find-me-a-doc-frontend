import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getMyProfile, updateMyProfile, type DoctorProfile } from '../services/doctorService';
import {
    getDoctorAppointments,
    type DoctorAppointmentDashboardResponse,
    cancelDoctorAppointment
} from '../services/appointmentService';

// Helper function to color-code urgency levels
const getUrgencyColor = (urgency?: string) => {
    switch (urgency?.toLowerCase()) {
        case 'high':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low':
            return 'bg-green-100 text-green-800 border-green-200';
        default:
            return 'bg-muted text-muted-foreground border-border';
    }
};

const ALLOWED_SPECIALIZATIONS = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Psychiatry'
];

export default function DoctorDashboard() {
    const { logout } = useAuth();

    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [newBookingToast, setNewBookingToast] = useState<{name: string, message: string} | null>(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<DoctorProfile>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<number | string | null>(null);

    const [appointments, setAppointments] = useState<DoctorAppointmentDashboardResponse[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

    const fetchProfile = async () => {
        try {
            const data = await getMyProfile();
            setProfile(data);
            setEditForm(data);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const data = await getDoctorAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Failed to load appointments", error);
        } finally {
            setIsLoadingAppointments(false);
        }
    };

        // Ask for confirmation, opens the pop-up
    const handleCancelClick = (appointmentId: number | string) => {
        setAppointmentToCancel(appointmentId);
    };

// 2. Actually fires the API call when they click "Yes"
    const confirmCancellation = async () => {
        if (!appointmentToCancel) return;

        try {
            await cancelDoctorAppointment(appointmentToCancel);
            fetchAppointments(); // Refresh the list
        } catch (error) {
            console.error("Failed to cancel appointment:", error);
            alert("Failed to cancel the appointment. Please try again.");
        } finally {
            setAppointmentToCancel(null); // Close the modal
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchAppointments();
    }, []);

    // 2. WebSocket Logic
    useEffect(() => {
        const token = localStorage.getItem('token');
        const doctorId = profile?.id;

        if (!token || !doctorId) return;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
            connectHeaders: { Authorization: `Bearer ${token}` },
            onConnect: () => {
                console.log('🔌 Connected to WebSocket');
                stompClient.subscribe(`/topic/doctor/${doctorId}`, (message) => {
                    const payload = JSON.parse(message.body);

                    // Alert the doctor
                    setNewBookingToast({ name: payload.patientName, message: payload.message });
                    // Refresh the list to get the full object with AI Brief, this runs eachtime a message returns
                    fetchAppointments();

                    setTimeout(() => setNewBookingToast(null), 5000);
                });
            },
            onStompError: (frame) => console.error('STOMP Error', frame)
        });

        stompClient.activate();

        return () => {
            if (stompClient.active) stompClient.deactivate();
        };
    }, [profile?.id]);

    const handleSaveProfile = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const updatedProfile = await updateMyProfile(editForm);
            setProfile(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading dashboard...</div>;
    }

            return (
                <div className="min-h-screen bg-background p-6 md:p-8">
                    <div className="mx-auto max-w-6xl">
                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                    Welcome, {profile?.name || 'Doctor'}
                                </h1>
                                <p className="mt-1 text-muted-foreground">Manage your practice and appointments.</p>
                            </div>
                            <button
                                onClick={logout}
                                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                            >
                                Log Out
                            </button>
                        </div>

                        <div className="grid gap-6 md:grid-cols-3">
                            {/* Left Column: Profile Management */}
                            <div className="md:col-span-1 space-y-6">
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-xl font-semibold text-card-foreground">My Profile</h2>
                                        {!isEditing && (
                                            <button onClick={() => setIsEditing(true)} className="text-sm font-medium text-primary hover:underline">
                                                Edit
                                            </button>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={handleSaveProfile} className="space-y-4">
                                            {/* Form fields */}
                                            <div>
                                                <label className="text-sm font-medium">Full Name</label>
                                                <input type="text" value={editForm.name || ''} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Specialization</label>
                                                <select
                                                    value={editForm.specialization || ''}
                                                    onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                                                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                >
                                                    <option value="" disabled>Select a specialization...</option>
                                                    {ALLOWED_SPECIALIZATIONS.map((spec) => (
                                                        <option key={spec} value={spec}>
                                                            {spec}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Consultation Fee ($)</label>
                                                <input type="number" value={editForm.consultationFee || ''} onChange={(e) => setEditForm({...editForm, consultationFee: parseFloat(e.target.value)})} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">Phone Number</label>
                                                <input type="text" value={editForm.phoneNumber || ''} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button type="button" onClick={() => setIsEditing(false)} className="w-full rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent">Cancel</button>
                                                <button type="submit" disabled={isSaving} className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                                                    {isSaving ? 'Saving...' : 'Save'}
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <div className="space-y-3 text-sm">
                                            {/* Profile display */}
                                            <div><span className="text-muted-foreground block text-xs uppercase tracking-wider">Email</span><span className="font-medium text-foreground">{profile?.email}</span></div>
                                            <div><span className="text-muted-foreground block text-xs uppercase tracking-wider">Specialization</span><span className="font-medium text-foreground">{profile?.specialization}</span></div>
                                            <div><span className="text-muted-foreground block text-xs uppercase tracking-wider">Phone Number</span><span className="font-medium text-foreground">{profile?.phoneNumber || 'Not provided'}</span></div>
                                            <div><span className="text-muted-foreground block text-xs uppercase tracking-wider">Consultation Fee</span><span className="font-medium text-foreground">${profile?.consultationFee?.toFixed(2) || '0.00'}</span></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Appointments List */}
                            <div className="md:col-span-2 space-y-6">
                                <div className="rounded-xl border border-border bg-card p-6 shadow-sm min-h-[400px]">
                                    <h2 className="text-xl font-semibold text-card-foreground mb-4">Upcoming Appointments</h2>

                                    {isLoadingAppointments ? (
                                        <div className="flex h-[300px] items-center justify-center text-muted-foreground animate-pulse">
                                            Loading schedule...
                                        </div>
                                    ) : appointments.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {appointments.map((apt) => (
                                                <div key={apt.appointmentId} className="flex flex-col rounded-lg border border-border p-5 shadow-sm bg-background/50 hover:bg-accent/10 transition-colors">

                                                    {/* Patient Name & Status */}
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-lg font-bold text-foreground">{apt.patientName}</h3>
                                                            <div className="text-sm text-muted-foreground mt-1 flex gap-3">
                                                                <span>🗓️ {apt.appointmentDate}</span>
                                                                <span>⏰ {apt.appointmentTime}</span>
                                                            </div>
                                                        </div>

                                                        {/* Right Side: Status Badge and Action Button */}
                                                        <div className="flex flex-col items-end gap-2">
                                                            {/* Dynamic Status Badge */}
                                                            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                                                                apt.status?.toUpperCase() === 'CANCELLED'
                                                                    ? 'bg-red-100 text-red-700 border-red-200'
                                                                    : 'bg-primary/10 text-primary border-primary/20'
                                                            }`}>
                                                        {apt.status}
                                                    </span>

                                                            {/* Cancel Button (Hidden if already cancelled) */}
                                                            {apt.status?.toUpperCase() !== 'CANCELLED' && (
                                                                <button
                                                                    onClick={() => handleCancelClick(apt.appointmentId)}
                                                                    className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition-colors focus:outline-none"
                                                                >
                                                                    Cancel Appointment
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* AI Triage Brief Section */}
                                                    {apt.aiBrief && (
                                                        <div className="rounded-md bg-muted/30 p-4 border border-border/50">
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                        <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getUrgencyColor(apt.aiBrief.urgencyLevel)}`}>
                                                            Urgency: {apt.aiBrief.urgencyLevel || 'Unknown'}
                                                        </span>
                                                                <span className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                                                            Viral Likelihood: {apt.aiBrief.viralLikelihood || 'N/A'}
                                                        </span>
                                                            </div>
                                                            <div>
                                                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">AI Preliminary Notes</h4>
                                                                <p className="text-sm text-foreground/90 leading-relaxed">
                                                                    {apt.aiBrief.doctorBrief || "No triage notes available for this patient."}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20">
                                            <p className="text-muted-foreground">You have no appointments scheduled.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Cancellation Confirmation Modal --- */}
                    {appointmentToCancel && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl ring-1 ring-border zoom-in-95 duration-200">
                                <h3 className="text-lg font-bold text-foreground">Cancel Appointment?</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Are you sure you want to cancel this appointment?
                                </p>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button
                                        onClick={() => setAppointmentToCancel(null)}
                                        className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
                                    >
                                        No, Keep it
                                    </button>
                                    <button
                                        onClick={confirmCancellation}
                                        className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors"
                                    >
                                        Yes, Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- Real-time Notification Toast --- */}
                    {newBookingToast && (
                        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-10 duration-300">
                            <div className="flex w-80 items-center gap-4 rounded-lg border border-primary/20 bg-card p-4 shadow-2xl ring-1 ring-black/5">
                                {/* Icon/Avatar */}
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl">
                                    ✨
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-foreground">New Appointment!</p>
                                    <p className="text-xs text-muted-foreground leading-tight">
                                        {newBookingToast.name} has just booked a slot.
                                    </p>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setNewBookingToast(null)}
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <span className="text-lg">×</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }