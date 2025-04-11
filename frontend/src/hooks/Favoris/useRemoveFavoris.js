import { useState } from "react";
import { removeFavoris } from "../../services/favorisService";
import { useAuth } from "../../config/authHeader";

function useRemoveFavoris() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const remove = async (eventId) => {
		if (!user?.token) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await removeFavoris(eventId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { remove, loading, error };
}

export default useRemoveFavoris;