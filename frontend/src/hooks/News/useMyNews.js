import { useEffect, useState } from 'react';
import { fetchMyNews } from '../../services/newsService';

export default function useMyNews(token) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) return;

        const loadMyNews = async () => {
            try {
                const result = await fetchMyNews(token);
                setNews(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadMyNews();
    }, [token]);

    return { news, loading, error };
}