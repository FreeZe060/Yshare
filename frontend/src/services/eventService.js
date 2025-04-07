const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * GET /events (public)
 */
export async function fetchEvents(filters = {}, page = 1, limit = 10) {
	const queryParams = new URLSearchParams();

	if (filters.title) queryParams.append('title', filters.title);
	if (filters.city) queryParams.append('city', filters.city);
	if (filters.date) queryParams.append('date', filters.date);
	if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);

	queryParams.append('page', page);
	queryParams.append('limit', limit);

	const response = await fetch(`${API_BASE_URL}/events?${queryParams}`, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
	});

	if (!response.ok) throw new Error("Erreur API");

	return await response.json();
}

/**
 * GET /events/created (requires auth)
 */
export async function getCreatedEvents(token) {
	const response = await fetch(`${API_BASE_URL}/events/created`, {
		credentials: 'include',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des événements créés");

	return result;
}

/**
 * GET /events/:id (public)
 */
export async function getEventById(eventId, token) {
	const headers = {
		...(token && { Authorization: `Bearer ${token}` }),
	};

	const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
		credentials: 'include',
		headers,
	});

	if (!response.ok) throw new Error("Erreur lors de la récupération de l'événement");

	return await response.json();
}

/**
 * POST /events (multipart/form-data)
 */
export async function createEvent(eventData, token) {
	const formData = new FormData();

	for (const key in eventData) {
		if (key === 'images') {
			eventData.images.forEach(file => formData.append('images', file));
		} else if (Array.isArray(eventData[key])) {
			formData.append(key, JSON.stringify(eventData[key]));
		} else {
			formData.append(key, eventData[key]);
		}
	}

	const response = await fetch(`${API_BASE_URL}/events`, {
		method: 'POST',
		credentials: 'include',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la création de l'événement");

	return result;
}

/**
 * PUT /events/:eventId (multipart/form-data)
 */
export async function updateEvent(eventId, eventData, token) {
	const formData = new FormData();

	for (const key in eventData) {
		if (key === 'images') {
			eventData.images.forEach(file => formData.append('images', file));
		} else if (Array.isArray(eventData[key])) {
			formData.append(key, JSON.stringify(eventData[key]));
		} else {
			formData.append(key, eventData[key]);
		}
	}

	const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
		method: 'PUT',
		credentials: 'include',
		headers: {
			Authorization: `Bearer ${token}`,
		},
		body: formData,
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour de l'événement");

	return result;
}

/**
 * DELETE /events/:eventId (requires auth)
 */
export async function deleteEvent(eventId, status = 'Annulé', token) {
	const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
		method: 'DELETE',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ status }),
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression de l'événement");

	return result;
}
