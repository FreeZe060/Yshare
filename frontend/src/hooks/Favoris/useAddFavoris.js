import { useState } from "react";
import { addFavoris } from "../../services/favorisService";
import { useAuth } from "../../config/authHeader";

function useAddFavoris() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { user } = useAuth();

	const add = async (eventId) => {
		if (!user?.id) throw new Error("Authentification requise");
		setLoading(true);
		setError(null);
		try {
			return await addFavoris(eventId, user.token);
		} catch (err) {
			setError(err.message);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { add, loading, error };
}

export default useAddFavoris;