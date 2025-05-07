import { useState, useEffect, useCallback } from 'react';
import { getReactions } from '../../services/commentService';

export function useReactions(commentId, token) {
	const [reactions, setReactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetch = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await getReactions(commentId, token);
			setReactions(data);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}, [commentId, token]);

	useEffect(() => {
		if (commentId) fetch();
	}, [commentId, fetch]);

	return { reactions, loading, error, refetchReactions: fetch };
}