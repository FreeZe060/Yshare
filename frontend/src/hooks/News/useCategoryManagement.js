import { useState } from 'react';
import { addCategoryToNews, removeCategoryFromNews } from '../../services/newsService';
import { useAuth } from '../../config/authHeader';

function useCategoryManagement(newsId) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleAdd = async (categoryId) => {
        setLoading(true);
        setError(null);
        try {
            await addCategoryToNews(newsId, categoryId, user.token);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (categoryId) => {
        setLoading(true);
        setError(null);
        try {
            await removeCategoryFromNews(newsId, categoryId, user.token);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        addCategory: handleAdd,
        removeCategory: handleRemove,
        loading,
        error,
    };
}

export default useCategoryManagement;