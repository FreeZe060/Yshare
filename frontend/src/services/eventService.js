const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * GET /events (public)
 */
export async function fetchEvents(filters = {}, page = 1, limit = 10) {
	const queryParams = new URLSearchParams();

	if (filters.title) queryParams.append('title', filters.title);
	if (filters.city) queryParams.append('city', filters.city);
	if (filters.date) queryParams.append('date', filters.date);
	if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
	if (filters.status) queryParams.append('status', filters.status); 
	if (filters.sort) queryParams.append('sort', filters.sort);      

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
export async function getCreatedEventsStats(userId) {
	if (!userId) throw new Error("Aucun utilisateur spécifié");

	const response = await fetch(`${API_BASE_URL}/users/${userId}/created-events`, {
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Événement non trouvé");

	return {
		count: result.count,
		events: result.events,
	};
}

export async function getTotalEventCount() {
	const response = await fetch(`${API_BASE_URL}/events-count`, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération du nombre d'événements");

	return result.total;
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

export async function updateEventStatus(eventId, newStatus, token) {
	console.log(`[updateEventStatus] 📤 Envoi de la mise à jour du statut :`, { eventId, newStatus });

	const response = await fetch(`${API_BASE_URL}/events/${eventId}/status`, {
		method: 'PATCH',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({ newStatus }),
	});

	const result = await response.json();

	if (!response.ok) {
		console.error(`[updateEventStatus] ❌ Erreur API :`, result);
		throw new Error(result.message || "Erreur lors de la mise à jour du statut de l'événement");
	}

	console.log(`[updateEventStatus] ✅ Statut mis à jour avec succès :`, result);
	return result;
}

/**
 * POST /events (multipart/form-data)
 */
export async function createEvent(eventData, token) {
	const formData = new FormData();
  
	for (const key in eventData) {
		if (key === 'images') {
		  eventData.images.forEach(img => formData.append('images', img.file));
		} else if (Array.isArray(eventData[key])) {
		  formData.append(key, JSON.stringify(eventData[key]));
		} else {
		  if (eventData[key] !== '') {
			formData.append(key, eventData[key]);
		  }
		}
	}	  
  
	console.log('📦 FormData envoyée :');
	for (let [key, value] of formData.entries()) {
	  console.log(`${key}:`, value);
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
  
	if (!response.ok) {
	  console.error('❌ Erreur backend :', result);
	  throw new Error(result.message || "Erreur lors de la création de l'événement");
	}
  
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

/**
 * GET /events/mine (requires auth)
 */

export async function fetchMyEvents(token) {
	const response = await fetch(`${API_BASE_URL}/events/mine`, {
		credentials: 'include',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des événements");
	return result;
}

export async function getDashboardStats(token) {
	const response = await fetch(`${API_BASE_URL}/admin/stats`, {
		method: 'GET',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`, 
		},
	});

	const result = await response.json();
	if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des statistiques");

	return result;
}