const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export async function checkAuthStatus() {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/check`, {
			method: 'GET',
			credentials: 'include',
		});

		if (!response.ok) return { authenticated: false };

		const data = await response.json();
		return { authenticated: true, user: data.user };
	} catch (err) {
		console.error("Auth check error:", err.message);
		return { authenticated: false };
	}
}

export async function logout() {
	try {
		await fetch(`${API_BASE_URL}/logout`, {
			method: 'POST',
			credentials: 'include',
		});
	} catch (err) {
		console.error("Erreur de déconnexion :", err);
	}
}