import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const auth = authService.isAuthenticated();
            setIsAuthenticated(auth);
            if (!auth) {
                // Redirect to the analyzer's login page
                window.location.href = 'http://localhost:5177/login';
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or a spinner
    }

    return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;
