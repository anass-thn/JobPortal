import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoutes = ({ requiredRole }) => {
    const { isAuthenticated, loading, hasRole, hasAnyRole } = useAuth();
    const location = useLocation();

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role if required
    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!hasAnyRole(roles)) {
            // User doesn't have required role, redirect to appropriate dashboard
            const userRole = hasRole('employer') ? 'employer' : 'jobseeker';
            const redirectPath = userRole === 'employer' ? '/employer/dashboard' : '/find-jobs';
            return <Navigate to={redirectPath} replace />;
        }
    }

    // User is authenticated and has required role
    return <Outlet />;
};

export default ProtectedRoutes;