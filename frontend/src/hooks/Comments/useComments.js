import { useState, useEffect, useCallback } from 'react';
import { getCommentsWithReplies } from "../../services/commentService";

function useComments(eventId) {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchComments = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getCommentsWithReplies(eventId);
			setComments(data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [eventId]);

	useEffect(() => {
		if (eventId) fetchComments();
	}, [eventId, fetchComments]);

	return { comments, loading, error, refetchComments: fetchComments };
}

export default useComments;