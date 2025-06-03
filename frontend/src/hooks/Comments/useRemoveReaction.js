import { useState, useCallback } from 'react';
import { removeReaction } from '../../services/commentService';

export function useRemoveReaction(token) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const remove = useCallback(async (commentId, emoji) => {
		setLoading(true);
		setError(null);
		try {
			const result = await removeReaction(commentId, emoji, token);
			return result;
		} catch (err) {
			setError(err);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [token]);

	return { removeReaction: remove, loading, error };
}