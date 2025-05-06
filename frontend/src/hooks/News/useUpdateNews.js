import { useState } from 'react';
import { updateNews } from '../../services/newsService';

export default function useUpdateNews() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const update = async (newsId, formData, token) => {
        setLoading(true);
        setError(null);
        try {
            const result = await updateNews(newsId, formData, token);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { update, loading, error };
}