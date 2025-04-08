import { useState, useEffect } from "react";
import { getCommentsWithReplies } from "../../services/commentService";

function useComments(eventId) {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (!eventId) return;

		const fetchComments = async () => {
			setLoading(true);
			try {
				const data = await getCommentsWithReplies(eventId); // ✅ pas de token ici
				setComments(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchComments();
	}, [eventId]);

	return { comments, loading, error };
}

export default useComments;