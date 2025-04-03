import { useState, useEffect } from "react";
import { getCommentsWithReplies } from "../../services/commentService";
import { useAuth } from "../../context/AuthContext";

function useComments(eventId) {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	useEffect(() => {
		if (!eventId || !user?.token) return;

		const fetchComments = async () => {
			setLoading(true);
			try {
				const data = await getCommentsWithReplies(eventId, user.token);
				setComments(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchComments();
	}, [eventId, user?.token]);

	return { comments, loading, error };
}

export default useComments;