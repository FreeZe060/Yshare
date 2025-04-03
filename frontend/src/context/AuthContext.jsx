import { createContext, useState, useEffect, useContext } from 'react';
import { checkAuthStatus, logout as apiLogout } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	const refreshAuth = async () => {
		const { authenticated, user } = await checkAuthStatus();
		setIsAuthenticated(authenticated);
		setUser(user || null);
		setLoading(false);
	};

	useEffect(() => {
		refreshAuth();
		const interval = setInterval(refreshAuth, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	const logout = async () => {
		await apiLogout();
		setUser(null);
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, isAdmin: user?.role === 'Administrateur', logout }}>
			{loading ? <div>Chargement auth...</div> : children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);