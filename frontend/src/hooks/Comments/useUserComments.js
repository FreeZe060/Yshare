import { useEffect, useState } from 'react';
import { getUserComments } from '../../services/commentService'; 

export function useUserComments(userId, token = null) {
    const [commentsData, setCommentsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!userId) return;

        const fetchComments = async () => {
            try {
                setLoading(true);
                const data = await getUserComments(userId, token);
                setCommentsData(data);
            } catch (err) {
                console.error("🔴 [useUserComments] Erreur:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [userId, token]);

    return { commentsData, loading, error };
}