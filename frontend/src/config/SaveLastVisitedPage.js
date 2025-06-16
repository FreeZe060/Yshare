import { useLocation } from 'react-router-dom';
import { useAuth } from '../config/authHeader'; 
import { useEffect } from 'react';

const SaveLastVisitedPage = () => {
    const location = useLocation();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const excludedPaths = ['/login', '/register'];
        if (!isAuthenticated && !excludedPaths.includes(location.pathname)) {
            localStorage.setItem('lastVisited', location.pathname + location.search);
        }
    }, [location, isAuthenticated]);

    return null;
};

export default SaveLastVisitedPage;