import { useState } from "react";
import { addComment } from "../../services/commentService";
import { useAuth } from "../../config/authHeader";

function useAddComment() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const add = async (eventId, commentData) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await addComment(eventId, commentData, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { add, loading, error };
}

export default useAddComment;