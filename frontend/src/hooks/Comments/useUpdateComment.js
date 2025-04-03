import { useState } from "react";
import { updateComment } from "../services/commentService";
import { useAuth } from "../context/AuthContext";

function useUpdateComment() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const update = async (commentId, commentData) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await updateComment(commentId, commentData, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { update, loading, error };
}

export default useUpdateComment;