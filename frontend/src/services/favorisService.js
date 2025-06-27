const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Ajouter un événement aux favoris
 */
export async function addFavoris(eventId, token) {
	const response = await fetch(`${API_BASE_URL}/favoris/${eventId}`, {
		method: "POST",
		credentials: "include", 
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de l'ajout aux favoris");
	return result;
}

/**
 * Retirer un événement des favoris
 */
export async function removeFavoris(eventId, token) {
	const response = await fetch(`${API_BASE_URL}/favoris/${eventId}`, {
		method: "DELETE",
		credentials: "include",
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors du retrait des favoris");
	return result;
}

/**
 * Récupérer tous les favoris
 */
export async function getAllFavoris(token) {
	const response = await fetch(`${API_BASE_URL}/favoris`, {
		method: "GET",
		credentials: "include", 
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des favoris");
	return result;
}

/**
 * Récupérer un favori précis
 */
export async function getFavorisById(eventId, token) {
	const response = await fetch(`${API_BASE_URL}/favoris/${eventId}`, {
		method: "GET",
		credentials: "include", 
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération du favori");
	return result;
}