import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyProfile, updateMyProfile, type DoctorProfile } from '../services/doctorService';
import { getDoctorAppointments, type DoctorAppointmentDashboardResponse } from '../services/appointmentService';

export default function DoctorDashboard() {
    const { logout } = useAuth();

    // State for profile data
    const [profile, setProfile] = useState<DoctorProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // State for editing mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<Partial<DoctorProfile>>({});
    const [isSaving, setIsSaving] = useState(false);

    const [appointments, setAppointments] = useState<DoctorAppointmentDashboardResponse[]>([]);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

    // Should be above the useEffects
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

    useEffect(() => {
        fetchProfile();
        fetchAppointments();
    }, []);

    const handleSaveProfile = async (e: React.FormEvent) => {
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
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>

                            {isEditing ? (
                                <form onSubmit={handleSaveProfile} className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            value={editForm.name || ''}
                                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Specialization</label>
                                        <input
                                            type="text"
                                            value={editForm.specialization || ''}
                                            onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Consultation Fee ($)</label>
                                        <input
                                            type="number"
                                            value={editForm.consultationFee || ''}
                                            onChange={(e) => setEditForm({...editForm, consultationFee: parseFloat(e.target.value)})}
                                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Phone Number</label>
                                        <input
                                            type="text"
                                            value={editForm.phoneNumber || ''}
                                            onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                                            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                        />
                                    </div>


                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="w-full rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                        >
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">Email</span>
                                        <span className="font-medium text-foreground">{profile?.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">Specialization</span>
                                        <span className="font-medium text-foreground">{profile?.specialization}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">Phone Number</span>
                                        <span className="font-medium text-foreground">{profile?.phoneNumber || 'Not provided'}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground block text-xs uppercase tracking-wider">Consultation Fee</span>
                                        <span className="font-medium text-foreground">${profile?.consultationFee?.toFixed(2) || '0.00'}</span>
                                    </div>
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
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    {appointments.map((apt) => (
                                        <div key={apt.appointmentId} className="flex flex-col rounded-lg border border-border p-4 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-semibold text-foreground">{apt.patientName}</h3>
                                                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary border-primary/20">
                                                    {apt.status}
                                                </span>
                                            </div>
                                            <div className="mt-auto space-y-1 text-sm text-muted-foreground pt-2 border-t border-border/50">
                                                <p>Date: <span className="font-medium text-foreground">{apt.appointmentDate}</span></p>
                                                <p>Time: <span className="font-medium text-foreground">{apt.appointmentTime}</span></p>
                                            </div>
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
        </div>
    );
}