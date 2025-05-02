import { useState, useEffect } from "react";
import { getAllCommentsWithDetails } from "../../services/commentService";
import { useAuth } from "../../context/AuthContext";

function useAllComments() {
	const [comments, setComments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const fetchComments = async () => {
		if (!user?.token) return;

		try {
			setLoading(true);
			const data = await getAllCommentsWithDetails(user.token);
			setComments(data);
			setError(null);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchComments();
	}, [user?.token]);

	return { comments, loading, error, refetch: fetchComments };
}

export default useAllComments;