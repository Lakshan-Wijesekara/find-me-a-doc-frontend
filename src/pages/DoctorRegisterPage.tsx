import React, { useState } from 'react';
import { registerDoctor } from '@/services/authService';
import {useNavigate} from "react-router-dom";

export const DoctorRegisterPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [consultationFee, setConsultationFee] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    // UI Status States
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Basic validation
        if (!name || !email || !password || !specialization || !consultationFee || !phoneNumber) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
           const response = await registerDoctor({
                name,
                email,
                password,
                specialization,
                consultationFee: parseFloat(consultationFee), // Convert string to Double
                phoneNumber
            });

            setSuccessMessage(`Welcome Dr. ${response.name}! Your account has been created successfully. You can now log in.`);

            // Clear the form
            setName('');
            setEmail('');
            setPassword('');
            setSpecialization('');
            setConsultationFee('');
            setPhoneNumber('');

        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 py-10">
            <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">

                {/* LOGO SECTION */}
                <div className="mb-6 flex flex-col items-center justify-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary-foreground">
                            <path d="M12 2v20M2 12h20" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        FindMeADoc
                    </span>
                </div>

                <div className="mb-6 flex flex-col space-y-1.5 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight">Doctor Registration</h2>
                    <p className="text-sm text-muted-foreground">
                        Join our platform to start receiving patients
                    </p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">

                    {errorMessage && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                            {errorMessage}
                        </div>
                    )}

                    {successMessage && (
                        <div className="rounded-md bg-green-500/15 p-3 text-sm font-medium text-green-600 dark:text-green-400">
                            {successMessage}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Full Name</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. John Doe" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Specialization</label>
                            <input type="text" required value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Cardiology" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Fee ($)</label>
                            <input type="number" required min="0" step="0.01" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} placeholder="150.00" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 234 567 890" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Password</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    <button type="submit" disabled={isLoading} className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50">
                        {isLoading ? 'Creating account...' : 'Register as Doctor'}
                    </button>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Already registered?{" "}
                        <button type="button" onClick={() => navigate('/login')} className="text-primary hover:underline underline-offset-4 font-medium">
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};