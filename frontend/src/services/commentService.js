const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

export async function getCommentsWithReplies(eventId, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/comments`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des commentaires");
	return result;
}

export async function addComment(eventId, data, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/comments`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de l'ajout du commentaire");
	return result;
}

export async function getAllCommentsWithDetails(token) {
	const response = await fetch(`${API_BASE_URL}/comments/all`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des commentaires détaillés");
	return result;
}

export async function replyComment(eventId, commentId, data, token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}/comments/${commentId}/reply`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de l'envoi de la réponse");
	return result;
}

export async function getUserComments(userId, token) {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/comments`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des commentaires utilisateur");
    return result; 
}

export async function updateComment(commentId, data, token) {
	const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour du commentaire");
	return result;
}

export async function deleteComment(commentId, token) {
	const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression du commentaire");
	return result;
}