import { useEffect, useState } from 'react';
import { fetchAllNews } from '../../services/newsService';

export default function useAllNews() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadNews = async () => {
            try {
                const result = await fetchAllNews();
                setNews(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadNews();
    }, []);

    return { news, loading, error };
}