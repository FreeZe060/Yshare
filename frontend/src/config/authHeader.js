import { createContext, useContext, useEffect, useState } from 'react';
import { checkAuthStatus, logout } from '../services/authService'; // tes fonctions déjà existantes

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      console.warn("useAuth() must be used within AuthProvider");
      return null;
    }
    return context;
};
  
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = pas encore chargé / {} = non connecté
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { authenticated, user } = await checkAuthStatus();
        setUser(authenticated ? user : {});
      } catch (err) {
        console.error("Auth check failed:", err);
        setUser({});
      } finally {
        setLoading(false);
      }
    };
  
    checkAuth();
  }, []);
  

  useEffect(() => {
    if (!user?.id) return;
  
    let timeout;
    const INACTIVITY_LIMIT = 15 * 60 * 1000; 
  
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logoutUser(); 
      }, INACTIVITY_LIMIT);
    };
  
    resetTimer();
  
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
  
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(timeout);
    };
  }, [user]);
  

  const login = (userData) => {
    setUser(userData); 
  };

  const logoutUser = async () => {
    await logout();
    setUser({});
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user?.id, login, logout: logoutUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
