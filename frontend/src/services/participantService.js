const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * ✅ [ADMIN] Récupérer tous les participants
 */
export async function getAllParticipantsForAdmin(token) {
	console.log("🔒 [GET] /participants (admin only)");
	try {
		const res = await fetch(`${API_BASE_URL}/participants/all`, {
			method: 'GET',
			headers: { Authorization: `Bearer ${token}` },
			credentials: 'include',
		});
		const json = await res.json();
		if (!res.ok) {
			console.error("❌ Erreur /participants :", json.message);
			throw new Error(json.message);
		}
		console.log(`✅ Participants récupérés (${json.length})`);
		return json;
	} catch (err) {
		console.error("❌ getAllParticipantsForAdmin - Exception :", err.message);
		throw err;
	}
}

/**
 * ✅ [PUBLIC] Récupérer les participants d’un événement
 */
export async function getParticipantsByEvent(eventId) {
	console.log(`🌍 [GET] /events/${eventId}/participants/all`);
	try {
		const res = await fetch(`${API_BASE_URL}/events/${eventId}/participants/all`);
		const json = await res.json();
		if (!res.ok) {
			console.error(`❌ Erreur /events/${eventId}/participants/all :`, json.message);
			throw new Error(json.message);
		}
		console.log(`✅ Participants pour l'événement #${eventId} : ${json.length}`);
		return json;
	} catch (err) {
		console.error("❌ getParticipantsByEvent - Exception :", err.message);
		throw err;
	}
}

/**
 * ✅ Ajouter un participant à un événement
 */

export async function addParticipant(eventId, token, message, guests = []) {
	console.log(`📝 [POST] /events/${eventId}/participants`);
	console.log("📨 Données envoyées au backend :", { message, guests });
	try {
		const res = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ message, guests }),
			credentials: 'include',
		});
		const json = await res.json();
		if (!res.ok) {
			console.error("❌ Erreur d'inscription :", json.message);
			throw new Error(json.message);
		}
		console.log(`✅ Participant ajouté à l'événement #${eventId}`);
		return json;
	} catch (err) {
		console.error("❌ addParticipant - Exception :", err.message);
		throw err;
	}
}

export async function addParticipantAdmin(eventId, userId, token) {
	const response = await fetch(`${API_BASE_URL}/admin/events/${eventId}/participants/${userId}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		credentials: 'include',
		body: JSON.stringify({ status: 'Inscrit' }),
	});

	const data = await response.json();
	if (!response.ok) throw new Error(data.message || 'Erreur ajout participant (admin)');
	return data;
}

/**
 * ✅ Mettre à jour le statut d’un participant
 */
export async function updateParticipantStatus(eventId, participantId, status, token) {
	console.log(`🔁 [PUT] /events/${eventId}/participants/${participantId} → "${status}"`);
	try {
		const res = await fetch(`${API_BASE_URL}/events/${eventId}/participants/${participantId}`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ status }),
			credentials: 'include',
		});
		const json = await res.json();
		if (!res.ok) {
			console.error(`❌ Erreur updateStatus [${status}] :`, json.message);
			throw new Error(json.message);
		}
		console.log(`✅ Statut mis à jour pour participant #${participantId} (${status})`);
		return json;
	} catch (err) {
		console.error("❌ updateParticipantStatus - Exception :", err.message);
		throw err;
	}
}

/**
 * ✅ Supprimer un participant
 */
export async function removeParticipant(eventId, userId, token) {
	console.log(`🗑️ [DELETE] /events/${eventId}/participants/${userId}`);
	try {
		const res = await fetch(`${API_BASE_URL}/events/${eventId}/participants/${userId}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			credentials: 'include',
		});
		const json = await res.json();
		if (!res.ok) {
			console.error(`❌ Erreur suppression participant #${userId} :`, json.message);
			throw new Error(json.message);
		}
		console.log(`✅ Participant #${userId} retiré de l'événement #${eventId}`);
		return json;
	} catch (err) {
		console.error("❌ removeParticipant - Exception :", err.message);
		throw err;
	}
}

/**
 * ✅ [ADMIN] Récupérer les événements d’un utilisateur (historique admin)
 */
export async function getUserEventsAdmin(userId, token) {
	console.log(`📜 [GET] /users/${userId}/events`);
	try {
		const res = await fetch(`${API_BASE_URL}/users/${userId}/events`, {
			headers: { Authorization: `Bearer ${token}` },
			credentials: 'include',
		});
		const json = await res.json();
		if (!res.ok) {
			console.error(`❌ Erreur récupération événements user #${userId} :`, json.message);
			throw new Error(json.message);
		}
		console.log(`✅ ${json.length} événements récupérés pour l'utilisateur #${userId}`);
		return json;
	} catch (err) {
		console.error("❌ getUserEventsAdmin - Exception :", err.message);
		throw err;
	}
}