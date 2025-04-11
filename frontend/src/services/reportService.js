const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

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

/**
 * Récupérer les signalements (GET /reports)
 */
export async function getReports(token) {
	const response = await fetch(`${API_BASE_URL}/reports`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		}
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des signalements");
	}
	return result;
}

/**
 * Mettre à jour le statut d'un signalement (PUT /reports/:reportId/status)
 * Le body doit contenir { status }
 */
export async function updateReportStatus(reportId, status, token) {
	const response = await fetch(`${API_BASE_URL}/reports/${reportId}/status`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`
		},
		body: JSON.stringify({ status })
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la mise à jour du signalement");
	}
	return result;
}