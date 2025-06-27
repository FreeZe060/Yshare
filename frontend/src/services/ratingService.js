const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Noter un événement (POST /ratings)
 * Attendu dans le body : { id_event, rating, message }
 */
export async function rateEvent(ratingData, token) {
	const response = await fetch(`${API_BASE_URL}/ratings`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(ratingData)
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de l'enregistrement de la note");
	}
	return result;
}

export async function getUserAverageRating(userId) {
	const response = await fetch(`${API_BASE_URL}/ratings/user/${userId}`, {
		method: "GET",
		credentials: "include", 
		headers: {
			"Content-Type": "application/json",
		}
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération de la note utilisateur");
	}

	return parseFloat(result.rating);
}

export async function getAllRatings(token) {
	const response = await fetch(`${API_BASE_URL}/ratings/admin/all`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des notes");
	}

	return result;
}

/**
 * Supprimer une note (admin uniquement)
 */
export async function deleteRating(id, token) {
	const response = await fetch(`${API_BASE_URL}/ratings/${id}`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la suppression de la note");
	}

	return result;
}