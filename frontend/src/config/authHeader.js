import { createContext, useContext, useEffect, useState } from 'react';
import { checkAuthStatus, logout } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { authenticated, user } = await checkAuthStatus();
                if (authenticated) {
                    const token = sessionStorage.getItem('token');
                    console.log("Token récupéré depuis sessionStorage:", token);
                    setUser(...user, token);
                } else {
                    setUser({});
                }
            } catch (err) {
                console.error("Auth check failed:", err);
                setUser({});
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // useEffect(() => {
    //     if (!user?.id) return;

    //     let timeout;
    //     const INACTIVITY_LIMIT = 15 * 60 * 1000;

    //     const resetTimer = () => {
    //         clearTimeout(timeout);
    //         timeout = setTimeout(() => {
    //             logoutUser();
    //         }, INACTIVITY_LIMIT);
    //     };

    //     resetTimer();

    //     window.addEventListener("mousemove", resetTimer);
    //     window.addEventListener("keydown", resetTimer);

    //     return () => {
    //         window.removeEventListener("mousemove", resetTimer);
    //         window.removeEventListener("keydown", resetTimer);
    //         clearTimeout(timeout);
    //     };
    // }, [user]);

    const login = async () => {
        try {
            const { authenticated, user } = await checkAuthStatus();
            if (authenticated) {
                setUser(user);
            } else {
                setUser({});
            }
        } catch (err) {
            console.error("Erreur lors de la récupération de l'utilisateur OAuth :", err.message);
            setUser({});
        }
    };

    const logoutUser = async () => {
        await logout();
        setUser({});
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user?.id, 
                login,
                logout: logoutUser,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};