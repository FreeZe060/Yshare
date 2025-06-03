import { useState, useEffect } from 'react';
import { updateNews, fetchNewsWithDetails } from '../../services/newsService';
import { useAuth } from '../../config/authHeader';

export default function useUpdateNews(newsId) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [news, setNews] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [accessLevel, setAccessLevel] = useState('public');

    const { user: currentUser } = useAuth();

    useEffect(() => {
        const fetchNewsDetails = async () => {
            if (!newsId || !currentUser) return;

            try {
                const data = await fetchNewsWithDetails(newsId);
                setNews(data);

                const userIsOwner = currentUser && data.user_id === currentUser.id;
                const userIsAdmin = currentUser?.role === 'Administrateur';

                setIsOwner(userIsOwner);
                setIsAdmin(userIsAdmin);
                setAccessLevel(userIsOwner || userIsAdmin ? 'private' : 'public');
            } catch (err) {
                setError('Impossible de récupérer les détails de la news.');
            }
        };

        fetchNewsDetails();
    }, [newsId, currentUser]);

    const update = async (formData) => {
        if (!isOwner && !isAdmin) {
            const msg = "Vous n'avez pas la permission de modifier cette actualité.";
            setError(msg);
            throw new Error(msg);
        }

        setLoading(true);
        setError(null);

        try {
            const result = await updateNews(newsId, formData, currentUser.token);
            return result;
        } catch (err) {
            setError(err.message || 'Erreur lors de la mise à jour.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        update,
        loading,
        error,
        isOwner,
        isAdmin,
        accessLevel,
        news,
    };
}