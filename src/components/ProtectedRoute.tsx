import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Is logged in?
    const { isAuthenticated } = useAuth();

    // Redirect them immediately to the login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If logged in, render the page
    return <>{children}</>;
};