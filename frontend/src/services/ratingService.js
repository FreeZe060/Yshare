import { getToken } from "./authService";
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Noter un événement (POST /ratings)
 * Attendu dans le body : { id_event, rating, message }
 */
export async function rateEvent(ratingData) {
	const response = await fetch(`${API_BASE_URL}/ratings`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		},
		body: JSON.stringify(ratingData)
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de l'enregistrement de la note");
	}
	return result;
}

/**
 * Récupérer l'historique d'événements du user (GET /event-history)
 */
export async function getEventHistory() {
	const response = await fetch(`${API_BASE_URL}/event-history`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${getToken()}`
		}
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération de l'historique");
	}
	return result;
}