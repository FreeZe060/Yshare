import { useEffect, useState, useCallback } from 'react';
import { fetchAllNews } from '../../services/newsService';

export default function useAllNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadNews = useCallback(async () => {
        setLoading(true);
        try {
            const result = await fetchAllNews();
            setNews(result);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNews();
    }, [loadNews]);

    return { news, loading, error, refetch: loadNews };
}