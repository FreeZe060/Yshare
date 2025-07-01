const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * GET /categories
 */
export async function getAllCategories() {
	const response = await fetch(`${API_BASE_URL}/categories`, {
		headers: {
			"Content-Type": "application/json"
		},
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la récupération des catégories");
	}

	return result;
}


/**
 * POST /categories
 */
export async function createCategorie(data, token) {
	const response = await fetch(`${API_BASE_URL}/categories`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data), 
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la création de la catégorie");
	}
	return result;
}

/**
 * PUT /categories/:id
 */
export async function updateCategorie(id, data, token) {
	const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
		method: "PUT",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data), 
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la mise à jour de la catégorie");
	}
	return result;
}

/**
 * DELETE /categories/:id
 */
export async function deleteCategorie(id, token) {
	const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
		method: "DELETE",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
	});
	const result = await response.json();
	if (!response.ok) {
		throw new Error(result.message || "Erreur lors de la suppression de la catégorie");
	}
	return result;
}