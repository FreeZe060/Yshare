const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Récupérer tous les participants (admin)
 * GET /participants
 */
export async function getAllParticipantsForAdmin(token) {
	const response = await fetch(`${API_BASE_URL}/participants`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des participants");
	}
	return result;
}

/**
 * Récupérer tous les participants d’un événement
 * GET /events/:eventId/participants
 */
export async function getParticipantsByEvent(eventId, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des participants de l'événement");
	}
	return result;
}

/**
 * Récupérer un participant par son index dans un événement
 * GET /events/:eventId/participants/:index
 */
export async function getParticipantByIndex(eventId, index, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants/${index}`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération du participant");
	}
	return result;
}

/**
 * Ajouter un participant à un événement
 * POST /events/:eventId/participants
 */
export async function addParticipant(eventId, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		// Le backend ne nécessite pas forcément de body, sinon vous pouvez envoyer un objet vide
		body: JSON.stringify({}),
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de l'inscription à l'événement");
	}
	return result;
}

/**
 * Mettre à jour le statut d'un participant
 * PUT /events/:eventId/participants/:index
 */
export async function updateParticipantStatus(eventId, index, status, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants/${index}`, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ status }),
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la mise à jour du statut du participant");
	}
	return result;
}

/**
 * Retirer un participant d'un événement
 * DELETE /events/:eventId/participants/:index
 */
export async function removeParticipant(eventId, index, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants/${index}`, {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors du retrait du participant");
	}
	return result;
}

/**
 * Récupérer l'historique (ou les événements) d'un utilisateur (admin)
 * GET /users/:userId/events
 */
export async function getUserEventsAdmin(userId, token) {
	const response = await fetch(`${API_BASE_URL}/users/${userId}/events`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des événements de l'utilisateur");
	}
	return result;
}