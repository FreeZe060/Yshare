const REACT_APP_API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Noter un événement (POST /ratings)
 * Attendu dans le body : { id_event, rating, message }
 */
export async function rateEvent(ratingData, token) {
	const response = await fetch(`${REACT_APP_API_BASE_URL}/ratings`, {
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
	const response = await fetch(`${REACT_APP_API_BASE_URL}/ratings/user/${userId}`, {
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
	const response = await fetch(`${REACT_APP_API_BASE_URL}/ratings/admin/all`, {
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
 * Récupérer la note moyenne d'un événement (GET /ratings/event/:eventId)
 */
export async function getEventAverageRating(eventId) {
	const response = await fetch(`${REACT_APP_API_BASE_URL}/ratings/event/${eventId}`, {
		method: "GET",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération de la note moyenne de l'événement");
	}

	return {
		avgRating: result.averageRating !== null ? parseFloat(result.averageRating) : null,
		ratings: result.ratings || []
	};
}

export async function getAllRatingsByUser(token) {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/ratings/mine`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la récupération de vos notes");
    }

    return result;
}

/**
 * Récupérer toutes les notes des événements créés par un organisateur spécifique
 * (GET /ratings/organizer/:userId)
 */
export async function getAllRatingsByOrganizer(userId, token) {
    const response = await fetch(`${REACT_APP_API_BASE_URL}/ratings/organizer/${userId}`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Erreur lors de la récupération des notes de l'organisateur");
    }

    return result;
}

/**
 * Supprimer une note (admin uniquement)
 */
export async function deleteRating(id, token) {
	const response = await fetch(`${REACT_APP_API_BASE_URL}/ratings/${id}`, {
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