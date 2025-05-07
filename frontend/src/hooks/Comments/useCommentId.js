import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../config/authHeader';
import { getCommentById } from '../../services/commentService';

function useCommentId(commentId) {
    const { user } = useAuth();
    const token = user?.token;

    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchComment = useCallback(async () => {
        if (!commentId || !token) return;
        setLoading(true);
        setError(null);
        console.log(`[useComment] fetching comment ${commentId}`);
        try {
            const data = await getCommentById(commentId, token);
            setComment(data);
            console.log('[useComment] comment set:', data);
        } catch (err) {
            console.error('[useComment] error fetching comment:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [commentId, token]);

    useEffect(() => {
        fetchComment();
    }, [fetchComment]);

    return { comment, loading, error, refetch: fetchComment };
}

export default useCommentId;  