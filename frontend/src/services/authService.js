const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

export async function checkAuthStatus() {
	try {
		const response = await fetch(`${REACT_APP_API_BASE_URL}/auth/check`, {
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
		await fetch(`${REACT_APP_API_BASE_URL}/logout`, {
			method: 'POST',
			credentials: 'include',
		});
	} catch (err) {
		console.error("Erreur de déconnexion :", err);
	}
}

export async function deleteAccount() {
	try {
		const response = await fetch(`${REACT_APP_API_BASE_URL}/auth/delete-account`, {
			method: 'DELETE',
			credentials: 'include',
		});

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || 'Erreur lors de la suppression du compte');
		}

		return await response.json();
	} catch (err) {
		console.error("Erreur de suppression du compte :", err);
		throw err;
	}
}