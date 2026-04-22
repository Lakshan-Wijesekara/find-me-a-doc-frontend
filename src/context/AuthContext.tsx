import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    role: string | null;
    login: (token: string, userRole: string, userId: string, email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [role, setRole] = useState<string | null>(null);

    // NEW: Add a loading state to pause rendering!
    const [isChecking, setIsChecking] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedRole = localStorage.getItem("userRole");

        if (token) {
            setIsAuthenticated(true);
            setRole(savedRole);
        }

        // Tell React we are done checking local storage!
        setIsChecking(false);
    }, []);

    const login = (token: string, userRole: string, userId: string, email: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userID", userId);
        localStorage.setItem("email", email); // This will work now!

        setIsAuthenticated(true);
        setRole(userRole);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userID");
        localStorage.removeItem("email");

        setIsAuthenticated(false);
        setRole(null);
    };

    // NEW: If we are still checking storage, don't load the Protected Routes yet!
    if (isChecking) {
        return null; // Or a loading spinner: <div>Loading...</div>
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};