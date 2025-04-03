import { useState } from "react";
import { deleteComment } from "../services/commentService";
import { useAuth } from "../context/AuthContext";

function useDeleteComment() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const remove = async (commentId) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await deleteComment(commentId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { remove, loading, error };
}

export default useDeleteComment;