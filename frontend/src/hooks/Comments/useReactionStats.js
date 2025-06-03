import { useState, useEffect } from 'react';
import { getReactionStats } from '../../services/commentService';

export function useReactionStats(commentId, token) {
	const [stats, setStats] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchStats = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await getReactionStats(commentId, token);
				setStats(data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		if (commentId) fetchStats();
	}, [commentId, token]);

	return { stats, loading, error };
}