const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * GET /notifications
 */
export async function getAllNotifications(token) {
	const response = await fetch(`${API_BASE_URL}/notifications`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des notifications");
	return result;
}

/**
 * GET /notifications/:notificationId
 */
export async function getNotificationById(notificationId, token) {
	const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération de la notification");
	return result;
}

export const markNotificationAsUnread = async (notificationId, token) => {
	const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/unread`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
		},
		credentials: "include",
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour de la notification (unread)");
	return result;
};

/**
 * PUT /notifications/:notificationId/read
 */
export async function markNotificationAsRead(notificationId, token) {
	const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour de la notification");
	return result;
}

/**
 * PUT /notifications/read-all
 */
export async function markAllNotificationsAsRead(token) {
	const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour des notifications");
	return result;
}

/**
 * DELETE /notifications/:notificationId
 */
export async function deleteNotification(notificationId, token) {
	const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression de la notification");
	return result;
}