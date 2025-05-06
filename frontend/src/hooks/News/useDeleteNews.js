import { useState } from 'react';
import { deleteNews } from '../../services/newsService';

export default function useDeleteNews() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const remove = async (newsId, token) => {
        setLoading(true);
        setError(null);
        try {
            const result = await deleteNews(newsId, token);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { remove, loading, error };
}