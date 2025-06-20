import { useAuth } from '../../config/authHeader';
import { linkEventToNews } from '../../services/newsService';
import { useState } from 'react';

const useLinkEventToNews = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const link = async (newsId, eventId) => {
        setLoading(true);
        setError(null);
        try {
            const result = await linkEventToNews(newsId, eventId, token);
            return result;
        } catch (err) {
            setError(err.message || "Erreur inconnue");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { link, loading, error };
};

export default useLinkEventToNews;