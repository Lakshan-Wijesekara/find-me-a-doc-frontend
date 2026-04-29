import React, { useState } from 'react';
import {loginUser} from "@/services/authService.ts";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI Status States
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    //Translations
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    // Form Submission Handler
    const handleLogin = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setErrorMessage("Please enter both email and password.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');

        try {
            // Call the login API
            const response = await loginUser({ email, password });

            login(response.token, response.role, response.userID.toString(), response.email);

            if (response.role === 'DOCTOR') {
                navigate('/doctor-dashboard');
            } else {
                navigate('/patient-dashboard');
            }

            console.log("Login successful:", response);

            // Simulating a network delay for now
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            setErrorMessage("Invalid email or password.");
        } finally {
            setIsLoading(false);
        }
    };

    // 4. The UI
    return (
        <div className="relative min-h-screen flex items-center justify-center bg-muted/30 p-4">

            {/* --- Language Switch --- */}
            <div className="absolute top-6 right-6 flex gap-2">
                <button
                    onClick={() => changeLanguage('en')}
                    className={`h-8 px-3 text-xs font-medium rounded-md border transition-colors ${i18n.language === 'en' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-input hover:bg-accent'}`}
                >
                    EN
                </button>
                <button
                    onClick={() => changeLanguage('si')}
                    className={`h-8 px-3 text-xs font-medium rounded-md border transition-colors ${i18n.language === 'si' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-input hover:bg-accent'}`}
                >
                    සිංහල
                </button>
                <button
                    onClick={() => changeLanguage('ta')}
                    className={`h-8 px-3 text-xs font-medium rounded-md border transition-colors ${i18n.language === 'ta' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-input hover:bg-accent'}`}
                >
                    தமிழ்
                </button>
            </div>

            <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">

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

                <div className="flex flex-col space-y-1.5 text-center mb-6">
                    <h2 className="text-2xl font-semibold tracking-tight">{t('welcome')}</h2>
                    <p className="text-sm text-muted-foreground">
                        {t('subtitle')}
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    {errorMessage && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm font-medium text-destructive">
                            {errorMessage}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('email')}</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@example.com"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('password')}</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {isLoading ? t('signing_in') : t('sign_in')}
                    </button>

                    <div className="mt-6 flex flex-col items-center gap-3 text-sm text-muted-foreground">
                        <p>{t('no_account')}</p>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/register/patient')}
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                {t('signup_patient')}
                            </button>
                            <span className="text-border">|</span>
                            <button
                                type="button"
                                onClick={() => navigate('/register/doctor')}
                                className="font-medium text-primary underline-offset-4 hover:underline"
                            >
                                {t('signup_doctor')}
                            </button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}