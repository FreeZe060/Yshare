import { useState, useEffect, useCallback } from 'react';
import { getReplies } from '../../services/commentService';

function useReplies(commentId) {
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReplies = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getReplies(commentId);
            setReplies(data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [commentId]);

    useEffect(() => {
        if (commentId) fetchReplies();
    }, [commentId, fetchReplies]);

    return {
        replies,
        loading,
        error,
        fetchReplies,      
        refetchReplies: fetchReplies 
    };
}

export default useReplies;