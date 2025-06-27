const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Créer un signalement (POST /reports)
 * Attendu dans le body : { id_event, id_reported_user, id_comment, message }
 */
export async function createReport(reportData) {
	const response = await fetch(`${API_BASE_URL}/reports`, {
		method: "POST",
		credentials: "include",
		headers: {
			Authorization: `Bearer ${localStorage.getItem("token")}`, 
		},
		body: reportData,
	});

	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la création du signalement");
	}
	return result;
}

export async function getReports(token) {
	if (!token) return [];
	const response = await fetch(`${API_BASE_URL}/reports`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des signalements");
	}
	return result;
}

/**
 * Récupérer les détails complets d’un signalement (GET /reports/:reportId)
 */
export async function getReportDetails(reportId, token) {
	const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération du signalement");
	}
	return result;
}

/**
 * Récupérer tous les messages liés à un signalement (GET /reports/:reportId/messages)
 */
export async function getReportMessages(reportId, token) {
	const response = await fetch(`${API_BASE_URL}/reports/${reportId}/messages`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des messages");
	}
	return result;
}

/**
 * Répondre à un signalement (POST /reports/:reportId/reply)
 * Body attendu : { message }
 */
export async function replyToReport(reportId, message, token) {
	const response = await fetch(`${API_BASE_URL}/reports/${reportId}/reply`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ message }),
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de l'envoi de la réponse");
	}
	return result;
}

/**
 * Mettre à jour le statut d’un signalement (PUT /reports/:reportId/status)
 */
export async function updateReportStatus(reportId, status, token) {
	const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ status }),
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la mise à jour du signalement");
	}
	return result;
}