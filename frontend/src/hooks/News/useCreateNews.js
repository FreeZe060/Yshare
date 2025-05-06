import { useState } from 'react';
import { createNews } from '../../services/newsService';

export default function useCreateNews() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const submitNews = async (formData, token) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const result = await createNews(formData, token);
            setSuccess(true);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { submitNews, loading, error, success };
}