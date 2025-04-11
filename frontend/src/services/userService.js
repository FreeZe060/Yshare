const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * POST /register
 */
export async function registerUser(userData) {
	const formData = new FormData();
	formData.append("name", userData.name);
	formData.append("lastname", userData.lastname);
	formData.append("email", userData.email);
	formData.append("password", userData.password);
	if (userData.profileImage) {
		formData.append("profileImage", userData.profileImage);
	}

	const response = await fetch(`${API_BASE_URL}/register`, {
		method: 'POST',
		credentials: 'include',
		body: formData,
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de l'inscription");
	return result;
}

/**
 * POST /login
 */
export async function loginUser(credentials) {
	const response = await fetch(`${API_BASE_URL}/login`, {
		method: 'POST',
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(credentials),
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Identifiants invalides");
	return result;
}

/**
 * GET /profile
 */
export async function getProfile(token) {
	const response = await fetch(`${API_BASE_URL}/profile`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération du profil");
	return result;
}

export async function getPublicProfile(userId) {
	const response = await fetch(`${API_BASE_URL}/users/${userId}/public`, {
		credentials: 'include',
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération du profil public");
	return result;
}


/**
 * GET /profile/:userId
 */
export async function getProfileById(userId, token) {
	const response = await fetch(`${API_BASE_URL}/profile/${userId}`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération du profil");
	return result;
}

/**
 * PUT /profile or /profile/:userId
 */
export async function updateProfile(userData, token, userId) {
	if (!userId) throw new Error("L'ID utilisateur est requis pour mettre à jour le profil");

	const url = `${API_BASE_URL}/profile/${userId}`;
	const isFormData = userData instanceof FormData;

	const response = await fetch(url, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			...(isFormData ? {} : { 'Content-Type': 'application/json' }),
			Authorization: `Bearer ${token}`,
		},
		body: isFormData ? userData : JSON.stringify(userData),
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour du profil");
	return result;
}



/**
 * DELETE /users/:userId
 */
export async function deleteUser(userId, token) {
	const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression de l'utilisateur");
	return result;
}

/**
 * GET /event-history
 */
export async function getEventHistory(token, userId) {
	const response = await fetch(`${API_BASE_URL}/users/${userId}/event-history`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || 'Erreur lors de la récupération de l’historique');
	return result;
}	

/**
 * GET /users
 */
export async function getAllUsers(token) {
	const response = await fetch(`${API_BASE_URL}/users`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des utilisateurs");
	return result;
}

/**
 * POST /admin/users
 */
export async function adminCreateUser(userData, token) {
	const response = await fetch(`${API_BASE_URL}/admin/users`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(userData),
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la création de l'utilisateur");
	return result;
}

export async function getParticipationCount(userId) {
	const response = await fetch(`${API_BASE_URL}/users/${userId}/participation-count`, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur récupération participation");																					
	return result.count;
}									