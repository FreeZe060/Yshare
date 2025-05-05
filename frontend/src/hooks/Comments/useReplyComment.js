import { useState } from "react";
import { replyComment } from "../../services/commentService";
import { useAuth } from "../../config/authHeader";

function useReplyComment() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const reply = async (eventId, commentId, replyData) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await replyComment(eventId, commentId, replyData, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { reply, loading, error };
}

export default useReplyComment;