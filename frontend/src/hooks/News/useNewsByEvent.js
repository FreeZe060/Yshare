import { useEffect, useState } from 'react';
import { fetchNewsByEvent } from '../../services/newsService';

export default function useNewsByEvent(eventId) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!eventId) return;

        const loadNews = async () => {
            try {
                const result = await fetchNewsByEvent(eventId);
                setNews(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, [eventId]);

    return { news, loading, error };
}