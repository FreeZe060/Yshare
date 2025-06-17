const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

/**
 * GET /news (public)
 */
export async function fetchAllNews() {
    const response = await fetch(`${API_BASE_URL}/news`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des actualités");
    return result;
}

/**
 * GET /news/event/:eventId (public)
 */
export async function fetchNewsByEvent(eventId) {
    const response = await fetch(`${API_BASE_URL}/news/event/${eventId}`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des actualités liées à l'événement");
    return result;
}

export async function fetchNewsWithDetails(newsId) {
    const response = await fetch(`${API_BASE_URL}/news/${newsId}/details`, {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération des détails de la news");
    return result;
}

/**
 * GET /news/my (requires auth)
 */
export async function fetchMyNews(token) {
    const response = await fetch(`${API_BASE_URL}/news/my`, {
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la récupération de vos actualités");
    return result;
}

/**
 * POST /news (requires auth + multipart/form-data)
 */
export async function createNews(formData, token) {
    const response = await fetch(`${API_BASE_URL}/news`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la création de l'actualité");
    return result;
}

/**
 * PUT /news/:newsId (requires auth + multipart/form-data)
 */
export async function updateNews(newsId, formData, token) {
    const response = await fetch(`${API_BASE_URL}/news/${newsId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la mise à jour de l'actualité");
    return result;
}

/**
 * DELETE /news/:newsId (requires auth)
 */
export async function deleteNews(newsId, token) {
    const response = await fetch(`${API_BASE_URL}/news/${newsId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression de l'actualité");
    return result;
}

export async function addCategoryToNews(newsId, categoryId, token) {
    const response = await fetch(`${API_BASE_URL}/news/${newsId}/category`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryId }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de l'ajout de la catégorie");
    return result;
}

export async function removeCategoryFromNews(newsId, categoryId, token) {
    const response = await fetch(`${API_BASE_URL}/news/${newsId}/category/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Erreur lors de la suppression de la catégorie");
    return result;
}