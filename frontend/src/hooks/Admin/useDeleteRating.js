import { useState } from "react";
import { deleteRating } from "../../services/ratingService";
import { useAuth } from "../../config/authHeader";

function useDeleteRating() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const remove = async (id) => {
		if (!user?.token) throw new Error("Utilisateur non autorisé");
		setLoading(true);
		setError(null);

		try {
			const result = await deleteRating(id, user.token);
			return result;
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { remove, loading, error };
}

export default useDeleteRating;