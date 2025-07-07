const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

export async function getCommentsWithReplies(eventId, token) {
	const response = await fetch(`${REACT_APP_API_BASE_URL}/events/${eventId}/comments`, {
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
	const response = await fetch(`${REACT_APP_API_BASE_URL}/events/${eventId}/comments`, {
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
	const response = await fetch(`${REACT_APP_API_BASE_URL}/comments/all`, {
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
	const response = await fetch(`${REACT_APP_API_BASE_URL}/events/${eventId}/comments/${commentId}/reply`, {
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
	const headers = {
		"Content-Type": "application/json",
		...(token ? { Authorization: `Bearer ${token}` } : {})
	};

	const response = await fetch(`${REACT_APP_API_BASE_URL}/users/${userId}/comments`, {
		credentials: "include",
		headers,
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des commentaires utilisateur");
	return result;
}

export async function updateComment(commentId, data, token) {
	const response = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}`, {
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
	const response = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	
	if (!response.ok) {
		const error = await response.json();
		console.error('[commentService] deleteComment error:', response.status, error);
		throw new Error(error.message || "Erreur lors de la suppression du commentaire");
	}
	
	const result = await response.json();
	console.log('[commentService] Commentaire supprimé:', result);
	return result;
}

export async function getCommentById(commentId, token) {
	console.log(`[commentService] getCommentById: fetch /comments/${commentId}`);
	const res = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}`, {
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();
	if (!res.ok) {
		console.error('[commentService] getCommentById error:', res.status, data);
		throw new Error(data.message || `Erreur récupération commentaire ${commentId}`);
	}
	console.log('[commentService] Commentaire reçu:', data);
	return data;
}

export async function getReplies(commentId, token) {
	console.log(`[commentService] getReplies: GET /comments/${commentId}/replies`);
	const res = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}/replies`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();
	if (!res.ok) {
		console.error('[commentService] getReplies error:', res.status, data);
		throw new Error(data.message || "Erreur lors de la récupération des réponses");
	}
	console.log('[commentService] Réponses récupérées:', data);
	return data;
}

export async function addReaction(commentId, emoji, token) {
	console.log(`[commentService] addReaction: POST /comments/${commentId}/reactions`, emoji);
	const res = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}/reactions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ emoji }),
	});
	const data = await res.json();
	if (!res.ok) {
		console.error('[commentService] addReaction error:', res.status, data);
		throw new Error(data.message || "Erreur lors de l'ajout de la réaction");
	}
	console.log('[commentService] Réaction ajoutée:', data);
	return data;
}

export async function removeReaction(commentId, emoji, token) {
	console.log(`[commentService] removeReaction: DELETE /comments/${commentId}/reactions?emoji=${emoji}`);
	const res = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}/reactions?emoji=${encodeURIComponent(emoji)}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();
	if (!res.ok) {
		console.error('[commentService] removeReaction error:', res.status, data);
		throw new Error(data.message || "Erreur lors de la suppression de la réaction");
	}
	console.log('[commentService] Réaction supprimée:', data);
	return data;
}

export async function getReactions(commentId, token) {
	console.log(`[commentService] getReactions: GET /comments/${commentId}/reactions`);
	const res = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}/reactions`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();
	if (!res.ok) {
		console.error('[commentService] getReactions error:', res.status, data);
		throw new Error(data.message || "Erreur lors de la récupération des réactions");
	}
	console.log('[commentService] Réactions récupérées:', data);
	return data;
}

export async function getReactionStats(commentId, token) {
	console.log(`[commentService] getReactionStats: GET /comments/${commentId}/reactions/stats`);
	const res = await fetch(`${REACT_APP_API_BASE_URL}/comments/${commentId}/reactions/stats`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const data = await res.json();
	if (!res.ok) {
		console.error('[commentService] getReactionStats error:', res.status, data);
		throw new Error(data.message || "Erreur lors de la récupération des stats de réactions");
	}
	console.log('[commentService] Stats des réactions:', data);
	return data;
}