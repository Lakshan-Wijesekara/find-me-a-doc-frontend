import React, { useState } from 'react';
import { registerPatient } from '@/services/authService';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


export const PatientRegisterPage = () => {
    const navigate = useNavigate();

    // 1. Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [age, setAge] = useState('');
    // 2. UI Status States
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    //Translations
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const handleRegister = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        // Basic validation updated
        if (!name || !email || !password || !phoneNumber || !age) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await registerPatient({
                name,
                email,
                password,
                phoneNumber,
                age: parseInt(age, 10) // Convert the string input to a number
            });

            setSuccessMessage(`Welcome ${response.name}! Your patient account has been created successfully. You can now log in.`);

            // Clear the form
            setName('');
            setEmail('');
            setPassword('');
            setPhoneNumber('');
            setAge('');

        } catch (error: any) {
            setErrorMessage(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-muted/30 p-4 py-10">

            {/* --- Localization Switcher --- */}
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
                    <h2 className="text-2xl font-semibold tracking-tight">{t('pat_reg_title')}</h2>
                    <p className="text-sm text-muted-foreground">
                        {t('pat_reg_subtitle')}
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
                        <label className="text-sm font-medium text-foreground">{t('full_name')}</label>
                        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder={t('pat_name_placeholder')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('email')}</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@example.com" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    {/* SIDE-BY-SIDE GRID FOR PHONE AND AGE */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{t('phone')}</label>
                            <input type="tel" required value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+1 234 5678" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">{t('age')}</label>
                            <input type="number" required min="0" max="120" value={age} onChange={(e) => setAge(e.target.value)} placeholder="25" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">{t('password')}</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
                    </div>

                    <button type="submit" disabled={isLoading} className="mt-2 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50">
                        {isLoading ? t('creating_account') : t('register_pat_btn')}
                    </button>

                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        {t('already_registered')}{" "}
                        <button type="button" onClick={() => navigate('/login')} className="text-primary hover:underline underline-offset-4 font-medium">
                            {t('log_in_link')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}